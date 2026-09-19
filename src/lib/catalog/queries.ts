import { supabase } from "@/lib/supabase";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { mapDbProductToProduct } from "./mapProduct";
import type { DbCategory, DbProductRow } from "./types";
import type { Product } from "@/data/products";

const PRODUCT_SELECT =
  "*, catalog_categories ( name, slug )" as const;

function normalizeRow(row: Record<string, unknown>): DbProductRow {
  const categories = row.catalog_categories as
    | { name: string; slug: string }
    | null
    | undefined;
  return {
    ...(row as unknown as DbProductRow),
    categories: categories ?? null,
  };
}

/** Public reads via anon client (RLS: published only). */
export async function getPublishedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("catalog_products")
    .select(PRODUCT_SELECT)
    .eq("is_published", true)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) =>
    mapDbProductToProduct(normalizeRow(row as Record<string, unknown>))
  );
}

export async function getPublishedProductById(
  id: number
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("catalog_products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapDbProductToProduct(normalizeRow(data as Record<string, unknown>));
}

export async function getCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from("catalog_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbCategory[];
}

/** Admin reads (includes unpublished) — service role only. */
export async function getAllProductsAdmin(): Promise<Product[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("catalog_products")
    .select(PRODUCT_SELECT)
    .order("id", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) =>
    mapDbProductToProduct(normalizeRow(row as Record<string, unknown>))
  );
}

export async function getAllCategoriesAdmin(): Promise<DbCategory[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from("catalog_categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DbCategory[];
}
