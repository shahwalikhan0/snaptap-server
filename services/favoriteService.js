//services/favoriteService.js
const { supabase } = require("../supabaseClient");
const productService = require("../services/productService");

async function createFavorite(favorite) {
  return await supabase.from("favorites").insert([favorite]);
}

async function getFavoritesByUserId(userId) {
  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }
  const productIds = data.map((favorite) => favorite.product_id);
  const { data: products, error: productError } =
    await productService.getProductsByIds(productIds);

  if (productError) {
    return { data: null, error: productError };
  }
  products.forEach((product) => {
    product.is_favorite = true;
  });

  return { data: products, error: null };
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
