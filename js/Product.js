let arrOfProducts = {
    product: [],
    categories: [],
    cart: [],
    order: []
};

let addProductNews = document.querySelector('.addProduct');
let table = document.querySelector('#tableProduct');
let btnAddProduct = document.querySelector('.categoriesShow').firstElementChild;
let btnCancel = document.querySelector('.btn').firstElementChild;
let namesProduct = document.getElementById('name');
let pictureProduct = document.getElementById('picture');
let category = document.getElementById('optionOF');
let priceProduct = document.getElementById('price');
let quantityProduct = document.getElementById('quantity');
let total = document.getElementById('total');
let productsTbody = document.getElementById('productsTbody');
let btnPost = document.getElementById('btnPost');
const storedData = JSON.parse(localStorage.getItem('productsData'));
let allTr = document.querySelectorAll('#productsTbody tr');
let categoryProduct = document.getElementById('select');
let productss = storedData.categories;


if (storedData && storedData.product && Array.isArray(storedData.product)) {
    arrOfProducts.product = storedData.product;
}

function saveProducts() {
    localStorage.setItem('productsData', JSON.stringify(arrOfProducts));
}

function loadProducts() {
    let loadProducts = JSON.parse(localStorage.getItem('productsData'));
    if (loadProducts !== null) {
        arrOfProducts = loadProducts;
        updateSellout();
    } else {
        saveProducts();
    }
}

function show(element) {
    element.style.display = '';
}

function hide(element) {
    element.style.display = 'none';
}

function showForm() {
    show(addProductNews);
    hide(table);
}

function hideForm() {
    hide(addProductNews);
    show(table);
}
let selectElement = document.getElementById('optionOF');
let tableRows = productsTbody.getElementsByTagName('tr');
categoryProduct.innerHTML = '';
for (let category of productss) {
    const option = document.createElement('option');
    option.value = category['names'];
    option.textContent = category['names'];
    categoryProduct.appendChild(option);
}

selectElement.addEventListener('change', filterTableRows);

///////////////Filter TableRow////////////////////
function filterTableRows() {
    let selectedCategory = selectElement.value.toLowerCase();
    for (const row of tableRows) {
        let categoryCellText = row.firstElementChild.nextElementSibling.nextElementSibling.textContent.toLowerCase();
        if (selectedCategory !== 'all product') {
            if (categoryCellText === selectedCategory) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        } else {
            row.style.display = '';
        }
    }
}

//////////Create Product////////////////////
function createProduct() {
    productsTbody.textContent = "";
    for (let product of arrOfProducts.product) {
        let tr = document.createElement("tr");
        let tdProductName = document.createElement("td");
        let tdID = document.createElement("td");
        let tdCategory = document.createElement("td");
        let tdTotal = document.createElement("td");
        let tdPrice = document.createElement("td");
        let tdSold = document.createElement("td");
        let tdAction = document.createElement("td");
        let imgTrash = document.createElement('img');
        let imgEdit = document.createElement('img');
        let imgCheck = document.createElement('img');

        selectElement.textContent = '';
        const firstoption = document.createElement('option');
        firstoption.textContent = 'All Product';
        selectElement.appendChild(firstoption);
        for (let category of productss) {
            const option = document.createElement('option');
            option.value = category['names'];
            option.textContent = category['names'];
            selectElement.appendChild(option);
        }

        tdAction.setAttribute("class", "td");
        imgTrash.src = "../image/trash.png";
        imgEdit.src = "../image/1159633.png";
        imgCheck.src = "../image/book.png";
        tdSold.textContent = 0;
        tdProductName.textContent = product.name;
        tdCategory.textContent = product.category;
        tdTotal.textContent = product.quantity;
        tdPrice.textContent = product.price + '  $';
        tdID.textContent = product.id;

        const orderIds = arrOfProducts.order.map(order => order.ids).flat();
        if (orderIds.includes(product.id)) {
            let soldQuantity = arrOfProducts.order
                .filter(order => order.ids.includes(product.id))
                .reduce((acc, order) => acc + parseInt(order.total), 0);
            let totalSold = Math.floor(parseInt(soldQuantity) / parseInt(product.price));
            tdSold.textContent = totalSold;
        } else {
            tdSold.textContent = 0;
        }

        imgCheck.addEventListener('click', function () {
            if (confirm('Are you sure to add it to cart?')) {
                addToCart(product);
            }
        });
        imgTrash.onclick = function () {
            if (confirm("Are you sure you want to delete this category?")) {
                deleteProduct(product.id);
            }
        };
        imgEdit.onclick = function () {
            showForm();
            editProduct(product.id);
        };
        tdAction.appendChild(imgTrash);
        tdAction.appendChild(imgEdit);
        tdAction.appendChild(imgCheck);
        tr.appendChild(tdID);
        tr.appendChild(tdProductName);
        tr.appendChild(tdCategory);
        tr.appendChild(tdTotal);
        tr.appendChild(tdSold);
        tr.appendChild(tdPrice);
        tr.appendChild(tdAction);

        productsTbody.appendChild(tr);
    }
}

//////////Delete Product//////////
function deleteProduct(productId) {
    arrOfProducts.product = arrOfProducts.product.filter(product => product.id !== productId);
    saveProducts();
    createProduct();
}

////////////Add To Cart////////////
function addToCart(product) {
    const existingProduct = arrOfProducts.cart.find(item => item.id === product.id);
    if (existingProduct) {
        alert('This product is already in the cart!');
        return;
    }
    else {
        arrOfProducts.cart.push(product);
        saveProducts();
    }
}

///////////////Edit Product////////////
function editProduct(productId) {
    const index = arrOfProducts.product.findIndex(product => product.id === productId);

    if (index === -1) {
        return;
    }

    const productToEdit = arrOfProducts.product[index];
    pictureProduct.value = productToEdit.id;
    priceProduct.value = productToEdit.price;
    quantityProduct.value = productToEdit.quantity;
    categoryProduct.value = productToEdit.category;
    namesProduct.value = productToEdit.name;

    // Update button text and attach event listener for updating the product
    btnPost.textContent = 'Update';
    btnPost.removeEventListener('click', addProduct);
    btnPost.addEventListener('click', updateProduct);
}

///////////Update Product////////////
function updateProduct(event) {
    event.preventDefault();
    const productIdToUpdate = pictureProduct.value;

    const index = arrOfProducts.product.findIndex(product => product.id === productIdToUpdate);

    if (index === -1) {
        return;
    }

    if (
        namesProduct.value === '' ||
        pictureProduct.value === '' ||
        quantityProduct.value === '' ||
        priceProduct.value === ''
    ) {
        alert('Please enter data in the form!');
        return;
    }

    // Update the product details in the array
    arrOfProducts.product[index].id = pictureProduct.value;
    arrOfProducts.product[index].price = priceProduct.value;
    arrOfProducts.product[index].quantity = quantityProduct.value;
    arrOfProducts.product[index].category = categoryProduct.value;
    arrOfProducts.product[index].name = namesProduct.value;

    saveProducts();
    createProduct();
    // Reset form fields and button text after update
    pictureProduct.value = '';
    priceProduct.value = '';
    quantityProduct.value = '';
    categoryProduct.value = '';
    namesProduct.value = '';

    btnPost.textContent = 'Post';
    btnPost.removeEventListener('click', updateProduct);
    btnPost.addEventListener('click', addProduct);

    hideForm();
}
//////////////////Add Data to LocalStorage/////////////////
function addProduct(event) {
    if (namesProduct.value === '' || pictureProduct.value === '' || quantityProduct.value === '' || priceProduct.value === '') {
        alert('Please enter data in form!');
        return;
    }

    // Create a new product using the input values
    let product = {
        name: namesProduct.value,
        id: pictureProduct.value,
        price: priceProduct.value,
        quantity: quantityProduct.value,
        category: categoryProduct.value,
        sellout: 0
    };

    arrOfProducts.product.push(product);
    saveProducts();
    updateSellout(); // Update 'sellout' values after adding a new product
    createProduct();

    namesProduct.value = "";
    pictureProduct.value = "";
    priceProduct.value = "";
    quantityProduct.value = "";
    categoryProduct.value = "";

    hideForm();
    event.preventDefault();
}

//////////////Update Sellout/////////////////
function updateSellout() {
    for (let product of arrOfProducts.product) {
        const orderIds = arrOfProducts.order.map(order => order.ids).flat();
        if (orderIds.includes(product.id)) {
            const soldQuantity = arrOfProducts.order
                .filter(order => order.ids.includes(product.id))
                .reduce((acc, order) => acc + parseInt(order.total), 0);
            const totalSold = Math.floor(soldQuantity / product.price);
            product.sellout = totalSold;
        } else {
            product.sellout = 0;
        }
    }
    saveProducts();
}

btnAddProduct.addEventListener("click", showForm);
btnCancel.addEventListener("click", hideForm);
btnPost.addEventListener("click", addProduct);

loadProducts();
createProduct();
