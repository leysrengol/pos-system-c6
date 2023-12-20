let categoriesData = JSON.parse(localStorage.getItem('productsData'));
const calculateTotal = document.querySelector('.tot');
const rightTable = document.querySelector('#rightTable tbody');
let mainCard = document.querySelector('.onleft');
const checkoutButton = document.querySelector('.onright').lastElementChild;
let arrOfProduct = JSON.parse(localStorage.getItem('productsData'));
let sumallTotal = 0;
let newQuantity = [];

////////////////Create Table//////////////////
function createTableFromCart() {
  rightTable.innerHTML = '';
  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      let instock = product.quantity;
      let price = product.price;

      let tr = document.createElement('tr');
      let tdName = document.createElement('td');
      let tdQuantity = document.createElement('td');
      let tdInstock = document.createElement('td');
      let tdPrice = document.createElement('td');
      let tdID = document.createElement('td');
      let tdCancel = document.createElement('td');
      let tdTotal = document.createElement('td');
      let imgDelete = document.createElement('img');

      imgDelete.src = "../image/trash.png";
      imgDelete.setAttribute('class', 'td');
      let input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.className = 'input';
      input.value = product.quantity;
      tdPrice.textContent = price + ' $';
      tdName.textContent = product.name;
      tdID.textContent = product.id;
      tdInstock.textContent = instock;
      tdTotal.textContent = 0 + ' $';

      tdQuantity.appendChild(input);
      tdCancel.appendChild(imgDelete);
      tr.appendChild(tdID);
      tr.appendChild(tdName);
      tr.appendChild(tdQuantity);
      tr.appendChild(tdInstock);
      tr.appendChild(tdPrice);
      tr.appendChild(tdTotal);
      tr.appendChild(imgDelete);
      rightTable.appendChild(tr);

      input.addEventListener('input', function () {
        const newQuantityValue = parseInt(input.value);
        if (!isNaN(newQuantityValue)) {
          if (newQuantityValue > instock) {
            alert('The entered quantity exceeds the available stock!');
            input.value = instock;
          } else {
            const prevTotal = parseFloat(tdTotal.textContent.replace(' $', ''));
            const newTotal = price * newQuantityValue;
            tdTotal.textContent = newTotal + ' $';
            sumallTotal = sumallTotal - prevTotal + newTotal;
            newQuantity[product.id] = newQuantityValue;
          }
        }
        updateTotal(sumallTotal);
      });

      imgDelete.addEventListener('click', function (event) {
        deleteTableRow(event, tr);
      });
    });
  }
}

////////////////Update Total///////////////////
function updateTotal(total) {
  if (total !== undefined) {
    calculateTotal.textContent = total + ' $';
  }
  else {
    calculateTotal.textContent = 0 + ' $';
  }
}
/////////////////Delete Row///////////////
function deleteTableRow(event, row) {
  if (confirm("Are you sure you want to delete this item?")) {
    const productName = row.childNodes[0].textContent;
    const productIndex = categoriesData.cart.findIndex(product => product.name === productName);
    if (productIndex !== -1) {
      categoriesData.cart.splice(productIndex, 1);
      localStorage.setItem('productsData', JSON.stringify(categoriesData));
    }
    row.parentNode.removeChild(row);
    updateTotal();
  }
}

///////////Display Item///////////////////
function displayCartItems() {
  if (categoriesData && categoriesData.cart) {
    createTableFromCart();
  }
}
displayCartItems();

//////////////////Clear Form////////////////
function clearform() {
  categoriesData.cart = [];
  let dataFromLocalStorage = JSON.parse(localStorage.getItem('productsData'));
  if (dataFromLocalStorage) {
    dataFromLocalStorage.cart = [];
    localStorage.setItem('productsData', JSON.stringify(dataFromLocalStorage));
  }
  rightTable.innerHTML = '';
  sumallTotal = 0;
  updateTotal(sumallTotal);
  location.reload();
}
checkoutButton.addEventListener('click', checkOutAlert);

///////////Check Alert////////////////////////
function checkOutAlert(event) {
  event.preventDefault();
  let customerInput = document.getElementById('customer-name');
  const customerName = customerInput.value.trim();

  let orderDetails = '';
  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      const updatedQuantity = newQuantity[product.id] ? newQuantity[product.id] : product.quantity;
      orderDetails += `${product.name}  -  ${updatedQuantity}  x $${product.price}\n`;
    });
  }
  if (customerName !== '') {
    alert(`Customer Name: ${customerName}\nTotal: $${sumallTotal}\nOrder Details:\n${orderDetails}\nThank You for shopping with us.`);
    let productIds = categoriesData.cart.map(product => product.id);
    let CartsData = {
      ids: productIds,
      name: customerName,
      total: sumallTotal,
      details: orderDetails
    };
    arrOfProduct.order.push(CartsData);
    localStorage.setItem('productsData', JSON.stringify(arrOfProduct));
    clearform();
  } else {
    alert('Please enter your name before placing the order.');
  }
};

// /////////////////////////Create Card History//////////////////////////
function createCardCustomer() {
  for (let data of arrOfProduct.order) {
    let card = document.createElement('div');
    card.className = "card";
    let h2 = document.createElement("h2");
    h2.className = 'name';
    h2.textContent = "Customer name : " + data.name;
    let h2total = document.createElement('h2');
    h2total.className = 'total';
    h2total.textContent = "Total amount : $" + data.total;
    let detailProduct = document.createElement('p');
    detailProduct.textContent = data.details;
    card.appendChild(h2);
    card.appendChild(h2total);
    card.appendChild(detailProduct);
    mainCard.appendChild(card);
  }
}

createCardCustomer();
