// 
// Variables
// 
const publicKey = "E1glMsmCTf2UeZZA9aMLEsH3lJBIYi4gOw0Gp0rq";

const campaignRetrieveURL = 'https://campaigns.apps.29next.com/api/v1/campaigns/';
const cartsCreateURL = 'https://campaigns.apps.29next.com/api/v1/carts/'
const ordersURL = 'https://campaigns.apps.29next.com/api/v1/orders/'

const successURLEnd = "/thank-you.html";

const headers = {
    'Content-Type': 'application/json',
    'Authorization': publicKey
}

// Campaign Data
let lineArr = [];
// let voucherArr = [];
let campaignName, campaignCurrency, payEnvKey, refId, successURL



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


/**
 *  Get Campaign
*/
const getCampaign = async () => {
    console.log("get campaign");
    try {

        const response = await fetch(campaignRetrieveURL, {
            method: 'GET',
            headers,
        });
        const data = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        }

        console.log(data)

        getCampaignData(data);


    } catch (error) {
        console.log(error);
    }
}

const getCampaignData = (data) => {
  campaignName = data.name;
  campaignCurrency = data.currency;
  payEnvKey = data.payment_env_key;

}

/**
 *  Create Cart / New Prospect
*/
const createCart = async () => {

    console.log("create prospect");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    console.log(data);

    const cartData = {
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email
        },
        "lines": lineArr
    }

    try {
        const response = await fetch(cartsCreateURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(cartData),
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        }
        

    } catch (error) {
        console.log(error);

    }
}


/**
 * Use Create Order with Credit Card
*/

const createOrder = async () => {

    console.log ("create order");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    
    const orderData = {
        "user": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email": data.email,
        },
        "lines": lineArr,
        
        "use_default_shipping_address": false,

        "use_default_billing_address": false,
        "billing_same_as_shipping_address": data.billing_same_as_shipping_address,
        "payment_detail": {
            "payment_method": data.payment_method,
            "card_token": data.card_token,
        },
        "shipping_address": {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "line1": data.shipping_address_line1,
            "line4": data.shipping_address_line4,
            "state": data.shipping_state,
            "postcode": data.shipping_postcode,
            "country": data.shipping_country
        },
        "shipping_method": data.shipping_method,
        "success_url": campaign.getSuccessUrl(successURL)
    }
        

    console.log (orderData);

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        const result = await response.json()


        sessionStorage.setItem('ref_id', result.ref_id);
   
        if (!result.payment_complete_url && result.number) { 

            location.href = campaign.getSuccessUrl(successURL);

        } else if (result.payment_complete_url){
            
            window.location.href = result.payment_complete_url;
        }

    } catch (error) {
        console.log(error);
    }

}

/**
 * Use Create Order with PayPal
*/
const createPPOrder = async () => {
    console.log ("create order paypal order");
    const formData = new FormData(formEl);
    const data = Object.fromEntries(formData);

    const orderPPData = {
            "user": {
                "first_name": data.first_name,
                "last_name": data.last_name,
                "email": data.email,
            },
            "lines": lineArr,         
            "payment_detail": {
                "payment_method": data.payment_method,
            },
            "shipping_method": data.shipping_method,
            "success_url": campaign.getSuccessUrl(successURL)
    }

    try {
        const response = await fetch(ordersURL, {
            method: 'POST',
            headers,
            body: JSON.stringify(orderPPData),
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            console.log (orderPPData);
            return;
        } 

        console.log(result)

        sessionStorage.setItem('ref_id', result.ref_id);

        window.location.href = result.payment_complete_url;

    } catch (error) {
        console.log(error);
    }


}

/**
 * Get Order Details for upsell pages
*/
const getOrder = async () => {
    console.log ("get order");
    try {
        
        const response = await fetch((ordersURL + refId + '/'), {
            method: 'GET',
            headers,
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        } 

        if (result.supports_post_purchase_upsells === false) {
            window.location.href = campaign.getSuccessUrlSkip(successURLEnd)
        } 


        console.log(result);

    } catch (error) {
        console.log(error);
    }
}

const retrieveOrder = campaign.once(getOrder);


/**
 * Get Order Details for thankyou / receipt page
*/
const getOrderReceipt = async () => {
    try {

        const response = await fetch((ordersURL + refId + '/'), {
            method: 'GET',
            headers

        });
        const order = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        }
        console.log(order);
        show(order)
    } catch (error) {
        console.log(error);
    }
}


/**
 * Create Upsell 1
*/
const createUpsell1 = async () => {
    console.log ("create upsell");
    const orderData = {    
      "lines": [
        {
          "package_id": 5,
          "quantity": 1,
          "is_upsell": true
        }
      ]
    }
    console.log (orderData);
    try {
        const response = await fetch((ordersURL + refId + '/upsells/'), {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            return;
        } 
        console.log(result);
        location.href = campaign.getSuccessUrl(successURL);

    } catch (error) {
        console.log(error);
    }
}