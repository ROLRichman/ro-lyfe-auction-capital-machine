/* RO'Lyfe Capital Routing Bridge + Auction Capital & Risk Intelligence.
   Local-first planning aid. No bank connection, lender approval, title verification or bidding. */
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
  root.ROLyfeCapitalEngine={version:"1.1.0",calculate,snapshot:calculate};

  const STORE_KEY="rolyfe-auction-capital-intelligence-v1";
  const $=id=>document.getElementById(id);
  const num=id=>{const x=Number($(id)?.value);return Number.isFinite(x)?x:0;};
  const text=id=>String($(id)?.value??"").trim();
  const money=value=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(value)||0);
  const safe=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const localDate=()=>{const d=new Date();return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);};
  const state={ledger:[],deals:[]};
  const kinds={
    "verified-in":"Verified capital received",
    "reserve":"Reserve / commitment",
    "release":"Release reserve",
    "spent":"Capital spent",
    "pending":"Pending / conditional source",
    "credit":"Available credit (not cash)"
  };
  const categories=["Owner capital","Business revenue received","Financing proceeds received","Confirmed internal transfer","Auction / earnest-money deposit","Title / tax / closing","Repairs / contractor","Holding / insurance / utilities","Selling / disposition","Financing commitment","Expected receipt","Credit line / card capacity","Other / review"];

  function load(){
    try{
      const raw=localStorage.getItem(STORE_KEY);
      if(raw){const data=JSON.parse(raw);state.ledger=Array.isArray(data.ledger)?data.ledger:[];state.deals=Array.isArray(data.deals)?data.deals:[];}
    }catch(e){console.warn("RO'Lyfe capital workspace could not load local data.",e);}
  }
  function save(){
    try{localStorage.setItem(STORE_KEY,JSON.stringify({version:1,ledger:state.ledger,deals:state.deals,updatedAt:new Date().toISOString()}));return true;}
    catch(e){console.warn("RO'Lyfe capital workspace could not save.",e);setStatus("Storage is unavailable in this browser. Export your records before leaving.","warn");return false;}
  }
  function setStatus(message,tone){
    const el=$("acx-status");if(!el)return;
    el.textContent=message;el.className="acx-status "+(tone||"");
  }
  function totals(){
    const sum=kind=>state.ledger.filter(x=>x.kind===kind).reduce((a,x)=>a+(Number(x.amount)||0),0);
    const verified=sum("verified-in"),spent=sum("spent"),reserved=Math.max(sum("reserve")-sum("release"),0);
    const cash=verified-spent;
    return {verified,spent,reserved,cash,deployable:Math.max(cash-reserved,0),overdrawn:Math.max(-cash,0),pending:sum("pending"),credit:sum("credit")};
  }
  function calculation(){
    const rawArv=num("acx-arv"),confidence=$("acx-confidence")?.value||"0.7",factor=confidence==="verified"?1:Number(confidence),basis=rawArv*factor;
    const costs={
      rehab:num("acx-rehab"),
      auctionClosing:num("acx-auction-closing"),
      titleTaxes:num("acx-title-tax"),
      holding:num("acx-holding"),
      selling:num("acx-selling"),
      financing:num("acx-financing"),
      contingency:num("acx-contingency")
    };
    const totalCosts=Object.values(costs).reduce((a,b)=>a+b,0);
    const desiredProfit=num("acx-profit");
    const maxBid=basis-totalCosts-desiredProfit;
    const currentBid=num("acx-current-bid");
    const projectCost=currentBid+totalCosts;
    const capital=totals();
    const cashRequired=num("acx-cash-required");
    const fundingGap=Math.max(cashRequired-capital.deployable,0);
    const checks=["acx-check-terms","acx-check-title","acx-check-condition","acx-check-deposit"];
    const diligence=checks.every(id=>$(id)?.checked);
    const valueVerified=$("acx-confidence")?.value==="verified";
    const hasArv=rawArv>0;
    const hasBid=currentBid>0;
    const withinCeiling=hasBid&&maxBid>0&&currentBid<=maxBid;
    const hasCashRequirement=cashRequired>0;
    let status="HOLD — COMPLETE THE REVIEW";
    let detail="Enter the deal numbers, required cash and due-diligence confirmations.";
    let tone="warn";
    if(hasBid&&(maxBid<=0||currentBid>maxBid)){status="STOP — BID EXCEEDS THE CEILING";detail="The entered current bid is above this model's maximum allowable bid.";tone="bad";}
    else if(fundingGap>0){status="FUNDING GAP — NOT READY";detail="Available deployable capital does not cover the cash requirement entered for this deal.";tone="bad";}
    else if(!hasArv||!hasBid||!hasCashRequirement){status="HOLD — MISSING KEY INPUTS";detail="Add a value estimate, current bid and cash needed to participate / close.";tone="warn";}
    else if(!valueVerified||!diligence||!withinCeiling){status="HOLD — DUE DILIGENCE / VALUE REVIEW";detail="The ARV must be marked as verified and all four auction checks completed before this can reach final human review.";tone="warn";}
    else {status="READY FOR FINAL HUMAN REVIEW";detail="The model checks pass. A person must still verify source documents, auction rules, funds and professional reviews before any bid.";tone="good";}
    return {rawArv,factor,basis,costs,totalCosts,desiredProfit,maxBid,currentBid,projectCost,capital,cashRequired,fundingGap,diligence,valueVerified,hasArv,hasBid,withinCeiling,hasCashRequirement,status,detail,tone};
  }
  function updateMetrics(){
    const t=totals();
    const values={"acx-total-verified":money(t.verified),"acx-total-spent":money(t.spent),"acx-total-reserved":money(t.reserved),"acx-total-deployable":money(t.deployable),"acx-total-pending":money(t.pending),"acx-total-credit":money(t.credit)};
    Object.entries(values).forEach(([id,value])=>{if($(id))$(id).textContent=value;});
    if($("acx-funds-free"))$("acx-funds-free").value=money(r.capital.deployable);
    if($("acx-overdrawn"))$("acx-overdrawn").textContent=t.overdrawn>0?"Ledger warning: recorded spending exceeds verified capital by "+money(t.overdrawn)+".":"";
  }
  function updateCalculation(){
    const r=calculation();
    const values={
      "acx-value-basis":money(r.basis),
      "acx-max-bid":r.maxBid<0?"NO SUPPORTABLE BID":money(r.maxBid),
      "acx-total-cost":money(r.projectCost),
      "acx-bid-room":money(r.maxBid-r.currentBid),
      "acx-funds-free":money(r.capital.deployable),
      "acx-funding-gap":money(r.fundingGap),"acx-funding-gap-need":money(r.fundingGap),
      "acx-cost-stack":money(r.totalCosts),
      "acx-capital-covered":r.cashRequired>0?Math.min(100,(r.capital.deployable/r.cashRequired)*100).toFixed(0)+"%":"—"
    };
    Object.entries(values).forEach(([id,value])=>{if($(id))$(id).textContent=value;});
    const badge=$("acx-readiness");if(badge){badge.textContent=r.status;badge.className="acx-readiness "+r.tone;}
    const explanation=$("acx-readiness-detail");if(explanation)explanation.textContent=r.detail;
    const warnings=[];
    if(r.rawArv>0&&r.factor<1)warnings.push("ARV haircut applied: "+Math.round((1-r.factor)*100)+"%.");
    if(r.maxBid<0)warnings.push("Costs plus required profit exceed the conservative value basis.");
    if(r.capital.overdrawn>0)warnings.push("The capital ledger currently records spending above verified receipts.");
    if($("acx-model-notes"))$("acx-model-notes").textContent=warnings.join(" ");
    return r;
  }
  function renderLedger(){
    const body=$("acx-ledger-body");if(!body)return;
    if(!state.ledger.length){body.innerHTML='<tr><td colspan="5" class="acx-empty">No capital activity recorded yet.</td></tr>';return;}
    body.innerHTML=state.ledger.slice().reverse().map(item=>'<tr><td>'+safe(item.date)+'</td><td>'+safe(kinds[item.kind]||item.kind)+'</td><td>'+safe(item.category)+'</td><td>'+money(item.amount)+'</td><td><button type="button" class="acx-small" data-delete-ledger="'+safe(item.id)+'" aria-label="Delete capital entry">Remove</button></td></tr>').join("");
  }
  function renderDeals(){
    const body=$("acx-deals-body");const select=$("acx-closeout-deal");if(!body||!select)return;
    const previous=select.value;
    if(!state.deals.length){body.innerHTML='<tr><td colspan="6" class="acx-empty">No saved deal snapshots yet.</td></tr>';select.innerHTML='<option value="">Save an underwriting snapshot first</option>';return;}
    body.innerHTML=state.deals.slice().reverse().slice(0,12).map(d=>{
      const outcome=d.actualCost!=null&&d.exitProceeds!=null?money(Number(d.exitProceeds)-Number(d.actualCost)):"Not recorded";
      return '<tr><td>'+safe(d.address||"Unnamed property")+'</td><td>'+money(d.maxBid)+'</td><td>'+money(d.currentBid)+'</td><td>'+money(d.fundingGap)+'</td><td>'+safe(outcome)+'</td><td><button class="acx-small" type="button" data-delete-deal="'+safe(d.id)+'">Remove</button></td></tr>';
    }).join("");
    select.innerHTML='<option value="">Choose a saved deal</option>'+state.deals.slice().reverse().map(d=>'<option value="'+safe(d.id)+'">'+safe(d.address||"Unnamed property")+" · "+new Date(d.savedAt).toLocaleDateString()+'</option>').join("");
    if(previous&&state.deals.some(d=>d.id===previous))select.value=previous;
  }
  function addLedgerEntry(){
    const kind=text("acx-ledger-kind"),amount=num("acx-ledger-amount");
    if(!kinds[kind]||!(amount>0)){setStatus("Choose an activity type and enter an amount greater than zero.","warn");return;}
    if(kind==="verified-in"&&!["Owner capital","Business revenue received","Financing proceeds received","Confirmed internal transfer"].includes(text("acx-ledger-category"))){setStatus("Use a received-cash category for verified capital. Pending commitments and credit capacity must stay separate.","warn");return;}
    state.ledger.push({id:"l-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),kind,category:text("acx-ledger-category"),amount,date:text("acx-ledger-date")||localDate(),note:text("acx-ledger-note")});
    save();renderLedger();updateMetrics();updateCalculation();
    $("acx-ledger-amount").value="";$("acx-ledger-note").value="";
    setStatus("Capital activity saved on this device. Pending funds and credit capacity remain outside deployable cash.","good");
  }
  function saveSnapshot(){
    const r=updateCalculation();
    if(!r.hasArv){setStatus("Enter an estimated ARV before saving a deal snapshot.","warn");return;}
    const address=text("acx-property")||text("address")||"Unnamed property";
    const snapshot={id:"d-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),address,savedAt:new Date().toISOString(),rawArv:r.rawArv,valueBasis:r.basis,maxBid:r.maxBid,currentBid:r.currentBid,totalCosts:r.totalCosts,projectCost:r.projectCost,cashRequired:r.cashRequired,deployable:r.capital.deployable,fundingGap:r.fundingGap,confidence:$("acx-confidence")?.value||"unverified",actualCost:null,exitProceeds:null,outcomeNotes:""};
    state.deals.push(snapshot);if(state.deals.length>100)state.deals=state.deals.slice(-100);
    save();renderDeals();setStatus("Underwriting snapshot saved. It is a planning record, not a validated appraisal or bid authorization.","good");
  }
  function saveOutcome(){
    const id=text("acx-closeout-deal"),actual=$("acx-actual-cost")?.value,exit=$("acx-exit-proceeds")?.value;
    if(!id||actual===""||exit===""){setStatus("Choose a saved deal and enter actual project cost and exit proceeds.","warn");return;}
    const d=state.deals.find(x=>x.id===id);if(!d)return;
    d.actualCost=Math.max(0,Number(actual)||0);d.exitProceeds=Math.max(0,Number(exit)||0);d.outcomeNotes=text("acx-outcome-notes");d.closedAt=new Date().toISOString();
    save();renderDeals();
    const spread=d.exitProceeds-d.actualCost;
    setStatus("Outcome saved. Actual gross spread before any costs not included in your actual-cost entry: "+money(spread)+".","good");
  }
  function csvCell(value){const s=String(value??"");return '"'+s.replace(/"/g,'""')+'"';}
  function exportCsv(){
    const rows=[["Record type","Date","Property / category","Activity","Amount / value","Notes"]];
    state.ledger.forEach(x=>rows.push(["Capital ledger",x.date,x.category,kinds[x.kind],x.amount,x.note]));
    state.deals.forEach(x=>{
      rows.push(["Deal snapshot",x.savedAt,x.address,"Maximum bid",x.maxBid,"Conservative value: "+x.valueBasis+"; current bid: "+x.currentBid+"; capital gap: "+x.fundingGap]);
      if(x.actualCost!=null)rows.push(["Deal outcome",x.closedAt,x.address,"Actual gross spread",Number(x.exitProceeds)-Number(x.actualCost),"Actual cost: "+x.actualCost+"; exit proceeds: "+x.exitProceeds+"; "+(x.outcomeNotes||"")]);
    });
    const csv=rows.map(row=>row.map(csvCell).join(",")).join("\r\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="rolyfe-auction-capital-and-deal-records.csv";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    setStatus("CSV export created. Store it securely as a backup of this device's local records.","good");
  }

  function syncLegacyFields(force){
    const links=[["arv","acx-arv"],["currentBid","acx-current-bid"],["rehab","acx-rehab"],["closing","acx-auction-closing"],["holding","acx-holding"],["selling","acx-selling"],["financingCosts","acx-financing"],["profit","acx-profit"],["contingency","acx-contingency"]];
    links.forEach(([legacy,target])=>{const source=$(legacy),dest=$(target);if(source&&dest&&source.value!==""&&(force||dest.value===""))dest.value=source.value;});
    const address=$("address");if(address&&$("acx-property"))$("acx-property").value=address.value;
  }

  function mount(){
    const host=$("capital")?.querySelector(".section-content");
    if(!host||$("acx-shell"))return;
    const style=document.createElement("style");
    style.id="acx-capital-risk-styles";
    style.textContent=`
      .acx-shell{margin-top:18px;padding:16px;border:1px solid var(--border2);border-radius:16px;background:linear-gradient(145deg,rgba(11,24,42,.96),rgba(10,16,31,.98));min-width:0}
      .acx-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px}
      .acx-head h3{font-size:19px;margin:0 0 4px}.acx-head p{margin:0;color:var(--muted);font-size:12px;max-width:800px}
      .acx-kicker{font-size:10px;letter-spacing:.14em;color:var(--accent);font-weight:900;margin-bottom:4px}
      .acx-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:12px 0}
      .acx-metric{min-width:0;padding:11px;border:1px solid var(--border);background:rgba(255,255,255,.025);border-radius:10px}
      .acx-metric small{display:block;color:var(--muted);font-size:10px}.acx-metric strong{display:block;font-size:18px;overflow-wrap:anywhere;margin-top:3px}
      .acx-metric.emphasis{border-color:rgba(84,227,154,.35);background:rgba(84,227,154,.05)}
      .acx-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:12px}
      .acx-card{border:1px solid var(--border);border-radius:12px;padding:13px;background:rgba(255,255,255,.018);min-width:0}
      .acx-card h4{font-size:14px;margin:0 0 4px}.acx-help{font-size:11px;color:var(--muted);line-height:1.5;margin:0 0 10px}
      .acx-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
      .acx-field{display:flex;flex-direction:column;gap:4px;min-width:0}.acx-field label{font-size:11px;color:var(--muted)}
      .acx-field input,.acx-field select,.acx-field textarea{width:100%;min-width:0;padding:9px 10px;background:#091426;color:var(--text);border:1px solid var(--border2);border-radius:8px;font:inherit;font-size:13px}
      .acx-field textarea{min-height:64px;resize:vertical}.acx-wide{grid-column:1/-1}
      .acx-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}
      .acx-result{padding:9px;border-radius:9px;background:rgba(102,217,255,.045);border:1px solid rgba(102,217,255,.16);min-width:0}
      .acx-result small{display:block;color:var(--muted);font-size:10px}.acx-result strong{display:block;font-size:16px;overflow-wrap:anywhere;margin-top:3px}
      .acx-readiness{display:block;padding:10px;border:1px solid var(--border2);border-radius:9px;font-weight:900;font-size:12px;letter-spacing:.02em}
      .acx-readiness.good{color:var(--green);background:rgba(84,227,154,.07);border-color:rgba(84,227,154,.35)}
      .acx-readiness.warn{color:var(--yellow);background:rgba(255,209,102,.07);border-color:rgba(255,209,102,.35)}
      .acx-readiness.bad{color:var(--red);background:rgba(255,107,107,.07);border-color:rgba(255,107,107,.35)}
      .acx-checks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:10px}
      .acx-checks label{display:flex;align-items:flex-start;gap:7px;padding:8px;border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:11px;line-height:1.35}
      .acx-checks input{margin:2px 0 0;accent-color:var(--green);flex:0 0 auto}
      .acx-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
      .acx-actions button,.acx-small{border:1px solid var(--border2);border-radius:8px;padding:8px 11px;background:#12213a;color:var(--text);font-size:11px;font-weight:800;cursor:pointer}
      .acx-actions button.primary{background:var(--accent);color:#07111d;border-color:transparent}
      .acx-actions button:hover,.acx-small:hover{filter:brightness(1.12)}
      .acx-table-wrap{overflow:auto;max-width:100%;margin-top:9px}
      .acx-table{width:100%;border-collapse:collapse;font-size:11px;min-width:530px}
      .acx-table th,.acx-table td{text-align:left;padding:8px;border-bottom:1px solid var(--border);vertical-align:top}
      .acx-table th{color:var(--muted);font-weight:700}.acx-empty{color:var(--muted);text-align:center!important;padding:16px!important}
      .acx-status{font-size:11px;color:var(--muted);margin-top:9px;min-height:16px}.acx-status.good{color:var(--green)}.acx-status.warn{color:var(--yellow)}
      .acx-footnote{font-size:10px;color:var(--muted);line-height:1.55;margin:11px 0 0;border-top:1px solid var(--border);padding-top:10px}
      .acx-secondary{color:var(--muted);font-size:10px;line-height:1.4;margin-top:6px}
      @media(max-width:700px){.acx-shell{padding:11px}.acx-grid{grid-template-columns:1fr}.acx-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.acx-form{grid-template-columns:1fr}.acx-wide{grid-column:auto}.acx-checks{grid-template-columns:1fr}.acx-head h3{font-size:17px}}
    `;
    document.head.appendChild(style);
    const markup=`
      <section class="acx-shell" id="acx-shell" aria-labelledby="acx-title">
        <div class="acx-head"><div><div class="acx-kicker">RO'LYFE CAPITAL INTELLIGENCE</div><h3 id="acx-title">Acquisition Capital &amp; Bid-Risk Engine</h3><p>Track confirmed cash, capital commitments, funding gaps and a transparent maximum-bid ceiling alongside this property. It is designed to support the existing auction workflow, not replace its underwriting.</p></div><span class="badge">Local-first workspace</span></div>
        <div class="acx-metrics">
          <div class="acx-metric"><small>Verified capital received</small><strong id="acx-total-verified">$0</strong></div>
          <div class="acx-metric"><small>Capital spent</small><strong id="acx-total-spent">$0</strong></div>
          <div class="acx-metric"><small>Currently reserved</small><strong id="acx-total-reserved">$0</strong></div>
          <div class="acx-metric emphasis"><small>Deployable cash after spend / reserves</small><strong id="acx-total-deployable">$0</strong></div>
          <div class="acx-metric"><small>Pending / conditional funds</small><strong id="acx-total-pending">$0</strong></div>
          <div class="acx-metric"><small>Available credit (excluded from cash)</small><strong id="acx-total-credit">$0</strong></div>
        </div>
        <div id="acx-overdrawn" class="acx-secondary"></div>
        <div class="acx-grid">
          <section class="acx-card">
            <h4>1. Capital Activity Ledger</h4><p class="acx-help">Add only the amount and category—never account numbers, passwords or card details. “Verified” means you have personally confirmed the funds; this app does not verify bank balances.</p>
            <div class="acx-form">
              <div class="acx-field"><label for="acx-ledger-kind">Activity type</label><select id="acx-ledger-kind"><option value="verified-in">Verified capital received</option><option value="reserve">Reserve / commitment</option><option value="release">Release reserve</option><option value="spent">Capital spent</option><option value="pending">Pending / conditional source</option><option value="credit">Available credit (not cash)</option></select></div>
              <div class="acx-field"><label for="acx-ledger-category">Category / source</label><select id="acx-ledger-category">${categories.map(x=>'<option>'+safe(x)+'</option>').join("")}</select></div>
              <div class="acx-field"><label for="acx-ledger-amount">Amount (USD)</label><input id="acx-ledger-amount" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00"></div>
              <div class="acx-field"><label for="acx-ledger-date">Activity date</label><input id="acx-ledger-date" type="date" value="${localDate()}"></div>
              <div class="acx-field acx-wide"><label for="acx-ledger-note">Short note (optional)</label><input id="acx-ledger-note" maxlength="180" placeholder="Example: earnest money reserved for property review"></div>
            </div>
            <div class="acx-actions"><button type="button" class="primary" id="acx-add-ledger">Add activity</button><button type="button" id="acx-export">Export capital / deal CSV</button></div>
            <div class="acx-table-wrap"><table class="acx-table"><thead><tr><th>Date</th><th>Activity</th><th>Category</th><th>Amount</th><th></th></tr></thead><tbody id="acx-ledger-body"></tbody></table></div>
            <p class="acx-secondary">Only verified capital received is added to cash. Spending reduces cash; reserves reduce deployable cash until released. Pending offers, unreceived proceeds and credit capacity are tracked separately and never counted as available cash.</p>
          </section>
          <section class="acx-card">
            <h4>2. Deal Economics &amp; Maximum Bid</h4><p class="acx-help">The maximum bid uses a conservative value basis, then subtracts the full cost stack and your required profit. Values are user-entered estimates until independently verified.</p>
            <div class="acx-form">
              <div class="acx-field acx-wide"><label for="acx-property">Property address / deal label</label><input id="acx-property" maxlength="180" placeholder="Auto-fills from Auction Property Intake"></div>
              <div class="acx-field"><label for="acx-arv">Estimated after-repair value (ARV)</label><input id="acx-arv" class="acx-calc" type="number" min="0" step="1000" inputmode="decimal" placeholder="100000"></div>
              <div class="acx-field"><label for="acx-confidence">Value confidence / haircut</label><select id="acx-confidence" class="acx-calc"><option value="verified">Verified comps / documented review (0% haircut)</option><option value="0.9">Reviewed estimate (10% haircut)</option><option value="0.8">Rough estimate (20% haircut)</option><option value="0.7" selected>Unverified / placeholder (30% haircut)</option></select></div>
              <div class="acx-field"><label for="acx-current-bid">Current / planned bid</label><input id="acx-current-bid" class="acx-calc" type="number" min="0" step="500" inputmode="decimal" placeholder="Current bid"></div>
              <div class="acx-field"><label for="acx-rehab">Repairs / rehab</label><input id="acx-rehab" class="acx-calc" type="number" min="0" step="500" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-auction-closing">Auction, closing &amp; buyer fees</label><input id="acx-auction-closing" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-title-tax">Title, taxes, liens &amp; legal costs</label><input id="acx-title-tax" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-holding">Holding, insurance &amp; utilities</label><input id="acx-holding" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-selling">Selling / disposition costs</label><input id="acx-selling" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-financing">Financing costs</label><input id="acx-financing" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-contingency">Contingency allowance</label><input id="acx-contingency" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-profit">Required profit / margin (USD)</label><input id="acx-profit" class="acx-calc" type="number" min="0" step="500" inputmode="decimal" placeholder="0"></div>
            </div>
            <div class="acx-results">
              <div class="acx-result"><small>Conservative value basis</small><strong id="acx-value-basis">$0</strong></div>
              <div class="acx-result"><small>Maximum allowable bid</small><strong id="acx-max-bid">$0</strong></div>
              <div class="acx-result"><small>Cost stack (excluding bid)</small><strong id="acx-cost-stack">$0</strong></div>
              <div class="acx-result"><small>Project cost at current bid</small><strong id="acx-total-cost">$0</strong></div>
              <div class="acx-result"><small>Room to bid / (over ceiling)</small><strong id="acx-bid-room">$0</strong></div>
              <div class="acx-result"><small>Funding gap for cash requirement</small><strong id="acx-funding-gap">$0</strong></div>
            </div>
            <p id="acx-model-notes" class="acx-secondary"></p>
            <div class="acx-actions"><button type="button" class="primary" id="acx-save-snapshot">Save deal snapshot</button><button type="button" id="acx-refresh-deal">Use current deal numbers</button></div>
          </section>
          <section class="acx-card">
            <h4>3. Cash Need &amp; Bid Readiness</h4><p class="acx-help">Enter the cash you must actually have available to participate and close—auction deposit, required equity, fees and any non-financed amount. Do not assume that a lender quote or application is cash.</p>
            <div class="acx-form">
              <div class="acx-field"><label for="acx-cash-required">Cash required to participate / close</label><input id="acx-cash-required" class="acx-calc" type="number" min="0" step="100" inputmode="decimal" placeholder="Enter verified requirement"></div>
              <div class="acx-field"><label>Deployable cash ledger</label><input id="acx-funds-free" type="text" readonly value="$0"></div>
            </div>
            <div class="acx-results">
              <div class="acx-result"><small>Funding gap</small><strong id="acx-funding-gap-need">$0</strong></div>
              <div class="acx-result"><small>Cash requirement covered</small><strong id="acx-capital-covered">—</strong></div>
            </div>
            <div style="margin-top:12px"><div class="acx-kicker">DUE-DILIGENCE CONFIRMATIONS</div>
              <div class="acx-checks">
                <label><input type="checkbox" class="acx-calc" id="acx-check-terms"> Auction terms, deadlines and buyer fees reviewed</label>
                <label><input type="checkbox" class="acx-calc" id="acx-check-title"> Title, taxes, liens and redemption reviewed with appropriate sources</label>
                <label><input type="checkbox" class="acx-calc" id="acx-check-condition"> Occupancy, inspection limits and property condition reviewed</label>
                <label><input type="checkbox" class="acx-calc" id="acx-check-deposit"> Deposit, proof-of-funds and closing requirements confirmed</label>
              </div>
            </div>
            <div style="margin-top:12px"><div class="acx-readiness warn" id="acx-readiness">HOLD — COMPLETE THE REVIEW</div><p id="acx-readiness-detail" class="acx-help" style="margin:7px 0 0">Enter the deal numbers, required cash and due-diligence confirmations.</p></div>
            <p class="acx-secondary">The value confidence selector is your own declaration, not an appraisal or automated comp check. “Ready for final human review” is not an instruction to bid, a title opinion, financing approval or a guarantee that auction requirements are satisfied.</p>
          </section>
          <section class="acx-card">
            <h4>4. Deal History &amp; Actual Results</h4><p class="acx-help">Save underwriting snapshots, then record actual project cost and exit proceeds. This creates a simple feedback loop between estimates and completed outcomes.</p>
            <div class="acx-table-wrap"><table class="acx-table"><thead><tr><th>Property</th><th>Max bid</th><th>Current bid</th><th>Funding gap</th><th>Actual gross spread</th><th></th></tr></thead><tbody id="acx-deals-body"></tbody></table></div>
            <div class="acx-form" style="margin-top:12px">
              <div class="acx-field acx-wide"><label for="acx-closeout-deal">Saved deal to close out</label><select id="acx-closeout-deal"><option value="">Save an underwriting snapshot first</option></select></div>
              <div class="acx-field"><label for="acx-actual-cost">Actual project cost to date / at exit</label><input id="acx-actual-cost" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field"><label for="acx-exit-proceeds">Sale / exit proceeds</label><input id="acx-exit-proceeds" type="number" min="0" step="100" inputmode="decimal" placeholder="0"></div>
              <div class="acx-field acx-wide"><label for="acx-outcome-notes">Outcome notes (optional)</label><input id="acx-outcome-notes" maxlength="220" placeholder="What differed from the original estimate?"></div>
            </div>
            <div class="acx-actions"><button type="button" class="primary" id="acx-save-outcome">Save actual outcome</button></div>
          </section>
        </div>
        <div class="acx-status" id="acx-status" role="status" aria-live="polite">Ledger and deal snapshots are stored locally in this browser.</div>
        <p class="acx-footnote"><strong>Important:</strong> This workspace does not connect to bank accounts, verify balances, execute transfers, place bids, issue proof of funds, or obtain lender approvals. Manually recorded “verified” funds are user-confirmed only. Keep pending, conditional, borrowed and available-credit amounts separate until funds are actually received and available. The ledger and saved deals live in this browser/device; use CSV export for a backup. Confirm ARV, repairs, auction conditions, legal/title issues, taxes, deposits, financing terms and all closing requirements with qualified sources before bidding.</p>
      </section>
    `;
    host.insertAdjacentHTML("beforeend",markup);
    load();syncLegacyFields();renderLedger();renderDeals();updateMetrics();updateCalculation();

    $("acx-add-ledger")?.addEventListener("click",addLedgerEntry);
    $("acx-export")?.addEventListener("click",exportCsv);
    $("acx-save-snapshot")?.addEventListener("click",saveSnapshot);
    $("acx-save-outcome")?.addEventListener("click",saveOutcome);
    $("acx-refresh-deal")?.addEventListener("click",()=>{syncLegacyFields(true);updateCalculation();setStatus("Current auction-intake and deal-analysis values copied into this planner.","good");});
    $("acx-ledger-body")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-delete-ledger]");if(!button)return;
      state.ledger=state.ledger.filter(x=>x.id!==button.dataset.deleteLedger);save();renderLedger();updateMetrics();updateCalculation();setStatus("Capital entry removed.","good");
    });
    $("acx-deals-body")?.addEventListener("click",event=>{
      const button=event.target.closest("[data-delete-deal]");if(!button)return;
      state.deals=state.deals.filter(x=>x.id!==button.dataset.deleteDeal);save();renderDeals();setStatus("Deal snapshot removed.","good");
    });
    document.querySelectorAll("#acx-shell .acx-calc").forEach(el=>el.addEventListener("input",updateCalculation));
    document.querySelectorAll("#acx-shell .acx-calc").forEach(el=>el.addEventListener("change",updateCalculation));
    ["address","arv","currentBid","rehab","closing","holding","selling","financingCosts","profit","contingency"].forEach(id=>{
      $(id)?.addEventListener("input",()=>{syncLegacyFields(true);updateCalculation();});
      $(id)?.addEventListener("change",()=>{syncLegacyFields();updateCalculation();});
    });
    root.ROLyfeAuctionCapitalIntelligence={version:"1.0.0",totals,calculation,saveSnapshot,exportCsv};
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});
  else mount();
})(window);
