// Retrieve data from local storage
let categoriesData = JSON.parse(localStorage.getItem('productsData'));

// Query selectors for elements in your HTML
let productInstock = document.querySelector('.instock').lastElementChild;
let productSellOut = document.querySelector('.Sellout').lastElementChild;
let inCome = document.querySelector('.income').lastElementChild;
let Product = document.querySelector('.products').lastElementChild;
let Category = document.querySelector('.category').lastElementChild;

// Retrieve products and sellout data from categoriesData or set defaults to empty arrays
let instockProduct = categoriesData && categoriesData.product ? categoriesData.product : [];
let selloutProduct = categoriesData.product;
console.log(selloutProduct);
// Initialize variables for quantity in stock and sellout
let instock = 0;
let sellout = 0;
let incomes = 0;

// Function to calculate total quantity in stock
function sumAllProduct() {
  for (let data of instockProduct) {
    instock += parseInt(data['quantity']) || 0;
  }
}

// Function to calculate total sellout quantity
function sumSelloutProduct() {
  for (let data of selloutProduct) {
    sellout += parseInt(data['sellout']) || 0;
  }
}

// Function to display total number of product types
function showTypeOfProduct() {
  Product.textContent = instockProduct.length;
}

// Function to display the number of categories
function showCategory() {
  Category.textContent = categoriesData && categoriesData.categories ? categoriesData.categories.length : 0;
}

// Function to display total sellout quantity
function showSellout() {
  productSellOut.textContent = sellout;
}

function showIncome (){
  let media = 0;
  for (let data of selloutProduct) {
    media = parseInt(data['sellout']) * (data['price']) || 0;
    console.log(media);
    incomes += media;
  }
  inCome.textContent = incomes + '    $';
}

// Function to display top 3 products in a table
function displayTopProducts() {
  selloutProduct.sort((a, b) => b.sellout - a.sellout); // Sort products by sellout quantity

  const tableBody = document.querySelector('#myTable tbody');

  for (let i = 0; i < 3 && i < selloutProduct.length; i++) {
    const product = selloutProduct[i];

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.price}  $</td>
      <td>${product.sellout}</td>
    `;

    tableBody.appendChild(row);
  }
}

showCategory();
showTypeOfProduct();
sumAllProduct();
sumSelloutProduct();
productInstock.textContent = instock;
showSellout();
showIncome();
displayTopProducts(); 
