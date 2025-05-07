const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadFileToSupabase(filePath, productSuffixPath, fileType) {
  const fileName = `${productSuffixPath}.${fileType}`;
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("product-models")
    .upload(fileName, fileBuffer, {
      contentType: fileType === "usdz" ? "model/usdz" : "model/gltf-binary",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    throw new Error("File upload failed");
  }

  const publicUrl = `https://snaptap.up.railway.app/model/${productSuffixPath}`;
  return publicUrl;
}

async function uploadImageToSupabase(filePath, productSuffixPath, fileType) {
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(productSuffixPath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    throw new Error("Image upload failed");
  }

  const publicUrl = `https://snaptap.up.railway.app/bucket/product-images/${productSuffixPath}`;
  return publicUrl;
}

async function uploadQRCodeToSupabase(
  filePath,
  productSuffixPath,
  fileType = "png"
) {
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("product-qr-codes")
    .upload(productSuffixPath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    throw new Error("QR code upload failed");
  }

  const publicUrl = `https://snaptap.up.railway.app/bucket/product-qr-codes/${productSuffixPath}`;
  return publicUrl;
}

async function deleteImageFromSupabase(filePath) {
  const { error } = await supabase.storage
    .from("product-images")
    .remove([filePath]);

  if (error) {
    console.error("Delete failed:", error.message);
    throw new Error("Image deletion failed");
  }
}
async function uploadUserImageToSupabase(filePath, username) {
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("user-images")
    .upload(username, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    throw new Error("User image upload failed");
  }

  const publicUrl = `https://snaptap.up.railway.app/bucket/user-images/${username}`;
  return publicUrl;
}

module.exports = {
  uploadFileToSupabase,
  uploadImageToSupabase,
  uploadQRCodeToSupabase,
  uploadUserImageToSupabase,
  deleteImageFromSupabase,
};
