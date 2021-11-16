const fs = require('fs');
const path = require('path');

const productsFilePath = path.resolve(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const lastId = () => {
	let ultimo = 0;
	products.forEach(product => {
		if(product.id > ultimo){
			ultimo = product.id;
		}
	});

	return ultimo +1
}

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic
		res.render('products', {products})
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic
		let id = req.params.id;
		let product = products.filter(product => product.id == id)[0];
		let price = {
			full: toThousand(product.price),
			discont: toThousand(Math.round(product.price * (1-product.discount / 100)))
		}

		// return res.send (product)
		res.render('detail', {product, price});
		
	},

	// Create - Form to create
	create: (req, res) => { 
		// Do the magic
		res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		// Do the magic
			
		let id = newId()
			// Logica de creado
			const file = req.file;

		
		let product = {}
		//Guardar producto en el array de productos (push)
		if(!file){
			product = {
				id: id,
				...req.body,
				image: 'default-image.png'
			}	
		} else {
			product = {
				id: id,
				...req.body,
				image: req.file.filename
			}

		}

		products.push(product);
		
		let jsonProducts = JSON.stringify(products, null, 4);
		fs.writeFileSync(productsFilePath, jsonProducts)
		
		res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		let id = req.params.id;
		let productToEdit = products.filter(product => product.id == id)[0];
		res.render('product-edit-form', {productToEdit})
	},

	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		let id = req.params.id;
		let productToEdit = products.filter(product => product.id == id)[0]
		let productsUpdated = products.filter (product => product.id != id)

		let imageNew = productToEdit.image;

		if(file){
			imageNew = req.file.filename;
		}

		let product = {
			id: productToEdit.id,
			...req.body,
			image: imageNew,
		}
		productsUpdated.push(product)

		let jsonProducts = JSON.stringify(productsUpdated, null, 4);
		fs.writeFileSync(productsFilePath, jsonProducts)

		res.redirect('/products/${id}')
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		// Do the magic
		let id = req.params.id;
		let productsUpdated = products.filter(product => product.id != id)

		let jsonProducts = JSON.stringify(productsUpdated, null, 4);
		fs.writeFileSync(productsFilePath, jsonProducts)
		
		res.redirect('/')
	}
};

module.exports = controller;