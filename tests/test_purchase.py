import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
import sys
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_site import build, public_files
from prepare_lemon_delivery import prepare


class PurchaseTests(unittest.TestCase):
    def assert_checkout_export(self, output, offer):
        script = (output / 'checkout-config.js').read_text()
        config = json.loads(script.removeprefix('window.WebComplianceCheckout=').strip().removesuffix(';'))
        for key in ('status', 'billing', 'currency', 'price_usd', 'checkout_url', 'support_email', 'seller_name', 'refund_terms', 'readiness'):
            self.assertEqual(config[key], offer.get(key), key)
        self.assertNotIn('activation_business_description', config)
        self.assertNotIn('proposed_refund_policy', config)
        with zipfile.ZipFile(output / 'web-compliance-studio.zip') as archive:
            self.assertEqual(archive.read('checkout-config.js').decode(), script)
            for name in ['pricing.html', 'purchase-terms.html', 'purchase.js', 'pricing.css']:
                self.assertIn(name, archive.namelist())
        with zipfile.ZipFile(output / 'web-compliance-developer-kit.zip') as archive:
            self.assertEqual(archive.read('studio/checkout-config.js').decode(), script)

    def test_public_checkout_and_offline_copy_match_configured_offer(self):
        with tempfile.TemporaryDirectory() as directory:
            output = build(Path(directory) / 'site')
            self.assert_checkout_export(output, json.loads((ROOT / 'products/developer-kit/offer.json').read_text()))

    def test_both_lifecycle_states_build_without_changing_source_offer(self):
        fixtures = json.loads((ROOT / 'tests/fixtures/purchase-offers.json').read_text())
        original = (ROOT / 'products/developer-kit/offer.json').read_bytes()
        for state, offer in fixtures.items():
            with self.subTest(state=state), tempfile.TemporaryDirectory() as directory:
                files = public_files()
                files['products/developer-kit/offer.json'] = json.dumps(offer)
                with patch('build_site.public_files', return_value=files):
                    output = build(Path(directory) / 'site')
                self.assert_checkout_export(output, offer)
        self.assertEqual((ROOT / 'products/developer-kit/offer.json').read_bytes(), original)

    def test_delivery_matches_the_verified_public_download(self):
        with tempfile.TemporaryDirectory() as directory:
            site = build(Path(directory) / 'site')
            delivery = Path(directory) / 'delivery'
            prepared = prepare(site, delivery)
            customer = delivery / prepared['file']
            self.assertEqual(customer.read_bytes(), (site / prepared['file']).read_bytes())
            self.assertEqual(hashlib.sha256(customer.read_bytes()).hexdigest(), prepared['sha256'])
            listing = json.loads((delivery / 'lemon-squeezy-listing.json').read_text())
            self.assertEqual(listing['price_cents'], 1900)
            self.assertFalse(listing['license_keys'])
            self.assertIn('available free', listing['description'])
            (site / prepared['file']).write_bytes(b'tampered')
            with self.assertRaisesRegex(ValueError, 'checksum'):
                prepare(site, Path(directory) / 'rejected')
