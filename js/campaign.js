// 
// Variables
// 

const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/'



const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey
}
// let campaignName, campaignCurrency, payEnvKey, refId, successURL, successURLEnd
//
// Methods
// 
let campaign = (function() {

    function getSuccessUrl() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + successURL, base)
        return url.href
    };

    function getSuccessUrlSkip() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + successURLEnd, base)
        return url.href
    };

    // Fire a function only once
    const once = fn => {
        let called = false;
        return function(...args) {
            if (called) return;
            called = true;
            return fn.apply(this, args);
        };
    };

    let currency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    return { getSuccessUrl, getSuccessUrlSkip, once, currency };


})();





