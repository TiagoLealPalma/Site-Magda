from django.test import TestCase, override_settings

from . import seo
from .models import Property


@override_settings(SITE_URL='https://example.test', ALLOWED_HOSTS=['testserver'])
class SeoTests(TestCase):
    def setUp(self):
        self.prop = Property.objects.create(
            name='Moradia com Vista para o Mar', name_en='Sea-view Villa', price=650000,
            description='Moradia renovada com vista sobre o oceano. Jardim privado.',
            address='Sintra, Lisboa', bedrooms=4, bathrooms=3, typology='T4', area=280,
            liquid_area=220, construction_date=2018,
        )

    def meta(self, path):
        return self.client.get('/api/seo/', {'path': path}).json()

    def test_home_has_both_languages_and_x_default(self):
        meta = self.meta('/')
        self.assertEqual(meta['canonical'], 'https://example.test/')
        self.assertEqual(meta['alternates']['en'], 'https://example.test/en')
        head = self.client.get('/_seo/head/').content.decode()
        self.assertIn('hreflang="x-default"', head)
        self.assertIn('application/ld+json', head)

    def test_english_property_uses_english_name_and_slug(self):
        meta = self.meta(f'/en/properties/{self.prop.id}-anything')
        self.assertEqual(meta['lang'], 'en')
        self.assertTrue(meta['canonical'].endswith(f'/en/properties/{self.prop.id}-sea-view-villa'))
        self.assertTrue(meta['title'].startswith('Sea-view Villa'))
        self.assertLessEqual(len(meta['description']), 158)

    def test_unknown_and_private_paths_are_noindex(self):
        for path in ('/nao-existe', '/imoveis/9999', '/backoffice/imoveis'):
            meta = self.meta(path)
            self.assertEqual(meta['robots'], seo.NOINDEX, path)
            self.assertIsNone(meta['canonical'], path)

    def test_listing_json_ld_has_offer(self):
        node = self.meta(f'/imoveis/{self.prop.id}')['jsonld'][0]
        self.assertEqual(node['@type'], 'RealEstateListing')
        self.assertEqual(node['offers']['price'], 650000)
        self.assertEqual(node['offers']['availability'], 'https://schema.org/InStock')

    def test_sitemap_lists_every_page_in_both_languages(self):
        body = self.client.get('/sitemap.xml').content.decode()
        for url in (
            'https://example.test/</loc>', 'https://example.test/en</loc>',
            'https://example.test/sobre</loc>', 'https://example.test/en/about</loc>',
            'https://example.test/imoveis</loc>', 'https://example.test/en/properties</loc>',
            f'https://example.test/imoveis/{self.prop.id}-moradia-com-vista-para-o-mar</loc>',
            f'https://example.test/en/properties/{self.prop.id}-sea-view-villa</loc>',
        ):
            self.assertIn(url, body)

    def test_robots_points_at_sitemap_and_blocks_private_areas(self):
        body = self.client.get('/robots.txt').content.decode()
        self.assertIn('Sitemap: https://example.test/sitemap.xml', body)
        self.assertIn('Disallow: /backoffice', body)
        self.assertNotIn('Disallow: /api', body)

    def test_noscript_body_links_listings_for_crawlers(self):
        body = self.client.get('/_seo/body/imoveis').content.decode()
        self.assertIn('<h1>Imóveis</h1>', body)
        self.assertIn(f'/imoveis/{self.prop.id}-moradia-com-vista-para-o-mar', body)
