/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "@/apiHome/axiosInstanc";

interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalSubjects: number;
  perPage: number;
}

const API_BASE = "/api/v1/subjects";

const Subjects = () => {
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalSubjects: 0,
    perPage: 10,
  });

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  const [newSubject, setNewSubject] = useState<Partial<Subject>>({});
  const [editSubject, setEditSubject] = useState<Partial<Subject>>({});

  /** -----------------------------
   * API Calls
   * ----------------------------- */
  const getSubjects = async (page = 1, perPage = pagination.perPage) => {
  try {
    const res = await axiosInstance.get(
      `${API_BASE}?page=${page}&perPage=${perPage}`
    );

    setSubjects(res.data.data);
    setPagination(res.data?.pagination ?? {
      currentPage: 1,
      totalPages: 1,
      totalSubjects: 0,
      perPage,
    });
  } catch {
    toast({
      title: "Error",
      description: "Failed to fetch subjects",
      variant: "destructive",
    });
  }
};


  const createSubject = async (subject: Partial<Subject>) =>
    axiosInstance.post(API_BASE, subject);
  const updateSubject = async (id: number, subject: Partial<Subject>) =>
    axiosInstance.put(`${API_BASE}/${id}`, subject);
  const deleteSubject = async (id: number) => axiosInstance.delete(`${API_BASE}/${id}`);

  const searchSubjects = async (query: string) => {
    try {
      const res = await axiosInstance.get(`${API_BASE}?name=${query}`);
      setSubjects(res.data.data);
      // Reset pagination when searching
      setPagination((prev) => ({ ...prev, currentPage: 1, totalPages: 1, totalSubjects: res.data.data.length }));
    } catch {
      toast({
        title: "Error",
        description: "Search failed",
        variant: "destructive",
      });
    }
  };

  /** -----------------------------
   * Lifecycle
   * ----------------------------- */
  useEffect(() => {
    if (!searchQuery) getSubjects(pagination.currentPage, pagination.perPage);
  }, [pagination.currentPage, pagination.perPage]);

  /** -----------------------------
   * Handlers
   * ----------------------------- */
  const handleAddSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
      toast({
        title: "Missing Fields",
        description: "Name and Code are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await createSubject(newSubject);
      getSubjects(1); // refresh page
      setIsAddDialogOpen(false);
      setNewSubject({});
      toast({ title: "Success", description: "Subject added successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to add subject",
        variant: "destructive",
      });
    }
  };

  const handleEditSubject = async () => {
    if (!editingSubjectId || !editSubject.name || !editSubject.code) {
      toast({
        title: "Missing Fields",
        description: "Name and Code are required",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await updateSubject(editingSubjectId, editSubject);
      getSubjects(pagination.currentPage, pagination.perPage); // refresh
      setIsEditDialogOpen(false);
      setEditingSubjectId(null);
      setEditSubject({});
      toast({ title: "Updated", description: "Subject updated successfully" });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Failed to update subject",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubject = async (id: number) => {
    try {
      await deleteSubject(id);
      getSubjects(pagination.currentPage, pagination.perPage); // refresh
      toast({ title: "Deleted", description: "Subject deleted successfully" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query) {
      getSubjects(1, pagination.perPage);
      return;
    }
    await searchSubjects(query);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const perPage = Number(e.target.value);
    setPagination((prev) => ({ ...prev, perPage, currentPage: 1 }));
  };

  /** -----------------------------
   * Render
   * ----------------------------- */
  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold">Subjects</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Subject</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={newSubject.name || ""}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Code *</Label>
                <Input
                  value={newSubject.code || ""}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, code: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newSubject.description || ""}
                  onChange={(e) =>
                    setNewSubject({ ...newSubject, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search + perPage */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <Input
          placeholder="Search by name or code..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Per Page:</span>
          <select
            value={pagination.perPage}
            onChange={handlePerPageChange}
            className="border rounded px-2 py-1"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.length > 0 ? (
              subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.description || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditSubject(subject);
                          setEditingSubjectId(subject.id);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No subjects found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-muted-foreground">
          Showing{" "}
          {subjects.length
            ? (pagination.currentPage - 1) * pagination.perPage + 1
            : 0}{" "}
          to{" "}
          {(pagination.currentPage - 1) * pagination.perPage + subjects.length} of{" "}
          {pagination.totalSubjects} subjects
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => goToPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => goToPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={editSubject.name || ""}
                onChange={(e) =>
                  setEditSubject({ ...editSubject, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input
                value={editSubject.code || ""}
                onChange={(e) =>
                  setEditSubject({ ...editSubject, code: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editSubject.description || ""}
                onChange={(e) =>
                  setEditSubject({ ...editSubject, description: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubject}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Subjects;
