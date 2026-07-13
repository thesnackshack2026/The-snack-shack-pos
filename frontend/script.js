let order = {};
let orderNumber = 1001;

let sales = JSON.parse(localStorage.getItem("sales")) || [];

let inventory = JSON.parse(localStorage.getItem("inventory")) || {
    Popcorn: 4,
    Soda: 40,
    Candy: 30,
    Pretzel: 20
};

let products = JSON.parse(localStorage.getItem("products")) || [];

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
for (let itemName in order) {
    const product = products.find(product => product.name === itemName);

    if (product) {
        product.inventory = Math.max(
            0,
            Number(product.inventory || 0) - order[itemName].quantity
        );
    }
}

localStorage.setItem("products", JSON.stringify(products));
displayMenu();

updateInventoryDisplay();
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
}
updateSalesSummary();
function updateInventoryDisplay() {
    const inventoryList = document.getElementById("inventoryList");

    if (!inventoryList) {
        return;
    }

    inventoryList.innerHTML = "";

    if (products.length === 0) {
        inventoryList.textContent = "No products in the catalog yet.";
        return;
    }

    products.forEach(product => {
        const inventoryLine = document.createElement("p");

        const quantity = Number(product.inventory || 0);
        const restockLevel = Number(product.restockLevel || 0);
        const lowStockWarning =
            quantity <= restockLevel ? " ⚠️ LOW" : "";

        inventoryLine.textContent =
            `${product.name}: ${quantity}${lowStockWarning}`;

        inventoryList.appendChild(inventoryLine);
    });
}
updateInventoryDisplay();
function updateBestSellers() {
    const soldCounts = {
        Popcorn: 0,
        Soda: 0,
        Candy: 0,
        Pretzel: 0
    };

    sales.forEach(sale => {
        sale.items.forEach(item => {
            soldCounts[item.name] += item.quantity;
        });
    });

    document.getElementById("soldPopcorn").textContent =
        soldCounts.Popcorn;

    document.getElementById("soldSoda").textContent =
        soldCounts.Soda;

    document.getElementById("soldCandy").textContent =
        soldCounts.Candy;

    document.getElementById("soldPretzel").textContent =
        soldCounts.Pretzel;
        const topSellerEntry = Object.entries(soldCounts).reduce(
    (topItem, currentItem) => {
        return currentItem[1] > topItem[1] ? currentItem : topItem;
    }
);

const topSellerName = topSellerEntry[0];
const topSellerQuantity = topSellerEntry[1];

if (topSellerQuantity === 0) {
    document.getElementById("topSeller").textContent =
        "No sales yet";
} else {
    document.getElementById("topSeller").textContent =
        `${topSellerName} — ${topSellerQuantity} sold`;
}
}updateBestSellers();
document.getElementById("addProductBtn").addEventListener("click", function () {
    document.getElementById("addProductPanel").classList.remove("hidden");
});

function closeAddProduct() {
    document.getElementById("addProductPanel").classList.add("hidden");
}function saveProduct() {
    const name = document.getElementById("productName").value.trim();
    const category = document.getElementById("productCategory").value.trim();
    const price = Number(document.getElementById("productPrice").value);
    const cost = Number(document.getElementById("productCost").value);
    const startingInventory =
        Number(document.getElementById("productInventory").value);
    const restockLevel =
        Number(document.getElementById("productRestockLevel").value);
    const supplier =
        document.getElementById("productSupplier").value.trim();

    if (!name || !category || price <= 0) {
        alert("Please enter a product name, category, and selling price.");
        return;
    }

    const product = {
        id: Date.now(),
        name,
        category,
        price,
        cost,
        inventory: startingInventory,
        restockLevel,
        supplier,
        active: true
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    displayMenu();

    closeAddProduct();

    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productCost").value = "";
    document.getElementById("productInventory").value = "";
    document.getElementById("productRestockLevel").value = "";
    document.getElementById("productSupplier").value = "";

    alert(`${name} was added to Lolli's Product Catalog!`);
}function displayMenu() {
    const menu = document.getElementById("menuButtons");

    menu.innerHTML = "";

    products.forEach(product => {
        if (!product.active) {
            return;
        }

        const button = document.createElement("button");

        button.textContent =
            `${product.name} - $${product.price.toFixed(2)}`;

        button.onclick = function () {
            addItem(product.name, product.price);
        };

        menu.appendChild(button);
    });
}displayMenu();