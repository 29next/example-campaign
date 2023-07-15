// 
// Variables
// 

// form
const formEl = document.querySelector('.form');
const firstName = document.querySelector("#id_first_name");
const lastName = document.querySelector("#id_last_name");
const email = document.querySelector("#id_email");
const expMonth = document.getElementById("id_expiry_month");
const expYear = document.getElementById("id_expiry_year");
const cvvParent = document.getElementById("bankcard-cvv");
const numberParent = document.getElementById("bankcard-number");
const cardErrBlock = document.getElementById("payment-error-block")

const ccCheckbox = document.getElementById('id_use_new_card');
const addCheckbox = document.getElementById('id_same_as_shipping');
const formCC = document.getElementById('form-cc');
const formShip = document.getElementById('form-shipping');
const formBill = document.getElementById('form-billing');
const validErrBlock = document.getElementById("validation-error-block")

// pay method buttons
const btnPaypal = document.querySelector('.pay-with-paypal');
const btnCC = document.querySelector(".pay-with-cc");


// Checkout 
successURL = "/upsell1.html";


// let refIdInitial
let selectedOfferId

// 
// Methods
// 

/**
 *  Get Campaign
*/
const retrieveCampaign = campaign.once(getCampaign);

retrieveCampaign();

/**
 * Use Create Create cart to capture prospect if email, first, and last names are valid
*/
const createProspect = () => {
   
    const email_reg = {
    first: /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi
    };
    if (firstName.value != '' && lastName.value != '' && (email_reg.first.test(email.value))) {
        
        sendProspect()

    }
}
const sendProspect = campaign.once(createCart);


/**
 * Create Packages
*/

selectedOfferId = "2";

const offers = {
    priceRetail: 39.99,
    packages: [
        {
            "id": 2,
            "image": "img/offer-x2.png",
            "quantity": 2,
            "name": "2x Drone Hawk",
            "price": 17.99,
            "priceTotal": 35.98,
            "shippingPrice": 0.00,
            "shippingMethod": 2,
        },
        {
            "id": 4,
            "image": "img/offer-x4.png",
            "quantity": 4,
            "name": "4x Drone Hawk",
            "price": 13.99,
            "priceTotal": 55.96,
            "shippingPrice": 0.00,
            "shippingMethod": 2,
        },
        {
            "id": 3,
            "image": "img/offer-x3.png",
            "quantity": 3,
            "name": "3x Drone Hawk",
            "price": 15.99,
            "priceTotal": 47.97,
            "shippingPrice": 0.00,
            "shippingMethod": 2,
        },
        {
            "id": 1,
            "image": "img/offer-x1.png",
            "quantity": 1,
            "name": "1x Drone Hawk",
            "price": 19.99,
            "priceTotal": 19.99,
            "shippingPrice": 7.99,
            "shippingMethod": 1,
        },

    ]
}

const renderPackages = () => {
    const template = `
                    <div class="offer-header d-flex justify-content-between align-items-center border-bottom">
                        <div class="offer-title d-flex align-items-center px-3">
                            <span class="offer-title-text fs-5  text-nowrap"></span>
                        </div>
                        <div class="px-3 py-3 text-nowrap fs-7 fw-bold">
                            <span class="shipping-cost"></span> SHIPPING
                        </div>
                    </div>
                    <div class="offer-content d-flex align-items-center py-2">
                        <div class="offer-content-img ms-5">
                            <img src="" class="img-fluid p-image">
                        </div>
                        <div class="offer-content-info pe-2 ms-3">
                            <div class="offer-content-price-each  text-primary">
                                <span class="price-each h4 fw-bold"></span>
                                <span class="fs-8 fw-light">/each</span>
                            </div>
                            <div class="offer-content-price-orig text-secondary">
                                <s> 
                                Orig
                                    <span class="price-each-retail"></span>
                                    <span class="fs-9 fw-light">/each</span>
                                </s>
                            </div>
                            <div class="offer-content-price-total h6 fw-bold text-success">
                                Total:
                                <span class="price-total"></span>
                            </div>
                        </div>
                       
                    </div>
                    `;

    const container = document.querySelector(".offers");

    for (let package of offers.packages) {

        let item = document.createElement("div");
        item.classList.add('offer');
        item.dataset.packageId = package.id;
        item.dataset.name = package.name;
        item.dataset.quantity = package.quantity;
        item.dataset.priceTotal = package.priceTotal.toFixed(2);
        item.dataset.priceEach = package.price.toFixed(2);
        item.dataset.priceShipping = package.shippingPrice.toFixed(2);
        item.dataset.shippingMethod = package.shippingMethod;
        item.innerHTML = template;
        item.querySelector(".offer-title-text").textContent = package.name;
        item.querySelector(".p-image").src = package.image;
        item.querySelector(".price-each-retail").textContent = campaign.currency.format(offers.priceRetail);

        // prices
        let priceElement = item.querySelector('.price-each');
        let priceTotalElement = item.querySelector('.price-total');

        priceElement.textContent = campaign.currency.format(package.price);
        priceTotalElement.textContent = campaign.currency.format(package.priceTotal);

        const truncateByDecimalPlace = (value, numDecimalPlaces) => Math.trunc(value * Math.pow(10, numDecimalPlaces)) / Math.pow(10, numDecimalPlaces)

        if (package.shippingPrice != 0) {
            item.querySelector(".shipping-cost").textContent = package.shippingPrice;
            item.querySelector(".offer-content-price-total").style.display = "none"
        } else {
            item.querySelector(".shipping-cost").textContent = "FREE";
        }

        container.appendChild(item);
    }
}


/**
 * Calculate totals 
*/
const calculateTotal = () => {

    let selectedPackage = document.querySelector(".offer.selected");
    let packagePrice
    let shippingPrice = selectedPackage.dataset.priceShipping

    packagePrice = selectedPackage.dataset.priceTotal;

    let checkoutTotal = parseFloat(packagePrice) + parseFloat(shippingPrice);

    let orderTotal = document.querySelector(".order-summary-total-value");

    orderTotal.textContent = campaign.currency.format(checkoutTotal);
}


// 
// Inits & Event Listeners
// 

document.addEventListener("DOMContentLoaded", function(event) {

    renderPackages();

    let firstLineItem = { package_id: selectedOfferId,  quantity: 1, is_upsell: false  };

    lineArr.push(firstLineItem);

    const summaryShipPrice = document.querySelector('.selected-shipping-price');

    const $offer = document.querySelectorAll('.offer');

    if ($offer) {

        $offer.forEach(function(el, key) {

            el.addEventListener('click', function() {

                el.classList.toggle("selected");

                let pid = el.dataset.packageId;

                let pName = el.dataset.name;

                let pPriceEach = el.dataset.priceEach;

                let pPriceShipping = el.dataset.priceShipping;

                let shippingMethod = el.dataset.shippingMethod;

                let pQuantity = el.dataset.quantity;

                document.getElementById('shipping_method').value = shippingMethod;
                document.querySelector('.selected-product-name').textContent = pName;
                
                document.querySelector('.selected-product-price').textContent = campaign.currency.format(pPriceEach);

                if (pPriceShipping != 0.00) {
                    summaryShipPrice.textContent = campaign.currency.format(pPriceShipping);

                } else {
                    summaryShipPrice.textContent = "FREE";
                }

                $offer.forEach(function(ell, els) {
                    if (key !== els) {
                        ell.classList.remove('selected');
                    }

                });

                firstLineItem.package_id = pid

                
                console.log("Change Line Items:", lineArr);

                calculateTotal()


            });
        });
    }


    // initial package setup
    for (const offer of $offer) {

        packageId = offer.dataset.packageId;
        shippingId = offer.dataset.shippingMethod;
        if (packageId === selectedOfferId) {
            offer.classList.add('selected');
            offer.style.order = '-1';
            document.getElementById('shipping_method').value = shippingId;
            document.querySelector('.selected-product-name').textContent = offer.dataset.name;
            document.querySelector('.selected-product-price').textContent = campaign.currency.format(offer.dataset.priceEach);
            if (offer.dataset.priceShipping != 0.00) {
                summaryShipPrice.textContent = campaign.currency.format(offer.dataset.priceShipping);

            } else {
                summaryShipPrice.textContent = "FREE";
            }
        }
    }

    console.log("Default Line Items:", lineArr);
    calculateTotal()

});


firstName.addEventListener('blur', createProspect);
lastName.addEventListener('blur', createProspect);
email.addEventListener('blur', createProspect);

btnPaypal.addEventListener('click', event => {
    validate.revalidateField('#id_first_name'),
    validate.revalidateField('#id_last_name'),
    validate.revalidateField('#id_email')
        .then(isValid => {
            if (isValid) {
              console.log('Paypal Button Clicked');
              document.getElementById('payment_method').value = 'paypal';
              createPPOrder();
            } else {
                document.querySelector('.is-invalid').focus();
            }
        });
});

btnCC.addEventListener('click', event => {
    formEl.requestSubmit();
    console.log('CC Button Clicked')
});




