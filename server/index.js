// import express from 'express';
// import cors from 'cors';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import dotenv from 'dotenv';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { v4 as uuidv4 } from 'uuid';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 5000;
// const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Data file paths
// const dataDir = path.join(__dirname, 'data');
// const usersFile = path.join(dataDir, 'users.json');
// const productsFile = path.join(dataDir, 'products.json');
// const ordersFile = path.join(dataDir, 'orders.json');
// const cartsFile = path.join(dataDir, 'carts.json');

// // Ensure data directory exists
// if (!fs.existsSync(dataDir)) {
//   fs.mkdirSync(dataDir, { recursive: true });
// }

// // Initialize data files
// const initDataFiles = () => {
//   if (!fs.existsSync(usersFile)) {
//     fs.writeFileSync(usersFile, JSON.stringify([]));
//   }
//   if (!fs.existsSync(productsFile)) {
//     const initialProducts = [
//       {
//         id: uuidv4(),
//         name: 'Fresh Bananas',
//         description: 'Sweet and ripe bananas, perfect for snacking',
//         price: 2.99,
//         category: 'Fruits',
//         stock: 50,
//         image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: uuidv4(),
//         name: 'Organic Apples',
//         description: 'Crisp and juicy organic apples',
//         price: 4.99,
//         category: 'Fruits',
//         stock: 30,
//         image: 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: uuidv4(),
//         name: 'Fresh Carrots',
//         description: 'Crunchy orange carrots, great for cooking',
//         price: 1.99,
//         category: 'Vegetables',
//         stock: 40,
//         image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: uuidv4(),
//         name: 'Whole Milk',
//         description: 'Fresh whole milk, 1 gallon',
//         price: 3.49,
//         category: 'Dairy',
//         stock: 25,
//         image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: uuidv4(),
//         name: 'Whole Wheat Bread',
//         description: 'Nutritious whole wheat bread loaf',
//         price: 2.49,
//         category: 'Bakery',
//         stock: 20,
//         image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       },
//       {
//         id: uuidv4(),
//         name: 'Greek Yogurt',
//         description: 'Creamy Greek yogurt, 32oz container',
//         price: 4.99,
//         category: 'Dairy',
//         stock: 15,
//         image: 'https://images.pexels.com/photos/1324803/pexels-photo-1324803.jpeg?auto=compress&cs=tinysrgb&w=500',
//         createdAt: new Date().toISOString()
//       }
//     ];
//     fs.writeFileSync(productsFile, JSON.stringify(initialProducts, null, 2));
//   }
//   if (!fs.existsSync(ordersFile)) {
//     fs.writeFileSync(ordersFile, JSON.stringify([]));
//   }
//   if (!fs.existsSync(cartsFile)) {
//     fs.writeFileSync(cartsFile, JSON.stringify([]));
//   }
// };

// initDataFiles();

// // Helper functions
// const readFile = (filePath) => {
//   try {
//     const data = fs.readFileSync(filePath, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     return [];
//   }
// };

// const writeFile = (filePath, data) => {
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// };

// // Auth middleware
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token required' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.user = user;
//     next();
//   });
// };

// // Admin middleware
// const requireAdmin = (req, res, next) => {
//   if (req.user.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // Routes

// // Auth routes
// app.post('/api/auth/register', async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const users = readFile(usersFile);
    
//     if (users.find(user => user.email === email)) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//       id: uuidv4(),
//       name,
//       email,
//       password: hashedPassword,
//       role: email === 'admin@grocery.com' ? 'admin' : 'user',
//       createdAt: new Date().toISOString()
//     };

//     users.push(newUser);
//     writeFile(usersFile, users);

//     const token = jwt.sign(
//       { id: newUser.id, email: newUser.email, role: newUser.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.status(201).json({
//       message: 'User registered successfully',
//       token,
//       user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/auth/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ message: 'Email and password are required' });
//     }

//     const users = readFile(usersFile);
//     const user = users.find(u => u.email === email);

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign(
//       { id: user.id, email: user.email, role: user.role },
//       JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     res.json({
//       message: 'Login successful',
//       token,
//       user: { id: user.id, name: user.name, email: user.email, role: user.role }
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Product routes
// app.get('/api/products', (req, res) => {
//   try {
//     const products = readFile(productsFile);
//     const { category, search } = req.query;
    
//     let filteredProducts = products;
    
//     if (category) {
//       filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === category.toLowerCase());
//     }
    
//     if (search) {
//       filteredProducts = filteredProducts.filter(p => 
//         p.name.toLowerCase().includes(search.toLowerCase()) ||
//         p.description.toLowerCase().includes(search.toLowerCase())
//       );
//     }
    
//     res.json(filteredProducts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.get('/api/products/:id', (req, res) => {
//   try {
//     const products = readFile(productsFile);
//     const product = products.find(p => p.id === req.params.id);
    
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/products', authenticateToken, requireAdmin, (req, res) => {
//   try {
//     const { name, description, price, category, stock, image } = req.body;
    
//     if (!name || !description || !price || !category || !stock) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const products = readFile(productsFile);
//     const newProduct = {
//       id: uuidv4(),
//       name,
//       description,
//       price: parseFloat(price),
//       category,
//       stock: parseInt(stock),
//       image: image || 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=500',
//       createdAt: new Date().toISOString()
//     };

//     products.push(newProduct);
//     writeFile(productsFile, products);

//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.put('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
//   try {
//     const { name, description, price, category, stock, image } = req.body;
//     const products = readFile(productsFile);
//     const productIndex = products.findIndex(p => p.id === req.params.id);
    
//     if (productIndex === -1) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     products[productIndex] = {
//       ...products[productIndex],
//       name: name || products[productIndex].name,
//       description: description || products[productIndex].description,
//       price: price ? parseFloat(price) : products[productIndex].price,
//       category: category || products[productIndex].category,
//       stock: stock ? parseInt(stock) : products[productIndex].stock,
//       image: image || products[productIndex].image,
//       updatedAt: new Date().toISOString()
//     };

//     writeFile(productsFile, products);
//     res.json(products[productIndex]);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.delete('/api/products/:id', authenticateToken, requireAdmin, (req, res) => {
//   try {
//     const products = readFile(productsFile);
//     const productIndex = products.findIndex(p => p.id === req.params.id);
    
//     if (productIndex === -1) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     products.splice(productIndex, 1);
//     writeFile(productsFile, products);
    
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Cart routes
// app.get('/api/cart', authenticateToken, (req, res) => {
//   try {
//     const carts = readFile(cartsFile);
//     const userCart = carts.find(c => c.userId === req.user.id);
    
//     if (!userCart) {
//       return res.json({ items: [] });
//     }
    
//     res.json(userCart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.post('/api/cart', authenticateToken, (req, res) => {
//   try {
//     const { productId, quantity = 1 } = req.body;
//     const carts = readFile(cartsFile);
//     const products = readFile(productsFile);
    
//     const product = products.find(p => p.id === productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
    
//     if (product.stock < quantity) {
//       return res.status(400).json({ message: 'Not enough stock' });
//     }
    
//     let userCart = carts.find(c => c.userId === req.user.id);
    
//     if (!userCart) {
//       userCart = {
//         userId: req.user.id,
//         items: [],
//         createdAt: new Date().toISOString()
//       };
//       carts.push(userCart);
//     }
    
//     const existingItem = userCart.items.find(item => item.productId === productId);
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       userCart.items.push({
//         productId,
//         quantity,
//         price: product.price
//       });
//     }
    
//     userCart.updatedAt = new Date().toISOString();
//     writeFile(cartsFile, carts);
    
//     res.json(userCart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.put('/api/cart/:productId', authenticateToken, (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const carts = readFile(cartsFile);
//     const userCart = carts.find(c => c.userId === req.user.id);
    
//     if (!userCart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }
    
//     const itemIndex = userCart.items.findIndex(item => item.productId === req.params.productId);
    
//     if (itemIndex === -1) {
//       return res.status(404).json({ message: 'Item not found in cart' });
//     }
    
//     if (quantity <= 0) {
//       userCart.items.splice(itemIndex, 1);
//     } else {
//       userCart.items[itemIndex].quantity = quantity;
//     }
    
//     userCart.updatedAt = new Date().toISOString();
//     writeFile(cartsFile, carts);
    
//     res.json(userCart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.delete('/api/cart/:productId', authenticateToken, (req, res) => {
//   try {
//     const carts = readFile(cartsFile);
//     const userCart = carts.find(c => c.userId === req.user.id);
    
//     if (!userCart) {
//       return res.status(404).json({ message: 'Cart not found' });
//     }
    
//     userCart.items = userCart.items.filter(item => item.productId !== req.params.productId);
//     userCart.updatedAt = new Date().toISOString();
//     writeFile(cartsFile, carts);
    
//     res.json(userCart);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Order routes
// app.post('/api/orders', authenticateToken, (req, res) => {
//   try {
//     const { items, totalAmount, paymentMethod, deliveryAddress } = req.body;
    
//     if (!items || !totalAmount || !paymentMethod || !deliveryAddress) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const orders = readFile(ordersFile);
//     const products = readFile(productsFile);
    
//     // Check stock availability
//     for (const item of items) {
//       const product = products.find(p => p.id === item.productId);
//       if (!product || product.stock < item.quantity) {
//         return res.status(400).json({ message: `Not enough stock for ${product ? product.name : 'product'}` });
//       }
//     }
    
//     // Update stock
//     for (const item of items) {
//       const productIndex = products.findIndex(p => p.id === item.productId);
//       products[productIndex].stock -= item.quantity;
//     }
//     writeFile(productsFile, products);
    
//     const newOrder = {
//       id: uuidv4(),
//       userId: req.user.id,
//       items,
//       totalAmount,
//       paymentMethod,
//       deliveryAddress,
//       status: 'pending',
//       createdAt: new Date().toISOString()
//     };

//     orders.push(newOrder);
//     writeFile(ordersFile, orders);
    
//     // Clear user cart
//     const carts = readFile(cartsFile);
//     const cartIndex = carts.findIndex(c => c.userId === req.user.id);
//     if (cartIndex !== -1) {
//       carts[cartIndex].items = [];
//       writeFile(cartsFile, carts);
//     }

//     res.status(201).json(newOrder);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.get('/api/orders', authenticateToken, (req, res) => {
//   try {
//     const orders = readFile(ordersFile);
    
//     if (req.user.role === 'admin') {
//       res.json(orders);
//     } else {
//       const userOrders = orders.filter(order => order.userId === req.user.id);
//       res.json(userOrders);
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.put('/api/orders/:id/status', authenticateToken, requireAdmin, (req, res) => {
//   try {
//     const { status } = req.body;
//     const orders = readFile(ordersFile);
//     const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
//     if (orderIndex === -1) {
//       return res.status(404).json({ message: 'Order not found' });
//     }
    
//     orders[orderIndex].status = status;
//     orders[orderIndex].updatedAt = new Date().toISOString();
//     writeFile(ordersFile, orders);
    
//     res.json(orders[orderIndex]);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // User routes
// app.get('/api/users', authenticateToken, requireAdmin, (req, res) => {
//   try {
//     const users = readFile(usersFile);
//     const safeUsers = users.map(user => ({
//       id: user.id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       createdAt: user.createdAt
//     }));
//     res.json(safeUsers);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Categories route
// app.get('/api/categories', (req, res) => {
//   try {
//     const products = readFile(productsFile);
//     const categories = [...new Set(products.map(p => p.category))];
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });