//services/scanService.js
const { supabase } = require("../supabaseClient");

async function createScan(scan) {
  return await supabase.from("scans").insert([scan]);
}
async function getScans() {
  return await supabase.from("scans").select("*");
}
async function getScanById(id) {
  return await supabase.from("scans").select("*").eq("id", id).maybeSingle();
}
async function deleteScan(id) {
  return await supabase.from("scans").delete().eq("id", id);
}
async function updateScan(id, update) {
  return await supabase.from("scans").update(update).eq("id", id);
}
// async function getScansByUserId(userId) {
//     return await supabase.from("scans").select("*").eq("user_id", userId);
// }
// async function getScansByProductId(productId) {
//     return await supabase.from("scans").select("*").eq("product_id", productId);
// }
module.exports = {
  getScans,
  createScan,
  getScanById,
  deleteScan,
  updateScan,
  // getScansByUserId,
  // getScansByProductId,
};
