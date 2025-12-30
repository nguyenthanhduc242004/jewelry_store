import {
  LockOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Input, Layout, Button, type MenuProps } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { checkAuth } from "../../router/auth";
import { AuthService } from "../../services/auth.service";
import { useUserAvatar } from "../../hooks/useUserAvatar";
import { CartService } from "../../services";
import { ChatBot } from "../../components/ChatBot";
import React from "react";

const { Search } = Input;

function getMenuItems(onLogout: () => void): MenuProps["items"] {
  return [
    {
      key: "1",
      label: (
        <Link className="block py-1 after:p-1 text-[16px]" rel="noopener noreferrer" to="/profile">
          Thông tin cá nhân
        </Link>
      ),
      icon: <UserOutlined />
    },
    {
      key: "2",
      label: (
        <Link
          className="block py-1 after:p-1 text-[16px]"
          rel="noopener noreferrer"
          to="/profile/change-password"
        >
          Đổi mật khẩu
        </Link>
      ),
      icon: <LockOutlined />
    },
    {
      key: "3",
      label: (
        <span className="block py-1 after:p-1 text-[16px] cursor-pointer" onClick={onLogout}>
          Đăng xuất
        </span>
      ),
      icon: <LogoutOutlined />
    }
  ];
}

export default function CustomerLayout() {
  const navigate = useNavigate();
  const [auth, setAuth] = React.useState<{ authenticated: boolean; fullName?: string }>({
    authenticated: false
  });
  const [loading, setLoading] = React.useState(true);
  const [cartCount, setCartCount] = React.useState(0);
  const avatarUrl = useUserAvatar();

  const fetchCartCount = React.useCallback(async () => {
    if (!auth.authenticated) {
      setCartCount(0);
      return;
    }
    try {
      const cart = await CartService.getMyCart();
      const totalQuantity = cart.items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalQuantity);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setCartCount(0);
    }
  }, [auth.authenticated]);

  React.useEffect(() => {
    let mounted = true;
    checkAuth().then((info) => {
      if (mounted) {
        setAuth({ authenticated: info.authenticated, fullName: info.fullName });
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  React.useEffect(() => {
    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { fullName, avatarUrl } = customEvent.detail || {};

      if (fullName) {
        setAuth((prev) => ({ ...prev, fullName }));
      }

      if (avatarUrl) {
        localStorage.setItem("avatarUrl", avatarUrl);
        window.dispatchEvent(new Event("avatar-updated"));
      }
    };

    window.addEventListener("profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("profile-updated", handleProfileUpdate);
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setAuth({ authenticated: false });
    navigate("/", { replace: true });
  };

  return (
    <Layout style={{ fontFamily: "Josefin Sans, sans-serif", minHeight: "auto" }}>
      <header className="bg-[#333333] text-white">
        <div className="flex relative my-4 mx-12 items-center">
          <Link className="flex items-center m-auto" to={{ pathname: "/" }}>
            <img src="/src/assets/logo.svg" />
          </Link>

          <div className="flex items-center absolute top-0 right-0 h-full gap-6">
            {auth.authenticated && (
              <Link to="/cart" className="mr-2 relative top-0.5">
                <Badge count={cartCount} size="small">
                  <ShoppingCartOutlined className="text-2xl text-white" />
                </Badge>
              </Link>
            )}
            {loading ? null : auth.authenticated ? (
              <>
                <div className="h-full hover:cursor-pointer">
                  <Dropdown
                    className="relative top-[10px]"
                    menu={{ items: getMenuItems(handleLogout) }}
                    placement="bottomCenter"
                    arrow
                  >
                    <div className="h-full flex items-center px-4">
                      <Avatar className="border border-solid border-white mr-2" src={avatarUrl} />
                      <span className="text-xl">{auth.fullName || "Tài khoản"}</span>
                    </div>
                  </Dropdown>
                </div>
                <LogoutOutlined
                  className="text-xl cursor-pointer hover:text-gray-300"
                  onClick={handleLogout}
                  title="Đăng xuất"
                />
              </>
            ) : (
              <>
                <Button
                  type="text"
                  className="text-white text-base"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button type="primary" className="text-base" onClick={() => navigate("/signup")}>
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div>
        <Outlet />
      </div>

      <footer className="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
        <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
            <div className="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8">
              <img className="w-30" src="/src/assets/logo.svg" alt="" />

              <p className="text-base leading-relaxed text-gray-600 mt-7">
                Nơi hội tụ những thiết kế trang sức tinh tế, mang đến vẻ đẹp vượt thời gian cho phụ
                nữ hiện đại
              </p>

              <ul className="flex items-center space-x-3 mt-9">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.633 7.997c.013.175.013.349.013.523 0 5.325-4.053 11.461-11.46 11.461-2.282 0-4.402-.661-6.186-1.809.324.037.636.05.973.05a8.07 8.07 0 0 0 5.001-1.721 4.036 4.036 0 0 1-3.767-2.793c.249.037.499.062.761.062.361 0 .724-.05 1.061-.137a4.027 4.027 0 0 1-3.23-3.953v-.05c.537.299 1.16.486 1.82.511a4.022 4.022 0 0 1-1.796-3.354c0-.748.199-1.434.548-2.032a11.457 11.457 0 0 0 8.306 4.215c-.062-.3-.1-.611-.1-.923a4.026 4.026 0 0 1 4.028-4.028c1.16 0 2.207.486 2.943 1.272a7.957 7.957 0 0 0 2.556-.973 4.02 4.02 0 0 1-1.771 2.22 8.073 8.073 0 0 0 2.319-.624 8.645 8.645 0 0 1-2.019 2.083z"></path>
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                  >
                    <svg
                      className="w-4 h-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                      <circle cx="16.806" cy="7.207" r="1.078"></circle>
                      <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
                    </svg>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex items-center justify-center text-white transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-blue-600 focus:bg-blue-600"
                  >
                    <svg
                      style={{ transform: "scale(0.8)" }}
                      fill="currentColor"
                      className="w-4 h-4"
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24.325 8.309s-2.655-.334-8.357-.334c-5.517 0-8.294.334-8.294.334A2.675 2.675 0 0 0 5 10.984v10.034a2.675 2.675 0 0 0 2.674 2.676s2.582.332 8.294.332c5.709 0 8.357-.332 8.357-.332A2.673 2.673 0 0 0 27 21.018V10.982a2.673 2.673 0 0 0-2.675-2.673zM13.061 19.975V12.03L20.195 16l-7.134 3.975z" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Sản phẩm
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Nhẫn{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Dây chuyền{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Bông tai{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Vòng tay{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Chính sách
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Chính sách đổi trả{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Bảo hành trọn đời{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Hướng dẫn mua hàng{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Kiểm định chất lượng{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Thanh toán & Vận chuyển{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Chăm sóc trang sức{" "}
                  </a>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
                Thông tin liên hệ
              </p>

              <ul className="mt-6 space-y-4">
                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    SĐT: 0827988679{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Email: luxora@jewelry.vn{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Zalo: 0827988679{" "}
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    title=""
                    className="flex text-base text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                  >
                    {" "}
                    Địa chỉ: 123 đường Lê Hồng Phong, Quận 7, Tp. Hồ Chí Minh{" "}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <hr className="mt-16 mb-10 border-gray-200" />

          <p className="text-sm text-center text-gray-600">
            © Copyright 2025, All Rights Reserved by Luxora
          </p>
        </div>
      </footer>

      {/* AI ChatBot */}
      <ChatBot />
    </Layout>
  );
}
