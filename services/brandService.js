const { supabase } = require("../supabaseClient");
async function createBrand(brand) {
  return await supabase.from("brands").insert([brand]);
}

async function getBrands() {
  return await supabase.from("brands").select("*");
}

async function getBrandById(id) {
  return await supabase.from("brands").select("*").eq("id", id).single();
}

async function updateBrand(id, update) {
  return await supabase.from("brands").update(update).eq("id", id);
}

async function deleteBrand(id) {
  return await supabase.from("brands").delete().eq("id", id);
}

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};
