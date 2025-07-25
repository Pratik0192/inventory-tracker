"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type User = {
  id: number;
  name: string;
  uniqueId: string;
  phoneNo: string;
  email: string;
  role: string;
};

type Process = {
  id: number;
  name: string;
  shortForm: string;
  targetDays: number;
  concernedDept: User[];
};

export default function ProcessMaster() {

  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [shortForm, setShortForm] = useState("");
  const [targetDays, setTargetDays] = useState<number>(0);
  const [userUniqueIds, setUserUniqueIds] = useState<string>("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const fetchProcesses = async () => {
    try {
      const res = await api.get("/api/process/get");
      setProcesses(res.data.data || []);
    } catch {
      toast.error("Failed to fetch processes");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim() || !shortForm.trim()) {
      toast.error("Name and Short Form are required");
      return;
    }

    try {
      await api.post("/api/process/add", {
        name,
        shortForm,
        targetDays: Number(targetDays),
        userUniqueIds: userUniqueIds.split(",").map((id) => id.trim()),
      });

      toast.success("Process added successfully");
      setName("");
      setShortForm("");
      setTargetDays(0);
      setUserUniqueIds("");
      fetchProcesses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add process");
    }
  };

  const openEditDialog = (proc: Process) => {
    setSelectedProcess(proc);
    setName(proc.name);
    setShortForm(proc.shortForm);
    setTargetDays(proc.targetDays);
    setUserUniqueIds(proc.concernedDept.map((u) => u.uniqueId).join(", "));
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedProcess) return;

    try {
      await api.put("/api/process/update", {
        id: selectedProcess.id,
        name,
        shortForm,
        targetDays: Number(targetDays),
        userUniqueIds: userUniqueIds.split(",").map((id) => id.trim()),
      });

      toast.success("Process updated");
      setEditDialogOpen(false);
      fetchProcesses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update process");
    }
  };

  const openDeleteDialog = (proc: Process) => {
    setSelectedProcess(proc);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedProcess) return;

    try {
      await api.delete("/api/process/delete", {
        data: { id: selectedProcess.id },
      });

      toast.success("Process deleted");
      setDeleteDialogOpen(false);
      fetchProcesses();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to delete process");
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">Process Master</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Process Name" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Short Form</label>
          <Input value={shortForm} onChange={(e) => setShortForm(e.target.value)} placeholder="Short Form" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Target Days</label>
          <Input
            type="number"
            value={targetDays}
            onChange={(e) => setTargetDays(Number(e.target.value))}
            placeholder="Target Days"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">User Unique IDs (comma-separated)</label>
          <Input
            value={userUniqueIds}
            onChange={(e) => setUserUniqueIds(e.target.value)}
            placeholder="e.g. abc123, xyz456"
          />
        </div>
        <Button className="h-10" onClick={handleAdd}>Add Process</Button>
      </div>

      {/* Table */}
      <Card className="bg-card text-card-foreground border border-border shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Short Form</TableHead>
                <TableHead>Target Days</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && processes.length > 0 ? (
                processes.map((proc, i) => (
                  <TableRow key={proc.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{proc.name}</TableCell>
                    <TableCell>{proc.shortForm}</TableCell>
                    <TableCell>{proc.targetDays}</TableCell>
                    <TableCell>
                      {proc.concernedDept.map((u) => u.uniqueId).join(", ")}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(proc)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(proc)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    {loading ? "Loading..." : "No processes found."}
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
            <DialogTitle>Edit Process</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Process Name" />
            <Input value={shortForm} onChange={(e) => setShortForm(e.target.value)} placeholder="Short Form" />
            <Input
              type="number"
              value={targetDays}
              onChange={(e) => setTargetDays(Number(e.target.value))}
              placeholder="Target Days"
            />
            <Input
              value={userUniqueIds}
              onChange={(e) => setUserUniqueIds(e.target.value)}
              placeholder="User Unique IDs (comma-separated)"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{selectedProcess?.name}</strong>?</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}