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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, MoreHorizontal, BookOpen, Users, GraduationCap, Layers, BookMarked } from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";

interface Branch {
  id: string;
  name: string;
}

interface ClassData {
  id: string;
  name: string;
  branchId: string;
  branch?: Branch;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalClasses: number;
}

const subjectsData = [
  { id: "1", name: "Mathematics" },
  { id: "2", name: "Science" },
  { id: "3", name: "History" },
];

const branchesData = [
  { id: "1", name: "Science" },
  { id: "2", name: "Commerce" },
  { id: "3", name: "Arts" },
];

const classesData = [
  { id: "1", name: "Class 9-A", branchId: "1", branch: { id: "1", name: "Science" } },
  { id: "2", name: "Class 9-B", branchId: "2", branch: { id: "2", name: "Commerce" } },
  { id: "3", name: "Class 9-C", branchId: "3", branch: { id: "3", name: "Arts" } },
];

const sectionsData = [
  { id: "1", name: "Section A", classId: "1", class: { id: "1", name: "Class 9-A" } },
  { id: "2", name: "Section B", classId: "1", class: { id: "1", name: "Class 9-A" } },
  { id: "3", name: "Section A", classId: "2", class: { id: "2", name: "Class 9-B" } },
];

export default function Classes() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    perPage: 10,
    totalClasses: 0,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [filterBranch, setFilterBranch] = useState("")

  const [formData, setFormData] = useState({ name: "", branchId: "" });

  /** Fetch branches */
  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Failed to load branches");
    }
  };

  /** Fetch classes with server-side pagination and filters */
  const fetchClasses = async (page = 1) => {
    try {
      const res = await axiosInstance.get("/api/v1/classes", {
        params: {
          name: searchQuery || undefined,
          page,
          perPage: pagination.perPage,
          branchId: branchFilter !== "all" ? branchFilter : undefined,
        },
      });
      setClasses(res.data.data);
      setBranchFilter("all");
      // setSearchQuery("");
      // console.log(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  useEffect(() => {
    fetchBranches();
    // fetchClasses(1);
  }, []);

  useEffect(() => {
  fetchClasses(pagination.currentPage);
}, [searchQuery, branchFilter, pagination.currentPage, pagination.perPage]);

  /** Add class */
  const handleAddClass = async () => {
    if (!formData.name || !formData.branchId) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await axiosInstance.post("/api/v1/classes", formData);
      toast.success("Class created successfully");
      setIsAddDialogOpen(false);
      setFormData({ name: "", branchId: "" });
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create class");
    }
  };

  /** Edit class */
  const handleEditClass = async () => {
    if (!editingClass || !formData.name || !formData.branchId) return;
    try {
      await axiosInstance.put(`/api/v1/classes/${editingClass.id}`, formData);
      toast.success("Class updated successfully");
      setIsEditDialogOpen(false);
      setEditingClass(null);
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update class");
    }
  };

  /** Delete class */
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/v1/classes/${id}`);
      toast.success("Class deleted successfully");
      fetchClasses(pagination.currentPage);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete class");
    }
  };

  /** Open edit dialog */
  const openEditDialog = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({ name: cls.name, branchId: cls.branchId });
    setIsEditDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex min-h-screen bg-background">
        {/* <AdminSidebar /> */}
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="space-y-6">

              {/* Page Header */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="text-primary" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Academics</h1>
                  <p className="text-sm text-muted-foreground">Manage subjects, classes, sections & timetables</p>
                </div>
              </div>
      
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Subjects", value: subjectsData.length, icon: BookMarked, color: "text-primary bg-primary/10" },
                  { label: "Branches", value: branchesData.length, icon: Layers, color: "text-accent bg-accent/10" },
                  { label: "Classes", value: classesData.length, icon: GraduationCap, color: "text-emerald-600 bg-emerald-50" },
                  { label: "Sections", value: sectionsData.length, icon: Users, color: "text-amber-600 bg-amber-50" },
                ].map((stat) => (
                  <Card key={stat.label} className="shadow-card">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Classes</h1>
                  <p className="text-muted-foreground">Manage class assignments</p>
                </div>

                {/* Add Class */}
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" /> Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                      <DialogTitle>Add New Class</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Class Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g. Mathematics 101"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
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
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddClass}>Create Class</Button>
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
                    fetchClasses(); // reset to page 1 on search
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
                      <TableHead>Class Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>{cls.branch?.name || "—"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(cls)}>
                                Edit Class
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(cls.id)}
                              >
                                Delete Class
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 0 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.currentPage > 1)
                            fetchClasses(pagination.currentPage - 1);
                        }}
                        className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            isActive={pagination.currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              fetchClasses(page);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (pagination.currentPage < pagination.totalPages)
                            fetchClasses(pagination.currentPage + 1);
                        }}
                        className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}

              {/* Edit Class Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Edit Class</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-name">Class Name</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid gap-2">
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
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingClass(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditClass}>Save Changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </AdminLayout>
  );
}