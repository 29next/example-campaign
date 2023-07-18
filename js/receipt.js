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

getOrderReceipt()

function show(order) {

    // current date format for order
    const date = new Date()
    const dateOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    let currentDate = new Date().toLocaleDateString(date, dateOptions);



    // add order details 
    const containerHeader = document.querySelector(".order-receipt-header");

    containerHeader.innerHTML = `
                    <div class="row">
                        <div class="col-sm  p-3">
                            <div class="fs-6"><i class="fas fa-shopping-cart me-2"></i>Order Number: <span>${order.number}</span></div>
                        </div>
                        <div class="col-sm p-3 text-sm-end">
                            <div class="fs-6"><i class="far fa-calendar-alt me-2"></i>Order Date: <span>${currentDate}</span></div>
                        </div>
                    </div>`;

    // add order summary 
    const containerSummary = document.querySelector(".order-receipt-summary");

    containerSummary.innerHTML = `
                    <div class="row justify-content-end row-subtotal">
                        <div class="col-md-4 p-2 text-end">
                            <div class="summary-order-subtotal">Sub Total: <span class="ms-3 summary-order-subtotal-value"></span> </div>
                        </div>
                    </div>
                    <div class="row justify-content-end row-shipping ">
                        <div class="col-md-4 p-2 text-end">
                            <div class="summary-order-shipping">Shipping & Handling: <span class="ms-3">${campaign.currency.format(order.shipping_incl_tax)}</span> </div>
                        </div>
                    </div>
                    <div class="row justify-content-end row-discounts">
                        
                    </div>
                    <div class="row justify-content-end  row-total">
                        <div class="col-md-4 p-2 text-end">
                            <div class="summary-order-total fw-bold">Total: <span class="ms-3">${campaign.currency.format(order.total_incl_tax)}</span> </div>
                        </div>
                    </div>`;


    const rowDiscounts = document.querySelector(".row-discounts");

    if (order.total_discounts != (0.00)) {
        rowDiscounts.innerHTML = `
                    <div class="col-md-4 p-2 text-end">
                            <div class="summary-order-discount text-success">Additional Discounts: <span class="ms-3">- ${campaign.currency.format(order.total_discounts)}</span> </div>
                        </div>`
    } else {
        rowDiscounts.classList.add('d-none')
    }




    // add shipping and biliing address
    const containerFooter = document.querySelector(".order-receipt-footer");

    containerFooter.innerHTML = `
                    <div class="row my-4">
                        <div class="col-sm  p-3 text-center">
                            <div class="fs-6">The charge will appear on your billing statement as <span class="order-reference fw-bold"></span></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm ">
                            <div class="bg-xlight rounded-3 p-3">  
                                <div class="fs-6 pb-3 mb-3">Shipping Address</div>
                                <address>
                                    ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
                                    ${order.shipping_address.line1}, <br>
                                    ${order.shipping_address.line4}, ${order.shipping_address.state}, ${order.shipping_address.postcode}<br>
                                    ${order.shipping_address.country}
                                </address>
                            </div>
                        </div>
                        <div class="col-sm ">
                            <div class="bg-xlight rounded-3 p-3">  
                                <div class="fs-6 pb-3 mb-3">Billing Address</div>
                                 <address>
                                    ${order.billing_address.first_name} ${order.billing_address.last_name}<br>
                                    ${order.billing_address.line1}, <br>
                                    ${order.billing_address.line4}, ${order.billing_address.state}, ${order.billing_address.postcode}<br>
                                    ${order.billing_address.country}
                                </address>
                            </div>
                        </div>
                    </div>`;

    // add receipt items
    const containerItems = document.querySelector(".order-receipt-items");

    containerItems.innerHTML = ``

    for (let item of order.lines) {
        const orderItem = document.createElement("div");
        orderItem.classList.add("row");

        const orderItemRow = `
            <div class="col-8  p-2">
                <div class="summary-item text-break">${item.product_title}</div>
            </div>
            
            <div class="col-2 p-2 text-end">
                <div class="summary-item-qty">${item.quantity}</div>
            </div>
            <div class="col-2 p-2 text-end">
                <div class="summary-item-total currency" data-item-price="${item.price_incl_tax_excl_discounts}">${campaign.currency.format(item.price_incl_tax_excl_discounts)}</div>
            </div>
        `;
        orderItem.insertAdjacentHTML('beforeend', orderItemRow)
        containerItems.appendChild(orderItem);

    }

    // calculate order subtotal
    let packageTotals = [];

    let selectedPackage = document.querySelectorAll(".summary-item-total");

    selectedPackage.forEach((package) => {
        packageTotals.push(parseFloat(package.dataset.itemPrice));
    });

    let subTotal = packageTotals.reduce(function(a, b){
      return a + b;
    });

    const orderSubTotal = document.querySelector(".summary-order-subtotal-value");

    orderSubTotal.textContent = campaign.currency.format(subTotal);

    const orderRefernce = document.querySelector(".order-reference");
    orderRefernce.textContent = orderRef

}