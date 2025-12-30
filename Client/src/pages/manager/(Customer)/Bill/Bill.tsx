import { useParams } from "react-router-dom";
import {  useRef } from "react";
import BillInfo from "../../../../components/Customer/Bill/BillInfo";
import BillTable, { type BillRow } from "../../../../components/Customer/Bill/BillTable";
const bill = {
  id: "LOT001",
  customer: "supplier1",
  date: "02/09/2024",
  seller: "employee1",
};

const rows: BillRow[] = [
  {
    no: 1,
    name: "Product 1",
    subtitle: "Gold, Amethyst",
    imageUrl: "/img/image1.png",
    category: "Necklace",
    price: 10000000,
    quantity: 2,
    totalPrice: 20000000,
    currency: "VND",
  },
];


export default function Bill() {
  const { id, billId } = useParams<{ id: string; billId: string }>();
  const filterRef = useRef<HTMLDivElement | null>(null);
  
  // TODO: Fetch bill data using id and billId
  
  return (
    <div className="space-y-5 mt-3">
      {/* Hàng tiêu đề + nút */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">
            Bill Information
          </h2>
        </div>
      </div>
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <BillInfo bill={bill} />

        <BillTable rows={rows} />
      </section>
    </div>
  );
}
