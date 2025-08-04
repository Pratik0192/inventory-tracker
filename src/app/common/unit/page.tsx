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

type Unit = {
  id: number;
  unitname: string;
};

export default function UnitMaster() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [unitname, setUnitname] = useState("");
  const [editUnitname, setEditUnitname] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const {
    canView,
    canEdit,
    loading: permissionsLoading,
  } = usePagePermissions("unit_master");

  const fetchUnits = async () => {
    try {
      const res = await api.get("/api/unit/get");
      setUnits(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async () => {
    if (!unitname.trim()) {
      toast.error("Unit name is required");
      return;
    }

    try {
      await api.post("/api/unit/add", {
        unitname,
      });

      toast.success("Unit added successfully");
      setUnitname("");
      fetchUnits();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add unit");
    }
  };

  const openEditDialog = (unit: Unit) => {
    setSelectedUnit(unit);
    setEditUnitname(unit.unitname);
    setEditDialogOpen(true);
  };

  const handleUpdateUnit = async () => {
    if (!editUnitname.trim() || !selectedUnit) return;

    try {
      await api.put("/api/unit/update", {
        id: selectedUnit.id,
        unitname: editUnitname,
      });

      toast.success("Unit updated successfully");
      setEditDialogOpen(false);
      fetchUnits();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const openDeleteDialog = (unit: Unit) => {
    setSelectedUnit(unit);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUnit = async () => {
    if (!selectedUnit) return;

    try {
      await api.delete("/api/unit/delete", {
        data: { id: selectedUnit.id },
      });

      toast.success("Unit deleted successfully");
      setDeleteDialogOpen(false);
      fetchUnits();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchUnits();
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
      <h1 className="text-2xl font-semibold mb-4 text-primary">Unit Master</h1>

      {canEdit && (
        <div className="flex gap-4 mb-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Unit Name</label>
            <Input
              value={unitname}
              onChange={(e) => setUnitname(e.target.value)}
              placeholder="Enter unit name"
            />
          </div>
          <Button onClick={handleAddUnit}>Add Unit</Button>
        </div>
      )}

      {/* List */}
      <Card className="bg-card text-card-foreground border border-border shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12 text-foreground">#</TableHead>
                <TableHead className="text-foreground">Unit Name</TableHead>
                <TableHead className="text-center text-foreground">
                  {canEdit && "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && units.length > 0 ? (
                units.map((unit, index) => (
                  <TableRow key={unit.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="capitalize">
                      {unit.unitname}
                    </TableCell>
                    {canEdit && (
                      <TableCell className="text-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(unit)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openDeleteDialog(unit)}
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
                    colSpan={3}
                    className="text-center py-4 text-muted-foreground"
                  >
                    {loading ? "Loading..." : "No units found."}
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
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={editUnitname}
              onChange={(e) => setEditUnitname(e.target.value)}
              placeholder="Unit name"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateUnit}>Update</Button>
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
            <strong>{selectedUnit?.unitname}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUnit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
