import React, { useMemo, useState } from "react";

type ProductGalleryProps = {
  images: string[];
  selectedImage: string;
  onSelect: (url: string) => void;
};

export default function ProductGallery({ images, selectedImage, onSelect }: ProductGalleryProps) {
  const gallery = useMemo(() => (images.length > 0 ? images : []), [images]);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const canScroll = gallery.length > visibleCount;
  const canPrev = canScroll && startIdx > 0;
  const canNext = canScroll && startIdx + visibleCount < gallery.length;
  const visibleThumbs = canScroll ? gallery.slice(startIdx, startIdx + visibleCount) : gallery;

  return (
    <div className="flex items-start gap-10">
      {/* LEFT: thumbnails */}
      <div className="flex flex-col items-center gap-2 pt-2">
        {canScroll && (
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => setStartIdx((prev) => Math.max(0, prev - 1))}
            className={`h-7 w-7 rounded-full border text-xs ${
              canPrev ? "text-slate-600 hover:bg-slate-100" : "text-slate-300 cursor-not-allowed"
            }`}
          >
            ↑
          </button>
        )}

        <div
          className="flex flex-col gap-4"
          style={canScroll ? { maxHeight: "360px", overflow: "hidden" } : undefined}
        >
          {visibleThumbs.map((thumb, idx) => {
            const realIdx = canScroll ? startIdx + idx : idx;
            return (
              <button
                key={realIdx}
                type="button"
                onClick={() => onSelect(thumb)}
                className={`h-32 w-32 rounded-md overflow-hidden border bg-white transition ${
                  selectedImage === thumb ? "border-[#1279C3]" : "border-slate-300 hover:border-slate-400"
                }`}
              >
                <img src={thumb} alt={`thumb-${realIdx + 1}`} className="h-full w-full object-cover" />
              </button>
            );
          })}
        </div>

        {canScroll && (
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setStartIdx((prev) => Math.min(gallery.length - visibleCount, prev + 1))}
            className={`h-7 w-7 rounded-full border text-xs ${
              canNext ? "text-slate-600 hover:bg-slate-100" : "text-slate-300 cursor-not-allowed"
            }`}
          >
            ↓
          </button>
        )}
      </div>

      {/* CENTER: main image */}
      <div className="flex-1 flex justify-center pt-2">
        <div className="h-[420px] w-[420px] rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-white">
          <img src={selectedImage} alt="product-main" className="h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
