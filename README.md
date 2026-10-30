# RO'Lyfe Auction Capital Machine™

### Find the Property. Build the Deal. Match the Capital.

RO'Lyfe Auction Capital Machine™ is a real-estate acquisition intelligence platform designed to help investors, contractors, buyers, and funding brokers analyze bank-owned, REO, and foreclosure auction properties.

The machine connects four major pieces of the acquisition process:

**Auction Property → Deal Analysis → Contractor/Buyer → Capital**

It is designed to work alongside the RO'Lyfe Real Estate Command Center and the user's private-capital and lending relationships.

---

## Core Purpose

The machine helps answer:

> "Is this auction property worth pursuing, who can execute the project, how much can we pay, and what type of capital may fit?"

It is not a lender, real-estate broker, appraisal service, title company, or guarantee of financing.

All financing decisions remain subject to the applicable lender's underwriting, property eligibility, auction terms, and borrower qualifications.

---

# Core Modules

## 1. Auction Property Intake

Capture:

- Auction URL
- Property address
- Auction type
- Bank-owned / REO / foreclosure
- Opening bid
- Current bid
- Bid increment
- Reserve status
- Auction deadline
- Occupancy status
- Financing restrictions
- Earnest-money requirements
- Proof-of-funds requirements

---

## 2. Property Intelligence

Analyze:

- Estimated ARV
- Comparable sales
- Rental potential
- Purchase price
- Rehab estimate
- Closing costs
- Holding costs
- Selling costs
- Contingency
- Total project cost

---

## 3. Contractor Desk

Track the contractor/operator:

- Contractor name
- Contact information
- Inspection status
- Rehab estimate
- Estimated timeline
- Labor estimate
- Materials estimate
- Contractor willing to buy?
- Contractor willing to partner?
- Contractor has end buyer?
- Contractor experience

---

## 4. Three-Tier Acquisition Analysis

The machine can evaluate:

### Tier 1 — Cash Acquisition

Maximum acquisition price based on the selected investment strategy.

### Tier 2 — Private / Hard Money

Analyze the potential financing requirement against project economics.

### Tier 3 — Seller Financing

Only applicable when seller financing is actually permitted by the seller and transaction documents.

Seller financing should never be assumed simply because a property is bank-owned or being auctioned.

---

# Capital Routing

The system is designed to organize potential capital sources:

- Kiavi Broker
- Private Money
- Hard Money
- Lines of Credit
- Buyer Cash
- Other Capital Partners
- Permanent / DSCR Exit Financing

The machine does not represent that a lender has approved a loan.

Instead it prepares the deal for lender review.

---

# Kiavi Broker Workflow

A qualified deal can be prepared for review through the user's Kiavi broker relationship.

The intended workflow is:

Auction Property
→ RO'Lyfe Analysis
→ Contractor/Buyer
→ Capital Requirement
→ Kiavi Broker Portal
→ Lender Underwriting
→ Closing

Kiavi eligibility, loan amount, rates, terms, LTV, ARV requirements, property requirements, and borrower requirements must always be verified directly with Kiavi.

---

# Auction Risk Engine

Auction properties can carry additional risks.

The machine tracks:

- Occupied property
- No interior inspection
- As-is / where-is sale
- Title concerns
- Remaining liens
- Taxes
- HOA/COA balances
- Redemption issues
- Eviction/possession issues
- Financing restrictions
- Proof-of-funds deadline
- Earnest-money requirement
- Seller reserve
- Seller counter-bidding
- Closing deadline

---

# Deal Status

Each opportunity can be classified as:

### NEW

Property has been discovered.

### UNDER REVIEW

Basic information is being analyzed.

### CONTRACTOR REVIEW

Rehab and property condition require contractor input.

### CAPITAL REVIEW

Financing requirements are being evaluated.

### BID READY

Required property, financial, contractor, and capital information has been collected.

### HOLD

More due diligence is required.

### PASS

The opportunity does not currently meet the user's acquisition criteria.

---

# Maximum Bid

The machine should never treat the current auction bid as the user's maximum allowable purchase price.

Instead:

**ARV**
− **Rehab**
− **Closing Costs**
− **Holding Costs**
− **Selling Costs**
− **Financing Costs**
− **Required Profit**
− **Contingency**

= **Maximum Allowable Acquisition Price**

The actual formula can be expanded as the underwriting engine develops.

---

# Capital Gap

The machine calculates:

**Total Project Cost**
− **Available Buyer Capital**
= **Potential Capital Requirement**

This allows a deal to be routed toward the appropriate capital source.

---

# Example Workflow

Example:

Property:
2539 62nd St
Philadelphia, PA

Auction:
Bank Owned

Current Bid:
$83,500

Contractor Rehab:
$60,000

Estimated ARV:
$250,000

The machine would organize:

Property
→ Contractor
→ Rehab
→ ARV
→ Maximum Bid
→ Financing Requirement
→ Capital Source
→ Auction Requirements
→ Exit Strategy

The numbers above are illustrative and must not be treated as an actual underwriting conclusion.

---

# Planned Future Features

- Auction.com URL intake
- Property data import
- Comparable-property research
- ARV intelligence
- Rehab estimator
- Contractor portal
- Buyer portal
- Private lender database
- Capital matching
- Kiavi preparation workflow
- Proof-of-funds tracker
- Auction countdown
- Due-diligence checklist
- Title/liens tracker
- Bid calculator
- Deal scoring based on objective criteria
- PDF deal summary
- Email deal package
- CRM integration
- Real Estate Command Center integration
- Mobile-first interface
- AI deal assistant

---

# Important Disclaimer

RO'Lyfe Auction Capital Machine™ is an informational and deal-analysis tool.

It does not provide lending, legal, tax, appraisal, title, brokerage, or investment advice.

Property information obtained from auction platforms or third parties may be incomplete or inaccurate.

Users are responsible for conducting independent due diligence and reviewing all auction, purchase, title, financing, and closing documents with appropriate professionals.

No financing, approval, profit, acquisition price, or investment outcome is guaranteed.

---

## RO'Lyfe

Funding. Credit. Strategy. Built for People Who Move With Purpose.

**Find the Property. Build the Deal. Match the Capital.**

## Shared Property Research Dock

This project loads the reusable RO’Lyfe Property Research Dock from the canonical property research site. It links to the same address-targeted research sources for listing/comps, tax sales/auctions, parcel and official property/tax research, flood maps, capital routes, and closing documents. The dock opens provider pages and web searches; it does not scrape or import verified listing, title, lien, tax, or comp data.

Shared workflow standard: https://github.com/ROLRichman/rolyfe-property-research-intelligence/blob/main/PROPERTY_RESEARCH_STANDARD.md
Shared component: https://github.com/ROLRichman/rolyfe-property-research-intelligence/blob/main/shared/property-research-dock.js

---

## October 30, 2026 — Market & Property Intelligence Add-ons

The following upgrades are additive and load through `js/market-intelligence-upgrade.js`. The original acquisition, underwriting, map and partner modules remain separate.

### Map and property research
- The map-height control now uses an important inline height and calls Leaflet's resize method so the control works on narrow/mobile layouts.
- Current Open-Meteo readings for Philadelphia, New York and Pittsburgh display in cards and as map pins when refreshed.
- A map-side address / Auction.com URL input can locate an address and generate prefilled searches for residential auction homes, parcel/owner research, county records and auction timing.
- Search links are starting points only. The user must verify the actual listing, property type, parcel match, auction date/time, deposits, title, occupancy and terms at the original source. The page does not scrape Auction.com or guarantee that a listing exists.

### Trading chart and education
- The TradingView iframe has a chart-height control, refresh control and a plain-language chart-reading guide.
- The indicator playbook includes 14 visual explainers: EMA 5/10/20/50/200 trend, VWAP, RSI, MACD, Stochastic, CCI, TTM Squeeze, Volume, ATR, ADX, Bollinger Bands, OBV, Supertrend and Relative Volume.
- The three primary guides remain visible; the other 11 are in a collapsible section.
- The TradingView iframe is cross-origin. These explainer visuals do not calculate live indicator values and do not inject studies into the embedded TradingView chart. Use TradingView's own study controls for actual chart overlays.

### Advanced market workspace
- The symbol universe contains 75 stocks, 25 crypto symbols and 30 futures symbols.
- Selecting a scanner symbol loads that same symbol in the TradingView chart.
- The scanner is a symbol universe, not a live quote feed. No prices are fabricated. A secure data provider integration is required before live stock, options or futures quotes, alerts or automated scans can be displayed.
- The option calculator estimates premium debit, max premium loss, break-even and payoff at expiration from user-entered contract details. It is not an options-pricing model and does not estimate Greeks, implied volatility, theta or pre-expiration option value.

### API security
For parcel data, Regrid's API token is generated in the API section of the Regrid account profile. Keep it server-side; never place it in this public GitHub Pages code or a browser field. Regrid documents per-record API billing, so use small result limits and account usage controls while testing:
- Regrid API setup: https://support.regrid.com/docs/getting-started-api
- Regrid API endpoints: https://support.regrid.com/docs/api-endpoint-overview

For stock, options, futures and crypto quote integration, choose a provider and confirm market-data entitlements for the intended use. Keep credentials in a secure server-side function or secret manager, not in the browser. Examples of provider documentation:
- Webull Market Data API: https://developer.webull.com/apis/docs/market-data-api/overview/
- CME Real-Time Futures and Options Data API: https://www.cmegroup.com/market-data/real-time-futures-and-options-data-api.html

The public page is a research and decision-support interface. It is not a broker, exchange, auction operator, parcel authority, lender, title company, appraisal or guarantee of financing or investment outcome.

---

## October 30, 2026 — Live Research, Market and Gapper Updates

### Find a Gapper — deal-to-underwriter learning desk
A floating Find a Gapper panel includes five worked examples ($75K, $150K tax deed, $250K flip, $350K buy-and-hold, and $500K flip), purchase/deed process explanations, a lender-screen checklist, and conversation prompts for contractors, buyers and investors.

The model shows:
- Purchase + rehab + closing/holding cash requirement
- Indicative lender ceiling based on the selected scenario assumptions
- Buyer cash contribution
- Remaining simplified capital gap
- Indicative gross sale spread before financing, taxes and other unmodeled costs
- A buy-and-hold principal-and-interest illustration where applicable

These are training examples, not current property valuations, lender quotes or approvals. The private partner criteria are indicative and must be confirmed with the lender on each deal. Tax-lien certificates do not automatically convey ownership of the home; tax-deed and foreclosure processes require jurisdiction-specific notice, redemption, title and possession review.

### Address intelligence
- Enter a full property address or paste an Auction.com detail URL.
- Locate the street address on the Leaflet / OpenStreetMap map.
- Request current weather for the searched coordinates from Open-Meteo and show a map pin.
- Request one Regrid parcel match through the server-side `regrid-parcel-lookup` Supabase Edge Function.
- Show APN, owner, use, zoning, assessor value, last sale, annual tax, acreage, structure area, optional flood data, county record source URL and the county refresh date where supplied.
- Generate links for residential auction listings, county records and auction-timing research.

Regrid requires the `REGRID_API_KEY` secret in the active Supabase project's Edge Function Secrets. It must never be placed in the browser or GitHub. The function requests `limit=1` to keep record-based billing constrained. A returned parcel is not a title report, appraisal, current owner verification, lien search or confirmation that a property is scheduled for auction. Regrid bills by the parcel records returned, and its documentation recommends explicit low limits for targeted lookups.

### Market chart and technical indicators
The Auction Machine's market panel now embeds the RO’Lyfe Live Chart Desk:
- Tickerbot OHLCV candlesticks, refresh control and timeframes 1D / 4H / 1H / 15M / 5M.
- EMA 5 / 10 / 20 / 50 / 200 price overlays and a session VWAP overlay on intraday timeframes.
- Lower-panel studies: RSI(14), MACD histogram (12/26/9), Slow Stochastic (14,3), CCI(20), ATR(14), ADX, Bollinger %B, OBV, TTM squeeze/momentum proxy, Supertrend direction, relative volume and volume.
- Quote / Greeks panel and an option premium ladder, with chart symbol and provider spot price synced into the Auction Machine option calculator.

RSI, MACD and Stochastic are selectable lower-panel studies (one selected study at a time). EMA and VWAP draw over the candlesticks. VWAP is an intraday session measure and is shown on 4H / 1H / 15M / 5M charts, not the daily chart. ATR / ADX and the TTM/Supertrend studies are education-grade calculations from the returned OHLCV bars; verify critical levels in a trusted chart platform before placing a trade.

### Market scanner
The 130-symbol watchlist is grouped as 75 stocks, 25 crypto and 30 futures. The Tickerbot scan button connects stocks and crypto to the active Tickerbot scan endpoint and displays returned values, technical fields and provider timestamp. Tickerbot scan docs support stocks and crypto but do not list futures as a scan asset class; futures remain a watchlist-only group until a separate futures feed is connected. Symbols not covered by the provider may be omitted or display no value. A blank/null value is not the same as zero.

Tickerbot's documented technical catalogue includes daily VWAP, EMA 9/12/21/26, RSI, Stochastic, MACD, ADX, ATR and Bollinger signals. The current chart calculates its EMA 5/10/20/50/200 and intraday VWAP from the loaded bars, and its other lower-panel studies from the same returned OHLCV series. Provider refresh cadence and symbol entitlement vary by instrument.

### Options / implied volatility
The option ladder calculates premium debit, stop risk, risk budget, max contract count and staged 1R–4R exits. It now warns when the selected contract count would exceed the entered risk budget.
The Quote / Greeks pop-up uses a Black–Scholes-style model based on the selected underlying quote and user-entered strike, DTE, assumed implied volatility and rate. **Implied volatility is still a manual assumption, not a live option-chain value.** Tickerbot's published technical signals do not include an option-chain implied-volatility field. A licensed options chain / IV provider and its API credentials are required to make IV and contract bid/ask real-time.

### Calculator review examples
The existing financial toolbox's displayed sample values reconcile to its formulas:
- Maximum bid: $300,000 ARV − $60,000 rehab − $22,000 costs − $40,000 target profit − $10,000 contingency = **$168,000**.
- Funding gap: $250,000 project cost − $25,000 buyer cash − $180,000 proposed loan = **$45,000**; six months' simple interest at 12% = **$10,800**; LTV = **60%**.
- Tax-lien simple yield example: $5,000 × 12% × 12/12 = $600 gross interest; less $100 costs = **$500 net**, or **10% net yield**.
- Overage example: $25,000 potential surplus − $2,500 estimated costs = **$22,500** net estimate; $10,000 maximum offer at an 80% target gives **$8,000**.

These examples are calculation checks only; lender, tax, title and transaction documents determine actual costs and cash flows.

### Current validation status
Repository JavaScript syntax and embedded-page script syntax were checked after the changes. The Edge Functions deployed successfully. This repository has not yet been completed through a real Android browser acceptance test: the map CDN fallback, live Tickerbot scan response, address weather response, Regrid secret/parcel response, quote-to-calculator sync and each calculator still require a visual in-browser run. Do not mark production-ready until these flows are checked on the live page.
