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

async function isValidCustomer(id) {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", id)
    .single();

  if (error) {
    return { error };
  }

  if (data.role === "customer") {
    return { isValid: true };
  } else {
    return { isValid: false };
  }
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

  if (data.role === "seller") {
    return { isValid: true };
  } else {
    return { isValid: false };
  }
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
