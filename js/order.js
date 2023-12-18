// Retrieve data from localStorage
let categoriesData = JSON.parse(localStorage.getItem('productsData'));

// Select necessary elements
const calculateTotal = document.querySelector('.tot');
const rightTable = document.getElementById('rightTable');
let sumallTotal = 0;

function createTableFromCart() {
  rightTable.textContent= '';
  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      let instock = product.quantity;
      let price = product.price;

      let tr = document.createElement('tr');
      let tdName = document.createElement('td');
      let tdQuantity = document.createElement('td');
      let tdInstock = document.createElement('td');
      let tdPrice = document.createElement('td');
      let tdCancel = document.createElement('td');
      let tdTotal = document.createElement('td');
      let imgDelete = document.createElement('img');

      imgDelete.src = "../image/trash.png";
      imgDelete.setAttribute('class', 'td');
      let input = document.createElement('input');
      input.setAttribute('type', 'number');
      input.className = 'input';
      tdPrice.textContent = price + ' $';
      tdName.textContent = product.name;
      tdInstock.textContent = instock;
      tdTotal.textContent = 0 + ' $';
      tdQuantity.appendChild(input);
      tdCancel.appendChild(imgDelete);

      tr.appendChild(tdName);
      tr.appendChild(tdQuantity);
      tr.appendChild(tdInstock);
      tr.appendChild(tdPrice);
      tr.appendChild(tdTotal);
      tr.appendChild(imgDelete);
      rightTable.appendChild(tr);

      input.addEventListener('input', function () {
        const newQuantity = parseInt(input.value);
        if (!isNaN(newQuantity)) {
          if (newQuantity > instock) {
            alert('The entered quantity exceeds the available stock!');
            input.value = instock;
          } else {
            const prevTotal = parseFloat(tdTotal.textContent.replace(' $', ''));
            const newTotal = price * newQuantity;
            tdTotal.textContent = newTotal + ' $';
            sumallTotal = sumallTotal - prevTotal + newTotal;
          }
        }
        updateTotal(sumallTotal);
      });
      imgDelete.addEventListener('click', function(event) {
        deleteTableRow(event, tr);
      });
    });
  }
}

function updateTotal(total) {
  calculateTotal.textContent = total + ' $';
}

function deleteTableRow(event, row) {
  if (confirm("Are you sure you want to delete this item?")) {
    // Find the index of the product in the cart
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

function displayCartItems() {
  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      createTableFromCart(product);
    });
  }
}

displayCartItems();

// Other functions such as getOrderDetails, showOrderDetails, placeOrder, clearform remain unchanged...
function getOrderDetails() {
  let orderDetails = '';
  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      orderDetails += `${product.name} - ${product.quantity} x $${product.price}\n`;
    });
  }
  return orderDetails;
}
function clearform() {
  categoriesData.cart = [];
  localStorage.setItem('productsData', JSON.stringify(categoriesData)); // Update localStorage data
  rightTable.innerHTML = ''; // Clear the table content
  sumallTotal = 0;
  updateTotal(sumallTotal);
  location.reload();
}
// Event listener for the checkout button
const checkoutButton = document.querySelector('.onright').lastElementChild;
checkoutButton.addEventListener('click', function (event) {
  event.preventDefault();
  let customerInput = document.getElementById('customer-name');
  const customerName = customerInput.value.trim();
  if (customerName !== '') {
    const orderDetails = getOrderDetails();
    alert(`Customer Name: ${customerName}\nTotal: $${sumallTotal}\nOrder Details:\n${orderDetails}\nThank You for shopping with us.`);
    clearform();
  } else {
    alert('Please enter your name before placing the order.');
  }
});