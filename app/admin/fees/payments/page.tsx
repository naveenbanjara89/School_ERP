/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card,  CardContent,} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search,Eye,ReceiptIndianRupee} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";

const tabMap: Record<string, string> = {
  "/fees/collect": "collect",
  "/fees/payments": "payments",
  "/fees/type": "type",
  "/fees/discount": "discount",
  "/fees/reminder": "reminder",
  "/fees/search-due": "search-due",
};

const statusColor: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Partial: "bg-amber-100 text-amber-700 border-amber-200",
  Unpaid: "bg-red-100 text-red-700 border-red-200",
};

export default function FeesCollectionPage() {
    const pathname = usePathname();
    const activeTab = tabMap[pathname] || "payments";
    const [search, setSearch] = useState("");
    const [viewDetail, setViewDetail] = useState<number | null>(null);
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [perPage] = useState(10);
    const filtered = payments;

const fetchPayments = async () => {
  try {
    setLoading(true);

    const res = await axiosInstance.get("/api/v1/payments", {
      params: {
        page,
        perPage,
        name: search
      }
    });

    setPayments(res?.data?.data || []);
    setTotalPages(res?.data?.pagination?.totalPages || 1);

  } catch (error) {
    console.error("Payments API Error:", error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const delay = setTimeout(() => {
    fetchPayments();
  }, 500);

  return () => clearTimeout(delay);
}, [search, page]);


  return (
    <AdminLayout>
        <div className="space-y-8 max-w-[1400px]">
                {/* Gradient Header */}
                <div className="bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100 p-6 rounded-3xl text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">Payment Records</h1>
                            <p className="text-white/80 mt-1 text-sm">
                                Track all parent payments
                            </p>
                        </div>
                    </div>
                </div>

                <Tabs value={activeTab} className="w-full">
                    <TabsContent value="payments">

                        {/* Search */}
                        <Card className="border-0 shadow-md rounded-2xl">
                            <CardContent className="p-5">
                                <div className="flex flex-wrap gap-4 items-end">
                                <div className="flex-1 min-w-[250px]">
                                    <Label className="text-xs">Search Student</Label>

                                    <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                                    <Input
                                        className="pl-9"
                                        placeholder=" Parent , student ..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    </div>
                                </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Table */}
                        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden mt-6">

                            <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                <TableRow className="bg-gradient-to-r   from-indigo-500 to-purple-600 text-white">
                                    <TableHead className="text-black" >Receipt</TableHead>
                                    <TableHead className="text-black" >Transaction Id</TableHead>
                                    <TableHead className="text-black" >Parent</TableHead>
                                    <TableHead className="text-black" >Student</TableHead>
                                    <TableHead className="text-black" >Class</TableHead>
                                    {/* <TableHead className="text-black" >Total</TableHead> */}
                                    <TableHead className="text-black" >Paid</TableHead>
                                    <TableHead className="text-black" >Method</TableHead>
                                    {/* <TableHead className="text-black" >Due</TableHead> */}
                                    <TableHead className="text-black" >Status</TableHead>
                                    <TableHead className="text-black text-right">Action</TableHead>
                                </TableRow>
                                </TableHeader>

                                <TableBody>
                                {loading ? (
                                    <TableRow>
                                    <TableCell colSpan={9} className="text-center py-6">
                                        Loading payments...
                                    </TableCell>
                                    </TableRow>
                                ) : filtered.length === 0 ? (
                                    <TableRow>
                                    <TableCell colSpan={9} className="text-center py-6">
                                        No payments found
                                    </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((payment: any) => {
                                    // Determine student reference
                                    const student = payment.Student || payment.Fee?.Student;

                                        // const totalFee = payment?.fee?.totalFee || 0;
                                        const paid = payment?.amount || 0;

                                    return (
                                        <TableRow key={payment.id}>
                                        <TableCell>{payment.id}</TableCell>
                                        <TableCell>{payment.transactionId || "-"}</TableCell>
                                        <TableCell>{student?.parentName || "-"}</TableCell>
                                        <TableCell>{student?.name || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                            {student?.section?.name || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-emerald-600">₹{paid}</TableCell>
                                        <TableCell className="text-emerald-600">{payment.paymentMode || "-"}</TableCell>
                                        <TableCell>
                                            <Badge className={`border ${statusColor[payment.status] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
                                            {payment.status || "Unknown"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                            variant="ghost"
                                            onClick={() => setViewDetail(payment.id)}
                                            size="icon"
                                            >
                                            <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        </TableRow>
                                    );
                                    })
                                )}
                                </TableBody>
                            </Table>


                            </CardContent>
                        </Card>
                    </TabsContent>

                    <div className="flex justify-between items-center mt-6">

                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        variant="outline"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>

                    </div>
                </Tabs>

                {/* Installment Detail Dialog */}
                <Dialog open={viewDetail !== null} onOpenChange={() => setViewDetail(null)}>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-600">
                                <ReceiptIndianRupee className="h-6 w-6 text-indigo-500" /> Payment Details
                            </DialogTitle>
                        </DialogHeader>

                        {viewDetail &&
                        (() => {
                            const record = payments.find((p: any) => p.id === viewDetail);
                            if (!record) return null;

                            const student = record.Student || record.Fee?.Student;
                            const parentName = student?.parentName || "-";
                            const className = student?.section?.name || "-";
                            const totalFee = record?.Fee?.totalFee || 0;
                            const paid = record?.amount || 0;
                            const due = Math.max(totalFee - paid, 0); // never negative
                            const status = due === 0 ? "Completed" : "Partial";
                            // const percentage = totalFee === 0 ? 0 : (paid / totalFee) * 100;

                            return (
                            <div className="space-y-6">
                                {/* Student Info */}
                                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Student Info</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                    <div>
                                    <span className="font-medium text-gray-800">Student:</span> {student?.name || "-"}
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Parent:</span> {parentName}
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Class:</span> {className}
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Transaction Id:</span> {record.transactionId || "-"}
                                    </div>
                                </div>
                                </div>

                                {/* Fee Info */}
                                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Info</h3>

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                    <span className="font-medium text-gray-800">Total Fee:</span>{" "}
                                    <span className="text-purple-600">₹{totalFee.toLocaleString()}</span>
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Paid:</span>{" "}
                                    <span className="text-emerald-600 font-medium">₹{paid.toLocaleString()}</span>
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Due:</span>{" "}
                                    <span className="text-red-600 font-medium">₹{due.toLocaleString()}</span>
                                    </div>
                                    <div>
                                    <span className="font-medium text-gray-800">Status:</span>{" "}
                                    <Badge
                                        className={`ml-1 border ${
                                        status === "Completed"
                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                            : "bg-amber-100 text-amber-700 border-amber-200"
                                        }`}
                                    >
                                        {status}
                                    </Badge>
                                    </div>
                                </div>

                                {/* Progress */}
                                {/* {totalFee > 0 && (
                                    <div className="mt-3">
                                    <Progress
                                        value={percentage}
                                        className="h-3 rounded-full bg-gray-200 dark:bg-gray-700"
                                        style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6, #ec4899)" }}
                                    />
                                    <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(percentage)}% paid</p>
                                    </div>
                                )} */}
                                </div>
                            </div>
                            );
                        })()}

                        <DialogFooter>
                        <Button variant="outline" className="text-gray-600" onClick={() => setViewDetail(null)}>
                            Close
                        </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
        </div>
    </AdminLayout>
  );
}