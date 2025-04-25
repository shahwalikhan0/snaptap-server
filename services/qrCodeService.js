const { supabase } = require("../supabaseClient");

async function createQRCode(qr) {
  return await supabase.from("qr_codes").insert([qr]);
}

async function getQRCodes() {
  return await supabase.from("qr_codes").select("*");
}

async function getQRCodeById(id) {
  return await supabase.from("qr_codes").select("*").eq("id", id).single();
}

async function deleteQRCode(id) {
  return await supabase.from("qr_codes").delete().eq("id", id);
}

module.exports = { createQRCode, getQRCodes, getQRCodeById, deleteQRCode };
