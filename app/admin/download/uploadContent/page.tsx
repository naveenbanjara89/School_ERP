"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Eye, Download, Trash2, FileText, Image, Film, File, HardDrive, FolderUp, Share2  } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const contentData = [
  { id: 1, title: "Physics Chapter 3 Notes", type: "PDF", category: "Study Material",sharedWithBranch: "MBBS" , sharedWith: "Class 10", uploadedBy: "Mr. Rajesh Kumar", date: "2025-02-10", size: "2.4 MB", downloads: 85 },
  { id: 2, title: "Annual Day Event Photos", type: "Image", category: "Gallery",sharedWithBranch: "MBBS" , sharedWith: "All Classes", uploadedBy: "Admin", date: "2025-02-09", size: "15.6 MB", downloads: 142 },
  { id: 3, title: "Mathematics Formula Sheet", type: "PDF", category: "Study Material",sharedWithBranch: "MBBS" , sharedWith: "Class 9, 10", uploadedBy: "Mrs. Priya Sharma", date: "2025-02-08", size: "1.1 MB", downloads: 210 },
  { id: 4, title: "Science Lab Safety Video", type: "Video", category: "Tutorial",sharedWithBranch: "MBBS" , sharedWith: "Class 8, 9, 10", uploadedBy: "Dr. Suresh Patel", date: "2025-02-07", size: "45.2 MB", downloads: 67 },
  { id: 5, title: "Exam Timetable Feb 2025", type: "PDF", category: "Notice",sharedWithBranch: "MBBS" , sharedWith: "All Classes", uploadedBy: "Admin", date: "2025-02-06", size: "0.5 MB", downloads: 320 },
  { id: 6, title: "Hindi Poetry Collection", type: "Document", category: "Study Material",sharedWithBranch: "MBBS" , sharedWith: "Class 7, 8", uploadedBy: "Mr. Deepak Singh", date: "2025-02-05", size: "3.2 MB", downloads: 45 },
];

const typeIcons: Record<string, React.ElementType> = { PDF: FileText, Image: Image, Video: Film, Document: File };

const stats = [
  { label: "Total Files", value: "482", icon: HardDrive, color: "bg-blue-500/10 text-blue-600" },
  { label: "Uploaded This Month", value: "34", icon: FolderUp, color: "bg-green-500/10 text-green-600" },
  { label: "Shared Content", value: "156", icon: Share2, color: "bg-purple-500/10 text-purple-600" },
  { label: "Total Downloads", value: "2.4K", icon: Download, color: "bg-amber-500/10 text-amber-600" },
];

const Page = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  return (
    <AdminLayout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Upload / Share Content</h1>
                    <p className="text-muted-foreground text-sm">Upload and share study materials, documents, and media</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="gap-2">
                    <Upload className="h-4 w-4" /> Upload Content
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map(s => (
                <Card key={s.label}>
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${s.color}`}>
                            <s.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{s.value}</p>
                            <p className="text-xs text-muted-foreground">{s.label}</p>
                        </div>
                    </CardContent>
                </Card>
                ))}
            </div>

            {showForm && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Upload New Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Content Title</label>
                                <Input placeholder="Enter content title" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Content Type</label>
                                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                <option>Study Material</option><option>Notice</option><option>Gallery</option><option>Tutorial</option><option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Share With</label>
                                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                    <option>All Branches</option>
                                    <option>MBBS</option>
                                    <option>vjsgh</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Share With</label>
                                <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                                <option>All Classes</option><option>Class 7</option><option>Class 8</option><option>Class 9</option><option>Class 10</option>
                                </select>
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label className="text-sm font-medium text-foreground">Description</label>
                                <Input placeholder="Enter description" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Upload File</label>
                                <Input type="file" />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Button>Upload & Share</Button>
                            <Button variant="outline" onClick={() => setShowForm(false)}>
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Content List</CardTitle>
                    <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
                    </div>
                </div>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Shared With Branch</TableHead>
                        <TableHead>Shared With Classes</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        {/* <TableHead>Size</TableHead>
                        <TableHead>Downloads</TableHead> */}
                        <TableHead>Actions</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {contentData.filter(c => c.title.toLowerCase().includes(search.toLowerCase())).map(item => {
                        const TypeIcon = typeIcons[item.type] || File;
                        return (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                {item.title}
                            </div>
                            </TableCell>
                            <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.sharedWithBranch}</TableCell>
                            <TableCell>{item.sharedWith}</TableCell>
                            <TableCell>{item.uploadedBy}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            {/* <TableCell>{item.size}</TableCell>
                            <TableCell>{item.downloads}</TableCell> */}
                            <TableCell>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><Download className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                            </div>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>
    </AdminLayout>
  );
};

export default Page;