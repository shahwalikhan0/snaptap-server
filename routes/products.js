const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

router.get("/", async (req, res) => {
  const { data, error } = await productService.getAllProducts();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/id/:id", async (req, res) => {
  const { data, error } = await productService.getProductById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/", async (req, res) => {
  const { data, error } = await productService.createProduct(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.get("/brand-id/:id", async (req, res) => {
  const { data, error } = await productService.getProductsByBrandId(
    req.params.id
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/trending", async (req, res) => {
  const { data, error } = await productService.getTrendingProducts();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/new-arrivals", async (req, res) => {
  const { data, error } = await productService.getNewArrivals();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/search/:key", async (req, res) => {
  const { data, error } = await productService.searchProducts(req.params.key);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

//may be donot need this route & need delete by brandId
router.get("/user-id/:id", async (req, res) => {
  const { data, error } = await userService.isValidCustomer(req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.put("/id/:id", async (req, res) => {
  const { data, error } = await productService.updateProduct(
    req.params.id,
    req.body
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/id/:id", async (req, res) => {
  const { error } = await productService.deleteProduct(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
