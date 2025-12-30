// src/router/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import ManagerLayout from "../layouts/ManagerLayout";
import Profile from "../pages/manager/(Profile)/Profile";
import Dashboard from "../pages/manager/(Dashboard)/Dashboard";
import Product from "../pages/manager/(Product)/Product";
import ProductAddPage from "../pages/manager/(Product)/ProductAddPage/ProductAddPage";
import ProductDetail from "../pages/manager/(Product)/ProductDetail/ProductDetail";
import ProductEdit from "../pages/manager/(Product)/ProductEdit/ProductEdit";
import Report from "../pages/manager/(Dashboard)/Report";
import Revenue from "../pages/manager/(Dashboard)/Revenue/Revenue";
import Cost from "../pages/manager/(Dashboard)/Cost/Cost";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import Employee from "../pages/manager/(Employee)/Employee/Employee";
import EmployeeDetail from "../pages/manager/(Employee)/EmployeeDetail/EmployeeDetail";
import EmployeeAddPage from "../pages/manager/(Employee)/EmployeeNew/EmployeeAddPage";
import Customer from "../pages/manager/(Customer)/Customer/Customer";
import CustomerDetail from "../pages/manager/(Customer)/CustomerDetail/CustomerDetail";
import Bill from "../pages/manager/(Customer)/Bill/Bill";
import Import from "../pages/manager/(Import)/Import/Import";
import AddImport from "../pages/manager/(Import)/AddImport/AddImport";
import Order from "../pages/manager/(Order)/Order/Order";
import AddOrder from "../pages/manager/(Order)/AddOrder/AddOrder";
import OrderDetail from "../pages/manager/(Order)/OrderDetail/OrderDetail";
import ImportDetail from "../pages/manager/(Import)/ImportDetail/ImportDetail";
import Supplier from "../pages/manager/(Supplier)/Supplier/Supplier";
import RequireAuth from "./RequireAuth";
import RedirectIfAuthed from "./RedirectIfAuthed";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/customer/Home";
import { default as CustomerProductDetail } from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import { default as CustomerProfile } from "../pages/customer/Profile";
import AccountInformation from "../pages/customer/Profile/components/AccountInformation";
import ChangePassword from "../pages/customer/Profile/components/ChangePassword/ChangePassword";

const AppRouter = () => {
  return (
    <Routes>
      {/* "/" -> prefer /manager if authed, else /login */}
      <Route path="/" element={<Navigate to="/manager" replace />} />

      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuthed>
            <SignupPage />
          </RedirectIfAuthed>
        }
      />

      {/* Public customer page */}
      <Route path="/" element={<CustomerLayout />}>
        {/* / */}
        <Route index element={<Home />} />

        {/* /products/:id (customer product detail) */}
        <Route path="products/:id" element={<CustomerProductDetail />} />
        {/* /product-detail (legacy or static) */}
        <Route path="/product-detail" element={<CustomerProductDetail />} />

        {/* /cart */}
        <Route path="/cart" element={<Cart />} />

        {/* /profile */}
        <Route path="/profile" element={<CustomerProfile />}>
          <Route index />
          {/* /profile/change-password */}
          <Route path="/profile/change-password" />
        </Route>
      </Route>

      {/* Protected manager area */}
      <Route
        path="/manager"
        element={
          <RequireAuth>
            <ManagerLayout />
          </RequireAuth>
        }
      >
        {/* /manager */}
        <Route index element={<Dashboard />} />

        {/* /manager/dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* /manager/profile */}
        <Route path="profile" element={<Profile />} />

        {/* /manager/product */}
        <Route path="product" element={<Product />} />
        {/* /manager/product/add */}
        <Route path="product/add" element={<ProductAddPage />} />
        {/* /manager/product/:id */}
        <Route path="product/:id" element={<ProductDetail />} />
        {/* /manager/product/:id/edit */}
        <Route path="product/:id/edit" element={<ProductEdit />} />

        {/* /manager/employee */}
        <Route path="employee" element={<Employee />} />
        {/* /manager/employee/employeeinfo */}
        <Route path="employee/:id" element={<EmployeeDetail />} />
        {/* /manager/user/add */}
        <Route path="user/add" element={<EmployeeAddPage />} />

        {/* /manager/customer*/}
        <Route path="customer" element={<Customer />} />
        {/* /manager/customer/:id */}
        <Route path="customer/:id" element={<CustomerDetail />} />
        {/* /manager/customer/:id/bill/:billId */}
        <Route path="customer/:id/:billId" element={<Bill />} />

        {/* /manager/supplier*/}
        <Route path="supplier" element={<Supplier />} />

        {/* /manager/import*/}
        <Route path="import" element={<Import />} />
        {/* /manager/import/new */}
        <Route path="import/new" element={<AddImport />} />
        {/* /manager/import/:lot*/}
        <Route path="import/:lot" element={<ImportDetail />} />

        {/* /manager/order*/}
        <Route path="order" element={<Order />} />
        {/* /manager/order/add */}
        <Route path="order/add" element={<AddOrder />} />
        {/* /manager/order/:id */}
        <Route path="order/:id" element={<OrderDetail />} />

        {/* /manager/report/... */}
        <Route path="report">
          {/* /manager/report */}
          <Route index element={<Report />} />
          {/* /manager/report/revenue */}
          <Route path="revenue" element={<Revenue />} />
          {/* /manager/report/cost */}
          <Route path="cost" element={<Cost />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRouter;
