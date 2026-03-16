/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  IndianRupeeIcon, Globe, Plus, Pencil, Trash2, Search, Star, Check,
  User,
  Shield,
  Database,
  Upload,
  Key,
  Monitor,
  EyeOff,
  Eye,
  Copy,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Textarea } from "@/components/ui/textarea";

// ─── Mock Data ────────────────────────────────────────────────────
interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  status: "active" | "inactive";
}

interface Language {
  id: number;
  name: string;
  code: string;
  nativeName: string;
  direction: "ltr" | "rtl";
  isDefault: boolean;
  status: "active" | "inactive";
}

// ─── API Keys Tab ─────────────────────────────────────────────────
interface ApiKey {
  id: number;
  provider: string;
  label: string;
  keyType: "public" | "secret";
  value: string;
  status: "active" | "inactive";
  lastUpdated: string;
}

const initialApiKeys: ApiKey[] = [
  { id: 1, provider: "Razorpay", label: "Razorpay Key ID", keyType: "public", value: "rzp_live_xxxxxxxxxxxxxxx", status: "active", lastUpdated: "2026-03-10" },
  { id: 2, provider: "Razorpay", label: "Razorpay Key Secret", keyType: "secret", value: "xxxxxxxxxxxxxxxxxxxxxxxxxx", status: "active", lastUpdated: "2026-03-10" },
  { id: 3, provider: "Stripe", label: "Stripe Publishable Key", keyType: "public", value: "pk_live_xxxxxxxxxxxxxxx", status: "inactive", lastUpdated: "2026-02-20" },
  { id: 4, provider: "Stripe", label: "Stripe Secret Key", keyType: "secret", value: "sk_live_xxxxxxxxxxxxxxx", status: "inactive", lastUpdated: "2026-02-20" },
  { id: 5, provider: "PayU", label: "PayU Merchant Key", keyType: "public", value: "xxxxxxxx", status: "inactive", lastUpdated: "2026-01-15" },
];

const initialCurrencies: Currency[] = [
  { id: 1, name: "Indian Rupee", code: "INR", symbol: "₹", exchangeRate: 1, isDefault: true, status: "active" },
  { id: 2, name: "US Dollar", code: "USD", symbol: "$", exchangeRate: 0.012, isDefault: false, status: "active" },
  { id: 3, name: "Euro", code: "EUR", symbol: "€", exchangeRate: 0.011, isDefault: false, status: "active" },
  { id: 4, name: "British Pound", code: "GBP", symbol: "£", exchangeRate: 0.0095, isDefault: false, status: "active" },
  { id: 5, name: "Japanese Yen", code: "JPY", symbol: "¥", exchangeRate: 1.79, isDefault: false, status: "inactive" },
  { id: 6, name: "UAE Dirham", code: "AED", symbol: "د.إ", exchangeRate: 0.044, isDefault: false, status: "active" },
  { id: 7, name: "Saudi Riyal", code: "SAR", symbol: "﷼", exchangeRate: 0.045, isDefault: false, status: "inactive" },
  { id: 8, name: "Canadian Dollar", code: "CAD", symbol: "C$", exchangeRate: 0.016, isDefault: false, status: "active" },
];

const initialLanguages: Language[] = [
  { id: 1, name: "English", code: "en", nativeName: "English", direction: "ltr", isDefault: true, status: "active" },
  { id: 2, name: "Hindi", code: "hi", nativeName: "हिन्दी", direction: "ltr", isDefault: false, status: "active" },
  { id: 3, name: "Tamil", code: "ta", nativeName: "தமிழ்", direction: "ltr", isDefault: false, status: "active" },
  { id: 4, name: "Telugu", code: "te", nativeName: "తెలుగు", direction: "ltr", isDefault: false, status: "active" },
  { id: 5, name: "Arabic", code: "ar", nativeName: "العربية", direction: "rtl", isDefault: false, status: "active" },
  { id: 6, name: "Urdu", code: "ur", nativeName: "اردو", direction: "rtl", isDefault: false, status: "inactive" },
  { id: 7, name: "Marathi", code: "mr", nativeName: "मराठी", direction: "ltr", isDefault: false, status: "active" },
  { id: 8, name: "Bengali", code: "bn", nativeName: "বাংলা", direction: "ltr", isDefault: false, status: "inactive" },
  { id: 9, name: "Gujarati", code: "gu", nativeName: "ગુજરાતી", direction: "ltr", isDefault: false, status: "active" },
  { id: 10, name: "Kannada", code: "kn", nativeName: "ಕನ್ನಡ", direction: "ltr", isDefault: false, status: "inactive" },
];

// ─── Currency Tab ─────────────────────────────────────────────────
function CurrencyTab() {
  const { toast } = useToast();
  const [currencies, setCurrencies] = useState<Currency[]>(initialCurrencies);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Currency | null>(null);
  const [form, setForm] = useState({ name: "", code: "", symbol: "", exchangeRate: "1", status: "active" as "active" | "inactive" });

  const filtered = currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", code: "", symbol: "", exchangeRate: "1", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (c: Currency) => {
    setEditItem(c);
    setForm({ name: c.name, code: c.code, symbol: c.symbol, exchangeRate: String(c.exchangeRate), status: c.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code || !form.symbol) return;
    if (editItem) {
      setCurrencies((prev) =>
        prev.map((c) => (c.id === editItem.id ? { ...c, ...form, exchangeRate: parseFloat(form.exchangeRate) || 1 } : c))
      );
      toast({ title: "Currency updated", description: `${form.name} has been updated.` });
    } else {
      const newId = Math.max(...currencies.map((c) => c.id)) + 1;
      setCurrencies((prev) => [...prev, { id: newId, ...form, exchangeRate: parseFloat(form.exchangeRate) || 1, isDefault: false }]);
      toast({ title: "Currency added", description: `${form.name} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const c = currencies.find((x) => x.id === id);
    if (c?.isDefault) return toast({ title: "Cannot delete", description: "Default currency cannot be deleted.", variant: "destructive" });
    setCurrencies((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Deleted", description: "Currency removed." });
  };

  const setDefault = (id: number) => {
    setCurrencies((prev) =>
      prev.map((c) => ({ ...c, isDefault: c.id === id }))
    );
    toast({ title: "Default updated" });
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <IndianRupeeIcon className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{currencies.length}</p>
              <p className="text-sm text-muted-foreground">Total Currencies</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{currencies.filter((c) => c.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{currencies.find((c) => c.isDefault)?.code ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Default Currency</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search currencies..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={openAdd}><Plus size={16} /> Add Currency</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Exchange Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell><Badge variant="outline">{c.code}</Badge></TableCell>
                  <TableCell className="text-lg">{c.symbol}</TableCell>
                  <TableCell>{c.exchangeRate}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {c.isDefault ? (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <button onClick={() => setDefault(c.id)} className="text-xs text-primary hover:underline">Set</button>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(c)}><Pencil size={14} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No currencies found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Currency" : "Add Currency"}</DialogTitle>
            <DialogDescription>Fill in the details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Currency Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. US Dollar" />
              </div>
              <div className="space-y-2">
                <Label>Code (ISO 4217)</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. USD" maxLength={3} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Symbol</Label>
                <Input value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} placeholder="e.g. $" />
              </div>
              <div className="space-y-2">
                <Label>Exchange Rate (to default)</Label>
                <Input type="number" step="0.0001" value={form.exchangeRate} onChange={(e) => setForm({ ...form, exchangeRate: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Language Tab ─────────────────────────────────────────────────
function LanguageTab() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>(initialLanguages);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Language | null>(null);
  const [form, setForm] = useState({ name: "", code: "", nativeName: "", direction: "ltr" as "ltr" | "rtl", status: "active" as "active" | "inactive" });

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.includes(search)
  );

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", code: "", nativeName: "", direction: "ltr", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (l: Language) => {
    setEditItem(l);
    setForm({ name: l.name, code: l.code, nativeName: l.nativeName, direction: l.direction, status: l.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.code) return;
    if (editItem) {
      setLanguages((prev) =>
        prev.map((l) => (l.id === editItem.id ? { ...l, ...form } : l))
      );
      toast({ title: "Language updated", description: `${form.name} has been updated.` });
    } else {
      const newId = Math.max(...languages.map((l) => l.id)) + 1;
      setLanguages((prev) => [...prev, { id: newId, ...form, isDefault: false }]);
      toast({ title: "Language added", description: `${form.name} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    const l = languages.find((x) => x.id === id);
    if (l?.isDefault) return toast({ title: "Cannot delete", description: "Default language cannot be deleted.", variant: "destructive" });
    setLanguages((prev) => prev.filter((x) => x.id !== id));
    toast({ title: "Deleted", description: "Language removed." });
  };

  const { setLang } = useLanguage();

  const setDefault = (id: number) => {
    setLanguages((prev) =>
      prev.map((l) => ({ ...l, isDefault: l.id === id }))
    );
    const selected = languages.find((l) => l.id === id);
    if (selected) {
      // update global language so UI switches immediately
      setLang(selected.code as any);
    }
    toast({ title: "Default updated" });
  };

  const toggleStatus = (id: number) => {
    setLanguages((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: l.status === "active" ? "inactive" : "active" } : l))
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Globe className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{languages.length}</p>
              <p className="text-sm text-muted-foreground">Total Languages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{languages.filter((l) => l.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Star className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{languages.find((l) => l.isDefault)?.name ?? "—"}</p>
              <p className="text-sm text-muted-foreground">Default Language</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{languages.filter((l) => l.direction === "rtl").length}</p>
              <p className="text-sm text-muted-foreground">RTL Languages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search languages..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={openAdd}><Plus size={16} /> Add Language</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Native Name</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Default</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l) => (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{l.name}</TableCell>
                  <TableCell><Badge variant="outline">{l.code}</Badge></TableCell>
                  <TableCell>{l.nativeName}</TableCell>
                  <TableCell>
                    <Badge variant={l.direction === "rtl" ? "default" : "secondary"}>
                      {l.direction.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={l.status === "active"} onCheckedChange={() => toggleStatus(l.id)} />
                  </TableCell>
                  <TableCell>
                    {l.isDefault ? (
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    ) : (
                      <button onClick={() => setDefault(l.id)} className="text-xs text-primary hover:underline">Set</button>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil size={14} /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(l.id)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No languages found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Language" : "Add Language"}</DialogTitle>
            <DialogDescription>Fill in the language details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Language Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. French" />
              </div>
              <div className="space-y-2">
                <Label>Code (ISO 639-1)</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase() })} placeholder="e.g. fr" maxLength={5} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Native Name</Label>
                <Input value={form.nativeName} onChange={(e) => setForm({ ...form, nativeName: e.target.value })} placeholder="e.g. Français" />
              </div>
              <div className="space-y-2">
                <Label>Text Direction</Label>
                <Select value={form.direction} onValueChange={(v) => setForm({ ...form, direction: v as "ltr" | "rtl" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ltr">Left to Right (LTR)</SelectItem>
                    <SelectItem value="rtl">Right to Left (RTL)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ApiKeysTab() {
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ApiKey | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<number>>(new Set());
  const [form, setForm] = useState({
    provider: "",
    label: "",
    keyType: "public" as "public" | "secret",
    value: "",
    status: "active" as "active" | "inactive",
  });

  const filtered = apiKeys.filter(
    (k) =>
      k.provider.toLowerCase().includes(search.toLowerCase()) ||
      k.label.toLowerCase().includes(search.toLowerCase())
  );

  const providers = [...new Set(apiKeys.map((k) => k.provider))];

  const toggleVisibility = (id: number) => {
    setVisibleKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const maskValue = (val: string) => {
    if (val.length <= 8) return "••••••••";
    return val.slice(0, 4) + "••••••••" + val.slice(-4);
  };

  const copyToClipboard = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: "Copied", description: "API key copied to clipboard." });
  };

  const openAdd = () => {
    setEditItem(null);
    setForm({ provider: "", label: "", keyType: "public", value: "", status: "active" });
    setDialogOpen(true);
  };

  const openEdit = (k: ApiKey) => {
    setEditItem(k);
    setForm({ provider: k.provider, label: k.label, keyType: k.keyType, value: k.value, status: k.status });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.provider || !form.label || !form.value) return;
    const today = new Date().toISOString().split("T")[0];
    if (editItem) {
      setApiKeys((prev) =>
        prev.map((k) => (k.id === editItem.id ? { ...k, ...form, lastUpdated: today } : k))
      );
      toast({ title: "API Key updated", description: `${form.label} has been updated.` });
    } else {
      const newId = Math.max(...apiKeys.map((k) => k.id), 0) + 1;
      setApiKeys((prev) => [...prev, { id: newId, ...form, lastUpdated: today }]);
      toast({ title: "API Key added", description: `${form.label} has been added.` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast({ title: "Deleted", description: "API key removed." });
  };

  const toggleStatus = (id: number) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: k.status === "active" ? "inactive" : "active" } : k))
    );
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Key className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{apiKeys.length}</p>
              <p className="text-sm text-muted-foreground">Total Keys</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{apiKeys.filter((k) => k.status === "active").length}</p>
              <p className="text-sm text-muted-foreground">Active Keys</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Shield className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{apiKeys.filter((k) => k.keyType === "secret").length}</p>
              <p className="text-sm text-muted-foreground">Secret Keys</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Globe className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{providers.length}</p>
              <p className="text-sm text-muted-foreground">Providers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input placeholder="Search API keys..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Button onClick={openAdd}><Plus size={16} /> Add API Key</Button>
          </div>
        </CardContent>
      </Card>

      {/* Grouped by Provider */}
      {providers.filter((p) => filtered.some((k) => k.provider === p)).map((provider) => (
        <Card key={provider}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{provider}</CardTitle>
            <CardDescription>
              {apiKeys.filter((k) => k.provider === provider && k.status === "active").length} active key(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Key Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.filter((k) => k.provider === provider).map((k) => (
                  <TableRow key={k.id}>
                    <TableCell className="font-medium">{k.label}</TableCell>
                    <TableCell>
                      <Badge variant={k.keyType === "secret" ? "destructive" : "outline"}>
                        {k.keyType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {visibleKeys.has(k.id) ? k.value : maskValue(k.value)}
                        </code>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => toggleVisibility(k.id)}>
                          {visibleKeys.has(k.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyToClipboard(k.value)}>
                          <Copy size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={k.status === "active"} onCheckedChange={() => toggleStatus(k.id)} />
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{k.lastUpdated}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(k)}><Pencil size={14} /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(k.id)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">No API keys found</CardContent>
        </Card>
      )}

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit API Key" : "Add API Key"}</DialogTitle>
            <DialogDescription>Enter the API key details below. Secret keys will be masked by default.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Input value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} placeholder="e.g. Razorpay, Stripe, PayU" />
              </div>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Razorpay Key ID" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Key Type</Label>
                <Select value={form.keyType} onValueChange={(v) => setForm({ ...form, keyType: v as "public" | "secret" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public Key</SelectItem>
                    <SelectItem value="secret">Secret Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>API Key Value</Label>
              <Textarea
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                placeholder="Paste your API key here..."
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function SystemSettingsPage() {
  const path = window.location.pathname;
  const defaultTab = path.includes("/settings/language") ? "language" : "currency";

    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleSaveProfile = () => {
    toast.success("Profile settings saved successfully");
  };


  const handleSaveSecurity = () => {
    toast.success("Security settings updated");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and system preferences</p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue={defaultTab} className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="currency" className="gap-2"><IndianRupeeIcon size={14} /> Currency</TabsTrigger>
            <TabsTrigger value="language" className="gap-2"><Globe size={14} /> Language</TabsTrigger>

            <TabsTrigger value="system" className="gap-2">
              <Database className="w-4 h-4" />
              System
            </TabsTrigger>
            <TabsTrigger value="api-keys" className="gap-2"><Key size={14} /> API Keys</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile picture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback className="text-xl">JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Change Photo
                    </Button>
                    <p className="text-sm text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="john.doe@eduadmin.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Super Admin" disabled className="bg-muted" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Password & Authentication</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" placeholder="••••••••" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Key className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSecurity}>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active login sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { device: "MacBook Pro", location: "New York, US", current: true, time: "Active now" },
                  { device: "iPhone 14", location: "New York, US", current: false, time: "2 hours ago" },
                  { device: "Windows PC", location: "Boston, US", current: false, time: "3 days ago" },
                ].map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              Current
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{session.location} • {session.time}</p>
                      </div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Currency Settings */}
          <TabsContent value="currency" className="space-y-6" ><CurrencyTab /></TabsContent>


          {/* Language Settings */}
          <TabsContent value="language" className="space-y-6" ><LanguageTab /></TabsContent>
          <TabsContent value="api-keys" className="space-y-6" ><ApiKeysTab /></TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings for your institution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution Name</Label>
                    <Input id="institutionName" defaultValue="EduAdmin Academy" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institutionCode">Institution Code</Label>
                    <Input id="institutionCode" defaultValue="EDU-001" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="academicYear">Current Academic Year</Label>
                    <Select defaultValue="2024-25">
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2023-24">2023-2024</SelectItem>
                        <SelectItem value="2024-25">2024-2025</SelectItem>
                        <SelectItem value="2025-26">2025-2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Data & Storage</h4>
                  <div className="p-4 rounded-lg border border-border space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Storage Used</span>
                      <span className="font-medium">2.4 GB / 10 GB</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Export Data</Button>
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}