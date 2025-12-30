import {
  EditOutlined,
  EnvironmentOutlined,
  SaveOutlined,
  CloseOutlined,
  CameraOutlined
} from "@ant-design/icons";
import { Button, Input, DatePicker, Modal, message, Avatar, Upload } from "antd";
import React, { useState, useRef } from "react";
import {
  UserService,
  UploadService,
  type UserProfile,
  type UpdateUserDto
} from "../../../../../services";
import dayjs from "dayjs";

type AccountInformationProps = {
  userProfile: UserProfile | null;
  onUpdate: () => void;
};

const AccountInformation: React.FC<AccountInformationProps> = ({ userProfile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateUserDto>({
    fullName: userProfile?.fullName || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    address: userProfile?.address || "",
    birthday: userProfile?.birthday || null,
    status: userProfile?.status || true
  });
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapAddress, setMapAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || "");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setEditData({
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      birthday: userProfile?.birthday || null,
      status: userProfile?.status || true
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!userProfile) return;

    try {
      setSaving(true);
      await UserService.updateUser(userProfile.id, editData);
      message.success("Cập nhật thông tin thành công");

      // Dispatch event to update navbar if fullName changed
      if (editData.fullName !== userProfile.fullName) {
        window.dispatchEvent(
          new CustomEvent("profile-updated", {
            detail: { fullName: editData.fullName }
          })
        );
      }

      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("Failed to update profile:", err);
      message.error("Không thể cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      fullName: userProfile?.fullName || "",
      email: userProfile?.email || "",
      phone: userProfile?.phone || "",
      address: userProfile?.address || "",
      birthday: userProfile?.birthday || null,
      status: userProfile?.status || true
    });
  };

  const handleOpenMap = () => {
    setMapAddress(editData.address || "");
    setIsMapModalOpen(true);
  };

  const handleConfirmAddress = () => {
    setEditData({ ...editData, address: mapAddress });
    setIsMapModalOpen(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    setUploadingAvatar(true);
    try {
      const url = await UploadService.uploadImage(file);
      await UserService.updateUserImage(userProfile.id, url);
      setAvatarUrl(url);
      message.success("Cập nhật ảnh đại diện thành công");

      // Dispatch event to update navbar avatar
      window.dispatchEvent(
        new CustomEvent("profile-updated", {
          detail: { avatarUrl: url }
        })
      );

      onUpdate();
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      message.error("Không thể cập nhật ảnh đại diện");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!userProfile) {
    return <div className="text-[20px]">Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="text-[20px]">
      {!isEditing ? (
        <>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              <Avatar
                size={120}
                src={avatarUrl || userProfile.avatarUrl || "/img/avt.png"}
                icon={<CameraOutlined />}
              />
              <Button
                shape="circle"
                icon={<CameraOutlined />}
                className="absolute bottom-0 right-0"
                onClick={() => fileInputRef.current?.click()}
                loading={uploadingAvatar}
              />
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </div>
            <div>
              <div className="py-[7px]">
                <span>Tên người dùng: </span>
                <span className="font-bold">{userProfile.fullName}</span>
              </div>
              <div className="py-[7px]">
                <span>Email: </span>
                <span>{userProfile.email}</span>
              </div>
            </div>
          </div>
          <div className="py-[7px]">
            <span>Số điện thoại: </span>
            <span>{userProfile.phone || "Chưa có"}</span>
          </div>
          <div className="py-[7px]">
            <span>Ngày sinh: </span>
            <span>
              {userProfile.birthday ? dayjs(userProfile.birthday).format("DD/MM/YYYY") : "Chưa có"}
            </span>
          </div>
          <div className="py-[7px]">
            <span>Địa chỉ: </span>
            <span>{userProfile.address || "Chưa có"}</span>
          </div>
          <Button className="mt-4" type="primary" icon={<EditOutlined />} onClick={handleEdit}>
            Chỉnh sửa
          </Button>
        </>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Tên người dùng:</label>
            <Input
              size="large"
              value={editData.fullName}
              onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
              placeholder="Nhập tên"
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <Input
              size="large"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              placeholder="Nhập email"
            />
          </div>
          <div>
            <label className="block mb-2">Số điện thoại:</label>
            <Input
              size="large"
              value={editData.phone}
              onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="block mb-2">Ngày sinh:</label>
            <DatePicker
              size="large"
              style={{ width: "100%" }}
              value={editData.birthday ? dayjs(editData.birthday) : null}
              onChange={(date) =>
                setEditData({ ...editData, birthday: date ? date.toISOString() : null })
              }
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </div>
          <div>
            <label className="block mb-2">Địa chỉ:</label>
            <div className="flex gap-2">
              <Input
                size="large"
                value={editData.address || ""}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
              <Button size="large" icon={<EnvironmentOutlined />} onClick={handleOpenMap}>
                Chọn từ bản đồ
              </Button>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
              Lưu
            </Button>
            <Button icon={<CloseOutlined />} onClick={handleCancel}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      <Modal
        title="Chọn địa chỉ từ bản đồ"
        open={isMapModalOpen}
        onOk={handleConfirmAddress}
        onCancel={() => setIsMapModalOpen(false)}
        width={800}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <Input.TextArea
            rows={3}
            value={mapAddress}
            onChange={(e) => setMapAddress(e.target.value)}
            placeholder="Nhập địa chỉ hoặc chọn từ bản đồ bên dưới"
          />
          <div className="text-sm text-gray-500 mb-2">
            Tìm kiếm địa chỉ trên Google Maps và dán vào ô trên:
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4535970266226!2d106.66289731533427!3d10.77612939231575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c80767d%3A0x5a981a5efee9fd7d!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBLaG9hIGjhu41jIFThu7Egbmhpw6puIC0gxJDhuqFpIGjhu41jIFF14buRYyBnaWEgVFAuSENNIC0gVk5VSENNLVVTIChCSykgQ1MyIENhbXB1cw!5e0!3m2!1svi!2s!4v1639392000000!5m2!1svi!2s"
            width="100%"
            height="400"
            style={{ border: 0 }}
            loading="lazy"
          />
        </div>
      </Modal>
    </div>
  );
};

export default AccountInformation;
