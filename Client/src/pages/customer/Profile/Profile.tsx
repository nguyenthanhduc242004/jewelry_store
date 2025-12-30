import { Col, Divider, Row, message } from "antd";
import Heading from "../components/Heading";
import { useState, useEffect } from "react";
import "./Profile.css";
import AccountInformation from "./components/AccountInformation";
import ChangePassword from "./components/ChangePassword/ChangePassword";
import { Link, Route, Routes } from "react-router-dom";
import { AuthService, UserService, type UserProfile } from "../../../services";

export default function Profile() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const meData = await AuthService.me();
      if (meData.authenticated && meData.userId) {
        const [profile, imageData] = await Promise.all([
          UserService.getUserById(meData.userId),
          UserService.getUserImage(meData.userId)
        ]);

        // Add avatar URL to profile
        setUserProfile({
          ...profile,
          avatarUrl: imageData?.imageUrl
        });
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      message.error("Không thể tải thông tin người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="main-container">
        <div className="text-center py-12">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <Heading className="!mt-12 !mb-0" text="Tài khoản của bạn" />
      <div className="h-[4px] bg-black w-[80px] mx-auto rounded mt-6 mb-12" />
      <Row className="mb-32 mt-20">
        <Col span={6}>
          <h3 className="text-[28px] mb-[30px]">Tài khoản</h3>
          <ul
            style={{
              listStyleType: "circle",
              listStylePosition: "inside"
            }}
          >
            <li className="list-item">
              <Link to="/profile">Thông tin tài khoản</Link>
            </li>
            <li className="list-item">
              <Link to="/profile/change-password">Đổi mật khẩu</Link>
            </li>
          </ul>
        </Col>
        <Col span={18} className="text-[28px]">
          <h3>Thông tin tài khoản</h3>
          <Divider />
          <Routes>
            <Route
              path="/"
              element={<AccountInformation userProfile={userProfile} onUpdate={fetchUserProfile} />}
            />
            <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
        </Col>
      </Row>
    </div>
  );
}
