/*
 * RO'Lyfe Auction Capital Machine — Map Repair Bridge
 * Additive repair for the existing #auctionMap controls.
 *
 * Notes:
 * - Uses Leaflet already referenced by index.html.
 * - OpenStreetMap tiles require an internet connection and attribution.
 * - Address lookup is user-triggered only (Nominatim); no bulk geocoding.
 * - State markers are approximate state-capital reference points, not boundaries.
 * - County mode geocodes the entered county/state as a location pin, not a boundary.
 * - No weather, risk, or live auction data is claimed by this file.
 */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const state = {
    map: null,
    tileLayer: null,
    markers: null,
    mode: "global",
    busy: false,
    lastLookupAt: 0
  };

  const cityPins = [
    ["Seattle", 47.6062, -122.3321], ["San Francisco", 37.7749, -122.4194],
    ["Los Angeles", 34.0522, -118.2437], ["Phoenix", 33.4484, -112.0740],
    ["Denver", 39.7392, -104.9903], ["Dallas", 32.7767, -96.7970],
    ["Minneapolis", 44.9778, -93.2650], ["Chicago", 41.8781, -87.6298],
    ["St. Louis", 38.6270, -90.1994], ["Nashville", 36.1627, -86.7816],
    ["Atlanta", 33.7490, -84.3880], ["Miami", 25.7617, -80.1918],
    ["Charlotte", 35.2271, -80.8431], ["Washington, DC", 38.9072, -77.0369],
    ["Philadelphia", 39.9526, -75.1652], ["New York", 40.7128, -74.0060],
    ["Boston", 42.3601, -71.0589], ["Detroit", 42.3314, -83.0458],
    ["Salt Lake City", 40.7608, -111.8910], ["Portland", 45.5152, -122.6784]
  ];

  // Approximate state-capital reference points; not legal or boundary data.
  const capitals = [
    ["Montgomery, AL",32.3668,-86.3000],["Juneau, AK",58.3019,-134.4197],
    ["Phoenix, AZ",33.4484,-112.0740],["Little Rock, AR",34.7465,-92.2896],
    ["Sacramento, CA",38.5816,-121.4944],["Denver, CO",39.7392,-104.9903],
    ["Hartford, CT",41.7658,-72.6734],["Dover, DE",39.1582,-75.5244],
    ["Tallahassee, FL",30.4383,-84.2807],["Atlanta, GA",33.7490,-84.3880],
    ["Honolulu, HI",21.3099,-157.8581],["Boise, ID",43.6150,-116.2023],
    ["Springfield, IL",39.7817,-89.6501],["Indianapolis, IN",39.7684,-86.1581],
    ["Des Moines, IA",41.5868,-93.6250],["Topeka, KS",39.0473,-95.6752],
    ["Frankfort, KY",38.2009,-84.8733],["Baton Rouge, LA",30.4515,-91.1871],
    ["Augusta, ME",44.3106,-69.7795],["Annapolis, MD",38.9784,-76.4922],
    ["Boston, MA",42.3601,-71.0589],["Lansing, MI",42.7325,-84.5555],
    ["Saint Paul, MN",44.9537,-93.0900],["Jackson, MS",32.2988,-90.1848],
    ["Jefferson City, MO",38.5767,-92.1735],["Helena, MT",46.5891,-112.0391],
    ["Lincoln, NE",40.8136,-96.7026],["Carson City, NV",39.1638,-119.7674],
    ["Concord, NH",43.2081,-71.5376],["Trenton, NJ",40.2171,-74.7429],
    ["Santa Fe, NM",35.6870,-105.9378],["Albany, NY",42.6526,-73.7562],
    ["Raleigh, NC",35.7796,-78.6382],["Bismarck, ND",46.8083,-100.7837],
    ["Columbus, OH",39.9612,-82.9988],["Oklahoma City, OK",35.4676,-97.5164],
    ["Salem, OR",44.9429,-123.0351],["Harrisburg, PA",40.2732,-76.8867],
    ["Providence, RI",41.8240,-71.4128],["Columbia, SC",34.0007,-81.0348],
    ["Pierre, SD",44.3683,-100.3510],["Nashville, TN",36.1627,-86.7816],
    ["Austin, TX",30.2672,-97.7431],["Salt Lake City, UT",40.7608,-111.8910],
    ["Montpelier, VT",44.2601,-72.5754],["Richmond, VA",37.5407,-77.4360],
    ["Olympia, WA",47.0379,-122.9007],["Charleston, WV",38.3498,-81.6326],
    ["Madison, WI",43.0731,-89.4012],["Cheyenne, WY",41.1400,-104.8202]
  ];

  function status(message) {
    const el = $("mapStatus");
    if (el) el.textContent = message;
  }

  function ensureMap() {
    const container = $("auctionMap");
    if (!container) return false;
    if (!window.L) {
      status("Map unavailable: Leaflet did not load. Check your internet connection.");
      return false;
    }
    if (state.map) {
      state.map.invalidateSize();
      return true;
    }

    // Remove the inline patch's fallback message once a real map can be initialized.
    container.querySelectorAll(".map-fallback-note").forEach((node) => node.remove());

    state.map = window.L.map(container, { scrollWheelZoom: false }).setView([39.5, -98.35], 4);
    state.tileLayer = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
    }).addTo(state.map);
    state.markers = window.L.layerGroup().addTo(state.map);

    // Keep wheel zoom opt-in to reduce accidental zooming on mobile/trackpads.
    state.map.on("click", () => {});
    return true;
  }

  function clearMarkers() {
    if (state.markers) state.markers.clearLayers();
  }

  function addPin(label, lat, lon, note) {
    if (!state.map || !state.markers) return;
    const marker = window.L.marker([lat, lon]).bindPopup(
      "<strong>" + escapeHtml(label) + "</strong>" +
      (note ? "<br>" + escapeHtml(note) : "")
    );
    marker.addTo(state.markers);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function showGlobal() {
    if (!ensureMap()) return;
    state.mode = "global";
    clearMarkers();
    cityPins.forEach((p) => addPin(p[0], p[1], p[2], "Reference location — no live weather data attached."));
    state.map.setView([39.5, -98.35], 4);
    status("Global reference view · location pins only · live weather/news not connected");
    setActiveButton("mapModeGlobal");
  }

  function showStates() {
    if (!ensureMap()) return;
    state.mode = "states";
    clearMarkers();
    capitals.forEach((p) => addPin(p[0], p[1], p[2], "Approximate state-capital reference point; not a state boundary."));
    state.map.setView([39.5, -98.35], 4);
    status("States view · 50 approximate state-capital pins · boundaries not loaded");
    setActiveButton("mapModeStates");
  }

  async function lookupLocation(query, modeLabel) {
    if (!ensureMap()) return;
    const cleaned = String(query || "").trim();
    if (!cleaned) {
      status("Enter a property address or county and state first.");
      return;
    }
    if (state.busy) {
      status("A location lookup is already running. Please wait.");
      return;
    }
    const now = Date.now();
    const waitMs = 1100 - (now - state.lastLookupAt);
    if (waitMs > 0) await new Promise((resolve) => setTimeout(resolve, waitMs));
    state.busy = true;
    state.lastLookupAt = Date.now();
    status("Looking up " + modeLabel + " location…");
    try {
      const url = "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" + encodeURIComponent(cleaned);
      const response = await fetch(url, { headers: { "Accept": "application/json" } });
      if (!response.ok) throw new Error("Location service returned HTTP " + response.status);
      const results = await response.json();
      if (!Array.isArray(results) || !results.length) {
        status("No location found for: " + cleaned + ". Check spelling and try again.");
        return;
      }
      const result = results[0];
      const lat = Number(result.lat), lon = Number(result.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error("Location result was invalid");
      clearMarkers();
      addPin(result.display_name || cleaned, lat, lon, "Geocoded location pin; verify the address independently.");
      state.map.setView([lat, lon], modeLabel === "street" ? 16 : 13);
      status(modeLabel + " view · location pin found · verify exact parcel/address before relying on it");
      setActiveButton(modeLabel === "street" ? "mapModeStreet" : "mapModeProperty");
    } catch (err) {
      status("Location lookup failed. Check connectivity or try again. " + (err && err.message ? err.message : ""));
    } finally {
      state.busy = false;
    }
  }

  function currentAddress() {
    return $("address") ? $("address").value.trim() : "";
  }

  function currentCountyQuery() {
    const county = $("county") ? $("county").value.trim() : "";
    const region = $("propertyState") ? $("propertyState").value.trim() : ($("taxState") ? $("taxState").value.trim() : "");
    if (!county || !region) return "";
    return county + " County, " + region + ", USA";
  }

  function setActiveButton(id) {
    ["mapModeGlobal", "mapModeStates", "mapModeCounties", "mapModeProperty", "mapModeStreet"].forEach((buttonId) => {
      const button = $(buttonId);
      if (button) button.classList.toggle("active", buttonId === id);
    });
  }

  function setMode(mode) {
    const normalized = String(mode || "global").toLowerCase();
    if (normalized === "global") return showGlobal();
    if (normalized === "states") return showStates();
    if (normalized === "counties") {
      state.mode = "counties";
      const query = currentCountyQuery();
      if (!query) {
        if (ensureMap()) status("County view · enter both County and Property State, then select Counties again.");
        setActiveButton("mapModeCounties");
        return;
      }
      setActiveButton("mapModeCounties");
      return lookupLocation(query, "county");
    }
    if (normalized === "property") {
      state.mode = "property";
      setActiveButton("mapModeProperty");
      return lookupLocation(currentAddress(), "property");
    }
    if (normalized === "street") {
      state.mode = "street";
      setActiveButton("mapModeStreet");
      return lookupLocation(currentAddress(), "street");
    }
    status("Unknown map mode: " + normalized);
  }

  function mapCurrentProperty() {
    state.mode = "property";
    setActiveButton("mapModeProperty");
    return lookupLocation(currentAddress(), "property");
  }

  function resetMap() {
    showGlobal();
  }

  function refreshGlobalIntelligence() {
    if (state.mode === "states") return showStates();
    if (state.mode === "property") return mapCurrentProperty();
    return showGlobal();
  }

  // Expose the names already called by the current HTML.
  window.setAuctionMapMode = setMode;
  window.mapCurrentAuctionProperty = mapCurrentProperty;
  window.resetAuctionMap = resetMap;
  if (typeof window.refreshGlobalIntelligence !== "function") {
    window.refreshGlobalIntelligence = refreshGlobalIntelligence;
  }

  window.ROLyfeAuctionMap = {
    version: "0.1.0-repair-bridge",
    setMode,
    mapCurrentProperty,
    resetMap,
    refresh: refreshGlobalIntelligence
  };

  function init() {
    if (ensureMap()) showGlobal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
