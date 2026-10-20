# Lemon Squeezy launch

Status: product offer and fail-closed hosted-checkout wiring prepared;
**no active checkout, authenticated store inspection or verified paid delivery**.
One $19 one-time packaged download is planned. Keep the same free MIT source
and public downloads visible. There is no monthly customer subscription and
no invented premium feature or agency-site restriction.

## Delivery and activation

Build the public site, then run:

```sh
python scripts/prepare_lemon_delivery.py --output generated/lemon-delivery
```

The preparer verifies the ZIP checksum and every manifest payload hash, copies
the exact customer ZIP and emits listing metadata. It does not create a product,
upload a file, accept terms, activate a store, charge a card or verify delivery.
Do not upload the listing JSON as customer content.

Complete the owner steps in
[`products/developer-kit/lemon-squeezy-listing.md`](../products/developer-kit/lemon-squeezy-listing.md).
The canonical offer is `products/developer-kit/offer.json`. Only selected public
fields are emitted as `checkout-config.js`. The purchase script requires a live
status, $19 USD one-time billing, private order-support email, an HTTPS Lemon
Squeezy hosted buy URL and four readiness flags. A null URL, a test status or an
incomplete gate leaves the button disabled. No query parameter enables checkout.

This is a hosted-link integration. The website never needs the store's API key,
card details or an embedded third-party script. Lemon Squeezy, when configured,
handles the checkout, purchase receipt and downloadable file. Returning to the
static site is not payment verification; no success page unlocks content.

## Offer proposed for owner approval

- $19 USD once for the current v2.8.0 download; applicable tax shown at checkout.
- Existing MIT rights, including commercial use, retained.
- Current package only; future updates and individual support are not promised.
- Community bug reports via GitHub; private purchase contact must be real and
  confirmed before launch. Never put receipts/card/customer details in issues.
- Proposed voluntary refunds: requests within 14 days, preserving applicable
  statutory rights and Lemon Squeezy terms. This is not yet an active promise.
- No personal consulting, installation or legal service sold through this offer.

## Fees checked 20 October 2026

[Official pricing](https://www.lemonsqueezy.com/pricing) states no monthly fee for
basic payment processing and a base 5% + $0.50 transaction fee.
[Official fees](https://docs.lemonsqueezy.com/help/getting-started/fees) add 1.5%
for buyers outside the US, 1.5% for PayPal payments and 0.5% for subscriptions.
These additions can stack. Platform fees use the total order, including tax.
Bank payouts outside the US cost 1% per payout; non-US PayPal payouts cost 3%,
capped at $30. Optional marketing features can add fees; none is enabled here.

For illustration, a $19 one-time US card order with no checkout tax leaves
$17.55 after the platform fee, or about $17.37 after allocating the 1% bank
payout fee. A non-US card order on the same no-tax assumptions leaves about
$17.09 after both fees. These are estimates before seller taxes, currency and
bank charges, refunds or other adjustments; actual rounding can differ.

[Supported countries](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
includes Israeli bank payouts. [Getting paid](https://docs.lemonsqueezy.com/help/getting-started/getting-paid)
specifies a $50 minimum payout, twice-monthly payout creation and a 13-day hold.
A single $19 sale does not by itself reach the payout threshold. This does not
describe or replace the seller's local accounting obligations.

## Official implementation references

- [Hosted checkout](https://docs.lemonsqueezy.com/help/checkout/hosted-checkout)
- [Adding products and file delivery](https://docs.lemonsqueezy.com/help/products/adding-products)
- [Store activation](https://docs.lemonsqueezy.com/help/getting-started/activate-your-store)
- [Test mode](https://docs.lemonsqueezy.com/help/getting-started/test-mode)
- [Refunds](https://docs.lemonsqueezy.com/help/payments/refunds-chargebacks)
- [Product eligibility](https://docs.lemonsqueezy.com/help/getting-started/prohibited-products)

The separate Agensi marketplace is not configured by this integration. Do not
automatically add its commission to Lemon Squeezy fees without checking the
actual channel and checkout arrangement.
