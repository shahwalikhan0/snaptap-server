//services/ratingService.js

async function createRating(rating) {
  return await supabase.from("ratings").insert([rating]);
}

async function getRatings() {
  return await supabase.from("ratings").select("*");
}

async function getRatingById(id) {
  return await supabase.from("ratings").select("*").eq("id", id).single();
}

async function deleteRating(id) {
  return await supabase.from("ratings").delete().eq("id", id);
}

async function updateRating(id, update) {
  return await supabase.from("ratings").update(update).eq("id", id);
}

module.exports = {
  createRating,
  getRatings,
  getRatingById,
  deleteRating,
  updateRating,
};
