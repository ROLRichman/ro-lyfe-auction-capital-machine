/* RO'Lyfe Contractor / Buyer Snapshot Bridge
 * Reads the current contractor desk. Credentials and estimates are not independently verified.
 */
(function(root){
  "use strict";
  function value(id){const el=document.getElementById(id);return el?String(el.value||"").trim():"";}
  function number(id){const n=Number(value(id));return Number.isFinite(n)?n:0;}
  function snapshot(){
    const contractor=value("contractorName"),company=value("contractorCompany"),estimate=number("contractorBudget");
    return {contractor:contractor||company||"",company,phone:value("contractorPhone"),email:value("contractorEmail"),role:value("contractorRole")||"Not entered",estimate,notes:value("contractorNotes"),status:(contractor||company||estimate>0)?"ENTERED · VERIFY REFERENCES, LICENCE & INSURANCE":"NOT PROVIDED",verified:false,capturedAt:new Date().toISOString()};
  }
  root.ROLyfeContractorEngine={version:"1.0.0",snapshot,updateUI:snapshot};
})(window);
