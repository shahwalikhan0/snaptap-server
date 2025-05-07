const express = require("express");
const router = express.Router();
const favoriteService = require("../services/favoriteService");

router.get("/id/:id", async (req, res) => {
  const { data, error } = await favoriteService.getFavoriteById(req.params.id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/user-id/:id", async (req, res) => {
  const { data, error } = await favoriteService.getFavoritesByUserId(
    req.params.id
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/set-favorite/:userId/:productId", async (req, res) => {
  const favorite = {
    user_id: req.params.userId,
    product_id: req.params.productId,
  };
  const { data, error } = await favoriteService.createFavorite(favorite);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete("/unset-favorite/:userId/:productId", async (req, res) => {
  const { error } = await favoriteService.deleteFavorite(
    req.params.userId,
    req.params.productId
  );
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
