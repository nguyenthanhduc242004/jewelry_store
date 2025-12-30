import { useEffect, useState } from "react";
import { UserService } from "../services/user.service";

export type CustomerDetail = {
  avatarUrl: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  birthday: string;
};

export function useCustomerDetail(id?: string | number) {
  const [customer, setCustomer] = useState<CustomerDetail>({
    avatarUrl: "/img/avt.png",
    name: "",
    address: "",
    phone: "",
    email: "",
    birthday: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No customer ID provided");
      return;
    }
    setLoading(true);
    setError(null);
    const userId = Number(id);

    Promise.all([
      UserService.getUserById(userId),
      UserService.getUserImage(userId)
    ])
      .then(([userData, imageData]) => {
        setCustomer({
          avatarUrl: imageData?.imageUrl || "/img/avt.png",
          name: userData.fullName,
          address: userData.address ?? "",
          phone: userData.phone,
          email: userData.email,
          birthday: userData.birthday ?? "",
        });
      })
      .catch((e) => {
        setError(e.message || "Failed to load customer");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { customer, loading, error };
}
