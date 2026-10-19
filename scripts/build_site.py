#!/usr/bin/env python3
"""Build the static demo from canonical widget files and checked-in examples."""
import argparse
import json
import hashlib
import zipfile
import re
from pathlib import Path
from generate import required_variables, ISRAEL_DRAFTS, EU_OVERLAY, FLAG_KEYS
from packs import load_packs

ROOT = Path(__file__).resolve().parent.parent
CSP = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"
SKILL_ARCHIVES = {
    'web-compliance-skill.zip': 'web-compliance',
    'web-compliance-skill-claude.zip': '.claude/skills/web-compliance',
    'web-compliance-skill-cursor.zip': '.cursor/skills/web-compliance',
    'web-compliance-skill-copilot.zip': '.github/skills/web-compliance',
}


def write_archive(destination, contents):
    """Create a deterministic archive from explicit, reviewed file mappings."""
    with zipfile.ZipFile(destination, 'w', compression=zipfile.ZIP_DEFLATED) as package:
        for name, value in sorted(contents.items()):
            parts = name.split('/')
            if not name or name.startswith('/') or '\\' in name or any(p in ('', '.', '..') or ':' in p for p in parts):
                raise ValueError('Unsafe archive path: ' + name)
            info = zipfile.ZipInfo(name, date_time=(2026, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            package.writestr(info, value.encode('utf-8') if isinstance(value, str) else value)


def standalone_skill(files):
    """A skill must work after extraction, outside this repository."""
    prefix = 'skills/web-compliance/'
    result = {name.removeprefix(prefix): text for name, text in files.items()
              if name == prefix + 'SKILL.md' or any(name.startswith(prefix + part + '/')
              for part in ('templates', 'jurisdictions', 'references'))}
    result['LICENSE'] = files['LICENSE']
    return result


def public_files():
    """A reviewed allowlist, independent of git and of private local files."""
    names = json.loads((ROOT / 'scripts/public-files.json').read_text())
    files = {}
    for name in names:
        parts = Path(name).parts
        if not parts or Path(name).is_absolute() or any(p in ('.', '..') for p in parts) or '\\' in name:
            raise ValueError('Invalid public source path')
        source = ROOT / name
        if any(p.is_symlink() for p in (source, *source.parents)):
            raise ValueError('Symlink in public source: ' + name)
        files[name] = source.read_text(encoding='utf-8')
    return files


def secure_html(text):
    # GitHub Pages cannot configure response headers: this is a useful subset,
    # not a substitute for header-only controls such as frame-ancestors/HSTS.
    return text.replace('<meta charset="utf-8">', '<meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="' + CSP + '"><meta name="referrer" content="no-referrer">', 1)


def version_assets(text, version):
    """A new page must not combine fresh markup with cached scripts/styles."""
    return re.sub(r'(<(?:script|link|iframe)\b[^>]*?\b(?:src|href)=")([^"/?]+\.(?:js|css|html))(")',
                  lambda match: match[1] + match[2] + '?v=' + version + match[3], text)


def build(output):
    output = Path(output).resolve()
    # Never overwrite a source tree or an ancestor of the repository.
    if output == ROOT or output in ROOT.parents or output == ROOT / "docs" or output == ROOT / "widgets":
        raise ValueError("Choose a dedicated site output directory")
    if output.is_relative_to(ROOT) and output.relative_to(ROOT).parts[0] not in ("generated", "test-results"):
        raise ValueError("Use generated/ or test-results/ for output inside the repository")
    output.mkdir(parents=True, exist_ok=True)
    if any(p.is_symlink() for p in output.rglob('*')):
        raise ValueError('Symlink in site output')
    files = public_files()
    # The pack/template loaders also read source directories. Fail before
    # rendering if those directories contain an unreviewed build input.
    for directory, pattern in [('jurisdictions', '*.yaml'), ('templates', '*.md'), ('references', '*.md')]:
        for source in (ROOT / 'skills/web-compliance' / directory).glob(pattern):
            if source.relative_to(ROOT).as_posix() not in files:
                raise ValueError('Unlisted public build input: ' + source.name)
    site_files = {}
    for name, text in files.items():
        if name.startswith('docs/site/'):
            site_files[Path(name).name] = secure_html(text) if name.endswith('.html') else text
    for name in ("cookie-consent.js", "cookie-consent.css"):
        site_files[name] = files['widgets/cookie-consent/' + name]
    for name, text in files.items():
        for prefix, directory in [('examples/profiles/', 'profiles/'), ('docs/examples/', 'examples/')]:
            if name.startswith(prefix):
                site_files[directory + Path(name).name] = text
    expected_output = set(site_files) | set(SKILL_ARCHIVES) | {'.nojekyll', 'toolkit.json', 'web-compliance-studio.zip', 'web-compliance-mcp.zip', 'web-compliance-developer-kit.zip', 'SHA256SUMS.txt'}
    if any(p.is_file() and p.relative_to(output).as_posix() not in expected_output for p in output.rglob('*')):
        raise ValueError('Unexpected existing output file; use an empty dedicated directory')
    asset_version = hashlib.sha256(json.dumps(files, sort_keys=True).encode()).hexdigest()[:16]
    for name, text in site_files.items():
        destination = output / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(version_assets(text, asset_version) if name.endswith('.html') else text, encoding='utf-8')
    (output / ".nojekyll").touch()
    packs, errors, _ = load_packs()
    if errors:
        raise ValueError("Invalid packs: " + "; ".join(errors))
    templates = ROOT / "skills" / "web-compliance" / "templates"
    catalog = [{"id": p.stem, "required": required_variables(p.stem),
                "scope": "il" if p.stem in ISRAEL_DRAFTS else "il+eu" if p.stem in EU_OVERLAY else "all"}
               for p in sorted(templates.glob("*.md"))]
    payload = json.dumps({"files": files, "catalog": catalog,
        "packs": packs, "flags": sorted(FLAG_KEYS)}, ensure_ascii=False)
    (output / "toolkit.json").write_text(payload, encoding="utf-8")
    # A double-clickable distribution: no fetch(file://), local server, npm,
    # Python, CDN, or hosted account is required for end users.
    offline = dict(site_files)
    # Chromium treats different file:// documents as opaque origins. Explicitly
    # permit local preview frames in the portable build only; no network frames.
    for name in offline:
        if name.endswith('.html'):
            offline[name] = offline[name].replace("frame-src 'self'", 'frame-src file:')
            # Safari/WebKit restrict CSSOM access across local file origins.
            # Embed canonical local styles in portable pages, without allowing
            # remote resources or relaxing the script policy.
            offline[name] = re.sub(r'<link rel="stylesheet" href="([^"/]+\.css)">',
                lambda match: '<style>' + site_files[match.group(1)] + '</style>', offline[name])
    offline['toolkit-loader.js'] = 'window.ToolkitSource={load:function(){return Promise.resolve(' + payload.replace('<', '\\u003c').replace('\u2028', '\\u2028').replace('\u2029', '\\u2029') + ');}};\n'
    offline['START-HERE.html'] = offline['explore.html']
    offline['LICENSE'] = files['LICENSE']
    # A full kit cannot recursively contain its own archive. Make that one
    # download explicitly online in the portable studio; skill/MCP ZIPs are local.
    offline['developer.html'] = offline['developer.html'].replace('href="./"', 'href="START-HERE.html" data-ui-link').replace(
        'href="web-compliance-developer-kit.zip" download',
        'href="https://ward3107.github.io/web-compliance-prompts/web-compliance-developer-kit.zip" rel="noreferrer"').replace(
        'data-he="הורדת ערכת המפתחים">Download developer kit',
        'data-he="הורדת הערכה המלאה (דורשת אינטרנט)">Download full kit (internet required)').replace(
        'href="SHA256SUMS.txt" data-he="בדיקת תקינות ההורדות">Download checksums',
        'href="https://ward3107.github.io/web-compliance-prompts/SHA256SUMS.txt" data-he="בדיקת תקינות ההורדות (דורשת אינטרנט)">Download checksums (internet required)')
    skill_files = standalone_skill(files)
    archives = []
    for archive_name, prefix in SKILL_ARCHIVES.items():
        write_archive(output / archive_name, {prefix + '/' + name: text for name, text in skill_files.items()})
        # These are downloads, never fetched during normal studio use.
        offline[archive_name] = (output / archive_name).read_bytes()
        archives.append(archive_name)
    mcp_names = {'mcp/server.mjs', 'mcp/README.md', 'docs/site/install-kit.js',
                 'docs/site/themes.js', 'widgets/cookie-consent/cookie-consent.js',
                 'widgets/cookie-consent/cookie-consent.css',
                 'integrations/wordpress/web-compliance.php', 'LICENSE'}
    mcp_names.update(name for name in files if
                     name.startswith('skills/web-compliance/templates/') or
                     name.startswith('skills/web-compliance/jurisdictions/'))
    mcp_files = {name: files[name] for name in sorted(mcp_names)}
    mcp_files['START-HERE.md'] = files['mcp/README.md']
    for archive_name, contents in [('web-compliance-mcp.zip', mcp_files),
                                   ('web-compliance-studio.zip', offline)]:
        write_archive(output / archive_name, contents)
        archives.append(archive_name)
        if archive_name == 'web-compliance-mcp.zip':
            offline[archive_name] = (output / archive_name).read_bytes()
    kit = {
        'START-HERE.html': secure_html(files['docs/product/START-HERE.html']),
        'ACCEPTANCE.html': secure_html(files['docs/product/ACCEPTANCE.html']),
        'LICENSE': files['LICENSE'], 'CHANGELOG.md': files['CHANGELOG.md'],
        'downloads/web-compliance-mcp.zip': (output / 'web-compliance-mcp.zip').read_bytes(),
    }
    kit.update({'studio/' + name: text for name, text in offline.items()})
    kit.update({'skill/web-compliance/' + name: text for name, text in skill_files.items()})
    kit.update({'examples/' + name: text for name, text in site_files.items()
                if name.startswith(('profiles/', 'examples/'))})
    kit['PACKAGE.json'] = json.dumps({
        'product_id': 'web-compliance-developer-kit', 'format_version': '1.0.0',
        'component_version': json.loads(files['package.json'])['version'],
        'build_id': asset_version, 'license': 'MIT',
        'verification': {'host_installation_paths': 'vendor_documentation_checked_2026-10-19',
                         'authenticated_host_sessions': 'not_verified',
                         'customer_site_checks': 'not_tested',
                         'legal_review': 'pending',
                         'release_checks': 'See the exact source commit Actions results; this manifest is not a test report.'},
        'files': {name: hashlib.sha256(value.encode('utf-8') if isinstance(value, str) else value).hexdigest()
                  for name, value in sorted(kit.items())},
    }, ensure_ascii=False, indent=2) + '\n'
    write_archive(output / 'web-compliance-developer-kit.zip', kit)
    archives.append('web-compliance-developer-kit.zip')
    checksums = [hashlib.sha256((output / name).read_bytes()).hexdigest() + '  ' + name
                 for name in sorted(archives)]
    (output / 'SHA256SUMS.txt').write_text('\n'.join(checksums) + '\n')
    return output


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT / "generated" / "site")
    print(build(parser.parse_args().output))
