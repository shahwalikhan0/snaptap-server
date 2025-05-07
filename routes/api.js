// routes/api.js
const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// router.get("/products", async (req, res) => {
//   const { data, error } = await supabase.from("products").select("*");

//   if (error) {
//     console.error("Supabase error:", error);
//     return res.status(500).json({ error: "Failed to fetch products" });
//   }

//   res.json(data);
// });

module.exports = router;
