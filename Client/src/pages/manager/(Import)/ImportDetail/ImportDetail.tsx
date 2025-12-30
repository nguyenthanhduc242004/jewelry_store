import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ImportService } from "../../../../services/import.service";
import { SupplierService } from "../../../../services/supplier.service";
import { UserService } from "../../../../services/user.service";
import type { ImportDto, ImportDetailDto } from "../../../../services/import.service";
import { exportToPDF } from "../../../../utils/pdfExport";

const formatDate = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("vi-VN");
};

export default function ImportDetail() {
  const navigate = useNavigate();
  const { lot } = useParams<{ lot: string }>();
  const id = lot;
  console.log("ImportDetail id param:", id);
  const [importData, setImportData] = useState<ImportDto | null>(null);
  const [importDetails, setImportDetails] = useState<ImportDetailDto[]>([]);
  const [supplierName, setSupplierName] = useState<string>("");
  const [supplierAddress, setSupplierAddress] = useState<string>("");
  const [supplierPhone, setSupplierPhone] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      try {
        console.log("Fetching import data for ID:", id);
        const [importFormData, detailsData] = await Promise.all([
          ImportService.fetchImportById(Number(id), { signal: controller.signal }),
          ImportService.fetchImportDetails(Number(id), { signal: controller.signal })
        ]);
        console.log("Import data fetched:", importFormData, detailsData);
        setImportData(importFormData);
        setImportDetails(detailsData);

        // Fetch supplier details
        if (importFormData.supplierId) {
          try {
            console.log("Fetching supplier:", importFormData.supplierId);
            const supplier = await SupplierService.getSupplierById(importFormData.supplierId, {
              signal: controller.signal
            });
            console.log("Supplier fetched:", supplier);
            setSupplierName(supplier.name || "—");
            setSupplierAddress(supplier.address || "—");
            setSupplierPhone(supplier.phone || "—");
          } catch (err) {
            console.error("Failed to fetch supplier:", err);
            setSupplierName(`Supplier #${importFormData.supplierId}`);
            setSupplierAddress("—");
            setSupplierPhone("—");
          }
        }

        // Fetch creator name
        if (importFormData.staffId) {
          try {
            console.log("Fetching staff:", importFormData.staffId);
            const staff = await UserService.getUserById(importFormData.staffId, {
              signal: controller.signal
            });
            console.log("Staff fetched:", staff);
            setCreatorName(staff.fullName || `Staff #${importFormData.staffId}`);
          } catch (err) {
            console.error("Failed to fetch staff:", err);
            setCreatorName(`Staff #${importFormData.staffId}`);
          }
        }
      } catch (err) {
        console.error("Error loading import:", err);
        if ((err as any)?.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load import");
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Import Details</h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-slate-500">Loading import details...</div>
        </section>
      </div>
    );
  }

  if (error || !importData) {
    return (
      <div className="space-y-5 mt-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Import Details</h2>
          </div>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-center py-8 text-red-500">Error: {error || "Import not found"}</div>
        </section>
      </div>
    );
  }

  const subtotal = importDetails.reduce((sum, item) => sum + item.importPrice * item.quantity, 0);

  const handleExport = async () => {
    await exportToPDF({
      title: `Import Details - IM${importData.id.toString().padStart(4, "0")}`,
      columns: [
        { header: "Product", dataKey: "productName", width: 60 },
        { header: "Quantity", dataKey: "quantity", width: 25 },
        { header: "Price (VND)", dataKey: "importPrice", width: 40 },
        { header: "Total (VND)", dataKey: "total", width: 40 }
      ],
      data: importDetails.map((item) => ({
        productName: item.productName || `Product #${item.productId}`,
        quantity: item.quantity,
        importPrice: item.importPrice,
        total: item.importPrice * item.quantity
      })),
      filename: `import-detail-${importData.id}-${Date.now()}.pdf`,
      orientation: "portrait"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Import details</h2>
        </div>
        <div className="justify-end">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500 bg-white px-4 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 transition"
          >
            Export
          </button>
        </div>
      </div>

      {/* Import Information */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Import Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-500">Import ID</p>
            <p className="text-sm font-medium text-slate-700">
              IM{importData.id.toString().padStart(4, "0")}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Date Created</p>
            <p className="text-sm font-medium text-slate-700">
              {formatDate(importData.dateCreated)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Supplier Name</p>
            <p className="text-sm font-medium text-slate-700">{supplierName}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Creator</p>
            <p className="text-sm font-medium text-slate-700">{creatorName || "—"}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Supplier Address</p>
            <p className="text-sm font-medium text-slate-700">{supplierAddress}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Total Price</p>
            <p className="text-sm font-medium text-slate-700">
              {importData.totalPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Supplier Phone</p>
            <p className="text-sm font-medium text-slate-700">{supplierPhone}</p>
          </div>
        </div>
      </section>

      {/* Import Items */}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1279C3] mb-4">Import Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center">
            <thead>
              <tr className="bg-[#1279C3] text-white">
                <th className="px-4 py-3 rounded-l-xl font-medium text-center align-middle">
                  Product ID
                </th>
                <th className="px-4 py-3 font-medium text-center align-middle">Quantity</th>
                <th className="px-4 py-3 font-medium text-center align-middle">Import Price</th>
                <th className="px-4 py-3 rounded-r-xl font-medium text-center align-middle">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody>
              {importDetails.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                    No items in this import
                  </td>
                </tr>
              ) : (
                importDetails.map((item, index) => {
                  const bg =
                    index % 2 === 0
                      ? "bg-slate-50/60 border-b border-slate-100"
                      : "border-b border-slate-100";
                  return (
                    <tr
                      key={`${item.importId}-${item.productId}`}
                      className={`${bg} text-center cursor-pointer hover:bg-blue-50 transition`}
                      onClick={() => navigate(`/manager/product/${item.productId}`)}
                    >
                      <td className="px-4 py-3 text-xs font-semibold text-slate-700">
                        PRD{item.productId.toString().padStart(3, "0")}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {item.importPrice.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700">
                        {(item.importPrice * item.quantity).toLocaleString("vi-VN", {
                          maximumFractionDigits: 0
                        })}{" "}
                        VND
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 border-t-2 border-slate-300">
                <td
                  colSpan={3}
                  className="px-4 py-3 text-sm font-semibold text-right text-slate-700"
                >
                  Total:
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-center text-slate-700">
                  {subtotal.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} VND
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
