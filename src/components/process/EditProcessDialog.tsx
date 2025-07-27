"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  name: string;
  shortForm: string;
  targetDays: number;
  userUniqueIds: string;
  setName: (val: string) => void;
  setShortForm: (val: string) => void;
  setTargetDays: (val: number) => void;
  setUserUniqueIds: (val: string) => void;
  onUpdate: () => void;
};

export default function EditProcessDialog({
  open,
  onOpenChange,
  name,
  shortForm,
  targetDays,
  userUniqueIds,
  setName,
  setShortForm,
  setTargetDays,
  setUserUniqueIds,
  onUpdate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button onClick={onUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}