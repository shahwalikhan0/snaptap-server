const { supabase } = require("../supabaseClient");
async function createProduct(product) {
  return await supabase.from("products").insert([product]).select().single();
}

async function createProductDetails(productDetails) {
  return await supabase.from("product_details").insert([productDetails]);
}

async function getProducts() {
  return await supabase.from("products").select("*").eq("is_active", true);
}

async function getProductDetail(productId, userId = null) {
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (productError) {
    return { data: null, error: productError };
  }

  const { data: productDetail, error: productDetailError } = await supabase
    .from("product_details")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (productDetailError) {
    return { data: null, error: productDetailError };
  }

  let isFavorite = false;
  if (userId) {
    const { data: favorite, error: favoriteError } = await supabase
      .from("favorites")
      .select("product_id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .maybeSingle();

    if (favoriteError) {
      return { data: null, error: favoriteError };
    }

    isFavorite = !!favorite;
  }

  return {
    data: {
      ...product,
      ...productDetail,
      is_favorite: isFavorite,
    },
    error: null,
  };
}

async function getProductById(id) {
  return await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();
}

async function updateProduct(id, update) {
  return await supabase.from("products").update(update).eq("id", id);
}

async function deleteProduct(id) {
  return await supabase.from("products").delete().eq("id", id);
}
async function getProductsByBrandId(id) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("brand_id", id);
  if (error) {
    return { data: null, error };
  }
  return { data, error: null };
}

async function getTrendingProducts() {
  return await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10);
}

async function updateProductRating(productId, newRating, oldRating = null) {
  const { data: product, error: fetchError } = await supabase
    .from("product_details")
    .select("rating, rating_count")
    .eq("id", productId)
    .maybeSingle();

  if (fetchError) return { data: null, error: fetchError };
  if (!product) return { data: null, error: { message: "Product not found" } };

  let totalRatingSum = product.rating * product.rating_count;
  let newCount = product.rating_count;

  if (oldRating !== null) {
    totalRatingSum = totalRatingSum - oldRating + newRating;
  } else {
    totalRatingSum += newRating;
    newCount += 1;
  }

  const updatedRating = totalRatingSum / newCount;

  const { error: updateError } = await supabase
    .from("product_details")
    .update({
      rating: updatedRating,
      rating_count: newCount,
    })
    .eq("id", productId);

  if (updateError) return { data: null, error: updateError };

  return {
    data: {
      id: productId,
      rating: updatedRating,
      rating_count: newCount,
    },
    error: null,
  };
}

async function getNewArrivals() {
  return await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10);
}

async function searchProductByProductName(key) {
  return await supabase
    .from("products")
    .select("*")
    .ilike("name", `%${key}%`)
    .eq("is_active", true);
}

async function getProductsByIds(ids) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("id", ids)
    .eq("is_active", true);

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
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
  searchProductByProductName,
  getProductDetail,
  createProductDetails,
  getProductsByIds,
  updateProductRating,
};
