/* =========================================================
   RO'Lyfe Auction Capital Machine™
   Risk Intelligence Engine
   File: js/risk-engine.js

   Purpose:
   - Identify auction/deal risk factors
   - Separate known facts from missing information
   - Score individual risk categories
   - Track due-diligence gaps
   - Connect auction, rehab, underwriting and capital data
   - Produce a lender/investor discussion snapshot

   IMPORTANT:
   This is a decision-support and due-diligence tool.
   It is NOT a lender approval, appraisal, title opinion,
   legal opinion, inspection, environmental report, or
   guarantee of investment performance.
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
        maximumFractionDigits: 0
      }
    ).format(num(value));
  }

  function safeText(id, value) {
    var el = $(id);

    if (el) {
      el.textContent = value;
    }
  }

  function safeClass(id, className) {
    var el = $(id);

    if (!el) {
      return;
    }

    el.classList.remove(
      "risk-low",
      "risk-moderate",
      "risk-high",
      "risk-critical",
      "risk-unknown"
    );

    if (className) {
      el.classList.add(className);
    }
  }

  /* =========================================================
     RISK LEVELS
     ========================================================= */

  var RISK_LEVELS = {
    LOW: {
      key: "LOW",
      label: "LOW",
      score: 0
    },

    MODERATE: {
      key: "MODERATE",
      label: "MODERATE",
      score: 1
    },

    HIGH: {
      key: "HIGH",
      label: "HIGH",
      score: 2
    },

    CRITICAL: {
      key: "CRITICAL",
      label: "CRITICAL",
      score: 3
    },

    UNKNOWN: {
      key: "UNKNOWN",
      label: "UNKNOWN",
      score: null
    }
  };

  /* =========================================================
     RISK CATEGORIES
     ========================================================= */

  var RISK_CATEGORIES = [
    {
      id: "occupancy",
      name: "Occupancy",
      description:
        "Occupied properties can create access, possession, inspection and closing considerations."
    },

    {
      id: "title",
      name: "Title / Liens",
      description:
        "Outstanding liens, taxes, judgments, HOA/COA balances or title defects may affect the transaction."
    },

    {
      id: "condition",
      name: "Property Condition",
      description:
        "Unknown physical condition can cause rehab estimates to change."
    },

    {
      id: "rehab",
      name: "Rehab Budget",
      description:
        "Rehab uncertainty can affect total project cost and capital requirements."
    },

    {
      id: "auctionTerms",
      name: "Auction Terms",
      description:
        "Auction rules, deposits, financing restrictions, reserves and deadlines affect execution."
    },

    {
      id: "financing",
      name: "Financing",
      description:
        "Capital availability and lender requirements must be confirmed before bidding."
    },

    {
      id: "arv",
      name: "ARV / Valuation",
      description:
        "Projected after-repair value must be supported by appropriate comparable-property research."
    },

    {
      id: "market",
      name: "Market / Exit",
      description:
        "The planned resale, refinance, rental or other exit depends on market conditions and execution."
    },

    {
      id: "legal",
      name: "Legal / Compliance",
      description:
        "Permits, zoning, occupancy, municipal requirements and transaction documents may require professional review."
    },

    {
      id: "dueDiligence",
      name: "Due Diligence",
      description:
        "Missing documentation creates uncertainty regardless of the property's apparent economics."
    }
  ];

  /* =========================================================
     STATE
     ========================================================= */

  var state = {
    risks: {},
    findings: [],
    missingItems: [],
    score: null,
    level: "UNKNOWN",
    lastCalculation: null
  };

  RISK_CATEGORIES.forEach(
    function (category) {
      state.risks[category.id] = {
        id: category.id,
        name: category.name,
        level: "UNKNOWN",
        score: null,
        findings: []
      };
    }
  );

  /* =========================================================
     FINDING CREATOR
     ========================================================= */

  function finding(
    category,
    level,
    message,
    action
  ) {
    return {
      category: category,
      level: level,
      message: message,
      action: action || ""
    };
  }

  /* =========================================================
     INPUT COLLECTION
     ========================================================= */

  function getInputData() {

    var data = {
      address:
        $("address")
          ? $("address").value
          : "",

      auctionType:
        $("auctionType")
          ? $("auctionType").value
          : "",

      occupancy:
        $("occupancy")
          ? $("occupancy").value
          : "",

      reserve:
        $("reserve")
          ? $("reserve").value
          : "",

      financing:
        $("financing")
          ? $("financing").value
          : "",

      auctionDate:
        $("auctionDate")
          ? $("auctionDate").value
          : "",

      auctionTime:
        $("auctionTime")
          ? $("auctionTime").value
          : "",

      openingBid:
        $("openingBid")
          ? num($("openingBid").value)
          : 0,

      currentBid:
        $("currentBid")
          ? num($("currentBid").value)
          : 0,

      bidIncrement:
        $("bidIncrement")
          ? num($("bidIncrement").value)
          : 0,

      emd:
        $("emd")
          ? num($("emd").value)
          : 0,

      arv:
        $("arv")
          ? num($("arv").value)
          : 0,

      rehab:
        $("rehab")
          ? num($("rehab").value)
          : 0,

      closing:
        $("closing")
          ? num($("closing").value)
          : 0,

      holding:
        $("holding")
          ? num($("holding").value)
          : 0,

      selling:
        $("selling")
          ? num($("selling").value)
          : 0,

      financingCosts:
        $("financingCosts")
          ? num($("financingCosts").value)
          : 0,

      profit:
        $("profit")
          ? num($("profit").value)
          : 0,

      contingency:
        $("contingency")
          ? num($("contingency").value)
          : 0,

      buyerCapital:
        $("buyerCapital")
          ? num($("buyerCapital").value)
          : 0
    };

    return data;
  }

  /* =========================================================
     AUCTION RISK
     ========================================================= */

  function assessAuctionTerms(data) {

    var findings = [];

    if (!data.auctionType) {

      findings.push(
        finding(
          "auctionTerms",
          "UNKNOWN",
          "Auction type has not been identified.",
          "Confirm the auction structure and purchase terms."
        )
      );

    }

    if (!data.auctionDate) {

      findings.push(
        finding(
          "auctionTerms",
          "HIGH",
          "Auction date has not been entered.",
          "Confirm the exact auction date and deadline."
        )
      );

    }

    if (
      data.bidIncrement <= 0
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "MODERATE",
          "Bid increment has not been entered.",
          "Confirm the auction's required bid increment."
        )
      );

    }

    if (
      data.currentBid <= 0 &&
      data.openingBid <= 0
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "UNKNOWN",
          "No opening or current bid is available.",
          "Verify the live auction price."
        )
      );

    }

    if (
      text(data.reserve).includes(
        "not met"
      )
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "HIGH",
          "The reserve is reported as not met.",
          "Confirm whether the seller must accept the winning bid."
        )
      );

    }

    if (
      data.emd <= 0
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "HIGH",
          "Earnest-money amount has not been entered.",
          "Confirm the EMD amount and payment deadline."
        )
      );

    }

    return findings;
  }

  /* =========================================================
     OCCUPANCY RISK
     ========================================================= */

  function assessOccupancy(data) {

    var findings = [];

    var occupancy =
      text(data.occupancy);

    if (!occupancy) {

      findings.push(
        finding(
          "occupancy",
          "UNKNOWN",
          "Occupancy status is unknown.",
          "Verify whether the property is vacant, owner occupied, tenant occupied or otherwise occupied."
        )
      );

      return findings;
    }

    if (
      occupancy.includes("occupied")
    ) {

      findings.push(
        finding(
          "occupancy",
          "HIGH",
          "The property is reported as occupied.",
          "Confirm access, possession, tenant/occupant status and applicable auction procedures."
        )
      );

    } else if (
      occupancy.includes("vacant")
    ) {

      findings.push(
        finding(
          "occupancy",
          "LOW",
          "The property is reported as vacant.",
          "Still verify condition, access and property security."
        )
      );

    } else {

      findings.push(
        finding(
          "occupancy",
          "UNKNOWN",
          "Occupancy could not be classified.",
          "Verify current occupancy."
        )
      );
    }

    return findings;
  }

  /* =========================================================
     FINANCING RISK
     ========================================================= */

  function assessFinancing(data) {

    var findings = [];

    var financing =
      text(data.financing);

    if (!financing) {

      findings.push(
        finding(
          "financing",
          "HIGH",
          "Financing status has not been identified.",
          "Determine whether the auction permits financing and confirm lender requirements before bidding."
        )
      );

      return findings;
    }

    if (
      financing.includes("cash only")
    ) {

      findings.push(
        finding(
          "financing",
          "HIGH",
          "The property is reported as cash-only.",
          "Confirm whether approved hard money, private money or other permitted funds qualify."
        )
      );

    } else if (
      financing.includes("conventional")
    ) {

      findings.push(
        finding(
          "financing",
          "MODERATE",
          "Conventional financing is referenced.",
          "Confirm auction-specific financing requirements."
        )
      );

    } else {

      findings.push(
        finding(
          "financing",
          "MODERATE",
          "A financing pathway is identified but lender acceptance has not been verified.",
          "Obtain lender confirmation before treating financing as available."
        )
      );
    }

    return findings;
  }

  /* =========================================================
     ARV RISK
     ========================================================= */

  function assessARV(data) {

    var findings = [];

    if (
      data.arv <= 0
    ) {

      findings.push(
        finding(
          "arv",
          "HIGH",
          "ARV has not been entered.",
          "Complete comparable-property research before relying on the deal economics."
        )
      );

      return findings;
    }

    if (
      data.rehab <= 0
    ) {

      findings.push(
        finding(
          "arv",
          "MODERATE",
          "ARV is entered but rehab is not established.",
          "Obtain a contractor scope and budget."
        )
      );
    }

    if (
      data.currentBid > data.arv
    ) {

      findings.push(
        finding(
          "arv",
          "CRITICAL",
          "Current bid is above the entered ARV.",
          "Stop and verify the valuation and auction data before proceeding."
        )
      );
    }

    return findings;
  }

  /* =========================================================
     REHAB RISK
     ========================================================= */

  function assessRehab(data) {

    var findings = [];

    if (
      data.rehab <= 0
    ) {

      findings.push(
        finding(
          "rehab",
          "HIGH",
          "No rehab budget has been entered.",
          "Obtain a contractor estimate or detailed scope of work."
        )
      );

      return findings;
    }

    if (
      data.arv > 0
    ) {

      var ratio =
        data.rehab /
        data.arv;

      if (
        ratio >= 0.40
      ) {

        findings.push(
          finding(
            "rehab",
            "HIGH",
            "Rehab represents 40% or more of the entered ARV.",
            "Verify the scope, structural condition, permits and lender rehab requirements."
          )
        );

      } else if (
        ratio >= 0.25
      ) {

        findings.push(
          finding(
            "rehab",
            "MODERATE",
            "Rehab represents 25% or more of the entered ARV.",
            "Confirm the contractor scope and contingency."
          )
        );

      } else {

        findings.push(
          finding(
            "rehab",
            "LOW",
            "Entered rehab is below 25% of ARV.",
            "Continue verifying actual property condition."
          )
        );
      }
    }

    return findings;
  }

  /* =========================================================
     TITLE / LIEN RISK
     ========================================================= */

  function assessTitle() {

    return [
      finding(
        "title",
        "UNKNOWN",
        "Title, lien and municipal obligations have not been verified by this engine.",
        "Obtain appropriate title/lien research before treating the property as cleared."
      )
    ];
  }

  /* =========================================================
     LEGAL / COMPLIANCE RISK
     ========================================================= */

  function assessLegal() {

    return [
      finding(
        "legal",
        "UNKNOWN",
        "Legal, zoning, permit and municipal status has not been verified.",
        "Confirm applicable requirements with the appropriate professionals and authorities."
      )
    ];
  }

  /* =========================================================
     MARKET / EXIT RISK
     ========================================================= */

  function assessMarket(data) {

    var findings = [];

    if (
      data.arv <= 0
    ) {

      findings.push(
        finding(
          "market",
          "HIGH",
          "No ARV is available to support an exit analysis.",
          "Complete comparable-property research."
        )
      );

      return findings;
    }

    if (
      data.selling <= 0
    ) {

      findings.push(
        finding(
          "market",
          "MODERATE",
          "Selling costs have not been entered.",
          "Estimate commissions, transfer costs, concessions and other applicable selling expenses."
        )
      );

    } else {

      findings.push(
        finding(
          "market",
          "LOW",
          "Selling costs have been included in the analysis.",
          "Continue verifying the assumptions against the actual exit strategy."
        )
      );
    }

    return findings;
  }

  /* =========================================================
     DUE DILIGENCE RISK
     ========================================================= */

  function assessDueDiligence(data) {

    var findings = [];

    var checks = [
      {
        condition:
          !data.address,
        message:
          "Property address is missing.",
        action:
          "Enter the complete property address."
      },

      {
        condition:
          !data.auctionType,
        message:
          "Auction type is missing.",
        action:
          "Identify the auction type."
      },

      {
        condition:
          !data.arv,
        message:
          "ARV is missing.",
        action:
          "Complete valuation research."
      },

      {
        condition:
          !data.rehab,
        message:
          "Rehab budget is missing.",
        action:
          "Obtain a rehab estimate."
      },

      {
        condition:
          !data.buyerCapital,
        message:
          "Buyer available capital is missing.",
        action:
          "Confirm available capital or financing source."
      }
    ];

    checks.forEach(
      function (check) {

        if (check.condition) {

          findings.push(
            finding(
              "dueDiligence",
              "HIGH",
              check.message,
              check.action
            )
          );
        }
      }
    );

    if (
      findings.length === 0
    ) {

      findings.push(
        finding(
          "dueDiligence",
          "MODERATE",
          "Core deal inputs are populated.",
          "Continue property-specific title, condition, auction and lender verification."
        )
      );
    }

    return findings;
  }

  /* =========================================================
     RUN CATEGORY ASSESSMENT
     ========================================================= */

  function assessCategory(
    categoryId,
    findings
  ) {

    var category =
      state.risks[categoryId];

    if (!category) {
      return;
    }

    category.findings =
      findings || [];

    var scores =
      findings
        .map(function (item) {

          if (
            item.level ===
            "CRITICAL"
          ) {
            return 3;
          }

          if (
            item.level ===
            "HIGH"
          ) {
            return 2;
          }

          if (
            item.level ===
            "MODERATE"
          ) {
            return 1;
          }

          if (
            item.level ===
            "LOW"
          ) {
            return 0;
          }

          return null;
        })
        .filter(function (score) {
          return score !== null;
        });

    if (
      scores.length === 0
    ) {

      category.level =
        "UNKNOWN";

      category.score =
        null;

      return;
    }

    var maximum =
      Math.max.apply(
        null,
        scores
      );

    category.score =
      maximum;

    if (
      maximum >= 3
    ) {
      category.level =
        "CRITICAL";

    } else if (
      maximum >= 2
    ) {
      category.level =
        "HIGH";

    } else if (
      maximum >= 1
    ) {
      category.level =
        "MODERATE";

    } else {
      category.level =
        "LOW";
    }
  }

  /* =========================================================
     OVERALL RISK
     ========================================================= */

  function calculateOverallRisk() {

    var scores = [];

    Object.keys(
      state.risks
    ).forEach(
      function (id) {

        var score =
          state.risks[id].score;

        if (
          score !== null
        ) {
          scores.push(score);
        }
      }
    );

    if (
      scores.length === 0
    ) {

      return {
        level: "UNKNOWN",
        score: null,
        knownCategories: 0
      };
    }

    var average =
      scores.reduce(
        function (sum, value) {
          return sum + value;
        },
        0
      ) / scores.length;

    var maximum =
      Math.max.apply(
        null,
        scores
      );

    var level;

    if (
      maximum >= 3
    ) {

      level = "CRITICAL";

    } else if (
      maximum >= 2
    ) {

      level = "HIGH";

    } else if (
      average >= 0.75
    ) {

      level = "MODERATE";

    } else {

      level = "LOW";
    }

    return {
      level: level,
      score: average,
      maximumCategoryScore:
        maximum,
      knownCategories:
        scores.length
    };
  }

  /* =========================================================
     MISSING INFORMATION
     ========================================================= */

  function collectMissingItems() {

    var missing = [];

    Object.keys(
      state.risks
    ).forEach(
      function (id) {

        state.risks[id].findings
          .forEach(
            function (item) {

              if (
                item.level ===
                "UNKNOWN"
              ) {

                missing.push({
                  category:
                    item.category,
                  message:
                    item.message,
                  action:
                    item.action
                });
              }
            }
          );
      }
    );

    state.missingItems =
      missing;

    return missing;
  }

  /* =========================================================
     MASTER CALCULATION
     ========================================================= */

  function calculate() {

    var data =
      getInputData();

    assessCategory(
      "auctionTerms",
      assessAuctionTerms(data)
    );

    assessCategory(
      "occupancy",
      assessOccupancy(data)
    );

    assessCategory(
      "financing",
      assessFinancing(data)
    );

    assessCategory(
      "arv",
      assessARV(data)
    );

    assessCategory(
      "rehab",
      assessRehab(data)
    );

    assessCategory(
      "title",
      assessTitle()
    );

    assessCategory(
      "legal",
      assessLegal()
    );

    assessCategory(
      "market",
      assessMarket(data)
    );

    assessCategory(
      "dueDiligence",
      assessDueDiligence(data)
    );

    /*
     * Property condition is intentionally
     * conservative until inspection/contractor
     * information is available.
     */

    assessCategory(
      "condition",
      [
        finding(
          "condition",
          "UNKNOWN",
          "Physical condition has not been independently verified.",
          "Obtain inspection/contractor access and document major systems."
        )
      ]
    );

    var overall =
      calculateOverallRisk();

    var missing =
      collectMissingItems();

    var allFindings = [];

    Object.keys(
      state.risks
    ).forEach(
      function (id) {

        state.risks[id].findings
          .forEach(
            function (item) {
              allFindings.push(item);
            }
          );
      }
    );

    state.findings =
      allFindings;

    state.score =
      overall.score;

    state.level =
      overall.level;

    var result = {

      level:
        overall.level,

      score:
        overall.score,

      maximumCategoryScore:
        overall.maximumCategoryScore,

      knownCategories:
        overall.knownCategories,

      risks:
        state.risks,

      findings:
        allFindings,

      missingItems:
        missing,

      calculatedAt:
        new Date().toISOString()
    };

    state.lastCalculation =
      result;

    updateUI(result);

    return result;
  }

  /* =========================================================
     UI UPDATE
     ========================================================= */

  function updateUI(result) {

    safeText(
      "riskLevel",
      result.level
    );

    safeText(
      "overallRisk",
      result.level
    );

    safeText(
      "riskScore",
      result.score === null
        ? "N/A"
        : result.score.toFixed(2)
    );

    safeText(
      "riskMissingCount",
      result.missingItems.length
    );

    safeText(
      "riskFindingCount",
      result.findings.length
    );

    safeClass(
      "riskLevel",
      "risk-" +
        result.level.toLowerCase()
    );

    safeClass(
      "overallRisk",
      "risk-" +
        result.level.toLowerCase()
    );

    /*
     * Update category-specific UI if those
     * IDs are eventually added to index.html.
     */

    Object.keys(
      result.risks
    ).forEach(
      function (id) {

        safeText(
          "risk-" +
            id +
            "-level",
          result.risks[id].level
        );

        safeClass(
          "risk-" +
            id +
            "-level",
          "risk-" +
            result.risks[id].level
              .toLowerCase()
        );
      }
    );
  }

  /* =========================================================
     GET CRITICAL / HIGH FINDINGS
     ========================================================= */

  function getPriorityFindings() {

    return state.findings.filter(
      function (item) {

        return (
          item.level === "CRITICAL" ||
          item.level === "HIGH"
        );
      }
    );
  }

  /* =========================================================
     GET DUE-DILIGENCE QUEUE
     ========================================================= */

  function getDueDiligenceQueue() {

    var queue = [];

    state.findings.forEach(
      function (item) {

        if (
          item.action
        ) {

          queue.push({
            priority:
              item.level,
            category:
              item.category,
            task:
              item.action
          });
        }
      }
    );

    return queue;
  }

  /* =========================================================
     BID RISK CHECK
     ========================================================= */

  function analyzeBidRisk(
    proposedBid
  ) {

    var data =
      getInputData();

    var bid =
      num(proposedBid);

    var findings = [];

    if (
      bid <= 0
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "UNKNOWN",
          "No proposed bid was entered.",
          "Enter a proposed acquisition price."
        )
      );

      return {
        bid: bid,
        findings: findings,
        level: "UNKNOWN"
      };
    }

    if (
      data.arv > 0 &&
      bid >= data.arv
    ) {

      findings.push(
        finding(
          "arv",
          "CRITICAL",
          "Proposed bid is at or above the entered ARV.",
          "Recheck valuation, strategy and all deal assumptions."
        )
      );
    }

    if (
      data.rehab > 0 &&
      data.arv > 0
    ) {

      var totalBeforeOtherCosts =
        bid +
        data.rehab;

      if (
        totalBeforeOtherCosts >=
        data.arv
      ) {

        findings.push(
          finding(
            "rehab",
            "CRITICAL",
            "Bid plus rehab reaches or exceeds the entered ARV before other project costs.",
            "Recalculate the maximum acquisition price."
          )
        );
      }
    }

    if (
      data.buyerCapital > 0 &&
      bid > data.buyerCapital
    ) {

      findings.push(
        finding(
          "financing",
          "HIGH",
          "Proposed bid exceeds entered buyer capital.",
          "Confirm financing, POF and capital stack."
        )
      );
    }

    if (
      findings.length === 0
    ) {

      findings.push(
        finding(
          "auctionTerms",
          "LOW",
          "No immediate bid-level warning was generated from the entered figures.",
          "Continue full due diligence."
        )
      );
    }

    var score =
      findings.reduce(
        function (highest, item) {

          var value =
            item.level === "CRITICAL"
              ? 3
              : item.level === "HIGH"
                ? 2
                : item.level === "MODERATE"
                  ? 1
                  : 0;

          return Math.max(
            highest,
            value
          );
        },
        0
      );

    return {
      bid: bid,
      findings: findings,
      level:
        score >= 3
          ? "CRITICAL"
          : score >= 2
            ? "HIGH"
            : score >= 1
              ? "MODERATE"
              : "LOW"
    };
  }

  /* =========================================================
     SNAPSHOT
     ========================================================= */

  function snapshot() {

    var result =
      calculate();

    return {
      engine:
        "RO'Lyfe Risk Intelligence Engine",

      version:
        "1.0.0",

      overallRisk:
        result.level,

      score:
        result.score,

      risks:
        result.risks,

      priorityFindings:
        getPriorityFindings(),

      dueDiligenceQueue:
        getDueDiligenceQueue(),

      missingItems:
        result.missingItems,

      calculatedAt:
        result.calculatedAt
    };
  }

  /* =========================================================
     AUTO-BIND
     ========================================================= */

  function bindControls() {

    var buttons =
      [
        "calculateRisk",
        "calculateRiskAnalysis",
        "btnCalculateRisk",
        "runRiskAnalysis"
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

    /*
     * Recalculate when important deal
     * inputs change.
     */

    var watchedInputs =
      [
        "occupancy",
        "reserve",
        "financing",
        "auctionDate",
        "auctionTime",
        "openingBid",
        "currentBid",
        "bidIncrement",
        "emd",
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

    watchedInputs.forEach(
      function (id) {

        var input =
          $(id);

        if (!input) {
          return;
        }

        input.addEventListener(
          "change",
          function () {
            calculate();
          }
        );

        input.addEventListener(
          "input",
          function () {
            calculate();
          }
        );
      }
    );
  }

  /* =========================================================
     PUBLIC ENGINE
     ========================================================= */

  window.ROLyfeRiskEngine = {

    version:
      "1.0.0",

    categories:
      RISK_CATEGORIES,

    levels:
      RISK_LEVELS,

    state:
      state,

    getInputData:
      getInputData,

    calculate:
      calculate,

    analyzeBidRisk:
      analyzeBidRisk,

    getPriorityFindings:
      getPriorityFindings,

    getDueDiligenceQueue:
      getDueDiligenceQueue,

    snapshot:
      snapshot
  };

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {

    bindControls();

    /*
     * Run once so the machine has an initial
     * risk state even before the user enters data.
     */

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
