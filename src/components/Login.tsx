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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-xl bg-card border border-border text-card-foreground">
        <CardHeader>
          <CardTitle className="text-center text-2xl text-primary">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueId" className="text-foreground">
                Unique ID
              </Label>
              <Input
                id="uniqueId"
                type="text"
                value={uniqueId}
                onChange={(e) => setUniqueId(e.target.value)}
                required
                placeholder="Enter your Unique ID"
                className="bg-background border border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="bg-background border border-border text-foreground"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:opacity-90 transition"
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
