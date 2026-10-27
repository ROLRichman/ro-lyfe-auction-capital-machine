/* =========================================================
   RO'Lyfe Auction Capital Machine™
   Rehab Budget Intelligence Engine
   File: js/rehab-budget-engine.js

   Purpose:
   - Build structured rehab budgets
   - Support COGO-style repair categories
   - Calculate rehab subtotal
   - Apply configurable contingency
   - Calculate total rehab budget
   - Compare rehab against ARV / acquisition
   - Feed underwriting + capital engines
   - Preserve lender-specific contingency rules

   NOTE:
   This is a planning/analysis engine.
   It does NOT guarantee lender approval, construction cost,
   draw approval, ARV, or funding.
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
    if (value === null || value === undefined || value === "") {
      return 0;
    }

    var cleaned = String(value)
      .replace(/[$,%\s,]/g, "")
      .trim();

    var parsed = parseFloat(cleaned);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(num(value));
  }

  function percent(value) {
    return num(value) / 100;
  }

  function safeSet(id, value) {
    var el = $(id);

    if (!el) {
      return;
    }

    if ("value" in el) {
      el.value = value;
    } else {
      el.textContent = value;
    }
  }

  function safeText(id, value) {
    var el = $(id);

    if (!el) {
      return;
    }

    el.textContent = value;
  }

  /* =========================================================
     COGO / LENDER-STYLE REHAB CATEGORIES
     ========================================================= */

  var REHAB_CATEGORIES = [
    {
      id: "architect",
      name: "Architect",
      group: "Professional / Pre-Construction"
    },
    {
      id: "asphaltPaving",
      name: "Asphalt & Paving",
      group: "Exterior"
    },
    {
      id: "basement",
      name: "Basement",
      group: "Structural / Interior"
    },
    {
      id: "bathroomAccessories",
      name: "Bathroom Accessories / Mirror",
      group: "Bathroom"
    },
    {
      id: "bathroomTile",
      name: "Bathroom Tile",
      group: "Bathroom"
    },
    {
      id: "bathroomVanity",
      name: "Bathroom Vanity & Countertop",
      group: "Bathroom"
    },
    {
      id: "bedroomHardware",
      name: "Bedroom Hardware",
      group: "Interior"
    },
    {
      id: "carpentryRough",
      name: "Carpentry Rough",
      group: "Structural / Interior"
    },
    {
      id: "carpets",
      name: "Carpets",
      group: "Flooring"
    },
    {
      id: "ceilingWork",
      name: "Ceiling Work",
      group: "Interior"
    },
    {
      id: "closetsShelves",
      name: "Closet / Shelves",
      group: "Interior"
    },
    {
      id: "concreteMaterial",
      name: "Concrete Material",
      group: "Exterior"
    },
    {
      id: "curbsGuttersWalkways",
      name: "Curbs / Gutters / Walkways",
      group: "Exterior"
    },
    {
      id: "deckingPorchPatio",
      name: "Decking / Porch / Patio",
      group: "Exterior"
    },
    {
      id: "demolition",
      name: "Demolition",
      group: "Site / Preparation"
    },
    {
      id: "downspoutsGutters",
      name: "Downspouts / Gutters",
      group: "Exterior"
    },
    {
      id: "driveway",
      name: "Driveway",
      group: "Exterior"
    },
    {
      id: "drywall",
      name: "Drywall / Tape / Texture / Sheetrock",
      group: "Interior"
    },
    {
      id: "dumpster",
      name: "Dumpster",
      group: "Site / Preparation"
    },
    {
      id: "electricalFinish",
      name: "Electrical Finish",
      group: "Electrical"
    },
    {
      id: "electricalLabor",
      name: "Electrical Labor",
      group: "Electrical"
    },
    {
      id: "electricalRough",
      name: "Electrical Rough",
      group: "Electrical"
    },
    {
      id: "exteriorDoors",
      name: "Exterior Doors",
      group: "Exterior"
    },
    {
      id: "exteriorPainting",
      name: "Exterior Painting",
      group: "Exterior"
    },
    {
      id: "fasciaSoffit",
      name: "Fascia / Soffit",
      group: "Exterior"
    },
    {
      id: "fencing",
      name: "Fencing",
      group: "Exterior"
    },
    {
      id: "finalCleanupStaging",
      name: "Final Clean Up / Staging",
      group: "Closeout"
    },
    {
      id: "finishCarpentry",
      name: "Finish Carpentry",
      group: "Interior"
    },
    {
      id: "finishHardware",
      name: "Finish Hardware",
      group: "Interior"
    },
    {
      id: "finishLaborOtherSiteWork",
      name: "Finish Labor / Other Site Work",
      group: "Labor"
    },
    {
      id: "fireAlarms",
      name: "Fire Alarms",
      group: "Life Safety"
    },
    {
      id: "fireplaceChimney",
      name: "Fireplace / Chimney / Mantles",
      group: "Exterior / Structural"
    },
    {
      id: "flooringGeneral",
      name: "Flooring / General / Sub",
      group: "Flooring"
    },
    {
      id: "footingsFoundationSlab",
      name: "Footings / Foundation / Slab",
      group: "Structural"
    },
    {
      id: "framingLabor",
      name: "Framing Labor / Rough Carpentry",
      group: "Structural"
    },
    {
      id: "framingLumber",
      name: "Framing Lumber Material",
      group: "Structural"
    },
    {
      id: "garage",
      name: "Garage",
      group: "Exterior"
    },
    {
      id: "garageDoor",
      name: "Garage Door / Opener",
      group: "Exterior"
    },
    {
      id: "hardwoodFloors",
      name: "Hardwood Floors",
      group: "Flooring"
    },
    {
      id: "hvac",
      name: "HVAC",
      group: "Mechanical"
    },
    {
      id: "insulation",
      name: "Insulation",
      group: "Interior"
    },
    {
      id: "interiorDoorsHardware",
      name: "Interior Doors / Hardware",
      group: "Interior"
    },
    {
      id: "interiorPainting",
      name: "Interior Painting",
      group: "Interior"
    },
    {
      id: "kitchen",
      name: "Kitchen",
      group: "Kitchen"
    },
    {
      id: "kitchenAppliances",
      name: "Kitchen Appliances",
      group: "Kitchen"
    },
    {
      id: "kitchenCabinets",
      name: "Kitchen Cabinets / Hardware",
      group: "Kitchen"
    },
    {
      id: "kitchenCountertops",
      name: "Kitchen Countertops",
      group: "Kitchen"
    },
    {
      id: "kitchenHardware",
      name: "Kitchen Hardware",
      group: "Kitchen"
    },
    {
      id: "kitchenSink",
      name: "Kitchen Sink",
      group: "Kitchen"
    },
    {
      id: "landscaping",
      name: "Landscaping",
      group: "Exterior"
    },
    {
      id: "laundryRoom",
      name: "Laundry Room",
      group: "Interior"
    },
    {
      id: "lightFixturesFans",
      name: "Light Fixtures / Ceiling Fans",
      group: "Electrical"
    },
    {
      id: "linoleumVinylLaminate",
      name: "Linoleum / Vinyl / Laminate",
      group: "Flooring"
    },
    {
      id: "managementSupervisedFees",
      name: "Management / Supervised Fees",
      group: "Professional / Management"
    },
    {
      id: "masonryVeneerStone",
      name: "Masonry / Veneer / Stone",
      group: "Exterior"
    },
    {
      id: "mirrorsAccessories",
      name: "Mirrors & Accessories",
      group: "Interior"
    },
    {
      id: "misc",
      name: "Miscellaneous",
      group: "Other"
    },
    {
      id: "oilTankReplacement",
      name: "Oil Tank Replacement",
      group: "Mechanical / Environmental"
    },
    {
      id: "otherLabor",
      name: "Other Labor",
      group: "Labor"
    },
    {
      id: "permitFees",
      name: "Permit Fees & Inspections",
      group: "Professional / Compliance"
    },
    {
      id: "plans",
      name: "Plans",
      group: "Professional / Pre-Construction"
    },
    {
      id: "plumbingFinish",
      name: "Plumbing Finish",
      group: "Plumbing"
    },
    {
      id: "plumbingLabor",
      name: "Plumbing Labor",
      group: "Plumbing"
    },
    {
      id: "plumbingRough",
      name: "Plumbing Rough",
      group: "Plumbing"
    },
    {
      id: "pool",
      name: "Pool",
      group: "Exterior"
    },
    {
      id: "portableJohn",
      name: "Portable John",
      group: "Site / Preparation"
    },
    {
      id: "powerWash",
      name: "Power Wash",
      group: "Exterior"
    },
    {
      id: "roofing",
      name: "Roofing",
      group: "Exterior"
    },
    {
      id: "septicSewer",
      name: "Septic / Sewer",
      group: "Utilities"
    },
    {
      id: "siding",
      name: "Siding",
      group: "Exterior"
    },
    {
      id: "sinksToiletsTubs",
      name: "Sinks / Toilets / Tubs / Showers",
      group: "Plumbing / Bathroom"
    },
    {
      id: "testing",
      name: "Soil / Termite / Lead / Mold / Testing",
      group: "Environmental / Compliance"
    },
    {
      id: "stairsRailings",
      name: "Stairs / Railings",
      group: "Structural / Interior"
    },
    {
      id: "structural",
      name: "Structural",
      group: "Structural"
    },
    {
      id: "stuccoPlaster",
      name: "Stucco / Plaster",
      group: "Exterior / Interior"
    },
    {
      id: "tempUtilities",
      name: "Temporary Utilities",
      group: "Utilities"
    },
    {
      id: "tilePrepFinish",
      name: "Tile / Prep / Finish",
      group: "Flooring / Interior"
    },
    {
      id: "trashOut",
      name: "Trash Out",
      group: "Site / Preparation"
    },
    {
      id: "trussesBeams",
      name: "Trusses / Beams",
      group: "Structural"
    },
    {
      id: "wallWork",
      name: "Wall Work",
      group: "Interior"
    },
    {
      id: "wallcovering",
      name: "Wallcovering / Wallpaper / Paneling",
      group: "Interior"
    },
    {
      id: "waterHookupHeater",
      name: "Water Hook-up / Water Heater",
      group: "Plumbing"
    },
    {
      id: "windows",
      name: "Windows",
      group: "Exterior"
    }
  ];

  /* =========================================================
     KNOWN EXAMPLE VALUES FROM USER'S COGO BUDGET
     
     These are OPTIONAL reference defaults.
     They do not override manually entered values.
     ========================================================= */

  var REFERENCE_DEFAULTS = {
    drywall: 15000,
    dumpster: 2000,
    electricalLabor: 8000,
    exteriorDoors: 2500,
    flooringGeneral: 15000,
    framingLabor: 15000,
    hvac: 13000,
    interiorPainting: 3000,
    kitchen: 20000,
    lightFixturesFans: 1200,
    permitFees: 3000,
    plumbingLabor: 18000,
    roofing: 12000,
    siding: 8000,
    sinksToiletsTubs: 3000,
    stairsRailings: 1000,
    structural: 15000,
    waterHookupHeater: 1300,
    windows: 8000
  };

  /* =========================================================
     STATE
     ========================================================= */

  var state = {
    contingencyPercent: 0,
    lenderContingencyCap: null,
    lenderName: "",
    notes: "",
    categories: {},
    lastCalculation: null
  };

  /* =========================================================
     INITIALIZE CATEGORY STATE
     ========================================================= */

  REHAB_CATEGORIES.forEach(function (category) {
    state.categories[category.id] = {
      name: category.name,
      group: category.group,
      cost: 0,
      notes: ""
    };
  });

  /* =========================================================
     READ EXISTING INPUTS
     ========================================================= */

  function readCategoryCosts() {
    REHAB_CATEGORIES.forEach(function (category) {
      var input = $(
        "rehab-" +
        category.id
      );

      if (!input) {
        input = $(category.id);
      }

      if (input) {
        state.categories[category.id].cost = num(input.value);
      }
    });

    return state.categories;
  }

  /* =========================================================
     SET CATEGORY COST
     ========================================================= */

  function setCategoryCost(categoryId, amount) {
    if (!state.categories[categoryId]) {
      return false;
    }

    var value = Math.max(num(amount), 0);

    state.categories[categoryId].cost = value;

    var input = $("rehab-" + categoryId) || $(categoryId);

    if (input) {
      input.value = value;
    }

    return true;
  }

  /* =========================================================
     GET CATEGORY COST
     ========================================================= */

  function getCategoryCost(categoryId) {
    if (!state.categories[categoryId]) {
      return 0;
    }

    return num(state.categories[categoryId].cost);
  }

  /* =========================================================
     SUBTOTAL
     ========================================================= */

  function calculateSubtotal() {
    readCategoryCosts();

    var subtotal = 0;

    Object.keys(state.categories).forEach(function (id) {
      subtotal += num(state.categories[id].cost);
    });

    return subtotal;
  }

  /* =========================================================
     CONTINGENCY
     ========================================================= */

  function getContingencyPercent() {
    var input =
      $("rehabContingencyPercent") ||
      $("contingencyPercent") ||
      $("rehab-contingency-percent");

    if (input) {
      return Math.max(num(input.value), 0);
    }

    return Math.max(num(state.contingencyPercent), 0);
  }

  function calculateContingency(subtotal) {
    var requestedPercent = getContingencyPercent();

    var appliedPercent = requestedPercent;

    if (
      state.lenderContingencyCap !== null &&
      Number.isFinite(state.lenderContingencyCap)
    ) {
      appliedPercent = Math.min(
        requestedPercent,
        state.lenderContingencyCap
      );
    }

    return {
      requestedPercent: requestedPercent,
      appliedPercent: appliedPercent,
      amount: subtotal * percent(appliedPercent),
      capped:
        appliedPercent < requestedPercent
    };
  }

  /* =========================================================
     TOTAL REHAB BUDGET
     ========================================================= */

  function calculateBudget() {
    var subtotal = calculateSubtotal();

    var contingency = calculateContingency(subtotal);

    var total = subtotal + contingency.amount;

    var result = {
      subtotal: subtotal,
      contingencyPercent: contingency.appliedPercent,
      requestedContingencyPercent:
        contingency.requestedPercent,
      contingencyAmount: contingency.amount,
      totalRehabBudget: total,
      contingencyCapped: contingency.capped,
      categoryCount: REHAB_CATEGORIES.length,
      populatedCategories: Object.keys(state.categories)
        .filter(function (id) {
          return num(state.categories[id].cost) > 0;
        })
        .length,
      calculatedAt: new Date().toISOString()
    };

    state.lastCalculation = result;

    updateBudgetUI(result);

    return result;
  }

  /* =========================================================
     CATEGORY BREAKDOWN
     ========================================================= */

  function getCategoryBreakdown() {
    readCategoryCosts();

    return REHAB_CATEGORIES
      .map(function (category) {
        return {
          id: category.id,
          name: category.name,
          group: category.group,
          cost: num(state.categories[category.id].cost)
        };
      })
      .filter(function (item) {
        return item.cost > 0;
      })
      .sort(function (a, b) {
        return b.cost - a.cost;
      });
  }

  /* =========================================================
     GROUP BREAKDOWN
     ========================================================= */

  function getGroupBreakdown() {
    var groups = {};

    getCategoryBreakdown().forEach(function (item) {
      if (!groups[item.group]) {
        groups[item.group] = 0;
      }

      groups[item.group] += item.cost;
    });

    return Object.keys(groups)
      .map(function (group) {
        return {
          group: group,
          cost: groups[group]
        };
      })
      .sort(function (a, b) {
        return b.cost - a.cost;
      });
  }

  /* =========================================================
     ARV / PROJECT ANALYSIS
     ========================================================= */

  function analyzeAgainstARV(arv, acquisitionPrice) {
    var budget = calculateBudget();

    var arvValue = num(arv);
    var acquisition = num(acquisitionPrice);

    var totalBasis =
      acquisition +
      budget.totalRehabBudget;

    var remainingValue =
      arvValue -
      totalBasis;

    var rehabToARV =
      arvValue > 0
        ? budget.totalRehabBudget / arvValue
        : 0;

    return {
      arv: arvValue,
      acquisitionPrice: acquisition,
      rehabBudget: budget.totalRehabBudget,
      totalBasis: totalBasis,
      remainingValue: remainingValue,
      rehabToARVPercent: rehabToARV * 100
    };
  }

  /* =========================================================
     REHAB BUDGET VS MAX ACQUISITION
     ========================================================= */

  function analyzeWithDealEngine() {
    var budget = calculateBudget();

    var deal = null;

    if (
      window.ROLyfeDealEngine &&
      typeof window.ROLyfeDealEngine.calculate === "function"
    ) {
      deal = window.ROLyfeDealEngine.calculate();
    }

    if (!deal) {
      return {
        rehabBudget: budget.totalRehabBudget,
        dealAvailable: false
      };
    }

    return {
      rehabBudget: budget.totalRehabBudget,
      dealAvailable: true,
      arv: num(deal.arv),
      maxAcquisition:
        num(deal.maxAcquisition),
      projectCost:
        num(deal.projectCost),
      capitalNeed:
        num(deal.capitalNeed),
      rehabDifference:
        num(deal.rehab) -
        budget.totalRehabBudget
    };
  }

  /* =========================================================
     LENDER CONTINGENCY RULE
     
     IMPORTANT:
     COGO specifically allowed "up to 10%" in the
     form the user supplied.

     We therefore DO NOT automatically force 10%.
     The engine accepts a lender-specific cap.
     ========================================================= */

  function setLenderRule(config) {
    config = config || {};

    state.lenderName =
      config.lenderName ||
      "";

    if (
      config.contingencyCap !== undefined &&
      config.contingencyCap !== null
    ) {
      state.lenderContingencyCap =
        Math.max(
          num(config.contingencyCap),
          0
        );
    } else {
      state.lenderContingencyCap = null;
    }

    if (
      config.defaultContingency !== undefined &&
      config.defaultContingency !== null
    ) {
      state.contingencyPercent =
        Math.max(
          num(config.defaultContingency),
          0
        );
    }

    return {
      lenderName: state.lenderName,
      contingencyCap:
        state.lenderContingencyCap,
      defaultContingency:
        state.contingencyPercent
    };
  }

  /* =========================================================
     COGO CONFIGURATION
     ========================================================= */

  function configureCOGO() {
    return setLenderRule({
      lenderName: "COGO",
      contingencyCap: 10,
      defaultContingency: 10
    });
  }

  /* =========================================================
     REFERENCE BUDGET
     
     Loads only if a category has no manually entered amount.
     This gives the user a starting example without destroying
     existing data.
     ========================================================= */

  function loadReferenceBudget() {
    Object.keys(REFERENCE_DEFAULTS).forEach(function (id) {
      if (
        state.categories[id] &&
        num(state.categories[id].cost) === 0
      ) {
        state.categories[id].cost =
          REFERENCE_DEFAULTS[id];

        var input =
          $("rehab-" + id) ||
          $(id);

        if (input) {
          input.value =
            REFERENCE_DEFAULTS[id];
        }
      }
    });

    return calculateBudget();
  }

  /* =========================================================
     CLEAR BUDGET
     ========================================================= */

  function clearBudget() {
    REHAB_CATEGORIES.forEach(function (category) {
      state.categories[category.id].cost = 0;

      var input =
        $("rehab-" + category.id) ||
        $(category.id);

      if (input) {
        input.value = "";
      }
    });

    state.lastCalculation = null;

    return calculateBudget();
  }

  /* =========================================================
     EXPORT SNAPSHOT
     ========================================================= */

  function snapshot() {
    var budget = calculateBudget();

    return {
      engine: "RO'Lyfe Rehab Budget Intelligence Engine",
      version: "1.0.0",
      lender: state.lenderName || null,
      subtotal: budget.subtotal,
      contingencyPercent:
        budget.contingencyPercent,
      contingencyAmount:
        budget.contingencyAmount,
      totalRehabBudget:
        budget.totalRehabBudget,
      categories:
        getCategoryBreakdown(),
      groups:
        getGroupBreakdown(),
      calculatedAt:
        budget.calculatedAt
    };
  }

  /* =========================================================
     UI UPDATE
     ========================================================= */

  function updateBudgetUI(result) {
    safeText(
      "rehabSubtotal",
      money(result.subtotal)
    );

    safeText(
      "rehabContingency",
      money(result.contingencyAmount)
    );

    safeText(
      "rehabTotal",
      money(result.totalRehabBudget)
    );

    safeText(
      "rehabBudgetSubtotal",
      money(result.subtotal)
    );

    safeText(
      "rehabBudgetContingency",
      money(result.contingencyAmount)
    );

    safeText(
      "rehabBudgetTotal",
      money(result.totalRehabBudget)
    );

    safeText(
      "rehabCategoryCount",
      result.populatedCategories
    );

    if (result.contingencyCapped) {
      safeText(
        "rehabContingencyNotice",
        "Lender contingency cap applied."
      );
    } else {
      safeText(
        "rehabContingencyNotice",
        ""
      );
    }
  }

  /* =========================================================
     AUTO-BIND COMMON CONTROLS
     ========================================================= */

  function bindControls() {
    var calculateButtons = [
      "calculateRehab",
      "calculateRehabBudget",
      "btnCalculateRehab",
      "btnRehabCalculate"
    ];

    calculateButtons.forEach(function (id) {
      var button = $(id);

      if (!button) {
        return;
      }

      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          calculateBudget();
        }
      );
    });

    var referenceButtons = [
      "loadReferenceRehab",
      "loadCOGOExample",
      "btnLoadCOGO"
    ];

    referenceButtons.forEach(function (id) {
      var button = $(id);

      if (!button) {
        return;
      }

      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          loadReferenceBudget();
        }
      );
    });

    var clearButtons = [
      "clearRehab",
      "clearRehabBudget",
      "btnClearRehab"
    ];

    clearButtons.forEach(function (id) {
      var button = $(id);

      if (!button) {
        return;
      }

      button.addEventListener(
        "click",
        function (event) {
          event.preventDefault();
          clearBudget();
        }
      );
    });

    REHAB_CATEGORIES.forEach(function (category) {
      var input =
        $("rehab-" + category.id) ||
        $(category.id);

      if (!input) {
        return;
      }

      input.addEventListener(
        "input",
        function () {
          state.categories[category.id].cost =
            num(input.value);

          calculateBudget();
        }
      );
    });

    var contingencyInput =
      $("rehabContingencyPercent") ||
      $("contingencyPercent") ||
      $("rehab-contingency-percent");

    if (contingencyInput) {
      contingencyInput.addEventListener(
        "input",
        function () {
          state.contingencyPercent =
            Math.max(
              num(contingencyInput.value),
              0
            );

          calculateBudget();
        }
      );
    }
  }

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {
    bindControls();

    /*
     * Do not automatically load the COGO example.
     * The engine starts at $0 so the user's actual
     * contractor/lender budget remains authoritative.
     */
    calculateBudget();
  }

  /* =========================================================
     PUBLIC ENGINE
     ========================================================= */

  window.ROLyfeRehabBudgetEngine = {

    version: "1.0.0",

    categories:
      REHAB_CATEGORIES,

    referenceDefaults:
      REFERENCE_DEFAULTS,

    state:
      state,

    calculate:
      calculateBudget,

    calculateSubtotal:
      calculateSubtotal,

    calculateContingency:
      calculateContingency,

    getCategoryCost:
      getCategoryCost,

    setCategoryCost:
      setCategoryCost,

    getCategoryBreakdown:
      getCategoryBreakdown,

    getGroupBreakdown:
      getGroupBreakdown,

    analyzeAgainstARV:
      analyzeAgainstARV,

    analyzeWithDealEngine:
      analyzeWithDealEngine,

    setLenderRule:
      setLenderRule,

    configureCOGO:
      configureCOGO,

    loadReferenceBudget:
      loadReferenceBudget,

    clearBudget:
      clearBudget,

    snapshot:
      snapshot
  };

  /* =========================================================
     START
     ========================================================= */

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
