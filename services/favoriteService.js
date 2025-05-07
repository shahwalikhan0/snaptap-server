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
    .maybeSingle();
}

async function deleteFavorite(userId, productId) {
  const { data, error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);

  return { data, error }; // Always return an object with both fields
}

async function getFavoriteById(id) {
  return await supabase
    .from("favorites")
    .select("*")
    .eq("id", id)
    .maybeSingle();
}

module.exports = {
  getFavoriteById,
  createFavorite,
  getFavoritesByUserId,
  deleteFavorite,
  getIsFavoriteByUser,
};
