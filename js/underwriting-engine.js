/* =========================================================
   RO'Lyfe Auction Capital Machine™
   Underwriting Intelligence Engine
   File: js/underwriting-engine.js

   PURPOSE
   ---------------------------------------------------------
   Central underwriting intelligence layer.

   Connects:
   - Auction Engine
   - Deal Engine
   - Capital Engine
   - Rehab Budget Engine
   - Risk Engine
   - Tax/Lien Engine
   - Contractor Engine
   - Jurisdiction Rules
   - Borrower Track Record
   - REO Schedule

   IMPORTANT
   ---------------------------------------------------------
   This is an educational/planning engine.
   It is NOT a lender approval, commitment, appraisal,
   legal opinion, title opinion, or guarantee of financing.

   Jurisdiction rules are only applied when configured.
   Unknown jurisdictions return "RULE SET NEEDED"
   rather than assuming another state's rules apply.
   ========================================================= */

(function () {
    "use strict";

    const VERSION = "1.0.0";

    /* =====================================================
       BASIC HELPERS
       ===================================================== */

    function $(id) {
        return document.getElementById(id);
    }

    function value(id) {
        const el = $(id);
        return el ? String(el.value || "").trim() : "";
    }

    function number(id) {
        const el = $(id);
        if (!el) return 0;

        const raw = String(el.value || "")
            .replace(/[$,%\s,]/g, "");

        const n = parseFloat(raw);

        return Number.isFinite(n) ? n : 0;
    }

    function money(amount) {
        const n = Number(amount) || 0;

        return n.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0
        });
    }

    function percent(amount) {
        return `${(Number(amount) || 0).toFixed(1)}%`;
    }

    function clean(value) {
        return String(value || "").trim();
    }

    function yes(value) {
        return ["yes", "y", "true", "1"].includes(
            String(value || "").toLowerCase()
        );
    }

    function unique(array) {
        return [...new Set(array.filter(Boolean))];
    }

    function safeJSON(value) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return null;
        }
    }

    /* =====================================================
       JURISDICTION DATABASE
       -----------------------------------------------------
       Only configure rules that have actually been
       established for the system.

       Do NOT treat this as legal advice.
       ===================================================== */

    const JURISDICTION_RULES = {

        PA: {
            name: "Pennsylvania",
            configured: true,
            saleTypes: [
                "auction",
                "sheriff_sale",
                "tax_sale",
                "upset_sale",
                "judicial_sale",
                "bank_owned"
            ],
            note:
                "Pennsylvania auction and tax-sale procedures can vary by county and sale type. Verify the specific county and sale documents."
        },

        NJ: {
            name: "New Jersey",
            configured: true,
            saleTypes: [
                "tax_lien",
                "tax_sale",
                "foreclosure",
                "auction"
            ],
            note:
                "New Jersey tax-sale and lien procedures are jurisdiction-specific. Verify municipality, redemption requirements, interest, and sale documents."
        },

        FL: {
            name: "Florida",
            configured: true,
            saleTypes: [
                "tax_lien",
                "tax_deed",
                "tax_sale",
                "foreclosure",
                "auction"
            ],
            note:
                "Florida tax-lien and tax-deed processes differ. Verify county auction platform, redemption rules, title requirements, and surviving interests."
        }

        /* Additional jurisdictions can be added here
           after their rules are verified. */
    };

    /* =====================================================
       JURISDICTION NORMALIZATION
       ===================================================== */

    function normalizeState(raw) {

        const state = clean(raw).toUpperCase();

        const aliases = {
            "PENNSYLVANIA": "PA",
            "NEW JERSEY": "NJ",
            "FLORIDA": "FL"
        };

        return aliases[state] || state;
    }

    function getJurisdiction() {

        const address = value("address");

        let state =
            value("propertyState") ||
            value("state") ||
            value("taxState");

        if (!state && address) {

            const parts = address
                .split(",")
                .map(x => x.trim());

            if (parts.length >= 2) {
                state = parts[parts.length - 2];
            }
        }

        state = normalizeState(state);

        const rule = JURISDICTION_RULES[state];

        return {
            state,
            rule,
            configured: !!rule,
            name: rule ? rule.name : state || "Unknown",
            status: rule
                ? "CONFIGURED"
                : "RULE SET NEEDED"
        };
    }

    /* =====================================================
       PROPERTY SNAPSHOT
       ===================================================== */

    function getPropertySnapshot() {

        const jurisdiction = getJurisdiction();

        return {
            address: value("address"),
            parcel:
                value("parcel") ||
                value("apn") ||
                value("propertyParcel") ||
                value("taxParcel"),

            city: value("city"),
            state: jurisdiction.state,
            zip: value("zip"),

            propertyType:
                value("propertyType") ||
                value("auctionPropertyType"),

            occupancy: value("occupancy"),

            jurisdiction: jurisdiction
        };
    }

    /* =====================================================
       AUCTION SNAPSHOT
       ===================================================== */

    function getAuctionSnapshot() {

        let data = null;

        try {
            if (
                window.ROLyfeAuctionEngine &&
                typeof window.ROLyfeAuctionEngine.snapshot === "function"
            ) {
                data = window.ROLyfeAuctionEngine.snapshot();
            }
        } catch (error) {
            data = null;
        }

        const openingBid =
            data?.openingBid ??
            number("openingBid");

        const currentBid =
            data?.currentBid ??
            number("currentBid");

        const increment =
            data?.bidIncrement ??
            number("bidIncrement");

        const maxAcquisition =
            data?.maxAcquisition ??
            data?.maximumAcquisition ??
            0;

        return {

            auctionUrl:
                data?.auctionUrl ||
                value("auctionUrl"),

            auctionType:
                data?.auctionType ||
                value("auctionType"),

            openingBid,

            currentBid,

            bidIncrement: increment,

            reserve:
                data?.reserve ||
                value("reserve"),

            financing:
                data?.financing ||
                value("financing"),

            emd:
                data?.emd ??
                number("emd"),

            auctionDate:
                data?.auctionDate ||
                value("auctionDate"),

            auctionTime:
                data?.auctionTime ||
                value("auctionTime"),

            maxAcquisition,

            bidRoom:
                maxAcquisition > 0
                    ? maxAcquisition - currentBid
                    : 0
        };
    }

    /* =====================================================
       DEAL SNAPSHOT
       ===================================================== */

    function getDealSnapshot() {

        let external = null;

        try {
            if (
                window.ROLyfeDealEngine &&
                typeof window.ROLyfeDealEngine.snapshot === "function"
            ) {
                external = window.ROLyfeDealEngine.snapshot();
            }
        } catch (error) {
            external = null;
        }

        const arv =
            external?.arv ??
            number("arv");

        const rehab =
            external?.rehab ??
            number("rehab");

        const closing =
            external?.closing ??
            number("closing");

        const holding =
            external?.holding ??
            number("holding");

        const selling =
            external?.selling ??
            number("selling");

        const financingCosts =
            external?.financingCosts ??
            number("financingCosts");

        const profit =
            external?.profit ??
            number("profit");

        const contingency =
            external?.contingency ??
            number("contingency");

        let maxAcquisition =
            external?.maxAcquisition ??
            0;

        if (!maxAcquisition && arv > 0) {

            maxAcquisition =
                arv -
                rehab -
                closing -
                holding -
                selling -
                financingCosts -
                profit -
                contingency;
        }

        const projectCost =
            Math.max(maxAcquisition, 0) +
            rehab +
            closing +
            holding +
            financingCosts +
            contingency;

        const buyerCapital =
            external?.buyerCapital ??
            number("buyerCapital");

        const capitalNeed =
            Math.max(projectCost - buyerCapital, 0);

        const grossSpread =
            arv -
            projectCost -
            selling;

        return {

            arv,

            rehab,

            closing,

            holding,

            selling,

            financingCosts,

            requiredProfit: profit,

            contingency,

            maxAcquisition,

            projectCost,

            buyerCapital,

            capitalNeed,

            grossSpread,

            currentBid:
                number("currentBid"),

            bidRoom:
                maxAcquisition -
                number("currentBid")
        };
    }

    /* =====================================================
       BORROWER / GUARANTOR
       ===================================================== */

    function getBorrowerSnapshot() {

        return {

            primaryGuarantor:
                value("primaryGuarantor") ||
                value("guarantorName"),

            borrowingEntity:
                value("borrowingEntity") ||
                value("entityName"),

            salesHistoryDate:
                value("salesHistoryDate"),

            experienceYears:
                number("experienceYears"),

            completedDeals:
                number("completedDeals"),

            relevantDeals:
                number("relevantDeals"),

            groundUpExperience:
                number("groundUpExperience"),

            rehabExperience:
                number("rehabExperience"),

            liquidity:
                number("liquidity"),

            netWorth:
                number("netWorth"),

            creditScore:
                number("creditScore")
        };
    }

    /* =====================================================
       TRACK RECORD
       -----------------------------------------------------
       Supports dynamic rows if the UI creates them.

       Expected optional classes:
       .track-record-row
       .reo-row
       ===================================================== */

    function collectRows(selector) {

        const rows = [];

        document
            .querySelectorAll(selector)
            .forEach(row => {

                const item = {};

                row
                    .querySelectorAll("[data-field]")
                    .forEach(field => {

                        item[field.dataset.field] =
                            field.value ||
                            field.textContent ||
                            "";
                    });

                if (
                    Object.values(item)
                        .some(v => clean(v))
                ) {
                    rows.push(item);
                }
            });

        return rows;
    }

    function getTrackRecord() {

        let rows = collectRows(".track-record-row");

        if (!rows.length) {

            const raw = value("trackRecordData");

            const parsed = safeJSON(raw);

            if (Array.isArray(parsed)) {
                rows = parsed;
            }
        }

        return rows;
    }

    function getREOSchedule() {

        let rows = collectRows(".reo-row");

        if (!rows.length) {

            const raw = value("reoScheduleData");

            const parsed = safeJSON(raw);

            if (Array.isArray(parsed)) {
                rows = parsed;
            }
        }

        return rows;
    }

    /* =====================================================
       EXPERIENCE ANALYSIS
       ===================================================== */

    function analyzeExperience(
        borrower,
        trackRecord
    ) {

        const flags = [];
        const positives = [];

        if (
            borrower.completedDeals > 0
        ) {
            positives.push(
                `${borrower.completedDeals} completed deal(s) reported.`
            );
        }

        if (
            borrower.relevantDeals > 0
        ) {
            positives.push(
                `${borrower.relevantDeals} relevant deal(s) reported.`
            );
        }

        if (
            trackRecord.length > 0
        ) {
            positives.push(
                `Track record contains ${trackRecord.length} reported transaction(s).`
            );
        }

        if (
            borrower.completedDeals === 0 &&
            trackRecord.length === 0
        ) {
            flags.push(
                "No completed transaction history has been entered."
            );
        }

        return {
            flags,
            positives
        };
    }

    /* =====================================================
       REO ANALYSIS
       ===================================================== */

    function analyzeREO(reoSchedule) {

        const flags = [];

        if (!reoSchedule.length) {

            flags.push(
                "REO schedule has not been provided."
            );

            return {
                count: 0,
                flags
            };
        }

        reoSchedule.forEach((property, index) => {

            const status =
                clean(property.status).toLowerCase();

            if (
                status.includes("distress") ||
                status.includes("delinquent") ||
                status.includes("foreclosure")
            ) {

                flags.push(
                    `REO property ${index + 1} may require additional review: ${status}.`
                );
            }
        });

        return {
            count: reoSchedule.length,
            flags
        };
    }

    /* =====================================================
       CAPITAL ANALYSIS
       ===================================================== */

    function analyzeCapital(deal) {

        const flags = [];

        if (
            deal.capitalNeed > 0
        ) {
            flags.push(
                `Estimated capital gap: ${money(deal.capitalNeed)}.`
            );
        }

        if (
            deal.buyerCapital > 0 &&
            deal.buyerCapital < deal.projectCost
        ) {
            flags.push(
                "Available buyer capital does not cover the modeled project cost."
            );
        }

        return {
            required:
                deal.capitalNeed,

            available:
                deal.buyerCapital,

            projectCost:
                deal.projectCost,

            flags
        };
    }

    /* =====================================================
       COLLATERAL / ARV ANALYSIS
       ===================================================== */

    function analyzeCollateral(deal) {

        const flags = [];

        if (!deal.arv) {

            flags.push(
                "ARV has not been entered."
            );
        }

        if (
            deal.arv > 0 &&
            deal.maxAcquisition > deal.arv
        ) {

            flags.push(
                "Calculated acquisition ceiling exceeds the entered ARV. Review deal inputs."
            );
        }

        let purchasePrice =
            number("currentBid");

        if (
            purchasePrice > 0 &&
            deal.arv > 0
        ) {

            const acquisitionToARV =
                purchasePrice / deal.arv;

            if (
                acquisitionToARV > 0.75
            ) {

                flags.push(
                    `Current bid is ${percent(acquisitionToARV * 100)} of ARV.`
                );
            }
        }

        return {
            arv: deal.arv,
            currentBid: purchasePrice,
            flags
        };
    }

    /* =====================================================
       RISK ENGINE CONNECTION
       ===================================================== */

    function getRiskSnapshot() {

        try {

            if (
                window.ROLyfeRiskEngine &&
                typeof window.ROLyfeRiskEngine.snapshot === "function"
            ) {

                return window.ROLyfeRiskEngine.snapshot();
            }

        } catch (error) {}

        return {
            level: "UNKNOWN",
            flags: [],
            missing: []
        };
    }

    /* =====================================================
       TAX / LIEN ENGINE CONNECTION
       ===================================================== */

    function getTaxLienSnapshot() {

        try {

            if (
                window.ROLyfeTaxLienEngine &&
                typeof window.ROLyfeTaxLienEngine.snapshot === "function"
            ) {

                return window.ROLyfeTaxLienEngine.snapshot();
            }

        } catch (error) {}

        return {
            status: "NOT ANALYZED",
            flags: [],
            missing: []
        };
    }

    /* =====================================================
       REHAB ENGINE CONNECTION
       ===================================================== */

    function getRehabSnapshot() {

        try {

            if (
                window.ROLyfeRehabBudgetEngine &&
                typeof window.ROLyfeRehabBudgetEngine.snapshot === "function"
            ) {

                return window.ROLyfeRehabBudgetEngine.snapshot();
            }

        } catch (error) {}

        return {
            total: number("rehab"),
            categories: [],
            flags: []
        };
    }

    /* =====================================================
       CONTRACTOR ANALYSIS
       ===================================================== */

    function getContractorSnapshot() {

        try {

            if (
                window.ROLyfeContractorEngine &&
                typeof window.ROLyfeContractorEngine.snapshot === "function"
            ) {

                return window.ROLyfeContractorEngine.snapshot();
            }

        } catch (error) {}

        return {
            contractor: value("contractorName"),
            estimate: number("contractorEstimate"),
            status: value("contractorStatus") || "NOT PROVIDED"
        };
    }

    /* =====================================================
       AUCTION READINESS
       ===================================================== */

    function analyzeAuctionReadiness(
        auction,
        deal,
        jurisdiction
    ) {

        const flags = [];
        const positives = [];

        if (!auction.currentBid) {

            flags.push(
                "Current bid has not been entered."
            );

        } else {

            positives.push(
                `Current bid: ${money(auction.currentBid)}.`
            );
        }

        if (
            deal.maxAcquisition > 0 &&
            auction.currentBid > deal.maxAcquisition
        ) {

            flags.push(
                "Current bid exceeds the calculated acquisition ceiling."
            );

        } else if (
            deal.maxAcquisition > 0 &&
            auction.currentBid > 0
        ) {

            positives.push(
                `Bid room: ${money(
                    deal.maxAcquisition -
                    auction.currentBid
                )}.`
            );
        }

        if (!jurisdiction.configured) {

            flags.push(
                "Jurisdiction rule set has not been configured."
            );
        }

        if (!auction.auctionType) {

            flags.push(
                "Auction/sale type has not been identified."
            );
        }

        if (!auction.auctionDate) {

            flags.push(
                "Auction date has not been entered."
            );
        }

        return {
            flags,
            positives
        };
    }

    /* =====================================================
       READINESS CALCULATION
       ===================================================== */

    function calculateReadiness(data) {

        const critical = [];
        const warnings = [];

        const allFlags = [
            ...data.auction.flags,
            ...data.experience.flags,
            ...data.reo.flags,
            ...data.capital.flags,
            ...data.collateral.flags,
            ...data.jurisdiction.flags,
            ...data.risk.flags,
            ...data.taxLien.flags,
            ...data.rehab.flags,
            ...data.contractor.flags
        ];

        allFlags.forEach(flag => {

            const text = String(flag).toLowerCase();

            if (
                text.includes("exceeds") ||
                text.includes("critical") ||
                text.includes("title") ||
                text.includes("foreclosure") ||
                text.includes("unknown jurisdiction")
            ) {

                critical.push(flag);

            } else {

                warnings.push(flag);
            }
        });

        if (
            data.deal.maxAcquisition <= 0
        ) {

            critical.push(
                "Calculated maximum acquisition price is not positive."
            );
        }

        if (
            data.deal.arv <= 0
        ) {

            critical.push(
                "ARV is required for this underwriting model."
            );
        }

        let status = "UNDER REVIEW";

        if (critical.length) {
            status = "NOT READY";
        } else if (
            warnings.length === 0 &&
            data.deal.currentBid > 0
        ) {
            status = "BID-READY";
        }

        return {
            status,
            critical: unique(critical),
            warnings: unique(warnings)
        };
    }

    /* =====================================================
       MAIN UNDERWRITING SNAPSHOT
       ===================================================== */

    function buildSnapshot() {

        const property =
            getPropertySnapshot();

        const auction =
            getAuctionSnapshot();

        const deal =
            getDealSnapshot();

        const borrower =
            getBorrowerSnapshot();

        const trackRecord =
            getTrackRecord();

        const reo =
            getREOSchedule();

        const experience =
            analyzeExperience(
                borrower,
                trackRecord
            );

        const reoAnalysis =
            analyzeREO(reo);

        const capital =
            analyzeCapital(deal);

        const collateral =
            analyzeCollateral(deal);

        const risk =
            getRiskSnapshot();

        const taxLien =
            getTaxLienSnapshot();

        const rehab =
            getRehabSnapshot();

        const contractor =
            getContractorSnapshot();

        const jurisdiction =
            property.jurisdiction;

        const auctionAnalysis =
            analyzeAuctionReadiness(
                auction,
                deal,
                jurisdiction
            );

        const jurisdictionFlags = [];

        if (
            !jurisdiction.configured
        ) {

            jurisdictionFlags.push(
                jurisdiction.state
                    ? `No configured underwriting rule set for ${jurisdiction.state}.`
                    : "Property jurisdiction has not been identified."
            );
        }

        if (
            jurisdiction.rule?.note
        ) {

            jurisdictionFlags.push(
                jurisdiction.rule.note
            );
        }

        const data = {

            version: VERSION,

            timestamp:
                new Date().toISOString(),

            property,

            jurisdiction,

            auction,

            deal,

            borrower,

            trackRecord,

            reo,

            experience,

            capital,

            collateral,

            risk,

            taxLien,

            rehab,

            contractor,

            auctionAnalysis,

            jurisdictionFlags,

            flags: {

                auction:
                    auctionAnalysis.flags,

                experience:
                    experience.flags,

                reo:
                    reoAnalysis.flags,

                capital:
                    capital.flags,

                collateral:
                    collateral.flags,

                jurisdiction:
                    jurisdictionFlags,

                risk:
                    risk.flags || [],

                taxLien:
                    taxLien.flags || [],

                rehab:
                    rehab.flags || [],

                contractor:
                    contractor.flags || []
            }
        };

        data.reo.analysis =
            reoAnalysis;

        data.readiness =
            calculateReadiness(data);

        return data;
    }

    /* =====================================================
       HUMAN-READABLE EXPLANATION
       -----------------------------------------------------
       Used by the floating AI Underwriter.
       ===================================================== */

    function explain() {

        const snapshot =
            buildSnapshot();

        const lines = [];

        lines.push(
            "RO'Lyfe Underwriting Snapshot"
        );

        lines.push(
            `Status: ${snapshot.readiness.status}`
        );

        lines.push(
            `Property: ${
                snapshot.property.address ||
                "Not entered"
            }`
        );

        lines.push(
            `Jurisdiction: ${
                snapshot.jurisdiction.name
            }`
        );

        lines.push(
            `Jurisdiction Rules: ${
                snapshot.jurisdiction.status
            }`
        );

        lines.push(
            `ARV: ${money(snapshot.deal.arv)}`
        );

        lines.push(
            `Current Bid: ${money(
                snapshot.auction.currentBid
            )}`
        );

        lines.push(
            `Maximum Acquisition: ${money(
                snapshot.deal.maxAcquisition
            )}`
        );

        lines.push(
            `Bid Room: ${money(
                snapshot.deal.maxAcquisition -
                snapshot.auction.currentBid
            )}`
        );

        lines.push(
            `Projected Project Cost: ${money(
                snapshot.deal.projectCost
            )}`
        );

        lines.push(
            `Estimated Capital Requirement: ${money(
                snapshot.deal.capitalNeed
            )}`
        );

        lines.push(
            `Projected Gross Spread Before Unlisted Costs: ${money(
                snapshot.deal.grossSpread
            )}`
        );

        if (
            snapshot.readiness.critical.length
        ) {

            lines.push(
                "",
                "Critical / blocking items:"
            );

            snapshot.readiness.critical
                .forEach(flag => {
                    lines.push(`- ${flag}`);
                });
        }

        if (
            snapshot.readiness.warnings.length
        ) {

            lines.push(
                "",
                "Items requiring review:"
            );

            snapshot.readiness.warnings
                .slice(0, 12)
                .forEach(flag => {
                    lines.push(`- ${flag}`);
                });
        }

        lines.push(
            "",
            "This is a planning/underwriting analysis and not a lender approval."
        );

        return lines.join("\n");
    }

    /* =====================================================
       UI UPDATE
       ===================================================== */

    function updateUI() {

        const snapshot =
            buildSnapshot();

        const statusEl =
            $("underwritingStatus");

        if (statusEl) {

            statusEl.textContent =
                snapshot.readiness.status;

            statusEl.dataset.status =
                snapshot.readiness.status
                    .toLowerCase()
                    .replace(/\s+/g, "-");
        }

        const maxEl =
            $("underwritingMaxBid");

        if (maxEl) {

            maxEl.textContent =
                money(
                    snapshot.deal.maxAcquisition
                );
        }

        const capitalEl =
            $("underwritingCapitalNeed");

        if (capitalEl) {

            capitalEl.textContent =
                money(
                    snapshot.deal.capitalNeed
                );
        }

        const riskEl =
            $("underwritingRisk");

        if (riskEl) {

            riskEl.textContent =
                snapshot.risk.level ||
                "UNKNOWN";
        }

        const jurisdictionEl =
            $("underwritingJurisdiction");

        if (jurisdictionEl) {

            jurisdictionEl.textContent =
                snapshot.jurisdiction.name;
        }

        const missingEl =
            $("underwritingMissing");

        if (missingEl) {

            const items =
                [
                    ...snapshot.readiness.critical,
                    ...snapshot.readiness.warnings
                ];

            missingEl.textContent =
                items.length
                    ? `${items.length} review item(s)`
                    : "No current flags";
        }

        /* Update floating AI if available. */

        try {

            if (
                window.ROLyfeAIUnderwriter &&
                typeof window.ROLyfeAIUnderwriter
                    .receiveUnderwritingSnapshot ===
                    "function"
            ) {

                window.ROLyfeAIUnderwriter
                    .receiveUnderwritingSnapshot(
                        snapshot
                    );
            }

        } catch (error) {}
    }

    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.ROLyfeUnderwritingEngine = {

        version: VERSION,

        snapshot:
            buildSnapshot,

        explain,

        updateUI,

        getJurisdiction,

        getPropertySnapshot,

        getAuctionSnapshot,

        getDealSnapshot,

        getBorrowerSnapshot,

        getTrackRecord,

        getREOSchedule,

        getRiskSnapshot,

        getTaxLienSnapshot,

        getRehabSnapshot,

        getContractorSnapshot,

        jurisdictionRules:
            JURISDICTION_RULES
    };

    /* =====================================================
       EVENT CONNECTIONS
       ===================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            updateUI();

            const ids = [
                "address",
                "propertyState",
                "state",
                "taxState",
                "auctionType",
                "auctionDate",
                "auctionTime",
                "openingBid",
                "currentBid",
                "arv",
                "rehab",
                "closing",
                "holding",
                "selling",
                "financingCosts",
                "profit",
                "contingency",
                "buyerCapital",
                "occupancy",
                "emd",
                "primaryGuarantor",
                "guarantorName",
                "borrowingEntity",
                "liquidity",
                "netWorth",
                "creditScore"
            ];

            ids.forEach(id => {

                const el = $(id);

                if (!el) return;

                el.addEventListener(
                    "input",
                    updateUI
                );

                el.addEventListener(
                    "change",
                    updateUI
                );
            });

            /* Recalculate when another engine
               broadcasts an update. */

            document.addEventListener(
                "rolyfe:engine-update",
                updateUI
            );

            document.addEventListener(
                "rolyfe:deal-updated",
                updateUI
            );

            document.addEventListener(
                "rolyfe:auction-updated",
                updateUI
            );

            document.addEventListener(
                "rol yfe:tax-updated",
                updateUI
            );
        }
    );

})();
