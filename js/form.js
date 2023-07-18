/**
 * Form validation with just-validatate.js
 */
const validate = new JustValidate(formEl, {
    errorFieldCssClass: ['is-invalid']
});

validate
    .addField(
        '#id_first_name',
        [{
                rule: 'required',
                errorMessage: 'First name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',
            },

        ],

        {
            errorsContainer: '.invalid-fname',
        }
    )
    .addField(
        '#id_last_name',
        [{
                rule: 'required',
                errorMessage: 'Last name is required',
            },

            {
                rule: 'maxLength',
                value: 255,
            },
            {
                rule: 'customRegexp',
                value: /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+$/gi,
                errorMessage: 'Contains an invalid character',

            },
        ],

        {
            errorsContainer: '.invalid-lname',
        }
    )

    .addField(
        '#id_email',
        [{
                rule: 'required',
                errorMessage: 'Email is required',
            },
            {
                rule: 'email',
                errorMessage: 'Email is invalid!',
            },
            {
                rule: 'maxLength',
                value: 255,
            },
        ],

        {
            errorsContainer: '.invalid-email',

        }
    )
    .addField(
        '#id_phone_number', 
        [{
                rule: 'required',
                errorMessage: 'Valid US phone number required',
            },

            {
                rule: 'customRegexp',
                value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                errorMessage: 'Invalid Number',

            },
            {
                rule: 'maxLength',
                value: 15,
            },
        ],
        {

            errorsContainer: '.invalid-ph',

        }
    )
    .addField('#id_shipping_address_line1', [{
            rule: 'required',
            errorMessage: 'Shipping address is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },
    ], {

        errorsContainer: '.invalid-shipping_address_line1',

    })
    .addField('#id_shipping_address_line4', [{
            rule: 'required',
            errorMessage: 'Shipping city is required',
        },
        {
            rule: 'maxLength',
            value: 255,
        },

    ], {

        errorsContainer: '.invalid-shipping_address_line4',

    })
    .addField('#id_shipping_state', [{
        rule: 'required',
        errorMessage: 'Shipping state/province is required',
    }, ], {

        errorsContainer: '.invalid-shipping_state',

    })
    .addField('#id_shipping_postcode', [{
            rule: 'required',
            errorMessage: 'Shipping ZIP/Postcode is required',
        },
        {
            rule: 'maxLength',
            value: 64,
        },
    ], {

        errorsContainer: '.invalid-shipping_postcode',

    })
    .addField('#id_shipping_country', [{
        rule: 'required',
        errorMessage: 'Shipping country is required',
    }, ], {

        errorsContainer: '.invalid-shipping_country',

    })


    .onFail((fields) => {
        console.log('Field validation fail', fields);
    })
    .onSuccess((event) => {
        console.log('Field validation pass, submit card details', event);
        document.getElementById('payment_method').value = 'card_token';
        Spreedly.validate();
    });


/**
 * Card Validation with Spreedly iFrame
 */

const style = 'color: #212529; font-size: 1rem; line-height: 1.5; font-weight: 400;width: calc(100% - 20px); height: calc(100% - 2px); position: absolute;padding: 0.13rem .75rem';

// set placeholders and styles for iframe fields to make UI style
Spreedly.on("ready", function() {
    Spreedly.setFieldType('text');
    Spreedly.setPlaceholder('cvv', "CVV");
    Spreedly.setPlaceholder('number', "Card Number");
    Spreedly.setNumberFormat('prettyFormat');
    Spreedly.setStyle('cvv', style);
    Spreedly.setStyle('number', style);

    btnCC.removeAttribute('disabled');
});

// handle form submit and tokenize the card
function submitPaymentForm() {
    // reset form when submit, only for demo page, can ignore
    cardErrBlock.innerHTML = '';
    // Get required, non-sensitive, values from host page
    var requiredFields = {};
    requiredFields["first_name"] = firstName.value;
    requiredFields["last_name"] = lastName.value;
    requiredFields["month"] = expMonth.value;
    requiredFields["year"] = expYear.value;

    Spreedly.tokenizeCreditCard(requiredFields);

}

// handle tokenization errors from spreedly to show to end user
Spreedly.on('errors', function(errors) {
    console.log('Card validation fail', errors);
    let error_html = '';
    errors.forEach(element => {
        error_html += `${element.message}<br/>`;

        if (element["attribute"] == "number") {
            numberParent.classList.add("is-invalid");
            numberParent.classList.remove("is-valid");
        } else {
            numberParent.classList.remove("is-invalid");

        }
        if (element["attribute"] == "month") {

            expMonth.classList.add("is-invalid");
            document.querySelector('.is-invalid').focus();

        } else {
            expMonth.classList.remove("is-invalid");

        }
        if (element["attribute"] == "year") {

            expYear.classList.add("is-invalid");
            document.querySelector('.is-invalid').focus();

        } else {
            expYear.classList.remove("is-invalid");

        }
    });

    if (error_html) {
        cardErrBlock.innerHTML = `
                <div class="alert alert-danger">
                    ${error_html}
                </div>
            `;
    }

    btnCC.removeAttribute('disabled');
});

Spreedly.on('fieldEvent', function(name, type, activeEl, inputProperties) {

    if (type == "input" && name == "number") {
        if (inputProperties["validNumber"]) {
            Spreedly.setStyle('number', "background-color: #CDFFE6;")
            numberParent.classList.remove("is-invalid");
        } else {
            Spreedly.setStyle('number', "background-color: transparent;")
            numberParent.classList.remove("is-invalid");
            cardErrBlock.innerHTML = ``;
        }
    } else if (type == "input" && name == "cvv") {
        if (inputProperties["validCvv"]) {
            Spreedly.setStyle('cvv', "background-color: #CDFFE6;")
            cvvParent.classList.remove("is-invalid");
        } else {
            Spreedly.setStyle('cvv', "background-color: transparent")
            cvvParent.classList.remove("is-invalid");
            cardErrBlock.innerHTML = ``;
        }
    }

});

Spreedly.on('validation', function(inputProperties) {

    if (!inputProperties["validNumber"]) {
        numberParent.classList.add("is-invalid");
        Spreedly.transferFocus("number");
        numberParent.classList.remove("is-valid");
        cardErrBlock.innerHTML = `
                    <div class="alert alert-danger">
                        Please enter a valid card number
                    </div>
                `;
    } else if (!inputProperties["validCvv"]) {

        cvvParent.classList.add("is-invalid");
        Spreedly.transferFocus("cvv");
        cvvParent.classList.remove("is-valid");
        cardErrBlock.innerHTML = `
                    <div class="alert alert-danger">
                        Please enter a valid CVV number
                    </div>
                `;

    } else {
        submitPaymentForm();
    }



});

// handle payment method (card token) after successfully created
Spreedly.on('paymentMethod', function(token, pmData) {
    document.getElementById('card_token').value = token;
    createOrder();

});


