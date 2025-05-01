//services/favoriteService.js
const { supabase } = require("../supabaseClient");

//change this to take userId and productId
async function createFavorite(favorite) {
  return await supabase.from("favorites").insert([favorite]);
}

async function getFavoritesByUserId(userId) {
  return await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

async function getIsFavoriteByUser(userId, productId) {
  return await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();
}

async function deleteFavorite(id) {
  return await supabase.from("favorites").delete().eq("id", id);
}

async function getFavoriteById(id) {
  return await supabase.from("favorites").select("*").eq("id", id).single();
}

module.exports = {
  getFavoriteById,
  createFavorite,
  getFavoritesByUserId,
  deleteFavorite,
  getIsFavoriteByUser,
};
