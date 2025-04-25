//service/productFrameService.js
const { supabase } = require("../supabaseClient");

async function createFrame(frame) {
  return await supabase.from("frames").insert([frame]);
}

async function getFrames() {
  return await supabase.from("frames").select("*");
}
async function getFrameById(id) {
  return await supabase.from("frames").select("*").eq("id", id).single();
}

async function deleteFrame(id) {
  return await supabase.from("frames").delete().eq("id", id);
}
async function updateFrame(id, update) {
  return await supabase.from("frames").update(update).eq("id", id);
}

module.exports = {
  createFrame,
  getFrames,
  getFrameById,
  deleteFrame,
  updateFrame,
};
