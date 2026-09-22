import json
import os

from django.test import TestCase, override_settings

from . import imaging, importer, seo
from .models import Image, Property


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


class ListingImporterTests(TestCase):
    """Exercises the parser against a small, synthetic stand-in for a
    kwportugal.pt property page (the same two structures the real page
    carries: a `self.__next_f.push([1, "..."])` chunk holding the property
    record, and a `RealEstateListing` JSON-LD block for the description) so
    the tests never depend on the real site being reachable or unchanged."""

    def build_html(self, property_extra='', description='Uma casa muito bonita.\n\nSegundo parágrafo.'):
        import json as json_module

        property_obj = {
            'idProperty': 999,
            'designation': 'Casa de Teste',
            'address': 'Rua das Flores',
            'locality': 'Vila Nova',
            'region1': 'Ilha de Teste',
            'region2': 'Concelho Teste',
            'price': 350000,
            'typology': 'T3',
            'rooms': 3,
            'bathrooms': 2,
            'livingArea': 120,
            'totalArea': 140,
            'constructionYear': 2010,
            'latitude': None,
            'longitude': None,
            'images': [
                {'order': 2, 'url': 'https://imgs.soukwportugal.pt/x/b.jpg'},
                {'order': 1, 'url': 'https://imgs.soukwportugal.pt/x/a.jpg'},
            ],
        }
        property_obj.update(property_extra)
        payload = {'property': property_obj}
        # Mimic how Next.js escapes the JSON when embedding it as a JS string
        # literal's contents: real double quotes and newlines become \" \n.
        escaped = json_module.dumps(payload, ensure_ascii=False, separators=(',', ':'))[1:-1].replace('"', '\\"')
        chunk = f'self.__next_f.push([1,"{escaped}"])'
        ldjson = json_module.dumps({
            '@context': 'https://schema.org',
            '@type': 'RealEstateListing',
            'description': description,
        }, ensure_ascii=False, separators=(',', ':'))
        return f'<html><body><script>{chunk}</script><script type="application/ld+json">{ldjson}</script></body></html>'

    def test_extracts_and_maps_fields(self):
        html = self.build_html()
        chunk = importer._extract_property_chunk(html)
        self.assertIsNotNone(chunk)
        text = importer._unescape_js_string(chunk)
        prop_json = importer._extract_balanced_object(text, 'property')
        data = json.loads(prop_json)
        self.assertEqual(data['designation'], 'Casa de Teste')
        self.assertEqual(importer._address(data), 'Vila Nova, Concelho Teste')
        # area = "Área Bruta" = totalArea; liquid_area = "Área útil" = livingArea.
        self.assertEqual(importer._num(data['totalArea']), 140)
        self.assertEqual(importer._num(data['livingArea']), 120)

    def test_images_come_back_in_declared_order(self):
        html = self.build_html()
        chunk = importer._extract_property_chunk(html)
        text = importer._unescape_js_string(chunk)
        data = json.loads(importer._extract_balanced_object(text, 'property'))
        images = sorted(data['images'], key=lambda im: im.get('order') or 0)
        self.assertEqual([im['url'] for im in images], [
            'https://imgs.soukwportugal.pt/x/a.jpg',
            'https://imgs.soukwportugal.pt/x/b.jpg',
        ])

    def test_description_comes_from_json_ld(self):
        html = self.build_html(description='Primeira frase. Segunda frase.')
        self.assertEqual(importer._extract_description(html), 'Primeira frase. Segunda frase.')

    def test_accented_text_survives_the_unescape_roundtrip(self):
        html = self.build_html(property_extra={'designation': 'Vivenda em São Roque do Pico — Excepção'})
        chunk = importer._extract_property_chunk(html)
        text = importer._unescape_js_string(chunk)
        data = json.loads(importer._extract_balanced_object(text, 'property'))
        self.assertEqual(data['designation'], 'Vivenda em São Roque do Pico — Excepção')

    def test_non_kw_urls_are_rejected(self):
        with self.assertRaises(importer.ListingImportError):
            importer._require_kw_url('https://example.com/imovel/1')

    def test_missing_property_chunk_is_reported_not_guessed(self):
        self.assertIsNone(importer._extract_property_chunk('<html><body>nada aqui</body></html>'))

    def test_build_draft_reports_a_clear_error_when_the_page_has_no_listing(self):
        original_fetch = importer._fetch
        importer._fetch = lambda url, max_bytes: (b'<html><body>nada aqui</body></html>', 'text/html')
        try:
            with self.assertRaises(importer.ListingImportError):
                importer.build_draft('https://www.kwportugal.pt/pt/Imovel/x')
        finally:
            importer._fetch = original_fetch


class ImportListingEndpointTests(TestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.user = User.objects.create_user('staffer', password='x', is_staff=True)
        self.client.force_login(self.user)

    def test_import_endpoint_returns_a_draft_without_creating_a_property(self):
        payload = {
            'property': {
                'idProperty': 1,
                'designation': 'Casa Importada',
                'address': 'Rua Nova',
                'locality': 'Vila Nova',
                'region2': 'Concelho Teste',
                'price': 200000,
                'typology': 'T2',
                'rooms': 2,
                'bathrooms': 1,
                'livingArea': 80,
                'totalArea': 90,
                'constructionYear': 0,
                'latitude': None,
                'longitude': None,
                'images': [{'order': 1, 'url': 'https://imgs.soukwportugal.pt/x/a.jpg'}],
            }
        }
        import json as json_module

        escaped = json_module.dumps(payload, ensure_ascii=False, separators=(',', ':'))[1:-1].replace('"', '\\"')
        chunk = f'self.__next_f.push([1,"{escaped}"])'
        ldjson = json_module.dumps(
            {'@context': 'https://schema.org', '@type': 'RealEstateListing', 'description': 'Uma bela casa.'},
            ensure_ascii=False,
        )
        html = f'<html><body><script>{chunk}</script><script type="application/ld+json">{ldjson}</script></body></html>'

        original_fetch = importer._fetch
        importer._fetch = lambda url, max_bytes: (html.encode('utf-8'), 'text/html')
        try:
            response = self.client.post(
                '/api/admin/properties/import/',
                {'url': 'https://www.kwportugal.pt/pt/Imovel/x'},
                content_type='application/json',
            )
        finally:
            importer._fetch = original_fetch

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['name'], 'Casa Importada')
        self.assertEqual(data['address'], 'Vila Nova, Concelho Teste')
        self.assertEqual(data['area'], 90)
        self.assertEqual(data['liquid_area'], 80)
        self.assertEqual(data['images'], ['https://imgs.soukwportugal.pt/x/a.jpg'])
        self.assertEqual(Property.objects.count(), 0)

    def test_import_endpoint_rejects_urls_outside_kwportugal(self):
        response = self.client.post(
            '/api/admin/properties/import/',
            {'url': 'https://example.com/imovel/1'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 422)

    def test_import_endpoint_requires_staff(self):
        self.client.logout()
        response = self.client.post(
            '/api/admin/properties/import/',
            {'url': 'https://www.kwportugal.pt/pt/Imovel/x'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)


class ImageOrderTests(TestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.user = User.objects.create_user('imgstaffer', password='x', is_staff=True)
        self.client.force_login(self.user)
        self.prop = Property.objects.create(
            name='Casa', description='desc', address='Rua X', typology='T2', area=100,
        )
        self.a = Image.objects.create(property=self.prop, image='property_images/a.jpg')
        self.b = Image.objects.create(property=self.prop, image='property_images/b.jpg')
        self.c = Image.objects.create(property=self.prop, image='property_images/c.jpg')

    def test_default_order_is_upload_order(self):
        ids = [img.id for img in self.prop.images.all()]
        self.assertEqual(ids, [self.a.id, self.b.id, self.c.id])

    def test_making_the_last_image_the_cover_reorders_the_rest(self):
        response = self.client.post(
            f'/api/admin/properties/{self.prop.id}/images/order/',
            {'image_ids': [self.c.id, self.a.id, self.b.id]},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        returned_ids = [row['id'] for row in response.json()]
        self.assertEqual(returned_ids, [self.c.id, self.a.id, self.b.id])
        ids = [img.id for img in self.prop.images.all()]
        self.assertEqual(ids, [self.c.id, self.a.id, self.b.id])

    def test_order_endpoint_requires_staff(self):
        self.client.logout()
        response = self.client.post(
            f'/api/admin/properties/{self.prop.id}/images/order/',
            {'image_ids': [self.a.id]},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 403)


class ImageCleanupAndCompressionTests(TestCase):
    def setUp(self):
        self.prop = Property.objects.create(
            name='Casa', description='desc', address='Rua X', typology='T2', area=100,
        )

    def _jpeg_bytes(self, size=(4000, 3000)):
        import io
        from PIL import Image as PILImage

        img = PILImage.new('RGB', size, color=(120, 60, 30))
        buf = io.BytesIO()
        img.save(buf, format='JPEG', quality=95)
        return buf.getvalue()

    def test_compress_image_shrinks_a_large_photo(self):
        from django.core.files.base import ContentFile

        raw = self._jpeg_bytes()
        content, filename = imaging.compress_image(raw, 'foto.HEIC')
        self.assertEqual(filename, 'foto.jpg')
        self.assertLess(content.size, len(raw))

        import io
        from PIL import Image as PILImage

        out = PILImage.open(io.BytesIO(content.read()))
        self.assertLessEqual(max(out.size), imaging.MAX_DIMENSION)

    def test_compress_image_falls_back_to_original_bytes_on_garbage_input(self):
        content, filename = imaging.compress_image(b'not actually an image', 'weird.bin')
        self.assertEqual(content.read(), b'not actually an image')
        self.assertEqual(filename, 'weird.bin')

    def test_deleting_an_image_removes_its_file_from_disk(self):
        from django.core.files.base import ContentFile

        image = Image(property=self.prop)
        image.image.save('t.jpg', ContentFile(self._jpeg_bytes((100, 100))), save=True)
        path = image.image.path
        self.assertTrue(os.path.exists(path))
        image.delete()
        self.assertFalse(os.path.exists(path))

    def test_deleting_a_property_removes_its_photos_from_disk(self):
        from django.core.files.base import ContentFile

        image = Image(property=self.prop)
        image.image.save('t2.jpg', ContentFile(self._jpeg_bytes((100, 100))), save=True)
        path = image.image.path
        self.prop.delete()
        self.assertFalse(os.path.exists(path))
