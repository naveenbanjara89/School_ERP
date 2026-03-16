/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MoreHorizontal,
  MapPin,
  Users,
  GraduationCap,
  Building2,
} from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  type: string;
  principalName: string;
  studentCount: number;
  teacherCount: number;
  isActive?: boolean;
  logo: string;
}

const getStatusBadge = (status: string) => {
  const variants: Record<
    string,
    { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
  > = {
    active: { variant: "default", label: "Active" },
    inactive: { variant: "secondary", label: "Inactive" },
  };
  const { variant, label } = variants[status] || variants.active;
  return <Badge variant={variant}>{label}</Badge>;
};

const Schools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSchoolId, setEditingSchoolId] = useState<number | null>(null);
  const [newSchool, setNewSchool] = useState({
    name: "",
    pincode: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    principalName: "",
    state: "",
  });
  const [editSchool, setEditSchool] = useState<Partial<School>>({});
  const pageSizeOptions = [5, 10, 20, 50];
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const params: any = {
          page: currentPage,
          perPage: itemsPerPage,
        };

        if (searchQuery) {
          params.name = searchQuery;
        }

        if (statusFilter !== "all") {
          params.isActive = statusFilter === "active";
        }

        const res = await axiosInstance.get("/api/v1/schools", { params });

        const formattedSchools = res.data.data.map((school: any) => ({
          ...school,
          status: school.isActive ? "active" : "inactive",
        }));

        setSchools(formattedSchools);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load schools",
          variant: "destructive",
        });
      }
    };

    fetchSchools();
  }, [searchQuery, statusFilter, currentPage, itemsPerPage]);



  // Filtering
  const filteredSchools = schools.filter((school) => {
    const matchesSearch =
      school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.pincode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || school.type === typeFilter;
    const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? school.isActive : !school.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
  const paginatedSchools = filteredSchools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Add school
  const handleAddSchool = async () => {
    if (!newSchool.name || !newSchool.pincode) {
      toast({
        title: "Missing Information",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await axiosInstance.post("/api/v1/schools", newSchool);
      setSchools((prev) => [...prev, res.data.data]);
      setIsDialogOpen(false);
      toast({ title: "Success", description: "School added successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to add school",
        variant: "destructive",
      });
    }
  };

  // Edit school
  const handleUpdateSchool = async () => {
    if (!editingSchoolId) return;
    try {
      const res = await axiosInstance.put(`/api/v1/schools/${editingSchoolId}`, editSchool);
      setSchools((prev) =>
        prev.map((s) => (s.id === editingSchoolId ? res.data.data : s))
      );
      setIsEditOpen(false);
      setEditingSchoolId(null);
      toast({ title: "Updated", description: "School updated successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to update school",
        variant: "destructive",
      });
    }
  };

  // Delete school
  const handleDeleteSchool = async (id: number) => {
    try {
      await axiosInstance.delete(`/api/v1/schools/${id}`);
      setSchools((prev) => prev.filter((s) => s.id !== id));
      toast({ title: "Deleted", description: "School deleted successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to delete school", variant: "destructive" });
    }
  };

  
  const [stats, setStats] = useState({
  totalSchools: 0,
  activeSchools: 0,
  totalTeachers: 0,
  totalStudents: 0,
  });

  const fetchStats = async () => {
  const res = await axiosInstance.get("/api/v1/schools/stats");
  setStats(res.data.data);
};


  // Stats
  // const totalStudents = filteredSchools.reduce((acc, s) => acc + s.studentCount, 0);
  // const totalTeachers = filteredSchools.reduce((acc, s) => acc + s.teacherCount, 0);
  // const activeSchools = filteredSchools.filter((s) => s.status === "active").length;

  useEffect(() => {
  fetchStats();
}, []);


  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Schools</h1>
          <p className="text-muted-foreground mt-1">Manage all schools in the network</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add School
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
              <DialogDescription>Enter the details of the new school.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name *</Label>
                  <Input
                    id="name"
                    value={newSchool.name}
                    onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                    placeholder="Springfield Elementary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={newSchool.pincode}
                    onChange={(e) => setNewSchool({ ...newSchool, pincode: e.target.value })}
                    placeholder="SPR-001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="type">School Type</Label>
                  <Select
                    value={newSchool.type}
                    onValueChange={(value) => setNewSchool({ ...newSchool, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="Middle School">Middle School</SelectItem>
                      <SelectItem value="High School">High School</SelectItem>
                      <SelectItem value="K-12">K-12</SelectItem>
                    </SelectContent>
                  </Select>
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSchool.email}
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input
                    id="principal"
                    value={newSchool.principalName}
                    onChange={(e) => setNewSchool({ ...newSchool, principalName: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={newSchool.address}
                  onChange={(e) => setNewSchool({ ...newSchool, address: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={newSchool.city}
                    onChange={(e) => setNewSchool({ ...newSchool, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newSchool.phone}
                    onChange={(e) => setNewSchool({ ...newSchool, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newSchool.email}
                    onChange={(e) => setNewSchool({ ...newSchool, email: e.target.value })}
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={newSchool.state}
                    onChange={(e) => setNewSchool({ ...newSchool, state: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSchool}>Add School</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.totalSchools}</p>
            <p className="text-sm text-muted-foreground">Total Schools</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-green-500/10">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.activeSchools} </p>
            <p className="text-sm text-muted-foreground">Active Schools</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.totalStudents}</p>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4 flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-purple-500/10">
            <GraduationCap className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{stats.totalTeachers}</p>
            <p className="text-sm text-muted-foreground">Total Teachers</p>
          </div>
        </div>
      </div>

      {/* Filters + Items per page */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search schools by name, pincode, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Elementary">Elementary</SelectItem>
              <SelectItem value="Middle School">Middle School</SelectItem>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="K-12">K-12</SelectItem>
            </SelectContent>
          </Select> */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Items per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground">per page</span>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>School</TableHead>
              {/* <TableHead>Type</TableHead> */}
              <TableHead>Location</TableHead>
              <TableHead>Principal</TableHead>
              {/* <TableHead>Students</TableHead>
              <TableHead>Teachers</TableHead> */}
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSchools.map((school) => (
              <TableRow key={school.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={school.logo} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {school.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{school.name}</p>
                      <p className="text-xs text-muted-foreground">{school.pincode}</p>
                    </div>
                  </div>
                </TableCell>
                {/* <TableCell>
                  <Badge variant="outline">{school.type}</Badge>
                </TableCell> */}
                <TableCell className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {school.city}, {school.state}
                </TableCell>
                <TableCell>{school.principalName || "-" }</TableCell>
                {/* <TableCell>{school.studentCount}</TableCell>
                <TableCell>{school.teacherCount}</TableCell> */}
                <TableCell>{getStatusBadge(school.isActive?"active":"inactive")}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setIsEditOpen(true);
                          setEditingSchoolId(school.id);
                          setEditSchool(school);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteSchool(school.id)}>
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

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit School</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">School Name</Label>
                <Input
                  id="edit-name"
                  value={editSchool.name || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pincode">Pincode</Label>
                <Input
                  id="edit-pincode"
                  value={editSchool.pincode || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, pincode: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editSchool.email || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-principal">Principal Name</Label>
                <Input
                  id="edit-principal"
                  value={editSchool.principalName || ""}
                  onChange={(e) =>
                    setEditSchool({ ...editSchool, principalName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={editSchool.address || ""}
                onChange={(e) => setEditSchool({ ...editSchool, address: e.target.value })}
                rows={2}  
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  value={editSchool.city || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editSchool.phone || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isActive">Status</Label>
                <Select
                  value={editSchool.isActive ? "active" : "inactive"}
                  onValueChange={(value) => setEditSchool({ ...editSchool, isActive: value === "active" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={editSchool.state || ""}
                  onChange={(e) => setEditSchool({ ...editSchool, state: e.target.value })}
                />
              </div>
            </div>
          </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSchool}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {paginatedSchools.length
            ? (currentPage - 1) * itemsPerPage + 1
            : 0}{" "}
          to {Math.min(currentPage * itemsPerPage, filteredSchools.length)} of{" "}
          {filteredSchools.length} schools
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
    </AdminLayout>
  );
};

export default Schools;
