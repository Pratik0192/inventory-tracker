"use client";

import { Process } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Button } from "../ui/button";

type Props = {
  processes: Process[];
  loading: boolean;
  onEdit: (proc: Process) => void;
  onDelete: (proc: Process) => void;
};

export default function ProcessTable({ processes, loading, onEdit, onDelete }: Props) {
  return (
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
                    <Button size="sm" variant="outline" onClick={() => onEdit(proc)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(proc)}>
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
  )
}