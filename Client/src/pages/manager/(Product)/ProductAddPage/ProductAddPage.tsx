import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductNew, {
  type NewProductForm
} from "../../../../components/Product/ProductNew/ProductNew";
import { ProductService, UploadService } from "../../../../services";
import { ProductImageService } from "../../../../services/productImage.service";

export default function ProductAddPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSave = async (data: NewProductForm) => {
    try {
      setError(null);
      setSaving(true);

      // Validate required fields
      if (!data.name.trim()) {
        setError("Product name is required");
        setSaving(false);
        return;
      }
      if (!data.category.trim()) {
        setError("Category is required");
        setSaving(false);
        return;
      }
      if (!data.price.trim()) {
        setError("Price is required");
        setSaving(false);
        return;
      }

      // Parse category ID from category name
      // Since backend expects categoryId, we need to map category name to ID
      // The category field now holds the ID as a string
      const categoryId = parseInt(data.category);
      if (isNaN(categoryId)) {
        setError("Invalid category selected");
        setSaving(false);
        return;
      }

      // Create product with JSON payload
      const productPayload = {
        name: data.name,
        material: data.material,
        description: data.description || undefined,
        price: parseFloat(data.price),
        status: true,
        categoryId: categoryId
      };

      console.log("Creating product with payload:", productPayload);

      // Step 1: Create the product
      const createdProduct = await ProductService.createProduct(productPayload);

      // Step 2: Upload images if any, then link them to the product
      if (data.imageFiles && data.imageFiles.length > 0) {
        for (let i = 0; i < data.imageFiles.length; i++) {
          const file = data.imageFiles[i];
          try {
            // Upload image to server
            const imageUrl = await UploadService.uploadImage(file);

            // Create product image record
            await ProductImageService.createProductImage(createdProduct.id, {
              imageOrder: i + 1,
              imageUrl: imageUrl
            });
          } catch (imgError) {
            console.error(`Failed to upload image ${i + 1}:`, imgError);
            // Continue with other images even if one fails
          }
        }
      } else {
        // No image chosen, assign default image
        const defaultImageUrl =
          "https://res.cloudinary.com/djf63iwha/image/upload/v1765516658/images_1_ch634n.png";
        await ProductImageService.createProductImage(createdProduct.id, {
          imageOrder: 1,
          imageUrl: defaultImageUrl
        });
      }

      // Navigate to product detail page
      navigate(`/manager/product/${createdProduct.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5 mt-3">
      <h2 className="text-xl font-semibold text-[#1279C3] ">Product Information</h2>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-3">
          {error}
        </div>
      )}
      <ProductNew onCancel={handleCancel} onSave={handleSave} saving={saving} />
    </div>
  );
}
