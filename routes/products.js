const express = require("express");
const router = express.Router();
const productService = require("../services/productService");

router.get("/", async (req, res) => {
  const { data, error } = await productService.getProducts();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/product-detail/:id", async (req, res) => {
  const productId = req.params.id;
  const userId = req.query.userId || null;

  try {
    const { data, error } = await productService.getProductDetail(
      productId,
      userId
    );
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/id/:id", async (req, res) => {
  const { data, error } = await productService.getProductById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
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
  const { data, error } = await productService.searchProductByProductName(
    req.params.key
  );
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

//TODO: may be donot need this route & need delete by brandId
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

router.delete("/delete/:id", async (req, res) => {
  const { error } = await productService.deleteProduct(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
