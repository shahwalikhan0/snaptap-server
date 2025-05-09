const express = require("express");
const router = express.Router();
const notificationService = require("../services/notificationService");

router.get("/id/:id", async (req, res) => {
  const { data, error } = await notificationService.getNotificationById(
    req.params.id
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/user-id/:id", async (req, res) => {
  const { data, error } = await notificationService.getNotificationsByUserId(
    req.params.id
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.get("/brand-id/:id", async (req, res) => {
  const { data, error } = await notificationService.getNotificationsByBrandId(
    req.params.id
  );
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
});

router.post("/create", async (req, res) => {
  const { data, error } = await notificationService.createNotification(
    req.body
  );
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete("/delete/:id", async (req, res) => {
  const { error } = await notificationService.deleteNotification(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

router.put("/mark-as-read/:id", async (req, res) => {
  const { data, error } = await notificationService.markAsRead(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({
    id: req.params.id,
    is_read: true,
  });
});

router.put("/mark-all-as-read/:userId", async (req, res) => {
  const { data, error } = await notificationService.markAllAsRead(
    req.params.userId
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json({
    userId: req.params.userId,
    is_read: true,
  });
});

router.put("/mark-all-brand-as-read/:brandId", async (req, res) => {
  const { data, error } = await notificationService.markAllBrandAsRead(
    req.params.brandId
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json({
    brandId: req.params.brandId,
    is_read: true,
  });
});

router.put("/update-response-to-submitted/:id", async (req, res) => {
  const { data, error } = await notificationService.updateResponseToSubmitted(
    req.params.id
  );
  if (error) return res.status(400).json({ error: error.message });
  res.json({
    id: req.params.id,
    response: "submitted",
  });
});

module.exports = router;
