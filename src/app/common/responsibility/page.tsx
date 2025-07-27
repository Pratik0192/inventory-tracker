"use client";

import { Card, CardContent } from "@/components/ui/card";
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

export default function ResponsibilityMaster() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchVendors();
  }, []);

  console.log("responsibility mmaster vendors", vendors);

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-primary">
        Responsibility Master
      </h1>

      {/* Vendor List */}
      <Card className="bg-card border border-border shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type of Work</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && vendors.length > 0 ? (
                vendors.map((vendor, index) => (
                  <TableRow key={vendor.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="capitalize">{vendor.name}</TableCell>
                    <TableCell>
                      {Array.isArray(vendor.typeOfWork) &&
                      vendor.typeOfWork.length > 0
                        ? vendor.typeOfWork.map((work) => work.value).join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell>{vendor.phoneNo}</TableCell>
                    <TableCell>{vendor.email || "-"}</TableCell>
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
    </div>
  );
}
