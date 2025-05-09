//services/ratingService.js
const { supabase } = require("../supabaseClient");
const productService = require("../services/productService");

async function updatePreviousRating(
  productId,
  current_rating,
  oldRating = null
) {
  const { data: feedbacks, error: feedbackError } = await supabase
    .from("feedbacks")
    .select("id")
    .eq("product_id", productId);

  if (feedbackError) {
    return { data: null, error: feedbackError };
  }
  const ratingCount = feedbacks.length;

  if (oldRating) {
    const { data: product, error: productError } =
      await productService.updateProductRating(
        productId,
        current_rating,
        ratingCount,
        oldRating
      );
  }

  const { data: product, error: productError } =
    await productService.updateProductRating(
      productId,
      current_rating,
      ratingCount
    );

  if (productError) {
    return { data: null, error: productError };
  }
  return { data: product, error: null };
}

async function getFeedback(userId, productId) {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("id, title, message, current_rating")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

async function getFeedbacksByProductId(productId) {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("id, title, message, user_id, current_rating")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

async function deleteFeedback(id) {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: { message: "Feedback not found" } };
  }

  const { error: deleteError } = await supabase
    .from("feedbacks")
    .delete()
    .eq("id", id);
  if (deleteError) {
    return { data: null, error: deleteError };
  }
  return { data, error: null };
}

async function createFeedback(feedback) {
  // Step 1: Insert feedback
  const { data, error } = await supabase
    .from("feedbacks")
    .insert([feedback])
    .select()
    .single();
  if (error) return { data: null, error };

  // Step 2: Update product rating with new feedback
  const { data: updatedProduct, error: updateError } =
    await productService.updateProductRating(
      feedback.product_id,
      feedback.current_rating,
      null
    );

  if (updateError) return { data: null, error: updateError };
  if (!updatedProduct)
    return { data: null, error: { message: "Product not found" } };

  return { data, error: null };
}

async function updateFeedback(userId, productId, update) {
  // Step 1: Get existing feedback including old rating and product_id
  const { data: oldFeedback, error: fetchError } = await supabase
    .from("feedbacks")
    .select("id, product_id, current_rating")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .maybeSingle();

  if (fetchError) return { data: null, error: fetchError };
  if (!oldFeedback)
    return { data: null, error: { message: "Feedback not found" } };

  // Step 2: Update feedback
  const { data: updatedFeedback, error: updateError } = await supabase
    .from("feedbacks")
    .update(update)
    .eq("user_id", userId)
    .eq("product_id", productId)
    .select()
    .single();

  if (updateError) return { data: null, error: updateError };

  // Step 3: Update product rating using old and new rating
  const { data: updatedProduct, error: productError } =
    await productService.updateProductRating(
      oldFeedback.product_id,
      update.current_rating,
      oldFeedback.current_rating
    );

  if (productError) return { data: null, error: productError };
  if (!updatedProduct)
    return { data: null, error: { message: "Product not found" } };

  return { data: updatedFeedback, error: null };
}

async function getFeedbackById(id) {
  const { data, error } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  if (!data) {
    return { data: null, error: { message: "Feedback not found" } };
  }
  return { data, error: null };
}

module.exports = {
  createFeedback,
  getFeedback,
  getFeedbacksByProductId,
  deleteFeedback,
  updateFeedback,
  getFeedbackById,
};
