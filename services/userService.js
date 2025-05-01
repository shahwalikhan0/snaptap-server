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
async function allowCustomerLogin(username, password) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { data: { allow: false } };
    }
    return { error };
  }

  return { data: { allow: data?.role === "customer" } };
}

async function allowSellerLogin(username, password) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { data: { allow: false } };
    }
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
  allowCustomerLogin,
  allowSellerLogin,
};
