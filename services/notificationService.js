//services/notificationService.js
const { supabase } = require("../supabaseClient");

async function createNotification(notification) {
  return await supabase.from("notifications").insert([notification]);
}

async function getNotificationById(id) {
  return await supabase.from("notifications").select("*").eq("id", id).single();
}

async function getNotificationsByUserId(userId) {
  return await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

async function deleteNotification(id) {
  return await supabase.from("notifications").delete().eq("id", id);
}

module.exports = {
  createNotification,
  getNotificationsByUserId,
  getNotificationById,
  deleteNotification,
};
