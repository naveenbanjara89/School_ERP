// /* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { useState } from "react";
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

/* ================= TYPES ================= */

interface Template {
  id: string;
  name: string;
  category: "id-card" | "admit-card" | "marksheet" | "transfer" | "certificate";
  htmlCode: string;
  createdAt: string;
  isDefault: boolean;
}

const defaultTemplates: Template[] = [
  {
    id: "1",
    name: "Classic Blue ID Card",
    category: "id-card",
    htmlCode: `<div style="width:340px;height:520px;border-radius:16px;overflow:hidden;font-family:'Inter',sans-serif;background:linear-gradient(135deg,#1e40af 0%,#3b82f6 50%,#60a5fa 100%);color:#fff;position:relative;box-shadow:0 8px 32px rgba(30,64,175,0.3)">
  <div style="text-align:center;padding:20px 16px 12px">
    <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;opacity:0.85">{{school_name}}</div>
    <div style="font-size:7px;margin-top:2px;opacity:0.7">{{school_address}}</div>
    <div style="margin:12px auto;width:90px;height:90px;border-radius:50%;border:3px solid rgba(255,255,255,0.5);overflow:hidden;background:#fff">
      <img src="{{photo_url}}" alt="Student" style="width:100%;height:100%;object-fit:cover" />
    </div>
    <div style="font-size:16px;font-weight:700;margin-top:6px">{{student_name}}</div>
    <div style="background:rgba(255,255,255,0.2);border-radius:20px;display:inline-block;padding:3px 14px;font-size:9px;margin-top:6px">{{admission_no}}</div>
  </div>
  <div style="background:rgba(255,255,255,0.95);color:#1e293b;border-radius:16px 16px 0 0;padding:16px 20px;flex:1;margin-top:4px">
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:10px;color:#64748b">Class</span><span style="font-size:11px;font-weight:600">{{class}} - {{section}}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:10px;color:#64748b">Roll No</span><span style="font-size:11px;font-weight:600">{{roll_no}}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:10px;color:#64748b">DOB</span><span style="font-size:11px;font-weight:600">{{dob}}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:10px;color:#64748b">Blood Group</span><span style="font-size:11px;font-weight:600">{{blood_group}}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px"><span style="font-size:10px;color:#64748b">Parent</span><span style="font-size:11px;font-weight:600">{{parent_name}}</span></div>
    <div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">Contact</span><span style="font-size:11px;font-weight:600">{{contact}}</span></div>
    <div style="text-align:center;margin-top:12px;padding-top:8px;border-top:1px dashed #e2e8f0;font-size:8px;color:#94a3b8">Valid for Academic Year {{academic_year}}</div>
  </div>
</div>`,
    createdAt: "2025-01-15",
    isDefault: true,
  },
  {
    id: "2",
    name: "Modern Green ID Card",
    category: "id-card",
    htmlCode: `<div style="width:340px;height:520px;border-radius:16px;overflow:hidden;font-family:'Inter',sans-serif;background:linear-gradient(180deg,#065f46 0%,#10b981 100%);color:#fff;position:relative;box-shadow:0 8px 32px rgba(6,95,70,0.3)">
  <div style="text-align:center;padding:20px 16px 12px">
    <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700">{{school_name}}</div>
    <div style="font-size:7px;margin-top:2px;opacity:0.8">{{school_address}}</div>
    <div style="margin:14px auto;width:85px;height:85px;border-radius:12px;border:3px solid rgba(255,255,255,0.4);overflow:hidden;background:#fff">
      <img src="{{photo_url}}" alt="Student" style="width:100%;height:100%;object-fit:cover" />
    </div>
    <div style="font-size:15px;font-weight:700">{{student_name}}</div>
    <div style="background:rgba(255,255,255,0.2);border-radius:8px;display:inline-block;padding:3px 14px;font-size:9px;margin-top:6px">ID: {{admission_no}}</div>
  </div>
  <div style="background:#fff;color:#1e293b;border-radius:20px 20px 0 0;padding:18px 22px;margin-top:8px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div><div style="font-size:9px;color:#64748b">Class</div><div style="font-size:12px;font-weight:600">{{class}} - {{section}}</div></div>
      <div><div style="font-size:9px;color:#64748b">Roll No</div><div style="font-size:12px;font-weight:600">{{roll_no}}</div></div>
      <div><div style="font-size:9px;color:#64748b">DOB</div><div style="font-size:12px;font-weight:600">{{dob}}</div></div>
      <div><div style="font-size:9px;color:#64748b">Blood</div><div style="font-size:12px;font-weight:600">{{blood_group}}</div></div>
    </div>
    <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e2e8f0">
      <div style="font-size:9px;color:#64748b">Parent / Guardian</div>
      <div style="font-size:11px;font-weight:600">{{parent_name}} • {{contact}}</div>
    </div>
    <div style="text-align:center;margin-top:10px;font-size:8px;color:#94a3b8">Session {{academic_year}}</div>
  </div>
</div>`,
    createdAt: "2025-01-20",
    isDefault: false,
  },
  {
    id: "3",
    name: "Minimal Dark ID Card",
    category: "id-card",
    htmlCode: `<div style="width:340px;height:520px;border-radius:16px;overflow:hidden;font-family:'Inter',sans-serif;background:#0f172a;color:#e2e8f0;position:relative;box-shadow:0 8px 32px rgba(15,23,42,0.5)">
  <div style="background:linear-gradient(90deg,#6366f1,#8b5cf6);height:6px"></div>
  <div style="padding:20px;text-align:center">
    <div style="font-size:12px;font-weight:800;letter-spacing:1px">{{school_name}}</div>
    <div style="font-size:7px;color:#94a3b8;margin-top:2px">{{school_address}}</div>
    <div style="margin:16px auto;width:80px;height:80px;border-radius:50%;border:2px solid #6366f1;overflow:hidden">
      <img src="{{photo_url}}" alt="Student" style="width:100%;height:100%;object-fit:cover" />
    </div>
    <div style="font-size:16px;font-weight:700;color:#fff">{{student_name}}</div>
    <div style="font-size:10px;color:#a78bfa;margin-top:2px">{{admission_no}}</div>
  </div>
  <div style="padding:0 24px">
    <div style="background:#1e293b;border-radius:12px;padding:14px 16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:#64748b">Class & Section</span><span style="font-size:11px;font-weight:600;color:#fff">{{class}} - {{section}}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:#64748b">Roll Number</span><span style="font-size:11px;font-weight:600;color:#fff">{{roll_no}}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:#64748b">Date of Birth</span><span style="font-size:11px;font-weight:600;color:#fff">{{dob}}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:#64748b">Blood Group</span><span style="font-size:11px;font-weight:600;color:#fff">{{blood_group}}</span></div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:10px;color:#64748b">Guardian</span><span style="font-size:11px;font-weight:600;color:#fff">{{parent_name}}</span></div>
      <div style="display:flex;justify-content:space-between"><span style="font-size:10px;color:#64748b">Phone</span><span style="font-size:11px;font-weight:600;color:#fff">{{contact}}</span></div>
    </div>
    <div style="text-align:center;margin-top:12px;font-size:8px;color:#475569">Academic Year {{academic_year}}</div>
  </div>
</div>`,
    createdAt: "2025-02-01",
    isDefault: false,
  },
  {
    id: "4",
    name: "Standard Admit Card",
    category: "admit-card",
    htmlCode: `<div style="width:600px;padding:30px;font-family:'Inter',sans-serif;border:2px solid #1e40af;border-radius:12px;background:#fff">
  <div style="text-align:center;border-bottom:2px solid #1e40af;padding-bottom:14px;margin-bottom:16px">
    <div style="font-size:18px;font-weight:800;color:#1e40af">{{school_name}}</div>
    <div style="font-size:10px;color:#64748b;margin-top:2px">{{school_address}}</div>
    <div style="margin-top:8px;background:#1e40af;color:#fff;display:inline-block;padding:4px 20px;border-radius:4px;font-size:12px;font-weight:700;letter-spacing:1px">ADMIT CARD</div>
  </div>
  <div style="display:flex;gap:20px">
    <div style="flex:1">
      <table style="width:100%;font-size:12px"><tr><td style="color:#64748b;padding:4px 0;width:100px">Name</td><td style="font-weight:600">{{student_name}}</td></tr><tr><td style="color:#64748b;padding:4px 0">Adm. No</td><td style="font-weight:600">{{admission_no}}</td></tr><tr><td style="color:#64748b;padding:4px 0">Class</td><td style="font-weight:600">{{class}} - {{section}}</td></tr><tr><td style="color:#64748b;padding:4px 0">Roll No</td><td style="font-weight:600">{{roll_no}}</td></tr><tr><td style="color:#64748b;padding:4px 0">Exam</td><td style="font-weight:600">{{exam_name}}</td></tr></table>
    </div>
    <div style="width:90px;height:110px;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden"><img src="{{photo_url}}" alt="Student" style="width:100%;height:100%;object-fit:cover" /></div>
  </div>
  <div style="margin-top:16px;font-size:10px;color:#64748b;border-top:1px dashed #e2e8f0;padding-top:10px;display:flex;justify-content:space-between"><span>Date: {{exam_date}}</span><span>Authorized Signature ________________</span></div>
</div>`,
    createdAt: "2025-01-25",
    isDefault: true,
  },
  {
    id: "5",
    name: "Transfer Certificate",
    category: "transfer",
    htmlCode: `<div style="width:650px;padding:40px;font-family:'Inter',sans-serif;border:3px double #1e293b;background:#fff">
  <div style="text-align:center;margin-bottom:20px">
    <div style="font-size:20px;font-weight:800;color:#1e293b">{{school_name}}</div>
    <div style="font-size:10px;color:#64748b">{{school_address}}</div>
    <div style="margin-top:10px;font-size:14px;font-weight:700;text-decoration:underline;letter-spacing:2px">TRANSFER CERTIFICATE</div>
    <div style="font-size:10px;color:#64748b;margin-top:4px">TC No: {{tc_number}}</div>
  </div>
  <div style="font-size:12px;line-height:2.2;color:#334155">
    <p>This is to certify that <strong>{{student_name}}</strong>, son/daughter of <strong>{{parent_name}}</strong>, bearing Admission No. <strong>{{admission_no}}</strong>, was a bonafide student of this institution.</p>
    <table style="width:100%;margin:10px 0"><tr><td style="color:#64748b;width:200px;padding:2px 0">Class Last Attended</td><td style="font-weight:600">{{class}} - {{section}}</td></tr><tr><td style="color:#64748b;padding:2px 0">Date of Birth</td><td style="font-weight:600">{{dob}}</td></tr><tr><td style="color:#64748b;padding:2px 0">Date of Admission</td><td style="font-weight:600">{{admission_date}}</td></tr><tr><td style="color:#64748b;padding:2px 0">Date of Leaving</td><td style="font-weight:600">{{leaving_date}}</td></tr><tr><td style="color:#64748b;padding:2px 0">Reason for Leaving</td><td style="font-weight:600">{{reason}}</td></tr><tr><td style="color:#64748b;padding:2px 0">Character & Conduct</td><td style="font-weight:600">{{conduct}}</td></tr></table>
  </div>
  <div style="display:flex;justify-content:space-between;margin-top:40px;font-size:11px;color:#64748b"><div>Date: {{issue_date}}</div><div style="text-align:center"><div>________________</div><div style="margin-top:4px">Principal</div></div></div>
</div>`,
    createdAt: "2025-02-10",
    isDefault: true,
  },
];

const categoryConfig = {
  "id-card": { label: "ID Card", icon: CreditCard, color: "bg-primary/10 text-primary" },
  "admit-card": { label: "Admit Card", icon: FileText, color: "bg-accent/10 text-accent" },
  "marksheet": { label: "Marksheet", icon: GraduationCap, color: "bg-[hsl(var(--card-green))]/10 text-[hsl(var(--card-green))]" },
  "transfer": { label: "Transfer Certificate", icon: FileCheck, color: "bg-[hsl(var(--card-orange))]/10 text-[hsl(var(--card-orange))]" },
  "certificate": { label: "Certificate", icon: Award, color: "bg-[hsl(var(--card-cyan))]/10 text-[hsl(var(--card-cyan))]" },
};

/* =============== PAGE ================= */

export default function CertificatePage() {
  const pathname = usePathname();
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const [formData, setFormData] = useState({
    name: "",
    category: "id-card" as Template["category"],
    htmlCode: "",
  });

  const getActiveTab = () => {
    if (pathname.includes("admit-card")) return "admit-card";
    if (pathname.includes("marksheet")) return "marksheet";
    if (pathname.includes("transfer")) return "transfer";
    if (pathname.includes("generate")) return "generate";
    return "id-card";
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

  const handleSave = () => {
    if (!formData.name || !formData.htmlCode) {
      toast({ title: "Error", description: "Please fill name and HTML code", variant: "destructive" });
      return;
    }
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...formData } : t));
      toast({ title: "Template Updated" });
    } else {
      const newT: Template = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        isDefault: false,
      };
      setTemplates(prev => [...prev, newT]);
      toast({ title: "Template Created" });
    }
    setShowEditor(false);
    setEditingTemplate(null);
    setFormData({ name: "", category: "id-card", htmlCode: "" });
  };

  const handleEdit = (t: Template) => {
    setEditingTemplate(t);
    setFormData({ name: t.name, category: t.category, htmlCode: t.htmlCode });
    setShowEditor(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    toast({ title: "Template Deleted" });
  };

  const handleDuplicate = (t: Template) => {
    const dup: Template = { ...t, id: Date.now().toString(), name: `${t.name} (Copy)`, isDefault: false };
    setTemplates(prev => [...prev, dup]);
    toast({ title: "Template Duplicated" });
  };

  const filtered = filterCategory === "all" ? templates : templates.filter(t => t.category === filterCategory);
  const stats = {
    total: templates.length,
    idCards: templates.filter(t => t.category === "id-card").length,
    admitCards: templates.filter(t => t.category === "admit-card").length,
    certificates: templates.filter(t => ["transfer", "certificate", "marksheet"].includes(t.category)).length,
  };

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
                Create and manage HTML templates for ID cards, admit cards, marksheets & certificates
            </p>
            </div>

            <Button
            onClick={() => {
                setEditingTemplate(null);
                setFormData({ name: "", category: "id-card", htmlCode: "" });
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
            <Tabs defaultValue={getActiveTab()} className="w-full">
            {/* Tab List */}
            <TabsList className="bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 rounded-xl p-1 shadow-inner mb-6">
                <TabsTrigger
                value="id-card"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-purple-400 data-[state=active]:bg-purple-500 data-[state=active]:text-white transition-colors"
                >
                ID Cards
                </TabsTrigger>
                <TabsTrigger
                value="admit-card"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-pink-400 data-[state=active]:bg-pink-500 data-[state=active]:text-white transition-colors"
                >
                Admit Cards
                </TabsTrigger>
                <TabsTrigger
                value="marksheet"
                className="rounded-lg text-sm font-semibold text-gray-700 hover:text-white hover:bg-green-400 data-[state=active]:bg-green-500 data-[state=active]:text-white transition-colors"
                >
                Marksheets
                </TabsTrigger>
                <TabsTrigger
                value="transfer"
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
            {(["id-card", "admit-card", "marksheet", "transfer"] as const).map((cat) => (
                <TabsContent className="transition-all duration-300" key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.filter((t) => t.category === cat).length === 0 ? (
                    <Card className="col-span-full border-dashed border-2 border-gray-300 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 shadow-inner rounded-xl">
                        <CardContent className="p-12 text-center text-gray-400 text-lg flex flex-col items-center justify-center gap-2">
                        <span className="text-4xl">📄</span>
                        No templates yet. Click <strong>Create Template</strong> to add one.
                        </CardContent>
                    </Card>
                    ) : (
                    templates
                        .filter((t) => t.category === cat)
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
                        <SelectItem value="id-card">ID Cards</SelectItem>
                        <SelectItem value="admit-card">Admit Cards</SelectItem>
                        <SelectItem value="marksheet">Marksheets</SelectItem>
                        <SelectItem value="transfer">Transfer Certificates</SelectItem>
                        <SelectItem value="certificate">Certificates</SelectItem>
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
                            setFormData((p) => ({ ...p, category: v as Template["category"] }))
                            }
                        >
                            <SelectTrigger className="rounded-xl bg-purple-50/60 border-purple-200 focus:ring-2 focus:ring-purple-400">
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="id-card">ID Card</SelectItem>
                            <SelectItem value="admit-card">Admit Card</SelectItem>
                            <SelectItem value="marksheet">Marksheet</SelectItem>
                            <SelectItem value="transfer">Transfer Certificate</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
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
                    __html: renderHtmlWithData(previewTemplate.htmlCode),
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
  const cat = categoryConfig[template.category];

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
          <div dangerouslySetInnerHTML={{ __html: renderHtml(template.htmlCode) }} />
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