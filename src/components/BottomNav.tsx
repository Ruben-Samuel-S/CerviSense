import { useLocation, useNavigate } from "react-router-dom";
import { Home, Clock, BarChart3, Trophy, User } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "History", icon: Clock, path: "/history" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Challenge", icon: Trophy, path: "/challenge" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-2">
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
