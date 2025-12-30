import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";

export interface UseEmployeeDetailResult {
  employee: {
    avatarUrl: string;
    name: string;
    address: string;
    phone: string;
    email: string;
    birthday: string;
    position: string;
    account: string;
  };
  loading: boolean;
  error: string | null;
}

export function useEmployeeDetail(id?: string | number): UseEmployeeDetailResult {
  const [employee, setEmployee] = useState({
    avatarUrl: "/img/avt.png",
    name: "",
    address: "",
    phone: "",
    email: "",
    birthday: "",
    position: "",
    account: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No employee ID provided");
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([UserService.getUserById(Number(id)), UserService.getUserImage(Number(id))])
      .then(([data, imageData]) => {
        setEmployee({
          avatarUrl: imageData?.imageUrl || "/img/avt.png",
          name: data.fullName,
          address: data.address || "",
          phone: data.phone || "",
          email: data.email,
          birthday: data.birthday || "",
          position: data.role || "",
          account: data.email // use email as account
        });
      })
      .catch((err) => {
        setError(err.message || "Failed to load employee data");
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { employee, loading, error };
}
