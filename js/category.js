let arrOfProducts = {
  product: [],
  categories: [],
  cart:[],
  order:[],
  sellout:[]
};

let topProduct = document.querySelector('.container');
let products = document.querySelector('.products');
let category = document.querySelector('.categoriesPage');
let order = document.querySelector('.orders');
let addProductbtn = document.querySelector('.addproduct');
let productTable = document.querySelector('#tableProduct');
let cancleBtn = document.querySelector('.btnCategory');
let tbodyProduct = document.getElementById('productsTbody');
let tbodyCategory = document.getElementById('tableCategory').lastElementChild;
let btnCreateCategory = document.getElementById('btnCategory');
let idCategory = document.getElementById('idCategory');
let nameCategory = document.getElementById('nameCategory');
let rows = document.querySelectorAll('#tableCategory tbody tr');
let categoriesData = JSON.parse(localStorage.getItem('productsData'));
let searchInput = document.getElementById('inputcate');

/////////////Save Product///////////////////////////
function saveProducts() {
  localStorage.setItem('productsData', JSON.stringify(arrOfProducts));
}

////////////////////Load Product//////////////////
function loadProducts() {
  let loadProducts = JSON.parse(localStorage.getItem('productsData'));
  if (loadProducts != null) {
    arrOfProducts = loadProducts;
  }
  else {
    saveProducts()
  }
}

////////////Create Category/////////////////////
function createCategory() {
  tbodyCategory.textContent = '';
  for (let i = 0; i < arrOfProducts.categories.length; i++) {
    let cate = arrOfProducts.categories[i];

    let tr = document.createElement('tr');
    let tdAction = document.createElement('td');
    let tdID = document.createElement('td');
    let tdName = document.createElement('td');
    let imgTrash = document.createElement('img');
    let imgEdit = document.createElement('img');
    let imgCheck = document.createElement('img');

    tdAction.setAttribute('class', 'td');
    imgTrash.src = "../image/trash.png";
    imgTrash.classList.add('delete-btn');
    imgEdit.src = "../image/1159633.png";
    imgEdit.classList.add('edit-btn');
    imgCheck.src = "../image/detail.png";
    tdID.textContent = cate.id;
    tdName.textContent = cate.names;

    tdAction.appendChild(imgTrash);
    tdAction.appendChild(imgEdit);
    tdAction.appendChild(imgCheck);
    tr.appendChild(tdID);
    tr.appendChild(tdName);
    tr.appendChild(tdAction);
    tbodyCategory.appendChild(tr);

    imgTrash.addEventListener('click', function () {
      if (confirm("Are you sure you want to delete this category?")) {
        deleteCategory(i);
      }
    });

    imgEdit.addEventListener('click', function () {
      editCategory(i);
    });
    imgCheck.addEventListener('click', function () {
      showProductCountInCategory(i);
    });
  }
}

function showProductCountInCategory(i) {
  let categoryToCount = productss[i];
  let productCount = 0;

  for (let product of arrOfProducts.product) {
    if (product.category === categoryToCount) {
      productCount++;
    }
  }
  alert(`Number of products in category ${categoryToCount}: ${productCount}`);
}

//////////////////Edit Category /////////////////////////
function editCategory(index) {
  const categoryToEdit = arrOfProducts.categories[index];
  idCategory.value = categoryToEdit.id;
  nameCategory.value = categoryToEdit.names;

  btnCreateCategory.removeEventListener('click', AddProduct);
  btnCreateCategory.textContent = 'Update';
  btnCreateCategory.addEventListener('click', function (event) {
    event.preventDefault();
    if (idCategory.value === '' || nameCategory.value === '') {
      alert('Please enter data in the form!');
      return;
    }
    arrOfProducts.categories[index].id = idCategory.value;
    arrOfProducts.categories[index].names = nameCategory.value;
    saveProducts();
    createCategory();
    idCategory.value = '';
    nameCategory.value = '';
    btnCreateCategory.textContent = 'Add Category';
    btnCreateCategory.removeEventListener('click', arguments.callee);
    btnCreateCategory.addEventListener('click', AddProduct);
  });
}

//////////////Delete Category ////////////////////////
function deleteCategory(index) {
  arrOfProducts.categories.splice(index, 1);
  saveProducts();
  createCategory();
}

/////////////Get Data To local Storage///////////////
function AddProduct(event) {
  if (idCategory.value === '' || nameCategory.value === '') {
    alert('Please enter data in form!')
    return;
  }
  let categoryMenu = {
    id: idCategory.value,
    names: nameCategory.value
  };
  arrOfProducts.categories.push(categoryMenu);
  saveProducts();
  createCategory();
  idCategory.value = '';
  nameCategory.value = '';
  event.preventDefault();
}

/////////////////Filter Category///////////////////////
function filterCategories(searchTerm) {
  if (arrOfProducts.categories.length > 0) {
    const categoriesArray = arrOfProducts.categories;
    for (let i = 0; i < categoriesArray.length; i++) {
      const category = categoriesArray[i];
      const tr = tbodyCategory.children[i];
      if (category.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        tr.style.display = '';
      } else {
        tr.style.display = 'none';
      }
    }
  }
}

searchInput.addEventListener('input', function (event) {
  const searchTerm = event.target.value.trim();
  filterCategories(searchTerm);
});
btnCreateCategory.addEventListener('click', AddProduct)
loadProducts();
createCategory();
