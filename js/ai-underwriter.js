/* RO'Lyfe AI Underwriter™ — Tax Yield / OTC / County Research bridge
 * This is a deterministic browser-side research assistant. It does not replace
 * lender underwriting, legal review, title work, appraisal or county confirmation.
 */
(function(root){
  "use strict";
  function rules(){return root.ROLyfeTaxYieldRules}
  function tax(){return root.ROLyfeTaxLienEngine}
  function snapshot(){try{return typeof root.getSnapshot==="function"?root.getSnapshot():tax()?.snapshot?.()||{}}catch(e){return {}}}
  function answer(question){
    const q=String(question||"").toLowerCase(); const s=snapshot(); const state=(s.tax?.state||s.state||s.property?.state||"").toUpperCase(); const county=s.tax?.county||s.property?.county||"";
    const r=rules()?.getState(state); const otc=rules()?.getOTCTerms(state);
    if(q.includes("otc")||q.includes("over the counter")) return `<strong>${state||"Jurisdiction not entered"}</strong>: ${otc||"No state-specific alternate term is stored. Ask the county what it calls post-sale or non-auction inventory."}<br><br>Confirm whether unsold certificates/lien interests are actually offered after the sale, how the list is published, and what registration/payment rules apply.`;
    if(q.includes("glossary")||q.includes("define")||q.includes("what does")){ const hits=rules()?.searchGlossary(question)||[]; return hits.length?hits.map(x=>`<strong>${x.term}</strong>: ${x.definition}`).join("<br><br>"):"Ask me to define a specific tax-sale term such as redemption, certificate of purchase, assignment, lien, tax deed, quiet title or yield."; }
    if(q.includes("county")&&q.includes("question")) return `<strong>County research script</strong><br>• ${rules()?.researchQuestions().join("<br>• ")}`;
    if(q.includes("state")||q.includes("jurisdiction")){ return r?`<strong>${state}</strong> research profile:<br>Asset type: ${r.assetType}<br>Interest: ${r.interest}<br>Penalty: ${r.penalty}<br>Redemption: ${r.redemption}<br>Timing: ${r.timing}<br><br><span class="muted">Treat these as research-index values until the applicable official source is verified.</span>`:"Enter a property/tax state first. I can then map the research profile and OTC terminology."; }
    if(q.includes("yield")||q.includes("return")) return `A tax-sale rate is not automatically the realized annualized yield. Check purchase price, statutory interest, penalties, discounts, fees, redemption timing, principal risk and any bidding method before calculating an expected return.`;
    return `I can research the tax-sale layer for ${county?county+", ":""}${state||"the selected jurisdiction"}. Ask me about OTC terminology, state profile, yield mechanics, glossary terms, county questions, redemption, or missing tax-sale data.`;
  }
  root.ROLyfeAIUnderwriter={answer, snapshot};
})(window);
