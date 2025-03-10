const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Specify the static directory
const staticDir = path.join(__dirname, 'public');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticDir));
app.use(cors());

let products = [];

// Serve admin.html
app.get('/', (req, res) => {
    res.sendFile(path.join(staticDir, 'admin.html'));
});

// Serve shopcart.html
app.get('/shopcart', (req, res) => {
    res.sendFile(path.join(staticDir, 'shopcart.html'));
});

// Get all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Post a new product
app.post('/api/products', upload.single('image'), (req, res) => {
    try {
        const product = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            image: req.file.filename,
        };
        products.push(product);
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get a single product by index
app.get('/api/products/:index', (req, res) => {
    try {
        const index = req.params.index;
        if (index >= 0 && index < products.length) {
            res.json(products[index]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a product
app.put('/api/products/:index', upload.single('image'), (req, res) => {
    try {
        const index = req.params.index;
        if (index >= 0 && index < products.length) {
            const product = {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                image: req.file ? req.file.filename : products[index].image,
            };
            products[index] = product;
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a product
app.delete('/api/products/:index', (req, res) => {
    try {
        const index = req.params.index;
        if (index >= 0 && index < products.length) {
            products.splice(index, 1);
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Serve images
app.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ message: 'Image not found' });
    }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});