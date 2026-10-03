/* RO'Lyfe Resource Router — official/source-first routing */
(function(root){
  "use strict";
  const resources={
    auction:{name:"Auction.com",url:"https://www.auction.com/",type:"auction"},
    philadelphiaProperty:{name:"Philadelphia Property Search",url:"https://property.phila.gov/",type:"official"},
    philadelphiaTax:{name:"Philadelphia Tax Center",url:"https://tax-services.phila.gov/",type:"official"},
    zillow:{name:"Zillow",url:"https://www.zillow.com/",type:"market"},
    redfin:{name:"Redfin",url:"https://www.redfin.com/",type:"market"},
    realtor:{name:"Realtor.com",url:"https://www.realtor.com/",type:"market"},
    kiavi:{name:"Kiavi",url:"https://www.kiavi.com/",type:"lender"},
    cogo:{name:"COGO Capital",url:"https://www.cogocapital.com/",type:"lender"},
    realAuction:{name:"RealAuction",url:"https://www.realauction.com/",type:"auction"},
    lienHub:{name:"LienHub",url:"https://www.lienhub.com/",type:"research"},
    relocation:{name:"RO'Lyfe Relocation Intelligence",url:"https://rolrichman.github.io/rolyfe-relocation-intelligence/",type:"rolyfe"},
    marketTerminal:{name:"RO'Lyfe Market Terminal",url:"https://rolrichman.github.io/rolyfe-market-terminal/",type:"rolyfe"}
  };
  const stateHints={
    PA:["Use the county/municipality tax collector or sheriff/tax-sale administrator and the official property/tax record. Pennsylvania terminology and procedure can vary by county."],
    FL:["Check the county tax collector and the county's official tax certificate/tax deed sale administrator. RealAuction may host specific county programs."],
    NJ:["Check the municipality/tax collector and county clerk for the applicable tax-sale, certificate and assignment process."],
    DEFAULT:["Use the state/county treasurer, tax collector, clerk, recorder, sheriff or auction administrator identified in the official sale notice."]
  };
  function get(key){return resources[key]||null}
  function stateGuidance(state){return stateHints[String(state||"").toUpperCase()]||stateHints.DEFAULT}
  function open(key){const r=get(key);if(r)window.open(r.url,"_blank","noopener,noreferrer");return r}
  root.ROLyfeResourceRouter={resources,get,stateGuidance,open};
})(window);
