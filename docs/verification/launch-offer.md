# Launch offer — 20 October 2026

One proposed $19 USD one-time packaged developer kit combines the existing
skill, studio and WordPress export. Free source and the public ZIP stay visible;
the paid offer does not claim exclusive content or a new commercial-use license.
Pricing and draft purchase terms have English/Hebrew controls and work offline.

Local validation after the PR #48 lifecycle fixes: 47 Node tests and 46 Python
tests pass; pack validation and
reproducible example checks pass. All six packs still require legal review.
The delivery preparer checks the customer ZIP checksum and every manifest hash.

The browser workflow additionally exercises the pricing/terms pages, mobile
reflow, English/Hebrew, accessibility, pause controls and the actual customer
ZIP download in Chromium, Firefox and WebKit, online and offline. It covers the
configured offer and independent prelaunch, synthetic live and incomplete-live
fixtures. Both pages are checked in EN/HE at 320/390/768/1280px, including direct
Hebrew entry and language switching with an approved refund period different
from the proposed policy. No scenario visits checkout or charges money.
Use the exact commit's Actions results to establish whether those checks passed.
Local browser execution was attempted but the browser archive download was not
available in the workspace; browser validation is performed by the required
GitHub Actions workflow. Local unit results do not stand in for that workflow.

Live limitations: the store is not authenticated or verified here. Its approval,
seller/contact details, price/refund acceptance, real hosted URL, checkout and
live download remain owner/account steps. `offer.json` keeps all four readiness
flags false, seller/refund/contact fields empty and the purchase button disabled.
The source-state checks also accept a complete verified live offer, without
permanently requiring the present draft values. Both pages switch from proposed
to current terms only through that shared readiness state. Do not represent this release as
an active payment connection, legal certification or a completed paid sale.
