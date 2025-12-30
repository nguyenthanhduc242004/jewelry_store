import { useNavigate } from "react-router-dom";
import EmployeeAdd from "../../../../components/Employee/EmployeeAdd/EmployeeAdd";
import type { Employee } from "../../../../components/Employee/EmployeeProfile/EmployeeProfile";
import { useRef, useState } from "react";
import { UserService } from "../../../../services/user.service";
import { UploadService } from "../../../../services/upload.service";

export default function EmployeeAddPage() {
  const navigate = useNavigate();
  const filterRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (employee: Employee, avatarFile: File | null) => {
    setError("");
    setSaving(true);
    try {
      // Format birthday to ISO string
      let birthdayISO: string | null = null;
      if (employee.birthday) {
        const d = new Date(employee.birthday);
        if (!isNaN(d.getTime())) {
          birthdayISO = d.toISOString();
        }
      }

      // Create user with default password
      await UserService.createUser({
        fullName: employee.name,
        email: employee.email,
        password: "12345678", // default password
        phone: employee.phone,
        address: employee.address || null,
        birthday: birthdayISO,
        status: true,
        role: employee.position || undefined
      });

      // Get the created user ID by email (fetch user summary and find by email)
      const users = await UserService.fetchUserSummary(0, 100);
      const createdUser = users.find((u) => u.email === employee.email);

      if (createdUser && avatarFile) {
        // Upload avatar
        const uploadedUrl = await UploadService.uploadImage(avatarFile);
        await UserService.updateUserImage(createdUser.id, uploadedUrl);
      }

      // Navigate to employee list
      navigate("/manager/employee");
    } catch (e: any) {
      setError(e?.message || "Failed to create user");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/manager/employee");
  };

  return (
    <div className="space-y-5 mt-3">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 relative" ref={filterRef}>
          <h2 className="text-xl font-semibold tracking-tight text-[#1279C3]">Add New User</h2>
        </div>
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <section className="bg-white rounded-2xl p-6 shadow-sm">
        <EmployeeAdd onSave={handleSave} onCancel={handleCancel} saving={saving} />
      </section>
    </div>
  );
}
