"use client";

import api from "@/lib/axios"
import { pageConstants } from "@/constants/pageConstants"
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export default function PermissionsMaster() {
  const [vendors, setVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const permissionPages = pageConstants.filter(
    (page) => page.roles.includes("ADMIN") && !page.roles.includes("VENDOR")
  )

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await api.get("/api/permissions")
        setVendors(res.data.vendors)
      } catch {
        toast.error("Failed to load vendors")
      } finally {
        setLoading(false)
      }
    }

    fetchVendors()
  }, [])

  const handlePermissionChange = async({
    userId,
    page,
    field,
    value,
  }: {
    userId: number
    page: string
    field: "canView" | "canEdit"
    value: boolean
  }) => {
    try {
      const res = await api.post("/api/permissions/update", {
        userId,
        page,
        [field]: value,
      })

      setVendors((prev) =>
        prev.map((vendor) =>
          vendor.id === userId
            ? {
                ...vendor,
                permissions: vendor.permissions.map((perm: any) =>
                  perm.page === page
                    ? { ...perm, [field]: value }
                    : perm
                ),
              }
            : vendor
        )
      )

      toast.success("Permission updated")
    } catch (error) {
      toast.error("Failed to update permission")
    }
  }

  const getPermission = (
    vendor: any,
    page: string,
    type: "canView" | "canEdit"
  ) => {
    const perm = vendor.permissions.find((p: any) => p.page === page)
    return perm ? perm[type] : false
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Permissions Master</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="border px-4 py-2 text-left">Vendor Name</th>
                {permissionPages.map((page) => (
                  <th key={page.key} colSpan={2} className="border px-4 py-2 text-center">
                    {page.name}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="border px-4 py-2"></th>
                {permissionPages.map((page) => (
                  <>
                    <th key={page.key + "_view"} className="border px-4 py-1 text-sm">👁️</th>
                    <th key={page.key + "_edit"} className="border px-4 py-1 text-sm">✏️</th>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td className="border px-4 py-2 font-medium">{vendor.name}</td>
                  {permissionPages.map((page) => (
                    <>
                      <td className="border px-4 py-2 text-center">
                        <Checkbox
                          checked={getPermission(vendor, page.key, "canView")}
                          onCheckedChange={(checked) =>
                            handlePermissionChange({
                              userId: vendor.id,
                              page: page.key,
                              field: "canView",
                              value: Boolean(checked),
                            })
                          }
                        />
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <Checkbox
                          checked={getPermission(vendor, page.key, "canEdit")}
                          onCheckedChange={(checked) =>
                            handlePermissionChange({
                              userId: vendor.id,
                              page: page.key,
                              field: "canEdit",
                              value: Boolean(checked),
                            })
                          }
                        />
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}