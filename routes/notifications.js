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

router.post("/create", async (req, res) => {
  const { data, error } = await notificationService.createNotification(
    req.body
  );
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

router.delete("/:id", async (req, res) => {
  const { error } = await notificationService.deleteNotification(req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

module.exports = router;
