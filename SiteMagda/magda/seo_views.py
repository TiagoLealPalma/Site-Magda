from xml.sax.saxutils import escape

from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import cache_page
from django.views.decorators.http import require_GET

from . import seo
from .models import Property


def _page(request, page):
    return seo.normalise_path(page or '/')


@require_GET
@cache_page(120)
def meta_json(request):
    """What the React app applies to <head> when the route changes."""
    meta = seo.build_meta(request.GET.get('path', '/'), request)
    return JsonResponse(meta)


@require_GET
@cache_page(120)
def head_fragment(request, page=None):
    """Included into index.html by nginx (SSI) so the very first HTML response
    already carries the right title, description, canonical, hreflang, Open
    Graph and JSON-LD for this URL."""
    meta = seo.build_meta(_page(request, page), request)
    return HttpResponse(seo.render_head(meta), content_type='text/html; charset=utf-8')


@require_GET
@cache_page(120)
def body_fragment(request, page=None):
    """Included inside <noscript>: real, linked page content for crawlers and
    visitors without JavaScript."""
    return HttpResponse(seo.render_body(_page(request, page), request), content_type='text/html; charset=utf-8')


@require_GET
def robots_txt(request):
    base = seo.base_url(request)
    lines = [
        'User-agent: *',
        'Allow: /',
        # /api/ stays crawlable on purpose: the pages fetch their data from it
        # and Googlebot needs to render them. Its responses carry noindex.
        'Disallow: /backoffice',
        'Disallow: /admin/',
        '',
        f'Sitemap: {base}/sitemap.xml',
        '',
    ]
    return HttpResponse('\n'.join(lines), content_type='text/plain; charset=utf-8')


def _url_entry(alternates, images=()):
    parts = []
    for lang, href in alternates.items():
        alt = ''.join(
            f'<xhtml:link rel="alternate" hreflang="{seo.HREFLANG[code]}" href="{escape(target)}"/>'
            for code, target in alternates.items()
        ) + f'<xhtml:link rel="alternate" hreflang="x-default" href="{escape(alternates[seo.PT])}"/>'
        pics = ''.join(f'<image:image><image:loc>{escape(i)}</image:loc></image:image>' for i in images)
        parts.append(f'<url><loc>{escape(href)}</loc>{alt}{pics}</url>')
    return ''.join(parts)


@require_GET
@cache_page(600)
def sitemap_xml(request):
    base = seo.base_url(request)
    entries = []
    for kind in ('home', 'about', 'properties'):
        entries.append(_url_entry(seo.alternates_for(base, kind, None)))
    for prop in Property.objects.prefetch_related('images').order_by('id'):
        images = [seo.abs_media(base, i.image.url) for i in prop.images.all()]
        entries.append(_url_entry(seo.alternates_for(base, 'property', prop), images))
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
        'xmlns:xhtml="http://www.w3.org/1999/xhtml" '
        'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'
        + ''.join(entries)
        + '</urlset>'
    )
    return HttpResponse(xml, content_type='application/xml; charset=utf-8')
