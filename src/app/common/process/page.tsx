"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Process, Vendor } from "@/types";
import ProcessTable from "@/components/process/ProcessTable";
import EditProcessDialog from "@/components/process/EditProcessDialog";
import DeleteProcessDialog from "@/components/process/DeleteProcessDialog";
import MultiSelect from "@/components/ui/multi-select";
import { usePagePermissions } from "@/hooks/usePagePermissions";

export default function ProcessMaster() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [shortForm, setShortForm] = useState("");
  const [targetDays, setTargetDays] = useState<number>(0);
  const [userUniqueIds, setUserUniqueIds] = useState<string>("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);

  const { canView, canEdit, loading: permissionsLoading } = usePagePermissions("process_master");

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

  useEffect(() => {
    fetchVendors();
  }, []);

  if (permissionsLoading) {
    return <div className="p-4">Loading permissions...</div>;
  }

  if (!canView) {
    return <div className="p-4 text-red-500">You don’t have access to view this page.</div>;
  }

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">
        Process Master
      </h1>

      {canEdit && (
        <div className="grid md:grid-cols-4 gap-4 mb-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Process Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Short Form</label>
            <Input
              value={shortForm}
              onChange={(e) => setShortForm(e.target.value)}
              placeholder="Short Form"
            />
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
            <label className="text-sm font-medium">
              User Unique IDs (comma-separated)
            </label>
            <MultiSelect
              options={vendors.map((v) => ({
                label: v.name + " (" + v.uniqueId + ")",
                value: v.uniqueId,
              }))}
              selected={userUniqueIds
                .split(",")
                .map((id) => id.trim())
                .filter(Boolean)}
              onChange={(vals) => setUserUniqueIds(vals.join(","))}
            />
          </div>
          <Button className="h-10" onClick={handleAdd}>
            Add Process
          </Button>
        </div>
      )}

      <ProcessTable
        processes={processes}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        canEdit={canEdit}
      />

      <EditProcessDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        name={name}
        shortForm={shortForm}
        targetDays={targetDays}
        userUniqueIds={userUniqueIds}
        setName={setName}
        setShortForm={setShortForm}
        setTargetDays={setTargetDays}
        setUserUniqueIds={setUserUniqueIds}
        onUpdate={handleUpdate}
      />

      <DeleteProcessDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedProcess={selectedProcess}
        onDelete={handleDelete}
      />
    </div>
  );
}
