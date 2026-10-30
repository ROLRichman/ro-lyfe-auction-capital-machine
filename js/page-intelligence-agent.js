(function(){
if(window.__rolPageAI)return;window.__rolPageAI=true;
const url="https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/rol-page-ai";
const anon="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
const css=document.createElement("style");
css.textContent=".rol-ai-launch{position:fixed;right:14px;bottom:calc(176px + env(safe-area-inset-bottom));z-index:2450;width:54px;height:54px;border-radius:50%;background:#123958;color:#fff;border:2px solid #66d9ff;font-size:22px;box-shadow:0 0 22px #66d9ff55}.rol-ai-panel{display:none;position:fixed;right:10px;bottom:calc(238px + env(safe-area-inset-bottom));z-index:2451;width:min(390px,calc(100vw - 20px));max-height:min(54dvh,480px);overflow:auto;background:#081321;color:#eef7ff;border:1px solid #66d9ff;border-radius:15px;padding:12px;box-shadow:0 20px 60px #000b;overscroll-behavior:contain}.rol-ai-panel.open{display:block}.rol-ai-panel #rolAiClose{position:sticky;top:0;float:right;z-index:3;background:#17476a;color:#fff;border:2px solid #66d9ff;border-radius:999px;font-weight:800;padding:9px 13px;box-shadow:0 3px 12px #0009}.rol-ai-panel button,.rol-ai-panel select,.rol-ai-panel textarea{background:#142a43;color:#fff;border:1px solid #405b7a;border-radius:8px;padding:9px;margin:4px 2px}.rol-ai-panel textarea{width:100%;box-sizing:border-box;min-height:65px}.rol-ai-answer{white-space:pre-wrap;line-height:1.5;font-size:12px;background:#102039;padding:10px;border-radius:9px;max-height:180px;overflow:auto}.rol-ai-toast{position:fixed;right:76px;bottom:calc(182px + env(safe-area-inset-bottom));z-index:2449;background:#102039;color:#fff;border:1px solid #426587;border-radius:10px;padding:10px;font-size:11px;max-width:230px}.rol-ai-toast.hide{display:none}@media(max-width:650px){.rol-ai-launch{right:14px;bottom:calc(168px + env(safe-area-inset-bottom))}.rol-ai-panel{right:8px;bottom:calc(232px + env(safe-area-inset-bottom));width:calc(100vw - 16px);max-height:52dvh;padding:10px}.rol-ai-toast{right:76px;bottom:calc(176px + env(safe-area-inset-bottom));max-width:min(220px,calc(100vw - 100px))}}";
document.head.appendChild(css);
const launch=document.createElement("button");launch.className="rol-ai-launch";launch.textContent="✦";launch.title="RO'Lyfe AI";
const toast=document.createElement("div");toast.className="rol-ai-toast";toast.textContent="Ask me about this page — property, underwriting, trading and more.";
const panel=document.createElement("section");panel.className="rol-ai-panel";
panel.innerHTML="<b>✦ RO’Lyfe Page Intelligence</b><button id='rolAiClose' style='float:right'>Close ✕</button><p style='font-size:10px;color:#9eb4cf'>Ask about the page or a general topic. Speak or type. Speech features depend on browser support.</p><select id='rolAiTopic' style='width:100%'><option value=''>Choose a guided question…</option><option>Explain the property acquisition workflow from auction intake to closing.</option><option>Explain lender underwriting and how to calculate the funding gap.</option><option>Explain tax liens versus tax deeds and due diligence.</option><option>Explain EMA 40, EMA 200, VWAP, RSI, MACD and Stochastic.</option><option>Explain the option execution calculator and time to expiration.</option><option>Explain Regrid parcel research and county verification.</option><option>Explain Review / Email and how to download the report.</option></select><div id='rolAiAnswer' class='rol-ai-answer'>Hi! Choose a topic or ask a question.</div><textarea id='rolAiQuestion' placeholder='Ask a question…'></textarea><div><button id='rolAiAsk'>Ask AI ↗</button><button id='rolAiMic'>🎙 Speak</button><button id='rolAiRead'>🔊 Read answer</button><button id='rolAiStop'>■ Stop</button></div><div id='rolAiStatus' style='font-size:10px;color:#9eb4cf'>Questions and visible page text are sent securely to the AI service. Form values are not collected.</div><details><summary>Useful links & explainers</summary><a target='_blank' href='https://www.auction.com/'>Auction.com — listings; verify event details.</a><br><a target='_blank' href='https://app.regrid.com/'>Regrid — parcel data; verify with county records.</a><br><a target='_blank' href='https://www.pacourts.us/'>PA Courts — court research.</a><br><a target='_blank' href='https://www.tradingview.com/'>TradingView — charting.</a><br><a target='_blank' href='https://www.cboe.com/delayed_quotes/'>Cboe — delayed quote reference.</a></details>";
document.body.append(launch,toast,panel);
// Coordinate with the original AI Underwriter: never show two floating AI controls at once.
function syncWithUnderwriter(){
 const underwriter=document.getElementById("aiPanel");
 const active=!!underwriter&&underwriter.classList.contains("open");
 launch.style.display=active?"none":"";
 toast.style.display=active?"none":"";
 // Hide page-positioning/scroll controls while the underwriter is open;
 // these otherwise sit over the chat composer on small screens.
 document.querySelectorAll("button,a,[role='button']").forEach(el=>{
   const label=(el.innerText||el.getAttribute("aria-label")||el.title||"").replace(/\s+/g," ").trim();
   const isObstruction=/mid-page|lock screen|↑\s*top|back to top/i.test(label);
   if(active&&isObstruction){
     if(!el.dataset.rolAiHidden){el.dataset.rolAiHidden="1";el.dataset.rolAiDisplay=el.style.display||"";}
     el.style.setProperty("display","none","important");
   }else if(!active&&el.dataset.rolAiHidden){
     el.style.display=el.dataset.rolAiDisplay||"";
     delete el.dataset.rolAiHidden;delete el.dataset.rolAiDisplay;
   }
 });
}
const underwriter=document.getElementById("aiPanel");
if(underwriter){
 new MutationObserver(syncWithUnderwriter).observe(underwriter,{attributes:true,attributeFilter:["class"]});
 syncWithUnderwriter();
}

const $=id=>document.getElementById(id);
function open(){panel.classList.add("open");toast.classList.add("hide");}
launch.onclick=()=>panel.classList.contains("open")?panel.classList.remove("open"):open();
$("rolAiClose").onclick=()=>panel.classList.remove("open");
$("rolAiTopic").onchange=e=>{if(e.target.value){$("rolAiQuestion").value=e.target.value;ask();}};
async function ask(){
const q=$("rolAiQuestion").value.trim();if(!q){$("rolAiStatus").textContent="Enter a question first.";return;}
$("rolAiAnswer").textContent="Thinking…";$("rolAiAsk").disabled=true;
try{
const context=(document.body.innerText||"").replace(/\n{3,}/g,"\n\n").slice(0,13500);
const r=await fetch(url,{method:"POST",headers:{apikey:anon,Authorization:"Bearer "+anon,"Content-Type":"application/json"},body:JSON.stringify({question:q,pageContext:context}),cache:"no-store"});
const d=await r.json();if(!r.ok)throw new Error(d.error||("AI service HTTP "+r.status));
$("rolAiAnswer").textContent=d.answer||"No answer returned.";
$("rolAiStatus").textContent="Answered by "+(d.model||"RO'Lyfe AI")+". Verify live prices and official property records before acting.";
}catch(e){$("rolAiAnswer").textContent=e.message;$("rolAiStatus").textContent="The secure AI service is not configured or could not be reached. Voice playback can still read the on-screen message.";}
finally{$("rolAiAsk").disabled=false;}
}
$("rolAiAsk").onclick=ask;
$("rolAiQuestion").onkeydown=e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();ask();}};
$("rolAiRead").onclick=()=>{if(!window.speechSynthesis)return;$("rolAiStop").click();const u=new SpeechSynthesisUtterance($("rolAiAnswer").textContent);u.rate=1;u.lang="en-US";speechSynthesis.speak(u);};
$("rolAiStop").onclick=()=>{if(window.speechSynthesis)speechSynthesis.cancel();};
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(SR){const rec=new SR();rec.lang="en-US";rec.interimResults=false;rec.onresult=e=>{$("rolAiQuestion").value=e.results[0][0].transcript;ask();};rec.onerror=e=>$("rolAiStatus").textContent="Microphone: "+e.error;$("rolAiMic").onclick=()=>{try{rec.start();}catch(e){$("rolAiStatus").textContent="Microphone is already active.";}};}else $("rolAiMic").onclick=()=>$("rolAiStatus").textContent="Speech input is not supported in this browser; type instead.";
setTimeout(()=>toast.classList.add("hide"),4200);
})();