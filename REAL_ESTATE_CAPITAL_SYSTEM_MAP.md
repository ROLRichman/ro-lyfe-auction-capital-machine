# RO’Lyfe Real Estate & Auction Capital Intelligence™ — System Map

**Primary application:** [RO’Lyfe Auction Capital Machine](https://rolrichman.github.io/ro-lyfe-auction-capital-machine/)  
**Canonical property workflow:** [RO’Lyfe Property Research Intelligence](https://rolrichman.github.io/rolyfe-property-research-intelligence/)  
**Business:** ROOT OF LYFE LLC  
**Role:** Capital Strategist | Real Estate & Business Funding  
**Operating model:** Funding research, deal preparation and referrals. ROOT OF LYFE LLC is not a lender.

## 1. Platform layout

| Component | Responsibility | Use it for |
|---|---|---|
| Property Research Intelligence | Shared property research dock, intake, parcel and county source checking | Find, identify and verify a candidate |
| Auction Capital Machine | Auction intake, deal and rehab analysis, bid ceiling, risk checks, maps and partner paths | Analyze an auction candidate |
| Tax Yield & County Intelligence V1 | County profile, tax-sale terminology and calculators | Build jurisdiction questions and yield scenarios |
| Real Estate Command Center | Scenario modeling, lender matching, due diligence and deal packets | Compare acquisition and financing structures |
| Funding & Execution Hub | Capital readiness and partner workflows | Prepare funding referral/handoff |
| Business Funding Resource Center | Business funding/grant readiness research | Support a separate business-purpose funding request |
| Contract & Document Hub | Transaction document workflow | Organize approved deal documents |
| Acquisition Engine / Buyer Network / Closers OS | Acquisition, buyer coordination and closing operations | Support the execution path after the deal is verified |
| RO’Lyfe Command Center | Cross-platform navigation | Navigate the wider RO’Lyfe ecosystem |

Related deployments:
- Property Research: https://rolrichman.github.io/rolyfe-property-research-intelligence/
- Auction Capital Machine: https://rolrichman.github.io/ro-lyfe-auction-capital-machine/
- County Intelligence V1 source: https://github.com/ROLRichman/RO-Lyfe-Auction-Capital-Machine-V1
- Real Estate Command Center: https://rolrichman.github.io/rolyfe-real-estate-command-center/
- Funding & Execution Hub: https://rolrichman.github.io/rolyfe-funding/
- Business Funding Resource Center: https://rolrichman.github.io/ro-lyfe-business-funding-resource-center/
- Contracts & Documents: https://rolrichman.github.io/rolyfe-contract-documents-hub/
- Acquisition Engine: https://rolrichman.github.io/rolyfe-acquisition-engine/
- Buyer Network OS: https://rolrichman.github.io/RO-Lyfe-Buyer-Network-OS/
- Closers OS: https://rolrichman.github.io/RO-Lyfe-Closers-OS/
- Command Center: https://rolrichman.github.io/rolyfe-command-center/

## 2. Shared transaction pipeline

`DISCOVER → IDENTIFY → CLASSIFY → VERIFY → UNDERWRITE → CAPITAL PLAN → EXECUTION REVIEW → PACKAGE → PARTNER HANDOFF → DECISION`

### Stage A — Discover
Capture the original source URL, property address, APN/parcel, county/state, auction platform, sale identifier, date/time, opening/current bid, registration conditions and source capture date.

### Stage B — Identify
Match the property address with the legal parcel/APN, county GIS and sale notice. Note any mismatch in street address, unit, parcel, legal description, owner name or situs.

### Stage C — Classify the transaction
Choose exactly one primary process and add secondary flags only where necessary:
- Tax lien / tax certificate: acquisition of a claim or certificate, not immediate ownership of the real estate.
- Tax deed / redeemable deed: deed-oriented sale with jurisdiction-specific notice, redemption and title requirements.
- Tax upset / judicial sale: use the exact county/legal sale category; record statutory and county-level process.
- Sheriff / mortgage foreclosure: foreclosure process with sale terms, confirmation, deed and possession questions.
- Bank-owned / REO: seller-owned inventory with seller-specific purchase conditions.
- Government / surplus / other: use the disposing agency’s actual process and terms.

### Stage D — Verify
Save the official auction terms and county/court source. Check tax collector, assessor, recorder/register, court/sheriff, zoning/land use, GIS, utilities, occupancy/access, flood and environmental flags, title and liens. Label each field:
- **Verified:** directly supported by a current primary document or record.
- **Estimated:** model, AVM, broker/third-party estimate or unverified cost input.
- **Conflicting:** sources do not agree.
- **Unknown:** not yet established.

### Stage E — Underwrite
The calculation record should include:
- Acquisition / winning bid
- Buyer premium and auction fees
- Bid deposit / earnest money
- Balance due and final payment date
- Delinquent taxes and municipal balances
- Transfer, recording, title, legal and closing costs
- Rehab / contractor scope and contingency
- Utilities, insurance, taxes, security and carrying costs
- Interest, points, lender fees and other financing costs
- Selling / disposition costs
- Target profit or yield and exit plan

The maximum-offer calculation must use total project economics and the selected strategy. Never use the opening bid as a maximum bid.

### Stage F — Capital timing and routing
Model at least two distinct capital needs:
1. **Auction execution cash:** registration, proof of funds, deposit, winning-bid balance and settlement by the auction deadline.
2. **Post-award / project capital:** title cure/legal process, closing costs, rehab draws, carrying costs and exit financing.

A conventional bridge or rehab product cannot be assumed to fund the auction deposit or meet a compressed auction payment deadline. Get written confirmation from the capital provider about the exact sale type, state/county, borrower, property, funding date and disbursement mechanics.

### Stage G — Execution and package
Collect contractor scope/estimate, buyer/operator details, inspection/access facts, insurance/utility needs, realistic timeline and exit strategy. Build a lender/partner brief with verified documents attached securely. Share only the minimum necessary borrower information through the partner’s approved secure intake.

### Stage H — Partner handoff
Record:
- Partner/provider and contact
- Date sent
- Exact ask and requested amount/timing
- Sale type and state/county
- Documents sent
- Partner questions, conditions, decline or indication
- Next action, owner and follow-up date

A referral is not an approval. Do not put verbal curiosity into the system as a lender commitment.

## 3. Resource links and partner directory

### Auction and tax sale discovery
- Auction.com — https://www.auction.com/
- Bid4Assets — https://www.bid4assets.com/
- GovEase — https://www.govease.com/tax-sale-property-auctions
- RealAuction — https://www.realauction.com/
- GovDeals — https://www.govdeals.com/
- Philadelphia Sheriff Sales — https://www.phillysheriff.com/property-listing/

### Property research / parcel / public records
- Zillow — https://www.zillow.com/
- Redfin — https://www.redfin.com/
- Realtor.com — https://www.realtor.com/
- Regrid — https://regrid.com/
- Philadelphia Property App — https://property.phila.gov/
- FEMA Flood Map Service Center — https://msc.fema.gov/portal/search

### Potential capital / referral pathways
- Kiavi Broker Program — https://www.kiavi.com/collateral/broker-program
- Private Money Exchange — https://privatemoneyexchange.com/aff-page/richman/
- COGO Capital — https://www.cogocapital.com/
- COGO portal — https://www.borrowersviewcentral.com/portal/applynew?id=LCS
- National Corporate Credit — https://nationalcorporatecredit.com/
- NCC / Richard Guzman calendar — https://calendly.com/richardguzman
- MyPartner Business Financing — https://go.mypartner.io/business-financing/?ref=001Qk00000MkqgTIAR
- Americas Funding Experts — https://my.americasfundingexperts.com/?id=1820217000190862001
- 7 Figures Credit — https://www.7figurescredit.com/?a_aid=ROLFunding
- RO’Lyfe Funding & Execution Hub — https://rolrichman.github.io/rolyfe-funding/

**Provider classification:** These links are the known referral/partner resources in the RO’Lyfe workspace. Verify current service scope and whether the provider will consider tax lien, tax deed, foreclosure, auction deposit, post-award or rehab funding. Business-purpose capital sources are not automatically real-estate auction lenders. Disclose any applicable referral relationship or compensation.

## 4. Product and integration boundaries

- The Property Research Dock opens external provider pages and search URLs; it does not scrape or import confirmed listing, title, lien, tax or comp data.
- Regrid parcel information, if returned by an authorized server-side integration, is a parcel reference—not a title report, survey, appraisal or legal ownership opinion.
- A link to a lender’s application does not prove program eligibility, price, availability or approval.
- The separate GitHub Pages apps do not automatically become one synchronized CRM or database. The Property Research Engine currently uses same-origin browser-local storage for saved research; it is not cross-device shared storage.
- No secret, private API token, Supabase service-role key, borrower SSN, tax return or bank statement belongs in public HTML, JavaScript, README files, or Git history.
- Live API data must be clearly labeled with its provider, refresh time, coverage and data limitations. Do not fabricate missing quotes or parcel fields.

## 5. Next engineering priorities

1. Shared client/property record schema with source provenance and evidence status.
2. Secure authenticated Supabase-backed record storage with user/team ownership, row-level security and audit history.
3. Secure private document upload and partner-specific document handoff.
4. County profile registry with official source URLs, exact sale terminology, deadlines and last-verified date.
5. Auction cash-timing calculator separating deposit, final settlement and post-award project costs.
6. Partner criteria registry that stores only confirmed product details, geography, loan purpose, property types, timeline, contact and verified date.
7. Mobile acceptance tests for the Android/tablet interface and for every partner-link destination.

## 6. Governance

This is an information and decision-support system, not lending, legal, title, tax, appraisal, real-estate brokerage or investment advice. The applicable statutes, county notices, sale conditions, title work, qualified professionals and capital-provider decisions govern. No loan, approval, property value, yield, profit or acquisition outcome is guaranteed.
