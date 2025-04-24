// supabaseUpload.js
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Setup
const supabaseUrl = "https://ifyrnbgfeshpykfjgzcc.supabase.co"; // Replace with your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmeXJuYmdmZXNocHlrZmpnemNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzU2OTYsImV4cCI6MjA2MTA1MTY5Nn0.QcAuGvBfOX5e3eq70GY3KBfYnH4MbvD79exvcd3wq_s"; // Use service role key for server-side
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to upload GLB file
async function uploadGLBFile(filePath, brandName, productId) {
  const fileName = `${brandName}-${productId}.usdz`;
  const fileBuffer = fs.readFileSync(filePath);

  const { data, error } = await supabase.storage
    .from("product-models") // your bucket name
    .upload(fileName, fileBuffer, {
      contentType: "model/gltf-binary",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    return null;
  }

  // Construct the public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-models/${fileName}`;
  return publicUrl;
}

// Example usage:
uploadGLBFile("./public/abc.usdz", "shah", 123).then((url) => {
  if (url) {
    console.log("Public file URL:", url);
    // Store this URL in your PostgreSQL 'glb_url' field
  }
});
