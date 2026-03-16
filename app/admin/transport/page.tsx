// import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bus, MapPin, Users, Plus, Route, Clock, Navigation } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const routes = [
  { id: 1, name: "Route A - North City", stops: 12, students: 45, driver: "Ramesh Kumar", bus: "KA-01-1234", distance: "18 km", time: "45 min" },
  { id: 2, name: "Route B - South City", stops: 8, students: 38, driver: "Suresh Yadav", bus: "KA-01-5678", distance: "15 km", time: "35 min" },
  { id: 3, name: "Route C - East Zone", stops: 10, students: 42, driver: "Mahesh Singh", bus: "KA-01-9012", distance: "22 km", time: "50 min" },
  { id: 4, name: "Route D - West Zone", stops: 6, students: 30, driver: "Dinesh Rao", bus: "KA-01-3456", distance: "12 km", time: "25 min" },
];

const vehicles = [
  { id: "KA-01-1234", type: "Bus", capacity: 50, year: 2022, insurance: "2026-08-15", fitness: "2026-12-31", status: "Active" },
  { id: "KA-01-5678", type: "Bus", capacity: 45, year: 2021, insurance: "2026-05-20", fitness: "2026-11-30", status: "Active" },
  { id: "KA-01-9012", type: "Mini Bus", capacity: 30, year: 2023, insurance: "2027-01-10", fitness: "2027-06-30", status: "Active" },
  { id: "KA-01-3456", type: "Van", capacity: 15, year: 2020, insurance: "2026-03-01", fitness: "2026-09-30", status: "Maintenance" },
];

const pickupPoints = [
  { id: 1, name: "Central Park Gate", route: "Route A", time: "7:15 AM", students: 8 },
  { id: 2, name: "Mall Road Junction", route: "Route A", time: "7:25 AM", students: 6 },
  { id: 3, name: "Railway Station", route: "Route B", time: "7:10 AM", students: 12 },
  { id: 4, name: "City Hospital", route: "Route B", time: "7:20 AM", students: 5 },
  { id: 5, name: "MG Road", route: "Route C", time: "7:00 AM", students: 10 },
  { id: 6, name: "Tech Park", route: "Route D", time: "7:30 AM", students: 7 },
];

const Page = () => {
  const stats = [
    { label: "Total Routes", value: "12", icon: Route, gradient: "from-blue-500 to-indigo-500" },
    { label: "Total Vehicles", value: "18", icon: Bus, gradient: "from-emerald-500 to-teal-500" },
    { label: "Students Using", value: "856", icon: Users, gradient: "from-amber-500 to-orange-500" },
    { label: "Pickup Points", value: "96", icon: MapPin, gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Transport Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage routes, vehicles, pickup points & tracking</p>
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

        <Tabs defaultValue="routes" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
            <TabsTrigger value="pickup">Pickup Points</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="fees">Transport Fees</TabsTrigger>
            </TabsList>

            <TabsContent value="routes" className="space-y-4">
            <div className="flex justify-between">
                <Input placeholder="Search routes..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white"><Plus className="h-4 w-4 mr-2" /> Add Route</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Route Name</TableHead>
                    <TableHead>Stops</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Duration</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {routes.map((route) => (
                    <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.name}</TableCell>
                        <TableCell>{route.stops}</TableCell>
                        <TableCell>{route.students}</TableCell>
                        <TableCell>{route.driver}</TableCell>
                        <TableCell className="font-mono text-sm">{route.bus}</TableCell>
                        <TableCell>{route.distance}</TableCell>
                        <TableCell><Badge variant="outline">{route.time}</Badge></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-4">
            <div className="flex justify-between">
                <Input placeholder="Search vehicles..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Vehicle No</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Fitness</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {vehicles.map((v) => (
                    <TableRow key={v.id}>
                        <TableCell className="font-mono font-medium">{v.id}</TableCell>
                        <TableCell>{v.type}</TableCell>
                        <TableCell>{v.capacity}</TableCell>
                        <TableCell>{v.year}</TableCell>
                        <TableCell>{v.insurance}</TableCell>
                        <TableCell>{v.fitness}</TableCell>
                        <TableCell>
                        <Badge className={v.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{v.status}</Badge>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="pickup" className="space-y-4">
            <div className="flex justify-between">
                <Input placeholder="Search pickup points..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white"><Plus className="h-4 w-4 mr-2" /> Add Point</Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Pickup Point</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Pickup Time</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {pickupPoints.map((p) => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-rose-500" />{p.name}</TableCell>
                        <TableCell><Badge variant="outline">{p.route}</Badge></TableCell>
                        <TableCell className="flex items-center gap-1"><Clock className="h-3 w-3 text-muted-foreground" />{p.time}</TableCell>
                        <TableCell>{p.students}</TableCell>
                        <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="tracking" className="space-y-4">
            <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Navigation className="h-5 w-5 text-blue-500" /> Live Vehicle Tracking</CardTitle></CardHeader>
                <CardContent>
                <div className="h-80 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
                    <div className="text-center space-y-3">
                    <Navigation className="h-12 w-12 text-blue-400 mx-auto animate-pulse" />
                    <p className="text-muted-foreground">Map integration will be displayed here</p>
                    <p className="text-sm text-muted-foreground">Real-time GPS tracking for all school vehicles</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
                    {routes.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium">{r.bus}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.driver}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="fees" className="space-y-4">
            <Card>
                <CardHeader><CardTitle>Transport Fee Structure</CardTitle></CardHeader>
                <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                    { zone: "Zone A (0-5 km)", monthly: 800, annual: 8500, color: "from-blue-500 to-indigo-500" },
                    { zone: "Zone B (5-15 km)", monthly: 1200, annual: 13000, color: "from-emerald-500 to-teal-500" },
                    { zone: "Zone C (15+ km)", monthly: 1800, annual: 19500, color: "from-amber-500 to-orange-500" },
                    ].map((fee) => (
                    <div key={fee.zone} className={`p-5 rounded-xl bg-gradient-to-br ${fee.color} text-white`}>
                        <h3 className="font-semibold">{fee.zone}</h3>
                        <p className="text-3xl font-bold mt-2">₹{fee.monthly.toLocaleString()}<span className="text-sm font-normal opacity-80">/month</span></p>
                        <p className="text-sm opacity-80 mt-1">Annual: ₹{fee.annual.toLocaleString()}</p>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;