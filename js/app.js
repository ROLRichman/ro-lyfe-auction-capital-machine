/* =========================================================
   RO'Lyfe Auction Capital Machine™
   js/app.js
   PRODUCTION APPLICATION CONTROLLER
   ========================================================= */

(() => {
  "use strict";

  const STORAGE_KEY = "rolyfe-auction-capital-machine-v1";

  /* =======================================================
     BASIC HELPERS
     ======================================================= */

  const $ = (id) => document.getElementById(id);

  function getValue(id) {
    const el = $(id);
    return el ? el.value : "";
  }

  function getNumber(id) {
    const value = Number(getValue(id));
    return Number.isFinite(value) ? value : 0;
  }

  function setValue(id, value) {
    const el = $(id);
    if (el) el.value = value ?? "";
  }

  function setText(id, value) {
    const el = $(id);
    if (el) el.textContent = value ?? "";
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
  }

  /* =======================================================
     MACHINE STATE
     ======================================================= */

  const machine = {
    version: "1.0.0",
    opportunity: null,
    analysis: null,
    readiness: null
  };

  /* =======================================================
     DATE / TIME
     ======================================================= */

  function updateClock() {
    const clock = $("machineDateTime");

    if (!clock) return;

    clock.textContent = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());
  }

  /* =======================================================
     COLLECT CURRENT OPPORTUNITY
     ======================================================= */

  function collectOpportunity() {

    return {

      auction: {
        url: getValue("auctionUrl"),
        address: getValue("address"),
        type: getValue("auctionType"),
        occupancy: getValue("occupancy"),

        auctionDate: getValue("auctionDate"),
        auctionTime: getValue("auctionTime"),

        openingBid: getNumber("openingBid"),
        currentBid: getNumber("currentBid"),
        bidIncrement: getNumber("bidIncrement"),

        reserve: getValue("reserve"),
        financing: getValue("financing"),
        emd: getNumber("emd"),

        notes: getValue("auctionNotes")
      },

      deal: {
        arv: getNumber("arv"),
        rehab: getNumber("rehab"),
        closing: getNumber("closing"),
        holding: getNumber("holding"),
        selling: getNumber("selling"),
        financingCosts: getNumber("financingCosts"),
        profit: getNumber("profit"),
        contingency: getNumber("contingency"),
        buyerCapital: getNumber("buyerCapital")
      },

      rehab: {
        subtotal: getNumber("rehabSubtotal"),
        contingencyPercent: getNumber("rehabContingencyPct"),
        contingency: getNumber("rehabContingency"),
        total: getNumber("rehabTotal")
      },

      taxLien: {
        parcelNumber: getValue("parcelNumber"),
        county: getValue("taxCounty"),
        delinquentTaxes: getNumber("taxDelinquent"),
        interest: getNumber("taxInterest"),
        waterBalance: getNumber("waterBalance"),
        lienStatus: getValue("lienStatus"),
        saleStatus: getValue("saleStatus"),
        redemption: getValue("redemption"),
        notes: getValue("taxNotes")
      },

      underwriting: {
        guarantor: getValue("guarantor"),
        borrowingEntity: getValue("borrowingEntity"),

        completedProjects: getNumber("completedProjects"),

        trackPurchase: getNumber("trackPurchase"),
        trackRehab: getNumber("trackRehab"),
        trackDisposition: getNumber("trackDisposition"),

        reoCount: getNumber("reoCount"),
        reoPurchase: getNumber("reoPurchase"),
        reoRehab: getNumber("reoRehab"),
        reoValue: getNumber("reoValue")
      },

      savedAt: new Date().toISOString()
    };
  }

  /* =======================================================
     SAVE
     ======================================================= */

  function saveMachine() {

    try {

      const payload = {
        version: machine.version,
        opportunity: collectOpportunity(),
        analysis: machine.analysis,
        readiness: machine.readiness,
        savedAt: new Date().toISOString()
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(payload)
      );

      return true;

    } catch (error) {

      console.warn(
        "RO'Lyfe: Could not save machine state.",
        error
      );

      return false;
    }
  }

  /* =======================================================
     LOAD
     ======================================================= */

  function loadMachine() {

    try {

      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return false;

      const saved = JSON.parse(raw);

      if (saved.opportunity) {

        restoreOpportunity(
          saved.opportunity
        );

        machine.opportunity =
          saved.opportunity;
      }

      machine.analysis =
        saved.analysis || null;

      machine.readiness =
        saved.readiness || null;

      refreshDashboard();

      return true;

    } catch (error) {

      console.warn(
        "RO'Lyfe: Could not restore saved opportunity.",
        error
      );

      return false;
    }
  }

  /* =======================================================
     RESTORE
     ======================================================= */

  function restoreOpportunity(data) {

    if (!data) return;

    const a = data.auction || {};
    const d = data.deal || {};
    const r = data.rehab || {};
    const t = data.taxLien || {};
    const u = data.underwriting || {};

    const fields = {

      auctionUrl: a.url,
      address: a.address,
      auctionType: a.type,
      occupancy: a.occupancy,

      auctionDate: a.auctionDate,
      auctionTime: a.auctionTime,

      openingBid: a.openingBid,
      currentBid: a.currentBid,
      bidIncrement: a.bidIncrement,

      reserve: a.reserve,
      financing: a.financing,
      emd: a.emd,

      auctionNotes: a.notes,

      arv: d.arv,
      rehab: d.rehab,
      closing: d.closing,
      holding: d.holding,
      selling: d.selling,
      financingCosts: d.financingCosts,
      profit: d.profit,
      contingency: d.contingency,
      buyerCapital: d.buyerCapital,

      rehabSubtotal: r.subtotal,
      rehabContingencyPct: r.contingencyPercent,
      rehabContingency: r.contingency,
      rehabTotal: r.total,

      parcelNumber: t.parcelNumber,
      taxCounty: t.county,
      taxDelinquent: t.delinquentTaxes,
      taxInterest: t.interest,
      waterBalance: t.waterBalance,
      lienStatus: t.lienStatus,
      saleStatus: t.saleStatus,
      redemption: t.redemption,
      taxNotes: t.notes,

      guarantor: u.guarantor,
      borrowingEntity: u.borrowingEntity,
      completedProjects: u.completedProjects,

      trackPurchase: u.trackPurchase,
      trackRehab: u.trackRehab,
      trackDisposition: u.trackDisposition,

      reoCount: u.reoCount,
      reoPurchase: u.reoPurchase,
      reoRehab: u.reoRehab,
      reoValue: u.reoValue
    };

    Object.entries(fields).forEach(
      ([id, value]) => {

        if ($(id) && value !== undefined) {
          setValue(id, value);
        }

      }
    );

    syncRehab();
  }

  /* =======================================================
     DASHBOARD
     ======================================================= */

  function refreshDashboard() {

    const address =
      getValue("address").trim();

    const currentBid =
      getNumber("currentBid");

    setText(
      "propertyCount",
      address ? "1" : "0"
    );

    setText(
      "dashboardBid",
      money(currentBid)
    );

    if (machine.analysis) {

      setText(
        "dashboardMax",
        money(
          machine.analysis.maxAcquisition
        )
      );

      setText(
        "dashboardCapital",
        money(
          machine.analysis.capitalNeed
        )
      );
    }
  }

  /* =======================================================
     DEAL CALCULATOR
     ======================================================= */

  function calculateDeal() {

    const arv =
      getNumber("arv");

    if (!arv) {

      alert(
        "Enter an estimated ARV before calculating."
      );

      return null;
    }

    const rehab =
      getNumber("rehab");

    const closing =
      getNumber("closing");

    const holding =
      getNumber("holding");

    const selling =
      getNumber("selling");

    const financingCosts =
      getNumber("financingCosts");

    const profit =
      getNumber("profit");

    const contingency =
      getNumber("contingency");

    const buyerCapital =
      getNumber("buyerCapital");

    const currentBid =
      getNumber("currentBid");

    /*
      RO'Lyfe acquisition planning formula

      ARV
      - Rehab
      - Closing
      - Holding
      - Selling
      - Financing
      - Required Profit
      - Contingency
      =
      Maximum Acquisition Price
    */

    const maxAcquisition =
      arv -
      rehab -
      closing -
      holding -
      selling -
      financingCosts -
      profit -
      contingency;

    const projectCost =
      Math.max(
        maxAcquisition,
        0
      ) +
      rehab +
      closing +
      holding +
      financingCosts +
      contingency;

    const capitalNeed =
      Math.max(
        projectCost -
        buyerCapital,
        0
      );

    const bidRoom =
      maxAcquisition -
      currentBid;

    const grossSpread =
      arv -
      projectCost -
      selling;

    const result = {

      arv,
      rehab,
      closing,
      holding,
      selling,
      financingCosts,
      profit,
      contingency,
      buyerCapital,
      currentBid,

      maxAcquisition,
      projectCost,
      capitalNeed,
      bidRoom,
      grossSpread,

      calculatedAt:
        new Date().toISOString()
    };

    machine.analysis =
      result;

    /* RESULTS */

    setText(
      "maxBid",
      money(maxAcquisition)
    );

    setText(
      "projectCost",
      money(projectCost)
    );

    setText(
      "capitalNeed",
      money(capitalNeed)
    );

    setText(
      "resultCurrentBid",
      money(currentBid)
    );

    setText(
      "bidRoom",
      money(bidRoom)
    );

    setText(
      "grossSpread",
      money(grossSpread)
    );

    /* DASHBOARD */

    setText(
      "dashboardMax",
      money(maxAcquisition)
    );

    setText(
      "dashboardCapital",
      money(capitalNeed)
    );

    /* STATUS */

    const status =
      $("dealStatus");

    if (status) {

      if (maxAcquisition <= 0) {

        status.innerHTML =
          '<div class="status red">' +
          "🔴 ECONOMICS REQUIRE REVIEW" +
          "</div>";

      } else if (
        currentBid >
        maxAcquisition
      ) {

        status.innerHTML =
          '<div class="status red">' +
          "🔴 CURRENT BID EXCEEDS CALCULATED ACQUISITION CEILING" +
          "</div>";

      } else if (
        currentBid > 0
      ) {

        status.innerHTML =
          '<div class="status yellow">' +
          "🟡 WITHIN CALCULATED ACQUISITION CEILING — COMPLETE DUE DILIGENCE" +
          "</div>";

      } else {

        status.innerHTML =
          '<div class="status yellow">' +
          "🟡 UNDER REVIEW — ENTER CURRENT BID" +
          "</div>";
      }
    }

    const resultBox =
      $("dealResult");

    if (resultBox) {
      resultBox.classList.add(
        "active"
      );
    }

    machine.opportunity =
      collectOpportunity();

    saveMachine();

    refreshReadiness();

    return result;
  }

  /* =======================================================
     REHAB ENGINE BRIDGE
     ======================================================= */

  function syncRehab() {

    const subtotal =
      getNumber("rehabSubtotal");

    const percent =
      getNumber(
        "rehabContingencyPct"
      );

    const contingency =
      subtotal *
      (percent / 100);

    const total =
      subtotal +
      contingency;

    setValue(
      "rehabContingency",
      Math.round(contingency)
    );

    setValue(
      "rehabTotal",
      Math.round(total)
    );

    return {
      subtotal,
      percent,
      contingency,
      total
    };
  }

  function sendRehabToDeal() {

    const rehab =
      syncRehab();

    setValue(
      "rehab",
      Math.round(
        rehab.total
      )
    );

    saveMachine();

    refreshDashboard();

    const analysis =
      $("analysis");

    if (analysis) {

      analysis.scrollIntoView({
        behavior: "smooth"
      });
    }
  }

  /* =======================================================
     TAX / LIEN
     ======================================================= */

  function calculateTaxExposure() {

    const taxes =
      getNumber("taxDelinquent");

    const interest =
      getNumber("taxInterest");

    const water =
      getNumber("waterBalance");

    return {

      taxes,
      interest,
      water,

      knownExposure:
        taxes +
        interest +
        water
    };
  }

  /* =======================================================
     UNDERWRITING
     ======================================================= */

  function calculateTrackRecord() {

    const purchase =
      getNumber(
        "trackPurchase"
      );

    const rehab =
      getNumber(
        "trackRehab"
      );

    const disposition =
      getNumber(
        "trackDisposition"
      );

    return {

      completedProjects:
        getNumber(
          "completedProjects"
        ),

      purchase,
      rehab,
      disposition,

      grossDifference:
        disposition -
        purchase -
        rehab
    };
  }

  function calculateREO() {

    const purchase =
      getNumber(
        "reoPurchase"
      );

    const rehab =
      getNumber(
        "reoRehab"
      );

    const value =
      getNumber(
        "reoValue"
      );

    return {

      count:
        getNumber(
          "reoCount"
        ),

      purchase,
      rehab,
      value,

      estimatedEquity:
        value -
        purchase -
        rehab
    };
  }

  /* =======================================================
     DUE DILIGENCE / READINESS
     ======================================================= */

  function getChecklist() {

    const boxes =
      document.querySelectorAll(
        "#risk input[type='checkbox']"
      );

    const total =
      boxes.length;

    let completed = 0;

    boxes.forEach(
      (box) => {

        if (box.checked) {
          completed++;
        }

      }
    );

    return {
      total,
      completed
    };
  }

  function refreshReadiness() {

    const address =
      getValue(
        "address"
      ).trim();

    const parcel =
      getValue(
        "parcelNumber"
      ).trim();

    const arv =
      getNumber(
        "arv"
      );

    const currentBid =
      getNumber(
        "currentBid"
      );

    const checklist =
      getChecklist();

    const underwriting =
      getValue(
        "guarantor"
      ).trim() ||
      getValue(
        "borrowingEntity"
      ).trim();

    let level =
      "NOT READY";

    let css =
      "red";

    /*
      BID-READY requires the core
      property, analysis, underwriting,
      parcel and due-diligence
      information to be present.
    */

    if (
      address &&
      parcel &&
      arv > 0 &&
      machine.analysis &&
      underwriting &&
      currentBid > 0 &&
      checklist.total > 0 &&
      checklist.completed ===
        checklist.total
    ) {

      level =
        "BID-READY";

      css =
        "green";

    } else if (
      address &&
      arv > 0 &&
      machine.analysis
    ) {

      level =
        "UNDER REVIEW";

      css =
        "yellow";
    }

    machine.readiness = {

      level,
      css,
      checklist,

      updatedAt:
        new Date().toISOString()
    };

    saveMachine();

    return machine.readiness;
  }

  /* =======================================================
     SAVE OPPORTUNITY
     ======================================================= */

  function saveProperty() {

    const address =
      getValue(
        "address"
      ).trim();

    if (!address) {

      alert(
        "Enter a property address first."
      );

      return;
    }

    syncRehab();

    machine.opportunity =
      collectOpportunity();

    saveMachine();

    refreshDashboard();

    refreshReadiness();

    alert(
      "Auction opportunity saved for analysis."
    );
  }

  /* =======================================================
     INPUT LISTENERS
     ======================================================= */

  function bindInputs() {

    const ids = [

      "address",
      "auctionDate",
      "auctionTime",

      "openingBid",
      "currentBid",
      "bidIncrement",

      "reserve",
      "financing",
      "emd",

      "arv",
      "rehab",
      "closing",
      "holding",
      "selling",
      "financingCosts",
      "profit",
      "contingency",
      "buyerCapital",

      "rehabSubtotal",
      "rehabContingencyPct",

      "parcelNumber",
      "taxCounty",
      "taxDelinquent",
      "taxInterest",
      "waterBalance",
      "lienStatus",
      "saleStatus",

      "guarantor",
      "borrowingEntity",
      "completedProjects",

      "trackPurchase",
      "trackRehab",
      "trackDisposition",

      "reoCount",
      "reoPurchase",
      "reoRehab",
      "reoValue"
    ];

    ids.forEach(
      (id) => {

        const el =
          $(id);

        if (!el) return;

        el.addEventListener(
          "input",
          () => {

            if (
              id ===
                "rehabSubtotal" ||
              id ===
                "rehabContingencyPct"
            ) {

              syncRehab();
            }

            refreshDashboard();
            refreshReadiness();
          }
        );

        el.addEventListener(
          "change",
          () => {

            refreshDashboard();
            refreshReadiness();
          }
        );
      }
    );

    document
      .querySelectorAll(
        "#risk input[type='checkbox']"
      )
      .forEach(
        (checkbox) => {

          checkbox.addEventListener(
            "change",
            () => {

              refreshReadiness();
              saveMachine();
            }
          );

        }
      );
  }

  /* =======================================================
     PUBLIC MACHINE API
     ======================================================= */

  window.ROLyfeAuctionMachine = {

    version:
      machine.version,

    state:
      machine,

    save:
      saveProperty,

    load:
      loadMachine,

    calculateDeal:
      calculateDeal,

    syncRehab:
      syncRehab,

    sendRehabToDeal:
      sendRehabToDeal,

    collectOpportunity:
      collectOpportunity,

    tax: {

      calculate:
        calculateTaxExposure

    },

    underwriting: {

      trackRecord:
        calculateTrackRecord,

      reo:
        calculateREO

    },

    readiness: {

      refresh:
        refreshReadiness,

      get:
        () =>
          machine.readiness

    },

    dashboard: {

      refresh:
        refreshDashboard

    }

  };

  /* =======================================================
     BACKWARD COMPATIBILITY
     =======================================================
     The current production index.html already calls:

       saveProperty()
       calculateDeal()

     Keep those working.
     ======================================================= */

  window.saveProperty =
    saveProperty;

  window.calculateDeal =
    calculateDeal;

  window.syncRehab =
    syncRehab;

  window.sendRehabToDeal =
    sendRehabToDeal;

  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function initialize() {

    updateClock();

    setInterval(
      updateClock,
      1000
    );

    bindInputs();

    const restored =
      loadMachine();

    if (!restored) {

      syncRehab();

      refreshDashboard();

      refreshReadiness();
    }

    console.info(
      "RO'Lyfe Auction Capital Machine™",
      "app.js initialized."
    );
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initialize,
      { once: true }
    );

  } else {

    initialize();
  }

})();
