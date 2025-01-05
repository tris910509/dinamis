const renderProducts = async () => {
  const response = await fetch('http://localhost:3000/products');
  const products = await response.json();
  const categories = await fetch('http://localhost:3000/categories').then(res => res.json());
  const suppliers = await fetch('http://localhost:3000/suppliers').then(res => res.json());

  let html = `
    <button class="btn btn-primary mb-3" onclick="addProduct()">Add Product</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Category</th>
          <th>Supplier</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${products.map(product => `
          <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${categories.find(c => c.id === product.category_id)?.name}</td>
            <td>${suppliers.find(s => s.id === product.supplier_id)?.name}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editProduct(${product.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('products').innerHTML = html;
};

const addProduct = async () => {
  const name = prompt('Enter product name:');
  const category_id = parseInt(prompt('Enter category ID:'));
  const supplier_id = parseInt(prompt('Enter supplier ID:'));
  const price = parseFloat(prompt('Enter price:'));
  const stock = parseInt(prompt('Enter stock:'));

  const newProduct = { name, category_id, supplier_id, price, stock };
  await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct)
  });

  alert('Product added!');
  renderProducts();
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
    alert('Product deleted!');
    renderProducts();
  }
};

document.addEventListener('DOMContentLoaded', renderProducts);

const renderCategories = async () => {
  const response = await fetch('http://localhost:3000/categories');
  const categories = await response.json();

  let html = `
    <button class="btn btn-primary mb-3" onclick="addCategory()">Add Category</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${categories.map(category => `
          <tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editCategory(${category.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCategory(${category.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('categories').innerHTML = html;
};


const addCategory = async () => {
  const name = prompt('Enter category name:');
  if (!name) return alert('Category name is required.');

  const newCategory = { name };
  await fetch('http://localhost:3000/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCategory)
  });

  alert('Category added!');
  renderCategories();
};

const editCategory = async (id) => {
  const name = prompt('Enter new category name:');
  if (!name) return alert('Category name is required.');

  await fetch(`http://localhost:3000/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });

  alert('Category updated!');
  renderCategories();
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await fetch(`http://localhost:3000/categories/${id}`, { method: 'DELETE' });
    alert('Category deleted!');
    renderCategories();
  }
};


const renderSuppliers = async () => {
  const response = await fetch('http://localhost:3000/suppliers');
  const suppliers = await response.json();

  let html = `
    <button class="btn btn-primary mb-3" onclick="addSupplier()">Add Supplier</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Contact</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${suppliers.map(supplier => `
          <tr>
            <td>${supplier.id}</td>
            <td>${supplier.name}</td>
            <td>${supplier.contact}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="editSupplier(${supplier.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteSupplier(${supplier.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('suppliers').innerHTML = html;
};


const addSupplier = async () => {
  const name = prompt('Enter supplier name:');
  const contact = prompt('Enter supplier contact:');
  if (!name || !contact) return alert('All fields are required.');

  const newSupplier = { name, contact };
  await fetch('http://localhost:3000/suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSupplier)
  });

  alert('Supplier added!');
  renderSuppliers();
};

const editSupplier = async (id) => {
  const name = prompt('Enter new supplier name:');
  const contact = prompt('Enter new supplier contact:');
  if (!name || !contact) return alert('All fields are required.');

  await fetch(`http://localhost:3000/suppliers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, contact })
  });

  alert('Supplier updated!');
  renderSuppliers();
};

const deleteSupplier = async (id) => {
  if (confirm('Are you sure you want to delete this supplier?')) {
    await fetch(`http://localhost:3000/suppliers/${id}`, { method: 'DELETE' });
    alert('Supplier deleted!');
    renderSuppliers();
  }
};



const renderTransactions = async () => {
  const response = await fetch('http://localhost:3000/transactions');
  const transactions = await response.json();
  const products = await fetch('http://localhost:3000/products').then(res => res.json());

  let html = `
    <button class="btn btn-primary mb-3" onclick="addTransaction()">Add Transaction</button>
    <table class="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(transaction => `
          <tr>
            <td>${transaction.id}</td>
            <td>${products.find(p => p.id === transaction.product_id)?.name}</td>
            <td>${transaction.quantity}</td>
            <td>${transaction.total}</td>
            <td>${transaction.date}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="deleteTransaction(${transaction.id})">Delete</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  document.getElementById('transactions').innerHTML = html;
};


const addTransaction = async () => {
  const product_id = parseInt(prompt('Enter product ID:'));
  const quantity = parseInt(prompt('Enter quantity:'));
  const products = await fetch('http://localhost:3000/products').then(res => res.json());
  const product = products.find(p => p.id === product_id);

  if (!product) return alert('Invalid product ID.');
  if (quantity > product.stock) return alert('Insufficient stock.');

  const total = product.price * quantity;
  const date = new Date().toISOString().split('T')[0];
  const newTransaction = { product_id, quantity, total, date };

  await fetch('http://localhost:3000/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newTransaction)
  });

  // Update stock
  await fetch(`http://localhost:3000/products/${product_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...product, stock: product.stock - quantity })
  });

  alert('Transaction added!');
  renderTransactions();
};

const deleteTransaction = async (id) => {
  if (confirm('Are you sure you want to delete this transaction?')) {
    await fetch(`http://localhost:3000/transactions/${id}`, { method: 'DELETE' });
    alert('Transaction deleted!');
    renderTransactions();
  }
};


const renderReports = async () => {
  // Fetch data transaksi
  const transactions = await fetch('http://localhost:3000/transactions').then(res => res.json());

  // Hitung total transaksi dan total pendapatan
  const totalTransactions = transactions.length;
  const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.total, 0);

  // Tampilkan laporan
  const html = `
    <h3>Transaction Summary</h3>
    <ul class="list-group">
      <li class="list-group-item">Total Transactions: <strong>${totalTransactions}</strong></li>
      <li class="list-group-item">Total Revenue: <strong>$${totalRevenue.toFixed(2)}</strong></li>
    </ul>
    <h4 class="mt-4">Transaction Details</h4>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product ID</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${transactions.map(transaction => `
          <tr>
            <td>${transaction.id}</td>
            <td>${transaction.product_id}</td>
            <td>${transaction.quantity}</td>
            <td>$${transaction.total.toFixed(2)}</td>
            <td>${transaction.date}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  document.getElementById('reports').innerHTML = html;
};



document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderCategories();
  renderSuppliers();
  renderTransactions();
  renderReports(); // Panggil fungsi untuk menampilkan laporan
});

