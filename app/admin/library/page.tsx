/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"


import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Plus, Search, ArrowRightLeft, AlertTriangle, BookMarked, Trash2, Edit, BookIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { AdminLayout } from "@/components/layout/AdminLayout";
import { axiosInstance } from "@/apiHome/axiosInstanc";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface Book {
  id: number;
  title: string;
  author: string;
  code: string;
  publisher: string;
  quantity: number;
  price: number;
  rack: string;
}

interface BookIssue {
  updatedAt: string | number | Date;
  id: string;
  studentId: string;
  bookId: string;
  dueDate: string;
  returnDate: string;
  fine: number;
  status: string;
  Book: {
    title: string;
    code: string;
  };
  Student: {
    name: string;
    email: string;
  };
}

const Page = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [booksData, setBooksData] = useState<Book[]>([]);
    const [students, setStudents] = useState<{ id: number; name: string; email: string }[]>([]);
    const [studentSearchTerm, setStudentSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingBook, setEditingBook] = useState({
        id: 0,
        title: "",
        author: "",
        code: "",
        publisher: "",
        quantity: 0,
        price: 0,
        rack: "",
    }); 
    const [newBook, setNewBook] = useState({
        title: "",
        author: "",
        code: "",
        publisher: "",
        quantity: 0,
        price: 0,
        rack: "",
    });

    const [issueOpen, setIssueOpen] = useState(false);
    const [returnOpen, setReturnOpen] = useState(false);

    const [issues, setIssues] = useState<BookIssue[]>([]);
    const [issuePage, setIssuePage] = useState(1);
    const [issuePerPage] = useState(10);
    const [issuePagination, setIssuePagination] = useState<any>(null);
    const [issueLoading, setIssueLoading] = useState(false);
    const [books, setBooks] = useState<any[]>([]);
    const [bookSearchTerm, setBookSearchTerm] = useState("");



    const [issueForm, setIssueForm] = useState({
    studentId: "",
    bookId: "",
    issueDate:"",
    dueDate: "",
    });

    useEffect(() => {
        const fetchBooks = async () => {
            try {
            const res = await axiosInstance.get("/api/v1/books");
            setBooks(res.data.data); // adjust if API response is different
            } catch (err) {
            console.error("Failed to fetch books", err);
            }
        };
        fetchBooks();
    }, []);

useEffect(() => {
  const fetchStudents = async () => {
    try {
      const res = await axiosInstance.get("/api/v1/students"); // adjust endpoint
      // Ensure it's an array:
        setStudents(res.data.data.students);

    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    }
  };

  fetchStudents();
}, []);


    useEffect(() => {
        fetchIssues();
    }, [issuePage]);

    const fetchIssues = async () => {
        try {
            setIssueLoading(true);

            const res = await axiosInstance.get(
            `/api/v1/books/issue?page=${issuePage}&perPage=${issuePerPage}`
            );

            setIssues(res.data.data);
            console.log(res.data)
            setIssuePagination(res.data.pagination);
        } catch (err) {
            console.error("Failed to fetch issues", err);
        } finally {
            setIssueLoading(false);
        }
    };

    const [returnForm, setReturnForm] = useState({
        bookId: "",
        issueId: "",
        status: "",
        fine: 0,
        studentName: "",
        dueDate: "",
        returnDate: "",
    });

    useEffect(() => {
        setLoading(true);
        axiosInstance.get(`/api/v1/books?page=${page}&perPage=${perPage}&name=${searchTerm}&code=${searchTerm}`)
            .then(res => {
            setBooksData(res.data.data); // the array of books
            })
            .catch(err => console.error("Failed to fetch books", err))
            .finally(() => setLoading(false));
    }, [page, perPage,searchTerm]);

//   const [open, setOpen] = useState(false);

  const [stats, setStats] = useState([
    { label: "Total Books", value: "-", icon: BookOpen, gradient: "from-teal-500 to-emerald-500" },
    { label: "Books Issued", value: "-", icon: ArrowRightLeft, gradient: "from-indigo-500 to-blue-500" },
    { label: "Available Books", value: "-", icon: BookIcon, gradient: "from-amber-500 to-orange-500" },
    { label: "Overdue Books", value: "-", icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
  ]);

  const handleUpdateBook = async (bookId, updatedBook) => {
  try {
    const res = await axiosInstance.put(`/api/v1/books/${bookId}`, updatedBook);
    setBooksData(booksData.map(b => b.id === bookId ? res.data.data : b));
  } catch (err) {
    console.error("Failed to update book", err);
  }
}

    useEffect(() => {
    axiosInstance.get("/api/v1/books/stats")
      .then(res => {
        const data = res.data.data;
        setStats([
          { label: "Total Books", value: data.totalBooks, icon: BookOpen, gradient: "from-teal-500 to-emerald-500" },
          { label: "Books Issued", value: data.totalIssuedBooks, icon: ArrowRightLeft, gradient: "from-indigo-500 to-blue-500" },
          { label: "Available Books", value:  data.totalAvailableBooks, icon: BookIcon, gradient: "from-amber-500 to-orange-500" }, // still static for now
          { label: "Overdue Books", value: data.overdueBooks, icon: AlertTriangle, gradient: "from-rose-500 to-pink-500" },
        ]);
      })
      .catch(err => console.error("Failed to fetch book stats", err));
  }, []);

  return (
    <AdminLayout>
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Library Management
                </h1>
                <p className="text-muted-foreground mt-1">Manage books, issue/return, members & fines</p>
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

            <Tabs defaultValue="books" className="space-y-4">
                <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="books">Book List</TabsTrigger>
                <TabsTrigger value="issue">Issue / Return</TabsTrigger>
                </TabsList>

                <TabsContent value="books" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by title, author, ISBN..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                        <Plus className="h-4 w-4 mr-2" /> Add Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Add New Book</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 gap-4">
                        <Input placeholder="Enter book title" value={newBook.title} onChange={(e) => setNewBook({...newBook,title:e.target.value})} />
                        <Input placeholder="Author name" value={newBook.author} onChange={(e) => setNewBook({...newBook,author:e.target.value})} />
                        <Input placeholder="978-XX-XXXX-XXX" value={newBook.code} onChange={(e) => setNewBook({...newBook,code:e.target.value})} />
                        <Input placeholder="Publisher name" value={newBook.publisher} onChange={(e) => setNewBook({...newBook,publisher:e.target.value})} />
                        <Input type="number" placeholder="0" value={newBook.quantity} onChange={(e) => setNewBook({...newBook,quantity:Number(e.target.value)})} />
                        <Input type="number" placeholder="Price per Copy (₹) " value={newBook.price} onChange={(e) => setNewBook({...newBook,price:Number(e.target.value)})} />
                        <Input placeholder="Rack" value={newBook.rack} onChange={(e) => setNewBook({...newBook,rack:e.target.value})} />
                        </div>
                        <DialogFooter>
                        <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                        <Button  onClick={async () => {
                            try {
                                const res = await axiosInstance.post("/api/v1/books", {
                                title: newBook.title,
                                author: newBook.author,
                                code: newBook.code,
                                publisher: newBook.publisher,
                                quantity: Number(newBook.quantity),
                                price: Number(newBook.price),
                                rack: newBook.rack
                                });
                                setBooksData([...booksData, res.data.data]); // append the new book from API
                                setNewBook({ title: "", author: "", code: "", publisher: "", quantity: 0, price: 0, rack: "" });
                                setAddOpen(false);
                            } catch (err) {
                                console.error("Failed to add book", err);
                            }
                            }}>Save</Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                </div>            
                <Card>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>ISBN</TableHead>
                        <TableHead>Publisher</TableHead>
                        <TableHead>Copies</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Rack</TableHead>
                        <TableHead className="flex items-center justify-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {booksData
                            .map((book) => (
                        <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.title}</TableCell>
                            <TableCell>{book.author}</TableCell>
                            <TableCell className="font-mono text-xs">{book.code}</TableCell>
                            <TableCell><Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200">{book.publisher}</Badge></TableCell>
                            <TableCell>{book.quantity}</TableCell>
                            <TableCell>
                            <Badge className={book.price <= 3 ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}>
                                {book.price}
                            </Badge>
                            </TableCell>
                            <TableCell className="font-mono">{book.rack}</TableCell>
                            <TableCell>
                                <div className="gap-2 flex justify-center">

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                    >
                                    
                                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                        <DialogTrigger asChild>
                                            <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                            onClick={() => setEditingBook({
                                                id: book.id,
                                                title: book.title,
                                                author: book.author,
                                                code: book.code,
                                                publisher: book.publisher,
                                                quantity: book.quantity,
                                                price: book.price,
                                                rack: book.rack
                                            })} // set the book to edit
                                            >
                                            <Edit className="w-4 h-4 text-emerald-600" />
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                            <DialogHeader>
                                            <DialogTitle>Edit Book</DialogTitle>
                                            </DialogHeader>
                                            {editingBook && (
                                            <div className="grid grid-cols-1 gap-4">
                                                <Input
                                                placeholder="Enter book title"
                                                value={editingBook.title}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, title: e.target.value })
                                                }
                                                />
                                                <Input
                                                placeholder="Author name"
                                                value={editingBook.author}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, author: e.target.value })
                                                }
                                                />
                                                <Input
                                                placeholder="ISBN / Code"
                                                value={editingBook.code}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, code: e.target.value })
                                                }
                                                />
                                                <Input
                                                placeholder="Publisher"
                                                value={editingBook.publisher}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, publisher: e.target.value })
                                                }
                                                />
                                                <Input
                                                type="number"
                                                placeholder="Quantity"
                                                value={editingBook.quantity}
                                                onChange={(e) =>
                                                    setEditingBook({
                                                    ...editingBook,
                                                    quantity: Number(e.target.value,
                                                    )})
                                                }
                                                />
                                                <Input
                                                type="number"
                                                placeholder="Price"
                                                value={editingBook.price}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, price: Number(e.target.value) })
                                                }
                                                />
                                                <Input
                                                placeholder="Rack"
                                                value={editingBook.rack}
                                                onChange={(e) =>
                                                    setEditingBook({ ...editingBook, rack: e.target.value })
                                                }
                                                />
                                            </div>
                                            )}
                                            <DialogFooter>
                                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={async () => {
                                                    await handleUpdateBook(editingBook.id, editingBook);
                                                    setEditOpen(false);
                                                }}
                                            >
                                                Save
                                            </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    </Button>

                                    <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                    onClick={async () => {
                                        try {
                                        await axiosInstance.delete(`/api/v1/books/${book.id}`);
                                        setBooksData(booksData.filter(b => b.id !== book.id));
                                        } catch (err) {
                                        console.error("Failed to delete book", err);
                                        }
                                    }}
                                    >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>

                                </div>

                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </Card>
                </TabsContent>

                <TabsContent value="issue" className="space-y-4">
                    <div className="flex justify-between">
                        {/* <Input placeholder="Search student Name..." className="max-w-sm" /> */}
                        <div className="flex gap-2">
                            <Dialog open={issueOpen} onOpenChange={setIssueOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                                    <BookMarked className="h-4 w-4 mr-2" />
                                    Issue Book
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Issue Book</DialogTitle>
                                    </DialogHeader>

                                    <div className="grid gap-4">
                                    <label>Student Id</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            className="justify-between"
                                            >
                                                {issueForm.studentId
                                                ? students.find((s) => String(s.id) === issueForm.studentId)?.name
                                                : "Select Student"}

                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0">
                                            <Command>
                                            <CommandInput placeholder="Search student..." 
                                            value={studentSearchTerm}
                                            onValueChange={(value) => setStudentSearchTerm(value)}
                                            />
                                            <CommandEmpty>No student found.</CommandEmpty>
                                            <CommandGroup>
                                                {students.length>0 &&
                                                students
                                                .filter((student) =>
                                                    student.name.toLowerCase().includes(studentSearchTerm.toLowerCase())
                                                )
                                                .map((student) => (
                                                <CommandItem
                                                    key={student.id}
                                                    value={student.name}
                                                    onSelect={() => {
                                                    setIssueForm({ ...issueForm, studentId: String(student.id) })
                                                    }}
                                                >
                                                    <Check
                                                    className={`mr-2 h-4 w-4 ${
                                                    issueForm.studentId  === String(student.id)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    }`}
                                                    />
                                                    {student.name} ({student.email})
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <label>Book Id</label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            role="combobox"
                                            className="justify-between"
                                            >
                                            {issueForm.bookId
                                                ? books.find((book) => String(book.id) === issueForm.bookId)?.title
                                                : "Select Book"}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>

                                        <PopoverContent className="p-0">
                                            <Command>
                                            <CommandInput placeholder="Search book..." 
                                            value={bookSearchTerm}
                                            onValueChange={(value) => setBookSearchTerm(value)}
                                            />
                                            <CommandEmpty>No book found.</CommandEmpty>
                                            <CommandGroup>
                                                {books
                                                .filter((book) =>
                                                    book.title.toLowerCase().includes(bookSearchTerm.toLowerCase())
                                                )
                                                .map((book) => (
                                                <CommandItem
                                                    key={book.id}
                                                    value={book.title}
                                                    onSelect={() => {
                                                    setIssueForm({ ...issueForm, bookId: String(book.id) });
                                                    }}
                                                >
                                                    <Check
                                                    className={`mr-2 h-4 w-4 ${
                                                    issueForm.bookId === String(book.id)
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                    }`}
                                                    />
                                                    {book.title}
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>

                                    <label>Issue Date</label>
                                    <Input
                                        type="date"
                                        value={issueForm.issueDate}
                                        onChange={(e) =>
                                        setIssueForm({ ...issueForm, issueDate: e.target.value })
                                        }
                                    />

                                    <label>Due Date</label>
                                    <Input
                                        type="date"
                                        value={issueForm.dueDate}
                                        onChange={(e) =>
                                        setIssueForm({ ...issueForm, dueDate: e.target.value })
                                        }
                                    />
                                    </div>

                                    <DialogFooter>
                                    <Button variant="outline" onClick={() => setIssueOpen(false)}>
                                        Cancel
                                    </Button>

                                    <Button
                                        onClick={async () => {
                                        try {
                                            await axiosInstance.post("/api/v1/books/issue", {
                                            studentId: issueForm.studentId,
                                            bookId: issueForm.bookId,
                                            issueDate: new Date(issueForm.issueDate).toISOString(),
                                            dueDate: new Date(issueForm.dueDate).toISOString(),
                                            status: "ISSUED",
                                            });

                                            setIssueOpen(false);
                                            setIssueForm({ studentId: "", bookId: "",issueDate:"" ,dueDate: "" });
                                            fetchIssues(); 
                                        } catch (err) {
                                            console.error("Failed to issue book", err);
                                        }
                                        }}
                                    >
                                        Confirm Issue
                                    </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    <Card>
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Book</TableHead>
                            <TableHead>Student Name</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Return Date</TableHead>
                            <TableHead>Fine (₹)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                        {issueLoading ? (
                            <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                                Loading issues...
                            </TableCell>
                            </TableRow>
                        ) : (
                            issues.map((issue) => (
                            <TableRow key={issue.id}>
                                <TableCell className="font-medium">
                                {issue.Book?.title}
                                </TableCell>

                                <TableCell>
                                {issue.Student?.name}
                                </TableCell>

                                <TableCell>
                                {new Date(issue.updatedAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell>
                                {new Date(issue.dueDate).toLocaleDateString()}
                                </TableCell>

                                <TableCell>
                                    {issue.returnDate
                                    ? new Date(issue.returnDate).toLocaleDateString()
                                    : "-"}
                                </TableCell>

                                <TableCell>
                                    {issue.fine || "-"}
                                </TableCell>


                                <TableCell>
                                <Badge
                                    className={
                                    issue.status === "ISSUED"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-emerald-100 text-emerald-700"
                                    }
                                >
                                    {issue.status}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="gap-2">
                                    {/* Edit / Return Book */}
                                    <Dialog open={returnOpen} onOpenChange={setReturnOpen}>
                                        <DialogTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 rounded-lg hover:bg-emerald-100 transition"
                                            onClick={() => {
                                                setReturnForm({
                                                issueId: issue.id,              // ✅ SET ISSUE ID HERE
                                                bookId: issue.bookId,
                                                status: issue.status,
                                                fine: issue.fine,
                                                studentName: issue.Student?.name || "",
                                                dueDate: issue.dueDate,
                                                returnDate: new Date().toISOString().split("T")[0], // default today
                                                });
                                                setReturnOpen(true);
                                            }}
                                        >
                                            <Edit className="w-4 h-4 text-emerald-600" />
                                        </Button>
                                        </DialogTrigger>

                                        <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Return Book</DialogTitle>
                                        </DialogHeader>

                                        <div className="grid gap-4">

                                            <label>Status</label>
                                            <Select
                                            value={returnForm.status}
                                            onValueChange={(value) =>
                                                setReturnForm({ ...returnForm, status: value })
                                            }
                                            >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                
                                                <SelectItem value="RETURNED">RETURNED</SelectItem>
                                                <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                                            </SelectContent>
                                            </Select>

                                            <label>Return Date</label>
                                            <Input
                                            type="date"
                                            value={returnForm.returnDate}
                                            onChange={(e) => setReturnForm({ ...returnForm, returnDate: e.target.value })}
                                            />

                                            <label>Fine (₹)</label>
                                                <Input
                                                type="number"
                                                value={returnForm.fine}
                                                onChange={(e) =>
                                                    setReturnForm({ ...returnForm, fine: Number(e.target.value) })
                                                }
                                                />
                                        </div>

                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setReturnOpen(false)}>
                                            Cancel
                                            </Button>

                                            {/* Update / Confirm Return API */}
                                            <Button
                                            onClick={async () => {
                                                try {
                                                await axiosInstance.put(`/api/v1/books/issue/${returnForm.issueId}`, 
                                                    {
                                                    status: returnForm.status,
                                                    returnDate: returnForm.returnDate
                                                        ? new Date(returnForm.returnDate).toISOString()
                                                        : null,
                                                    fine: Number(returnForm.fine) || 0,
                                                    }
                                                );

                                                setReturnOpen(false);
                                                setReturnForm({ issueId: "", bookId: "", studentName: "",fine: 0,status:"", returnDate: "", dueDate: "" });
                                                fetchIssues(); // refresh the list
                                                } catch (err) {
                                                console.error("Failed to update return", err);
                                                }
                                            }}
                                            >
                                            Confirm Return
                                            </Button>
                                        </DialogFooter>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete Issue Record */}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg hover:bg-red-100 transition"
                                        onClick={async () => {
                                            try {
                                            await axiosInstance.delete(`/api/v1/books/issue/${issue.id}`);
                                            fetchIssues();
                                            } catch (err) {
                                            console.error("Failed to delete issue", err);
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                        </TableBody>
                        </Table>
                    </Card>
                </TabsContent>
        
            </Tabs>
            <div className="flex justify-end gap-2 p-4">
            <Button
                disabled={issuePage === 1}
                onClick={() => setIssuePage((prev) => prev - 1)}
            >
                Previous
            </Button>

            <span className="px-4 flex items-center">
                Page {issuePagination?.currentPage} of {issuePagination?.totalPages}
            </span>

            <Button
                disabled={issuePage === issuePagination?.totalPages}
                onClick={() => setIssuePage((prev) => prev + 1)}
            >
                Next
            </Button>
            </div>
        </div>
    </AdminLayout>
  );
};

export default Page;