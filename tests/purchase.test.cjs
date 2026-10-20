const test=require('node:test');
const assert=require('node:assert/strict');
const {checkoutState}=require('../docs/site/purchase.js');
const fixtures=require('./fixtures/purchase-offers.json');
const ready=()=>structuredClone(fixtures.live);
test('configured offer is publishable in its declared lifecycle state',()=>{
  const offer=require('../products/developer-kit/offer.json');
  assert.ok(['release_candidate_not_on_sale','live'].includes(offer.status));
  assert.equal(checkoutState(offer).ready,offer.status==='live','A declared live offer must have every verified gate, seller/contact and bilingual refund terms');
  assert.equal(offer.price_usd,19);
});
test('prelaunch stays closed even if a URL and all other live fields are present',()=>{
  assert.equal(checkoutState(fixtures.prelaunch).ready,false);
  assert.equal(checkoutState({...ready(),status:fixtures.prelaunch.status}).ready,false);
});
test('only a complete one-time launch configuration can expose hosted checkout',()=>{
  const offer=ready();assert.equal(checkoutState(offer).url,offer.checkout_url);
  for(const field of Object.keys(offer.readiness)){
    const incomplete=ready();incomplete.readiness[field]=false;
    assert.equal(checkoutState(incomplete).ready,false,field);
  }
  for(const patch of [{status:'test'},{currency:'ILS'},{price_usd:49},{billing:'subscription'},{support_email:null},{readiness:{}}])assert.equal(checkoutState({...ready(),...patch}).ready,false);
  assert.equal(checkoutState(null).ready,false);
  for(const field of Object.keys(ready().readiness)){
    for(const value of [undefined,null,'true',1]){
      const offer=ready();offer.readiness[field]=value;
      assert.equal(checkoutState(offer).ready,false,field+': '+String(value));
    }
  }
});
test('live checkout requires approved seller identity and refund text in both UI languages',()=>{
  for(const patch of [{seller_name:null},{seller_name:' '},{refund_terms:null},{refund_terms:'proposed policy'},{refund_terms:{en:'English only'}},{refund_terms:{en:' ',he:'עברית'}}])assert.equal(checkoutState({...ready(),...patch}).ready,false);
  const state=checkoutState(ready());
  assert.deepEqual(state.refund_terms,fixtures.live.refund_terms);
  assert.equal(state.seller_name,fixtures.live.seller_name);
});
test('checkout configuration cannot redirect to an arbitrary or disguised destination',()=>{
  for(const checkout_url of ['javascript:alert(1)','http://example.lemonsqueezy.com/buy/id','https://example.lemonsqueezy.com.evil.example/buy/id','https://lemonsqueezy.com@evil.example/buy/id','https://user:secret@example.lemonsqueezy.com/buy/id','https://example.lemonsqueezy.com:444/buy/id','https://example.lemonsqueezy.com/buy/id?test=1','https://example.lemonsqueezy.com/buy/id#secret','https://example.lemonsqueezy.com/dashboard','not-a-url',null])assert.equal(checkoutState({...ready(),checkout_url}).ready,false,String(checkout_url));
});
