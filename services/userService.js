const { supabase } = require("../supabaseClient");

async function createUser(user, table = "users") {
  return await supabase.from(table).insert([user]);
}

async function getAllUsers() {
  return await supabase.from("users").select("*");
}

async function getUserById(id) {
  return await supabase.from("users").select("*").eq("id", id).maybeSingle();
}

async function getUserByUsername(username) {
  return await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();
}

async function updateUser(id, update) {
  return await supabase.from("users").update(update).eq("id", id);
}

async function deleteUser(id) {
  return await supabase.from("users").delete().eq("id", id);
}

async function allowLogin(username, password, userType = "customer") {
  const table = userType === "customer" ? "users" : "brands";

  const { data, error } = await supabase
    .from(table)
    .select("id, username, email, name, phone, image_url")
    .eq("username", username)
    .eq("password", password)
    .maybeSingle();

  const userNotFound = error?.code === "PGRST116" || !data;

  if (userNotFound) {
    return {
      error: {
        message: `User not found`,
      },
    };
  }

  if (error) return { error };

  return {
    data: {
      id: data.id,
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      image_url: data.image_url,
    },
  };
}

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  allowLogin,
  getUserByUsername,
};
