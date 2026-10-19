import hashlib
import json
import re
import sys
import tempfile
import unittest
import zipfile
from html.parser import HTMLParser
from urllib.parse import urlsplit
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from build_site import build, SKILL_ARCHIVES, write_archive
from validate import skill_metadata_errors


class SkillPackageTests(unittest.TestCase):
    def test_portable_frontmatter_rejects_the_actual_distribution_failures(self):
        valid = '---\nname: web-compliance\ndescription: Prepare a scoped prompt.\n---\nBody\n'
        self.assertEqual(skill_metadata_errors(valid, 'web-compliance'), [])
        for invalid in [valid.replace('Prepare a scoped prompt.', 'x' * 1025),
                        valid.replace('Prepare a scoped prompt.', "''"),
                        valid.replace('web-compliance', 'other-folder'),
                        valid.replace('web-compliance', 'Web_Compliance'),
                        'name: web-compliance\n', '---\n[]\n---\n']:
            with self.subTest(invalid=invalid[:70]):
                self.assertTrue(skill_metadata_errors(invalid, 'web-compliance'))

    def test_every_installer_contains_the_complete_same_skill(self):
        with tempfile.TemporaryDirectory() as directory:
            output = build(directory)
            checksums = dict(line.split('  ')[::-1] for line in (output / 'SHA256SUMS.txt').read_text().splitlines())
            for name, prefix in SKILL_ARCHIVES.items():
                with self.subTest(archive=name), zipfile.ZipFile(output / name) as archive:
                    self.assertIsNone(archive.testzip())
                    self.assertTrue(all(n.startswith(prefix + '/') for n in archive.namelist()))
                    skill = archive.read(prefix + '/SKILL.md').decode()
                    self.assertEqual(skill_metadata_errors(skill, 'web-compliance'), [])
                    self.assertEqual(skill, (ROOT / 'skills/web-compliance/SKILL.md').read_text())
                    self.assertEqual(len([n for n in archive.namelist() if '/templates/' in n and n.endswith('.md')]), 13)
                    self.assertEqual(len([n for n in archive.namelist() if '/jurisdictions/' in n and n.endswith('.yaml')]), 6)
                    self.assertIn(prefix + '/references/intake.md', archive.namelist())
                    self.assertEqual(archive.read(prefix + '/LICENSE'), (ROOT / 'LICENSE').read_bytes())
                    for resource in [n for n in archive.namelist() if n.endswith('.md')]:
                        for link in re.findall(r'\]\(([^)]+)\)', archive.read(resource).decode()):
                            if link.startswith(('https://', 'http://', '#', 'mailto:')):
                                continue
                            target = (Path(resource).parent / link.split('#', 1)[0]).as_posix()
                            self.assertIn(target, archive.namelist(), 'Nonportable skill reference: ' + link)
                self.assertEqual(hashlib.sha256((output / name).read_bytes()).hexdigest(), checksums[name])

    def test_kit_hashes_cover_every_payload_file_and_workflow_asset(self):
        with tempfile.TemporaryDirectory() as directory:
            output = build(directory)
            with zipfile.ZipFile(output / 'web-compliance-developer-kit.zip') as archive:
                self.assertIsNone(archive.testzip())
                manifest = json.loads(archive.read('PACKAGE.json'))
                self.assertEqual(set(archive.namelist()) - {'PACKAGE.json'}, set(manifest['files']))
                for name, expected in manifest['files'].items():
                    self.assertEqual(hashlib.sha256(archive.read(name)).hexdigest(), expected, name)
                for name in ['START-HERE.html', 'ACCEPTANCE.html', 'studio/START-HERE.html',
                             'studio/developer.html', 'studio/developer.css', 'skill/web-compliance/SKILL.md',
                             'downloads/web-compliance-mcp.zip', 'examples/profiles/eu-shop-en.json',
                             'examples/examples/eu-shop-en-cookie-banner.md']:
                    self.assertIn(name, archive.namelist())
                for name in SKILL_ARCHIVES:
                    self.assertEqual(archive.read('studio/' + name), (output / name).read_bytes())
                self.assertEqual(manifest['verification']['customer_site_checks'], 'not_tested')
                self.assertEqual(manifest['verification']['authenticated_host_sessions'], 'not_verified')
                self.assertEqual(manifest['verification']['legal_review'], 'pending')
                self.assertNotIn('products/developer-kit/offer.json', archive.namelist())
                self.assertFalse(any('review-web-compliance/' in name for name in archive.namelist()))
            with zipfile.ZipFile(output / 'web-compliance-studio.zip') as archive:
                self.assertIn('developer.html', archive.namelist())
                self.assertIn('web-compliance-mcp.zip', archive.namelist())
                for name in SKILL_ARCHIVES:
                    self.assertEqual(archive.read(name), (output / name).read_bytes())
                class Links(HTMLParser):
                    def __init__(self):
                        super().__init__()
                        self.hrefs = []
                    def handle_starttag(self, tag, attrs):
                        if tag == 'a':
                            self.hrefs += [value for name, value in attrs if name == 'href']
                links = Links()
                links.feed(archive.read('developer.html').decode())
                for href in links.hrefs:
                    parsed = urlsplit(href)
                    if not parsed.scheme and parsed.path:
                        self.assertIn(parsed.path, archive.namelist(), 'Broken offline installation link: ' + href)

    def test_archives_are_reproducible(self):
        with tempfile.TemporaryDirectory() as first, tempfile.TemporaryDirectory() as second:
            one, two = build(first), build(second)
            for name in [*SKILL_ARCHIVES, 'web-compliance-developer-kit.zip']:
                self.assertEqual((one / name).read_bytes(), (two / name).read_bytes(), name)

    def test_archive_paths_cannot_escape_the_extraction_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            for path in ['../private.txt', '/root.txt', 'a/../../bad', 'C:/secret', 'a\\b', 'a//b']:
                with self.subTest(path=path), self.assertRaisesRegex(ValueError, 'Unsafe archive path'):
                    write_archive(Path(directory) / 'bad.zip', {path: 'x'})

    def test_unlisted_skill_reference_is_not_silently_distributed(self):
        private = ROOT / 'skills/web-compliance/references/private-unlisted-test.md'
        try:
            private.write_text('Do not distribute this local content.')
            with tempfile.TemporaryDirectory() as directory:
                with self.assertRaisesRegex(ValueError, 'Unlisted public build input'):
                    build(directory)
        finally:
            private.unlink(missing_ok=True)


if __name__ == '__main__':
    unittest.main()
