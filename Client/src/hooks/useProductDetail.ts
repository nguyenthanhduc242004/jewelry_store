import { useEffect, useState, useCallback } from "react";
import { ProductService, ProductImageService } from "../services";
import type { ProductDetail } from "../services";
import type { ProductRow } from "../components/Product/ProductTable/ProductTable";

export default function useProductDetail(id?: string) {
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProduct = useCallback(async (productId: number, signal?: AbortSignal) => {
    try {
      const [detailPayload, imagePayload] = await Promise.all([
        ProductService.fetchProductById(productId, { signal }),
        ProductImageService.fetchProductImages(productId, { signal })
      ]);

      console.log(
        "Product detail payload:",
        JSON.stringify({ product: detailPayload, images: imagePayload }, null, 2)
      );

      setDetail(detailPayload);
      setImageUrls(imagePayload.map((img) => img.imageUrl));

      const row: ProductRow = {
        productId: detailPayload.id,
        id: `PR${detailPayload.id.toString().padStart(4, "0")}`,
        name: detailPayload.name,
        subtitle: detailPayload.material,
        imageUrl: imagePayload[0]?.imageUrl ?? "/img/placeholder.png",
        category: detailPayload.categoryName ?? "Unknown",
        price: detailPayload.price,
        quantity: detailPayload.quantity,
        currency: "VND"
      };

      setProduct(row);
      setError(null);
    } catch (err) {
      if ((err as any)?.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load product");
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!id) {
      setError("Missing product ID");
      return;
    }

    const targetId = Number(id);
    if (Number.isNaN(targetId)) {
      setError("Invalid product ID");
      return;
    }

    setLoading(true);
    const controller = new AbortController();
    await loadProduct(targetId, controller.signal);
    setLoading(false);
  }, [id, loadProduct]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const load = async () => {
      if (!id) {
        setError("Missing product ID");
        setLoading(false);
        return;
      }

      const targetId = Number(id);
      if (Number.isNaN(targetId)) {
        setError("Invalid product ID");
        setLoading(false);
        return;
      }

      await loadProduct(targetId, controller.signal);
      setLoading(false);
    };

    load();

    return () => controller.abort();
  }, [id, loadProduct]);

  return {
    product,
    detail,
    imageUrls,
    error,
    loading,
    refetch
  };
}
