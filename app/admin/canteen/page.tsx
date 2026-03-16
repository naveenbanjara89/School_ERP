"use client"


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Wallet, ShoppingCart, Clock, Plus, Search, IndianRupee, AlertTriangle, Users } from "lucide-react";
import { AdminLayout } from "@/components/layout/AdminLayout";

const menuItems = [
  { id: 1, name: "Veg Thali", category: "Lunch", price: 60, available: true, popular: true },
  { id: 2, name: "Sandwich", category: "Snacks", price: 30, available: true, popular: false },
  { id: 3, name: "Masala Dosa", category: "Breakfast", price: 40, available: true, popular: true },
  { id: 4, name: "Cold Coffee", category: "Beverages", price: 25, available: false, popular: false },
  { id: 5, name: "Paneer Butter Masala", category: "Lunch", price: 80, available: true, popular: true },
  { id: 6, name: "Samosa", category: "Snacks", price: 15, available: true, popular: false },
];

const walletTransactions = [
  { id: 1, student: "Rahul Sharma", class: "10-A", type: "Credit", amount: 500, date: "2026-02-10", balance: 850 },
  { id: 2, student: "Priya Patel", class: "8-B", type: "Debit", amount: 60, date: "2026-02-13", balance: 340 },
  { id: 3, student: "Amit Kumar", class: "12-A", type: "Credit", amount: 1000, date: "2026-02-12", balance: 1200 },
  { id: 4, student: "Sneha Gupta", class: "9-C", type: "Debit", amount: 40, date: "2026-02-14", balance: 160 },
];

const orders = [
  { id: "ORD001", student: "Rahul Sharma", items: "Veg Thali, Cold Coffee", total: 85, status: "Delivered", time: "12:30 PM" },
  { id: "ORD002", student: "Priya Patel", items: "Masala Dosa", total: 40, status: "Preparing", time: "12:45 PM" },
  { id: "ORD003", student: "Amit Kumar", items: "Sandwich, Samosa", total: 45, status: "Ready", time: "12:50 PM" },
];

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Today's Orders", value: "156", icon: ShoppingCart, gradient: "from-amber-500 to-orange-500" },
    { label: "Revenue Today", value: "₹8,450", icon: IndianRupee, gradient: "from-emerald-500 to-teal-500" },
    { label: "Active Wallets", value: "1,234", icon: Wallet, gradient: "from-indigo-500 to-purple-500" },
    { label: "Low Balance Alerts", value: "23", icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
  ];

  return (
    <AdminLayout>
        <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Canteen Management
            </h1>
            <p className="text-muted-foreground mt-1">Manage menu, wallets, orders & parental controls</p>
            </div>
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

        <Tabs defaultValue="menu" className="space-y-4">
            <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="menu">Menu Items</TabsTrigger>
            <TabsTrigger value="wallets">Student Wallets</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="parental">Parental Controls</TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search menu..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {menuItems.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                    <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">{item.category}</Badge>
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell><Switch checked={item.available} /></TableCell>
                        <TableCell>{item.popular && <Badge className="bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0">Popular</Badge>}</TableCell>
                        <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="wallets" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <Input placeholder="Search student wallet..." className="max-w-sm" />
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                <Wallet className="h-4 w-4 mr-2" /> Add Funds
                </Button>
            </div>
            <Card>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Balance</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {walletTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.student}</TableCell>
                        <TableCell>{tx.class}</TableCell>
                        <TableCell>
                        <Badge className={tx.type === "Credit" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-rose-100 text-rose-700 border-rose-200"}>
                            {tx.type}
                        </Badge>
                        </TableCell>
                        <TableCell>₹{tx.amount}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell className="font-semibold">₹{tx.balance}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-amber-500" /> Today`s Orders</CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id}</TableCell>
                        <TableCell className="font-medium">{order.student}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>₹{order.total}</TableCell>
                        <TableCell>
                            <Badge className={
                            order.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                            order.status === "Ready" ? "bg-blue-100 text-blue-700" :
                            "bg-amber-100 text-amber-700"
                            }>{order.status}</Badge>
                        </TableCell>
                        <TableCell>{order.time}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="parental" className="space-y-4">
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-indigo-500" /> Parental Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 rounded-xl border bg-gradient-to-br from-indigo-50 to-purple-50">
                    <h3 className="font-semibold text-lg">Spending Limits</h3>
                    <div className="space-y-3">
                        <div className="space-y-1">
                        <Label>Daily Limit (₹)</Label>
                        <Input type="number" placeholder="100" />
                        </div>
                        <div className="space-y-1">
                        <Label>Weekly Limit (₹)</Label>
                        <Input type="number" placeholder="500" />
                        </div>
                        <div className="space-y-1">
                        <Label>Monthly Limit (₹)</Label>
                        <Input type="number" placeholder="2000" />
                        </div>
                    </div>
                    </div>
                    <div className="space-y-4 p-4 rounded-xl border bg-gradient-to-br from-amber-50 to-orange-50">
                    <h3 className="font-semibold text-lg">Item Restrictions</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                        <Label>Block Beverages</Label>
                        <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                        <Label>Block Snacks</Label>
                        <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                        <Label>Only Meals Allowed</Label>
                        <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                        <Label>Send Purchase Alerts</Label>
                        <Switch defaultChecked />
                        </div>
                    </div>
                    </div>
                </div>
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">Save Parental Settings</Button>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    </AdminLayout>
  );
};

export default Page;