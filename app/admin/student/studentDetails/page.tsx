/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, Download, Upload, Eye, Edit, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const Page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editData, setEditData] = useState<any>({});


// ================= GET STUDENTS =================
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: 1,
        perPage: 50,
      };

      if (searchTerm) params.name = searchTerm;
      if (classFilter !== "all") params.class = classFilter;

      const res = await axiosInstance.get("/api/v1/students", { params });

      const studentData =
        res?.data?.data?.students ||
        res?.data?.data ||
        res?.data ||
        [];

      setStudents(Array.isArray(studentData) ? studentData : []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive",
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };



// ================= VIEW STUDENT =================
  const handleView = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/api/v1/students/${id}`);
      setSelectedStudent(res.data.data);
      setViewOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student details",
        variant: "destructive",
      });
    }
  };


// ================= EDIT STUDENT =================
  const handleEdit = async (id: string) => {
    try {
      const res = await axiosInstance.get(`/api/v1/students/${id}`);
      setSelectedStudent(res.data.data);
      setEditData(res.data.data);
      setEditOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student details",
        variant: "destructive",
      });
    }
  };

  // ================= DELETE STUDENT =================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await axiosInstance.delete(`/api/v1/students/${id}`);

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      fetchStudents(); // refresh list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student",
        variant: "destructive",
      });
    }
  };  


    // ================= UPDATE STUDENT =================

  const handleUpdate = async () => {
    try {
      await axiosInstance.put(
        `/api/v1/students/${selectedStudent.id}`,
        editData
      );

      toast({
        title: "Success",
        description: "Student updated successfully",
      });

      setEditOpen(false);
      fetchStudents(); // refresh table
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
      });
    }
  };

  



  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, classFilter]);


  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-5 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Student Information
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage student records and admissions
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1.5" />
              Import
            </Button>

            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1.5" />
              Export
            </Button>

            <Button
              onClick={() =>
                router.push("/admin/student/studentAdmission")
              }
              size="sm"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              New Admission
            </Button>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="rounded-2xl border border-slate-200 shadow-sm bg-white p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-1 min-w-[220px] bg-slate-50 px-3 rounded-xl border border-slate-200">
              <Search className="w-4 h-4 text-indigo-500" />
              <Input
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-9 text-sm"
              />
            </div>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="w-[150px] h-9 text-xs rounded-xl">
                <Filter className="w-3 h-3 mr-1.5 text-indigo-500" />
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {["7", "8", "9", "10"].map((c) => (
                  <SelectItem key={c} value={c}>
                    Class {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Admission No</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Loading students...
                  </TableCell>
                </TableRow>
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No students found
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student: any) => {
                  // ✅ Safe field extraction (handles different backend formats)

                  const admissionNumber =
                    student.admissionNumber ||
                    student.admission_number ||
                    student.admissionNo ||
                    "-";

                  const className =
                    student?.section?.class?.name ||

                    "-";

                  const sectionName =
                    student.sectionName ||
                    student.section_name ||
                    student.class?.section ||
                    "";

                  return (
                    <TableRow
                      key={student.id || student._id}
                      className="hover:bg-indigo-50/60 transition"
                    >
                      <TableCell className="font-mono text-indigo-600">
                        {student.admissionNumber}
                      </TableCell>

                      <TableCell className="font-semibold">
                        {student.name || student.studentName || "-"}
                      </TableCell>

                      <TableCell>
                        { `${student?.section?.class?.name} - ${student?.section?.name}`}
                      </TableCell>

                      <TableCell>{student.gender || "-"}</TableCell>

                      <TableCell className="text-slate-500">
                        {student.dateOfBirth ||
                          student.dob ||
                          "-"}
                      </TableCell>

                      <TableCell>{student.phone || "-"}</TableCell>

                      <TableCell>
                          <div className="gap-2">

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-indigo-100 transition"
                              onClick={() => handleView(student.id)}
                              >
                              <Eye className="w-4 h-4 text-indigo-600" />
                              </Button>

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                              onClick={() => handleEdit(student.id)}
                              >
                              <Edit className="w-4 h-4 text-emerald-600" />
                              </Button>

                              <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                              onClick={() => handleDelete(student.id)}
                              >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                          </div>

                          {/* ================= VIEW MODAL ================= */}
                          <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Student Details</DialogTitle>
                              </DialogHeader>

                              {selectedStudent && (
                                <div className="space-y-2 text-sm pr-2">

                                  <p><strong>Name:</strong> {selectedStudent.name}</p>
                                  <p><strong>Admission No:</strong> {selectedStudent.admissionNumber}</p>
                                  <p><strong>Roll No:</strong> {selectedStudent.rollNumber}</p>

                                  <p>
                                    <strong>Class:</strong>{" "}
                                    {selectedStudent?.section?.class?.name || "-"} -{" "}
                                    {selectedStudent?.section?.name || "-"}
                                  </p>

                                  <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                                  <p><strong>DOB:</strong> {selectedStudent.dateOfBirth}</p>
                                  <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                                  <p><strong>Email:</strong> {selectedStudent.email}</p>

                                  <hr className="my-2"/>

                                  <p><strong>Admission Fee:</strong> ₹{selectedStudent?.fee?.admissionFee || 0}</p>
                                  <p><strong>Tuition Fee:</strong> ₹{selectedStudent?.fee?.tutionFee || 0}</p>
                                  <p><strong>Transport Fee:</strong> ₹{selectedStudent?.fee?.transportFee || 0}</p>
                                  <p><strong>Hostel Fee:</strong> ₹{selectedStudent?.fee?.hostelFee || 0}</p>
                                  <p><strong>Other Fee:</strong> ₹{selectedStudent?.fee?.otherFee || 0}</p>

                                  <p><strong>Total Fee:</strong> ₹{selectedStudent?.fee?.totalFee || 0}</p>
                                  <p><strong>Deposited:</strong> ₹{selectedStudent?.fee?.depositFee || 0}</p>
                                  <p><strong>Installments:</strong> {selectedStudent?.fee?.installments || 1}</p>

                                  <p>
                                    <strong>Due Date:</strong>{" "}
                                    {selectedStudent?.fee?.dueDate
                                      ? new Date(selectedStudent.fee.dueDate).toLocaleDateString()
                                      : "-"}
                                  </p>

                                  <p>
                                    <strong>Status:</strong>{" "}
                                    <Badge className="bg-yellow-100 text-yellow-700">
                                      {selectedStudent?.fee?.status || "PENDING"}
                                    </Badge>
                                  </p>

                                  <hr className="my-2"/>

                                  <p><strong>Discount Name:</strong> {selectedStudent?.discount?.Discount?.name || "-"}</p>

                                  <p>
                                    <strong>Discount Type:</strong>{" "}
                                    {selectedStudent?.discount?.Discount?.type || "-"}
                                  </p>

                                  <p>
                                    <strong>Discount Value:</strong>{" "}
                                    {selectedStudent?.discount?.Discount?.value || 0}
                                    {selectedStudent?.discount?.Discount?.type === "PERCENTAGE" ? "%" : "₹"}
                                  </p>

                                  <p>
                                    <strong>Discount Amount:</strong> ₹{selectedStudent?.discount?.amount || 0}
                                  </p>

                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {/* ================= EDIT MODAL ================= */}
                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                              <DialogContent  className="max-w-md max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Edit Student</DialogTitle>
                                </DialogHeader>

                                {editData && (
                                  <div className="space-y-3">
                                    <Input
                                      placeholder="Name"
                                      value={editData.name || ""}
                                      onChange={(e) =>
                                        setEditData({ ...editData, name: e.target.value })
                                      }
                                    />
                                    
                                    <Input
                                      placeholder="Fees"
                                      value={editData.fees || ""}
                                      onChange={(e) =>
                                        setEditData({ ...editData, fees: e.target.value })
                                      }
                                    />

                                    <Input
                                      placeholder="Phone"
                                      value={editData.phone || ""}
                                      onChange={(e) =>
                                        setEditData({ ...editData, phone: e.target.value })
                                      }
                                    />

                                    <Select
                                      value={editData.status}
                                      onValueChange={(value) =>
                                        setEditData({ ...editData, status: value })
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Inactive">Inactive</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleUpdate}>
                                    Update
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                      </TableCell>

                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Page;