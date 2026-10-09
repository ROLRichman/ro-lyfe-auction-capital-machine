/* =========================================================
   RO'Lyfe Auction Capital Machine™
   js/auction-engine.js

   PRODUCTION AUCTION ENGINE

   Handles:
   - Auction property facts
   - Auction dates / countdown
   - Opening bid
   - Current bid
   - Bid increment
   - Reserve status
   - EMD
   - Financing restrictions
   - Occupancy
   - Auction status
   - Bid-room analysis
   - Auction-source validation
   - Opportunity snapshot
   ========================================================= */

(() => {

  "use strict";


  /* =======================================================
     HELPERS
     ======================================================= */

  const $ = (id) =>
    document.getElementById(id);


  function value(id) {

    const el = $(id);

    return el ? el.value.trim() : "";

  }


  function number(id) {

    const el = $(id);

    if (!el) return 0;

    const n =
      Number(el.value);

    return Number.isFinite(n)
      ? n
      : 0;

  }


  function money(value) {

    return new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }
    ).format(
      Number(value) || 0
    );

  }


  /* =======================================================
     AUCTION DATA
     ======================================================= */

  function getAuctionData() {

    return {

      url:
        value("auctionUrl"),

      address:
        value("address"),

      type:
        value("auctionType"),

      occupancy:
        value("occupancy"),

      auctionDate:
        value("auctionDate"),

      auctionTime:
        value("auctionTime"),

      openingBid:
        number("openingBid"),

      currentBid:
        number("currentBid"),

      bidIncrement:
        number("bidIncrement"),

      reserve:
        value("reserve"),

      financing:
        value("financing"),

      emd:
        number("emd"),

      notes:
        value("auctionNotes"),

      capturedAt:
        new Date().toISOString()

    };

  }


  /* =======================================================
     AUCTION STATUS
     ======================================================= */

  function getAuctionDateTime() {

    const date =
      value("auctionDate");

    const time =
      value("auctionTime");

    if (!date) {
      return null;
    }

    const combined =
      time
        ? `${date}T${time}`
        : `${date}T23:59:59`;

    const parsed =
      new Date(combined);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {

      return null;

    }

    return parsed;

  }


  function getStatus() {

    const auctionDate =
      getAuctionDateTime();

    if (!auctionDate) {

      return {

        code:
          "DATE_NOT_SET",

        label:
          "AUCTION DATE NOT SET",

        className:
          "yellow"

      };

    }


    const now =
      new Date();


    const difference =
      auctionDate.getTime()
      - now.getTime();


    if (
      difference < 0
    ) {

      return {

        code:
          "ENDED",

        label:
          "AUCTION DATE PASSED",

        className:
          "red"

      };

    }


    if (
      difference <=
      24 * 60 * 60 * 1000
    ) {

      return {

        code:
          "WITHIN_24_HOURS",

        label:
          "AUCTION WITHIN 24 HOURS",

        className:
          "yellow"

      };

    }


    return {

      code:
        "UPCOMING",

      label:
        "AUCTION UPCOMING",

      className:
        "green"

    };

  }


  /* =======================================================
     COUNTDOWN
     ======================================================= */

  function getCountdown() {

    const auctionDate =
      getAuctionDateTime();


    if (!auctionDate) {

      return {

        totalMilliseconds:
          null,

        days:
          0,

        hours:
          0,

        minutes:
          0,

        seconds:
          0,

        text:
          "Auction date not set"

      };

    }


    const difference =
      auctionDate.getTime()
      - Date.now();


    if (
      difference <= 0
    ) {

      return {

        totalMilliseconds:
          difference,

        days:
          0,

        hours:
          0,

        minutes:
          0,

        seconds:
          0,

        text:
          "Auction date passed"

      };

    }


    const totalSeconds =
      Math.floor(
        difference / 1000
      );


    const days =
      Math.floor(
        totalSeconds /
        86400
      );


    const hours =
      Math.floor(
        (
          totalSeconds %
          86400
        ) / 3600
      );


    const minutes =
      Math.floor(
        (
          totalSeconds %
          3600
        ) / 60
      );


    const seconds =
      totalSeconds %
      60;


    return {

      totalMilliseconds:
        difference,

      days,

      hours,

      minutes,

      seconds,

      text:
        `${days}d ${hours}h ${minutes}m ${seconds}s`

    };

  }


  /* =======================================================
     BID ANALYSIS
     ======================================================= */

  function analyzeBid(
    maxAcquisition
  ) {

    const currentBid =
      number("currentBid");

    const increment =
      number("bidIncrement");


    const ceiling =
      Number(maxAcquisition) || 0;


    const bidRoom =
      ceiling -
      currentBid;


    let status =
      "NO BID";


    if (
      currentBid > 0 &&
      ceiling > 0
    ) {

      if (
        currentBid >
        ceiling
      ) {

        status =
          "ABOVE CEILING";

      } else if (
        currentBid ===
        ceiling
      ) {

        status =
          "AT CEILING";

      } else {

        status =
          "BELOW CEILING";

      }

    }


    let nextBid =
      currentBid;


    if (
      currentBid > 0 &&
      increment > 0
    ) {

      nextBid =
        currentBid +
        increment;

    }


    let nextBidStatus =
      "NOT CALCULATED";


    if (
      nextBid > 0 &&
      ceiling > 0
    ) {

      if (
        nextBid >
        ceiling
      ) {

        nextBidStatus =
          "NEXT BID EXCEEDS CEILING";

      } else {

        nextBidStatus =
          "NEXT BID WITHIN CEILING";

      }

    }


    return {

      currentBid,

      increment,

      nextBid,

      maxAcquisition:
        ceiling,

      bidRoom,

      status,

      nextBidStatus

    };

  }


  /* =======================================================
     EMD ANALYSIS
     ======================================================= */

  function analyzeEMD(
    purchasePrice
  ) {

    const emd =
      number("emd");


    const price =
      Number(purchasePrice) || 0;


    if (
      !emd ||
      !price
    ) {

      return {

        amount:
          emd,

        percentage:
          0,

        status:
          "NOT ENTERED"

      };

    }


    const percentage =
      (
        emd /
        price
      ) * 100;


    return {

      amount:
        emd,

      percentage,

      status:
        "ENTERED"

    };

  }


  /* =======================================================
     FINANCING CHECK
     ======================================================= */

  function financingCheck() {

    const financing =
      value("financing");


    if (!financing) {

      return {

        status:
          "UNKNOWN",

        message:
          "Auction financing terms have not been entered."

      };

    }


    const lower =
      financing.toLowerCase();


    if (
      lower.includes(
        "cash only"
      )
    ) {

      return {

        status:
          "CASH_ONLY",

        message:
          "Auction indicates cash-only financing. Verify the purchase terms before bidding."

      };

    }


    if (
      lower.includes(
        "hard money"
      )
    ) {

      return {

        status:
          "HARD_MONEY",

        message:
          "Hard-money financing may be permitted. Verify lender and auction requirements."

      };

    }


    if (
      lower.includes(
        "line of credit"
      )
    ) {

      return {

        status:
          "LOC",

        message:
          "A line of credit may be permitted. Verify auction requirements."

      };

    }


    return {

      status:
        "VERIFY",

      message:
        "Financing terms require direct verification with the auction source."

    };

  }


  /* =======================================================
     OCCUPANCY CHECK
     ======================================================= */

  function occupancyCheck() {

    const occupancy =
      value("occupancy");


    if (!occupancy) {

      return {

        status:
          "UNKNOWN",

        message:
          "Occupancy has not been entered."

      };

    }


    if (
      occupancy ===
      "Occupied"
    ) {

      return {

        status:
          "OCCUPIED",

        message:
          "Property is marked occupied. Access, possession and occupancy risks require review."

      };

    }


    if (
      occupancy ===
      "Vacant"
    ) {

      return {

        status:
          "VACANT",

        message:
          "Property is marked vacant. Verify condition and possession independently."

      };

    }


    return {

      status:
        "UNKNOWN",

      message:
        "Occupancy requires verification."

    };

  }


  /* =======================================================
     RESERVE CHECK
     ======================================================= */

  function reserveCheck() {

    const reserve =
      value("reserve");


    if (
      reserve ===
      "Reserve Met"
    ) {

      return {

        status:
          "MET",

        message:
          "Reserve is marked met."

      };

    }


    if (
      reserve ===
      "Reserve Not Met"
    ) {

      return {

        status:
          "NOT_MET",

        message:
          "Reserve is marked not met. Seller acceptance requirements may still apply."

      };

    }


    return {

      status:
        "UNKNOWN",

      message:
        "Reserve status has not been verified."

    };

  }


  /* =======================================================
     AUCTION SNAPSHOT
     ======================================================= */

  function snapshot(
    maxAcquisition = 0
  ) {

    const auction =
      getAuctionData();


    const status =
      getStatus();


    const countdown =
      getCountdown();


    const bid =
      analyzeBid(
        maxAcquisition
      );


    const emd =
      analyzeEMD(
        maxAcquisition
      );


    const financing =
      financingCheck();


    const occupancy =
      occupancyCheck();


    const reserve =
      reserveCheck();


    return {

      auction,

      status,

      countdown,

      bid,

      emd,

      financing,

      occupancy,

      reserve,

      capturedAt:
        new Date().toISOString()

    };

  }


  /* =======================================================
     UPDATE AUCTION UI
     ======================================================= */

  function updateStatusUI() {

    const status =
      getStatus();


    const countdown =
      getCountdown();


    const statusElement =
      $("auctionStatus");


    if (statusElement) {

      statusElement.innerHTML =
        `<div class="status ${status.className}">` +
        `${status.label}` +
        `</div>`;

    }


    const countdownElement =
      $("auctionCountdown");


    if (countdownElement) {

      countdownElement.textContent =
        countdown.text;

    }


    const nextBidElement =
      $("nextBid");


    if (nextBidElement) {

      const bid =
        analyzeBid(
          window
            .ROLyfeDealEngine
            ?.calculate()
            ?.maxAcquisition || 0
        );


      nextBidElement.textContent =
        money(
          bid.nextBid
        );

    }

  }


  /* =======================================================
     AUCTION VALIDATION
     ======================================================= */

  function validate() {

    const auction =
      getAuctionData();


    const issues = [];


    if (
      !auction.address
    ) {

      issues.push(
        "Property address is missing."
      );

    }


    if (
      !auction.url
    ) {

      issues.push(
        "Auction URL is missing."
      );

    }


    if (
      !auction.currentBid &&
      !auction.openingBid
    ) {

      issues.push(
        "Opening bid or current bid is missing."
      );

    }


    if (
      !auction.financing
    ) {

      issues.push(
        "Financing status requires verification."
      );

    }


    if (
      auction.occupancy ===
      "Unknown"
    ) {

      issues.push(
        "Occupancy has not been verified."
      );

    }


    return {

      valid:
        issues.length === 0,

      issues

    };

  }


  /* =======================================================
     AUCTION SOURCE
     ======================================================= */

  function openAuction() {

    const url =
      value("auctionUrl");


    if (!url) {

      alert(
        "Enter the auction property URL first."
      );

      return;

    }


    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

  }


  /* =======================================================
     MACHINE API
     ======================================================= */

  window.ROLyfeAuctionEngine = {

    version:
      "1.0.0",

    getData:
      getAuctionData,

    getStatus:
      getStatus,

    getCountdown:
      getCountdown,

    analyzeBid:
      analyzeBid,

    analyzeEMD:
      analyzeEMD,

    financingCheck:
      financingCheck,

    occupancyCheck:
      occupancyCheck,

    reserveCheck:
      reserveCheck,

    snapshot:
      snapshot,

    validate:
      validate,

    openAuction:
      openAuction,

    updateUI:
      updateStatusUI,

    money:
      money

  };


  /* =======================================================
     LIVE CLOCK / COUNTDOWN
     ======================================================= */

  function startAuctionClock() {

    updateStatusUI();


    setInterval(
      updateStatusUI,
      1000
    );

  }


  /* =======================================================
     INPUT LISTENERS
     ======================================================= */

  function bindAuctionInputs() {

    const ids = [

      "auctionUrl",
      "address",
      "auctionType",
      "occupancy",
      "auctionDate",
      "auctionTime",
      "openingBid",
      "currentBid",
      "bidIncrement",
      "reserve",
      "financing",
      "emd"

    ];


    ids.forEach(
      (id) => {

        const el =
          $(id);

        if (!el) return;


        el.addEventListener(
          "input",
          updateStatusUI
        );


        el.addEventListener(
          "change",
          updateStatusUI
        );

      }
    );

  }


  /* =======================================================
     INITIALIZATION
     ======================================================= */

  function initialize() {

    bindAuctionInputs();

    startAuctionClock();


    console.info(
      "RO'Lyfe Auction Engine™ initialized."
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
