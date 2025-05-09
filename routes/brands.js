const express = require("express");
const router = express.Router();
const brandService = require("../services/brandService");

router.get("/", async (req, res) => {
  const { data, error } = await brandService.getBrands();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get("/brand-id/:id", async (req, res) => {
  const { data, error } = await brandService.getBrandById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/search/:key", async (req, res) => {
  const { data, error } = await brandService.searchBrandsByName(req.params.key);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/create", async (req, res) => {
  const { data, error } = await brandService.createBrand(req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.put("/brand-id/:id", async (req, res) => {
  const { data, error } = await brandService.updateBrand(
    req.params.id,
    req.body
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.delete("/delete/:id", async (req, res) => {
  const { error } = await brandService.deleteBrand(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

router.get("/brand-detail/:brandId", async (req, res) => {
  const { data, error } = await brandService.getBrandDetailById(
    req.params.brandId
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

module.exports = router;
