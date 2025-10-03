"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  onCreate: (name: string, fields: string) => Promise<boolean>;
}

export function CreateProjectDialog({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [fields, setFields] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!name || !fields) {
      toast.error("Please fill in all fields.");
      return;
    }
    const success = await onCreate(name, fields);
    if(success) {
      toast.success("Project created successfully!");
      setOpen(false); // Close dialog on success
      setName("");
      setFields("");
    } else {
      toast.error("Failed to create project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Give your new project a name and define the data fields you want to collect.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="My Awesome Tool" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fields" className="text-right">Fields</Label>
            <Input id="fields" value={fields} onChange={(e) => setFields(e.target.value)} className="col-span-3" placeholder="email, name, message" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}