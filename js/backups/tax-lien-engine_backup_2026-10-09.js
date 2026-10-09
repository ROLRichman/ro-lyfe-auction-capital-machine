/* RO'Lyfe Tax/Lien Engine — jurisdiction + OTC intelligence bridge */
(function(root){
  "use strict";
  function el(id){return document.getElementById(id)}
  function val(id){return (el(id)?.value||"").trim()}
  function num(id){return Number(el(id)?.value||0)||0}
  function rules(){return root.ROLyfeTaxYieldRules}
  function snapshot(){
    const state=(val("taxState")||val("propertyState")).toUpperCase();
    const county=val("taxCounty")||val("county");
    const saleType=val("taxSaleType")||val("auctionType")||"Unknown";
    const r=rules()?.getState(state);
    const total=num("taxTotalDue")||num("delinquentTaxes")+num("taxPenalties")+num("taxFees");
    return {state,county,saleType,totalDue:total,rule:r,alternateOTCTerm:rules()?.getOTCTerms(state)||null,source:val("taxSource")};
  }
  function render(){
    const s=snapshot(),r=s.rule;
    const box=el("taxOutput"); if(!box)return s;
    box.innerHTML=`<div class="result-grid">
      <div class="result-item"><span>Jurisdiction</span><strong>${s.state||"Not entered"}</strong></div>
      <div class="result-item"><span>Sale Type</span><strong>${s.saleType}</strong></div>
      <div class="result-item"><span>Total Due</span><strong>${new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(s.totalDue)}</strong></div>
    </div>
    <div class="grid" style="margin-top:12px">
      <div class="card"><h3>Tax-Sale Research Profile</h3><p><strong>Asset:</strong> ${r?.assetType||"Verify"}</p><p><strong>Interest:</strong> ${r?.interest||"Verify"}</p><p><strong>Penalty:</strong> ${r?.penalty||"Verify"}</p><p><strong>Redemption:</strong> ${r?.redemption||"Verify"}</p><p><strong>Timing:</strong> ${r?.timing||"Verify"}</p></div>
      <div class="card"><h3>OTC / Alternate Terminology</h3><p>${s.alternateOTCTerm||"Enter a state to check terminology."}</p><p class="muted">Terminology is a research aid. Confirm the county's actual post-sale inventory process.</p></div>
    </div>
    <p class="muted" style="margin-top:12px">Research flag only. Verify the current county/state rules, official sale notice, parcel account, title, redemption requirements and payment instructions before relying on any rate, timing or asset-type field.</p>`;
    return s;
  }
  root.ROLyfeTaxLienEngine={snapshot,calculate:render,render, getStateRule:(state)=>rules()?.getState(state)||null, getOTCTerm:(state)=>rules()?.getOTCTerms(state)||null};
})(window);
