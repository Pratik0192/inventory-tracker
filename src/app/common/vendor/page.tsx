"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Vendor } from "@/types";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export default function VendorMaster() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPhoneNo, setEditPhoneNo] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAddress, setEditAddress] = useState("");

  const {
    canView,
    canEdit,
    loading: permissionsLoading,
  } = usePagePermissions("vendor_master");

  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/vendor/get");
      setVendors(res.data.data || []);
    } catch {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVendor = async () => {
    if (!name || !phoneNo || !password) {
      toast.error("Name, phone number, and password are required");
      return;
    }

    try {
      await api.post("/api/vendor/add", { name, phoneNo, password });
      toast.success("Vendor added successfully");
      setName("");
      setPhoneNo("");
      setPassword("");
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add vendor");
    }
  };

  const openEditDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setEditName(vendor.name);
    setEditPhoneNo(vendor.phoneNo);
    setEditEmail(vendor.email || "");
    setEditAddress(vendor.address || "");
    setEditDialogOpen(true);
  };

  const handleUpdateVendor = async () => {
    if (!selectedVendor) return;

    try {
      await api.put("/api/vendor/update", {
        id: selectedVendor.id,
        name: editName,
        phoneNo: editPhoneNo,
        email: editEmail,
        address: editAddress,
      });

      toast.success("Vendor updated successfully");
      setEditDialogOpen(false);
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update vendor");
    }
  };

  const openDeleteDialog = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDeleteDialogOpen(true);
  };

  const handleDeleteVendor = async () => {
    if (!selectedVendor) return;

    try {
      await api.delete("/api/vendor/delete", {
        data: { id: selectedVendor.id },
      });

      toast.success("Vendor deleted successfully");
      setDeleteDialogOpen(false);
      fetchVendors();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete vendor");
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (permissionsLoading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  if (!canView) {
    return (
      <div className="p-4 text-red-500">
        You don’t have access to view this page.
      </div>
    );
  }

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">
        Vendor Master
      </h1>

      {/* Add Vendor */}
      {canEdit && (
        <div className="flex flex-wrap gap-4 mb-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vendor name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Phone number"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <Button onClick={handleAddVendor}>Add Vendor</Button>
        </div>
      )}

      {/* Vendor List */}
      <Card className="bg-card border border-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Unique Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead className="text-center text-foreground">
                  {canEdit && "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && vendors.length > 0 ? (
                vendors.map((vendor, index) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{vendor.uniqueId}</TableCell>
                    <TableCell className="capitalize">{vendor.name}</TableCell>
                    <TableCell>{vendor.phoneNo}</TableCell>
                    <TableCell>{vendor.email || "-"}</TableCell>
                    <TableCell>{vendor.address || "-"}</TableCell>
                    {canEdit && (
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(vendor)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(vendor)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {loading ? "Loading..." : "No vendors found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
            />
            <Input
              value={editPhoneNo}
              onChange={(e) => setEditPhoneNo(e.target.value)}
              placeholder="Phone"
            />
            <Input
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              placeholder="Email (optional)"
            />
            <Input
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="Address (optional)"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateVendor}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedVendor?.name}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteVendor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
