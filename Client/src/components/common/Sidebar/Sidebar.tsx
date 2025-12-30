import { NavLink } from "react-router-dom";


const navItems = [
  { label: "Dashboard", to: "/manager/dashboard" },
  { label: "Product", to: "/manager/product" },
  { label: "Employee", to: "/manager/employee" },
  { label: "Customer", to: "/manager/customer" },
  { label: "Supplier", to: "/manager/supplier" },
  { label: "Order", to: "/manager/order" },
  { label: "Import", to: "/manager/import" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 bg-[#1279C3] text-white h-screen p-6 flex flex-col">
      {/* Logo + tên app: icon trên, chữ dưới, căn giữa */}
      <div className="flex flex-col items-center mb-10">
        <img
          src="/img/logo.png"
          alt="Luxora logo"
          className="w-10 h-10 object-contain mb-2"
        />
        <span className="text-2xl font-bold tracking-wide">Luxora</span>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "px-4 py-3 rounded-lg font-medium text-sm transition",
                "cursor-pointer select-none",
                isActive
                  ? "bg-white text-[#1279C3] shadow-sm"
                  : "text-white/80 hover:bg-white/20",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
