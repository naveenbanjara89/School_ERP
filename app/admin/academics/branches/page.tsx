/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal, MapPin } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Branch {
  id: number;
  name: string;
  schoolId: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  school?: {
    id: string;
    name: string;
  };
}

interface School {
  id: number;
  name: string;
}

const Branches = () => {
  const { toast } = useToast();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalBranches, setTotalBranches] = useState(0);

  

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);

  const [branchForm, setBranchForm] = useState({
    name: "",
    schoolId: "",
    address: "",
    city: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    fetchBranches();
  }, [currentPage, itemsPerPage, searchQuery, schoolFilter]);

  const fetchBranches = async () => {
    try {
      const params: any = {
        page: currentPage,
        perPage: itemsPerPage,
      };
      if (searchQuery) params.name = searchQuery;
      if (schoolFilter !== "all") params.schoolId = schoolFilter;

      const res = await axiosInstance.get("/api/v1/branches", { params });
      setBranches(res.data.data);
      setTotalBranches(res.data.total || res.data.data.length);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load branches",
        variant: "destructive",
      });
    }
  };

  const fetchSchools = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/schools");
      setSchools(res.data.data);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load schools",
        variant: "destructive",
      });
    }
  };

  const handleCreateBranch = async () => {
    if (!branchForm.name || !branchForm.schoolId || !branchForm.address) {
      toast({
        title: "Missing fields",
        description: "Name, School, and Address are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axiosInstance.post("/api/v1/branches", branchForm);
      toast({ title: "Success", description: "Branch created successfully" });
      setIsCreateOpen(false);
      resetForm();
      fetchBranches();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to create branch",
        variant: "destructive",
      });
    }
  };

  const openEdit = async (id: number) => {
    try {
      const res = await axiosInstance.get(`/api/v1/branches/${id}`);
      const b = res.data.data;
      setBranchForm({
        name: b.name,
        schoolId: b.schoolId,
        address: b.address,
        city: b.city,
        phone: b.phone,
        email: b.email,
      });
      setEditingBranchId(id);
      setIsEditOpen(true);
    } catch {
      toast({
        title: "Error",
        description: "Failed to load branch details",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBranch = async () => {
    if (!editingBranchId) return;
    try {
      await axiosInstance.put(`/api/v1/branches/${editingBranchId}`, branchForm);
      toast({ title: "Updated", description: "Branch updated successfully" });
      setIsEditOpen(false);
      setEditingBranchId(null);
      resetForm();
      fetchBranches();
    } catch {
      toast({
        title: "Error",
        description: "Failed to update branch",
        variant: "destructive",
      });
    }
  };

  const handleDeleteBranch = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/v1/branches/${id}`);
      toast({ title: "Deleted", description: "Branch deleted successfully" });
      fetchBranches();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete branch",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setBranchForm({
      name: "",
      schoolId: "",
      address: "",
      city: "",
      phone: "",
      email: "",
    });
  };

  const totalPages = Math.ceil(totalBranches / itemsPerPage);

  return (
    <AdminLayout>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Branches</h1>
          <p className="text-muted-foreground">Manage school branches</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Branch</DialogTitle>
            </DialogHeader>
            <BranchForm form={branchForm} setForm={setBranchForm} schools={schools} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateBranch}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schools</SelectItem>
            {schools.map((s) => (
              <SelectItem key={s.id} value={s.id.toString()}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={itemsPerPage.toString()} onValueChange={(v) => {setItemsPerPage(Number(v)); setCurrentPage(1);}}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead>School</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>{branch.school?.name}</TableCell>
                <TableCell>
                  <MapPin className="inline w-4 h-4 mr-1" />
                  {branch.city}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(branch.id)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteBranch(branch.id)}
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
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalBranches)} of {totalBranches} branches
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
          </DialogHeader>
          <BranchForm form={branchForm} setForm={setBranchForm} schools={schools} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBranch}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

const BranchForm = ({ form, setForm, schools }: any) => (
  <div className="grid gap-3 py-4">
    <Input
      placeholder="Branch name"
      value={form.name}
      onChange={(e) => setForm({ ...form, name: e.target.value })}
    />
    <Select value={form.schoolId} onValueChange={(v) => setForm({ ...form, schoolId: v })}>
      <SelectTrigger>
        <SelectValue placeholder="Select school" />
      </SelectTrigger>
      <SelectContent>
        {schools.map((s: School) => (
          <SelectItem key={s.id} value={s.id.toString()}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Textarea
      placeholder="Address"
      value={form.address}
      onChange={(e) => setForm({ ...form, address: e.target.value })}
    />
    <Input
      placeholder="City"
      value={form.city}
      onChange={(e) => setForm({ ...form, city: e.target.value })}
    />
    <Input
      placeholder="Phone"
      value={form.phone}
      onChange={(e) => setForm({ ...form, phone: e.target.value })}
    />
    <Input
      placeholder="Email"
      value={form.email}
      onChange={(e) => setForm({ ...form, email: e.target.value })}
    />
  </div>
);

export default Branches;
