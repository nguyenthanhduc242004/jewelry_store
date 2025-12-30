import { useNavigate } from "react-router-dom";
import { LogOut, Bell } from "lucide-react";
import { AuthService } from "../../../services";
import { useDisplayName } from "../../../hooks/useDisplayName";
import { useUserAvatar } from "../../../hooks/useUserAvatar";

export default function Topbar() {
  const navigate = useNavigate();
  const displayName = useDisplayName();
  const avatarUrl = useUserAvatar();
  const handleProfileClick = () => {
    navigate("/manager/profile");
  };
  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="w-full px-6 py-3 flex items-center justify-end bg-white">
      {/* Right side: avatar + username + logout + bell */}
      <div className="flex items-center gap-4">
        {/* Avatar + username */}
        <div className="flex items-center gap-2">
          <img
            onClick={handleProfileClick}
            src={avatarUrl || "/img/avt.png"}
            alt="Avatar"
            className="h-8 w-8 rounded-full object-cover cursor-pointer"
          />
          <span className="text-xs font-medium text-slate-600">{displayName || "Account"}</span>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#DDE4F0] text-[#1279C3] hover:bg-[#1279C3]/5"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
