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
