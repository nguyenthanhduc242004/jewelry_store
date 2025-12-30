import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductInfo from "../../../../components/Product/ProductInfo/ProductInfo";
import GemstoneTable from "../../../../components/Product/GemstoneTable/GemstoneTable";
import useProductDetail from "../../../../hooks/useProductDetail";
import useGemstoneForm from "../../../../hooks/useGemstoneForm";
import useGemstoneEdit from "../../../../hooks/useGemstoneEdit";

export default function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const filterRef = useRef<HTMLDivElement | null>(null);
  const { product, detail, imageUrls, error, refetch } = useProductDetail(id);
  const {
    isAddingGemstone,
    newGemstone,
    loading,
    error: gemstoneError,
    handleAddGemstone,
    handleGemstoneChange,
    handleSaveGemstone,
    handleCancelAddGemstone
  } = useGemstoneForm(product?.productId, refetch);

  const {
    editingGemstone,
    loading: editLoading,
    error: editError,
    handleEditGemstone,
    handleEditChange,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteGemstone
  } = useGemstoneEdit(refetch);

  const handleEdit = () => {
    if (product) navigate(`/manager/product/${product.productId}/edit`);
  };

  const handleSaveEditWrapper = async () => {
    if (product) {
      await handleSaveEdit(product.productId);
    }
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex items-center gap-3 relative" ref={filterRef}>
        <h2 className="text-xl font-semibold text-[#1279C3] ">Product information</h2>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {product && (
        <section className="bg-white rounded-2xl p-6 shadow-sm space-y-6">
          <ProductInfo
            product={product}
            detail={detail ?? undefined}
            images={imageUrls}
            onEdit={handleEdit}
          />
          <GemstoneTable
            gemstones={detail?.gemstones ?? []}
            isAddingGemstone={isAddingGemstone}
            newGemstone={newGemstone}
            editingGemstone={editingGemstone}
            editLoading={editLoading}
            editError={editError}
            loading={loading}
            error={gemstoneError}
            onAddClick={handleAddGemstone}
            onFormChange={handleGemstoneChange}
            onFormSave={handleSaveGemstone}
            onFormCancel={handleCancelAddGemstone}
            onEditClick={handleEditGemstone}
            onEditChange={handleEditChange}
            onEditSave={handleSaveEditWrapper}
            onEditCancel={handleCancelEdit}
            onDeleteClick={handleDeleteGemstone}
          />
        </section>
      )}
    </div>
  );
}
