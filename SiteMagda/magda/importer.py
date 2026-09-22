"""Import a listing from Magda's own KW Portugal profile into a draft that
pre-fills the "Novo imóvel" form.

kwportugal.pt (Next.js) streams each property's full record to the browser as
a JSON blob embedded in a `self.__next_f.push([1, "..."])` call, alongside a
clean, human-written description in a `RealEstateListing` JSON-LD block. Both
are meant to be machine-read (search engines, in the JSON-LD's case) rather
than hidden, so parsing them here is reading the page the way it was already
publishing itself, not defeating any protection.

Deliberately narrow: only Magda's own agency site is supported (see
ALLOWED_HOSTS), fetched server-side with a plain HTTP client and a byte cap,
and nothing here ever executes page script.
"""
import json
import re
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

USER_AGENT = (
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    '(KHTML, like Gecko) Chrome/124.0 Safari/537.36'
)
ALLOWED_HOSTS = {'www.kwportugal.pt', 'kwportugal.pt'}
MAX_HTML_BYTES = 6 * 1024 * 1024
MAX_IMAGE_BYTES = 15 * 1024 * 1024
FETCH_TIMEOUT = 15
MAX_IMPORTED_IMAGES = 60

# KW's own translation strings (found in the same pages) confirm the mapping:
# "living_area": "Área útil", "total_area": "Área Bruta" — the opposite of
# what the field names might suggest at a glance.


class ListingImportError(Exception):
    """A problem understood well enough to explain to Magda in Portuguese."""


def _fetch(url, max_bytes):
    request = Request(url, headers={'User-Agent': USER_AGENT, 'Accept-Language': 'pt-PT,pt;q=0.9'})
    try:
        with urlopen(request, timeout=FETCH_TIMEOUT) as response:
            content_type = response.headers.get('Content-Type', '')
            body = response.read(max_bytes + 1)
    except HTTPError as exc:
        raise ListingImportError(f'O site respondeu com um erro ({exc.code}).') from exc
    except URLError as exc:
        raise ListingImportError('Não foi possível aceder a esse link.') from exc
    except TimeoutError as exc:
        raise ListingImportError('O site demorou demasiado tempo a responder.') from exc
    if len(body) > max_bytes:
        raise ListingImportError('A página é demasiado grande para importar.')
    return body, content_type


def _require_kw_url(url):
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https') or parsed.hostname not in ALLOWED_HOSTS:
        raise ListingImportError('Este importador só suporta links de kwportugal.pt, por agora.')


# The site's own language switcher changes nothing but the URL's first path
# segment (.../pt/Imovel/... <-> .../en/Imovel/...) and re-renders the same
# listing with genuinely translated copy, not machine-translated — a real
# English name and description live at that URL, not just a relabelled UI.
_LANGUAGES = ('pt', 'en')


def _url_for_language(url, lang):
    parsed = urlparse(url)
    parts = parsed.path.split('/', 2)
    if len(parts) < 3 or parts[1] not in _LANGUAGES:
        return None
    parts[1] = lang
    return parsed._replace(path='/'.join(parts)).geturl()


_PUSH_RE = re.compile(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)', re.S)
_LDJSON_RE = re.compile(r'<script type="application/ld\+json">(.*?)</script>', re.S)


def _extract_property_chunk(html):
    for match in _PUSH_RE.finditer(html):
        if 'idProperty' in match.group(1):
            return match.group(1)
    return None


def _unescape_js_string(raw):
    # `raw` is the *contents* of a JS string literal: UTF-8 text carrying JS
    # escapes (\", \n, \uXXXX). `unicode_escape` decodes those escapes but
    # assumes latin-1 input, so it mangles multi-byte UTF-8 sequences on the
    # way in; re-encoding as latin-1 and decoding as UTF-8 undoes that and
    # leaves accented text intact.
    return raw.encode('utf-8').decode('unicode_escape').encode('latin-1').decode('utf-8', errors='replace')


def _extract_balanced_object(text, key):
    """First `"key":{...}` in `text`, matched by brace depth (a regex can't
    safely find the matching close brace across nested objects and quoted
    strings that may themselves contain braces)."""
    marker = f'"{key}":{{'
    start = text.find(marker)
    if start == -1:
        return None
    start += len(marker) - 1  # the opening brace itself
    depth = 0
    in_string = False
    escaped = False
    for i in range(start, len(text)):
        ch = text[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == '\\':
                escaped = True
            elif ch == '"':
                in_string = False
            continue
        if ch == '"':
            in_string = True
        elif ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return text[start:i + 1]
    return None


def _extract_description(html):
    # The rich description lives only in the JSON-LD block: the streamed
    # property record references it indirectly (a React Server Components
    # chunk id), not as plain text.
    for match in _LDJSON_RE.finditer(html):
        try:
            data = json.loads(match.group(1))
        except ValueError:
            continue
        if data.get('@type') == 'RealEstateListing' and data.get('description'):
            return data['description'].strip()
    return ''


def _address(data):
    parts = [p for p in (data.get('locality'), data.get('region2')) if p]
    if parts:
        return ', '.join(dict.fromkeys(parts))
    return data.get('address') or data.get('region1') or ''


def _num(value):
    return value if isinstance(value, (int, float)) and value else None


def _fetch_property(url):
    """-> (property dict, raw html). Raises ListingImportError if the page
    doesn't carry a recognisable listing record."""
    html, _ = _fetch(url, MAX_HTML_BYTES)
    html = html.decode('utf-8', errors='replace')

    chunk = _extract_property_chunk(html)
    if not chunk:
        raise ListingImportError('Não encontrei os dados do imóvel nesta página.')
    text = _unescape_js_string(chunk)
    prop_json = _extract_balanced_object(text, 'property')
    if not prop_json:
        raise ListingImportError('Não encontrei os dados do imóvel nesta página.')
    try:
        data = json.loads(prop_json)
    except ValueError as exc:
        raise ListingImportError('Os dados do imóvel vieram num formato inesperado.') from exc
    return data, html


def build_draft(url):
    _require_kw_url(url)
    # Whatever language URL was pasted, the required fields always come from
    # the Portuguese page specifically — the model's name/description are PT.
    pt_url = _url_for_language(url, 'pt') or url
    data, html = _fetch_property(pt_url)

    images = sorted(data.get('images') or [], key=lambda im: im.get('order') or 0)
    image_urls = [im['url'] for im in images if im.get('url')]

    name_en, description_en = '', ''
    en_url = _url_for_language(url, 'en')
    if en_url and en_url != pt_url:
        try:
            en_data, en_html = _fetch_property(en_url)
            name_en = (en_data.get('designation') or '').strip()
            description_en = _extract_description(en_html)
        except ListingImportError:
            pass  # no English pair, or it didn't load — the PT draft still stands

    return {
        'source_url': url,
        'name': (data.get('designation') or '').strip(),
        'name_en': name_en,
        'description': _extract_description(html),
        'description_en': description_en,
        'address': _address(data),
        'price': _num(data.get('price')),
        'typology': data.get('typology') or '',
        'bedrooms': _num(data.get('rooms')),
        'bathrooms': _num(data.get('bathrooms')),
        'area': _num(data.get('totalArea')) or _num(data.get('livingArea')),
        'liquid_area': _num(data.get('livingArea')),
        'construction_date': _num(data.get('constructionYear')),
        'latitude': _num(data.get('latitude')),
        'longitude': _num(data.get('longitude')),
        'images': image_urls[:MAX_IMPORTED_IMAGES],
    }


def download_image(url):
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        raise ListingImportError('Endereço de imagem inválido.')
    body, content_type = _fetch(url, MAX_IMAGE_BYTES)
    if content_type and not content_type.startswith('image/'):
        raise ListingImportError('O endereço não é o de uma imagem.')
    return body


def image_filename(url):
    name = urlparse(url).path.rsplit('/', 1)[-1] or 'foto.jpg'
    return name if '.' in name else f'{name}.jpg'
