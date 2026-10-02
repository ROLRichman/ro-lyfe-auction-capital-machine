/* =========================================================
   RO'Lyfe Auction Capital Machine™
   Tax Lien / Tax Sale Intelligence Engine
   File: js/tax-lien-engine.js

   Purpose:
   - Identify tax-lien / tax-sale opportunities
   - Separate tax lien from tax deed / tax sale concepts
   - Track delinquent taxes and lien information
   - Track redemption-related information
   - Track auction requirements
   - Connect tax research with property underwriting
   - Flag title / lien due-diligence requirements

   IMPORTANT:
   Tax-sale procedures are jurisdiction-specific.
   This engine is a research and decision-support tool.
   It does NOT provide legal advice, title opinions,
   guaranteed ownership, guaranteed redemption returns,
   or guaranteed investment results.
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     HELPERS
     ========================================================= */

  function $(id) {
    return document.getElementById(id);
  }

  function num(value) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return 0;
    }

    var cleaned = String(value)
      .replace(/[$,%\s,]/g, "")
      .trim();

    var parsed = parseFloat(cleaned);

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  function text(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function money(value) {
    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2
      }
    ).format(num(value));
  }

  function safeText(id, value) {
    var el = $(id);

    if (el) {
      el.textContent = value;
    }
  }

  /* =========================================================
     SALE TYPES
     ========================================================= */

  var SALE_TYPES = {
    TAX_LIEN: {
      id: "taxLien",
      label: "Tax Lien",
      description:
        "A tax-related lien or certificate structure where ownership may remain with the property owner subject to jurisdiction-specific rules."
    },

    TAX_DEED: {
      id: "taxDeed",
      label: "Tax Deed",
      description:
        "A tax-sale structure that may transfer an ownership interest/title subject to jurisdiction-specific procedures and surviving interests."
    },

    TAX_SALE: {
      id: "taxSale",
      label: "Tax Sale",
      description:
        "General tax-delinquency sale process. Exact legal effect depends on the jurisdiction."
    },

    SHERIFF_SALE: {
      id: "sheriffSale",
      label: "Sheriff Sale",
      description:
        "Judicial or sheriff-administered sale structure with jurisdiction-specific rules."
    },

    UNKNOWN: {
      id: "unknown",
      label: "Unknown",
      description:
        "Sale type has not yet been established."
    }
  };

  /* =========================================================
     STATE
     ========================================================= */

  var state = {

    saleType: "unknown",

    jurisdiction: {
      state: "",
      county: "",
      city: ""
    },

    property: {
      address: "",
      parcel: "",
      owner: ""
    },

    taxData: {
      delinquentAmount: 0,
      lienAmount: 0,
      interestRate: 0,
      penalties: 0,
      fees: 0,
      totalDue: 0
    },

    auction: {
      openingBid: 0,
      currentBid: 0,
      bidIncrement: 0,
      deposit: 0,
      auctionDate: "",
      auctionTime: "",
      registrationDeadline: ""
    },

    redemption: {
      applicable: null,
      deadline: "",
      estimatedAmount: 0,
      status: "UNKNOWN"
    },

    title: {
      researched: false,
      titleReport: false,
      liensReviewed: false,
      municipalChargesReviewed: false,
      survivingInterestsReviewed: false
    },

    findings: [],

    lastCalculation: null
  };

  /* =========================================================
     JURISDICTION RULES
     
     These are intentionally high-level.
     Exact procedures should be confirmed from the
     applicable county/state source.
     ========================================================= */

  var JURISDICTION_RULES = {

    PA: {
      state: "Pennsylvania",

      model:
        "Tax sales and delinquent-tax enforcement vary by county and sale type.",

      notes: [
        "Do not assume a tax-lien certificate model applies.",
        "County-specific tax-sale procedures must be reviewed.",
        "Title, liens, encumbrances and municipal obligations require due diligence."
      ],

      resources: [
        "Philadelphia Property App",
        "Philadelphia Tax Center",
        "Philadelphia Sheriff / applicable sale administrator"
      ]
    },

    NJ: {
      state: "New Jersey",

      model:
        "Tax-sale systems commonly involve tax-sale certificates and redemption rules.",

      notes: [
        "Confirm municipality-specific procedures.",
        "Confirm redemption period and interest rules.",
        "Review certificate, lien priority and foreclosure requirements."
      ],

      resources: [
        "County tax collector",
        "Municipal tax office",
        "Applicable auction administrator"
      ]
    },

    FL: {
      state: "Florida",

      model:
        "Tax certificate and tax-deed processes are distinct and jurisdiction-specific.",

      notes: [
        "Confirm certificate status.",
        "Confirm redemption period.",
        "Confirm tax-deed eligibility and subsequent procedures."
      ],

      resources: [
        "County tax collector",
        "County clerk",
        "Applicable tax-sale platform"
      ]
    }
  };

  /* =========================================================
     INPUT COLLECTION
     ========================================================= */

  function readInputs() {

    state.property.address =
      $("address")
        ? $("address").value
        : "";

    state.property.parcel =
      $("taxParcel")
        ? $("taxParcel").value
        : "";

    state.property.owner =
      $("taxOwner")
        ? $("taxOwner").value
        : "";

    state.jurisdiction.state =
      $("taxState")
        ? $("taxState").value
        : "";

    state.jurisdiction.county =
      $("taxCounty")
        ? $("taxCounty").value
        : "";

    state.jurisdiction.city =
      $("taxCity")
        ? $("taxCity").value
        : "";

    state.saleType =
      $("taxSaleType")
        ? $("taxSaleType").value
        : "unknown";

    state.taxData.delinquentAmount =
      $("delinquentTaxes")
        ? num($("delinquentTaxes").value)
        : 0;

    state.taxData.lienAmount =
      $("taxLienAmount")
        ? num($("taxLienAmount").value)
        : 0;

    state.taxData.interestRate =
      $("taxInterestRate")
        ? num($("taxInterestRate").value)
        : 0;

    state.taxData.penalties =
      $("taxPenalties")
        ? num($("taxPenalties").value)
        : 0;

    state.taxData.fees =
      $("taxFees")
        ? num($("taxFees").value)
        : 0;

    state.taxData.totalDue =
      $("taxTotalDue")
        ? num($("taxTotalDue").value)
        : 0;

    state.auction.openingBid =
      $("taxOpeningBid")
        ? num($("taxOpeningBid").value)
        : 0;

    state.auction.currentBid =
      $("taxCurrentBid")
        ? num($("taxCurrentBid").value)
        : 0;

    state.auction.bidIncrement =
      $("taxBidIncrement")
        ? num($("taxBidIncrement").value)
        : 0;

    state.auction.deposit =
      $("taxDeposit")
        ? num($("taxDeposit").value)
        : 0;

    state.auction.auctionDate =
      $("taxAuctionDate")
        ? $("taxAuctionDate").value
        : "";

    state.auction.auctionTime =
      $("taxAuctionTime")
        ? $("taxAuctionTime").value
        : "";

    state.auction.registrationDeadline =
      $("taxRegistrationDeadline")
        ? $("taxRegistrationDeadline").value
        : "";

    state.redemption.applicable =
      $("redemptionApplicable")
        ? $("redemptionApplicable").value
        : null;

    state.redemption.deadline =
      $("redemptionDeadline")
        ? $("redemptionDeadline").value
        : "";

    state.redemption.estimatedAmount =
      $("redemptionAmount")
        ? num($("redemptionAmount").value)
        : 0;

    return state;
  }

  /* =========================================================
     SALE TYPE DETECTION
     ========================================================= */

  function identifySaleType(value) {

    var type =
      text(value);

    if (
      type.includes("lien")
    ) {
      return "taxLien";
    }

    if (
      type.includes("deed")
    ) {
      return "taxDeed";
    }

    if (
      type.includes("sheriff")
    ) {
      return "sheriffSale";
    }

    if (
      type.includes("sale")
    ) {
      return "taxSale";
    }

    return "unknown";
  }

  /* =========================================================
     TAX BALANCE
     ========================================================= */

  function calculateTaxBalance() {

    readInputs();

    var calculated =
      state.taxData.delinquentAmount +
      state.taxData.penalties +
      state.taxData.fees;

    var reported =
      state.taxData.totalDue;

    return {
      calculated:
        calculated,

      reported:
        reported,

      difference:
        reported > 0
          ? reported - calculated
          : null
    };
  }

  /* =========================================================
     LIEN / TAX RISK
     ========================================================= */

  function assessTaxRisk() {

    readInputs();

    var findings = [];

    var balance =
      calculateTaxBalance();

    if (
      state.taxData.delinquentAmount > 0
    ) {

      findings.push({
        level: "HIGH",
        message:
          "Delinquent taxes are present.",
        action:
          "Verify the exact payoff, sale status, penalties, interest and applicable legal process."
      });
    }

    if (
      state.taxData.lienAmount > 0
    ) {

      findings.push({
        level: "HIGH",
        message:
          "A tax lien amount has been entered.",
        action:
          "Confirm lien priority, payoff requirements and whether the lien survives the intended transaction."
      });
    }

    if (
      balance.reported <= 0 &&
      balance.calculated <= 0
    ) {

      findings.push({
        level: "UNKNOWN",
        message:
          "No tax balance has been entered.",
        action:
          "Research the property's current tax account."
      });
    }

    return findings;
  }

  /* =========================================================
     REDEMPTION ANALYSIS
     ========================================================= */

  function analyzeRedemption() {

    readInputs();

    var saleType =
      identifySaleType(
        state.saleType
      );

    var result = {
      applicable:
        state.redemption.applicable,
      saleType:
        saleType,
      deadline:
        state.redemption.deadline,
      estimatedAmount:
        state.redemption.estimatedAmount,
      status:
        "UNKNOWN",
      notes: []
    };

    if (
      state.redemption.applicable ===
      "no"
    ) {

      result.status =
        "NOT_REPORTED";

      result.notes.push(
        "Redemption was entered as not applicable; verify against the governing jurisdiction."
      );

      return result;
    }

    if (
      state.redemption.applicable ===
      "yes"
    ) {

      result.status =
        "APPLIES";

      result.notes.push(
        "A redemption process has been identified; verify the exact statutory deadline and payoff amount."
      );

      return result;
    }

    result.notes.push(
      "Redemption status has not been established."
    );

    return result;
  }

  /* =========================================================
     TITLE DUE DILIGENCE
     ========================================================= */

  function assessTitle() {

    var findings = [];

    if (
      !state.title.titleReport
    ) {

      findings.push({
        level: "HIGH",
        message:
          "Title report has not been marked complete.",
        action:
          "Obtain appropriate title research before relying on the property as clear."
      });
    }

    if (
      !state.title.liensReviewed
    ) {

      findings.push({
        level: "HIGH",
        message:
          "Lien review has not been marked complete.",
        action:
          "Review tax, municipal, judgment, HOA/COA and other applicable liens."
      });
    }

    if (
      !state.title.municipalChargesReviewed
    ) {

      findings.push({
        level: "MODERATE",
        message:
          "Municipal charges have not been marked reviewed.",
        action:
          "Check applicable water, utility, code and municipal balances."
      });
    }

    if (
      !state.title.survivingInterestsReviewed
    ) {

      findings.push({
        level: "HIGH",
        message:
          "Potential surviving interests have not been reviewed.",
        action:
          "Confirm which interests survive the particular sale process."
      });
    }

    return findings;
  }

  /* =========================================================
     AUCTION ANALYSIS
     ========================================================= */

  function analyzeAuction() {

    readInputs();

    var findings = [];

    if (
      !state.auction.auctionDate
    ) {

      findings.push({
        level: "MODERATE",
        message:
          "Tax-sale auction date has not been entered.",
        action:
          "Confirm the exact sale date."
      });
    }

    if (
      state.auction.deposit <= 0
    ) {

      findings.push({
        level: "HIGH",
        message:
          "Required auction deposit has not been entered.",
        action:
          "Confirm registration, deposit and payment deadlines."
      });
    }

    if (
      state.auction.currentBid > 0 &&
      state.auction.currentBid >
        state.taxData.totalDue &&
      state.taxData.totalDue > 0
    ) {

      findings.push({
        level: "LOW",
        message:
          "Current bid is above the entered tax balance.",
        action:
          "Compare the bid against property value, title position and the applicable sale structure."
      });
    }

    return findings;
  }

  /* =========================================================
     JURISDICTION RESEARCH
     ========================================================= */

  function getJurisdictionRule() {

    readInputs();

    var stateCode =
      String(
        state.jurisdiction.state || ""
      )
        .trim()
        .toUpperCase();

    return (
      JURISDICTION_RULES[stateCode] ||
      null
    );
  }

  /* =========================================================
     MASTER CALCULATION
     ========================================================= */

  function calculate() {

    readInputs();

    var saleType =
      identifySaleType(
        state.saleType
      );

    state.saleType =
      saleType;

    var findings = [];

    findings =
      findings.concat(
        assessTaxRisk()
      );

    findings =
      findings.concat(
        analyzeRedemption()
          .notes.map(
            function (note) {
              return {
                level:
                  "UNKNOWN",
                message:
                  note,
                action:
                  "Verify the applicable jurisdictional rule."
              };
            }
          )
      );

    findings =
      findings.concat(
        assessTitle()
      );

    findings =
      findings.concat(
        analyzeAuction()
      );

    var jurisdiction =
      getJurisdictionRule();

    if (
      !jurisdiction
    ) {

      findings.push({
        level: "UNKNOWN",
        message:
          "Jurisdiction-specific tax-sale rules have not been identified.",
        action:
          "Enter the state and county and verify the applicable official rules."
      });
    }

    var maximum =
      findings.reduce(
        function (
          current,
          item
        ) {

          var score =
            item.level ===
              "HIGH"
              ? 3
              : item.level ===
                "MODERATE"
                ? 2
                : item.level ===
                  "LOW"
                  ? 1
                  : 0;

          return Math.max(
            current,
            score
          );
        },
        0
      );

    var level =
      maximum >= 3
        ? "HIGH"
        : maximum >= 2
          ? "MODERATE"
          : maximum >= 1
            ? "LOW"
            : "UNKNOWN";

    state.findings =
      findings;

    state.lastCalculation = {

      saleType:
        saleType,

      saleTypeLabel:
        getSaleTypeLabel(
          saleType
        ),

      jurisdiction:
        jurisdiction,

      taxBalance:
        calculateTaxBalance(),

      redemption:
        analyzeRedemption(),

      findings:
        findings,

      riskLevel:
        level,

      calculatedAt:
        new Date().toISOString()
    };

    updateUI();

    return state.lastCalculation;
  }

  /* =========================================================
     SALE TYPE LABEL
     ========================================================= */

  function getSaleTypeLabel(
    saleType
  ) {

    var match =
      Object.keys(
        SALE_TYPES
      ).find(
        function (key) {
          return (
            SALE_TYPES[key].id ===
            saleType
          );
        }
      );

    return match
      ? SALE_TYPES[match].label
      : "Unknown";
  }

  /* =========================================================
     TITLE STATUS
     ========================================================= */

  function setTitleStatus(
    config
  ) {

    config =
      config || {};

    if (
      config.titleReport !==
      undefined
    ) {
      state.title.titleReport =
        Boolean(
          config.titleReport
        );
    }

    if (
      config.liensReviewed !==
      undefined
    ) {
      state.title.liensReviewed =
        Boolean(
          config.liensReviewed
        );
    }

    if (
      config.municipalChargesReviewed !==
      undefined
    ) {
      state.title.municipalChargesReviewed =
        Boolean(
          config.municipalChargesReviewed
        );
    }

    if (
      config.survivingInterestsReviewed !==
      undefined
    ) {
      state.title.survivingInterestsReviewed =
        Boolean(
          config.survivingInterestsReviewed
        );
    }

    state.title.researched =
      Boolean(
        state.title.titleReport &&
        state.title.liensReviewed
      );

    return state.title;
  }

  /* =========================================================
     TAX-SALE OPPORTUNITY SNAPSHOT
     ========================================================= */

  function opportunitySnapshot() {

    calculate();

    return {

      property:
        state.property,

      jurisdiction:
        state.jurisdiction,

      saleType:
        getSaleTypeLabel(
          state.saleType
        ),

      taxData:
        state.taxData,

      auction:
        state.auction,

      redemption:
        state.redemption,

      title:
        state.title,

      riskLevel:
        state.lastCalculation
          ? state.lastCalculation.riskLevel
          : "UNKNOWN",

      findings:
        state.findings
    };
  }

  /* =========================================================
     UI
     ========================================================= */

  function updateUI() {

    if (
      !state.lastCalculation
    ) {
      return;
    }

    safeText(
      "taxSaleTypeResult",
      state.lastCalculation
        .saleTypeLabel
    );

    safeText(
      "taxRiskLevel",
      state.lastCalculation
        .riskLevel
    );

    safeText(
      "taxTotalCalculated",
      money(
        state.lastCalculation
          .taxBalance
          .calculated
      )
    );

    safeText(
      "taxRedemptionStatus",
      state.lastCalculation
        .redemption
        .status
    );

    safeText(
      "taxFindingCount",
      state.findings.length
    );
  }

  /* =========================================================
     CONTROLS
     ========================================================= */

  function bindControls() {

    var buttons = [
      "calculateTaxLien",
      "calculateTaxSale",
      "btnCalculateTax",
      "runTaxAnalysis"
    ];

    buttons.forEach(
      function (id) {

        var button =
          $(id);

        if (!button) {
          return;
        }

        button.addEventListener(
          "click",
          function (event) {

            event.preventDefault();

            calculate();
          }
        );
      }
    );

    var watched = [
      "taxSaleType",
      "taxState",
      "taxCounty",
      "taxCity",
      "taxParcel",
      "delinquentTaxes",
      "taxLienAmount",
      "taxInterestRate",
      "taxPenalties",
      "taxFees",
      "taxTotalDue",
      "taxOpeningBid",
      "taxCurrentBid",
      "taxBidIncrement",
      "taxDeposit",
      "taxAuctionDate",
      "taxAuctionTime",
      "taxRegistrationDeadline",
      "redemptionApplicable",
      "redemptionDeadline",
      "redemptionAmount"
    ];

    watched.forEach(
      function (id) {

        var input =
          $(id);

        if (!input) {
          return;
        }

        input.addEventListener(
          "input",
          calculate
        );

        input.addEventListener(
          "change",
          calculate
        );
      }
    );
  }

  /* =========================================================
     PUBLIC ENGINE
     ========================================================= */

  window.ROLyfeTaxLienEngine = {

    version:
      "1.0.0",

    saleTypes:
      SALE_TYPES,

    jurisdictionRules:
      JURISDICTION_RULES,

    state:
      state,

    calculate:
      calculate,

    identifySaleType:
      identifySaleType,

    calculateTaxBalance:
      calculateTaxBalance,

    analyzeRedemption:
      analyzeRedemption,

    analyzeAuction:
      analyzeAuction,

    assessTaxRisk:
      assessTaxRisk,

    assessTitle:
      assessTitle,

    getJurisdictionRule:
      getJurisdictionRule,

    setTitleStatus:
      setTitleStatus,

    opportunitySnapshot:
      opportunitySnapshot
  };

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {

    bindControls();

    calculate();
  }

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }

})();
