import { Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, Database, LineChart, Heart, Bell, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: PlusCircle, label: "Add Cow", path: "/add-cow" },
    { icon: Database, label: "Records", path: "/records" },
    { icon: LineChart, label: "Production", path: "/production" },
    { icon: Heart, label: "Breeding", path: "/breeding" },
    { icon: Bell, label: "Reminders", path: "/reminders" },
    { icon: DollarSign, label: "Expenses", path: "/expenses" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t md:relative md:border-t-0 md:border-r md:w-20 md:min-h-screen">
      <div className="flex justify-around md:flex-col md:justify-start md:pt-8">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center p-2 text-sm text-gray-600 hover:text-primary transition-colors",
              location.pathname === item.path && "text-primary"
            )}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="md:text-[10px]">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};