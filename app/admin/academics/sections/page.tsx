/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { AdminLayout } from "@/components/layout/AdminLayout";

interface Branch {
  id: string;
  name: string;
}

interface SectionData {
  [x: string]: any;
  id: string;
  name: string;
  classId: string;
  className: string;
  branch?: Branch;
  capacity: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalSections: number;
}

export default function Sections() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [classes, setClasses] = useState<{ id: string; name: string; branchId: string; }[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  // const [filterClass, setFilterClass] = useState("");


  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalSections: 0,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    branchId: "",
    classId: "",
    capacity: "",
  });

  useEffect(() => {
    console.log("formData updated:", formData);
  }, [formData]);

  /* ---------------- FETCH DATA ---------------- */

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data?.data || []);
    } catch {
      toast.error("Failed to load branches");
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", {
        params: { perPage: 100,
            branchId:formData.branchId
         },
      });

      console.log("Fetched classes:", res.data);

      const classData =
        res.data?.data?.map((cls: any) => ({
          id: cls.id,              // ✅ IMPORTANT
          name: cls.name,
          branchId: cls.branchId,
        })) || [];

      setClasses(classData);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const fetchSections = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/api/v1/sections", {
        params: {
          page,
          perPage: pagination.perPage,
          search: searchQuery || undefined,
          branchId: filterBranch !== "all" ? filterBranch : undefined,
        },
      });

      setSections(res.data?.data || []);
      setPagination(res.data?.pagination || pagination);
    } catch {
      toast.error("Failed to load sections");
    }
  };

useEffect(() => {
  fetchClasses();
}, [filterBranch,formData.branchId]);

useEffect(() => {
  fetchSections(1);
  fetchBranches();
}, [searchQuery, filterBranch]);

  /* ---------------- ADD SECTION ---------------- */

  const handleAddSection = async () => {
    if (!formData.name || !formData.branchId || !formData.classId || !formData.capacity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axiosInstance.post("/api/v1/sections", {
        ...formData,
        capacity: Number(formData.capacity),
      });

      toast.success("Section created successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", branchId: "", classId: "", capacity: "" });
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create section");
    }
  };

  /* ---------------- EDIT SECTION ---------------- */

  const handleEditSection = async () => {
    if (!editingSection) return;

    try {
      await axiosInstance.put(`/api/v1/sections/${editingSection.id}`, {
        ...formData,
        capacity: Number(formData.capacity),
      });

      toast.success("Section updated successfully");
      setIsEditDialogOpen(false);
      setEditingSection(null);
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update section");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/sections/${id}`);
      toast.success("Section deleted successfully");
      fetchSections(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete section");
    }
  };

  const openEditDialog = (section: SectionData) => {
    setEditingSection(section);
    setFormData({
      name: section.name,
      branchId: section.branch?.id || "",
      classId: section.classId,
      capacity: section.capacity.toString(),
    });
    setIsEditDialogOpen(true);
  };

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-background">
        <div className="flex-1 flex flex-col">

          <main className="flex-1 p-6 space-y-6">

            {/* Header */}
            <div className="flex  justify-between items-center">
              <h1 className="text-2xl font-bold">Sections</h1>

              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Add Section
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add New Section</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">

                    <div>
                      <Label>Section Name</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Student Count</Label>
                      <Input
                        type="number"
                        value={formData.capacity}
                        onChange={(e) =>
                          setFormData({ ...formData, capacity: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Branch</Label>
                      <Select
                        value={formData.branchId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, branchId: value })
                        }
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

                    <div>
                      <Label>Class</Label>
                      <Select
                        value={formData.classId}
                        onValueChange={(value) =>
                          setFormData({ ...formData, classId: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent position="popper" className="z-50" >
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddSection}>Create Section</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  placeholder="Search classes..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                  className="flex-1"
                />
                <Select
                  value={filterBranch}
                  onValueChange={(value) => {
                    setFilterBranch(value);
                    fetchClasses(); // reset to page 1 on filter change
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by Branch" />
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

            {/* Table */}
            <div className="rounded-lg border bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Section</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {sections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6">
                        No sections found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell>{section.name}</TableCell>
                        <TableCell>{section.class.name || "N/A" }</TableCell>
                        <TableCell>{section.class.branch?.name || "N/A"}</TableCell>
                        <TableCell>{section.capacity}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(section)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(section.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </main>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Edit Section</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div>
              <Label>Student Count</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Branch</Label>
              <Select
                value={formData.branchId}
                onValueChange={(value) =>
                  setFormData({ ...formData, branchId: value })
                }
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

            <div>
              <Label>Class</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) =>
                  setFormData({ ...formData, classId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent position="popper" className="z-50" >
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSection}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
