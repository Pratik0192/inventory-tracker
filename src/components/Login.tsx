"use client";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function Login() {
  const router = useRouter();
  const [uniqueId, setUniqueId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        uniqueId,
        password,
      });

      toast.success("Login successful");

      const { role } = response.data;

      if (role === "ADMIN" || role === "VENDOR") {
        router.push("/common");
      } else if (role === "PROCESS_COORDINATOR") {
        router.push("/process-coordinate");
      } else {
        toast.error("Invalid user role");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("User not found");
      } else if (err.response?.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark px-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-sidebar-dark border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary-light dark:text-gray-200">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueId" className="dark:text-white">
                Unique ID
              </Label>
              <Input
                id="uniqueId"
                type="text"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                required
                placeholder="Enter your Unique ID"
                className="dark:bg-sidebar-dark dark:border-gray-700 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-white">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="dark:bg-sidebar-dark dark:border-gray-700 dark:text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
