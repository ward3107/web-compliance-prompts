#!/usr/bin/env python3
"""Prepare the reviewed customer ZIP and listing metadata; never create a store or charge money."""
import argparse
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAME = 'web-compliance-developer-kit.zip'


def prepare(site, output):
    site, output = Path(site).resolve(), Path(output).resolve()
    source = site / NAME
    if source.is_symlink() or not source.is_file():
        raise ValueError('Use the regular ZIP from the public site builder')
    data = source.read_bytes()
    digest = hashlib.sha256(data).hexdigest()
    checksums = dict(line.split('  ', 1)[::-1] for line in (site / 'SHA256SUMS.txt').read_text().splitlines())
    if checksums.get(NAME) != digest:
        raise ValueError('Customer ZIP checksum mismatch')
    with zipfile.ZipFile(source) as archive:
        if archive.testzip():
            raise ValueError('Invalid customer ZIP')
        manifest = json.loads(archive.read('PACKAGE.json'))
        if manifest.get('product_id') != 'web-compliance-developer-kit':
            raise ValueError('Wrong product')
        if set(archive.namelist()) - {'PACKAGE.json'} != set(manifest['files']):
            raise ValueError('Incomplete package manifest')
        for name, expected in manifest['files'].items():
            parts = name.split('/')
            if name.startswith('/') or '\\' in name or any(part in ('', '.', '..') or ':' in part for part in parts):
                raise ValueError('Unsafe customer ZIP path')
            if hashlib.sha256(archive.read(name)).hexdigest() != expected:
                raise ValueError('Customer ZIP payload mismatch: ' + name)
    offer = json.loads((ROOT / 'products/developer-kit/offer.json').read_text())
    output.mkdir(parents=True, exist_ok=True)
    artifacts = {
        NAME: data,
        'SHA256SUMS.txt': (digest + '  ' + NAME + '\n').encode(),
        'lemon-squeezy-listing.json': (json.dumps({
            'name': offer['product_name'],
            'description': 'Downloadable AI-agent prompt skill, offline cookie-banner studio and WordPress/website export. Same MIT source and public package are also available free. No legal, audit or installation service.',
            'billing': 'single_payment', 'currency': 'USD', 'price_cents': 1900,
            'license_keys': False, 'tax_category_review': 'Select the accurate software/digital-download category in the store; verify before publishing.',
            'file': NAME, 'file_sha256': digest,
            'component_version': manifest['component_version'],
            'receipt_message': 'Thank you for supporting Web Compliance. Download and extract the kit, then open START-HERE.html. Retain the MIT notice. Connect and test real trackers on staging before deployment.',
            'status': 'prepared_locally_not_created_in_lemon_squeezy',
        }, indent=2) + '\n').encode(),
    }
    for name, contents in artifacts.items():
        destination = output / name
        if destination.is_symlink():
            raise ValueError('Refusing to replace a symlink')
        if destination.exists() and destination.read_bytes() != contents:
            raise ValueError('Preserve the previous delivery files; choose an empty output directory')
        destination.write_bytes(contents)
    return {'directory': str(output), 'file': NAME, 'sha256': digest, 'component_version': manifest['component_version']}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site', type=Path, default=ROOT / 'generated/site')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(prepare(args.site, args.output)))
