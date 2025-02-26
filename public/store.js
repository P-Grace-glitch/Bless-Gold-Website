// Data storage
let products = [];
let nextId = 1;

// Function to add a product
function addProduct(name, description, price, image) {
  const product = {
    id: nextId,
    name,
    description,
    price,
    image,
  };
  products.push(product);
  nextId++;
  return product;
}

// Function to get all products
function getProducts() {
  return products;
}

// Function to get a product by ID
function getProductById(id) {
  return products.find((product) => product.id === id);
}

// Function to update a product
function updateProduct(id, name, description, price, image) {
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex !== -1) {
    products[productIndex] = {
      id,
      name,
      description,
      price,
      image,
    };
    return products[productIndex];
  } else {
    return null;
  }
}

// Function to delete a product
function deleteProduct(id) {
  const productIndex = products.findIndex((product) => product.id === id);
  if (productIndex !== -1) {
    products.splice(productIndex, 1);
    return true;
  } else {
    return false;
  }
}

// Example usage
const product1 = addProduct('Product 1', 'Description 1', 10.99, 'image1.jpg');
const product2 = addProduct('Product 2', 'Description 2', 9.99, 'image2.jpg');

console.log(getProducts());

const updatedProduct = updateProduct(product1.id, 'Updated Product 1', 'Updated Description 1', 11.99, 'updated-image1.jpg');
console.log(updatedProduct);

const deleted = deleteProduct(product2.id);
console.log(deleted);