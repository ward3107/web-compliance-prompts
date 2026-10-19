# Developer kit

The first packaged product is **Web Compliance Developer Kit**, for developers
and freelancers. It combines the existing prompt skill and banner toolkit. The
separate `review-web-compliance` reporting skill is a different product and is
not included. Source code and current public downloads remain free under MIT.

## Delivery

Run the normal public builder. It produces these deterministic, checksummed ZIPs:

| Archive | Contents |
|---|---|
| `web-compliance-developer-kit.zip` | Start page, standalone skill, offline studio, fictional examples, acceptance worksheet, optional MCP ZIP, license and file-hash manifest |
| `web-compliance-skill.zip` | Generic `web-compliance/` skill folder |
| `web-compliance-skill-claude.zip` | `.claude/skills/web-compliance/` |
| `web-compliance-skill-cursor.zip` | `.cursor/skills/web-compliance/` |
| `web-compliance-skill-copilot.zip` | `.github/skills/web-compliance/` |
| `web-compliance-studio.zip` | Offline browser studio, including local skill and MCP downloads |
| `web-compliance-mcp.zip` | Optional local MCP connection; Node.js 22+ |

The skill-only ZIPs contain all 13 templates, six source packs, the intake
reference and MIT notice. They contain no installer script, credentials or
project details. Extract the selected ZIP at the project root and verify skill
discovery in a host that supports Agent Skills. Back up any previous skill with
the same name before replacement. Avoid duplicate standalone/plugin installs.

The full kit opens with `START-HERE.html`, without a server. Its browser studio
keeps the existing double-click/offline behavior. External primary sources and
vendor documentation still need internet. The full-kit download link within
the portable studio is explicitly online to avoid a recursive archive.

## Host evidence and limits

Installation directories were checked against official vendor documentation on
19 October 2026:

- [Claude Code](https://code.claude.com/docs/en/skills)
- [Cursor](https://cursor.com/docs/skills)
- [GitHub Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills)
- [Agent Skills format](https://agentskills.io/specification)

Archive structure and resource completeness are tested. Authenticated sessions
in all three products have not been run here. Do not turn a documentation check
or a successful prompt trial into a claim of live host compatibility.

## Acceptance before client handoff

Use the blank worksheet in the ZIP. Identify the site's actual theme/plugins,
tag manager, analytics, advertising, embeds and relevant journeys. Test first
visit, rejection, granular choice, reload and withdrawal with network/storage
evidence on a staging copy. Record keyboard, screen-reader, mobile/zoom, RTL,
update, rollback and removal results. All worksheet entries start not tested.

The banner signals choices; it does not automatically block scripts from other
plugins. Document generation remains Hebrew and Israel-only. Every legal pack
still needs qualified review. Customer-site tests and legal review are not
implied by packaging or CI.

## Commercial listing draft

`products/developer-kit/offer.json` is a draft offer, not an active listing. It
records the proposed one-time download price separately from publication,
documents what is included/excluded and leaves unknown seller terms empty.

Before enabling a checkout, confirm support contact, inclusions, support/update
period and refund terms; activate the seller account and payout details; test
checkout and verify live delivery. Lemon Squeezy disables file downloads for
test-mode purchases, so test checkout alone is not proof of file delivery:
[test mode documentation](https://docs.lemonsqueezy.com/help/getting-started/test-mode).
Owner identity/payout setup and store approval are not implemented by this
repository. No active purchase button or invented support promise is shipped.

A paid listing must disclose the free MIT source and explain the packaged
value. This download contains software/instructions, not a personalized legal,
installation or audit service. Optional services need a separately defined offer
and a payment channel that supports those services.

## Updates

Offline/installed copies do not update themselves. Keep the component version,
review the changelog, back up settings/files and test replacement on staging.
The package manifest hashes payload files; it does not independently sign the
release or certify tests. Exact release evidence belongs to the source commit's
Actions results and verification notes.
