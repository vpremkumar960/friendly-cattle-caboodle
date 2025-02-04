import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut, Home, PlusCircle, FileText, LineChart, Heart, Bell, DollarSign, Menu } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
      return;
    }
    navigate("/auth");
    toast.success("Logged out successfully");
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/add-cow", label: "Add Cow", icon: PlusCircle },
    { path: "/records", label: "Records", icon: FileText },
    { path: "/production", label: "Production", icon: LineChart },
    { path: "/breeding", label: "Breeding", icon: Heart },
    { path: "/reminders", label: "Reminders", icon: Bell },
    { path: "/expenses", label: "Expenses", icon: DollarSign },
  ];

  const NavigationContent = () => (
    <>
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Prasanth Farm</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <Link to={path} onClick={() => setOpen(false)}>
                <Button
                  variant={location.pathname === path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    location.pathname === path && "bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Prasanth Farm</h1>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-[240px]">
            <NavigationContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col h-full border-r bg-background w-[200px] md:w-[240px]">
        <NavigationContent />
      </div>
    </>
  );
};

export default Navigation;