"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import api from "@/lib/axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Size = {
  id: number;
  name: string;
  noOfPieces: number;
};

export default function SizeMaster() {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [name, setName] = useState("");
  const [noOfPieces, setNoOfPieces] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [editName, setEditName] = useState("");
  const [editNoOfPieces, setEditNoOfPieces] = useState("");

  const fetchSizes = async () => {
    try {
      const res = await api.get("/api/size/get");
      setSizes(res.data.data || [])
    } catch (error) {
      toast.error("Failed to fetch sizes")
    } finally {
      setLoading(false)
    }
  }

  const handleNameChange = (value: string) => {
    setName(value);

    // Match any two numbers separated by a non-digit character
    const match = value.match(/^(\d+)[^\d]?(\d+)$/);
    if (match) {
      const low = parseInt(match[1], 10);
      const high = parseInt(match[2], 10);
      if (!isNaN(low) && !isNaN(high) && high > low) {
        const pieces = Math.floor((high - low) / 2) + 1;
        setNoOfPieces(pieces.toString());
      }
    }
  }; 

  const handleAddSize = async() => {
    if (!name.trim() || !noOfPieces.trim()) {
      toast.error("All fields are required");
      return;
    }
    try {

      const match = name.match(/^(\d+)[^\d]?(\d+)$/);
      const formattedName = match ? `${match[1]}x${match[2]}` : name;

      const res = await api.post("/api/size/add", {
        name: formattedName,
        noOfPieces: Number(noOfPieces),
      })

      toast.success("Size added successfully")
      setName("");
      setNoOfPieces("");
      fetchSizes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to add size");
    }
  }
  
  useEffect(() => {
    fetchSizes();
  }, [])

  const openEditDialog = (size: Size) => {
    setSelectedSize(size);
    setEditName(size.name);
    setEditNoOfPieces(size.noOfPieces.toString());
    setEditDialogOpen(true);
  };

  const handleUpdateSize = async () => {
    if (!editName.trim() || !editNoOfPieces.trim() || !selectedSize) return;

    try {
      const match = editName.match(/^(\d+)[^\d]?(\d+)$/);
      const formattedName = match ? `${match[1]}x${match[2]}` : editName;

      await api.put("/api/size/update", {
        id: selectedSize.id,
        name: formattedName,
        noOfPieces: Number(editNoOfPieces),
      });

      toast.success("Size updated successfully");
      setEditDialogOpen(false);
      fetchSizes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  const openDeleteDialog = (size: Size) => {
    setSelectedSize(size);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSize = async () => {
    if (!selectedSize) return;

    try {
      await api.delete("/api/size/delete", {
        data: { id: selectedSize.id },
      });

      toast.success("Size deleted successfully");
      setDeleteDialogOpen(false);
      fetchSizes();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">Size Master</h1>

      <div className="flex gap-4 mb-4 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Size Name</label>
          <Input 
            value={name} 
            onChange={(e) => handleNameChange(e.target.value)} 
            placeholder="Enter Size name" 
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">No. of Pieces</label>
          <Input
            type="number"
            value={noOfPieces}
            onChange={(e) => setNoOfPieces(e.target.value)}
            placeholder="e.g. 1, 2, 10"
          />
        </div>
        <Button onClick={handleAddSize}>Add Size</Button>
      </div>

      {/* list */}
      <Card className="bg-card text-card-foreground border border-border shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12 text-foreground">#</TableHead>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">No. of Pieces</TableHead>
                <TableHead className="text-foreground text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <TableRow key={size.id}>
                    <TableCell className="text-foreground">{index + 1}</TableCell>
                    <TableCell className="text-foreground">{size.name}</TableCell>
                    <TableCell className="text-foreground">{size.noOfPieces}</TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(size)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => openDeleteDialog(size)}>
                        Delete
                      </Button>
                  </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                    {loading ? "Loading..." : "No sizes found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* edit dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Size</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Size name"
            />
            <Input
              type="number"
              value={editNoOfPieces}
              onChange={(e) => setEditNoOfPieces(e.target.value)}
              placeholder="No. of Pieces"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleUpdateSize}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* delete dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{selectedSize?.name}</strong>?</p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteSize}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}