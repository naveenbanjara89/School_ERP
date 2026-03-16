/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal, Mail, Phone } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */
interface Subject {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  name: string;
}

interface Teacher {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone?: string;
  branchId: string;
  subjectId: string;
  qualification: string;
  experienceYears: number;
  isActive: boolean;
}

/* ---------------- STATUS BADGE ---------------- */
const getStatusBadge = (isActive: boolean) => (
  <Badge variant={isActive ? "default" : "secondary"}>
    {isActive ? "Active" : "Inactive"}
  </Badge>
);

/* ---------------- COMPONENT ---------------- */
export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    branchId: "",
    subjectId: "",
    qualification:"",
    experienceYears: "",
    status: "active",
  });

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchTeachers();
    fetchBranches();
    fetchSubjects();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/teachers");
      setTeachers(res.data.data);
    } catch {
      toast.error("Failed to load teachers");
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/branches");
      setBranches(res.data.data);
    } catch {
      toast.error("Failed to load branches");
    }
  };

const fetchSubjects = async () => {
  try {
    const res = await axiosInstance.get("/api/v1/subjects?perPage=1000");

    const subjectsData = res?.data?.data || [];

    setSubjects(subjectsData);
  } catch {
    toast.error("Failed to load subjects");
    setSubjects([]); // fallback safety
  }
};

  /* ---------------- ADD TEACHER ---------------- */
  const handleAddTeacher = async () => {
    try {
      await axiosInstance.post("/api/v1/teachers", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        branchId: String(formData.branchId),
        qualification: String(formData.qualification),
        subjectId: String(formData.subjectId),
        experienceYears: Number(formData.experienceYears),
        isActive: formData.status === "active",
      });

      toast.success("Teacher created successfully");
      setIsAddModalOpen(false);
      resetForm();
      fetchTeachers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create teacher");
    }
  };

  /* ---------------- EDIT TEACHER ---------------- */
  const handleEditTeacher = async () => {
    if (!editingTeacher) return;
    try {
      await axiosInstance.put(`/api/v1/teachers/${editingTeacher.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        branchId: String(formData.branchId),
        subjectId: String(formData.subjectId),
        experienceYears: Number(formData.experienceYears),
        isActive: formData.status === "active",
      });

      toast.success("Teacher updated successfully");
      setIsEditModalOpen(false);
      setEditingTeacher(null);
      resetForm();
      fetchTeachers();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update teacher");
    }
  };

  /* ---------------- DELETE TEACHER ---------------- */
  const handleDeleteTeacher = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axiosInstance.delete(`/api/v1/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  /* ---------------- FILTER + PAGINATION ---------------- */
  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------- HELPER ---------------- */
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      branchId: "",
      subjectId: "",
      qualification: "",
      experienceYears: "",
      status: "active",
    });
  };

  const openEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: "", // leave blank
      phone: teacher.phone || "",
      branchId: teacher.branchId.toString(),
      subjectId: teacher.subjectId.toString(),
      qualification: teacher.qualification.toString(),
      experienceYears: teacher.experienceYears.toString(),
      status: teacher.isActive ? "active" : "inactive",
    });
    setIsEditModalOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
        <Input
          placeholder="Search teachers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedTeachers.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {t.name}
                </div>
              </TableCell>
              <TableCell>
                <Mail className="inline w-4 h-4 mr-1" />
                {t.email}
                {t.phone && (
                  <>
                    <br />
                    <Phone className="inline w-4 h-4 mr-1" />
                    {t.phone}
                  </>
                )}
              </TableCell>
              <TableCell>{branches.find((b) => String(b.id) === String(t.branchId))?.name || "-"}</TableCell>
              <TableCell>{subjects.find((s) => String(s.id) === String(t.subjectId))?.name || "-"}</TableCell>
              <TableCell>{t.experienceYears} yrs</TableCell>
              <TableCell>{getStatusBadge(t.isActive)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openEditModal(t)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDeleteTeacher(t.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationPrevious
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          />
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          />
        </PaginationContent>
      </Pagination>

      {/* Add Teacher Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Teacher</DialogTitle>
            <DialogDescription>Enter teacher details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              value={formData.branchId}
              onValueChange={(v) => setFormData({ ...formData, branchId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.subjectId}
              onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Experience Years"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleAddTeacher}>Add Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>Edit teacher details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              value={formData.branchId}
              onValueChange={(v) => setFormData({ ...formData, branchId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={b.id.toString()}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={formData.subjectId}
              onValueChange={(v) => setFormData({ ...formData, subjectId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Experience Years"
              value={formData.experienceYears}
              onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            />

            {/* Status selector for edit */}
            <Select
              value={formData.status}
              onValueChange={(v) => setFormData({ ...formData, status: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button onClick={handleEditTeacher}>Update Teacher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
