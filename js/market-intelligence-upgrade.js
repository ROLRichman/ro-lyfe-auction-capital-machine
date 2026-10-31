/* RO'Lyfe Market + Property Intelligence Upgrade — additive */
(function () {
  "use strict";
  if (window.__rolMarketUpgrade) return;
  window.__rolMarketUpgrade = true;
  const $ = (id) => document.getElementById(id);
  const mapStatusEl = () => $("rolMapStatus") || $("mapStatus");
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
  const style = document.createElement("style");
  style.textContent = [
    ".rol-map-search{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;align-items:center;padding:10px 12px;background:#0b1426;border-top:1px solid #263451}.rol-map-query-wrap{grid-column:1/-1;display:grid;gap:5px}.rol-map-query-wrap label{font-size:11px;color:#eaf4ff;font-weight:800}.rol-map-query-wrap small{font-size:10px;color:#91a0b8;line-height:1.4}.rol-map-query-wrap input{width:100%}",
    ".rol-map-search input,.rol-map-search select{min-width:0;width:100%;padding:9px;background:#080f1d;color:#f4f7fb;border:1px solid #344a69;border-radius:8px}",
    ".rol-map-search button,.rol-lookup-links a,.rol-market button{border:1px solid #405574;background:#13213a;color:#eef6ff;border-radius:8px;padding:9px 11px;font-size:11px;font-weight:700;text-decoration:none;cursor:pointer}",
    ".rol-map-search button.primary,.rol-market button.primary{background:#66d9ff;color:#06101a;border-color:#66d9ff}",
    ".rol-lookup-links{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding:10px 12px;background:#0b1426;border-top:1px solid #263451}",
    ".rol-lookup-links a{display:block;text-align:center;font-weight:600;overflow-wrap:anywhere}",
    ".rol-lookup-note{grid-column:1/-1;color:#91a0b8;font-size:10px;line-height:1.45}",
    ".rol-vault-fold{border:1px solid #34476a;border-radius:12px;background:#0c1323;margin:12px 0;overflow:hidden}",
    ".rol-vault-fold>summary{list-style:none;cursor:pointer;padding:13px 15px;color:#66d9ff;font-size:12px;font-weight:800}",
    ".rol-vault-fold>summary::-webkit-details-marker{display:none}",
    ".rol-vault-fold>summary:after{content:'＋';float:right;color:#91a0b8}.rol-vault-fold[open]>summary:after{content:'−'}",
    ".rol-vault-fold>.bo-grid,.rol-vault-fold>.bo-warning{margin:0 12px 12px}",
    ".rol-chart-tools{margin-top:10px;padding:12px;border:1px solid #34476a;border-radius:12px;background:#0b1426}",
    ".rol-chart-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
    ".rol-chart-height{display:grid;grid-template-columns:auto minmax(100px,1fr) auto;gap:9px;align-items:center;margin-top:10px;color:#a8bad1;font-size:10px}",
    ".rol-chart-height input{min-width:0;width:100%;accent-color:#66d9ff}",
    ".rol-chart-explain{margin-top:9px;border-top:1px solid #263451;padding-top:8px;color:#a8bad1;font-size:11px}",
    ".rol-chart-explain summary{cursor:pointer;color:#66d9ff;font-weight:700}",
    ".rol-indicator-panel{margin-top:12px;border:1px solid #34476a;border-radius:12px;padding:12px;background:#0b1426}",
    ".rol-indicator-panel h4{margin:0 0 5px;font-size:13px;color:#f4f7fb}",
    ".rol-indicator-panel p{margin:0 0 10px;color:#91a0b8;font-size:10px;line-height:1.45}",
    ".rol-indicator-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}",
    ".rol-indicator-grid.more{grid-template-columns:repeat(3,minmax(0,1fr))}",
    ".rol-indicator{border:1px solid #293e5d;border-radius:10px;padding:9px;background:#101d32;min-width:0}",
    ".rol-indicator strong{display:block;font-size:11px;color:#f4f7fb}",
    ".rol-indicator small{display:block;color:#91a0b8;font-size:9px;line-height:1.4;margin-top:5px}",
    ".rol-indicator svg{display:block;width:100%;height:38px;margin:4px 0}",
    ".rol-indicator details summary{cursor:pointer;list-style:none}",
    ".rol-indicator details summary::-webkit-details-marker{display:none}",
    ".rol-indicator details[open] .rol-indicator-detail{display:block}",
    ".rol-indicator-detail{display:none;color:#c2cee0;font-size:10px;line-height:1.45;padding-top:6px;border-top:1px solid #293e5d;margin-top:6px}",
    ".rol-all-indicators{margin-top:10px;border:1px solid #34476a;border-radius:10px;overflow:hidden}",
    ".rol-all-indicators>summary{cursor:pointer;padding:10px;color:#66d9ff;font-size:11px;font-weight:800;background:#101d32}",
    ".rol-visual-caveat{color:#91a0b8;font-size:9px;margin-top:10px;line-height:1.45}",
    ".rol-advanced{margin-top:12px;border:1px solid #34476a;border-radius:12px;background:#0b1426;overflow:hidden}",
    ".rol-advanced>summary{cursor:pointer;padding:13px;color:#66d9ff;font-size:12px;font-weight:800;background:#101d32}",
    ".rol-advanced-inner{padding:12px}",
    ".rol-scan-head{display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between}",
    ".rol-scan-tabs{display:flex;gap:6px;flex-wrap:wrap}",
    ".rol-market button.active{border-color:#66d9ff;color:#66d9ff}",
    ".rol-scan-search{margin:10px 0}",
    ".rol-scan-search input{width:100%;background:#080f1d;color:#f4f7fb;border:1px solid #344a69;border-radius:8px;padding:9px}",
    ".rol-live-scan-actions{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}.rol-live-scan-actions button{border:1px solid #405574;background:#13213a;color:#eef6ff;border-radius:8px;padding:9px 11px;font-size:10px;font-weight:800;cursor:pointer}.rol-live-scan-actions button.primary{background:#66d9ff;color:#06101a;border-color:#66d9ff}",
    ".rol-live-scan-wrap{overflow:auto;max-width:100%;border:1px solid #293e5d;border-radius:9px;margin:8px 0}.rol-live-scan{width:100%;min-width:860px;border-collapse:collapse;font-size:10px}.rol-live-scan th,.rol-live-scan td{padding:8px 9px;border-bottom:1px solid #293e5d;text-align:right;white-space:nowrap}.rol-live-scan th:first-child,.rol-live-scan td:first-child{text-align:left}.rol-live-scan th{color:#91a0b8;background:#101d32;position:sticky;top:0}.rol-live-scan button{background:none;border:0;color:#66d9ff;font-weight:800;padding:0;cursor:pointer}.rol-posture{display:inline-block;border:1px solid #50617a;border-radius:999px;padding:3px 7px;font-weight:800;font-size:9px}.rol-posture.bullish{color:#72e5a4;border-color:#347b55;background:#10291e}.rol-posture.bearish{color:#ff9292;border-color:#874848;background:#301919}.rol-posture.neutral{color:#f2d28b;border-color:#806b3e;background:#2b2415}.rol-posture-copy{display:block;white-space:normal;min-width:190px;max-width:235px;text-align:left;color:#a8bad1;font-size:9px;line-height:1.35;margin-top:4px}.rol-live-stamp{font-size:9px;color:#91a0b8;margin:5px 0}",
    ".rol-scan-status{color:#91a0b8;font-size:10px;margin:7px 0;line-height:1.45}",
    ".rol-symbol-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px;max-height:265px;overflow:auto}",
    ".rol-symbol{display:flex;flex-direction:column;align-items:flex-start;text-align:left;min-width:0;padding:7px!important}",
    ".rol-symbol strong{font-size:10px}.rol-symbol small{font-size:8px;color:#91a0b8}",
    ".rol-option-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:12px}",
    ".rol-option-grid label{display:flex;flex-direction:column;gap:5px;color:#91a0b8;font-size:10px}",
    ".rol-option-grid input,.rol-option-grid select{width:100%;min-width:0;background:#080f1d;color:#f4f7fb;border:1px solid #344a69;border-radius:8px;padding:9px}",
    ".rol-option-results{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:10px}",
    ".rol-option-results div{border:1px solid #293e5d;border-radius:9px;padding:9px;background:#101d32}",
    ".rol-option-results small{display:block;color:#91a0b8;font-size:9px}.rol-option-results strong{display:block;color:#f4f7fb;font-size:14px;margin-top:3px}",
    ".rol-market-note{font-size:10px;color:#91a0b8;line-height:1.5;margin:9px 0}",
    ".rol-quote-disclaimer{padding:10px;border:1px solid #765a25;background:rgba(255,209,102,.07);border-radius:9px;color:#e7d6ac;font-size:10px;line-height:1.5;margin:10px 0}",
    ".rol-sample-link{font-size:10px;color:#66d9ff;display:inline-block;margin-top:8px}",
    ".rol-trigger{top:68px!important}.rolhub{top:72px!important;max-height:76vh!important}",
    ".rol-fixed #rolLock{font-size:9px!important;padding:4px 7px!important;min-height:26px!important;line-height:1.1!important}",
    "@media(max-width:700px){.rol-map-search{grid-template-columns:repeat(2,minmax(0,1fr))}.rol-map-query-wrap{grid-column:1/-1}.rol-map-search button{width:100%;min-width:0}.rol-lookup-links{grid-template-columns:repeat(2,minmax(0,1fr))}.rol-indicator-grid,.rol-indicator-grid.more{grid-template-columns:repeat(2,minmax(0,1fr))}.rol-symbol-list{grid-template-columns:repeat(3,minmax(0,1fr))}.rol-option-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rol-option-results{grid-template-columns:repeat(2,minmax(0,1fr))}.rol-trigger{top:54px!important}.rolhub{top:60px!important;max-height:72vh!important}.rol-chart-height{grid-template-columns:1fr}.rol-chart-actions button{flex:1}}",
    "@media(max-width:390px){.rol-option-grid{grid-template-columns:1fr}.rol-symbol-list{grid-template-columns:repeat(2,minmax(0,1fr))}}",
    "@media print{.rol-map-search,.rol-lookup-links,.rol-chart-tools,.rol-advanced{display:none!important}}"
  ].join("");
  document.head.appendChild(style);

  // Collapse the complete Link Vault / Land Intelligence contents without hiding its heading.
  const vault = $("vault");
  if (vault && !vault.querySelector(".rol-vault-fold")) {
    const container = vault.querySelector(".container");
    const grid = container && container.querySelector(".bo-grid");
    if (container && grid) {
      const fold = document.createElement("details");
      fold.className = "rol-vault-fold";
      const summary = document.createElement("summary");
      summary.textContent = "Open Resource Link Vault & Land Intelligence";
      fold.appendChild(summary);
      grid.parentNode.insertBefore(fold, grid);
      fold.appendChild(grid);
      const warning = container.querySelector(".bo-warning");
      if (warning) fold.appendChild(warning);
    }
  }

  // Map: fix the mobile !important height conflict, invalidate Leaflet, and add a nearby address box.
  const map = $("auctionMap");
  const mapShell = map && map.closest(".auction-map-shell");
  if (map && mapShell) {
    const slider = $("rolHeight");
    const heightValue = $("rolHeightValue");
    const currentHeight = Math.max(280, Math.min(760, Math.round(map.getBoundingClientRect().height / 20) * 20 || 440));
    if (slider) {
      slider.value = String(currentHeight);
      if (heightValue) heightValue.textContent = currentHeight + " px";
      const applyHeight = function () {
        const height = Number(slider.value) || 440;
        map.style.setProperty("height", height + "px", "important");
        if (heightValue) heightValue.textContent = height + " px";
        if (window.ROLyfeAuctionMap && window.ROLyfeAuctionMap.resize) window.ROLyfeAuctionMap.resize();
        else window.dispatchEvent(new Event("resize"));
      };
      slider.oninput = applyHeight;
      slider.onchange = applyHeight;
      applyHeight();
    }

    if (!$("rolMapSearchRow")) {
      const search = document.createElement("div");
      search.className = "rol-map-search";
      search.id = "rolMapSearchRow";
      search.innerHTML =
        "<div class='rol-map-query-wrap'><label for='rolMapAddress'>PROPERTY ADDRESS / AUCTION URL · ONE SHARED INPUT</label><input id='rolMapAddress' type='text' autocomplete='street-address' placeholder='Enter street, city, state ZIP or paste an Auction.com URL'><small>Enter the location once, then choose one action below. Locate, Weather, Regrid and Auction Links each use this same field.</small></div>" +
        "<button class='primary' id='rolLocateAddress' type='button'>📍 Locate</button>" +
        "<button id='rolWeatherAddress' type='button'>☁ Weather here</button>" +
        "<button id='rolRegridLookup' type='button'>🧭 Regrid parcel</button>" +
        "<button id='rolBuildAuctionLinks' type='button'>🏠 Find home auction links</button>";
      const links = document.createElement("div");
      links.className = "rol-lookup-links";
      links.id = "rolAuctionLookupLinks";
      links.innerHTML = "<div class='rol-lookup-note'>Enter an address to build source-specific searches for residential auction homes, parcel records and auction timing. These are links to research sources, not verified listings.</div>";
      const insertAfter = mapShell.querySelector(".map-mode-bar") || mapShell.querySelector(".auction-map-head") || map;
      insertAfter.insertAdjacentElement("afterend", search);
      search.insertAdjacentElement("afterend", links);
      const addressInput = $("rolMapAddress");
      const priorAddress = $("address");
      if (priorAddress && priorAddress.value) addressInput.value = priorAddress.value;
      $("rolLocateAddress").addEventListener("click", function () {
        const raw = addressInput.value.trim();
        if (!raw) { const s=mapStatusEl(); if(s)s.textContent="Enter a property address or Auction.com URL first."; return; }
        const q = addressFromInput(raw);
        if (priorAddress) { priorAddress.value = q; priorAddress.dispatchEvent(new Event("input",{bubbles:true})); }
        if (window.ROLyfeAuctionMap && window.ROLyfeAuctionMap.locate) {
          window.ROLyfeAuctionMap.locate(q, "property");
          if (mapStatusEl()) mapStatusEl().textContent="Locating property and loading address weather…";
        }
        weatherForAddress(q);
      });
      $("rolWeatherAddress").addEventListener("click", function () {
        const q = addressFromInput(addressInput.value.trim());
        if (!q) { mapStatusEl().textContent="Enter an address or Auction.com URL first."; return; }
        weatherForAddress(q);
      });
      $("rolRegridLookup").addEventListener("click", function () {
        const q = addressFromInput(addressInput.value.trim());
        if (!q) { mapStatusEl().textContent="Enter an address or Auction.com URL first."; return; }
        lookupRegrid(q);
      });
      addressInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") $("rolBuildAuctionLinks").click();
      });
      $("rolBuildAuctionLinks").addEventListener("click", function () {
        const q = addressInput.value.trim();
        if (!q) { mapStatusEl().textContent="Enter an address or auction URL to build the research links."; return; }
        buildPropertyLinks(q);
      });
    }
  }

  function addressFromInput(raw) {
    const value=String(raw||"").trim();
    if(!/^https?:\/\//i.test(value))return value;
    try{
      const url=new URL(value);
      const slug=url.pathname.split("/").filter(Boolean).pop()||"";
      return slug.replace(/-\d+$/,"").replace(/-/g," ").replace(/\s+/g," ").trim();
    }catch(e){return value;}
  }

  async function weatherForAddress(address) {
    const status=mapStatusEl();
    if(status)status.textContent="Finding the address and checking current weather…";
    try{
      const geoUrl="https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q="+encodeURIComponent(address);
      const geoResponse=await fetch(geoUrl,{headers:{"Accept":"application/json"}});
      if(!geoResponse.ok)throw new Error("Address lookup HTTP "+geoResponse.status);
      const geo=await geoResponse.json();
      if(!Array.isArray(geo)||!geo.length)throw new Error("Address not found. Add city, state and ZIP.");
      const lat=Number(geo[0].lat),lon=Number(geo[0].lon);
      if(!Number.isFinite(lat)||!Number.isFinite(lon))throw new Error("Address coordinates were not valid.");
      const url="https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lon+"&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m,weather_code&temperature_unit=fahrenheit&timezone=auto";
      const response=await fetch(url);
      if(!response.ok)throw new Error("Weather service HTTP "+response.status);
      const data=await response.json();
      if(!data.current)throw new Error("No current weather returned for this location.");
      const c=data.current;
      const item={
        name:geo[0].name||address,lat,lon,
        temperature:Math.round(c.temperature_2m)+"°F",
        feels:Math.round(c.apparent_temperature)+"°F",
        wind:Math.round(c.wind_speed_10m)+" mph",
        humidity:c.relative_humidity_2m+"%"
      };
      let card=$("rolAddressWeatherCard");
      if(!card){card=document.createElement("div");card.id="rolAddressWeatherCard";card.className="rol-weather";const anchor=$("rolMapSearchRow")||document.querySelector(".auction-map-shell .map-mode-bar");if(anchor)anchor.insertAdjacentElement("afterend",card);}
      card.id="rolAddressWeatherCard";
      card.innerHTML="<div><b>Weather at searched address</b><strong>"+esc(item.temperature)+"</strong>Feels "+esc(item.feels)+" · Wind "+esc(item.wind)+"<br>Humidity "+esc(item.humidity)+"<br><small>"+esc(item.name)+" · Open-Meteo</small></div>";
      const mapped=window.ROLyfeAuctionMap&&window.ROLyfeAuctionMap.addWeatherMarkers
        ?window.ROLyfeAuctionMap.addWeatherMarkers([item]):false;
      if(status)status.textContent=mapped?"Address weather loaded · marker added to map":"Address weather loaded in card · map layer is not initialized yet";
    }catch(error){
      if(status)status.textContent="Address weather unavailable: "+(error&&error.message?error.message:"Check address and connection.");
    }
  }

  async function lookupRegrid(address) {
    const box=$("rolAuctionLookupLinks"),status=mapStatusEl();
    if(status)status.textContent="Requesting one matched parcel from Regrid…";
    const base="https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/regrid-parcel-lookup";
    const anon="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
    try{
      const response=await fetch(base+"?address="+encodeURIComponent(address),{
        headers:{apikey:anon,Authorization:"Bearer "+anon,Accept:"application/json"},
        cache:"no-store"
      });
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||("Regrid lookup HTTP "+response.status));
      if(!data.found){
        if(box)box.innerHTML="<div class='rol-lookup-note'>No Regrid parcel match: "+esc(data.message||"Try a more complete address.")+"</div>";
        if(status)status.textContent="Regrid returned no parcel match.";
        return;
      }
      const fields=[
        ["Matched address",data.match],["Parcel / APN",data.parcelNumber],["Owner of record",data.owner],
        ["Property use",data.propertyUse],["Zoning",data.zoning],["Year built",data.yearBuilt],
        ["Assessed value",data.assessedValue==null?null:"$"+Number(data.assessedValue).toLocaleString("en-US")],
        ["Last recorded sale",data.lastSalePrice==null?null:"$"+Number(data.lastSalePrice).toLocaleString("en-US")],
        ["Last sale date",data.lastSaleDate],["Annual property tax",data.annualTax==null?null:"$"+Number(data.annualTax).toLocaleString("en-US")],
        ["Tax year",data.taxYear],["Lot acres",data.acreage],["Parcel sq ft",data.parcelSquareFeet],
        ["Building sq ft",data.buildingSquareFeet],["Building footprint sq ft",data.buildingFootprintSquareFeet],
        ["County record last refreshed",data.countyDataLastRefresh],["FEMA flood zone",data.floodZone],
        ["County / State / ZIP",[data.county,data.state,data.zip].filter(Boolean).join(" · ")]
      ];
      if(box){
        box.innerHTML="<div class='rol-lookup-note'><strong>Regrid parcel match · one record returned</strong></div>"+
          fields.filter(x=>x[1]!==null&&x[1]!==undefined&&x[1]!=="").map(x=>"<div class='rol-lookup-note'><strong>"+esc(x[0])+":</strong> "+esc(x[1])+"</div>").join("")+
          (/^https?:\/\//i.test(data.countySourceUrl||"")?"<div class='rol-lookup-note'><a href='"+esc(data.countySourceUrl)+"' target='_blank' rel='noopener noreferrer'>Open county assessor record ↗</a></div>":"")+
          "<div class='rol-lookup-note'>Source: Regrid. Assessed value is not ARV or a current appraisal. Parcel match does not establish clear title, lien status, auction status, interior condition or legal ownership. Verify county records and source documents.</div>";
      }
      if(status)status.textContent="Regrid parcel returned · 1 result · verify county records and title separately";
    }catch(error){
      const message=error&&error.message?error.message:"Request failed.";
      if(box)box.innerHTML="<div class='rol-lookup-note'><strong>Regrid lookup:</strong> "+esc(message)+"</div>";
      if(status)status.textContent="Regrid not ready: "+message;
    }
  }

  function buildPropertyLinks(query) {
    const box = $("rolAuctionLookupLinks");
    if (!box) return;
    const isUrl = /^https?:\/\//i.test(query);
    const address = query.replace(/^https?:\/\//i,"").replace(/[/?#].*$/,"").trim();
    const encoded = encodeURIComponent(query);
    const homeTerms = " single family house home residential -land -commercial";
    const links = [];
    if (isUrl) links.push(["Open supplied auction listing",query]);
    links.push(["Auction.com · homes", "https://www.google.com/search?q="+encodeURIComponent("site:auction.com/details "+query+homeTerms)]);
    links.push(["Bid4Assets · residential", "https://www.google.com/search?q="+encodeURIComponent("site:bid4assets.com "+query+homeTerms)]);
    links.push(["RealAuction · residential", "https://www.google.com/search?q="+encodeURIComponent("site:realauction.com "+query+homeTerms)]);
    links.push(["Other auction sources", "https://www.google.com/search?q="+encodeURIComponent(query+" residential property auction foreclosure REO")]);
    links.push(["Parcel / owner lookup · Regrid", "https://app.regrid.com/profile"]);
    links.push(["Auction date / time search", "https://www.google.com/search?q="+encodeURIComponent(query+" auction date time sale terms")]);
    links.push(["County tax / recorder records", "https://www.google.com/search?q="+encodeURIComponent(query+" county property tax parcel recorder assessment")]);
    box.innerHTML = links.map((x) => "<a href='"+esc(x[1])+"' target='_blank' rel='noopener noreferrer'>"+esc(x[0])+" ↗</a>").join("") +
      "<div class='rol-lookup-note'>Homes-only wording is added to the search query. Search engines and auction sites decide what they return. Confirm property type, auction status, sale date/time, deposits, liens, occupancy and terms on the source page. RO’Lyfe does not scrape Auction.com or assert an auction date from a search result.</div>" +
      "<div class='rol-lookup-note'><a href='https://www.auction.com/details/2539-s-62nd-st-philadelphia-pa-2230442' target='_blank' rel='noopener noreferrer'>Open the sample Auction.com listing you supplied ↗</a></div>";
  }

  // TradingView's iframe is cross-origin: controls below it resize/reload the embed,
  // while the indicator cards are visual education guides rather than injected chart studies.
  const chartFrame = $("boChart");
  const chartCard = chartFrame && chartFrame.closest(".bo-card");
  const chartSymbol = $("boSymbol");
  const loadChart = $("boLoadChart");
  if (chartFrame && chartCard && !chartCard.querySelector(".rol-chart-tools")) {
    const tools = document.createElement("div");
    tools.className = "rol-chart-tools";
    tools.innerHTML =
      "<div class='rol-chart-actions'><button class='primary' id='rolRefreshChart' type='button'>↻ Refresh chart</button><button id='rolUseStockFirst' type='button'>Stock-first view</button><span id='rolChartHeightText' style='font-size:10px;color:#91a0b8'>Chart controls</span></div>" +
      "<label class='rol-chart-height'>Chart height <input id='rolChartHeight' type='range' min='260' max='760' step='20' value='430'><b id='rolChartHeightValue'>430 px</b></label>" +
      "<details class='rol-chart-explain'><summary>How to read this chart — simple steps</summary><ol><li>Start with the stock, not the option. Confirm the business/news context and broad market direction.</li><li>Read 6M/1D first, then 4H → 1H → 15M → 5M. Do not let a fast candle overrule the higher timeframe.</li><li>Mark support, resistance and the price that proves the idea wrong before planning entry.</li><li>Check trend, VWAP, momentum and volume together. One indicator alone is not a trade signal.</li><li>Only then review option expiry, spread, open interest, premium and maximum loss in the calculator below.</li></ol><p>RO’Lyfe Live Chart Desk draws the calculated studies from returned OHLCV bars. The data timestamp and provider coverage still depend on Tickerbot access.</p></details>";
    chartFrame.insertAdjacentElement("afterend", tools);
    $("rolRefreshChart").addEventListener("click", function () {
      if (loadChart) loadChart.click();
      else chartFrame.src = chartFrame.src;
    });
    $("rolUseStockFirst").addEventListener("click", function () {
      const interval = $("boInterval");
      if (interval) interval.value = "D";
      if (loadChart) loadChart.click();
      if ($("rolChartHeightText")) $("rolChartHeightText").textContent = "Daily stock-first chart loaded";
    });
    const heightSlider = $("rolChartHeight");
    const heightText = $("rolChartHeightValue");
    const applyChartHeight = function () {
      const h = Number(heightSlider.value) || 430;
      chartFrame.style.setProperty("height", "1650px", "important");
      if (heightText) heightText.textContent = h + " px · candles";
      try {
        if (chartFrame.contentWindow && chartFrame.contentWindow.ROLyfeChartDesk) {
          chartFrame.contentWindow.ROLyfeChartDesk.setChartHeight(h);
        } else if (chartFrame.contentWindow) {
          chartFrame.contentWindow.postMessage({type:"rol-set-chart-height",height:h}, "https://rolrichman.github.io");
        }
      } catch (e) {}
    };
    chartFrame.addEventListener("load", applyChartHeight);
    heightSlider.addEventListener("input", applyChartHeight);
    heightSlider.addEventListener("change", applyChartHeight);
    applyChartHeight();

    const indicators = [
      ["EMA Trend · 5/10/20/40/50/200","Trend alignment","Compare price with the five exponential averages. Short EMAs show near-term momentum; EMA 40 adds a medium-term trend reference, while EMA 50 and 200 add broader trend context. Stacked rising averages support an uptrend; tangled averages warn of chop.","M5/10/20/50/200"],
      ["VWAP","Session value","Compare price with the session volume-weighted average. Holding above VWAP can support an intraday bullish read; rejection below it can show sellers defending value. Reassess after each session.","VWAP"],
      ["RSI","Momentum / exhaustion","RSI measures the speed and magnitude of recent price changes. Strong trends can stay overbought or oversold; look for context, divergence and confirmation rather than automatic 70/30 reversals.","RSI"],
      ["MACD","Momentum change","MACD compares two moving averages and a signal line. Watch the zero line, signal crosses and histogram contraction/expansion for momentum shifts—not guaranteed direction.","MACD"],
      ["Stochastic","Range momentum","Stochastic compares the close with its recent high-low range. It is most useful in a range; in a strong trend it can remain overbought or oversold for a long time.","STO"],
      ["CCI","Deviation from average","CCI measures how far price deviates from its statistical average. Large positive/negative readings show unusual movement; use the trend and price structure to interpret them.","CCI"],
      ["TTM Squeeze","Volatility compression","A squeeze flags periods when volatility contracts. A release can precede a larger move, but it does not predict direction. Wait for price and volume confirmation.","TTM"],
      ["Volume","Participation","Compare current volume with recent bars and the time of day. Expanding volume can validate a breakout; thin volume can make a move easier to reverse.","VOL"],
      ["ATR","Typical movement / risk","Average True Range estimates recent volatility, not direction. Use it to judge whether a stop is unrealistically tight and to scale position risk to current movement.","ATR"],
      ["ADX","Trend strength","ADX estimates trend strength, not bullish or bearish direction. Pair it with price structure or a directional indicator before calling a trend.","ADX"],
      ["Bollinger Bands","Volatility envelope","Bands widen as volatility expands and narrow as it contracts. A band touch is not automatically a reversal; assess whether price is walking a band in a trend.","BB"],
      ["OBV","Volume flow","On-Balance Volume adds or subtracts volume based on close direction. Compare OBV swings with price swings for possible accumulation/distribution clues.","OBV"],
      ["Supertrend","Trend-following guide","A volatility-based trailing line can help organize trend direction and a potential invalidation level. It can whipsaw in sideways markets.","ST"],
      ["Relative Volume","Volume vs normal","Relative volume compares current activity with a comparable baseline. Higher-than-usual activity can make a move more meaningful, but liquidity and spreads still matter.","RVOL"]
    ];
    const trendSvg = "<svg viewBox='0 0 120 38' aria-hidden='true'><path d='M2 29 C20 26 27 22 42 20 S67 16 82 12 S102 9 118 5' fill='none' stroke='#66d9ff' stroke-width='2'/><path d='M2 34 C24 30 40 28 58 23 S91 19 118 14' fill='none' stroke='#54e39a' stroke-width='2'/><path d='M2 36 C35 34 65 31 118 25' fill='none' stroke='#ffd166' stroke-width='2'/></svg>";
    const oscSvg = "<svg viewBox='0 0 120 38' aria-hidden='true'><path d='M2 19 H118' stroke='#526987' stroke-dasharray='3 3'/><path d='M2 25 C12 4 20 7 30 18 S48 31 58 16 S78 4 88 18 S108 29 118 10' fill='none' stroke='#66d9ff' stroke-width='2'/></svg>";
    const barsSvg = "<svg viewBox='0 0 120 38' aria-hidden='true'><path d='M2 19 H118' stroke='#526987'/><g fill='#54e39a'><rect x='8' y='16' width='6' height='3'/><rect x='21' y='11' width='6' height='8'/><rect x='34' y='5' width='6' height='14'/><rect x='47' y='9' width='6' height='10'/><rect x='60' y='20' width='6' height='7'/><rect x='73' y='20' width='6' height='12'/><rect x='86' y='14' width='6' height='5'/><rect x='99' y='8' width='6' height='11'/></g></svg>";
    function visualFor(i) { return i===0||i===1||i===12 ? trendSvg : (i===3||i===7||i===11||i===13 ? barsSvg : oscSvg); }
    const panel = document.createElement("section");
    panel.className = "rol-indicator-panel";
    panel.innerHTML = "<h4>RO’Lyfe 14-Indicator Playbook</h4><p>Three core checks stay visible. Open the dropdown for the remaining studies. The mini visuals teach what to look for; the separate Live Chart Desk calculates its supported studies from loaded OHLCV candles.</p>";
    const core = document.createElement("div");
    core.className = "rol-indicator-grid";
    const rest = document.createElement("details");
    rest.className = "rol-all-indicators";
    rest.innerHTML = "<summary>＋ Open the other 11 indicators</summary>";
    const restGrid = document.createElement("div");
    restGrid.className = "rol-indicator-grid more";
    indicators.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "rol-indicator";
      card.innerHTML = "<details><summary><strong>"+esc(item[0])+"</strong>"+visualFor(i)+"<small>"+esc(item[1])+"</small></summary><div class='rol-indicator-detail'>"+esc(item[2])+"</div></details>";
      (i < 3 ? core : restGrid).appendChild(card);
    });
    rest.appendChild(restGrid);
    panel.appendChild(core);
    panel.appendChild(rest);
    const caveat = document.createElement("div");
    caveat.className = "rol-visual-caveat";
    caveat.textContent = "The playbook cards are visual explainers. The Live Chart Desk below the chart calculates its supported EMA, VWAP, RSI, MACD, Stochastic and other selectable studies from returned OHLCV candles; provider coverage and timeframe history vary.";
    panel.appendChild(caveat);
    tools.insertAdjacentElement("afterend", panel);

    // Advanced workspace — one symbol universe, three asset classes, and a stock-first option calculator.
    const advanced = document.createElement("details");
    advanced.className = "rol-advanced";
    advanced.innerHTML = "<summary>⚙ Advanced Mode · 130-symbol scanner + option execution calculator</summary><div class='rol-advanced-inner'><div class='rol-scan-head'><strong>Market Scanner Universe</strong><span id='rolUniverseCount' class='bo-pill'>130 symbols · watchlist only</span></div><div class='rol-scan-tabs'><button class='active' data-scan='stocks' type='button'>Stocks · 75</button><button data-scan='crypto' type='button'>Crypto · 25</button><button data-scan='futures' type='button'>Futures · 30</button></div><div class='rol-scan-search'><input id='rolScanSearch' placeholder='Filter ticker or instrument…'></div><div class='rol-live-scan-actions'><button class='primary' id='rolRunLiveScan' type='button'>↻ Run live scan · current list</button><span class='rol-scan-status'>Tickerbot provider snapshot · refresh cadence varies by field</span></div><div class='rol-scan-status'>Price, gap, relative volume and session VWAP update intraday on the provider cadence. RSI, Stochastic, MACD and ADX values in this scanner are daily post-close values. Technical posture is calculated from 1D direction, RSI, Stochastic, MACD histogram and ADX (18+ trend-strength filter); incomplete data or mixed confirmation stays Neutral / Waiting. Use the selected-timeframe candlestick studies below for intraday RSI / MACD / Stochastic.</div><div class='rol-scan-status' id='rolScanStatus'>Choose a market group, then run the live scan to retrieve actual provider prices and technical fields.</div><div id='rolLiveScanResults'></div><div class='rol-symbol-list' id='rolSymbolList'></div><div class='rol-quote-disclaimer'><strong>Live quote connection needed.</strong> The chart may show the data available from TradingView, but this scanner does not yet receive live stock, option or futures quote payloads. No prices are fabricated or labelled live. Connect a market-data provider through a secure server-side function before enabling quote columns or alerts.</div><div class='rol-market-note'><a href='https://developer.webull.com/apis/docs/market-data-api/overview/' target='_blank' rel='noopener noreferrer'>Webull Market Data API documentation ↗</a> · <a href='https://www.cmegroup.com/market-data/real-time-futures-and-options-data-api.html' target='_blank' rel='noopener noreferrer'>CME futures / options data API ↗</a></div><hr style='border-color:#263451;margin:14px 0'><h4>Stock-first Option Execution Calculator</h4><p class='rol-market-note'>Choose the underlying stock first, then estimate the option debit and expiration outcome. Use the option’s actual bid/ask, spread, open interest and expiry from your broker before considering an order.</p><div class='rol-option-grid'><label>Underlying symbol<input id='rolOptionSymbol' readonly></label><label>Option type<select id='rolOptionType'><option value='call'>Call</option><option value='put'>Put</option></select></label><label>Underlying price ($)<input id='rolUnderlyingPrice' type='number' min='0' step='0.01' value='10'></label><label>Strike price ($)<input id='rolStrike' type='number' min='0' step='0.01' value='10'></label><label>Option premium ($ / share)<input id='rolPremium' type='number' min='0' step='0.01' value='1'></label><label>Contracts<input id='rolContracts' type='number' min='1' step='1' value='1'></label><label>Expiration date<input id='rolExpiry' type='date'></label><label>Planned execution time (ET)<input id='rolExecutionTime' type='time' value='09:45'></label><label>Underlying target at expiry ($)<input id='rolTargetPrice' type='number' min='0' step='0.01' value='12'></label></div><div class='rol-option-results'><div><small>Days to expiration</small><strong id='rolDte'>—</strong></div><div><small>Total premium debit / max loss</small><strong id='rolDebit'>—</strong></div><div><small>Break-even at expiry</small><strong id='rolBreakeven'>—</strong></div><div><small>Intrinsic value at target</small><strong id='rolIntrinsic'>—</strong></div><div><small>Estimated P/L at expiry</small><strong id='rolOptionPL'>—</strong></div><div><small>Return on premium</small><strong id='rolOptionReturn'>—</strong></div></div><div class='rol-market-note' id='rolOptionTimeNote'>This is a payoff-at-expiration calculator, not an option-pricing model. It does not estimate implied volatility, theta, delta, spread, early exercise or the value before expiration.</div></div>";
    tools.insertAdjacentElement("afterend", advanced);
    const stocks = "AAPL MSFT NVDA AMZN GOOGL META TSLA AVGO AMD INTC QCOM MU ARM PLTR ORCL CRM NOW SNOW PANW CRWD NET DDOG MDB SMCI ANET DELL HPE IBM CSCO JPM BAC GS MS WFC C COIN HOOD SOFI XYZ PYPL V MA LLY XOM CVX OXY COP SLB CAT DE GE RTX LMT BA FDX UPS WMT COST TGT HD LOW NKE DIS NFLX ROKU SPY QQQ IWM DIA XLF XLK XLE SMH TLT GLD".split(" ");
    const cryptos = ["BTC","ETH","SOL","XRP","BNB","DOGE","ADA","AVAX","LINK","DOT","LTC","BCH","TRX","TON","SUI","APT","NEAR","ATOM","ETC","FIL","UNI","AAVE","SHIB","PEPE","ICP"];
    const futures = ["CME_MINI:ES1!","CME_MINI:NQ1!","CBOT_MINI:YM1!","CME_MINI:RTY1!","CME_MINI:MES1!","CME_MINI:MNQ1!","CBOT_MINI:MYM1!","CME_MINI:M2K1!","COMEX:GC1!","COMEX:SI1!","COMEX:HG1!","NYMEX:CL1!","NYMEX:NG1!","CBOT:ZB1!","CBOT:ZN1!","CBOT:ZF1!","CBOT:ZT1!","CBOT:ZC1!","CBOT:ZS1!","CBOT:ZW1!","CBOT:ZM1!","CBOT:ZL1!","CME:6E1!","CME:6J1!","CME:6B1!","CME:6A1!","CME:6C1!","CME:6S1!","CME:6M1!","NYMEX:RB1!"];
    if (stocks.length !== 75 || cryptos.length !== 25 || futures.length !== 30) {
      $("rolUniverseCount").textContent = stocks.length + " stocks · " + cryptos.length + " crypto · " + futures.length + " futures";
    }
    const groupData = {
      stocks: stocks.map((s) => ({name:s, tv:(["JPM","BAC","GS","MS","WFC","C","V","MA","XOM","CVX","OXY","COP","SLB","CAT","DE","GE","RTX","LMT","BA","FDX","UPS","WMT","COST","TGT","HD","LOW","NKE","DIS","NFLX","LLY"].includes(s) ? "NYSE:" : (["SPY","DIA","IWM","XLF","XLK","XLE","SMH","TLT","GLD"].includes(s) ? "AMEX:" : "NASDAQ:"))+s})),
      crypto: cryptos.map((s) => ({name:s, tv:s+"-USD"})),
      futures: futures.map((s) => ({name:s.split(":").pop(), tv:s}))
    };
    let currentGroup = "stocks";
    function renderSymbols() {
      const q = ($("rolScanSearch").value || "").trim().toUpperCase();
      const list = groupData[currentGroup].filter((x) => !q || x.name.includes(q) || x.tv.includes(q));
      $("rolSymbolList").innerHTML = list.map((x) => "<button class='rol-market rol-symbol' type='button' data-tv='"+esc(x.tv)+"'><strong>"+esc(x.name)+"</strong><small>"+esc(currentGroup)+" · chart</small></button>").join("") || "<div class='rol-scan-status'>No symbols match the filter.</div>";
      $("rolScanStatus").textContent = list.length+" instruments in this filtered view. Tap a ticker to load the same symbol in the chart. Scanner quotes remain disconnected until provider setup.";
    }
    advanced.querySelectorAll("[data-scan]").forEach((button) => button.addEventListener("click", function () {
      currentGroup = this.getAttribute("data-scan");
      advanced.querySelectorAll("[data-scan]").forEach((b) => b.classList.toggle("active", b === this));
      renderSymbols();
    }));
    $("rolScanSearch").addEventListener("input", renderSymbols);
    const tickerbotAnon="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbWR5ZmJrbHZ1b3NlcWRqbnh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3ODk5OTQsImV4cCI6MjEwODM2NTk5NH0._YEZj2GSnPcLGXmwgj98V_JzXdJIhTmOFoAH9BSia2I";
    const liveResults=$("rolLiveScanResults");
    async function runLiveScan(){
      const button=$("rolRunLiveScan");
      if(currentGroup==="futures"){
        $("rolScanStatus").textContent="Futures symbols remain in the 130-symbol list, but the active Tickerbot feed does not expose a futures asset class here. No prices will be fabricated.";
        liveResults.innerHTML="";
        return;
      }
      button.disabled=true;button.textContent="Loading provider rows…";
      $("rolScanStatus").textContent="Requesting live ticker rows for "+groupData[currentGroup].length+" selected symbols…";
      try{
        const assetClass=currentGroup==="crypto"?"crypto":"stocks";
        const symbols=groupData[currentGroup].map(x=>assetClass==="crypto"?"X:"+x.name+"USD":x.name);
        const params=new URLSearchParams({provider:"tickerbot-scan",asset_class:assetClass,symbols:symbols.join(","),limit:String(symbols.length)});
        const response=await fetch("https://ykmdyfbklvuoseqdjnxy.supabase.co/functions/v1/market-data?"+params.toString(),{
          headers:{apikey:tickerbotAnon,Authorization:"Bearer "+tickerbotAnon,Accept:"application/json"},
          cache:"no-store"
        });
        const data=await response.json();
        if(!response.ok)throw new Error(data.error||("Market scan HTTP "+response.status));
        const rows=Array.isArray(data.results)?data.results:[];
        const fmt=(v,d=2)=>v===null||v===undefined||!Number.isFinite(Number(v))?"—":Number(v).toLocaleString("en-US",{maximumFractionDigits:d});
        const pct=(v)=>v===null||v===undefined||!Number.isFinite(Number(v))?"—":(Number(v)*100).toFixed(2)+"%";
        const quoteRows=rows.map(row=>{
          const chartSymbol=assetClass==="crypto"?(String(row.ticker||"").replace(/^X:/,"").replace(/USD$/,"")+"-USD"):row.ticker;
          const metric=value=>value===null||value===undefined||value===""?NaN:Number(value);
          const change=metric(row.change_1d_pct),rsi=metric(row.rsi_14),stochK=metric(row.stochastic_k),stochD=metric(row.stochastic_d),macd=metric(row.macd_histogram),adx=metric(row.adx_14);
          const complete=[change,rsi,stochK,stochD,macd,adx].every(Number.isFinite);
          let posture="Neutral / Waiting",postureClass="neutral",postureCopy="Mixed indicators, weak confirmation, or no clear setup.";
          if(!complete)postureCopy="Mixed indicators, weak confirmation, or no clear setup. Waiting for complete provider data.";
          else{
            const bull=[change>0,rsi>=50,stochK>stochD,macd>0].filter(Boolean).length;
            const bear=[change<0,rsi<50,stochK<stochD,macd<0].filter(Boolean).length;
            if(adx>=18&&change>0&&macd>0&&bull>=3){posture="Bullish";postureClass="bullish";postureCopy="Trend and momentum support an upward setup.";}
            else if(adx>=18&&change<0&&macd<0&&bear>=3){posture="Bearish";postureClass="bearish";postureCopy="Trend and momentum support a downward setup.";}
          }
          return "<tr><td><button type='button' data-live-chart='"+esc(chartSymbol)+"'>"+esc(row.ticker||"—")+"</button></td><td><span class='rol-posture "+postureClass+"'>"+(posture==="Bullish"?"🏹 ↑ BULLISH":posture==="Bearish"?"🏹 ↓ BEARISH":"⏸ NEUTRAL / WAITING")+"</span><small class='rol-posture-copy'>"+postureCopy+"</small></td><td>"+fmt(row.price,4)+"</td><td>"+pct(row.change_1d_pct)+"</td><td>"+pct(row.gap_pct)+"</td><td>"+(row.relative_volume==null?"—":fmt(row.relative_volume,2)+"×")+"</td><td>"+fmt(row.rsi_14,1)+"</td><td>"+fmt(row.stochastic_k,1)+" / "+fmt(row.stochastic_d,1)+"</td><td>"+fmt(row.macd_histogram,4)+"</td><td>"+fmt(row.adx_14,1)+"</td></tr>";
        }).join("");
        liveResults.innerHTML=rows.length
          ?"<div class='rol-live-scan-stamp'>Provider as of "+esc(data.asOf||"timestamp not supplied")+" · "+rows.length+" returned of "+symbols.length+" requested. Null fields mean no provider coverage/value, not zero.</div><div class='rol-live-scan-wrap'><table class='rol-live-scan'><thead><tr><th>Symbol</th><th>Technical posture</th><th>Price</th><th>1D change</th><th>Gap</th><th>Rel Vol</th><th>RSI</th><th>Stoch K/D</th><th>MACD Hist</th><th>ADX</th></tr></thead><tbody>"+quoteRows+"</tbody></table></div>"
          :"<div class='rol-scan-status'>No current matches returned for this selected list. That is not proof that every symbol is inactive; check provider coverage and null fields.</div>";
        $("rolScanStatus").textContent="Tickerbot returned "+rows.length+" records for "+assetClass+". Tap a symbol in the result table to load it on the same candlestick chart.";
      }catch(error){
        liveResults.innerHTML="<div class='rol-scan-status'>Live scan unavailable: "+esc(error&&error.message?error.message:"Provider request failed.")+"</div>";
        $("rolScanStatus").textContent="Provider request did not complete. Check Edge Function status, API entitlement and data coverage.";
      }finally{
        button.disabled=false;button.textContent="↻ Run live scan · current list";
      }
    }
    $("rolRunLiveScan").addEventListener("click",runLiveScan);
    liveResults.addEventListener("click",function(event){
      const button=event.target.closest("[data-live-chart]");if(!button)return;
      const sym=button.getAttribute("data-live-chart");
      if(chartSymbol)chartSymbol.value=sym;
      if($("rolOptionSymbol"))$("rolOptionSymbol").value=sym;
      if(loadChart)loadChart.click();
    });
    $("rolSymbolList").addEventListener("click", function (event) {
      const button = event.target.closest("[data-tv]");
      if (!button) return;
      const selected=button.getAttribute("data-tv");
      if(currentGroup==="futures"){
        $("rolScanStatus").textContent=selected+" selected. Futures quotes/candles are not connected to this data provider yet; no synthetic price will be shown.";
        return;
      }
      if (chartSymbol) chartSymbol.value = selected;
      if ($("rolOptionSymbol")) $("rolOptionSymbol").value = selected;
      if (loadChart) loadChart.click();
      $("rolScanStatus").textContent=selected+" sent to the RO’Lyfe live candlestick chart. Quote availability is shown by the provider response.";
    });
    function syncSymbol() {
      if ($("rolOptionSymbol")) $("rolOptionSymbol").value = chartSymbol ? chartSymbol.value.trim().toUpperCase() : "NASDAQ:AAPL";
    }
    if (chartSymbol) {
      chartSymbol.addEventListener("input", syncSymbol);
      chartSymbol.addEventListener("change", syncSymbol);
    }
    syncSymbol();
    renderSymbols();
    const expiry = $("rolExpiry");
    if (expiry) {
      const d = new Date(); d.setDate(d.getDate()+30);
      expiry.value = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
    }
    function calcOption() {
      const type=$("rolOptionType").value, spot=Number($("rolUnderlyingPrice").value), strike=Number($("rolStrike").value),
        premium=Number($("rolPremium").value), qty=Math.max(1,Math.floor(Number($("rolContracts").value)||1)),
        target=Number($("rolTargetPrice").value), expiryDate=$("rolExpiry").value;
      const valid=[spot,strike,premium,target].every(Number.isFinite)&&spot>=0&&strike>=0&&premium>=0&&target>=0;
      const fmt=(n)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2}).format(n);
      const today=new Date(); today.setHours(0,0,0,0);
      const exp=expiryDate?new Date(expiryDate+"T00:00:00"):null;
      const dte=exp?Math.ceil((exp-today)/86400000):NaN;
      const debit=premium*100*qty, breakeven=type==="call"?strike+premium:strike-premium;
      const intrinsic=type==="call"?Math.max(0,target-strike):Math.max(0,strike-target);
      const pl=(intrinsic-premium)*100*qty, ret=debit>0?pl/debit*100:NaN;
      $("rolDte").textContent=Number.isFinite(dte)?(dte<0?"Expired":dte+" days"):"—";
      $("rolDebit").textContent=fmt(debit);
      $("rolBreakeven").textContent=fmt(breakeven);
      $("rolIntrinsic").textContent=fmt(intrinsic);
      $("rolOptionPL").textContent=valid?fmt(pl):"—";
      $("rolOptionReturn").textContent=valid&&debit>0?ret.toFixed(1)+"%":"—";
      $("rolOptionTimeNote").textContent="Planned execution: "+($("rolExecutionTime").value||"not set")+" ET · Expiration: "+(expiryDate||"not set")+". Payoff assumes the option is held to expiration and ignores fees. This is not an option quote or recommendation; confirm the actual contract and market spread.";
    }
    ["rolOptionType","rolUnderlyingPrice","rolStrike","rolPremium","rolContracts","rolExpiry","rolExecutionTime","rolTargetPrice"].forEach((id) => $(id).addEventListener("input",calcOption));
    ["rolOptionType","rolExpiry"].forEach((id) => $(id).addEventListener("change",calcOption));
    calcOption();
  }

  // Reposition compact controls and give the lock button less visual weight.
  const trigger = document.querySelector(".rol-trigger");
  if (trigger) trigger.style.top = "68px";
  const lock = $("rolLock");
  if (lock) { lock.style.padding="4px 7px"; lock.style.fontSize="9px"; lock.style.minHeight="26px"; }


  // Refresh current conditions and place those same readings on the map.
  const weatherButton = $("rolWeatherBtn");
  if (weatherButton) {
    weatherButton.onclick = async function () {
      const status = mapStatusEl();
      if (status) status.textContent = "Loading current weather and map markers…";
      const cities = [
        ["Philadelphia",39.9526,-75.1652],
        ["New York",40.7128,-74.0060],
        ["Pittsburgh",40.4406,-79.9959]
      ];
      try {
        const data = await Promise.all(cities.map(async function (city) {
          const url = "https://api.open-meteo.com/v1/forecast?latitude="+city[1]+"&longitude="+city[2]+"&current=temperature_2m,apparent_temperature,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit&timezone=America%2FNew_York";
          const response = await fetch(url);
          if (!response.ok) throw new Error("Weather service HTTP "+response.status);
          const json = await response.json();
          if (!json.current) throw new Error("Weather response was incomplete for "+city[0]);
          return {
            name:city[0],lat:city[1],lon:city[2],
            temperature:Math.round(json.current.temperature_2m)+"°F",
            feels:Math.round(json.current.apparent_temperature)+"°F",
            wind:Math.round(json.current.wind_speed_10m)+" mph",
            humidity:json.current.relative_humidity_2m+"%"
          };
        }));
        let strip=$("rolWeatherStrip");
        if(!strip){
          strip=document.createElement("div");
          strip.id="rolWeatherStrip";
          strip.className="rol-weather";
          weatherButton.parentElement.insertAdjacentElement("afterend",strip);
        }
        strip.innerHTML=data.map(function(x){
          return "<div><b>"+esc(x.name)+"</b><strong>"+x.temperature+"</strong>Feels "+x.feels+" · Wind "+x.wind+"<br>Humidity "+x.humidity+"</div>";
        }).join("");
        const mapped=window.ROLyfeAuctionMap&&window.ROLyfeAuctionMap.addWeatherMarkers
          ? window.ROLyfeAuctionMap.addWeatherMarkers(data) : false;
        if(status) status.textContent=mapped
          ? "Weather loaded · 3 city readings pinned on the map · Open-Meteo"
          : "Weather loaded in cards · map markers unavailable until Leaflet is ready";
      } catch(error) {
        if(status) status.textContent="Weather refresh failed: "+(error&&error.message?error.message:"Check your connection and retry.");
      }
    };
  }


  // Find a Gapper: five educational deal examples with lender-style screening.
  const gapperStyle=document.createElement("style");
  gapperStyle.textContent=[
    ".rol-gapper-trigger{position:fixed;left:12px;bottom:18px;z-index:2250;border:1px solid #66d9ff;border-radius:22px;padding:10px 14px;background:#10243b;color:#66d9ff;font-size:12px;font-weight:850;box-shadow:0 8px 25px #0008}",
    ".rol-gapper-panel{position:fixed;left:12px;bottom:68px;z-index:2251;width:min(470px,calc(100vw - 24px));max-height:78vh;overflow:auto;overscroll-behavior:contain;background:#091323;border:1px solid #39506f;border-radius:16px;box-shadow:0 24px 70px #000b;padding:14px;display:none;color:#eef6ff}",
    ".rol-gapper-panel.open{display:block}.rol-gapper-head{display:flex;align-items:center;justify-content:space-between;gap:10px}.rol-gapper-head h3{margin:0;font-size:17px}.rol-gapper-close{border:1px solid #405574;background:#13213a;color:#eef6ff;border-radius:8px;padding:6px 9px}",
    ".rol-gapper-panel p{font-size:11px;color:#a8bad1;line-height:1.5}.rol-gapper-panel label{display:block;font-size:10px;color:#a8bad1;margin:10px 0 5px}.rol-gapper-panel select{width:100%;padding:10px;background:#080f1d;color:#f4f7fb;border:1px solid #344a69;border-radius:8px}",
    ".rol-gap-results{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:10px 0}.rol-gap-results>div{min-width:0;padding:10px;border:1px solid #293e5d;border-radius:9px;background:#101d32}.rol-gap-results small{display:block;color:#91a0b8;font-size:9px}.rol-gap-results strong{display:block;font-size:15px;margin-top:3px;overflow-wrap:anywhere}",
    ".rol-gap-status{padding:10px;border:1px solid #3c5877;background:#0d1c30;border-radius:9px;font-size:11px;line-height:1.5;color:#eaf2ff}.rol-gap-status.warn{border-color:#896528;background:#261d10;color:#f5dfad}",
    ".rol-gap-actions{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.rol-gap-actions button{border:1px solid #405574;background:#13213a;color:#eef6ff;border-radius:8px;padding:9px 10px;font-size:10px;font-weight:800}.rol-gap-actions button.primary{background:#66d9ff;color:#06101a;border-color:#66d9ff}",
    ".rol-gap-details{border:1px solid #293e5d;border-radius:9px;margin:8px 0;background:#0d182a;overflow:hidden}.rol-gap-details summary{cursor:pointer;padding:10px;font-size:11px;font-weight:800;color:#66d9ff}.rol-gap-details .rol-gap-body{padding:0 11px 11px;color:#c3d0df;font-size:10px;line-height:1.55}.rol-gap-body b{color:#f4f7fb}.rol-gap-body ul{padding-left:17px;margin:6px 0}.rol-gap-body li{margin:4px 0}",
    ".rol-gap-note{font-size:9px!important;color:#91a0b8!important;line-height:1.5}.rol-gap-bar{height:7px;background:#182a40;border-radius:20px;overflow:hidden;margin:8px 0}.rol-gap-bar i{display:block;height:100%;background:#66d9ff}",
    "@media(max-width:650px){.rol-gapper-panel{left:8px;bottom:66px;width:calc(100vw - 16px);max-height:75vh;padding:11px}.rol-gapper-trigger{left:8px;bottom:12px;padding:9px 11px}.rol-gap-results{grid-template-columns:repeat(2,minmax(0,1fr))}}"
  ].join("");
  document.head.appendChild(gapperStyle);

  const gapperScenarios=[
    {id:"starter",name:"$75K · REO starter rental",type:"buyhold",purchase:75000,arv:130000,rehab:20000,closing:7500,selling:10400,buyerCash:20000,targetProfit:15000,contingency:5000,rate:9.5,months:6,explain:"A lower-price REO may look attractive on equity, but the illustrative 75% loan is only $56,250—below the partner's indicative $75,000 minimum loan. The model therefore treats lender proceeds as $0 until a different product is confirmed."},
    {id:"deed",name:"$150K · tax-deed acquisition",type:"deed",purchase:150000,arv:260000,rehab:25000,closing:17000,selling:20800,buyerCash:125000,targetProfit:40000,contingency:7500,rate:0,months:6,explain:"A tax-lien certificate is a claim, not an immediate house purchase. A tax-deed/foreclosure deed transaction still needs statutory notice, sale confirmation, deed recording, redemption review where applicable, possession and insurable-title checks. This illustration assumes $0 lender advance at the auction stage."},
    {id:"flip250",name:"$250K · fix-and-flip",type:"flip",purchase:250000,arv:420000,rehab:50000,closing:15000,selling:33600,buyerCash:20000,targetProfit:60000,contingency:10000,rate:12,months:6,explain:"At 70% of the $420,000 ARV, the notional facility ceiling is $294,000. That does not mean the lender wires $294,000 at closing: rehab may be reimbursed by draw, and the lender can impose purchase-price, LTC, liquidity, credit, experience and property-condition caps."},
    {id:"hold350",name:"$350K · buy-and-hold rental",type:"buyhold",purchase:350000,arv:450000,rehab:15000,closing:30000,selling:0,buyerCash:100000,targetProfit:35000,contingency:10000,rate:9.5,months:12,explain:"The 75% lower-of-purchase/value screen gives $262,500. The estimated principal-and-interest payment below uses an assumed 9.5% fixed rate over 30 years. It excludes taxes, insurance, HOA, repairs, vacancy and lender fees; rent must be verified before DSCR or cash-flow conclusions."},
    {id:"flip500",name:"$500K · larger fix-and-flip",type:"flip",purchase:500000,arv:750000,rehab:65000,closing:35000,selling:60000,buyerCash:50000,targetProfit:90000,contingency:15000,rate:12,months:8,explain:"A 70% ARV ceiling is $525,000. With $50,000 of buyer cash, the simplified gap is $25,000. A lender will still review sponsor experience, credit, liquidity, detailed rehab budget, valuation support, project timeline and the exit buyer/market."}
  ];
  const gapperTrigger=document.createElement("button");
  gapperTrigger.type="button";gapperTrigger.className="rol-gapper-trigger";gapperTrigger.textContent="🧩 Find a Gapper";
  gapperTrigger.title="Open property purchase and lender gap walkthrough";
  const gapper=document.createElement("aside");
  gapper.className="rol-gapper-panel";gapper.id="rolGapperPanel";
  gapper.innerHTML="<div class='rol-gapper-head'><h3>Find a Gapper · Deal-to-Lender Desk</h3><button type='button' class='rol-gapper-close' id='rolGapperClose'>Close ✕</button></div>"+
    "<p>Pick a property example. The desk estimates the money required, a possible lender ceiling and the remaining gap. These are worked examples—not a valuation, loan quote or approval.</p>"+
    "<label for='rolGapScenario'>Choose a property scenario</label><select id='rolGapScenario'>"+gapperScenarios.map((x,i)=>"<option value='"+x.id+"'"+(i===0?" selected":"")+">"+esc(x.name)+"</option>").join("")+"</select>"+
    "<div id='rolGapScenarioResults'></div>"+
    "<div class='rol-gap-actions'><button class='primary' id='rolGapUseCalc' type='button'>Use numbers in Financial Toolbox</button><button id='rolGapToPartner' type='button'>Open Partner Desk worksheet</button></div>"+
    "<details class='rol-gap-details'><summary>① How buying an REO / bank-owned home works</summary><div class='rol-gap-body'><ol><li><b>Find and identify:</b> confirm the exact address, parcel/APN, auction seller, residential type and ownership.</li><li><b>Read sale rules:</b> registration, deposits/EMD, proof of funds, cash-only rules, buyer premium, closing deadline, access and occupancy.</li><li><b>Inspect the risk:</b> title/lien/tax/municipal review, insurance, flood, condition, repairs and possession. Auction purchases are commonly as-is; read that auction's terms.</li><li><b>Price the deal:</b> use supported comparable sales, contractor scope, carrying/closing/selling costs and a contingency—not just an online estimate.</li><li><b>Arrange funds:</b> show cash to close and a lender's written eligibility/terms before relying on financing. Many auction deadlines are shorter than normal mortgage timelines.</li><li><b>Close and execute:</b> follow deed/closing instructions, secure property, complete rehab and exit through a verified buyer or rental strategy.</li></ol></div></details>"+
    "<details class='rol-gap-details'><summary>② How a tax lien differs from a tax deed</summary><div class='rol-gap-body'><b>Tax lien certificate:</b> you acquire a statutory tax claim/certificate and rights defined by that jurisdiction; you do not automatically own the house. Redemption, notice and foreclosure procedures apply.<br><b>Tax deed / tax foreclosure sale:</b> the process may transfer title after statutory requirements and deed recording. Redemption rights, notice defects, title insurability, possession and surviving interests vary by state and county.<br><b>Rule:</b> do not market a lien as a house purchase or assume a deed is immediately financeable. Confirm the official county process and have a title/real-estate attorney review the file.</div></details>"+
    "<details class='rol-gap-details'><summary>③ What the lender underwriter needs to see</summary><div class='rol-gap-body'><ul><li>Borrower/guarantor and borrowing entity; ownership/authorized signer details.</li><li>Property address, parcel, property type, purchase contract or auction terms, deposits and close date.</li><li>ARV supported by relevant closed comparable sales, condition and photos/inspection status.</li><li>Contractor's written scope and line-item labor/material budget, permits, timeline, insurance and draw schedule.</li><li>Borrower experience: prior sales history, REO schedule, landlord/flip track record and liquidity/POF.</li><li>Use of funds, requested loan, cash contribution, reserves, proposed exit, rent/expenses for hold deals.</li><li>Title, tax, municipal, lien, occupancy, insurance, zoning and flood checks where applicable.</li></ul><b>Do not send SSNs or dates of birth by ordinary email.</b> Use the lender's approved secure application channel.</div></details>"+
    "<details class='rol-gap-details'><summary>④ Contractor meeting · questions to ask</summary><div class='rol-gap-body'><ul><li>Walk the property and produce a written room-by-room / trade-by-trade scope.</li><li>Separate labor, materials, permits, disposal, contingency and owner-supplied items.</li><li>Confirm licenses, insurance, references, start date, duration and who supervises subs.</li><li>Set draw milestones based on completed, inspected work—not just calendar dates.</li><li>Agree change-order approvals, warranties, lien waivers and cleanup/security responsibilities.</li><li>Ask: would you buy this property, bring a buyer, or partner? What price and terms?</li></ul></div></details>"+
    "<details class='rol-gap-details'><summary>⑤ Buyer / investor conversation · questions to ask</summary><div class='rol-gap-body'><ul><li>Are you the end buyer, landlord, cash buyer, operator or capital partner?</li><li>What property type, price band, neighborhood and return/risk profile fit?</li><li>What is your maximum price after inspection, repairs, title, taxes and closing costs?</li><li>Can you show proof of funds or lender pre-qualification and close by the auction deadline?</li><li>Will you buy as-is, take occupancy risk, or need an interior inspection?</li><li>For investors: what capital amount, preferred structure, decision process and exit?</li></ul></div></details>"+
    "<p class='rol-gap-note'>The partner profile discussed previously is an indicative screening reference only: buy/hold may be capped around 75% of the lower of purchase price or value, with a stated minimum loan; fix/flip may be screened around 70–75% of ARV and require prior experience and borrower qualifications. Reconfirm today's guidelines directly with the funding partner. A lender may size to a lower amount or decline.</p>";
  document.body.append(gapperTrigger,gapper);
  gapperTrigger.addEventListener("click",()=>gapper.classList.toggle("open"));
  $("rolGapperClose").addEventListener("click",()=>gapper.classList.remove("open"));

  const currency=value=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(value)||0);
  function gapCalc(x){
    const upfront=x.purchase+x.rehab+x.closing;
    const saleMargin=x.arv-upfront-x.selling;
    let lender=0,loanRule="",blocker="";
    if(x.type==="deed"){loanRule="No auction-stage advance assumed";blocker="Tax-deed/title/insurability review: assumed lender proceeds $0 at auction stage.";}
    else if(x.type==="buyhold"){
      const candidate=Math.min(x.purchase,x.arv)*.75;
      if(candidate<75000){loanRule="75% lower-of-price/value = "+currency(candidate);blocker="Below the indicative $75,000 minimum loan; this example does not qualify under that product.";}
      else{lender=Math.min(candidate,upfront);loanRule="75% of lower purchase/value = "+currency(candidate);blocker="Subject to borrower, property, debt-service, reserve and loan-size underwriting.";}
    }else{
      lender=Math.min(x.arv*.70,upfront);
      loanRule="70% of ARV screening cap = "+currency(x.arv*.70);
      blocker="Subject to experience, credit, liquidity, appraisal, purchase/LTC caps and rehab draws.";
    }
    const gap=Math.max(0,upfront-lender-x.buyerCash);
    const equity=x.arv-upfront;
    let monthly=null;
    if(x.type==="buyhold"&&lender>0){
      const r=x.rate/1200,n=360;
      monthly=r>0?lender*r/(1-Math.pow(1+r,-n)):lender/n;
    }
    return {upfront,saleMargin,equity,lender,gap,loanRule,blocker,monthly};
  }
  function renderGapper(){
    const id=$("rolGapScenario").value,x=gapperScenarios.find(s=>s.id===id)||gapperScenarios[0],r=gapCalc(x);
    const status=r.gap===0?"No modeled cash gap after the assumed loan and buyer contribution. Confirm loan draws and closing cash.":"Modeled additional capital gap: "+currency(r.gap)+". Find the gap through lower purchase price, more buyer cash, a qualified partner or a different capital structure.";
    $("rolGapScenarioResults").innerHTML=
      "<div class='rol-gap-results'>"+
      "<div><small>Purchase price</small><strong>"+currency(x.purchase)+"</strong></div>"+
      "<div><small>Estimated ARV</small><strong>"+currency(x.arv)+"</strong></div>"+
      "<div><small>Cash needed before lender / sale</small><strong>"+currency(r.upfront)+"</strong></div>"+
      "<div><small>Illustrative lender ceiling</small><strong>"+currency(r.lender)+"</strong></div>"+
      "<div><small>Buyer cash assumed</small><strong>"+currency(x.buyerCash)+"</strong></div>"+
      "<div><small>Remaining capital gap</small><strong>"+currency(r.gap)+"</strong></div>"+
      "<div><small>Indicative sale spread before financing/tax</small><strong>"+(x.type==="buyhold"?"Not sold · equity cushion "+currency(r.equity):currency(r.saleMargin))+"</strong></div>"+
      "<div><small>Sale / disposition costs assumed</small><strong>"+currency(x.selling)+"</strong></div>"+
      "</div>"+
      "<div class='rol-gap-status"+(r.gap>0?" warn":"")+"'><b>Underwriting view:</b> "+esc(r.loanRule)+". "+esc(r.blocker)+"</div>"+
      (r.monthly?"<div class='rol-gap-status'>Illustrative monthly principal & interest at "+x.rate.toFixed(1)+"% over 30 years: <b>"+currency(r.monthly)+"/mo</b>. Excludes tax, insurance, HOA, utilities, vacancy, maintenance, lender fees and reserves.</div>":"")+
      "<p>"+esc(x.explain)+"</p>"+
      "<p class='rol-gap-note'>Gross sale spread = ARV − purchase − rehab − closing/holding − assumed selling cost. The cash gap is a simplified planning estimate; lenders may hold back rehab draws, exclude closing costs, require reserves and apply lower caps. No number is an approval or guaranteed profit.</p>";
    return {scenario:x,result:r};
  }
  $("rolGapScenario").addEventListener("change",renderGapper);
  $("rolGapUseCalc").addEventListener("click",()=>{
    const data=renderGapper(),x=data.scenario,r=data.result;
    const setValue=(id,value)=>{const el=$(id);if(el)el.value=String(value);};
    setValue("boArv",x.arv);setValue("boRehab",x.rehab);
    setValue("boClosing",x.closing+x.selling);setValue("boProfit",x.targetProfit);
    setValue("boContingency",x.contingency);setValue("boCurrentBid",x.purchase);
    setValue("boProjectCost",r.upfront);setValue("boBuyerCash",x.buyerCash);
    setValue("boLoanAmount",r.lender);setValue("boCollateralValue",x.arv);
    setValue("boRate",x.rate||0);setValue("boMonths",x.months);
    ["boCalcBid","boCalcFunding"].forEach(id=>$(id)?.click());
    gapper.classList.remove("open");
    const section=$("calculators");if(section)section.scrollIntoView({behavior:"smooth",block:"start"});
  });
  $("rolGapToPartner").addEventListener("click",()=>{
    gapper.classList.remove("open");
    const section=$("partner-underwriting");
    if(section)section.scrollIntoView({behavior:"smooth",block:"start"});
    else window.scrollTo({top:document.documentElement.scrollHeight,behavior:"smooth"});
  });
  renderGapper();

  console.info("RO'Lyfe Market + Property Intelligence Upgrade ready");
})();