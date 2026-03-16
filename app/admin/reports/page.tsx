"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, GraduationCap, CreditCard, ClipboardList, Download, Printer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { AdminLayout } from "@/components/layout/AdminLayout";

const attendanceData = [
  { month: "Aug", present: 92, absent: 8 },
  { month: "Sep", present: 89, absent: 11 },
  { month: "Oct", present: 94, absent: 6 },
  { month: "Nov", present: 88, absent: 12 },
  { month: "Dec", present: 91, absent: 9 },
  { month: "Jan", present: 93, absent: 7 },
  { month: "Feb", present: 90, absent: 10 },
];

const feeData = [
  { month: "Aug", collected: 450000, pending: 50000 },
  { month: "Sep", collected: 420000, pending: 80000 },
  { month: "Oct", collected: 480000, pending: 20000 },
  { month: "Nov", collected: 460000, pending: 40000 },
  { month: "Dec", collected: 430000, pending: 70000 },
  { month: "Jan", collected: 470000, pending: 30000 },
  { month: "Feb", collected: 440000, pending: 60000 },
];

const examPerformance = [
  { subject: "Mathematics", classAvg: 72, highest: 98, lowest: 35, passRate: 88 },
  { subject: "Science", classAvg: 78, highest: 96, lowest: 42, passRate: 92 },
  { subject: "English", classAvg: 81, highest: 95, lowest: 48, passRate: 95 },
  { subject: "Hindi", classAvg: 75, highest: 92, lowest: 38, passRate: 90 },
  { subject: "Social Science", classAvg: 70, highest: 94, lowest: 30, passRate: 85 },
];

const genderDistribution = [
  { name: "Boys", value: 580, color: "hsl(var(--primary))" },
  { name: "Girls", value: 520, color: "hsl(var(--accent))" },
];

const classStrength = [
  { class: "Class 6", students: 180 },
  { class: "Class 7", students: 175 },
  { class: "Class 8", students: 190 },
  { class: "Class 9", students: 185 },
  { class: "Class 10", students: 170 },
  { class: "Class 11", students: 160 },
  { class: "Class 12", students: 140 },
];

const topStudents = [
  { rank: 1, name: "Aarav Patel", class: "Class 10-A", percentage: 97.8, grade: "A+" },
  { rank: 2, name: "Diya Sharma", class: "Class 10-B", percentage: 96.5, grade: "A+" },
  { rank: 3, name: "Vivaan Gupta", class: "Class 10-A", percentage: 95.2, grade: "A+" },
  { rank: 4, name: "Ishita Reddy", class: "Class 10-C", percentage: 94.8, grade: "A+" },
  { rank: 5, name: "Arjun Singh", class: "Class 10-A", percentage: 93.4, grade: "A" },
];

const Page = () => {
  const [selectedYear, setSelectedYear] = useState("2025-26");

  const stats = [
    { label: "Total Students", value: "1,100", icon: Users, change: "+5.2%" },
    { label: "Avg Attendance", value: "91%", icon: ClipboardList, change: "+2.1%" },
    { label: "Fee Collection", value: "₹32.5L", icon: CreditCard, change: "+8.4%" },
    { label: "Pass Rate", value: "90%", icon: GraduationCap, change: "+3.6%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Comprehensive analytics and insights</p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-26">2025-26</SelectItem>
                <SelectItem value="2024-25">2024-25</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> Print</Button>
            <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map(stat => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-secondary"><stat.icon className="h-5 w-5 text-primary" /></div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <span className="text-xs text-emerald-500 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" />{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="attendance">
          <TabsList>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="exam">Exam Performance</TabsTrigger>
            <TabsTrigger value="fees">Fee Collection</TabsTrigger>
            <TabsTrigger value="students">Student Stats</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Monthly Attendance Rate (%)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Bar dataKey="present" fill="hsl(var(--primary))" radius={[4,4,0,0]} name="Present %" />
                      <Bar dataKey="absent" fill="hsl(var(--destructive))" radius={[4,4,0,0]} name="Absent %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exam" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Subject-wise Performance — Mid-Term</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Subject</TableHead><TableHead>Class Avg</TableHead><TableHead>Highest</TableHead><TableHead>Lowest</TableHead><TableHead>Pass Rate</TableHead><TableHead>Status</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {examPerformance.map(item => (
                      <TableRow key={item.subject}>
                        <TableCell className="font-medium">{item.subject}</TableCell>
                        <TableCell>{item.classAvg}%</TableCell>
                        <TableCell className="text-emerald-500 font-medium">{item.highest}%</TableCell>
                        <TableCell className="text-destructive font-medium">{item.lowest}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${item.passRate}%` }} /></div>
                            <span className="text-xs">{item.passRate}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={item.passRate >= 90 ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                            {item.passRate >= 90 ? "Good" : "Average"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Top 5 Students</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Name</TableHead><TableHead>Class</TableHead><TableHead>Percentage</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {topStudents.map(s => (
                      <TableRow key={s.rank}>
                        <TableCell><Badge variant="outline" className="font-bold">#{s.rank}</Badge></TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.class}</TableCell>
                        <TableCell className="font-semibold text-primary">{s.percentage}%</TableCell>
                        <TableCell><Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{s.grade}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">Monthly Fee Collection (₹)</CardTitle></CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={feeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Legend />
                      <Line type="monotone" dataKey="collected" stroke="hsl(var(--primary))" strokeWidth={2} name="Collected" />
                      <Line type="monotone" dataKey="pending" stroke="hsl(var(--destructive))" strokeWidth={2} name="Pending" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader><CardTitle className="text-lg">Gender Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={genderDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                          {genderDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-lg">Class-wise Strength</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classStrength}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="class" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                        <Bar dataKey="students" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Page;
