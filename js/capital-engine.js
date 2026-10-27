/* RO'Lyfe Capital Routing Bridge — estimate only; no lender approval or eligibility check. */
(function(root){
  "use strict";
  function n(id){const el=document.getElementById(id);const v=Number(el&&el.value);return Number.isFinite(v)?v:0;}
  function calculate(overrides){
    const o=overrides||{};
    const base=(typeof root.calculateDealUI==="function")?root.calculateDealUI():{};
    const projectCost=Number.isFinite(Number(o.projectCost))?Number(o.projectCost):(n("boProjectCost")||Number(base.project)||0);
    const buyerCash=Number.isFinite(Number(o.buyerCash))?Number(o.buyerCash):(n("boBuyerCash")||n("buyerCapital"));
    const proposedLoan=Number.isFinite(Number(o.proposedLoan))?Number(o.proposedLoan):n("boLoanAmount");
    const collateralValue=Number.isFinite(Number(o.collateralValue))?Number(o.collateralValue):n("boCollateralValue");
    const rate=Number.isFinite(Number(o.annualRate))?Number(o.annualRate):n("boRate");
    const months=Number.isFinite(Number(o.months))?Number(o.months):n("boMonths");
    return {projectCost,buyerCash,proposedLoan,collateralValue,annualRate:rate,months,fundingGap:Math.max(projectCost-buyerCash-proposedLoan,0),gapBeforeProposedLoan:Math.max(projectCost-buyerCash,0),loanToValue:collateralValue>0?proposedLoan/collateralValue:null,estimatedInterest:proposedLoan*rate/100*months/12,isEstimate:true,approvalStatus:"NOT REVIEWED BY A LENDER"};
  }
  root.ROLyfeCapitalEngine={version:"1.0.0",calculate,snapshot:calculate};
})(window);
