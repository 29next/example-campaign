const btnUpsell = document.querySelector('.btn-success')

/**
 * Get Order Details for Upsell page
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
            window.location.href = campaign.skipSteps(confirmationURL)
        } 

        console.log(result);

    } catch (error) {
        console.log(error);
    }
}

const retrieveOrder = campaign.once(getOrder);


/**
 * Create Upsell
*/
const createUpsell = async () => {
    console.log ("create upsell");
    const orderData = {    
      "lines": upsellLineItem
    }

    btnUpsell.disabled = true;
    btnUpsell.textContent = btnUpsell.dataset.loadingText;

    try {
        const response = await fetch((ordersURL + refId + '/upsells/'), {
            method: 'POST',
            headers,
            body: JSON.stringify(orderData),
        });
        const result = await response.json()

        if (!response.ok) {
            console.log('Something went wrong');
            btnUpsell.disabled = false;
            btnUpsell.textContent = btnUpsell.dataset.text;
            return;
        } 
        console.log(result);
        location.href = campaign.nextStep(nextURL);

    } catch (error) {
        console.log(error);
    }
}

document.addEventListener("DOMContentLoaded", function(event) {

    retrieveOrder();

    const sendUpsell = campaign.once(createUpsell);

    const clickHandler = () => {
        sendUpsell();
    }

    btnUpsell.addEventListener('click', clickHandler);
    
    [...document.getElementsByClassName('upsell-no')].forEach(anchor => {
        anchor.href = campaign.nextStep(nextURL);
    });
});