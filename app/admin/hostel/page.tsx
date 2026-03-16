
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  BedDouble, Users, Plus, AlertTriangle, DoorOpen } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const rooms = [
  { id: "R101", block: "A", floor: 1, type: "Double", capacity: 2, occupied: 2, status: "Full" },
  { id: "R102", block: "A", floor: 1, type: "Triple", capacity: 3, occupied: 1, status: "Available" },
  { id: "R201", block: "B", floor: 2, type: "Single", capacity: 1, occupied: 0, status: "Available" },
  { id: "R202", block: "B", floor: 2, type: "Double", capacity: 2, occupied: 2, status: "Full" },
  { id: "R301", block: "C", floor: 3, type: "Dormitory", capacity: 6, occupied: 4, status: "Available" },
];

const residents = [
  { id: 1, name: "Arjun Mehta", class: "11-A", room: "R101", block: "A", checkIn: "2025-07-01", due: 0 },
  { id: 2, name: "Vikram Singh", class: "12-B", room: "R101", block: "A", checkIn: "2025-07-01", due: 2500 },
  { id: 3, name: "Rohan Das", class: "10-C", room: "R301", block: "C", checkIn: "2025-08-15", due: 0 },
  { id: 4, name: "Karan Joshi", class: "9-A", room: "R301", block: "C", checkIn: "2025-07-01", due: 1000 },
];

const complaints = [
  { id: 1, student: "Arjun Mehta", room: "R101", issue: "AC not working", date: "2026-02-12", status: "Pending" },
  { id: 2, student: "Rohan Das", room: "R301", issue: "Water leakage", date: "2026-02-10", status: "Resolved" },
  { id: 3, student: "Karan Joshi", room: "R301", issue: "Broken window", date: "2026-02-13", status: "In Progress" },
];

const Page = () => {
  const stats = [
    { label: "Total Rooms", value: "120", icon: DoorOpen, gradient: "from-indigo-500 to-blue-500" },
    { label: "Total Residents", value: "285", icon: Users, gradient: "from-emerald-500 to-teal-500" },
    { label: "Available Beds", value: "45", icon: BedDouble, gradient: "from-amber-500 to-orange-500" },
    { label: "Pending Complaints", value: "8", icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            Hostel Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage rooms, residents, fees & complaints</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
            <Card key={stat.label} className="relative overflow-hidden border-0 shadow-lg">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
                <CardContent className="p-4 relative">
                <div className="flex items-center justify-between">
                    <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}>
                    <stat.icon className="h-5 w-5" />
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>

        <Tabs defaultValue="rooms" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="residents">Residents</TabsTrigger>
            <TabsTrigger value="fees">Hostel Fees</TabsTrigger>
            <TabsTrigger value="complaints">Complaints</TabsTrigger>
            </TabsList>

            <TabsContent value="rooms" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2">
                <Select><SelectTrigger className="w-32"><SelectValue placeholder="Block" /></SelectTrigger>
                    <SelectContent><SelectItem value="A">Block A</SelectItem><SelectItem value="B">Block B</SelectItem><SelectItem value="C">Block C</SelectItem></SelectContent>
                </Select>
                <Select><SelectTrigger className="w-32"><SelectValue placeholder="Floor" /></SelectTrigger>
                    <SelectContent><SelectItem value="1">Floor 1</SelectItem><SelectItem value="2">Floor 2</SelectItem><SelectItem value="3">Floor 3</SelectItem></SelectContent>
                </Select>
                </div>
                <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white"><Plus className="h-4 w-4 mr-2" /> Add Room</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Room No</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Floor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Occupied</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rooms.map((room) => (
                    <TableRow key={room.id}>
                        <TableCell className="font-mono font-medium">{room.id}</TableCell>
                        <TableCell>Block {room.block}</TableCell>
                        <TableCell>{room.floor}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>{room.occupied}/{room.capacity}</TableCell>
                        <TableCell>
                        <Badge className={room.status === "Full" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}>{room.status}</Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="residents" className="space-y-4">
            <div className="flex justify-between">
                <Input placeholder="Search residents..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"><Plus className="h-4 w-4 mr-2" /> Assign Room</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Check-In</TableHead>
                    <TableHead>Dues</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {residents.map((r) => (
                    <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.class}</TableCell>
                        <TableCell className="font-mono">{r.room}</TableCell>
                        <TableCell>Block {r.block}</TableCell>
                        <TableCell>{r.checkIn}</TableCell>
                        <TableCell className={r.due > 0 ? "text-rose-600 font-semibold" : "text-emerald-600"}>
                        {r.due > 0 ? `₹${r.due}` : "Paid"}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-4">
            <Card>
                <CardHeader><CardTitle>Hostel Fee Structure</CardTitle></CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                    { type: "Single Room", monthly: 5000, annual: 55000, color: "from-indigo-500 to-blue-500" },
                    { type: "Double Room", monthly: 3500, annual: 38000, color: "from-emerald-500 to-teal-500" },
                    { type: "Dormitory", monthly: 2000, annual: 22000, color: "from-amber-500 to-orange-500" },
                    ].map((fee) => (
                    <div key={fee.type} className={`p-5 rounded-xl bg-gradient-to-br ${fee.color} text-white`}>
                        <h3 className="font-semibold text-lg">{fee.type}</h3>
                        <p className="text-3xl font-bold mt-2">₹{fee.monthly.toLocaleString()}<span className="text-sm font-normal opacity-80">/month</span></p>
                        <p className="text-sm opacity-80 mt-1">Annual: ₹{fee.annual.toLocaleString()}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="complaints" className="space-y-4">
            <div className="flex justify-between">
                <Input placeholder="Search complaints..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white"><Plus className="h-4 w-4 mr-2" /> New Complaint</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {complaints.map((c) => (
                    <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.student}</TableCell>
                        <TableCell className="font-mono">{c.room}</TableCell>
                        <TableCell>{c.issue}</TableCell>
                        <TableCell>{c.date}</TableCell>
                        <TableCell>
                        <Badge className={
                            c.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
                            c.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                        }>{c.status}</Badge>
                        </TableCell>
                        <TableCell><Button variant="ghost" size="sm">Update</Button></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;