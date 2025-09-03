import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: "i" } },
            { description: { $regex: req.query.keyword, $options: "i" } },
          ],
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};
    const isActive = { isActive: true };

    const count = await Product.countDocuments({
      ...keyword,
      ...category,
      ...isActive,
    });
    const products = await Product.find({
      ...keyword,
      ...category,
      ...isActive,
    })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product && product.isActive) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: Number(req.body.price),
      category: req.body.category,
      stock: Number(req.body.stock),
      image: req.body.image,
      images: req.body.images || [],
      isActive: req.body.isActive ?? true,
      ratings: {
        average: Number(req.body.ratings?.average ?? 0),
        count: Number(req.body.ratings?.count ?? 0),
      },
      nutritionInfo: {
        calories: Number(req.body.nutritionInfo?.calories ?? 0),
        protein: req.body.nutritionInfo?.protein ?? "",
        carbs: req.body.nutritionInfo?.carbs ?? "",
        fat: req.body.nutritionInfo?.fat ?? "",
      },
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.image !== undefined) product.image = req.body.image;
    if (req.body.images !== undefined) product.images = req.body.images;
    if (req.body.isActive !== undefined) product.isActive = req.body.isActive;

    if (req.body.ratings) {
      if (req.body.ratings.average !== undefined) {
        product.ratings.average = Number(req.body.ratings.average);
      }
      if (req.body.ratings.count !== undefined) {
        product.ratings.count = Number(req.body.ratings.count);
      }
    }

    if (req.body.nutritionInfo) {
      const n = req.body.nutritionInfo;
      if (n.calories !== undefined) product.nutritionInfo.calories = Number(n.calories);
      if (n.protein !== undefined) product.nutritionInfo.protein = n.protein;
      if (n.carbs !== undefined) product.nutritionInfo.carbs = n.carbs;
      if (n.fat !== undefined) product.nutritionInfo.fat = n.fat;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
export const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
