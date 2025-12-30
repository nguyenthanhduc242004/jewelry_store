import { Button, Form, Input, message, Alert } from "antd";
import { useState } from "react";
import { PasswordService } from "../../../../../services/auth.service";

export default function ChangePassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await PasswordService.changePassword({
        currentPassword: values.oldPassword || "",
        newPassword: values.newPassword
      });
      setSuccess("Đổi mật khẩu thành công");
      form.resetFields();
    } catch (err: any) {
      setError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Đổi mật khẩu</h2>
      <Form layout="vertical" form={form} style={{ maxWidth: 600 }} onFinish={handleSubmit}>
        <Form.Item
          name="oldPassword"
          label={
            <span className="text-[20px]">Mật khẩu cũ (bỏ qua nếu đăng nhập bằng Google)</span>
          }
          rules={[{ required: false }]}
        >
          <Input.Password size="large" placeholder="Mật khẩu cũ" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={<span className="text-[20px]">Mật khẩu mới</span>}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" }
          ]}
        >
          <Input.Password size="large" placeholder="Mật khẩu mới" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={<span className="text-[20px]">Xác nhận mật khẩu mới</span>}
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
              }
            })
          ]}
        >
          <Input.Password size="large" placeholder="Xác nhận mật khẩu mới" />
        </Form.Item>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
        {success && (
          <Alert message={success} type="success" showIcon style={{ marginBottom: 16 }} />
        )}
        <Form.Item>
          <Button
            className="!bg-[#4096ff] hover:opacity-80"
            type="primary"
            size="large"
            htmlType="submit"
            loading={loading}
          >
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
