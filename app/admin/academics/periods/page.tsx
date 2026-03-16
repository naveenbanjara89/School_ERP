/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  sectionId: string;
  type: "class" | "break" | "lunch" | "Free";
}

interface Section {
  id: string;
  name: string;
  grade: string;
}

interface Branch {
  id: string;
  name: string;
}



export default function PeriodManagement() {
  const { toast } = useToast();

  const [sections, setSections] = useState<Section[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState("");
  const [selectedSectionId, setSelectedSectionId] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    branchId:"",
  });

  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyTargetId, setCopyTargetId] = useState("");

    /** Fetch branches */
    const fetchBranches = async () => {
    try {
        const res = await axiosInstance.get("/api/v1/branches");
        const list = res.data?.data || [];
        setBranches(list);

         if (list.length > 0) {
          setSelectedBranchId(list[0].id);
        }
    } catch {
        toast({
            title: "Error",
            description: "Failed to load branches",
            variant: "destructive",
        });
    }
    };

    useEffect(() => {
        fetchBranches();
    }, []);


  /* FETCH SECTIONS */
  const fetchSections = async (branchId: string) => {
    try {
      const res = await axiosInstance.get("/api/v1/sections", {
        params: { branchId },
      });

      const list = res.data?.data || [];

      setSections(list);

      if (list.length > 0) {
        setSelectedSectionId(list[0].id);
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to load sections",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
  if (selectedBranchId) {
    fetchSections(selectedBranchId);
  }
}, [selectedBranchId]);



  /* FETCH PERIODS BY SECTION */
const fetchPeriods = async (branchId?: string) => {
  try {
    setLoading(true);

    const params: any = {};

    if (branchId && branchId !== "all") {
      params.branchId = branchId;
    }

    const res = await axiosInstance.get("/api/v1/periods", { params });

    console.log("Periods API:", res.data);

    setPeriods(res.data?.data || []);

  } catch {
    toast({
      title: "Error",
      description: "Failed to load periods",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  
  fetchPeriods(selectedBranchId);

}, [selectedBranchId]);



  const currentSection = sections?.find((s) => s.id === selectedSectionId);



  /* OPEN DIALOGS */
  const openAddDialog = () => {
    setEditingPeriod(null);
    setFormData({ name: "", startTime: "", endTime: "", branchId: "" });
    setDialogOpen(true);
  };

  const openEditDialog = (p: Period) => {
    setEditingPeriod(p);
    setFormData({ name: p.name, startTime: p.startTime, endTime: p.endTime, branchId: "" });
    setDialogOpen(true);
  };

  /* ADD/UPDATE PERIOD */
  const handleSave = async () => {
    if (!formData.name || !formData.startTime || !formData.endTime) {
      return toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
    }
    if (formData.startTime >= formData.endTime) {
      return toast({ title: "Validation Error", description: "End time must be after start", variant: "destructive" });
    }

    try {
      if (editingPeriod) {
        // UPDATE
        const res = await axiosInstance.put(`/api/v1/periods/${editingPeriod.id}`, {
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });

        toast({ title: "Updated", description: "Period updated successfully" });
      } else {
        // CREATE
        await axiosInstance.post("/api/v1/periods", {
          branchId: selectedBranchId,
          sectionId: selectedSectionId,
          name: formData.name,
          startTime: formData.startTime,
          endTime: formData.endTime,
        });

        toast({ title: "Created", description: "Period added successfully" });
      }
      fetchPeriods(selectedSectionId);
      setDialogOpen(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.message || "API failure", variant: "destructive" });
    }
  };

  /* DELETE PERIOD */
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/periods/${id}`);
      toast({ title: "Deleted", description: "Period removed successfully" });
      fetchPeriods(selectedSectionId);
    } catch {
      toast({ title: "Error", description: "Delete failed", variant: "destructive" });
    }
  };

  /* COPY SCHEDULE */
  const handleCopySchedule = async () => {
    if (!copyTargetId || !currentSection) return;

    try {
      // delete target existing
      const targetPeriodsRes = await axiosInstance.get("/api/v1/periods", { params: { sectionId: copyTargetId } });
      const targetPeriods = targetPeriodsRes.data.data;
      await Promise.all(targetPeriods.map((p: any) => axiosInstance.delete(`/api/v1/periods/${p.id}`)));

      // copy each
      await Promise.all(periods.map((p) => axiosInstance.post("/api/v1/periods", {
        sectionId: copyTargetId,
        name: p.name,
        startTime: p.startTime,
        endTime: p.endTime,
        type: p.type,
      })));

      toast({ title: "Copied", description: "Schedule copied successfully" });
      fetchPeriods(selectedSectionId);
      setCopyDialogOpen(false);
    } catch {
      toast({ title: "Error", description: "Schedule copy failed", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Period Management</h1>
            <p className="text-muted-foreground">Configure and manage schedule periods</p>
          </div>

          <div className="flex gap-2">
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-1" /> Add Period
            </Button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-4">

              <Select
                value={selectedBranchId}
                onValueChange={(value) => {
                  setSelectedBranchId(value);
                }}
              >
              <SelectTrigger className="w-64">
              <SelectValue placeholder="All Branches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                    </SelectItem>
                ))}
              </SelectContent>
          </Select>
        </div>

        {/* TABLE */}
        <Card>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead >Start</TableHead>
                  <TableHead >End</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {periods.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.startTime.slice(11,16)}</TableCell>
                    <TableCell>{p.endTime.slice(11,16)}</TableCell>
                    <TableCell className="text-right flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(p)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* ADD/EDIT DIALOG */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{ editingPeriod ? "Edit Period" : "Add Period" }</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
              <Label>Branch</Label>
              <Select
              value={selectedBranchId}
                onValueChange={(value) => {
                  setSelectedBranchId(value);
                  setSelectedSectionId("");
                }}
              >
                  <SelectTrigger>
                  <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                        </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>

                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>{ editingPeriod ? "Update" : "Add" }</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AdminLayout>
  );
}
