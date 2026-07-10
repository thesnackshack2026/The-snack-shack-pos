let order = {};
let orderNumber = 1001;
let sales = JSON.parse(localStorage.getItem("sales")) || [];
function addItem(name, price) {
    if (order[name]) {
        order[name].quantity++;
    } else {
        order[name] = {
            price: price,
            quantity: 1
        };
    }

    updateOrder();
}

function removeItem(name) {
    if (!order[name]) {
        return;
    }

    order[name].quantity--;

    if (order[name].quantity === 0) {
        delete order[name];
    }

    updateOrder();
}

function updateOrder() {
    const orderList = document.getElementById("orderList");

    orderList.innerHTML = "";

    let subtotalAmount = 0;

    for (let itemName in order) {
        const item = document.createElement("li");
        const itemSubtotal =
            order[itemName].price * order[itemName].quantity;

        subtotalAmount += itemSubtotal;

        item.innerHTML = `
            ${itemName} x${order[itemName].quantity} - $${itemSubtotal.toFixed(2)}
            <button onclick="removeItem('${itemName}')">Remove</button>
        `;

        orderList.appendChild(item);
    }

    const tax = subtotalAmount * 0.06;

    document.getElementById("subtotal").textContent =
        subtotalAmount.toFixed(2);

    document.getElementById("tax").textContent =
        tax.toFixed(2);

    document.getElementById("total").textContent =
        subtotalAmount.toFixed(2);
}

function clearOrder() {
    order = {};
    orderNumber++;

    document.getElementById("orderNumber").textContent =
        orderNumber;

    updateOrder();
}
function completeSale() {
    const receiptItems = document.getElementById("receiptItems");
    receiptItems.innerHTML = "";

    let subtotalAmount = 0;

    for (let itemName in order) {
        const itemSubtotal =
            order[itemName].price * order[itemName].quantity;

        subtotalAmount += itemSubtotal;

        const receiptLine = document.createElement("p");

        receiptLine.textContent =
            `${itemName} x${order[itemName].quantity} - $${itemSubtotal.toFixed(2)}`;

        receiptItems.appendChild(receiptLine);
    }

    const tax = subtotalAmount * 0.06;
const sale = {
    orderNumber: orderNumber,
    date: new Date().toISOString(),
    items: Object.entries(order).map(([name, details]) => ({
        name: name,
        price: details.price,
        quantity: details.quantity
    })),
    revenue: subtotalAmount,
    taxOwed: tax
};

sales.push(sale);

localStorage.setItem("sales", JSON.stringify(sales));

updateSalesSummary();

document.getElementById("saleComplete").classList.remove("hidden");
    document.getElementById("receiptOrderNumber").textContent =
        orderNumber;

    document.getElementById("receiptSubtotal").textContent =
        subtotalAmount.toFixed(2);

    document.getElementById("receiptTax").textContent =
        tax.toFixed(2);

    document.getElementById("receiptTotal").textContent =
        subtotalAmount.toFixed(2);

    document.getElementById("saleComplete").classList.remove("hidden");
}
function startNewOrder() {
    document.getElementById("saleComplete").classList.add("hidden");

    clearOrder();
}function updateSalesSummary() {
    const today = new Date().toDateString();

    const todaysSales = sales.filter(sale => {
        return new Date(sale.date).toDateString() === today;
    });

    const ordersToday = todaysSales.length;

    const revenueToday = todaysSales.reduce((total, sale) => {
        return total + sale.revenue;
    }, 0);

    const taxToday = todaysSales.reduce((total, sale) => {
        return total + sale.taxOwed;
    }, 0);

    document.getElementById("ordersToday").textContent = ordersToday;
    document.getElementById("revenueToday").textContent =
        revenueToday.toFixed(2);
    document.getElementById("taxToday").textContent =
        taxToday.toFixed(2);
}updateSalesSummary();