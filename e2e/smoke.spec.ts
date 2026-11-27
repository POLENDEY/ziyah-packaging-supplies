import { test, expect } from "@playwright/test";

test.describe("Public storefront smoke", () => {
  test("home page loads", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.ok()).toBeTruthy();
    await expect(page.locator("body")).toBeVisible();
  });

  test("products catalog loads", async ({ page }) => {
    const res = await page.goto("/products");
    expect(res?.ok()).toBeTruthy();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("product detail loads for id 1", async ({ page }) => {
    const res = await page.goto("/products/1");
    expect(res?.status()).toBeLessThan(500);
    if (res?.ok()) {
      await expect(page.locator("body")).toContainText(/bento|tray|packaging|₱/i);
    }
  });

  test("contact page loads", async ({ page }) => {
    const res = await page.goto("/contact");
    expect(res?.ok()).toBeTruthy();
  });

  test("admin APIs reject anonymous access", async ({ request }) => {
    const inquiry = await request.get("/api/inquiry");
    expect(inquiry.status()).toBe(401);

    const feedbackPut = await request.put("/api/feedback", {
      data: { items: [] },
    });
    expect(feedbackPut.status()).toBe(401);

    const products = await request.get("/api/admin/products");
    expect(products.status()).toBe(401);
  });

  test("public catalog API returns products", async ({ request }) => {
    const res = await request.get("/api/catalog/products");
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body.products)).toBeTruthy();
    expect(body.products.length).toBeGreaterThan(0);
  });
});
