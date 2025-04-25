// routes/api.js
const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// Get all products
router.get("/products", async (req, res) => {
  const { data, error } = await supabase.from("products").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Get product by ID
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

module.exports = router;
