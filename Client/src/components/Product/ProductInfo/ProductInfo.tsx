import React, { useState } from "react";
import type { ProductDetail } from "../../../services";
import type { ProductRow } from "../ProductTable/ProductTable";
import ProductGallery from "../ProductGallery/ProductGallery";

type ProductInfoProps = {
  product: ProductRow;
  detail?: ProductDetail;
  images?: string[];
  onEdit?: () => void;
};

export default function ProductInfo({ product, detail, images, onEdit }: ProductInfoProps) {
  const gallery = images && images.length > 0 ? images : [product.imageUrl, product.imageUrl];

  const [selectedImage, setSelectedImage] = useState(gallery[0]);
  const materialLabel = detail?.material ?? product.subtitle ?? "N/A";
  const categoryName = detail?.categoryName ?? product.category;
  const descriptionText = detail?.description ?? "No description available.";

  return (
    <div className="space-y-6">
      {/* 3 cột: thumbnail - ảnh lớn - info */}
      <div className="flex items-start gap-10">
        <ProductGallery
          images={gallery}
          selectedImage={selectedImage}
          onSelect={setSelectedImage}
        />

        {/* RIGHT: info – căn giữa cột, max-width giống trang edit */}
        <div className="flex-1 flex justify-center pt-2">
          <div className="w-full max-w-[520px] text-sm text-slate-700 space-y-2">
            {/* Tên sản phẩm */}
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{product.name}</h3>

            {/* Các dòng thông tin */}
            <InfoRow label="Category">
              <span>{categoryName}</span>
            </InfoRow>

            <InfoRow label="Material">
              <span>{materialLabel}</span>
            </InfoRow>

            <InfoRow label="Description">
              <p className="text-xs leading-relaxed">{descriptionText}</p>
            </InfoRow>

            <InfoRow label="Quantity">
              <span>{product.quantity}</span>
            </InfoRow>

            {/* Giá + giảm giá + quantity */}
            <div className="mt-3 space-y-1">
              <div className="text-xl font-semibold text-slate-900">
                {product.price.toLocaleString("vi-VN")} VND
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-start gap-4">
              <button
                type="button"
                onClick={onEdit}
                className="min-w-[120px] rounded-md border border-[#1279C3] bg-[#E6F3FC] px-6 py-2 text-sm font-medium text-[#1279C3] hover:bg-[#d4e8f9]"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Hàng label/value cho phần info bên phải */
function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-[13px]">
      <div className="w-32 font-semibold text-slate-700">{label}:</div>
      <div className="flex-1 text-slate-700">{children}</div>
    </div>
  );
}
