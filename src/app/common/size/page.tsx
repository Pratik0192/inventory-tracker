"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  
  useEffect(() => {
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

    fetchSizes();
  }, [])

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">Size Master</h1>

      <Card className="bg-card text-card-foreground border border-border shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-12 text-foreground">#</TableHead>
                <TableHead className="text-foreground">Name</TableHead>
                <TableHead className="text-foreground">No. of Pieces</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <TableRow key={size.id}>
                    <TableCell className="text-foreground">{index + 1}</TableCell>
                    <TableCell className="text-foreground">{size.name}</TableCell>
                    <TableCell className="text-foreground">{size.noOfPieces}</TableCell>
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
    </div>
  )
}