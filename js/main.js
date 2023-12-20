let categoriesData = JSON.parse(localStorage.getItem('productsData'));

let productInstock = document.querySelector('.instock').lastElementChild;
let productSellOut = document.querySelector('.Sellout').lastElementChild;
let inCome = document.querySelector('.income').lastElementChild;
let Product = document.querySelector('.products').lastElementChild;
let Category = document.querySelector('.category').lastElementChild;

let instockProduct = categoriesData.product;
let selloutProduct = categoriesData.product;
console.log(selloutProduct);
let instock = 0;
let sellout = 0;
let incomes = 0;

///////////////Calculate Number Of Product/////////
function sumAllProduct() {
  for (let data of instockProduct) {
    instock += parseInt(data['quantity']) || 0;
  }
}

////////////////SumSellOut Product///////////////////
function sumSelloutProduct() {
  for (let data of selloutProduct) {
    sellout += parseInt(data['sellout']) || 0;
  }
}

/////////////////Display Number Product///////////////
function showTypeOfProduct() {
  Product.textContent = instockProduct.length;
}

/////////////////Display Number Category///////////////
function showCategory() {
  Category.textContent = categoriesData.categories.length;
}

/////////////////Show Sell Out/////////////////////////
function showSellout() {
  productSellOut.textContent = sellout;
}

/////////////////show Income////////////////////////////////
function showIncome (){
  let media = 0;
  for (let data of selloutProduct) {
    media = parseInt(data['sellout']) * (data['price']) || 0;
    console.log(media);
    incomes += media;
  }
  inCome.textContent = incomes + '    $';
}

///////////////////////display top 3 //////////////////////
function displayTopProducts() {
  selloutProduct.sort((a, b) => b.sellout - a.sellout);
  const tableBody = document.querySelector('#myTable tbody');
  for (let i = 0; i < 3 && i < selloutProduct.length; i++) {
    const product = selloutProduct[i];
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${product.price}  $</td>
      <td>${product.sellout}
      <td>${parseInt(product.sellout) *parseInt(product.price)} $</td>
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
