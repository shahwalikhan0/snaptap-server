const { supabase } = require("../supabaseClient");

async function createUser(user) {
  return await supabase.from("users").insert([user]);
}

async function getAllUsers() {
  return await supabase.from("users").select("*");
}

async function getUserById(id) {
  return await supabase.from("users").select("*").eq("id", id).single();
}

async function updateUser(id, update) {
  return await supabase.from("users").update(update).eq("id", id);
}

async function deleteUser(id) {
  return await supabase.from("users").delete().eq("id", id);
}

// userService.js
async function isValidCustomer(id) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", id)
    .single();

  if (error) {
    return { error };
  }

  return { data: { isValid: data?.role === "customer" } };
}

async function isValidSeller(id) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", id)
    .single();

  if (error) {
    return { error };
  }

  return { data: { isValid: data?.role === "seller" } };
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  isValidCustomer,
  isValidSeller,
};
