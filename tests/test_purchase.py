import hashlib
import json
import tempfile
import unittest
import zipfile
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_site import build
from prepare_lemon_delivery import prepare


class PurchaseTests(unittest.TestCase):
    def test_public_checkout_and_offline_copy_start_disabled(self):
        with tempfile.TemporaryDirectory() as directory:
            output = build(Path(directory) / 'site')
            script = (output / 'checkout-config.js').read_text()
            config = json.loads(script.removeprefix('window.WebComplianceCheckout=').strip().removesuffix(';'))
            self.assertIsNone(config['checkout_url'])
            self.assertFalse(any(config['readiness'].values()))
            self.assertNotIn('activation_business_description', config)
            with zipfile.ZipFile(output / 'web-compliance-studio.zip') as archive:
                self.assertEqual(archive.read('checkout-config.js').decode(), script)
                for name in ['pricing.html', 'purchase-terms.html', 'purchase.js', 'pricing.css']:
                    self.assertIn(name, archive.namelist())

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
