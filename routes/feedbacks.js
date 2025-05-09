const express = require("express");
const router = express.Router();
const feedbackService = require("../services/feedbackService");

router.get("/user-feedback/:userId/:productId", async (req, res) => {
  const { data, error } = await feedbackService.getFeedback(
    req.params.userId,
    req.params.productId
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/product/:productId", async (req, res) => {
  const { data, error } = await feedbackService.getFeedbacksByProductId(
    req.params.productId
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/create", async (req, res) => {
  const { user_id, product_id, title, message, current_rating } = req.body;
  if (!user_id || !product_id || !current_rating) {
    return res.status(400).json({
      error: "Fill in required fields",
    });
  }
  const feedback = {
    user_id,
    product_id,
    title,
    message,
    current_rating,
  };
  const { data, error } = await feedbackService.createFeedback(feedback);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete("/delete/:id", async (req, res) => {
  const { error } = await feedbackService.deleteFeedback(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

router.put("/update", async (req, res) => {
  const { user_id, product_id, title, message, current_rating } = req.body;
  if (!user_id || !product_id || !current_rating) {
    return res.status(400).json({
      error: "Fill in required fields",
    });
  }

  const feedback = {
    user_id,
    product_id,
    title,
    message,
    current_rating,
  };

  const { data, error } = await feedbackService.updateFeedback(
    user_id,
    product_id,
    feedback
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

module.exports = router;
