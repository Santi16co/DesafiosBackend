const fs = require('fs');
let products = [];

class ProductManager {
  constructor(path) {
    this.path = path;
    this.loadProducts();
  }

  generateId() {
    return products.length + 1;
  }

  loadProducts() {
    fs.readFile(this.path, 'utf8', (err, data) => {
        if (err) {
          console.error('Error al leer los productos:', err);
        } else {
          if (data.length === 0) {
            products = [];
          } else {
            products = JSON.parse(data);
          }
          console.log('Producto cargado con exito.');
        }
      });
  }

  saveProducts() {
    try {
      const productData = JSON.stringify(products, null, 2);
      fs.writeFileSync(this.path, productData);
    } catch (err) {
      console.error('Error al guardar el producto:', err);
    }
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      id: this.generateId()
    };

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      return console.error('Debes rellenar todos los campos');
    }

    const productAlreadyExists = products.find(p => p.code === code);

    if (productAlreadyExists) {
      return console.error('Ya existe un producto con ese código.');
    }

    products.push(newProduct);
    this.saveProducts();

    console.log('Producto exitosamente guardado.');
  }

  getProducts() {
    console.log(products);
  }

  getProductsById(id) {
    if (id === undefined) {
      return console.error('Debes ingresar un ID');
    }

    const product = products.find(p => p.id === id);

    if (product) {
      console.log('Producto encontrado:', product);
    } else {
      console.error('No hay productos asociados con ese ID.');
    }
  }

  updateProduct(id, updatedProduct) {
    const productIndex = products.findIndex(p => p.id === id);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedProduct };
      this.saveProducts();
      console.log('Producto actualizado exitosamente.');
    } else {
      console.error('No hay productos asociados a ese ID.');
    }
  }

  deleteProduct(id) {
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length < initialLength) {
      this.saveProducts();
      console.log('Producto eliminado exitosamente.');
    } else {
      console.error('No hay productos asociados a ese ID.');
    }
  }
}

let productManager = new ProductManager('Productos.json');

productManager.getProducts();

productManager.addProduct('producto prueba1', 'Este es un producto prueba1', 200, 'test.jpg', 'abc123', 25);
productManager.addProduct('producto prueba2', 'Este es un producto prueba2', 200, 'test.jpg', 'abc321', 18);
productManager.addProduct('producto prueba3', 'Este es un producto prueba3', 300, 'test.jpg', 'xyz123', 30);
productManager.addProduct('producto prueba4', 'Este es un producto prueba4', 400, 'test.jpg', 'xyz321', 10);

console.log('Mostramos todos los productos...');
productManager.getProducts();

console.log('Obtenemos producto con id 1...');
productManager.getProductsById(1);

// Actualizo un producto
productManager.updateProduct(2, {
  title: 'Producto 2 Actualizado',
  price: 250,
  stock: 15
});

console.log('Mostramos todos los productos...');
productManager.getProducts();

// Borro el producto con Id 1
productManager.deleteProduct(1);

console.log('Mostramos todos los productos...');
productManager.getProducts();