"""Search-engine metadata for every public page.

One source of truth: `resolve_page()` decides what a URL is, `build_meta()`
turns that into title / description / canonical / hreflang / Open Graph /
JSON-LD / a plain-HTML body for crawlers. The same dict feeds the <head>
nginx injects into the first HTML response (so bots and link previews see it
without running JavaScript), the JSON the React app applies on navigation,
and the sitemap.
"""
import json
import re
from html import escape

from django.conf import settings
from django.utils.text import slugify

from .models import Property

PT, EN = 'pt', 'en'
HREFLANG = {PT: 'pt-PT', EN: 'en'}
OG_LOCALE = {PT: 'pt_PT', EN: 'en_GB'}

PATHS = {
    'home': {PT: '/', EN: '/en'},
    'about': {PT: '/sobre', EN: '/en/about'},
    'properties': {PT: '/imoveis', EN: '/en/properties'},
}
PROPERTY_PREFIX = {PT: '/imoveis/', EN: '/en/properties/'}
PROPERTY_PATTERN = {
    PT: re.compile(r'^/imoveis/(\d+)(?:-[^/]*)?$'),
    EN: re.compile(r'^/en/properties/(\d+)(?:-[^/]*)?$'),
}

DEFAULT_OG_IMAGE = '/static/landingpage/og-image.jpg'
AGENT_PHOTO = '/static/landingpage/FotoMagda.png'
PHONE = '+351913503048'
SOCIALS = [
    'https://www.instagram.com/magdalealconsultora/',
    'https://www.facebook.com/magdalealconsultora',
    'https://www.linkedin.com/in/magdaleal/',
]
KW = {'@type': 'Organization', 'name': 'Keller Williams Portugal', 'url': 'https://www.kwportugal.pt'}

INDEX = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
NOINDEX = 'noindex,nofollow'

TEXT = {
    PT: {
        'site': 'Magda Leal',
        'home_title': 'Magda Leal | Consultora Imobiliária Keller Williams',
        'home_desc': 'Consultora imobiliária Keller Williams e engenheira civil. Compre, venda ou arrende com rigor técnico e acompanhamento próximo, da primeira visita à escritura.',
        'about_title': 'Sobre Magda Leal | Engenharia Civil e Imobiliário',
        'about_desc': 'Duas décadas de engenharia civil e mais de dez anos no imobiliário. Conheça a consultora Keller Williams que avalia a construção, o estado e o potencial real de cada imóvel.',
        'properties_title': 'Imóveis à venda em Portugal | Magda Leal',
        'properties_desc': 'Imóveis à venda selecionados por Magda Leal, consultora Keller Williams: preço, tipologia, áreas e ano de construção de cada imóvel.',
        'property_title': '{name} | {typology} em {address}',
        'property_desc': '{typology} com {area} m² em {address}, {price}. {excerpt}Com Magda Leal, consultora Keller Williams Portugal.',
        'notfound_title': 'Página não encontrada | Magda Leal',
        'private_title': 'Backoffice | Magda Leal',
        'crumb_home': 'Início',
        'crumb_properties': 'Imóveis',
        'crumb_about': 'Sobre',
        'h1_home': 'Encontre o seu novo lar connosco.',
        'p_home': 'Consultora imobiliária Keller Williams. Engenharia civil aplicada à procura da sua próxima casa.',
        'h1_about': 'Duas décadas a ler edifícios. Uma década a ler o mercado.',
        'p_about': 'Com mais de dez anos de experiência no mercado imobiliário e duas décadas de engenharia civil, ofereço um serviço de consultoria especializado a quem procura comprar, vender ou arrendar o seu próximo imóvel. Represento a Keller Williams Portugal, a maior rede imobiliária do mundo.',
        'h1_properties': 'Imóveis',
        'nav': 'Navegação',
        'labels': {'type': 'Tipologia', 'area': 'Área bruta', 'usable': 'Área útil', 'baths': 'Casas de banho', 'year': 'Ano', 'beds': 'Quartos', 'address': 'Localização'},
        'listing': 'Imóvel',
        'agent_desc': 'Consultora imobiliária Keller Williams Portugal e engenheira civil.',
    },
    EN: {
        'site': 'Magda Leal',
        'home_title': 'Magda Leal | Real Estate Consultant, Keller Williams Portugal',
        'home_desc': 'Keller Williams real estate consultant and civil engineer. Buy, sell or rent with technical rigour and close support, from the first viewing to the deed.',
        'about_title': 'About Magda Leal | Civil Engineer & Real Estate Consultant',
        'about_desc': 'Two decades of civil engineering and over ten years in real estate. Meet the Keller Williams consultant who assesses the construction, condition and real potential of every property.',
        'properties_title': 'Properties for sale in Portugal | Magda Leal',
        'properties_desc': 'Properties for sale selected by Magda Leal, Keller Williams consultant: price, type, areas and year built for every listing.',
        'property_title': '{name} | {typology} in {address}',
        'property_desc': '{typology} of {area} m² in {address}, {price}. {excerpt}With Magda Leal, Keller Williams Portugal consultant.',
        'notfound_title': 'Page not found | Magda Leal',
        'private_title': 'Backoffice | Magda Leal',
        'crumb_home': 'Home',
        'crumb_properties': 'Properties',
        'crumb_about': 'About',
        'h1_home': 'Find your new home with us.',
        'p_home': 'Keller Williams real estate consultant. Civil engineering applied to finding your next home.',
        'h1_about': 'Two decades reading buildings. A decade reading the market.',
        'p_about': 'With over ten years of experience in real estate and two decades of civil engineering, I offer a specialised consulting service to anyone looking to buy, sell or rent their next property. I represent Keller Williams Portugal, the largest real estate network in the world.',
        'h1_properties': 'Properties',
        'nav': 'Navigation',
        'labels': {'type': 'Type', 'area': 'Gross area', 'usable': 'Usable area', 'baths': 'Bathrooms', 'year': 'Year built', 'beds': 'Bedrooms', 'address': 'Location'},
        'listing': 'Property',
        'agent_desc': 'Keller Williams Portugal real estate consultant and civil engineer.',
    },
}


# ---------------------------------------------------------------- urls

def property_slug(prop, lang):
    name = prop.name_en if lang == EN and prop.name_en else prop.name
    slug = slugify(name)[:60].strip('-')
    return f'{prop.id}-{slug}' if slug else str(prop.id)


def property_path(prop, lang):
    return f'{PROPERTY_PREFIX[lang]}{property_slug(prop, lang)}'


def base_url(request):
    site = getattr(settings, 'SITE_URL', '')
    if site:
        return site.rstrip('/')
    return request.build_absolute_uri('/').rstrip('/')


def normalise_path(path):
    path = (path or '/').split('?')[0].split('#')[0]
    if not path.startswith('/'):
        path = '/' + path
    return path.rstrip('/') or '/'


def lang_of(path):
    return EN if path == '/en' or path.startswith('/en/') else PT


def resolve_page(path):
    """-> (kind, lang, property_or_None). kind: home|about|properties|property|notfound|private"""
    path = normalise_path(path)
    lang = lang_of(path)
    if path.startswith('/backoffice') or path.startswith('/admin'):
        return 'private', PT, None
    for kind, by_lang in PATHS.items():
        if path == by_lang[lang]:
            return kind, lang, None
    match = PROPERTY_PATTERN[lang].match(path)
    if match:
        prop = Property.objects.prefetch_related('images').filter(id=int(match.group(1))).first()
        if prop:
            return 'property', lang, prop
    return 'notfound', lang, None


# ---------------------------------------------------------------- copy

def fmt_price(value, lang):
    if value is None:
        return ''
    n = int(value)
    if lang == EN:
        return f'€{n:,}'
    return f'{n:,}'.replace(',', '.') + ' €'


def clip(text, limit):
    text = re.sub(r'\s+', ' ', (text or '')).strip()
    if len(text) <= limit:
        return text
    return text[: limit - 1].rsplit(' ', 1)[0].rstrip(',.;: ') + '…'


def first_sentence(text, limit=90):
    text = re.sub(r'\s+', ' ', (text or '')).strip()
    if not text:
        return ''
    sentence = re.split(r'(?<=[.!?])\s', text, maxsplit=1)[0]
    return clip(sentence, limit)


def property_copy(prop, lang):
    t = TEXT[lang]
    name = prop.name_en if lang == EN and prop.name_en else prop.name
    typology = (prop.typology or '').strip() or t['listing']
    address = prop.address
    title = clip(t['property_title'].format(name=name, typology=typology, address=address), 68)
    excerpt = ''
    if lang == PT and prop.description:
        sentence = first_sentence(prop.description, 70)
        excerpt = sentence + ('' if sentence.endswith(('.', '!', '?', '…')) else '.') + ' '
    price = fmt_price(prop.price, lang) or '—'

    def describe(extra):
        return t['property_desc'].format(
            typology=typology, area=prop.area, address=address, price=price, excerpt=extra,
        )

    # Keep the brand tail and drop the description excerpt before ever
    # truncating: a snippet that ends mid-brand reads worse than a shorter one.
    desc = describe(excerpt)
    if len(desc) > 158:
        desc = describe('')
    return name, title, clip(desc, 158)


# ---------------------------------------------------------------- graph

def abs_media(base, url):
    return url if url.startswith('http') else f'{base}{url}'


def agent_node(base, lang):
    return {
        '@type': 'RealEstateAgent',
        '@id': f'{base}/#agent',
        'name': 'Magda Leal',
        'url': f'{base}/',
        'image': f'{base}{AGENT_PHOTO}',
        'telephone': PHONE,
        'description': TEXT[lang]['agent_desc'],
        'sameAs': SOCIALS,
        'parentOrganization': KW,
        'areaServed': {'@type': 'Country', 'name': 'Portugal'},
    }


def breadcrumbs(base, lang, trail):
    return {
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'name': name, 'item': f'{base}{path}'}
            for i, (name, path) in enumerate(trail)
        ],
    }


def listing_node(base, prop, lang):
    name, _, desc = property_copy(prop, lang)
    url = f'{base}{property_path(prop, lang)}'
    node = {
        '@type': 'RealEstateListing',
        '@id': f'{url}#listing',
        'name': name,
        'url': url,
        'description': clip(prop.description, 300) or desc,
        'inLanguage': HREFLANG[PT],
        'address': {'@type': 'PostalAddress', 'streetAddress': prop.address, 'addressCountry': 'PT'},
        'floorSize': {'@type': 'QuantitativeValue', 'value': prop.area, 'unitCode': 'MTK'},
        'provider': {'@id': f'{base}/#agent'},
    }
    images = [abs_media(base, i.image.url) for i in prop.images.all()]
    if images:
        node['image'] = images
    if prop.bedrooms is not None:
        node['numberOfRooms'] = prop.bedrooms
    if prop.bathrooms is not None:
        node['numberOfBathroomsTotal'] = prop.bathrooms
    if prop.construction_date:
        node['yearBuilt'] = prop.construction_date
    if prop.price is not None:
        offer = {'@type': 'Offer', 'price': int(prop.price), 'priceCurrency': 'EUR', 'url': url}
        if prop.status == Property.STATUS_AVAILABLE:
            offer['availability'] = 'https://schema.org/InStock'
        elif prop.status == Property.STATUS_COMING_SOON:
            offer['availability'] = 'https://schema.org/PreOrder'
        node['offers'] = offer
    return node


def alternates_for(base, kind, prop):
    if kind == 'property':
        return {lang: f'{base}{property_path(prop, lang)}' for lang in (PT, EN)}
    return {lang: f'{base}{PATHS[kind][lang]}' for lang in (PT, EN)}


# ---------------------------------------------------------------- meta

def build_meta(path, request):
    base = base_url(request)
    kind, lang, prop = resolve_page(path)
    t = TEXT[lang]
    meta = {
        'kind': kind,
        'lang': lang,
        'robots': INDEX,
        'og_type': 'website',
        'og_image': f'{base}{DEFAULT_OG_IMAGE}',
        'alternates': {},
        'canonical': None,
        'jsonld': [],
    }

    if kind in ('private', 'notfound'):
        meta.update(
            title=t['private_title'] if kind == 'private' else t['notfound_title'],
            description='',
            robots=NOINDEX,
            canonical=None,
        )
        return meta

    meta['alternates'] = alternates_for(base, kind, prop)
    meta['canonical'] = meta['alternates'][lang]
    home = (t['crumb_home'], PATHS['home'][lang])

    if kind == 'home':
        meta.update(title=t['home_title'], description=t['home_desc'])
        meta['jsonld'] = [
            {'@type': 'WebSite', '@id': f'{base}/#website', 'url': f'{base}/', 'name': t['site'], 'inLanguage': [HREFLANG[PT], HREFLANG[EN]], 'publisher': {'@id': f'{base}/#agent'}},
            agent_node(base, lang),
        ]
    elif kind == 'about':
        meta.update(title=t['about_title'], description=t['about_desc'], og_image=f'{base}{AGENT_PHOTO}')
        meta['jsonld'] = [
            {'@type': 'AboutPage', 'url': meta['canonical'], 'name': t['about_title'], 'inLanguage': HREFLANG[lang], 'about': {'@id': f'{base}/#agent'}},
            agent_node(base, lang),
            breadcrumbs(base, lang, [home, (t['crumb_about'], PATHS['about'][lang])]),
        ]
    elif kind == 'properties':
        meta.update(title=t['properties_title'], description=t['properties_desc'])
        props = list(Property.objects.prefetch_related('images').order_by('-id'))
        meta['jsonld'] = [
            {
                '@type': 'CollectionPage', 'url': meta['canonical'], 'name': t['properties_title'], 'inLanguage': HREFLANG[lang],
                'mainEntity': {
                    '@type': 'ItemList',
                    'itemListElement': [
                        {'@type': 'ListItem', 'position': i + 1, 'url': f'{base}{property_path(p, lang)}'}
                        for i, p in enumerate(props)
                    ],
                },
            },
            breadcrumbs(base, lang, [home, (t['crumb_properties'], PATHS['properties'][lang])]),
        ]
    elif kind == 'property':
        name, title, desc = property_copy(prop, lang)
        first = prop.images.first()
        meta.update(
            title=title, description=desc,
            og_image=abs_media(base, first.image.url) if first else f'{base}{DEFAULT_OG_IMAGE}',
        )
        meta['jsonld'] = [
            listing_node(base, prop, lang),
            agent_node(base, lang),
            breadcrumbs(base, lang, [home, (t['crumb_properties'], PATHS['properties'][lang]), (name, property_path(prop, lang))]),
        ]

    meta['title'] = clip(meta['title'], 70)
    return meta


# ---------------------------------------------------------------- render

def render_head(meta):
    """The <head> tags for a page, as an HTML fragment (nginx SSI include)."""
    out = [f'<title data-seo>{escape(meta["title"])}</title>']
    if meta.get('description'):
        out.append(f'<meta name="description" content="{escape(meta["description"], quote=True)}" data-seo>')
    out.append(f'<meta name="robots" content="{meta["robots"]}" data-seo>')
    if meta.get('canonical'):
        out.append(f'<link rel="canonical" href="{escape(meta["canonical"], quote=True)}" data-seo>')
    for lang, href in meta['alternates'].items():
        out.append(f'<link rel="alternate" hreflang="{HREFLANG[lang]}" href="{escape(href, quote=True)}" data-seo>')
    if meta['alternates']:
        out.append(f'<link rel="alternate" hreflang="x-default" href="{escape(meta["alternates"][PT], quote=True)}" data-seo>')
    if meta['robots'] == INDEX:
        og = {
            'og:type': meta['og_type'], 'og:site_name': 'Magda Leal', 'og:title': meta['title'],
            'og:description': meta['description'], 'og:url': meta['canonical'], 'og:image': meta['og_image'],
            'og:locale': OG_LOCALE[meta['lang']],
        }
        for prop_name, value in og.items():
            out.append(f'<meta property="{prop_name}" content="{escape(value or "", quote=True)}" data-seo>')
        other = EN if meta['lang'] == PT else PT
        out.append(f'<meta property="og:locale:alternate" content="{OG_LOCALE[other]}" data-seo>')
        for name, value in {'twitter:card': 'summary_large_image', 'twitter:title': meta['title'], 'twitter:description': meta['description'], 'twitter:image': meta['og_image']}.items():
            out.append(f'<meta name="{name}" content="{escape(value, quote=True)}" data-seo>')
    if meta['jsonld']:
        graph = json.dumps({'@context': 'https://schema.org', '@graph': meta['jsonld']}, ensure_ascii=False)
        out.append(f'<script type="application/ld+json" data-seo>{graph.replace("</", "<\\/")}</script>')
    return '\n    '.join(out)


def render_body(path, request):
    """Plain, crawlable page content for visitors and bots without JavaScript."""
    base = base_url(request)
    kind, lang, prop = resolve_page(path)
    t = TEXT[lang]
    if kind in ('private', 'notfound'):
        return ''
    nav = ''.join(
        f'<li><a href="{PATHS[name][lang]}">{escape(label)}</a></li>'
        for name, label in (('home', t['crumb_home']), ('about', t['crumb_about']), ('properties', t['crumb_properties']))
    )
    other = EN if lang == PT else PT
    other_path = alternates_for(base, kind, prop)[other][len(base):]
    switch = f'<a href="{other_path}" hreflang="{HREFLANG[other]}">{HREFLANG[other].split("-")[0].upper()}</a>'
    head = f'<header><a href="{PATHS["home"][lang]}">Magda Leal</a><nav aria-label="{t["nav"]}"><ul>{nav}</ul></nav>{switch}</header>'
    body = ''
    if kind == 'home':
        body = f'<h1>{escape(t["h1_home"])}</h1><p>{escape(t["p_home"])}</p>{property_list(lang)}'
    elif kind == 'about':
        body = f'<h1>{escape(t["h1_about"])}</h1><p>{escape(t["p_about"])}</p>'
    elif kind == 'properties':
        body = f'<h1>{escape(t["h1_properties"])}</h1>{property_list(lang)}'
    elif kind == 'property':
        name, _, _ = property_copy(prop, lang)
        labels = t['labels']
        rows = [(labels['type'], prop.typology), (labels['area'], f'{prop.area} m²'), (labels['address'], prop.address)]
        if prop.liquid_area:
            rows.append((labels['usable'], f'{prop.liquid_area} m²'))
        if prop.bedrooms is not None:
            rows.append((labels['beds'], prop.bedrooms))
        if prop.bathrooms is not None:
            rows.append((labels['baths'], prop.bathrooms))
        if prop.construction_date:
            rows.append((labels['year'], prop.construction_date))
        dl = ''.join(f'<dt>{escape(str(k))}</dt><dd>{escape(str(v))}</dd>' for k, v in rows)
        img = prop.images.first()
        picture = f'<img src="{escape(abs_media(base, img.image.url), quote=True)}" alt="{escape(name, quote=True)}">' if img else ''
        body = (
            f'<h1>{escape(name)}</h1><p>{escape(fmt_price(prop.price, lang))}</p>{picture}'
            f'<dl>{dl}</dl><p lang="pt">{escape(prop.description)}</p>'
        )
    return f'{head}<main>{body}</main>'


def property_list(lang):
    items = ''.join(
        f'<li><a href="{property_path(p, lang)}">{escape(p.name_en if lang == EN and p.name_en else p.name)}</a>'
        f' — {escape(p.address)} — {escape(fmt_price(p.price, lang))}</li>'
        for p in Property.objects.order_by('-id')
    )
    return f'<ul>{items}</ul>' if items else ''
