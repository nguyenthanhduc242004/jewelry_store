const Product = require('../models/productModel');
const resultWrapper = require('../utils/resultWrapper');

exports.getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(resultWrapper(true, 200, "Lấy danh sách sản phẩm thành công", products));
};

exports.createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(resultWrapper(true, 201, "Tạo sản phẩm thành công", newProduct));
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(resultWrapper(true, 200, "Cập nhật sản phẩm thành công", product));
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json(resultWrapper(true, 200, "Xóa sản phẩm thành công"));
};
