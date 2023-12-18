// Define the initial data structure
let arrOfProducts = {
  product: [],
  categories: [],
  cart:[],
  order:[]
};

// Retrieve data from localStorage
let categoriesData = JSON.parse(localStorage.getItem('productsData'));

// Select necessary elements
const calculateTotal = document.querySelector('.tot');
const leftTable = document.getElementById('leftTable');
const rightTable = document.getElementById('rightTable');
let sumallTotal = 0;

// Function to display all products in the left table
function displayAllProducts() {
  leftTable.innerHTML = '';

  if (categoriesData && categoriesData.cart) {
    const productsArray = categoriesData.cart;

    productsArray.forEach(product => {
      // Create table row and cells for each product
      let tr = document.createElement('tr');
      let tdID = document.createElement('td');
      let tdName = document.createElement('td');
      let tdCatego = document.createElement('td');
      let tdQuantity = document.createElement('td');
      let tdPrice = document.createElement('td');
      let addToCartBtn = document.createElement('button');
      addToCartBtn.className = 'btn-addtocart';
      addToCartBtn.textContent = 'Cart';
      let tdAction = document.createElement('td');

      // Populate cell contents with product data
      tdID.textContent = product.id;
      tdName.textContent = product.name;
      tdCatego.textContent = product.category;
      tdQuantity.textContent = product.quantity;
      tdPrice.textContent = product.price + ' $';

      // Add event listener for 'Add to Cart' button
      addToCartBtn.addEventListener('click', function () {
        addToCart(product);
      });

      // Construct the table structure
      tdAction.appendChild(addToCartBtn);
      tr.appendChild(tdID);
      tr.appendChild(tdName);
      tr.appendChild(tdQuantity);
      tr.appendChild(tdCatego);
      tr.appendChild(tdPrice);
      tr.appendChild(tdAction);

      leftTable.appendChild(tr);
    });
  }
}
displayAllProducts();

// Function to add a product to the cart
function addToCart(product) {
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
  imgDelete.addEventListener('click', deleteTableRow)
}

// Function to update the total price displayed
function updateTotal(total) {
  calculateTotal.textContent =  total + ' $';
}

// Function to handle deletion of a row
function deleteTableRow(event) {
  const rowToDelete = event.target.parentNode;
  if (confirm("Are you sure you want to delete this item?")) {
    rowToDelete.parentNode.removeChild(rowToDelete);
    updateTotal();
  }
}

// Function to show order details
function showOrderDetails(customerName) {
  const orderDetails = document.createElement('div');
  orderDetails.id = 'orderDetails';

  const customerHeading = document.createElement('h3');
  customerHeading.textContent = `Customer Name: ${customerName}`;
  
  const orderHeading = document.createElement('h3');
  orderHeading.textContent = 'Order Details';

  const itemsList = document.createElement('ul');

  if (categoriesData && categoriesData.cart) {
    categoriesData.cart.forEach(product => {
      const listItem = document.createElement('li');
      listItem.textContent = `${product.name} - ${product.quantity} x $${product.price}`;
      itemsList.appendChild(listItem);
    });
  }

  const total = document.createElement('p');
  total.textContent = `Total: $${sumallTotal}`;

  orderDetails.appendChild(customerHeading);
  orderDetails.appendChild(orderHeading);
  orderDetails.appendChild(itemsList);
  orderDetails.appendChild(total);

  document.body.appendChild(orderDetails);
}

// Function to display the checkout form
function showCheckoutForm() {
  const checkoutForm = document.createElement('form');
  checkoutForm.id = 'checkoutForm';

  const heading = document.createElement('h2');
  heading.textContent = 'Checkout';

  const customerGroup = document.createElement('div');
  customerGroup.className = 'form-group';
  const customerLabel = document.createElement('label');
  customerLabel.setAttribute('for', 'customerName');
  customerLabel.textContent = 'Customer Name:';
  const customerInput = document.createElement('input');
  customerInput.setAttribute('type', 'text');
  customerInput.setAttribute('id', 'customerName');
  customerInput.setAttribute('name', 'customerName');
  customerInput.setAttribute('required', 'true');
  customerGroup.appendChild(customerLabel);
  customerGroup.appendChild(customerInput);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Place Order';

  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    const customerName = customerInput.value.trim();
    if (customerName !== '') {
      alert(`Customer Name: ${customerName}\nTotal: $${sumallTotal}`);
      showOrderDetails(customerName);
      clearform();
    } else {
      alert('Please enter your name before placing the order.');
    }
  });

  checkoutForm.appendChild(heading);
  checkoutForm.appendChild(customerGroup);
  checkoutForm.appendChild(submitButton);

  document.body.appendChild(checkoutForm);
}

// Function to place an order
function placeOrder(customerName) {
  alert(`Your order has been placed! Total: $${sumallTotal}. Thank You for shopping with us.`);
  showOrderDetails(customerName);
  clearform();
}

// Function to clear the form after placing an order
function clearform() {
  categoriesData.cart = [];
  localStorage.setItem('productsData', JSON.stringify(categoriesData));
  displayAllProducts();
  updateTotal(0);
}

// Event listener for the checkout button
const checkoutButton = document.querySelector('.onright').lastElementChild;
checkoutButton.addEventListener('click', showCheckoutForm);
