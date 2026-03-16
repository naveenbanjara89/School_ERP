"use client"


import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Dumbbell,
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  Users,
  Trophy,
  Medal,
  Clock,
  UserCog,
} from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Sports list
const sportsList = [
  { id: 1, name: "Cricket", category: "Team Sport", coach: "Mr. Rajesh Kumar", students: 45, status: "Active", season: "Winter" },
  { id: 2, name: "Football", category: "Team Sport", coach: "Mr. Anil Verma", students: 38, status: "Active", season: "Monsoon" },
  { id: 3, name: "Badminton", category: "Individual", coach: "Ms. Priya Singh", students: 25, status: "Active", season: "All Year" },
  { id: 4, name: "Athletics", category: "Individual", coach: "Mr. Suresh Patel", students: 30, status: "Active", season: "Winter" },
  { id: 5, name: "Basketball", category: "Team Sport", coach: "Mr. Vikram Rao", students: 28, status: "Active", season: "Winter" },
  { id: 6, name: "Swimming", category: "Individual", coach: "Ms. Neha Gupta", students: 20, status: "Inactive", season: "Summer" },
  { id: 7, name: "Table Tennis", category: "Individual", coach: "Mr. Amit Shah", students: 15, status: "Active", season: "All Year" },
  { id: 8, name: "Kabaddi", category: "Team Sport", coach: "Mr. Ravi Yadav", students: 22, status: "Active", season: "Winter" },
];

// Enrollment data
const enrollmentData = [
  { id: 1, student: "Rahul Mehta", class: "9-A", sport: "Cricket", enrollDate: "2026-01-10", fee: "₹2,000", status: "Active" },
  { id: 2, student: "Priya Sharma", class: "10-B", sport: "Badminton", enrollDate: "2026-01-12", fee: "₹1,500", status: "Active" },
  { id: 3, student: "Amit Tiwari", class: "8-C", sport: "Football", enrollDate: "2026-01-15", fee: "₹2,000", status: "Active" },
  { id: 4, student: "Kavita Nair", class: "9-B", sport: "Athletics", enrollDate: "2026-01-18", fee: "₹1,000", status: "Inactive" },
  { id: 5, student: "Suresh Yadav", class: "10-A", sport: "Basketball", enrollDate: "2026-01-20", fee: "₹2,000", status: "Active" },
  { id: 6, student: "Pooja Gupta", class: "7-A", sport: "Swimming", enrollDate: "2026-02-01", fee: "₹3,000", status: "Active" },
];

// Coach data
const coachData = [
  { id: 1, name: "Mr. Rajesh Kumar", sport: "Cricket", experience: "12 years", qualification: "NIS Certified", phone: "9876543210", salary: "₹35,000", status: "Active" },
  { id: 2, name: "Mr. Anil Verma", sport: "Football", experience: "8 years", qualification: "AFC License", phone: "9876543211", salary: "₹30,000", status: "Active" },
  { id: 3, name: "Ms. Priya Singh", sport: "Badminton", experience: "6 years", qualification: "BWF Certified", phone: "9876543212", salary: "₹28,000", status: "Active" },
  { id: 4, name: "Mr. Suresh Patel", sport: "Athletics", experience: "15 years", qualification: "SAI Coach", phone: "9876543213", salary: "₹32,000", status: "Active" },
  { id: 5, name: "Mr. Vikram Rao", sport: "Basketball", experience: "10 years", qualification: "FIBA Licensed", phone: "9876543214", salary: "₹30,000", status: "On Leave" },
];

// Schedule data
const scheduleData = [
  { id: 1, sport: "Cricket", day: "Mon, Wed, Fri", time: "4:00 PM - 5:30 PM", venue: "Cricket Ground", coach: "Mr. Rajesh Kumar", students: 45 },
  { id: 2, sport: "Football", day: "Tue, Thu, Sat", time: "4:00 PM - 5:30 PM", venue: "Football Field", coach: "Mr. Anil Verma", students: 38 },
  { id: 3, sport: "Badminton", day: "Mon, Wed, Fri", time: "3:30 PM - 5:00 PM", venue: "Indoor Court", coach: "Ms. Priya Singh", students: 25 },
  { id: 4, sport: "Athletics", day: "Mon - Sat", time: "6:00 AM - 7:30 AM", venue: "Track & Field", coach: "Mr. Suresh Patel", students: 30 },
  { id: 5, sport: "Basketball", day: "Tue, Thu", time: "4:00 PM - 5:30 PM", venue: "Basketball Court", coach: "Mr. Vikram Rao", students: 28 },
];

// Tournament data
const tournamentData = [
  { id: 1, name: "Inter-School Cricket Championship", sport: "Cricket", date: "2026-03-10", venue: "District Stadium", teams: 8, status: "Upcoming", result: "-" },
  { id: 2, name: "State Level Athletics Meet", sport: "Athletics", date: "2026-02-20", venue: "State Ground", teams: 20, status: "Upcoming", result: "-" },
  { id: 3, name: "District Badminton Open", sport: "Badminton", date: "2026-01-15", venue: "Sports Complex", teams: 12, status: "Completed", result: "Winner" },
  { id: 4, name: "Inter-House Football Cup", sport: "Football", date: "2025-12-20", venue: "School Ground", teams: 4, status: "Completed", result: "Runner-up" },
  { id: 5, name: "National Basketball League (U-17)", sport: "Basketball", date: "2026-04-01", venue: "National Arena", teams: 16, status: "Registered", result: "-" },
];

// Achievements data
const achievementData = [
  { id: 1, student: "Rahul Mehta", class: "9-A", sport: "Cricket", event: "District Championship", achievement: "Best Batsman", date: "2025-12-15", level: "District" },
  { id: 2, student: "Priya Sharma", class: "10-B", sport: "Badminton", event: "State Open", achievement: "Gold Medal", date: "2026-01-15", level: "State" },
  { id: 3, student: "Amit Tiwari", class: "8-C", sport: "Athletics", event: "Inter-School Meet", achievement: "100m - 1st Place", date: "2025-11-20", level: "Inter-School" },
  { id: 4, student: "Kavita Nair", class: "9-B", sport: "Swimming", event: "National Championship", achievement: "Bronze Medal", date: "2025-10-10", level: "National" },
  { id: 5, student: "Suresh Yadav", class: "10-A", sport: "Basketball", event: "State Championship", achievement: "MVP Award", date: "2026-01-25", level: "State" },
];

const statusConfig: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-gray-100 text-gray-600 border-gray-200",
  "On Leave": "bg-amber-100 text-amber-700 border-amber-200",
  Upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Registered: "bg-purple-100 text-purple-700 border-purple-200",
};

const levelConfig: Record<string, string> = {
  "Inter-School": "bg-blue-100 text-blue-700 border-blue-200",
  District: "bg-amber-100 text-amber-700 border-amber-200",
  State: "bg-purple-100 text-purple-700 border-purple-200",
  National: "bg-red-100 text-red-700 border-red-200",
};

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [showDialog, setShowDialog] = useState(false);

  const stats = [
    { label: "Total Sports", value: sportsList.length, color: "from-blue-400 to-blue-600", icon: Dumbbell },
    { label: "Enrolled Students", value: 223, color: "from-emerald-400 to-green-600", icon: Users },
    { label: "Active Coaches", value: coachData.filter((c) => c.status === "Active").length, color: "from-purple-400 to-purple-600", icon: UserCog },
    { label: "Achievements", value: achievementData.length, color: "from-amber-400 to-orange-500", icon: Trophy },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Dumbbell size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Sports</h1>
            <p className="text-sm text-muted-foreground">Manage sports, coaches, schedules & achievements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-primary-foreground shadow-card animate-fade-in`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm opacity-80">{stat.label}</p>
              </div>
              <stat.icon size={28} className="opacity-40" />
            </div>
          </div>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted p-1 rounded-xl flex-wrap h-auto">
          <TabsTrigger value="list" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Dumbbell size={14} className="mr-1.5" /> Sports List
          </TabsTrigger>
          <TabsTrigger value="enrollment" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Users size={14} className="mr-1.5" /> Enrollment
          </TabsTrigger>
          <TabsTrigger value="coach" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <UserCog size={14} className="mr-1.5" /> Coach
          </TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Clock size={14} className="mr-1.5" /> Schedule
          </TabsTrigger>
          <TabsTrigger value="tournaments" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Trophy size={14} className="mr-1.5" /> Tournaments
          </TabsTrigger>
          <TabsTrigger value="achievements" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Medal size={14} className="mr-1.5" /> Achievements
          </TabsTrigger>
        </TabsList>

        {/* Sports List Tab */}
        <TabsContent value="list" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search sports..." className="pl-9 w-64 bg-card" />
            </div>
            <Dialog open={showDialog && activeTab === "list"} onOpenChange={(v) => setShowDialog(v)}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus size={16} /> Add Sport</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Add New Sport</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Sport Name</Label><Input placeholder="Enter sport name" /></div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="team">Team Sport</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Coach</Label><Input placeholder="Assign coach" /></div>
                    <div className="space-y-2">
                      <Label>Season</Label>
                      <Select><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="winter">Winter</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="monsoon">Monsoon</SelectItem>
                          <SelectItem value="all">All Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Sport description..." rows={3} /></div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                    <Button onClick={() => setShowDialog(false)}>Add Sport</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sportsList.map((sport) => (
              <div key={sport.id} className="bg-card rounded-xl border border-border p-4 hover:shadow-card transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg"><Dumbbell size={20} className="text-primary" /></div>
                  <Badge className={`text-xs border ${statusConfig[sport.status] || ""}`}>{sport.status}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mt-2">{sport.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{sport.category} • {sport.season}</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2"><UserCog size={12} />{sport.coach}</div>
                  <div className="flex items-center gap-2"><Users size={12} />{sport.students} students</div>
                </div>
                <div className="flex items-center gap-1 mt-3 pt-3 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-xs h-7"><Pencil size={12} className="mr-1" /> Edit</Button>
                  <Button variant="ghost" size="sm" className="text-xs h-7 text-destructive"><Trash2 size={12} className="mr-1" /> Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Enrollment Tab */}
        <TabsContent value="enrollment" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Enroll Student</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="font-semibold">Sport</TableHead>
                  <TableHead className="font-semibold">Enroll Date</TableHead>
                  <TableHead className="font-semibold">Fee</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollmentData.map((e, i) => (
                  <TableRow key={e.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{e.student}</TableCell>
                    <TableCell>{e.class}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{e.sport}</Badge></TableCell>
                    <TableCell className="text-xs">{e.enrollDate}</TableCell>
                    <TableCell>{e.fee}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[e.status] || ""}`}>{e.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Coach Tab */}
        <TabsContent value="coach" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search coaches..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Coach</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Sport</TableHead>
                  <TableHead className="font-semibold">Experience</TableHead>
                  <TableHead className="font-semibold">Qualification</TableHead>
                  <TableHead className="font-semibold">Phone</TableHead>
                  <TableHead className="font-semibold">Salary</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coachData.map((c, i) => (
                  <TableRow key={c.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{c.sport}</Badge></TableCell>
                    <TableCell className="text-xs">{c.experience}</TableCell>
                    <TableCell className="text-xs">{c.qualification}</TableCell>
                    <TableCell className="text-xs">{c.phone}</TableCell>
                    <TableCell>{c.salary}</TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[c.status] || ""}`}>{c.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search schedule..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Schedule</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Sport</TableHead>
                  <TableHead className="font-semibold">Days</TableHead>
                  <TableHead className="font-semibold">Time</TableHead>
                  <TableHead className="font-semibold">Venue</TableHead>
                  <TableHead className="font-semibold">Coach</TableHead>
                  <TableHead className="font-semibold">Students</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduleData.map((s, i) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{s.sport}</TableCell>
                    <TableCell className="text-xs">{s.day}</TableCell>
                    <TableCell className="text-xs"><Badge variant="secondary" className="text-xs"><Clock size={10} className="mr-1" />{s.time}</Badge></TableCell>
                    <TableCell className="text-xs">{s.venue}</TableCell>
                    <TableCell className="text-xs">{s.coach}</TableCell>
                    <TableCell>{s.students}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Tournaments Tab */}
        <TabsContent value="tournaments" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tournaments..." className="pl-9 w-64 bg-card" />
            </div>
            <Button className="gap-2"><Plus size={16} /> Add Tournament</Button>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Tournament</TableHead>
                  <TableHead className="font-semibold">Sport</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Venue</TableHead>
                  <TableHead className="font-semibold">Teams</TableHead>
                  <TableHead className="font-semibold">Result</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tournamentData.map((t, i) => (
                  <TableRow key={t.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">{t.name}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{t.sport}</Badge></TableCell>
                    <TableCell className="text-xs">{t.date}</TableCell>
                    <TableCell className="text-xs">{t.venue}</TableCell>
                    <TableCell>{t.teams}</TableCell>
                    <TableCell>
                      {t.result !== "-" ? (
                        <Badge className="text-xs bg-amber-100 text-amber-700 border border-amber-200">{t.result}</Badge>
                      ) : "-"}
                    </TableCell>
                    <TableCell><Badge className={`text-xs border ${statusConfig[t.status] || ""}`}>{t.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Achievements Tab */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search achievements..." className="pl-9 w-64 bg-card" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2"><Download size={14} /> Export</Button>
              <Button className="gap-2"><Plus size={16} /> Add Achievement</Button>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Student</TableHead>
                  <TableHead className="font-semibold">Class</TableHead>
                  <TableHead className="font-semibold">Sport</TableHead>
                  <TableHead className="font-semibold">Event</TableHead>
                  <TableHead className="font-semibold">Achievement</TableHead>
                  <TableHead className="font-semibold">Level</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievementData.map((a, i) => (
                  <TableRow key={a.id} className="hover:bg-muted/30">
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium">{a.student}</TableCell>
                    <TableCell>{a.class}</TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{a.sport}</Badge></TableCell>
                    <TableCell className="text-xs">{a.event}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1"><Medal size={14} className="text-amber-500" /><span className="text-xs font-medium">{a.achievement}</span></div>
                    </TableCell>
                    <TableCell><Badge className={`text-xs border ${levelConfig[a.level] || ""}`}>{a.level}</Badge></TableCell>
                    <TableCell className="text-xs">{a.date}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Pencil size={14} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
