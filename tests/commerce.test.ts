import { beforeEach, describe, expect, it } from "vitest";
import { sortProducts } from "@/lib/products";
import { shippingSchema } from "@/schemas/validation";
import { useShopStore } from "@/store/use-shop-store";

const messages = {
  required: "Required",
  emailInvalid: "Invalid email",
  passwordMin: "Password too short",
  phoneInvalid: "Invalid phone",
};

describe("product sorting", () => {
  const items = [
    { id: "a", name_en: "A", name_ar: "أ", price: 30, category: "x", image: "", description_en: "", description_ar: "", inStock: true },
    { id: "b", name_en: "B", name_ar: "ب", price: 10, category: "x", image: "", description_en: "", description_ar: "", inStock: true },
  ];

  it("sorts by price ascending and descending", () => {
    expect(sortProducts(items, "price-asc").map((item) => item.id)).toEqual(["b", "a"]);
    expect(sortProducts(items, "price-desc").map((item) => item.id)).toEqual(["a", "b"]);
  });
});

describe("shop store", () => {
  beforeEach(() => {
    useShopStore.setState({ cart: [], wishlist: [], user: null, theme: "light" });
  });

  it("adds and updates cart items", () => {
    useShopStore.getState().addToCart("p1");
    useShopStore.getState().addToCart("p1", 2);
    expect(useShopStore.getState().cart).toEqual([{ productId: "p1", quantity: 3 }]);

    useShopStore.getState().updateQuantity("p1", 1);
    expect(useShopStore.getState().cart[0].quantity).toBe(1);
  });

  it("toggles wishlist items", () => {
    useShopStore.getState().toggleWishlist("p2");
    expect(useShopStore.getState().wishlist).toContain("p2");
    useShopStore.getState().toggleWishlist("p2");
    expect(useShopStore.getState().wishlist).not.toContain("p2");
  });
});

describe("checkout validation", () => {
  it("accepts valid shipping details", () => {
    const result = shippingSchema(messages).safeParse({
      name: "Alex",
      email: "alex@example.com",
      address: "12 Market Street",
      city: "Cairo",
      phone: "+201001001000",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid shipping details", () => {
    const result = shippingSchema(messages).safeParse({
      name: "",
      email: "nope",
      address: "",
      city: "",
      phone: "x",
    });

    expect(result.success).toBe(false);
  });
});
