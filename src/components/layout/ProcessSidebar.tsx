"use client";

import api from "@/lib/axios";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ProcessCoordinatorSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/process-coordinator" },
    { name: "Follow Up", href: "/process-coordinator/follow" },
  ]

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/auth/logout");

      if (res.data.success) {
        toast.success("Logged out successfully");
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <aside className="h-screen w-64 shadow-md border-r p-4 flex flex-col justify-between bg-background text-foreground">
      <div>
        <div className="text-2xl font-semibold ml-4 mb-6 text-primary">
          Cloth Tracker
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2 rounded-md hover:bg-primary/10 dark:hover:bg-primary-dark/20 transition",
                pathname === item.href
                  ? "font-medium text-primary bg-primary/20"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <Button
        onClick={handleLogout}
        className="w-56 bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        Logout
      </Button>
    </aside>
  );
}