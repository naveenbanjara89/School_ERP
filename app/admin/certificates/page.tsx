/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Award, Plus, Eye, Edit, Trash2, Copy, Download, CreditCard, FileText, GraduationCap, FileCheck} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { usePathname } from "next/navigation";
import { axiosInstance } from "@/apiHome/axiosInstanc";

/* ================= TYPES ================= */

interface Template {
  id: string;
  name: string;
  type: "ID_CARD" | "ADMIT_CARD" | "MARKSHEET" | "TRANSFER_CERTIFICATE" | "CERTIFICATE";
  template: string;
  createdAt: string;
}

const categoryConfig = {
  "ID_CARD": { label: "ID Card", icon: CreditCard, color: "bg-primary/10 text-primary" },
  "ADMIT_CARD": { label: "Admit Card", icon: FileText, color: "bg-accent/10 text-accent" },
  "MARKSHEET": { label: "Marksheet", icon: GraduationCap, color: "bg-[hsl(var(--card-green))]/10 text-[hsl(var(--card-green))]" },
  "TRANSFER_CERTIFICATE": { label: "Transfer Certificate", icon: FileCheck, color: "bg-[hsl(var(--card-orange))]/10 text-[hsl(var(--card-orange))]" },
  "CERTIFICATE": { label: "Certificate", icon: Award, color: "bg-[hsl(var(--card-cyan))]/10 text-[hsl(var(--card-cyan))]" },
};

const API = "/api/v1/templates";

export const getTemplates = async () => {
  try {
    const res = await axiosInstance.get(API);
    console.log(res)
    return res.data;
  } catch (error) {
    throw new Error("Failed to fetch templates");
  }
};

export const createTemplate = async (data: any) => {
  try {
    const res = await axiosInstance.post(API, data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to create template");
  }
};

export const updateTemplate = async (id: string, data: any) => {
  try {
    const res = await axiosInstance.put(`${API}/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error("Failed to update template");
  }
};

export const deleteTemplate = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`${API}/${id}`);
    return res.data;
  } catch (error) {
    throw new Error("Failed to delete template");
  }
};

/* =============== PAGE ================= */

export default function CertificatePage() {
  const pathname = usePathname();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  const [formData, setFormData] = useState({
    name: "",
    category: "ID_CARD" as Template["type"],
    htmlCode: "",
  });

  const getActiveTab = () => {
    if (pathname.includes("ADMIT_CARD")) return "ADMIT_CARD";
    if (pathname.includes("MARKSHEET")) return "MARKSHEET";
    if (pathname.includes("TRANSFER_CERTIFICATE")) return "TRANSFER_CERTIFICATE";
    if (pathname.includes("generate")) return "generate";
    if (pathname.includes("ID_CARD")) return "ID_CARD";
    return "ID_CARD";
  };

  const sampleData: Record<string, string> = {
    "{{school_name}}": "Delhi Public School",
    "{{school_address}}": "Sector 24, Gurugram, Haryana 122017",
    "{{student_name}}": "Aarav Sharma",
    "{{admission_no}}": "DPS-2025-0847",
    "{{class}}": "10",
    "{{section}}": "A",
    "{{roll_no}}": "15",
    "{{dob}}": "15-Mar-2010",
    "{{blood_group}}": "B+",
    "{{parent_name}}": "Rajesh Sharma",
    "{{contact}}": "+91 98765 43210",
    "{{academic_year}}": "2025-26",
    "{{photo_url}}": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    "{{exam_name}}": "Annual Examination 2025",
    "{{exam_date}}": "15-Mar-2025",
    "{{tc_number}}": "TC/2025/0234",
    "{{admission_date}}": "01-Apr-2020",
    "{{leaving_date}}": "31-Mar-2025",
    "{{reason}}": "Parent's Transfer",
    "{{conduct}}": "Good",
    "{{issue_date}}": "05-Apr-2025",
  };

  const renderHtmlWithData = (html: string) => {
    let rendered = html;
    Object.entries(sampleData).forEach(([key, val]) => {
      rendered = rendered.split(key).join(val);
    });
    return rendered;
  };

const handleSave = async () => {
  if (!formData.name || !formData.htmlCode) {
    toast({
      title: "Error",
      description: "Please fill name and HTML code",
      variant: "destructive",
    });
    return;
  }

  try {
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, {
        name: formData.name,
        type: formData.category,
        template: formData.htmlCode,
      });

      toast({ title: "Template Updated" });
    } else {
      await createTemplate({
        name: formData.name,
        type: formData.category,
        template: formData.htmlCode,
      });

      toast({ title: "Template Created" });
    }

    fetchTemplates();

    setShowEditor(false);
    setEditingTemplate(null);
    setFormData({ name: "", category: "ID_CARD", htmlCode: "" });

  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to save template",
      variant: "destructive",
    });
  }
};

  const handleEdit = (t: Template) => {
    setEditingTemplate(t);
    setFormData({
      name: t.name,
      category: t.type as Template["type"],
      htmlCode: t.template,
    });
    setShowEditor(true);
  };

const handleDelete = async (id: string) => {
  try {
    await deleteTemplate(id);

    toast({
      title: "Template Deleted",
    });

    fetchTemplates();
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to delete template",
      variant: "destructive",
    });
  }
};

  useEffect(() => {
  setActiveTab(getActiveTab());
}, [pathname]);

const [activeTab, setActiveTab] = useState(getActiveTab());


const handleDuplicate = async (t: Template) => {
  try {
    await createTemplate({
      name: `${t.name} (Copy)`,
      type: t.type,
      template: t.template,
    });

    toast({ title: "Template Duplicated" });

    fetchTemplates();
  } catch {
    toast({
      title: "Error",
      description: "Failed to duplicate template",
      variant: "destructive",
    });
  }
};

const mapAPITypeToUI = (type: string): Template["type"] => {
  switch (type) {
    case "ID_CARD":
      return "ID_CARD";
    case "ADMIT_CARD":
      return "ADMIT_CARD";
    case "MARKSHEET":
      return "MARKSHEET";
    case "TRANSFER_CERTIFICATE":
      return "TRANSFER_CERTIFICATE";
    case "CERTIFICATE":
      return "CERTIFICATE";
    default:
      return "CERTIFICATE";
  }
};

  const filtered = filterCategory === "all" ? templates : templates.filter(t => t.type === filterCategory);
  const stats = {
    total: templates.length,
    idCards: templates.filter(t => t.type === "ID_CARD").length,
    admitCards: templates.filter(t => t.type === "ADMIT_CARD").length,
    certificates: templates.filter(t => ["TRANSFER_CERTIFICATE", "CERTIFICATE", "MARKSHEET"].includes(t.type)).length,
  };

  const fetchTemplates = async () => {
  try {
    setLoading(true);
    const res = await getTemplates();
    const formatted = (res.data?.data || []).map((t: any) => ({
  ...t,
  type: mapAPITypeToUI(t.type),
}));

setTemplates(formatted);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch templates",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
  };

useEffect(() => {
  fetchTemplates();
}, []);



  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between
            rounded-2xl p-6
            bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50
            border border-white/30 shadow-lg backdrop-blur-xl
            min-h-[120px] flex-shrink-0 transition-all duration-300">

            <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500
                bg-clip-text text-transparent leading-tight select-none">
                Certificate & Template Manager
            </h1>
            <p className="text-sm text-gray-700 mt-2 max-w-xl">
                Create and manage HTML templates for ID cards, admit cards, MARKSHEETs & certificates
            </p>
            </div>

            <Button
            onClick={() => {
                setEditingTemplate(null);
                setFormData({ name: "", category: "ID_CARD", htmlCode: "" });
                setShowEditor(true);
            }}
            className="mt-4 md:mt-0 flex items-center justify-center
                rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
                hover:from-purple-500 hover:to-pink-600
                text-white font-semibold shadow-lg
                h-12 px-5 transition-all duration-300 whitespace-nowrap"
            >
            <Plus size={16} className="mr-2" />
            Create Template
            </Button>
        </div>


        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {[
            {
            label: "Total Templates",
            value: stats.total,
            icon: Award,
            color: "from-indigo-400 to-purple-500",
            },
            {
            label: "ID Cards",
            value: stats.idCards,
            icon: CreditCard,
            color: "from-blue-400 to-cyan-500",
            },
            {
            label: "Admit Cards",
            value: stats.admitCards,
            icon: FileText,
            color: "from-green-400 to-emerald-500",
            },
            {
            label: "Certificates",
            value: stats.certificates,
            icon: GraduationCap,
            color: "from-orange-400 to-pink-500",
            },
        ].map((s) => (
            <Card
            key={s.label}
            className="relative overflow-hidden 
            rounded-2xl border-none 
            shadow-xl hover:shadow-2xl 
            transition-all duration-300 hover:scale-[1.03]"
            >
            <CardContent
                className={`p-5 text-white bg-gradient-to-br ${s.color}`}
            >
                <div className="flex items-center justify-between">

                <div>
                    <p className="text-3xl font-bold">{s.value}</p>
                    <p className="text-xs opacity-90">{s.label}</p>
                </div>

                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-md">
                    <s.icon size={22} />
                </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            </CardContent>
            </Card>
        ))}

        </div>

        <div className="flex-1 overflow-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab List */}
            <TabsList className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-xl p-1 shadow-inner mb-6">
                <TabsTrigger
                value="ID_CARD"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-purple-400 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-colors"
                >
                ID Cards
                </TabsTrigger>
                <TabsTrigger
                value="ADMIT_CARD"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-pink-400 data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-colors"
                >
                Admit Cards
                </TabsTrigger>
                <TabsTrigger
                value="MARKSHEET"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-green-400 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-colors"
                >
                Marksheets
                </TabsTrigger>
                <TabsTrigger
                value="TRANSFER_CERTIFICATE"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-yellow-400 data-[state=active]:bg-yellow-500 data-[state=active]:text-white transition-colors"
                >
                Transfer Cert.
                </TabsTrigger>
                <TabsTrigger
                value="generate"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-blue-400 data-[state=active]:bg-blue-500 data-[state=active]:text-white transition-colors"
                >
                All Templates
                </TabsTrigger>
            </TabsList>

            {/* Individual Category Tabs */}
            {(["ID_CARD", "ADMIT_CARD", "MARKSHEET", "TRANSFER_CERTIFICATE"] as const).map((cat) => (
                <TabsContent className="transition-all duration-300" key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.filter((t) => t.type === cat).length === 0 ? (
                    <Card className="col-span-full border-dashed border-2 border-gray-300 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-inner rounded-xl">
                        <CardContent className="p-12 text-center text-gray-400 text-lg flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">📄</span>
                        No templates yet. Click <strong>Create Template</strong> to add one.
                        </CardContent>
                    </Card>
                    ) : (
                    templates
                        .filter((t) => t.type === cat)
                        .map((t) => (
                        <TemplateCard
                            key={t.id}
                            template={t}
                            onPreview={() => {
                            setPreviewTemplate(t);
                            setShowPreview(true);
                            }}
                            onEdit={() => handleEdit(t)}
                            onDelete={() => handleDelete(t.id)}
                            onDuplicate={() => handleDuplicate(t)}
                            renderHtml={renderHtmlWithData}
                        />
                        ))
                    )}
                </div>
                </TabsContent>
            ))}

            {/* All Templates Tab with Filter */}
            <TabsContent className="transition-all duration-300" value="generate">
                <div className="flex items-center gap-3 mb-4">
                    <Label className="text-sm text-gray-600 font-medium">Filter:</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-52 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-lg shadow-inner hover:shadow-lg transition-shadow">
                        <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="ID_CARD">ID Cards</SelectItem>
                        <SelectItem value="ADMIT_CARD">Admit Cards</SelectItem>
                        <SelectItem value="MARKSHEET">Marksheets</SelectItem>
                        <SelectItem value="TRANSFER_CERTIFICATE">Transfer Certificates</SelectItem>
                        <SelectItem value="CERTIFICATE">Certificates</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <Card className="col-span-full border-dashed border-2 border-gray-300 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-inner rounded-xl">
                        <CardContent className="p-12 text-center text-gray-400 text-lg flex flex-col items-center justify-center gap-2">
                            <span className="text-4xl">🔍</span>
                            No templates match this filter.
                        </CardContent>
                        </Card>
                    ) : (
                        filtered.map((t) => (
                        <TemplateCard
                            key={t.id}
                            template={t}
                            onPreview={() => {
                            setPreviewTemplate(t);
                            setShowPreview(true);
                            }}
                            onEdit={() => handleEdit(t)}
                            onDelete={() => handleDelete(t.id)}
                            onDuplicate={() => handleDuplicate(t)}
                            renderHtml={renderHtmlWithData}
                        />
                        ))
                    )}
                </div>
            </TabsContent>
            </Tabs>
        </div>
      </div>

        {/* ================= EDITOR DIALOG ================= */}
        <Dialog open={showEditor} onOpenChange={setShowEditor}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border-none shadow-2xl bg-white/90 backdrop-blur-xl">

                {/* HEADER */}
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        {editingTemplate ? "Edit Template" : "Create New Template"}
                    </DialogTitle>
                </DialogHeader>

                {/* BODY */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">

                    {/* LEFT SIDE: Form */}
                    <div className="space-y-5">

                        {/* Template Name */}
                        <div className="space-y-1">
                        <Label className="text-sm font-semibold text-gray-700">Template Name</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) =>
                            setFormData((p) => ({ ...p, name: e.target.value }))
                            }
                            placeholder="e.g. Modern ID Card"
                            className="rounded-xl bg-blue-50/60 border-blue-200 focus:ring-2 focus:ring-blue-400"
                        />
                        </div>

                        {/* Category */}
                        <div className="space-y-1">
                        <Label className="text-sm font-semibold text-gray-700">Category</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(v) =>
                            setFormData((p) => ({ ...p, category: v as Template["type"] }))
                            }
                        >
                            <SelectTrigger className="rounded-xl bg-purple-50/60 border-purple-200 focus:ring-2 focus:ring-purple-400">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="ID_CARD">ID Card</SelectItem>
                            <SelectItem value="ADMIT_CARD">Admit Card</SelectItem>
                            <SelectItem value="MARKSHEET">Marksheet</SelectItem>
                            <SelectItem value="TRANSFER_CERTIFICATE">Transfer Certificate</SelectItem>
                            <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                            </SelectContent>
                        </Select>
                        </div>

                        {/* HTML CODE */}
                        <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">HTML Template Code</Label>
                        <div className="text-xs text-gray-500 bg-gray-50 border rounded-lg p-3">
                            Use placeholders: <br />
                            <code className="text-blue-600">
                            {"{{student_name}}, {{class}}, {{section}}, {{roll_no}}, {{dob}}, {{photo_url}}, {{school_name}}, {{admission_no}}, {{parent_name}}, {{contact}}, {{blood_group}}, {{academic_year}}"}
                            </code>
                        </div>
                        <Textarea
                            value={formData.htmlCode}
                            onChange={(e) =>
                            setFormData((p) => ({ ...p, htmlCode: e.target.value }))
                            }
                            className="font-mono text-xs min-h-[300px] rounded-xl bg-gray-900 text-green-400 border-gray-800"
                            placeholder="<div>Your HTML template here...</div>"
                        />
                        </div>
                    </div>

                    {/* RIGHT SIDE: Live Editable Preview */}
                    <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Live Preview (Click to Edit)</Label>

                    <div className="mt-1 border rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-[420px] overflow-auto shadow-inner">
                        {formData.htmlCode ? (
                        <div
                            className="bg-white p-4 rounded-lg shadow-lg min-h-[400px]"
                            contentEditable
                            suppressContentEditableWarning
                            onInput={(e) =>
                            setFormData((p) => ({
                                ...p,
                                htmlCode: (e.target as HTMLDivElement).innerHTML,
                            }))
                            }
                            dangerouslySetInnerHTML={{ __html: renderHtmlWithData(formData.htmlCode) }}
                            style={{
                            outline: "none",
                            display: "block",          // Make editable area a block container
                            whiteSpace: "pre-wrap",    // Preserve line breaks
                            wordBreak: "break-word",   // Wrap long text
                            direction: "ltr",          // Force left-to-right editing
                            minHeight: "400px",
                            }}
                        />
                        ) : (
                        <p className="text-gray-400 text-sm">Write HTML code to see preview</p>
                        )}
                    </div>
                    </div>
                </div>

                {/* FOOTER */}
                <DialogFooter className="pt-4 border-t flex gap-3">
                <Button variant="outline" onClick={() => setShowEditor(false)} className="rounded-xl border-gray-300">
                    Cancel
                </Button>

                <Button
                    onClick={handleSave}
                    className="rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md hover:opacity-90"
                >
                    {editingTemplate ? "Update" : "Create"} Template
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        {/* ================= PREVIEW DIALOG ================= */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl border-none bg-white/90 backdrop-blur-xl flex flex-col">
            
            <DialogHeader className="pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-lg font-bold text-gray-800">
                {previewTemplate?.name} — Preview
            </DialogTitle>
            </DialogHeader>

            {/* Scrollable preview area */}
            <div
            className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-auto shadow-inner"
            id="template-preview"
            >
            {previewTemplate && (
                <div
                className="bg-white rounded-lg shadow-lg p-4"
                dangerouslySetInnerHTML={{
                    __html: renderHtmlWithData(previewTemplate.template),
                }}
                />
            )}
            </div>

            <DialogFooter className="flex gap-3 pt-4 border-t flex-shrink-0">
            <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="rounded-xl"
            >
                Close
            </Button>

            <Button
                className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md hover:opacity-90"
                onClick={() => {
                const el = document.getElementById("template-preview");
                if (el) {
                    const w = window.open("", "_blank");
                    w?.document.write(`
                    <html>
                        <head>
                        <title>${previewTemplate?.name}</title>
                        <style>
                            body{
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            min-height:100vh;
                            margin:0;
                            background:#f1f5f9;
                            font-family:Inter,sans-serif;
                            }
                        </style>
                        </head>
                        <body>
                        ${el.innerHTML}
                        <script>window.print()<\/script>
                        </body>
                    </html>
                    `);
                }
                }}
            >
                <Download size={16} className="mr-1" />
                Download / Print
            </Button>
            </DialogFooter>

        </DialogContent>
        </Dialog>
    </AdminLayout>
  );
}

function TemplateCard({
  template,
  onPreview,
  onEdit,
  onDelete,
  onDuplicate,
  renderHtml,
}: {
  template: Template;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  renderHtml: (html: string) => string;
}) {
  const cat = categoryConfig[template.type] || categoryConfig["CERTIFICATE"];

  return (
    <Card className="shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 group rounded-2xl overflow-hidden border border-gray-100 bg-gradient-to-br from-white/80 to-gray-50 backdrop-blur-sm">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-gray-800">{template.name}</CardTitle>
            <CardDescription className="text-xs text-gray-500">{template.createdAt}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={`text-[10px] font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${cat.color} text-white shadow-sm`}
          >
            {cat.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-4 pb-4">
        <div
          className="border border-gray-200 rounded-xl bg-white/70 p-3 h-44 overflow-hidden flex items-start justify-center shadow-inner transition-all duration-300 group-hover:scale-105"
          style={{
            transform: "scale(0.35)",
            transformOrigin: "top center",
            height: "150px",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: renderHtml(template.template) }} />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 text-xs h-8 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-colors"
            onClick={onPreview}
          >
            <Eye size={12} className="mr-1" /> Preview
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-100 hover:text-yellow-700 transition-colors"
            onClick={onEdit}
          >
            <Edit size={12} />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-colors"
            onClick={onDuplicate}
          >
            <Copy size={12} />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
            onClick={onDelete}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}