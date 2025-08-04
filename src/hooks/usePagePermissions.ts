import { useEffect, useState } from "react";
import api from "@/lib/axios";

export interface PagePermission {
  page: string;
  canView: boolean;
  canEdit: boolean;
}

export const usePagePermissions = (pageKey: string) => {
  const [canView, setCanView] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async() => {
      try {
        const res = await api.get("/api/permissions/me");
        const perms: PagePermission[] = res.data.permissions;

        const pagePerm = perms.find((p) => p.page === pageKey);

        setCanView(pagePerm?.canView ?? false);
        setCanEdit(pagePerm?.canEdit ?? false);
      } catch (error) {
        console.error("Failed to fetch permissions", error);
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions();
  }, [pageKey]);

  return { canEdit, canView, loading }
}