/* =========================================================
   RO'Lyfe Auction Capital Machine™
   js/deal-engine.js

   PRODUCTION DEAL ENGINE

   Purpose:
   - Calculate acquisition economics
   - Calculate maximum acquisition price
   - Calculate total project cost
   - Calculate capital requirement
   - Calculate bid room
   - Calculate gross spread
   - Compare current bid against acquisition ceiling
   - Support three acquisition structures
   - Expose results to app.js and the UI

   This engine performs planning calculations only.
   It does not guarantee valuation, financing, profit,
   approval, acquisition price, or investment outcome.
   ========================================================= */

(() => {

  "use strict";


  /* =======================================================
     HELPERS
     ======================================================= */

  function num(value) {

    const n = Number(value);

    return Number.isFinite(n) ? n : 0;
  }


  function money(value) {

    return new Intl.NumberFormat("en-US", {

      style: "currency",

      currency: "USD",

      maximumFractionDigits: 0

    }).format(num(value));

  }


  function field(id) {

    const el =
      document.getElementById(id);

    if (!el) return 0;

    return num(el.value);

  }


  /* =======================================================
     CORE ACQUISITION FORMULA
     ======================================================= */

  function calculate(input = {}) {

    const arv =
      num(input.arv ?? field("arv"));

    const rehab =
      num(input.rehab ?? field("rehab"));

    const closing =
      num(input.closing ?? field("closing"));

    const holding =
      num(input.holding ?? field("holding"));

    const selling =
      num(input.selling ?? field("selling"));

    const financing =
      num(
        input.financingCosts ??
        field("financingCosts")
      );

    const requiredProfit =
      num(
        input.profit ??
        field("profit")
      );

    const contingency =
      num(
        input.contingency ??
        field("contingency")
      );

    const buyerCapital =
      num(
        input.buyerCapital ??
        field("buyerCapital")
      );

    const currentBid =
      num(
        input.currentBid ??
        field("currentBid")
      );


    /*
      Maximum Acquisition Price

      ARV
      - Rehab
      - Closing
      - Holding
      - Selling
      - Financing
      - Required Profit
      - Contingency
    */

    const maxAcquisition =
      arv
      - rehab
      - closing
      - holding
      - selling
      - financing
      - requiredProfit
      - contingency;


    /*
      Project cost uses the acquisition
      price when positive.

      We do not allow a negative acquisition
      price to reduce the project cost.
    */

    const acquisitionUsed =
      Math.max(
        maxAcquisition,
        0
      );


    const projectCost =
      acquisitionUsed
      + rehab
      + closing
      + holding
      + financing
      + contingency;


    const capitalNeed =
      Math.max(
        projectCost
        - buyerCapital,
        0
      );


    const bidRoom =
      maxAcquisition
      - currentBid;


    /*
      Gross spread before unlisted costs.

      This is intentionally a planning metric.
    */

    const grossSpread =
      arv
      - projectCost
      - selling;


    /*
      Difference between current bid
      and calculated acquisition ceiling.
    */

    const bidVariance =
      currentBid
      - maxAcquisition;


    let bidPosition =
      "NO CURRENT BID";


    if (currentBid > 0) {

      if (
        currentBid >
        maxAcquisition
      ) {

        bidPosition =
          "ABOVE ACQUISITION CEILING";

      } else if (
        currentBid ===
        maxAcquisition
      ) {

        bidPosition =
          "AT ACQUISITION CEILING";

      } else {

        bidPosition =
          "BELOW ACQUISITION CEILING";
      }
    }


    return {

      arv,

      rehab,

      closing,

      holding,

      selling,

      financing,

      requiredProfit,

      contingency,

      buyerCapital,

      currentBid,

      maxAcquisition,

      acquisitionUsed,

      projectCost,

      capitalNeed,

      bidRoom,

      bidVariance,

      grossSpread,

      bidPosition,

      calculatedAt:
        new Date().toISOString()
    };

  }


  /* =======================================================
     THREE-TIER ACQUISITION STRUCTURES
     =======================================================

     These are the RO'Lyfe planning structures already
     used throughout the ecosystem.

     Tier 1:
       Cash / investor acquisition
       50% ARV

     Tier 2:
       Seller Carry
       65% ARV
       5% down
       5% interest
       4-year term

     Tier 3:
       Seller Financing
       75% ARV
       6% interest
       5-year balloon

     These are planning examples, not financing offers.
     ======================================================= */


  function calculateTierStructures(arv) {

    arv =
      num(arv);


    const cash =
      arv * 0.50;


    const sellerCarry =
      arv * 0.65;


    const sellerCarryDown =
      sellerCarry * 0.05;


    const sellerFinancing =
      arv * 0.75;


    const sellerFinancingDown =
      sellerFinancing * 0.05;


    return {

      cash: {

        label:
          "All Cash",

        acquisitionTarget:
          cash,

        structure:
          "50% of ARV"
      },


      sellerCarry: {

        label:
          "Seller Carry",

        acquisitionTarget:
          sellerCarry,

        downPayment:
          sellerCarryDown,

        interestRate:
          0.05,

        termYears:
          4,

        structure:
          "65% ARV / 5% down / 5% interest / 4-year term"
      },


      sellerFinancing: {

        label:
          "Seller Financing",

        acquisitionTarget:
          sellerFinancing,

        downPayment:
          sellerFinancingDown,

        interestRate:
          0.06,

        balloonYears:
          5,

        structure:
          "75% ARV / 5% down / 6% interest / 5-year balloon"
      }

    };

  }


  /* =======================================================
     ACQUISITION CEILING VS CURRENT BID
     ======================================================= */

  function compareBid(
    currentBid,
    maxAcquisition
  ) {

    currentBid =
      num(currentBid);

    maxAcquisition =
      num(maxAcquisition);


    if (!currentBid) {

      return {

        status:
          "NO BID ENTERED",

        difference:
          maxAcquisition,

        message:
          "Enter the current auction bid."
      };

    }


    if (
      currentBid >
      maxAcquisition
    ) {

      return {

        status:
          "ABOVE CEILING",

        difference:
          currentBid -
          maxAcquisition,

        message:
          "Current bid is above the calculated acquisition ceiling."
      };

    }


    if (
      currentBid ===
      maxAcquisition
    ) {

      return {

        status:
          "AT CEILING",

        difference:
          0,

        message:
          "Current bid equals the calculated acquisition ceiling."
      };

    }


    return {

      status:
        "BELOW CEILING",

      difference:
        maxAcquisition -
        currentBid,

      message:
        "Current bid remains below the calculated acquisition ceiling."
    };

  }


  /* =======================================================
     PROFIT SENSITIVITY
     ======================================================= */

  function sensitivity(
    input = {}
  ) {

    const base =
      calculate(input);


    const profits = [

      num(base.requiredProfit) * 0.50,

      num(base.requiredProfit),

      num(base.requiredProfit) * 1.50

    ];


    return profits.map(
      (profit) => {

        return calculate({

          ...input,

          profit
        });

      }
    );

  }


  /* =======================================================
     REHAB IMPACT
     ======================================================= */

  function rehabSensitivity(
    input = {},
    rehabValues = []
  ) {

    return rehabValues.map(
      (rehab) => {

        return calculate({

          ...input,

          rehab:
            num(rehab)

        };

      }
    );

  }


  /* =======================================================
     ACQUISITION PRICE FROM TARGET MARGIN
     ======================================================= */

  function maximumPurchaseFromMargin(
    arv,
    totalNonPurchaseCosts,
    targetProfit
  ) {

    arv =
      num(arv);

    totalNonPurchaseCosts =
      num(totalNonPurchaseCosts);

    targetProfit =
      num(targetProfit);


    return (
      arv
      - totalNonPurchaseCosts
      - targetProfit
    );

  }


  /* =======================================================
     FORMAT RESULT FOR UI
     ======================================================= */

  function formatResult(result) {

    if (!result) return null;


    return {

      "Maximum Acquisition Price":
        money(
          result.maxAcquisition
        ),

      "Total Project Cost":
        money(
          result.projectCost
        ),

      "Capital Requirement":
        money(
          result.capitalNeed
        ),

      "Current Bid":
        money(
          result.currentBid
        ),

      "Bid Room":
        money(
          result.bidRoom
        ),

      "Gross Spread":
        money(
          result.grossSpread
        ),

      "Bid Position":
        result.bidPosition

    };

  }


  /* =======================================================
     EXPOSE ENGINE
     ======================================================= */

  window.ROLyfeDealEngine = {

    version:
      "1.0.0",

    calculate:
      calculate,

    calculateTiers:
      calculateTierStructures,

    compareBid:
      compareBid,

    sensitivity:
      sensitivity,

    rehabSensitivity:
      rehabSensitivity,

    maximumPurchaseFromMargin:
      maximumPurchaseFromMargin,

    formatResult:
      formatResult,

    money:
      money

  };


  /* =======================================================
     EVENT BRIDGE
     ======================================================= */

  document.addEventListener(
    "rolyfe:opportunity-saved",
    () => {

      const result =
        calculate();

      if (
        result &&
        window.ROLyfeAuctionMachine
      ) {

        window
          .ROLyfeAuctionMachine
          .state
          .analysis =
          result;

      }

    }
  );


  /* =======================================================
     READY MESSAGE
     ======================================================= */

  console.info(
    "RO'Lyfe Deal Engine™ initialized."
  );


})();
