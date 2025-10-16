import Product from "../models/product.model.js";

/** GET /api/products */
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    next(err);
  }
};

/** POST /api/products (admin only) */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock } = req.body;
    if (!name || price == null) {
      res.status(400);
      throw new Error("Name and price are required");
    }
    const product = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      createdBy: req.user.id
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/** PUT /api/products/:id (admin or manager) */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    const { name, description, price, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/products/:id (admin only) */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};
