const { supabase } = require("../supabaseClient");
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
async function getProductsByBrandId(id) {
  return await supabase.from("products").select("*").eq("brand_id", id);
}

async function getTrendingProducts() {
  return await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
}

async function getNewArrivals() {
  return await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);
}

async function searchProductsByName(key) {
  return await supabase.from("products").select("*").ilike("name", `%${key}%`);
}

async function searchProducsByBrand(key) {
  return await supabase
    .from("products")
    .select("*")
    .ilike("brand_name", `%${key}%`);
}

async function searchProducts(key) {
  //either by brand_name or product name
  const { data: products, error } = await searchProductsByName(key);
  if (error) {
    return { error };
  }

  const { data: brands, error: brandError } = await searchProducsByBrand(key);
  if (brandError) {
    return { error: brandError };
  }
  const uniqueProducts = new Set(products.map((product) => product.id));
  const uniqueBrands = new Set(brands.map((brand) => brand.id));
  const combinedResults = [
    ...products.filter((product) => uniqueProducts.has(product.id)),
    ...brands.filter((brand) => uniqueBrands.has(brand.id)),
  ];
  return { data: combinedResults };
}

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByBrandId,
  getTrendingProducts,
  getNewArrivals,
  searchProducts,
};
