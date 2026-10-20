const test=require('node:test');
const assert=require('node:assert/strict');
const {checkoutState}=require('../docs/site/purchase.js');
const ready=()=>({status:'live',billing:'one_time_download',currency:'USD',price_usd:19,support_email:'support@example.com',checkout_url:'https://example.lemonsqueezy.com/buy/550e8400-e29b-41d4-a716-446655440000',readiness:{store_approved:true,seller_terms_confirmed:true,checkout_tested:true,live_delivery_verified:true}});
test('real launch configuration is closed until store and delivery are verified',()=>{
  const offer=require('../products/developer-kit/offer.json');
  assert.equal(checkoutState(offer).ready,false);
  assert.equal(offer.checkout_url,null);
  assert.equal(offer.price_usd,19);
});
test('only a complete one-time launch configuration can expose hosted checkout',()=>{
  const offer=ready();assert.equal(checkoutState(offer).url,offer.checkout_url);
  for(const field of Object.keys(offer.readiness)){
    const incomplete=ready();incomplete.readiness[field]=false;
    assert.equal(checkoutState(incomplete).ready,false,field);
  }
  for(const patch of [{status:'test'},{currency:'ILS'},{price_usd:49},{billing:'subscription'},{support_email:null},{readiness:{}}])assert.equal(checkoutState({...ready(),...patch}).ready,false);
});
test('checkout configuration cannot redirect to an arbitrary or disguised destination',()=>{
  for(const checkout_url of ['javascript:alert(1)','http://example.lemonsqueezy.com/buy/id','https://example.lemonsqueezy.com.evil.example/buy/id','https://lemonsqueezy.com@evil.example/buy/id','https://user:secret@example.lemonsqueezy.com/buy/id','https://example.lemonsqueezy.com:444/buy/id','https://example.lemonsqueezy.com/buy/id?test=1','https://example.lemonsqueezy.com/buy/id#secret','https://example.lemonsqueezy.com/dashboard','not-a-url',null])assert.equal(checkoutState({...ready(),checkout_url}).ready,false,String(checkout_url));
});
