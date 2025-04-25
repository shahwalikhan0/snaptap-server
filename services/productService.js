async function createProduct(product) {
  return await supabase.from("products").insert([product]);
}

async function getProducts() {
  return await supabase.from("products").select("*");
}

async function getProductById(id) {
  return await supabase.from("products").select("*").eq("id", id).single();
}

async function updateProduct(id, update) {
  return await supabase.from("products").update(update).eq("id", id);
}

async function deleteProduct(id) {
  return await supabase.from("products").delete().eq("id", id);
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
