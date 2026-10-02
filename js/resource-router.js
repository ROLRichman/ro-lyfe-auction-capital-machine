/* =========================================================
   RO'Lyfe Auction Capital Machine™
   Resource Router Intelligence Engine
   File: js/resource-router.js

   Purpose:
   - Route analyzed opportunities to research resources
   - Route deals to capital pathways
   - Build property-research URLs
   - Connect auction → property research → capital
   - Keep external links centralized
   - Provide resource snapshots to other engines

   NOTE:
   External resources have their own eligibility,
   underwriting, approval, fees and terms.
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     RESOURCE DIRECTORY
     ========================================================= */

  var RESOURCES = {

    /* -------------------------------------------------------
       AUCTION / PROPERTY RESEARCH
       ------------------------------------------------------- */

    auction: [
      {
        id: "auctionCom",
        name: "Auction.com",
        type: "auction",
        category: "Auction Research",
        url: "https://www.auction.com/",
        description:
          "Auction listings, auction details and property research."
      }
    ],

    propertyResearch: [
      {
        id: "phillyProperty",
        name: "Philadelphia Property App",
        type: "property",
        category: "Property Research",
        url: "https://property.phila.gov/",
        description:
          "Philadelphia property, assessment and public property information."
      },
      {
        id: "zillow",
        name: "Zillow",
        type: "property",
        category: "Property Research",
        url: "https://www.zillow.com/",
        description:
          "Property listings, estimated values and market research."
      },
      {
        id: "redfin",
        name: "Redfin",
        type: "property",
        category: "Property Research",
        url: "https://www.redfin.com/",
        description:
          "Property listings, sales history and market research."
      },
      {
        id: "realtor",
        name: "Realtor.com",
        type: "property",
        category: "Property Research",
        url: "https://www.realtor.com/",
        description:
          "Property listings and market research."
      }
    ],

    /* -------------------------------------------------------
       CAPITAL
       ------------------------------------------------------- */

    capital: [
      {
        id: "kiaviBroker",
        name: "Kiavi Broker",
        type: "capital",
        category: "Real Estate Capital",
        url:
          "https://app.kiavi.com/my/loans/origination",
        description:
          "Kiavi broker/origination pathway."
      },
      {
        id: "cogoApplication",
        name: "COGO Loan Application",
        type: "capital",
        category: "Business / Real Estate Capital",
        url:
          "https://www.borrowersviewcentral.com/portal/applynew?id=LCS",
        description:
          "COGO application pathway."
      },
      {
        id: "cogoCapital",
        name: "COGO Capital",
        type: "capital",
        category: "Business Capital",
        url:
          "https://www.cogocapital.com/",
        description:
          "Business and financing resources."
      },
      {
        id: "privateMoneyExchange",
        name: "Private Money Exchange",
        type: "capital",
        category: "Private Capital",
        url:
          "https://privatemoneyexchange.com/aff-page/richman/",
        description:
          "Private-money capital pathway."
      },
      {
        id: "americasFundingExperts",
        name: "Americas Funding Experts",
        type: "capital",
        category: "Business Capital",
        url:
          "https://my.americasfundingexperts.com/?id=1820217000190862001",
        description:
          "Business funding pathway."
      },
      {
        id: "myPartner",
        name: "MyPartner Business Financing",
        type: "capital",
        category: "Business Capital",
        url:
          "https://go.mypartner.io/business-financing/?ref=001Qk00000MkqgTIAR",
        description:
          "Business financing pathway."
      },
      {
        id: "getYourBizLoan",
        name: "GetYourBizLoan",
        type: "capital",
        category: "Business Capital",
        url:
          "https://getyourbizloan.io/lp1?pu=recqKxJNkvD70xMqi",
        description:
          "Business funding pathway."
      }
    ],

    /* -------------------------------------------------------
       CREDIT / BUSINESS SUPPORT
       ------------------------------------------------------- */

    businessSupport: [
      {
        id: "sevenFiguresCredit",
        name: "7 Figures Credit",
        type: "credit",
        category: "Credit",
        url:
          "https://www.7figurescredit.com/?a_aid=ROLFunding",
        description:
          "Credit-building and business-credit pathway."
      },
      {
        id: "bln",
        name: "BLN Underwriting Portal",
        type: "underwriting",
        category: "Underwriting",
        url:
          "https://rootoflyfe.blnsoftware.com/",
        description:
          "Underwriting and business-financing workflow."
      },
      {
        id: "jotformCapitalIntelligence",
        name: "RO'Lyfe Capital Intelligence Intake",
        type: "intake",
        category: "Intake",
        url:
          "https://form.jotform.com/253154859148062",
        description:
          "Capital Intelligence intake workflow."
      },
      {
        id: "jotformROIntake",
        name: "RO'Lyfe Intake",
        type: "intake",
        category: "Intake",
        url:
          "https://form.jotform.com/252063354378055",
        description:
          "RO'Lyfe opportunity intake."
      }
    ],

    /* -------------------------------------------------------
       TAX / LIEN RESEARCH
       ------------------------------------------------------- */

    taxResearch: [
      {
        id: "lienHub",
        name: "LienHub",
        type: "tax",
        category: "Tax Lien Research",
        url:
          "https://lienhub.com/",
        description:
          "Tax-lien research and auction resources."
      },
      {
        id: "phillyTaxCenter",
        name: "Philadelphia Tax Center",
        type: "tax",
        category: "Tax Research",
        url:
          "https://tax-services.phila.gov/",
        description:
          "Philadelphia tax information."
      },
      {
        id: "phillyWaterLien",
        name: "Philadelphia Water Lien",
        type: "tax",
        category: "Lien Research",
        url:
          "https://water-lien.phila.gov/",
        description:
          "Philadelphia water-lien research."
      }
    ],

    /* -------------------------------------------------------
       RO'LYFE INTERNAL TOOLS
       ------------------------------------------------------- */

    internal: [
      {
        id: "relocation",
        name: "RO'Lyfe Relocation Intelligence",
        type: "internal",
        category: "RO'Lyfe",
        url:
          "https://rolrichman.github.io/rolyfe-relocation-intelligence/",
        description:
          "Relocation research platform."
      },
      {
        id: "marketTerminal",
        name: "RO'Lyfe Market Terminal",
        type: "internal",
        category: "RO'Lyfe",
        url:
          "https://rolrichman.github.io/rolyfe-market-terminal/",
        description:
          "Market intelligence platform."
      },
      {
        id: "rolyfeMachine",
        name: "RO'Lyfe Machine",
        type: "internal",
        category: "RO'Lyfe",
        url:
          "https://rolrichman.github.io/rolyfe-machine/",
        description:
          "RO'Lyfe business intelligence platform."
      }
    ]
  };

  /* =========================================================
     FLATTEN RESOURCE DIRECTORY
     ========================================================= */

  function allResources() {
    var output = [];

    Object.keys(RESOURCES).forEach(function (group) {
      RESOURCES[group].forEach(function (resource) {
        output.push(resource);
      });
    });

    return output;
  }

  /* =========================================================
     FIND RESOURCE
     ========================================================= */

  function getResource(id) {
    return allResources().find(function (resource) {
      return resource.id === id;
    }) || null;
  }

  /* =========================================================
     FIND BY TYPE
     ========================================================= */

  function getByType(type) {
    return allResources().filter(function (resource) {
      return resource.type === type;
    });
  }

  /* =========================================================
     FIND BY CATEGORY
     ========================================================= */

  function getByCategory(category) {
    return allResources().filter(function (resource) {
      return resource.category === category;
    });
  }

  /* =========================================================
     OPEN RESOURCE
     ========================================================= */

  function openResource(id) {
    var resource = getResource(id);

    if (!resource) {
      return {
        success: false,
        error: "Resource not found.",
        resourceId: id
      };
    }

    window.open(
      resource.url,
      "_blank",
      "noopener,noreferrer"
    );

    return {
      success: true,
      resource: resource
    };
  }

  /* =========================================================
     PROPERTY URL BUILDERS
     ========================================================= */

  function encode(value) {
    return encodeURIComponent(
      String(value || "").trim()
    );
  }

  function buildPropertySearchUrls(address) {
    var property = String(address || "").trim();

    if (!property) {
      return {
        success: false,
        error: "Property address required."
      };
    }

    return {
      success: true,
      address: property,

      zillow:
        "https://www.zillow.com/homes/" +
        encode(property) +
        "_rb/",

      redfin:
        "https://www.redfin.com/search?q=" +
        encode(property),

      realtor:
        "https://www.realtor.com/realestateandhomes-search/" +
        encode(property.replace(/,/g, "")),

      googleMaps:
        "https://www.google.com/maps/search/?api=1&query=" +
        encode(property)
    };
  }

  /* =========================================================
     BUILD AUCTION RESEARCH PACKAGE
     ========================================================= */

  function buildAuctionResearchPackage(data) {
    data = data || {};

    var address =
      data.address ||
      "";

    var auctionUrl =
      data.auctionUrl ||
      "";

    var propertySearch =
      buildPropertySearchUrls(address);

    return {
      address: address,

      auction: {
        url: auctionUrl ||
          getResource("auctionCom").url
      },

      propertySearch:
        propertySearch,

      resources: {
        philadelphia:
          getResource("phillyProperty"),

        zillow:
          getResource("zillow"),

        redfin:
          getResource("redfin"),

        realtor:
          getResource("realtor")
      }
    };
  }

  /* =========================================================
     CAPITAL ROUTING
     ========================================================= */

  function routeCapital(options) {
    options = options || {};

    var rehab =
      num(options.rehab);

    var acquisition =
      num(options.acquisition);

    var totalProject =
      num(options.totalProject);

    if (!totalProject) {
      totalProject =
        acquisition + rehab;
    }

    var routes = [];

    /*
     * These are routing categories, NOT approval decisions.
     */

    if (options.realEstate === true) {
      routes.push(
        getResource("kiaviBroker")
      );

      routes.push(
        getResource("privateMoneyExchange")
      );
    }

    if (options.businessFunding === true) {
      routes.push(
        getResource("cogoApplication")
      );

      routes.push(
        getResource("cogoCapital")
      );

      routes.push(
        getResource("americasFundingExperts")
      );

      routes.push(
        getResource("myPartner")
      );
    }

    if (options.creditSupport === true) {
      routes.push(
        getResource("sevenFiguresCredit")
      );
    }

    return {
      acquisition: acquisition,
      rehab: rehab,
      totalProject: totalProject,
      routes: routes.filter(Boolean)
    };
  }

  /* =========================================================
     FULL OPPORTUNITY ROUTE
     ========================================================= */

  function routeOpportunity(data) {
    data = data || {};

    var address =
      data.address ||
      "";

    var research =
      buildAuctionResearchPackage(data);

    var capital =
      routeCapital({
        realEstate:
          data.realEstate !== false,

        businessFunding:
          data.businessFunding === true,

        creditSupport:
          data.creditSupport === true,

        acquisition:
          data.acquisition,

        rehab:
          data.rehab,

        totalProject:
          data.totalProject
      });

    return {
      opportunity: {
        address: address,
        auctionUrl:
          data.auctionUrl || ""
      },

      research: research,

      capital: capital,

      routedAt:
        new Date().toISOString()
    };
  }

  /* =========================================================
     RESOURCE LINKS UI
     ========================================================= */

  function createLink(resource) {
    var link =
      document.createElement("a");

    link.href =
      resource.url;

    link.target =
      "_blank";

    link.rel =
      "noopener noreferrer";

    link.className =
      "resource-link";

    link.textContent =
      resource.name;

    return link;
  }

  function renderResources(containerId, group) {
    var container =
      document.getElementById(
        containerId
      );

    if (!container) {
      return false;
    }

    var resources =
      RESOURCES[group];

    if (!resources) {
      return false;
    }

    container.innerHTML = "";

    resources.forEach(function (resource) {

      var wrapper =
        document.createElement("div");

      wrapper.className =
        "resource-item";

      var link =
        createLink(resource);

      var description =
        document.createElement("div");

      description.className =
        "resource-description";

      description.textContent =
        resource.description;

      wrapper.appendChild(link);
      wrapper.appendChild(description);

      container.appendChild(wrapper);
    });

    return true;
  }

  /* =========================================================
     UI: ROUTE CURRENT PROPERTY
     ========================================================= */

  function routeCurrentProperty() {

    var addressInput =
      document.getElementById(
        "address"
      );

    var address =
      addressInput
        ? addressInput.value
        : "";

    if (!address.trim()) {
      return {
        success: false,
        error:
          "Enter a property address first."
      };
    }

    var packageData =
      buildAuctionResearchPackage({
        address: address
      });

    /*
     * If dedicated buttons exist, update them.
     */

    var zillowButton =
      document.getElementById(
        "zillowPropertyLink"
      );

    if (zillowButton) {
      zillowButton.href =
        packageData.propertySearch.zillow;
    }

    var redfinButton =
      document.getElementById(
        "redfinPropertyLink"
      );

    if (redfinButton) {
      redfinButton.href =
        packageData.propertySearch.redfin;
    }

    var realtorButton =
      document.getElementById(
        "realtorPropertyLink"
      );

    if (realtorButton) {
      realtorButton.href =
        packageData.propertySearch.realtor;
    }

    var mapsButton =
      document.getElementById(
        "googleMapsPropertyLink"
      );

    if (mapsButton) {
      mapsButton.href =
        packageData.propertySearch.googleMaps;
    }

    return packageData;
  }

  /* =========================================================
     VALIDATION
     ========================================================= */

  function validateResource(resource) {

    if (!resource) {
      return {
        valid: false,
        reason:
          "Resource does not exist."
      };
    }

    if (!resource.url) {
      return {
        valid: false,
        reason:
          "Resource has no URL."
      };
    }

    return {
      valid: true,
      resource: resource
    };
  }

  /* =========================================================
     SNAPSHOT
     ========================================================= */

  function snapshot() {
    return {
      engine:
        "RO'Lyfe Resource Router Intelligence Engine",

      version:
        "1.0.0",

      totalResources:
        allResources().length,

      resourceGroups:
        Object.keys(RESOURCES),

      resources:
        allResources().map(function (resource) {
          return {
            id: resource.id,
            name: resource.name,
            type: resource.type,
            category: resource.category,
            url: resource.url
          };
        }),

      generatedAt:
        new Date().toISOString()
    };
  }

  /* =========================================================
     AUTO-BIND
     ========================================================= */

  function bindControls() {

    var routeButton =
      document.getElementById(
        "routePropertyResearch"
      );

    if (routeButton) {
      routeButton.addEventListener(
        "click",
        function (event) {
          event.preventDefault();

          routeCurrentProperty();
        }
      );
    }

    var resourceButtons =
      document.querySelectorAll(
        "[data-resource-id]"
      );

    resourceButtons.forEach(
      function (button) {

        button.addEventListener(
          "click",
          function (event) {

            event.preventDefault();

            var resourceId =
              button.getAttribute(
                "data-resource-id"
              );

            openResource(
              resourceId
            );
          }
        );
      }
    );
  }

  /* =========================================================
     PUBLIC ENGINE
     ========================================================= */

  window.ROLyfeResourceRouter = {

    version:
      "1.0.0",

    resources:
      RESOURCES,

    all:
      allResources,

    get:
      getResource,

    getByType:
      getByType,

    getByCategory:
      getByCategory,

    open:
      openResource,

    buildPropertySearchUrls:
      buildPropertySearchUrls,

    buildAuctionResearchPackage:
      buildAuctionResearchPackage,

    routeCapital:
      routeCapital,

    routeOpportunity:
      routeOpportunity,

    routeCurrentProperty:
      routeCurrentProperty,

    renderResources:
      renderResources,

    validate:
      validateResource,

    snapshot:
      snapshot
  };

  /* =========================================================
     INITIALIZE
     ========================================================= */

  function init() {
    bindControls();
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
