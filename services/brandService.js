const { supabase } = require("../supabaseClient");
async function createBrand(brand) {
  return await supabase.from("brands").insert([brand]);
}

async function getBrands() {
  return await supabase.from("brands").select("*");
}

async function calculateBrandProductsBilling(billingId) {
  const { data: hitsData, error: hitsError } = await supabase
    .from("product_hits")
    .select("*")
    .eq("billing_id", billingId);

  if (hitsError) {
    return { data: null, error: hitsError };
  }

  let totalBilling = 0;
  hitsData.forEach((hit) => {
    totalBilling += (hit.per_hit_rate || 0) * (hit.hit_count || 0);
  });

  return {
    data: {
      totalBilling,
    },
    error: null,
  };
}

async function getBrandDetailById(id) {
  const { data: brand, error: brandError } = await supabase
    .from("brand_details")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (brandError) {
    return { data: null, error: brandError };
  }

  const { data: billingInfo, error: billingError } = await supabase
    .from("billings")
    .select("*")
    .eq("brand_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (billingError) {
    return { data: null, error: billingError };
  }

  let totalBilling = 0;
  if (billingInfo) {
    const { data: billingData, error: billingDataError } =
      await calculateBrandProductsBilling(billingInfo.id);

    if (billingDataError) {
      return { data: null, error: billingDataError };
    }
    totalBilling = billingData.totalBilling;
  }
  return {
    data: {
      ...brand,
      ...billingInfo,
      totalBilling,
    },
    error: null,
  };
}

async function getBrandById(id) {
  return await supabase.from("brands").select("*").eq("id", id).maybeSingle();
}

async function searchBrandsByName(key) {
  return await supabase
    .from("brands")
    .select("*")
    .ilike("name", `%${key}%`)
    .order("created_at", { ascending: false });
}

async function updateBrand(id, update) {
  return await supabase.from("brands").update(update).eq("id", id);
}

async function deleteBrand(id) {
  return await supabase.from("brands").delete().eq("id", id);
}

module.exports = {
  createBrand,
  getBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  searchBrandsByName,
  getBrandDetailById,
};
