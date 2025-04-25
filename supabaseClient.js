// // supabaseClient.js
// require("dotenv").config();
// const { createClient } = require("@supabase/supabase-js");
// const fs = require("fs");

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

// const supabase = createClient(supabaseUrl, supabaseKey);

// async function uploadGLBFile(filePath, brandName, brandId, productId) {
//   const fileName = `${brandName}${brandId}-${productId}.usdz`;
//   const fileBuffer = fs.readFileSync(filePath);

//   const { data, error } = await supabase.storage
//     .from("product-models")
//     .upload(fileName, fileBuffer, {
//       contentType: "model/gltf-binary",
//       upsert: true,
//     });

//   if (error) {
//     console.error("Upload failed:", error.message);
//     return null;
//   }

//   const publicUrl = `${supabaseUrl}/storage/v1/object/public/product-models/${fileName}`;
//   return publicUrl;
// }

// module.exports = { uploadGLBFile };
// // Example usage:
// uploadGLBFile("./public/abc.usdz", "shah", 1, 123)
//   .then((url) => {
//     if (url) {
//       console.log("Public file URL:", url);
//     }
//   })
//   .catch((error) => {
//     console.error("Error uploading file:", error);
//   });

// supabaseClient.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
