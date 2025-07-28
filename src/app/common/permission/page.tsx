"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { pageConstants } from "@/constants/pageConstants";
import api from "@/lib/axios";
import { useState } from "react";
import { toast } from "sonner";

type PagePermissionState = {
  page: string;
  canView: boolean;
  canEdit: boolean;
};

export default function PermissionsMaster() {
  const [uniqueId, setUniqueId] = useState<string>("");
  const [permissions, setPermissions] = useState<PagePermissionState[]>([]);
  const [loading, setLoading] = useState(false);

  const vendorPages = pageConstants.filter((page) =>
    page.roles.includes("VENDOR")
  );

  const handleFetchPermissions = async() => {
    try {
      setLoading(true);
      const res = await api.post("/vendor/permissions/get", { uniqueId });
      const dbPermissions = res.data.data as PagePermissionState[];

      const merged = pageConstants.map((pg) => {
        const match = dbPermissions.find((perm) => perm.page === pg.key);
        return {
          page: pg.key,
          canView: match?.canView ?? false,
          canEdit: match?.canEdit ?? false,
        };
      });

      setPermissions(merged)
    } catch (err: any) {
      toast.error("Failed to load permissions.");
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePermissions = async() => {
    try {
      const payload = {
        uniqueId,
        permissions,
      }

      await api.put("/vendor/permissions/update", payload);
      toast.success("Permissions updated successfully");
    } catch (err: any) {
      toast.error("Failed to update permissions");
      console.error(err);
    }
  }

  const togglePermission = (
    page: string,
    field: "canView" | "canEdit",
    value: boolean
  ) => {
    setPermissions((prev) =>
      prev.map((perm) =>
        perm.page === page ? { ...perm, [field]: value } : perm
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Permissions Master</h2>

      <div className="flex items-center gap-4 mb-4">
        <Input
          type="text"
          placeholder="Enter Unique ID"
          value={uniqueId}
          onChange={(e) => setUniqueId(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleFetchPermissions} disabled={!uniqueId}>
          Fetch Permissions
        </Button>
      </div>

      {permissions.length > 0 && (
        <Card>
          <CardContent className="overflow-x-auto">
            <table className="w-full table-auto mt-4 border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Page Name</th>
                  <th className="p-2 text-center">Can View</th>
                  <th className="p-2 text-center">Can Edit</th>
                </tr>
              </thead>
              <tbody>
                {pageConstants.map((pg) => {
                  const perm = permissions.find((p) => p.page === pg.key);
                  return (
                    <tr key={pg.key} className="border-b">
                      <td className="p-2">{pg.name}</td>
                      <td className="p-2 text-center">
                        <Switch
                          checked={perm?.canView || false}
                          onCheckedChange={(val) =>
                            togglePermission(pg.key, "canView", val)
                          }
                        />
                      </td>
                      <td className="p-2 text-center">
                        <Switch
                          checked={perm?.canEdit || false}
                          onCheckedChange={(val) =>
                            togglePermission(pg.key, "canEdit", val)
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {permissions.length > 0 && (
        <div className="mt-4">
          <Button onClick={handleUpdatePermissions} disabled={loading}>
            {loading ? "Saving..." : "Save Permissions"}
          </Button>
        </div>
      )}
    </div>
  )
}