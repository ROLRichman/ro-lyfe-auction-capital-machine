/* RO'Lyfe Review & Export — local page-answer review */
(function(){
 "use strict";
 if(window.__rolReviewExportLoaded)return;
 window.__rolReviewExportLoaded=true;
 const $=id=>document.getElementById(id);
 const style=document.createElement("style");
 style.textContent=[
 ".rol-review-trigger{position:fixed;left:132px;bottom:14px;z-index:2280;border:1px solid #8db4e6;border-radius:20px;background:#13213a;color:#eaf4ff;padding:9px 12px;font-size:11px;font-weight:850;box-shadow:0 6px 20px #0008}",
 ".rol-review-panel{display:none;position:fixed;left:10px;bottom:62px;z-index:2281;width:min(480px,calc(100vw - 20px));max-height:78vh;overflow:auto;overscroll-behavior:contain;background:#091323;color:#eff6ff;border:1px solid #405a7d;border-radius:15px;padding:14px;box-shadow:0 24px 70px #000b}",
 ".rol-review-panel.open{display:block}.rol-review-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.rol-review-head h3{margin:0;font-size:16px}",
 ".rol-review-panel p{color:#a8bad1;font-size:11px;line-height:1.5}.rol-review-panel label{display:block;color:#a8bad1;font-size:10px;margin:10px 0 5px}",
 ".rol-review-panel input{box-sizing:border-box;width:100%;background:#080f1d;color:#f4f7fb;border:1px solid #344a69;border-radius:8px;padding:10px}",
 ".rol-review-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-top:11px}.rol-review-actions button{background:#13213a;color:#eef6ff;border:1px solid #405574;border-radius:8px;padding:10px 8px;font-size:10px;font-weight:800}",
 ".rol-review-actions button.primary{background:#66d9ff;color:#06101a;border-color:#66d9ff}.rol-review-close{background:#13213a;color:white;border:1px solid #405574;border-radius:8px;padding:6px 9px}",
 ".rol-review-preview{white-space:pre-wrap;overflow-wrap:anywhere;max-height:250px;overflow:auto;background:#060c16;border:1px solid #293e5d;border-radius:9px;padding:10px;color:#c7d5e7;font:10px/1.45 ui-monospace,monospace;margin-top:10px}",
 ".rol-review-status{font-size:10px;color:#91a0b8;margin-top:8px;line-height:1.45}",
 "@media(max-width:430px){.rol-review-trigger{left:125px;padding:8px 9px;font-size:10px}.rol-review-panel{left:7px;bottom:56px;width:calc(100vw - 14px);max-height:76vh;padding:11px}}"
 ].join("");
 document.head.appendChild(style);
 const trigger=document.createElement("button");
 trigger.type="button";trigger.className="rol-review-trigger";trigger.textContent="📄 Review / Email";
 trigger.setAttribute("aria-expanded","false");
 const panel=document.createElement("section");
 panel.className="rol-review-panel";panel.id="rolReviewPanel";
 panel.innerHTML=
  "<div class='rol-review-head'><h3>Page Answers · Review & Export</h3><button type='button' class='rol-review-close' id='rolReviewClose'>Close ✕</button></div>"+
  "<p>Build a private review copy of the answers and calculated results currently in this page. The report is generated on this device; it is not automatically uploaded or sent to any lender, buyer or contractor.</p>"+
  "<label for='rolReviewEmail'>Email recipient</label><input id='rolReviewEmail' type='email' placeholder='Enter the email address for your review copy' autocomplete='email'>"+
  "<div class='rol-review-actions'>"+
  "<button class='primary' id='rolReviewBuild' type='button'>↻ Build review</button>"+
  "<button id='rolReviewDownload' type='button'>⬇ Download TXT</button>"+
  "<button id='rolReviewCSV' type='button'>⬇ Download CSV</button>"+
  "<button id='rolReviewPDF' type='button'>🖨 Print / Save PDF</button>"+
  "<button id='rolReviewShare' type='button'>↗ Share file / Email</button>"+
  "<button id='rolReviewMail' type='button'>✉ Prepare email</button>"+
  "</div><div class='rol-review-status' id='rolReviewStatus'>Build a review to see the answers captured from this page.</div>"+
  "<div class='rol-review-preview' id='rolReviewPreview'>No review built yet.</div>";
 document.body.append(trigger,panel);
 let latestReport="",latestRows=[];
 function clean(value){return String(value==null?"":value).replace(/\s+/g," ").trim();}
 function isVisible(el){return !!(el&&el.getClientRects().length);}
 function sectionName(el){
  const section=el.closest("section");
  if(!section)return "General page";
  const heading=section.querySelector("h1,h2,h3,h4,.section-title strong,.section-title h2");
  return clean(heading&&heading.textContent)||clean(section.id)||"Page section";
 }
 function fieldLabel(el){
  if(el.id){
   const label=Array.from(document.querySelectorAll("label[for]")).find(x=>x.htmlFor===el.id);
   if(label)return clean(label.textContent);
  }
  const parent=el.closest("label");
  if(parent)return clean(parent.textContent.replace(el.value||"",""));
  return clean(el.getAttribute("aria-label")||el.getAttribute("placeholder")||el.name||el.id||el.tagName.toLowerCase());
 }
 function excluded(el){
  const key=[el.id,el.name,el.getAttribute("placeholder"),el.autocomplete].join(" ").toLowerCase();
  return el.type==="password"||el.type==="hidden"||/ssn|social.?security|date.?of.?birth|\bdob\b|api.?key|secret|token|password|access.?code/.test(key);
 }
 function readInputs(){
  const rows=[];
  document.querySelectorAll("input,select,textarea").forEach(el=>{
   if(excluded(el)||el.disabled)return;
   const type=(el.type||"").toLowerCase();
   if(["submit","button","reset","file"].includes(type))return;
   if(type==="radio"&&!el.checked)return;
   let value="";
   if(type==="checkbox")value=el.checked?"Yes / checked":"No / unchecked";
   else if(el.tagName==="SELECT"){const opt=el.options[el.selectedIndex];value=opt?clean(opt.textContent):"";}
   else value=clean(el.value);
   if(value)rows.push({section:sectionName(el),type:"Answer",question:fieldLabel(el),answer:value});
  });
  return rows;
 }
 function readOutputs(){
  const rows=[],seen=new Set();
  const selectors=[
   ".result-item",".stat","#rolGapScenarioResults","#rolWeatherStrip","#rolAddressWeatherCard",
   "#rolAuctionLookupLinks","#mapStatus","#symbolStatus","#boSignalStatus","#boRiskReadout",
   "#dueProgress","#rolScanStatus","#rolOptionTimeNote","#rolDte","#rolDebit",
   "#rolBreakeven","#rolIntrinsic","#rolOptionPL","#rolOptionReturn","#rolUniverseCount"
  ];
  document.querySelectorAll(selectors.join(",")).forEach(el=>{
   if(!isVisible(el))return;
   const value=clean(el.innerText||el.textContent);
   if(!value||value.length>4000||seen.has(value))return;
   seen.add(value);
   rows.push({section:sectionName(el),type:"Calculated result / status",question:clean(el.id||el.className||"Result"),answer:value});
  });
  document.querySelectorAll("output,[aria-live='polite'],[aria-live='assertive']").forEach(el=>{
   if(!isVisible(el))return;
   const value=clean(el.innerText||el.textContent);
   if(!value||value.length>1200||seen.has(value))return;
   seen.add(value);
   rows.push({section:sectionName(el),type:"Calculated result / status",question:clean(el.id||el.getAttribute("aria-label")||"Live result"),answer:value});
  });
  return rows;
 }
 function build(){
  const inputs=readInputs(),outputs=readOutputs();latestRows=inputs.concat(outputs);
  const now=new Date(),lines=[
   "RO'Lyfe Auction Capital Machine — Page Review",
   "Generated: "+now.toLocaleString(),"Page: "+location.href,
   "Answers captured: "+inputs.length,"Result/status items captured: "+outputs.length,"","REVIEW CONTENT"
  ];
  let last="";
  latestRows.forEach((row,i)=>{
   if(row.section!==last){last=row.section;lines.push("","## "+last);}
   lines.push((i+1)+". ["+row.type+"] "+row.question,"   "+row.answer);
  });
  if(!latestRows.length)lines.push("No answer fields or visible results were found.");
  lines.push("","IMPORTANT: This is a user-entered planning summary. Verify source documents, prices, parcel identity, lender terms, auction dates, calculations and provider timestamps independently. Passwords, API tokens, SSNs and dates of birth are deliberately excluded.");
  latestReport=lines.join("\n");
  $("rolReviewPreview").textContent=latestReport;
  $("rolReviewStatus").textContent=inputs.length+" answer fields and "+outputs.length+" result/status items captured. Review the content before sharing.";
  return latestReport;
 }
 function report(){return latestReport||build();}
 function filename(ext){
  const d=new Date(),stamp=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
  return "ROLyfe-Page-Review-"+stamp+"."+ext;
 }
 function download(name,content,type){
  const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=name;a.style.display="none";document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 function csvCell(v){return '"'+String(v==null?"":v).replace(/"/g,'""')+'"';}
 function makeCsv(){return ["Section,Type,Question,Answer"].concat(latestRows.map(r=>[r.section,r.type,r.question,r.answer].map(csvCell).join(","))).join("\r\n");}
 trigger.addEventListener("click",()=>{
  const open=panel.classList.toggle("open");trigger.setAttribute("aria-expanded",String(open));
  if(open&&!latestReport)build();
 });
 $("rolReviewClose").addEventListener("click",()=>{panel.classList.remove("open");trigger.setAttribute("aria-expanded","false");});
 $("rolReviewBuild").addEventListener("click",build);
 $("rolReviewDownload").addEventListener("click",()=>download(filename("txt"),report(),"text/plain;charset=utf-8"));
 $("rolReviewCSV").addEventListener("click",()=>{report();download(filename("csv"),makeCsv(),"text/csv;charset=utf-8");});
 $("rolReviewPDF").addEventListener("click",()=>{
  const w=window.open("","_blank");
  if(!w){$("rolReviewStatus").textContent="Pop-up blocked. Use Download TXT or allow pop-ups to print/save PDF.";return;}
  const safe=report().replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const closeScript="<scr"+"ipt>window.onload=function(){setTimeout(function(){window.print();},250)};</scr"+"ipt>";
  w.document.write("<!doctype html><html><head><title>RO'Lyfe Page Review</title><meta name='viewport' content='width=device-width,initial-scale=1'><style>body{font:12px/1.55 Arial,sans-serif;padding:25px;color:#111}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:12px/1.5 Arial,sans-serif}@media print{body{padding:0}}</style></head><body><pre>"+safe+"</pre>"+closeScript+"</body></html>");
  w.document.close();$("rolReviewStatus").textContent="Print dialog opened. Choose Save as PDF if available.";
 });
 $("rolReviewShare").addEventListener("click",async()=>{
  const text=report();
  try{
   if(typeof File!=="undefined"&&navigator.share){
    const file=new File([text],filename("txt"),{type:"text/plain"});
    if(!navigator.canShare||navigator.canShare({files:[file]})){
     await navigator.share({title:"RO'Lyfe Page Review",text:"Review copy from the RO'Lyfe Auction Capital Machine.",files:[file]});
     $("rolReviewStatus").textContent="Share sheet opened. Choose your email app or another destination.";return;
    }
   }
  }catch(error){
   if(error&&error.name==="AbortError"){$("rolReviewStatus").textContent="Share cancelled. The report remains available to download.";return;}
  }
  download(filename("txt"),text,"text/plain;charset=utf-8");
  $("rolReviewStatus").textContent="Report downloaded. Open your email app and attach the downloaded TXT file.";
 });
 document.addEventListener("input",event=>{
  if(!event.target.closest("#rolReviewPanel"))latestReport="";
 },true);
 document.addEventListener("change",event=>{
  if(!event.target.closest("#rolReviewPanel"))latestReport="";
 },true);
 $("rolReviewMail").addEventListener("click",()=>{
  const to=$("rolReviewEmail").value.trim();
  if(to&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)){
   $("rolReviewStatus").textContent="Enter a valid email address, or leave it blank to choose a recipient in your email app.";return;
  }
  const content=report(),subject=encodeURIComponent("RO'Lyfe Auction Capital Machine — Page Review");
  const body=encodeURIComponent(content.slice(0,12000)+(content.length>12000?"\n\n[Email draft shortened. Download the full TXT or CSV report separately.]":""));
  location.href="mailto:"+encodeURIComponent(to)+"?subject="+subject+"&body="+body;
  $("rolReviewStatus").textContent="Email draft prepared. Review it before sending. Attach the downloaded TXT/CSV for the complete copy.";
 });
 console.info("RO'Lyfe Review & Export ready");
})();