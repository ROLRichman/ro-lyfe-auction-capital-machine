/* RO'Lyfe Auction Capital Machine™
 * Tax Yield / OTC Intelligence Rules
 *
 * IMPORTANT: The matrix below is a research index assembled from the RO'Lyfe
 * working dataset. It is NOT legal advice and is not a substitute for the
 * applicable county/state statute, tax collector, treasurer, clerk, sheriff,
 * auction administrator, title report, or counsel.
 *
 * Every rule carries verification metadata so the UI/AI can distinguish
 * research notes from verified jurisdiction-specific requirements.
 */
(function (root) {
  "use strict";

  const terminology = {
    "AL":"Sold to State Tax Liens","AZ":"Certificates of Purchase","CO":"County-Held Liens",
    "FL":"OTC","MD":"Tax Sale Assignments","MS":"Tax Forfeited Land","NJ":"Assignments",
    "SC":"Forfeited Land Commissions"
  };

  const states = {
    AL:{assetType:"Tax Liens",interest:"12%",penalty:"N/A",redemption:"3 yrs",timing:"Yearly Apr-Jun"},
    AK:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"N/A",timing:"Varies"},
    AZ:{assetType:"Tax Liens",interest:"14%-16%",penalty:"N/A",redemption:"3-5 yrs",timing:"Feb"},
    AR:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"N/A",timing:"Varies"},
    CA:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"5 yrs",timing:"Varies"},
    CO:{assetType:"Tax Liens",interest:"9%",penalty:"N/A",redemption:"3 yrs",timing:"Oct-Dec"},
    CT:{assetType:"Liens & Redeemable Deeds",interest:"N/A",penalty:"18%",redemption:"1 yr",timing:"Varies"},
    DE:{assetType:"Redeemable Deeds",interest:"N/A",penalty:"15%",redemption:"60 days",timing:"Varies"},
    DC:{assetType:"Tax Liens",interest:"18%",penalty:"N/A",redemption:"6 mos",timing:"July"},
    FL:{assetType:"Tax Liens & Tax Deeds",interest:"18%",penalty:"N/A",redemption:"2 yrs",timing:"Liens May-Jun; deeds monthly"},
    GA:{assetType:"Redeemable Deeds",interest:"N/A",penalty:"20% monthly",redemption:"Varies",timing:"Varies"},
    HI:{assetType:"Redeemable Deeds",interest:"12%",penalty:"N/A",redemption:"6 mos-1 yr",timing:"Jun or Nov-Dec"},
    ID:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    IL:{assetType:"Tax Liens & Tax Deeds",interest:"18%",penalty:"N/A",redemption:"2-3 yrs",timing:"Liens Oct-Dec; deeds monthly; scavenger varies"},
    IN:{assetType:"Tax Liens & Tax Deeds",interest:"N/A",penalty:"10%+",redemption:"1 yr",timing:"Jul-Oct / varies"},
    IA:{assetType:"Tax Liens",interest:"24%",penalty:"N/A",redemption:"2 yrs",timing:"Jun"},
    KS:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    KY:{assetType:"Tax Liens",interest:"12%",penalty:"N/A",redemption:"1 yr",timing:"Jul-Oct"},
    LA:{assetType:"Tax Liens & Tax Deeds",interest:"12%",penalty:"5%",redemption:"3 yrs",timing:"May-Jun / monthly"},
    ME:{assetType:"Tax Liens",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    MD:{assetType:"Tax Liens",interest:"6%-24%",penalty:"N/A",redemption:"6 mos-2 yrs",timing:"Varies"},
    MA:{assetType:"Tax Deeds",interest:"16%",penalty:"N/A",redemption:"6 mos",timing:"Varies"},
    MI:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    MN:{assetType:"Tax Forfeited Property",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    MS:{assetType:"Tax Liens",interest:"18%",penalty:"N/A",redemption:"2 yrs",timing:"Aug or Apr"},
    MO:{assetType:"Tax Liens",interest:"10%",penalty:"N/A",redemption:"2 yrs",timing:"Aug"},
    MT:{assetType:"Tax Liens",interest:"10%",penalty:"2%",redemption:"3 yrs",timing:"Year round; updated July"},
    NE:{assetType:"Tax Liens",interest:"14%",penalty:"N/A",redemption:"3 yrs",timing:"March"},
    NV:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    NH:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    NJ:{assetType:"Tax Liens",interest:"18%",penalty:"6%",redemption:"2 yrs",timing:"Standard yearly; accelerated Jun/Dec"},
    NM:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    NY:{assetType:"Tax Liens & Tax Deeds",interest:"20%",penalty:"N/A",redemption:"1-2 yrs",timing:"Liens Jan; deeds varies"},
    NC:{assetType:"Tax Foreclosure / Deed",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    ND:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    OH:{assetType:"Tax Liens & Tax Deeds",interest:"18%",penalty:"N/A",redemption:"1 yr",timing:"Varies"},
    OK:{assetType:"Tax Deeds",interest:"8%",penalty:"N/A",redemption:"2 yrs",timing:"Jun"},
    OR:{assetType:"Tax Foreclosure / Deed",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    PA:{assetType:"Tax Sale / Tax Deed",interest:"Verify",penalty:"Verify",redemption:"Jurisdiction-specific",timing:"Varies"},
    RI:{assetType:"Tax Liens",interest:"N/A",penalty:"10%+",redemption:"1 yr",timing:"Varies"},
    SC:{assetType:"Tax Liens",interest:"12%",penalty:"None",redemption:"1 yr-18 mos",timing:"Oct-Dec"},
    SD:{assetType:"Tax Liens",interest:"4%-12%",penalty:"N/A",redemption:"1 yr",timing:"Dec"},
    TN:{assetType:"Redeemable Deeds",interest:"12%",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    TX:{assetType:"Redeemable Deeds",interest:"N/A",penalty:"25%",redemption:"6 mos-2 yrs",timing:"Monthly"},
    UT:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    VT:{assetType:"Tax Liens",interest:"12%",penalty:"8%",redemption:"1 yr",timing:"Varies"},
    VA:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    WA:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    WV:{assetType:"Tax Liens",interest:"12%",penalty:"N/A",redemption:"18 mos",timing:"Sep-Dec"},
    WI:{assetType:"Tax Deeds",interest:"N/A",penalty:"N/A",redemption:"Varies",timing:"Varies"},
    WY:{assetType:"Tax Liens",interest:"15%",penalty:"3%",redemption:"5 yrs",timing:"Jul-Sep"}
  };

  const glossary = {
    "abatement":"A reduction or cancellation of a tax, charge, or assessment under applicable law.",
    "absentee bidding":"Bidding conducted without the bidder being physically present, subject to the auction administrator's rules.",
    "ad valorem":"A tax assessed according to the value of property.",
    "assignment purchasing":"Acquiring an existing tax lien/certificate position from its holder where the jurisdiction permits assignments.",
    "bid down interest":"A bidding method in which bidders compete by accepting a lower interest rate.",
    "bid in":"The amount or terms entered by a bidder in an auction.",
    "certificate of purchase":"A document evidencing a tax-sale purchase interest; exact rights vary by jurisdiction.",
    "caveat emptor":"Buyer beware; the buyer bears the due-diligence burden to the extent applicable law permits.",
    "due diligence":"Verification of ownership, title, liens, taxes, assessments, access, property condition, auction terms and other material facts.",
    "encumbrance":"A claim, restriction, or interest affecting title or use of property.",
    "escheat":"Transfer of property to the government when an owner dies without legally recognized heirs, subject to applicable law.",
    "fee simple":"A broad form of ownership interest in real property, subject to recorded and legal limitations.",
    "junior lien":"A lien that is subordinate to a senior lien under the applicable priority rules.",
    "lis pendens":"A recorded notice that litigation affecting real property is pending.",
    "minimum bid":"The lowest amount or required bid condition established by the sale authority.",
    "OTC":"Over-the-counter inventory generally refers to certificates or liens available outside the primary auction process; the terminology and availability vary by jurisdiction.",
    "redemption":"A statutory period or process allowing a qualifying party to redeem property or a tax-sale interest by satisfying specified requirements.",
    "tax lien certificate":"A certificate evidencing a tax-related lien interest sold under a jurisdiction's tax-sale system.",
    "tax deed":"A deed issued after a tax-sale/foreclosure process where the jurisdiction's statutory requirements have been met.",
    "quiet title action":"A court proceeding used to establish or clarify interests in real property and resolve competing claims.",
    "title insurance":"Insurance covering specified title risks under the policy's terms and exclusions.",
    "vested":"An established legal interest or right, subject to the governing instrument and law.",
    "yield":"A return measure. A quoted tax-sale interest rate is not automatically the investor's realized annualized return after discounts, penalties, fees, redemption timing, or loss of principal."
  };

  const phoneScript = [
    "What is the county's tax-sale process and timeline?",
    "What is the redemption or grace period?",
    "How are interest, penalties and fees calculated?",
    "Is the quoted rate annualized, simple, statutory, or otherwise defined?",
    "Is the sale online or in person, and what is the bidding method?",
    "What happens to unsold certificates or liens?",
    "Are any certificates/lien interests available OTC after the sale?",
    "When and where is the official inventory published?",
    "Which office is the official source for the parcel, tax balance and sale status?",
    "What title, notice, registration, deposit and payment requirements apply?"
  ];

  const api = {
    version:"1.0.0",
    terminology,
    states,
    glossary,
    phoneScript,
    getState(code){ return states[String(code||"").trim().toUpperCase()] || null; },
    getOTCTerms(code){ const c=String(code||"").trim().toUpperCase(); return terminology[c] || "No alternate OTC term is stored for this state. Ask the county what term it uses for post-sale or non-auction inventory."; },
    searchGlossary(q){
      const s=String(q||"").toLowerCase();
      return Object.entries(glossary).filter(([k,v])=>k.includes(s)||v.toLowerCase().includes(s)).slice(0,8).map(([term,definition])=>({term,definition}));
    },
    researchQuestions(){ return phoneScript.slice(); }
  };

  root.ROLyfeTaxYieldRules = api;
})(window);
