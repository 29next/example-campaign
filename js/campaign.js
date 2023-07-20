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

const confirmationURL = "/thank-you.html";

//
// Methods
// 
let campaign = (function() {

    function nextStep() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + nextURL, base)
        return url.href
    };

    function skipSteps() {
        path = location.pathname.split("/");
        campaignPath = path.slice(0, path.length-1).join("/");
        base = location.protocol + '//' + location.host;
        url = new URL(campaignPath + confirmationURL, base)
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

    return { nextStep, skipSteps, once, currency };


})();





