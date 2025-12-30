import { useNavigate, useParams } from "react-router-dom";
import EditProduct, { type ProductForm } from "../../../../components/Product/EditProduct/EditProduct";
import useProductDetail from "../../../../hooks/useProductDetail";
import useUpdateProduct from "../../../../hooks/useUpdateProduct";

export default function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { product, detail, imageUrls: images, error, loading } = useProductDetail(id);
  const { save, saving, error: saveError } = useUpdateProduct(id, detail?.categoryId, images);


  const handleCancel = () => {
    navigate(`/manager/product/${id}`);
  };

  const handleSave = async (data: ProductForm) => {
    const ok = await save(data);
    if (ok) {
      navigate(`/manager/product/${id}`);
    }
  };

  return (
    <div className="space-y-5 mt-3">
      <h2 className="text-xl font-semibold text-[#1279C3] ">
            Product Information
      </h2>
      {saveError && <div className="text-sm text-red-600">{saveError}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-slate-500">Loading product...</div>}
      {product && (
        <EditProduct
          product={product}
          detail={detail}
          images={images}
          saving={saving}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
