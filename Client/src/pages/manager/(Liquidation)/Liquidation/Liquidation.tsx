import { useNavigate } from "react-router-dom";
import LiquidationTable from "../../../../components/Liquidation/LiquidationTable/LiquidationTable";
import { type LiquidationRow } from "../../../../components/Liquidation/LiquidationTable/LiquidationTable";
import LiquidationFilterBar from "../../../../components/Liquidation/LiquidationFilterBar/LiquidationFilterBar";
const LiquidationRows: LiquidationRow[] = [
  {
    id: "LIQ001",
    date: "07/09/2024",
    creator: "Employee1",
    state: "pending",
  },
  {
    id: "LIQ001",
    date: "07/09/2024",
    creator: "Employee1",
    state: "success",
  },
  {
    id: "LIQ001",
    date: "07/09/2024",
    creator: "Employee1",
    state: "failed",
  },
];
export default function Liquidation() {
  const navigate = useNavigate();

  const handleView = (row: LiquidationRow) => {
    // tuỳ route của bạn
    navigate(`/manager/liquidation/${row.id}`);
  };

  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
        <div className="space-y-4">
                <LiquidationFilterBar />
        </div>   
      <section className="bg-white rounded-2xl p-6 shadow-sm">
              <LiquidationTable rows={LiquidationRows} onView={handleView}/>
            </section>
    </div>
  );
}
