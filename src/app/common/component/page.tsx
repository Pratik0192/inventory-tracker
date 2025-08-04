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
import { usePagePermissions } from "@/hooks/usePagePermissions";

type ComponentType = {
  id: number;
  name: string;
  Quant: string;
};

type Unit = {
  id: number;
  unitname: string;
};

export default function ComponentMaster() {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [name, setName] = useState("");
  const [quant, setQuant] = useState("");

  const [editName, setEditName] = useState("");
  const [editQuant, setEditQuant] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentType | null>(null);
  const { canView, canEdit, loading: permissionsLoading } = usePagePermissions("component_master");

  const fetchComponents = async () => {
    try {
      const res = await api.get("/api/component/get");
      setComponents(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch components");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async () => {
    try {
      const res = await api.get("/api/unit/get");
      console.log("🔥 FULL RESPONSE:", res);
      console.log("✅ res.data:", res.data);
      console.log("✅ res.data.data:", res.data.data);
      setUnits(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch units");
    }
  };

  const handleAddComponent = async () => {
    if (!name.trim() || !quant.trim()) {
      toast.error("Name and quantity are required");
      return;
    }

    try {
      await api.post("/api/component/add", {
        name,
        Quant: quant,
      });

      toast.success("Component added successfully");
      setName("");
      setQuant("");
      fetchComponents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add component");
    }
  };

  const openEditDialog = (component: ComponentType) => {
    setSelectedComponent(component);
    setEditName(component.name);
    setEditQuant(component.Quant);
    setEditDialogOpen(true);
  };

  const handleUpdateComponent = async () => {
    if (!editName.trim() || !editQuant.trim() || !selectedComponent) return;

    try {
      await api.put("/api/component/update", {
        id: selectedComponent.id,
        name: editName,
        Quant: editQuant,
      });

      toast.success("Component updated successfully");
      setEditDialogOpen(false);
      fetchComponents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const openDeleteDialog = (component: ComponentType) => {
    setSelectedComponent(component);
    setDeleteDialogOpen(true);
  };

  const handleDeleteComponent = async () => {
    if (!selectedComponent) return;

    try {
      await api.delete("/api/component/delete", {
        data: { id: selectedComponent.id },
      });

      toast.success("Component deleted successfully");
      setDeleteDialogOpen(false);
      fetchComponents();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [])

  if (permissionsLoading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  if (!canView) {
    return <div className="p-4 text-red-500">You don’t have access to view this page.</div>;
  }

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">
        Component Master
      </h1>

      {canEdit && (
        <div className="flex gap-4 mb-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Component Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter component name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Unit</label>
            <select
              value={quant}
              onChange={(e) => setQuant(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.unitname}>
                  {unit.unitname}
                </option>
              ))}
            </select>
          </div>

          <Button onClick={handleAddComponent}>Add Component</Button>
        </div>
      )}

      {/* List */}
      <Card className="bg-card text-card-foreground border border-border shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12 text-foreground">#</TableHead>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">Unit</TableHead>
                <TableHead className="text-center text-foreground">
                  {canEdit && "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && components.length > 0 ? (
                components.map((component, index) => (
                  <TableRow key={component.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="capitalize">
                      {component.name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {component.Quant}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(component)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(component)}
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
                    colSpan={4}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {loading ? "Loading..." : "No components found."}
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
            <DialogTitle>Edit Component</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Component name"
            />
            <select
              value={editQuant}
              onChange={(e) => setEditQuant(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit.id} value={unit.unitname}>
                  {unit.unitname}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateComponent}>Update</Button>
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
            <strong>{selectedComponent?.name}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteComponent}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
