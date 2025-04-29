const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_BUCKET_POSTFIX = process.env.SUPABASE_BUCKET_POSTFIX;

const SUPABASE_BASE_URL = `${SUPABASE_URL}${SUPABASE_BUCKET_POSTFIX}`;

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

  const publicUrl = `${SUPABASE_BASE_URL}/product-models/${fileName}`;
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

  const publicUrl = `${SUPABASE_BASE_URL}/product-images/${productSuffixPath}`;
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

  const publicUrl = `${SUPABASE_BASE_URL}/product-qr-codes/${productSuffixPath}`;
  return publicUrl;
}

module.exports = {
  uploadFileToSupabase,
  uploadImageToSupabase,
  uploadQRCodeToSupabase,
};
