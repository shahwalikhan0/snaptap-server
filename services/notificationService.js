//services/notificationService.js
const { supabase } = require("../supabaseClient");

async function createNotification(notification) {
  return await supabase.from("notifications").insert([notification]);
}

async function getNotificationById(id) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("id", id)
    .maybeSingle();
}

async function getNotificationsByUserId(userId) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

async function getNotificationsByBrandId(userId) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("brand_id", userId)
    .order("created_at", { ascending: false });
}

async function deleteNotification(id) {
  return await supabase.from("notifications").delete().eq("id", id);
}

async function markAsRead(id) {
  return await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
}

async function markAllAsRead(userId) {
  return await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);
}

async function markAllBrandAsRead(brandId) {
  return await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("brand_id", userId);
}

async function updateResponseToSubmitted(id) {
  return await supabase
    .from("notifications")
    .update({ response: "submitted" })
    .eq("id", id);
}

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getNotificationById,
  deleteNotification,
  markAsRead,
  markAllAsRead,
  updateResponseToSubmitted,
  getNotificationsByBrandId,
  markAllBrandAsRead,
};
