import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImportTable from "../../../../components/Import/ImportTable/ImportTable";
import ImportFilterBar from "../../../../components/Import/ImportFilterBar/ImportFilterBar";
import { useImports } from "../../../../hooks/useImports";
import { exportToPDF } from "../../../../utils/pdfExport";

export default function Import() {
  const navigate = useNavigate();
  const { rows, error } = useImports(0, 100);
  const [maxImportPrice, setMaxImportPrice] = useState(100_000_000);

  // Applied filters
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(100_000_000);

  useEffect(() => {
    if (rows.length > 0) {
      const maxPrice = rows.reduce((max, r) => Math.max(max, r.total), 0);
      setMaxImportPrice(maxPrice);
      setAppliedMaxPrice(maxPrice);
    }
  }, [rows]);

  const handleFilterChange = (filters: {
    fromDate: string;
    toDate: string;
    minPrice: number;
    maxPrice: number;
  }) => {
    setAppliedFromDate(filters.fromDate);
    setAppliedToDate(filters.toDate);
    setAppliedMinPrice(filters.minPrice);
    setAppliedMaxPrice(filters.maxPrice);
  };

  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Apply date range filter
    if (appliedFromDate) {
      const fromDate = new Date(appliedFromDate);
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate >= fromDate;
      });
    }

    if (appliedToDate) {
      const toDate = new Date(appliedToDate);
      filtered = filtered.filter((row) => {
        const rowDate = new Date(row.date.split("/").reverse().join("-"));
        return rowDate <= toDate;
      });
    }

    // Apply price range filter
    filtered = filtered.filter(
      (row) => row.total >= appliedMinPrice && row.total <= appliedMaxPrice
    );

    return filtered;
  }, [rows, appliedFromDate, appliedToDate, appliedMinPrice, appliedMaxPrice]);

  const handleRowClick = (row: { id: string }) => {
    // Extract numeric ID from display ID (IM0001 -> 1)
    const numericId = row.id.replace(/^IM0*/, "");
    navigate(`/manager/import/${numericId}`);
  };

  const handleExport = async () => {
    await exportToPDF({
      title: "Import List",
      columns: [
        { header: "Import ID", dataKey: "id", width: 30 },
        { header: "Supplier", dataKey: "supplier", width: 50 },
        { header: "Date", dataKey: "date", width: 35 },
        { header: "Total (VND)", dataKey: "total", width: 35 },
        { header: "Creator", dataKey: "creator", width: 40 }
      ],
      data: filteredRows,
      filename: `imports-${Date.now()}.pdf`,
      orientation: "portrait"
    });
  };

  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
      <div className="space-y-4">
        <ImportFilterBar
          onFilterChange={handleFilterChange}
          maxLimit={maxImportPrice}
          onExport={handleExport}
        />
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        {error ? (
          <div className="text-sm text-red-600">{error}</div>
        ) : (
          <ImportTable rows={filteredRows} onRowClick={handleRowClick} />
        )}
      </section>
    </div>
  );
}
