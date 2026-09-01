# 🛒 E-Commerce Compliance — Deep Version

You are a senior frontend developer. Build a COMPLIANT E-COMMERCE
CHECKOUT FLOW meeting Israeli Consumer Protection Regulations
(Transactions via the Internet) 5771-2011.

== PROJECT INFO ==
Framework: [FRAMEWORK]
Shop name: [SHOP_NAME]
Products sold: [PRODUCTS_TYPE]
Payment processor: [PAYMENT_PROCESSOR]
Brand primary color: [BRAND_COLOR]
Contact email: [CONTACT_EMAIL]

== MANDATORY CHECKOUT STEPS ==

STEP 1 — PRODUCT PAGE
Price: ₪XX.XX including VAT (+ ₪X.XX VAT breakdown shown)
Shipping cost shown BEFORE user adds to cart
Accurate stock availability displayed

STEP 2 — CART
Itemized list: product name, quantity, unit price, subtotal
Subtotal + shipping + VAT breakdown + TOTAL (all in ₪)

STEP 3 — PRE-CHECKOUT SUMMARY (legally required in Israel)
Full order summary with ALL costs before payment page
Cancellation rights notice (plain language, short)
'I agree to Terms of Use and Refund Policy' checkbox — unchecked by default
'Confirm & Pay' button disabled until checkbox is ticked

STEP 4 — PAYMENT
Use [PAYMENT_PROCESSOR] hosted payment page
NEVER collect or store card numbers yourself (PCI-DSS violation)
Show SSL badge and 'Secure Payment' notice

STEP 5 — ORDER CONFIRMATION PAGE
Order number, date, items, total paid, estimated delivery

STEP 6 — ORDER CONFIRMATION EMAIL (legally required within 7 days)
Must contain: business name + address + contact email,
order number + date, items purchased, total with VAT,
cancellation rights, estimated delivery date

== LANGUAGE == [LANGUAGE] default (RTL if Hebrew/Arabic). English also available.
== OUTPUT ==
checkout-flow.html / React components per step
confirmation-email-template.html (standalone, inline CSS)

---
## ✅ Verification Checklist

- All prices show VAT-inclusive with breakdown
- Pre-checkout summary page present with full cost breakdown
- Terms checkbox unchecked by default and required before payment
- No card numbers collected or stored directly
- Order confirmation email includes all 6 legally required elements
- Cancellation rights stated in the confirmation email
- ⚠️ Use a payment processor licensed in Israel (PayPlus, CardCom, or Tranzila recommended)
