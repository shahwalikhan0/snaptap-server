//services/favoriteService.js

async function createFavorite(favorite) {
  return await supabase.from("favorites").insert([favorite]);
}
async function getFavorites() {
  return await supabase.from("favorites").select("*");
}

async function getFavoriteById(id) {
  return await supabase.from("favorites").select("*").eq("id", id).single();
}

async function deleteFavorite(id) {
  return await supabase.from("favorites").delete().eq("id", id);
}

async function updateFavorite(id, update) {
  return await supabase.from("favorites").update(update).eq("id", id);
}

module.exports = {
  createFavorite,
  getFavorites,
  getFavoriteById,
  deleteFavorite,
  updateFavorite,
};
