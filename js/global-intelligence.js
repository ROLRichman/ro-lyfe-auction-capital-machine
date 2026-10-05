/* ============================================================
   RO'Lyfe Global Intelligence Engine™
   File: js/global-intelligence.js

   Purpose:
   - Global date/time intelligence
   - Market / economic intelligence hooks
   - Positive / solutions-news intelligence
   - Weather intelligence hooks
   - Auction / tax-sale intelligence
   - Global real-estate opportunity context
   - Resource routing
   - AI Underwriter integration hooks
   - Persistent local machine state

   IMPORTANT:
   This module does NOT pretend to have live data by itself.
   It provides the intelligence framework and safely uses
   available browser APIs / configured endpoints when present.

   RO'Lyfe Principle:
   FIND → VERIFY → ANALYZE → UNDERWRITE → ROUTE CAPITAL
============================================================ */

(function (window, document) {
  "use strict";

  const GLOBAL_INTELLIGENCE_VERSION = "1.0.0";

  const GlobalIntelligence = {

    version: GLOBAL_INTELLIGENCE_VERSION,

    config: {
      storageKey: "rolyfe-global-intelligence",
      machineKey: "rolyfe-auction-capital-machine",
      refreshMinutes: 15,

      sources: {
        auction: [
          {
            name: "Auction.com",
            url: "https://www.auction.com/"
          },
          {
            name: "Bid4Assets",
            url: "https://www.bid4assets.com/"
          }
        ],

        property: [
          {
            name: "Zillow",
            url: "https://www.zillow.com/"
          },
          {
            name: "Redfin",
            url: "https://www.redfin.com/"
          },
          {
            name: "Realtor",
            url: "https://www.realtor.com/"
          }
        ],

        government: [
          {
            name: "Philadelphia Property App",
            url: "https://property.phila.gov/"
          },
          {
            name: "LienHub",
            url: "https://www.lienhub.com/"
          }
        ],

        capital: [
          {
            name: "Kiavi",
            url: "https://www.kiavi.com/"
          },
          {
            name: "COGO Capital",
            url: "https://www.cogocapital.com/"
          }
        ],

        global: [
          {
            name: "Positive News",
            url: "https://www.positive.news/"
          },
          {
            name: "Solutions Journalism Network",
            url: "https://www.solutionsjournalism.org/"
          }
        ]
      }
    },

    /* ---------------------------------------------------------
       INITIALIZATION
    --------------------------------------------------------- */

    init: function () {

      this.loadState();

      this.updateClock();

      if (!this._clockTimer) {
        this._clockTimer = setInterval(
          () => this.updateClock(),
          1000
        );
      }

      this.detectMachineContext();

      this.registerGlobalEvents();

      this.publishStatus();

      console.log(
        "[RO'Lyfe Global Intelligence] Engine loaded:",
        this.version
      );

      return this;
    },


    /* ---------------------------------------------------------
       STATE
    --------------------------------------------------------- */

    state: {
      initialized: false,

      lastUpdate: null,

      currentContext: {
        country: "United States",
        state: "",
        county: "",
        city: "",
        propertyType: "",
        auctionType: ""
      },

      intelligence: {
        time: null,
        weather: null,
        market: null,
        news: [],
        auctions: [],
        taxSales: [],
        resources: []
      },

      machineSnapshot: {},

      alerts: []
    },


    loadState: function () {

      try {

        const raw = localStorage.getItem(
          this.config.storageKey
        );

        if (raw) {

          const saved = JSON.parse(raw);

          this.state = Object.assign(
            this.state,
            saved
          );

        }

      } catch (error) {

        console.warn(
          "[Global Intelligence] Unable to load state:",
          error
        );

      }

      this.state.initialized = true;
    },


    saveState: function () {

      try {

        localStorage.setItem(
          this.config.storageKey,
          JSON.stringify(this.state)
        );

      } catch (error) {

        console.warn(
          "[Global Intelligence] Unable to save state:",
          error
        );

      }

    },


    /* ---------------------------------------------------------
       MACHINE CONTEXT
    --------------------------------------------------------- */

    detectMachineContext: function () {

      const get = (id) => {

        const el = document.getElementById(id);

        if (!el) return "";

        return el.value || el.textContent || "";

      };


      this.state.currentContext = {

        country: "United States",

        state:
          get("taxState") ||
          get("state") ||
          "",

        county:
          get("taxCounty") ||
          get("county") ||
          "",

        city:
          get("taxCity") ||
          get("city") ||
          "",

        propertyType:
          get("propertyType") ||
          get("auctionType") ||
          "",

        auctionType:
          get("auctionType") ||
          get("taxSaleType") ||
          ""

      };


      this.state.machineSnapshot = {

        address:
          get("address"),

        parcel:
          get("parcel"),

        openingBid:
          get("openingBid"),

        currentBid:
          get("currentBid"),

        reserve:
          get("reserve"),

        arv:
          get("arv"),

        rehab:
          get("rehab"),

        closing:
          get("closing"),

        holding:
          get("holding"),

        selling:
          get("selling"),

        financingCosts:
          get("financingCosts"),

        profit:
          get("profit"),

        contingency:
          get("contingency"),

        buyerCapital:
          get("buyerCapital")

      };


      this.saveState();

    },


    /* ---------------------------------------------------------
       LIVE CLOCK
    --------------------------------------------------------- */

    updateClock: function () {

      const now = new Date();

      this.state.intelligence.time = {

        timestamp: now.toISOString(),

        localDate:
          now.toLocaleDateString(),

        localTime:
          now.toLocaleTimeString(),

        timezone:
          Intl.DateTimeFormat().resolvedOptions().timeZone,

        utc:
          now.toUTCString()

      };


      const clockElements =
        document.querySelectorAll(
          "[data-global-clock]"
        );


      clockElements.forEach(
        (element) => {

          element.textContent =
            this.state.intelligence.time.localTime;

        }
      );


      const dateElements =
        document.querySelectorAll(
          "[data-global-date]"
        );


      dateElements.forEach(
        (element) => {

          element.textContent =
            this.state.intelligence.time.localDate;

        }
      );

    },


    /* ---------------------------------------------------------
       GLOBAL TIME ZONES
    --------------------------------------------------------- */

    getWorldClock: function () {

      const zones = [

        {
          city: "New York",
          zone: "America/New_York"
        },

        {
          city: "Chicago",
          zone: "America/Chicago"
        },

        {
          city: "Denver",
          zone: "America/Denver"
        },

        {
          city: "Los Angeles",
          zone: "America/Los_Angeles"
        },

        {
          city: "London",
          zone: "Europe/London"
        },

        {
          city: "Dubai",
          zone: "Asia/Dubai"
        },

        {
          city: "Singapore",
          zone: "Asia/Singapore"
        },

        {
          city: "Tokyo",
          zone: "Asia/Tokyo"
        }

      ];


      return zones.map(
        (item) => ({

          city: item.city,

          time:
            new Intl.DateTimeFormat(
              "en-US",
              {
                timeZone: item.zone,
                hour: "numeric",
                minute: "2-digit",
                second: "2-digit"
              }
            ).format(new Date()),

          timezone: item.zone

        })
      );

    },


    /* ---------------------------------------------------------
       WEATHER HOOK
    --------------------------------------------------------- */

    getWeatherContext: function () {

      const context =
        this.state.currentContext;

      return {

        city: context.city,

        state: context.state,

        message:
          context.city
            ? "Weather provider can be connected for this location."
            : "Enter a property location to activate weather intelligence.",

        provider:
          "AccuWeather",

        status:
          "API key required for live weather data."

      };

    },


    /* ---------------------------------------------------------
       MARKET INTELLIGENCE
    --------------------------------------------------------- */

    getMarketContext: function () {

      const snapshot =
        this.state.machineSnapshot;


      const arv =
        this.toNumber(snapshot.arv);

      const rehab =
        this.toNumber(snapshot.rehab);

      const bid =
        this.toNumber(snapshot.currentBid);

      let status =
        "INSUFFICIENT DATA";


      if (arv > 0 && bid > 0) {

        const grossSpread =
          arv - bid - rehab;

        if (grossSpread >= 75000) {

          status = "STRONG INITIAL SPREAD";

        } else if (grossSpread >= 30000) {

          status = "MODERATE INITIAL SPREAD";

        } else if (grossSpread > 0) {

          status = "THIN INITIAL SPREAD";

        } else {

          status = "NEGATIVE INITIAL SPREAD";

        }

      }


      this.state.intelligence.market = {

        arv: arv,

        rehab: rehab,

        currentBid: bid,

        grossSpread:
          arv - bid - rehab,

        status: status

      };


      return this.state.intelligence.market;

    },


    /* ---------------------------------------------------------
       AUCTION INTELLIGENCE
    --------------------------------------------------------- */

    getAuctionContext: function () {

      const snapshot =
        this.state.machineSnapshot;


      const opening =
        this.toNumber(snapshot.openingBid);

      const current =
        this.toNumber(snapshot.currentBid);

      const reserve =
        this.toNumber(snapshot.reserve);


      return {

        openingBid: opening,

        currentBid: current,

        reserve: reserve,

        bidIncrease:
          current > opening
            ? current - opening
            : 0,

        reserveStatus:

          reserve > 0 && current >= reserve
            ? "RESERVE MET"
            : reserve > 0
              ? "RESERVE NOT MET"
              : "RESERVE UNKNOWN"

      };

    },


    /* ---------------------------------------------------------
       TAX-SALE INTELLIGENCE
    --------------------------------------------------------- */

    getTaxSaleContext: function () {

      const context =
        this.state.currentContext;


      const saleType =
        document.getElementById(
          "taxSaleType"
        )?.value || "";


      const delinquent =
        this.toNumber(
          document.getElementById(
            "delinquentTaxes"
          )?.value
        );


      return {

        state:
          context.state,

        county:
          context.county,

        city:
          context.city,

        saleType:
          saleType,

        delinquentTaxes:
          delinquent,

        jurisdictionRequired:
          !context.state ||
          !context.county,

        warning:
          "Tax-sale rules must be verified against the applicable county/state authority before bidding."

      };

    },


    /* ---------------------------------------------------------
       DUE-DILIGENCE INTELLIGENCE
    --------------------------------------------------------- */

    getDueDiligenceQuestions: function () {

      return [

        "Who is the seller or governmental authority?",

        "What type of auction is this?",

        "Is the property occupied?",

        "Is there a redemption period?",

        "Are prior taxes or municipal charges still attached?",

        "Are there mortgages, judgments, HOA liens or other encumbrances?",

        "Is title insurance available?",

        "Who pays closing costs?",

        "Who pays transfer taxes?",

        "Is there a minimum bid or reserve?",

        "Is a deposit required?",

        "What is the deposit deadline?",

        "What is the settlement deadline?",

        "Is financing permitted?",

        "What is the maximum bid supported by the underwriting?",

        "What is the realistic ARV?",

        "What is the contractor-verified rehab?",

        "What is the exit strategy?"

      ];

    },


    /* ---------------------------------------------------------
       GLOBAL RESOURCE ROUTER
    --------------------------------------------------------- */

    getResources: function () {

      const groups =
        this.config.sources;


      const resources = [];


      Object.keys(groups).forEach(
        (group) => {

          groups[group].forEach(
            (resource) => {

              resources.push({

                category: group,

                name: resource.name,

                url: resource.url

              });

            }
          );

        }
      );


      this.state.intelligence.resources =
        resources;


      return resources;

    },


    /* ---------------------------------------------------------
       NEWS FRAMEWORK
    --------------------------------------------------------- */

    getNewsSources: function () {

      return [

        {
          name: "Positive News",
          purpose:
            "Solutions-focused positive journalism.",
          url:
            "https://www.positive.news/"
        },

        {
          name: "Solutions Journalism Network",
          purpose:
            "Evidence-based reporting about responses to social problems.",
          url:
            "https://www.solutionsjournalism.org/"
        }

      ];

    },


    /* ---------------------------------------------------------
       INTELLIGENCE SNAPSHOT
    --------------------------------------------------------- */

    getSnapshot: function () {

      this.detectMachineContext();

      return {

        engine:
          "RO'Lyfe Global Intelligence Engine™",

        version:
          this.version,

        generated:
          new Date().toISOString(),

        time:
          this.state.intelligence.time,

        context:
          this.state.currentContext,

        auction:
          this.getAuctionContext(),

        market:
          this.getMarketContext(),

        taxSale:
          this.getTaxSaleContext(),

        weather:
          this.getWeatherContext(),

        worldClock:
          this.getWorldClock(),

        dueDiligence:
          this.getDueDiligenceQuestions(),

        resources:
          this.getResources()

      };

    },


    /* ---------------------------------------------------------
       AI UNDERWRITER HANDOFF
    --------------------------------------------------------- */

    getAIContext: function () {

      const snapshot =
        this.getSnapshot();


      return {

        role:
          "RO'Lyfe Global Intelligence / Auction Underwriting Assistant",

        instruction:

          "Analyze the property conservatively. Never invent missing facts. Separate verified facts, assumptions, estimates and missing information. Identify risks before recommending action.",

        property:
          snapshot.context,

        auction:
          snapshot.auction,

        market:
          snapshot.market,

        taxSale:
          snapshot.taxSale,

        weather:
          snapshot.weather,

        dueDiligence:
          snapshot.dueDiligence

      };

    },


    /* ---------------------------------------------------------
       QUESTION ANSWER FRAMEWORK
    --------------------------------------------------------- */

    answer: function (question) {

      if (!question) {

        return {

          answer:
            "Ask me about the property, auction, tax sale, underwriting, rehab, capital, due diligence or global intelligence.",

          confidence:
            "HIGH"

        };

      }


      const q =
        question.toLowerCase().trim();


      const snapshot =
        this.getSnapshot();


      if (
        q.includes("max bid") ||
        q.includes("maximum bid") ||
        q.includes("how much should i bid")
      ) {

        return {

          answer:
            "I can calculate a conservative maximum bid from ARV, rehab, closing, holding, selling, financing, contingency and required profit. The current machine snapshot is " +
            JSON.stringify(snapshot.market),

          confidence:
            "MEDIUM",

          action:
            "Run underwriting engine."

        };

      }


      if (
        q.includes("risk") ||
        q.includes("risky") ||
        q.includes("danger")
      ) {

        return {

          answer:
            "Start with occupancy, title/liens, auction terms, redemption rights, rehab uncertainty, ARV confidence, financing terms and exit strategy. Missing information should increase risk rather than be assumed away.",

          confidence:
            "HIGH",

          action:
            "Run risk engine."

        };

      }


      if (
        q.includes("tax") ||
        q.includes("lien") ||
        q.includes("redemption")
      ) {

        return {

          answer:
            "Tax-sale analysis is jurisdiction-specific. I need the state, county, sale type and official county rules before treating interest, penalties, redemption and lien/deed priority as verified.",

          confidence:
            "HIGH",

          action:
            "Run tax-lien engine."

        };

      }


      if (
        q.includes("contractor") ||
        q.includes("rehab")
      ) {

        return {

          answer:
            "Contractor verification should convert the property condition into a line-item rehab budget. The contractor estimate should then be compared with the underwriting budget and contingency before increasing the bid.",

          confidence:
            "HIGH",

          action:
            "Run rehab budget engine."

        };

      }


      if (
        q.includes("capital") ||
        q.includes("funding") ||
        q.includes("finance") ||
        q.includes("financing")
      ) {

        return {

          answer:
            "Capital routing should occur after the deal passes preliminary underwriting. Match the project to the lender's property type, leverage, rehab limits, borrower requirements, liquidity and closing timeline.",

          confidence:
            "HIGH",

          action:
            "Run capital engine."

        };

      }


      if (
        q.includes("auction")
      ) {

        return {

          answer:
            "Auction intelligence starts with the seller, auction type, deposit, reserve/minimum bid, occupancy, title/liens, financing restrictions, closing deadline and verified property condition.",

          confidence:
            "HIGH",

          action:
            "Review auction terms."

        };

      }


      if (
        q.includes("what is missing") ||
        q.includes("missing information")
      ) {

        const missing = [];


        if (!snapshot.context.state)
          missing.push("State");

        if (!snapshot.context.county)
          missing.push("County");

        if (!snapshot.context.city)
          missing.push("City");

        if (!snapshot.market.arv)
          missing.push("ARV");

        if (!snapshot.market.rehab)
          missing.push("Rehab");

        if (!snapshot.auction.currentBid)
          missing.push("Current bid");


        return {

          answer:
            missing.length
              ? "Missing: " + missing.join(", ") + "."
              : "The major basic fields are populated. Continue with title, auction terms, contractor verification and lender-specific requirements.",

          confidence:
            "HIGH"

        };

      }


      return {

        answer:
          "I understand the question, but I need to classify it against the current machine data. Ask me specifically about maximum bid, ARV, rehab, risk, tax liens, redemption, auction terms, contractor, capital or due diligence.",

        confidence:
          "MEDIUM"

      };

    },


    /* ---------------------------------------------------------
       UTILITIES
    --------------------------------------------------------- */

    toNumber: function (value) {

      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {

        return 0;

      }


      const number =
        Number(
          String(value)
            .replace(/[$,%\s,]/g, "")
        );


      return Number.isFinite(number)
        ? number
        : 0;

    },


    formatMoney: function (value) {

      const number =
        this.toNumber(value);


      return new Intl.NumberFormat(
        "en-US",
        {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0
        }
      ).format(number);

    },


    /* ---------------------------------------------------------
       EVENTS
    --------------------------------------------------------- */

    registerGlobalEvents: function () {

      const ids = [

        "address",
        "county",
        "taxCounty",
        "taxState",
        "taxCity",
        "auctionType",
        "taxSaleType",
        "openingBid",
        "currentBid",
        "reserve",
        "arv",
        "rehab",
        "closing",
        "holding",
        "selling",
        "financingCosts",
        "profit",
        "contingency",
        "buyerCapital"

      ];


      ids.forEach(
        (id) => {

          const element =
            document.getElementById(id);


          if (!element) return;


          element.addEventListener(
            "input",
            () => {

              this.detectMachineContext();

            }
          );

          element.addEventListener(
            "change",
            () => {

              this.detectMachineContext();

            }
          );

        }
      );

    },


    /* ---------------------------------------------------------
       STATUS
    --------------------------------------------------------- */

    publishStatus: function () {

      const event =
        new CustomEvent(
          "rolyfe:global-intelligence-ready",
          {
            detail: {
              version:
                this.version,

              engine:
                this
            }
          }
        );


      document.dispatchEvent(event);

    }

  };


  /* -----------------------------------------------------------
     GLOBAL ACCESS
  ----------------------------------------------------------- */

  window.ROLyfeGlobalIntelligence =
    GlobalIntelligence;


  /* -----------------------------------------------------------
     AUTO START
  ----------------------------------------------------------- */

  function start() {

    GlobalIntelligence.init();

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      start
    );

  } else {

    start();

  }


})(window, document);
