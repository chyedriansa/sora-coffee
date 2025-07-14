"use client"

import { useState } from "react"
import {
    TrendingUp,
    TrendingDown,
    Package,
    AlertTriangle,
    Grid3X3,
    DollarSign,
    ShoppingCart,
    Users,
    Boxes,
    Calendar,
    Coffee,
    Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"   // Importing necessary components and icons
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"




interface RecentActivity {
    id: string
    type: "sale" | "restock" | "alert"
    description: string
    time: string
    amount?: string
}

interface TopProduct {
    name: string
    category: string
    sold: number
    revenue: string
    trend: "up" | "down"
    percentage: number
}

const recentActivities: RecentActivity[] = [
    {
        id: "1",
        type: "sale",
        description: "Sold 2x Arabica Coffee to Customer #1234",
        time: "2 minutes ago",
        amount: "IDR 45,000",
    },
    {
        id: "2",
        type: "alert",
        description: "Low stock alert: Cimory Fresh Milk",
        time: "15 minutes ago",
    },
    {
        id: "3",
        type: "restock",
        description: "Restocked Houseblend Beans (+10 kg)",
        time: "1 hour ago",
    },
    {
        id: "4",
        type: "sale",
        description: "Sold 1x Cappuccino to Customer #1235",
        time: "2 hours ago",
        amount: "IDR 25,000",
    },
    {
        id: "5",
        type: "sale",
        description: "Sold 3x Espresso to Customer #1236",
        time: "3 hours ago",
        amount: "IDR 60,000",
    },
]

const topProducts: TopProduct[] = [
    {
        name: "Arabica Beans",
        category: "Coffee Beans",
        sold: 45,
        revenue: "IDR 855,000",
        trend: "up",
        percentage: 12,
    },
    {
        name: "Cappuccino",
        category: "Beverages",
        sold: 32,
        revenue: "IDR 800,000",
        trend: "up",
        percentage: 8,
    },
    {
        name: "Espresso",
        category: "Beverages",
        sold: 28,
        revenue: "IDR 560,000",
        trend: "down",
        percentage: 5,
    },
    {
        name: "Fresh Milk",
        category: "Dairy",
        sold: 15,
        revenue: "IDR 262,500",
        trend: "up",
        percentage: 15,
    },
]






export default function DashboardPage() {
    const [units, setUnit] = useState<string[]>([]);
    const [categories, setCategory] = useState<string[]>([]);
    const [suppliers, setSupplier] = useState<{ id: string; name: string }[]>([]);
    const [timeRange, setTimeRange] = useState("")
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();
    const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
    const [showAddUnit, setShowAddUnit] = useState(false);
    const [newUnitname, setNewUnitName] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showAddSupplier, setShowAddSupplier] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState("");
    const [newSupplierPhone, setNewSupplierPhone] = useState("");
    const [newSupplierAddress, setNewSupplierAddress] = useState("");


    const handleAddUnit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/unit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newUnitname }),
        });
        setShowAddUnit(false);
        setNewUnitName("");
        // Refetch units
        fetch("/api/unit")
            .then(res => res.json())
            .then(data => setUnit(data.map((u: { name: string }) => u.name)));
    }
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/category", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newCategoryName }), // <-- use title, not name
        });
        setShowAddCategory(false);
        setNewCategoryName("");
        // Refetch categories
        fetch("/api/category")
            .then(res => res.json())
            .then(data => setCategory(data.map((c: { title: string }) => c.title)));
    };

    const handleAddSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/suppliers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: newSupplierName,
                phone: newSupplierPhone,
                address: newSupplierAddress,
            }),
        });
        setShowAddSupplier(false);
        setNewSupplierName("");
        setNewSupplierPhone("");
        setNewSupplierAddress("");
        // Refetch suppliers
        fetch("/api/suppliers")
            .then(res => res.json())
            .then(data => setSupplier(data));

    };
    interface InventoryItem {
        id: string;
        name: string;
        currentStock: number;
        maxStock: number;
        unit: string;
    }

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/"); // Redirect to login
            } else {
                setCheckingAuth(false); // User is logged in, show the page
            }
        }
    }, [router]);

    useEffect(() => {
        if (!checkingAuth) {
            const token = localStorage.getItem("token");
            if (!token) return;
            fetch("/api/inventory", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setInventoryData(Array.isArray(data) ? data : []);
                })
                .catch(() => setInventoryData([]));
        }
    }, [checkingAuth]);



    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="flex items-center gap-2">
                        <Coffee className="h-6 w-6" />
                        <h1 className="text-xl font-semibold">Coffee Shop Inventory</h1>
                    </div>
                </header>

                {/* Main Content */}

                <div className="flex-1 p-6">
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Grid3X3 className="w-6 h-6 text-gray-600" />
                                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={timeRange === "today" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimeRange("today")}
                                >
                                    Today
                                </Button>
                                <Button
                                    variant={timeRange === "week" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimeRange("week")}
                                >
                                    This Week
                                </Button>
                                <Button
                                    variant={timeRange === "month" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setTimeRange("month")}
                                >
                                    This Month
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">IDR 2,450,000</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +12.5% from yesterday
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">47</div>
                                <div className="flex items-center text-xs text-green-600">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +8.2% from yesterday
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">3</div>
                                <div className="flex items-center text-xs text-red-600">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +1 from yesterday
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                                <Coffee className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">24</div>
                                <div className="flex items-center text-xs text-muted-foreground">No change from yesterday</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Sales Overview Chart Placeholder */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Sales Overview</CardTitle>
                                <p className="text-sm text-muted-foreground">Daily sales performance for the past 7 days</p>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                        <p className="text-gray-500">Sales Chart</p>
                                        <p className="text-sm text-gray-400">Chart visualization would go here</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button onClick={() => setShowAddCategory(true)} className="w-full justify-start">
                                    + Add Category
                                    <Package className="w-4 h-4 mr-2" />
                                </Button>
                                <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Category</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
                                            <Input
                                                placeholder="e.g. Freshmilk, beans, etc"
                                                value={newCategoryName}
                                                onChange={e => setNewCategoryName(e.target.value)}
                                                required
                                            />
                                            <Button type="submit">Add Category</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={() => setShowAddUnit(true)} className="w-full justify-start">
                                    + Add Unit
                                    <Boxes className="w-4 h-4 mr-2"/>
                                </Button>
                                <Dialog open={showAddUnit} onOpenChange={setShowAddUnit}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Unit</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddUnit} className="flex flex-col gap-4">
                                            <Input
                                                placeholder="e.g. kg, liter, pcs"
                                                value={newUnitname}
                                                onChange={e => setNewUnitName(e.target.value)}
                                                required
                                            />
                                            <Button type="submit">Add Unit</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button onClick={() => setShowAddSupplier(true)} className="w-full justify-start">
                                    + Add Supplier
                                    <Building2 className="w-4 h-4 mr-2" />
                                    {/* <Package className="w-4 h-4 mr-2" /> */}
                                </Button>
                                <Dialog open={showAddSupplier} onOpenChange={setShowAddSupplier}>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add New Supplier</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleAddSupplier} className="flex flex-col gap-4">
                                            <Input
                                                placeholder="Supplier Name (e.g. PT, CV, ...)"
                                                value={newSupplierName}
                                                onChange={e => setNewSupplierName(e.target.value)}
                                                required
                                            />
                                            <Input
                                                placeholder="Phone Number"
                                                value={newSupplierPhone}
                                                onChange={e => setNewSupplierPhone(e.target.value)}
                                            />
                                            <Input
                                                placeholder="Address"
                                                value={newSupplierAddress}
                                                onChange={e => setNewSupplierAddress(e.target.value)}
                                            />
                                            <Button type="submit">Add Supplier</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                {/* <Button className="w-full justify-start" variant="outline">
                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                    Create Order
                                </Button> */}
                                <Button className="w-full justify-start" variant="outline">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Generate Report
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Selling Products */}
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Products</CardTitle>
                                <p className="text-sm text-muted-foreground">Best performing products this week</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topProducts.map((product, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                                    <Coffee className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{product.revenue}</p>
                                                <div className="flex items-center gap-1">
                                                    {product.trend === "up" ? (
                                                        <TrendingUp className="w-3 h-3 text-green-500" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                                    )}
                                                    <span className={`text-xs ${product.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                                        {product.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card> */}

                        {/* Recent Activities */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                                <p className="text-sm text-muted-foreground">Latest activities in your coffee shop</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-start gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.type === "sale"
                                                    ? "bg-green-100"
                                                    : activity.type === "alert"
                                                        ? "bg-red-100"
                                                        : "bg-blue-100"
                                                    }`}
                                            >
                                                {activity.type === "sale" ? (
                                                    <DollarSign
                                                        className={`w-4 h-4 ${activity.type === "sale"
                                                            ? "text-green-600"
                                                            : activity.type === "alert"
                                                                ? "text-red-600"
                                                                : "text-blue-600"
                                                            }`}
                                                    />
                                                ) : activity.type === "alert" ? (
                                                    <AlertTriangle className="w-4 h-4 text-red-600" />
                                                ) : (
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{activity.description}</p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500">{activity.time}</p>
                                                    {activity.amount && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            {activity.amount}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Inventory Status - Integrated with backend, horizontally scrollable */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Inventory Status</CardTitle>
                            <p className="text-sm text-muted-foreground">Current stock levels of your products</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex overflow-x-auto gap-6 pb-2" style={{ scrollbarWidth: 'thin' }}>
                                {inventoryData.length === 0 ? (
                                    <div className="text-gray-500">No inventory data available.</div>
                                ) : (
                                    inventoryData.map((item) => {
                                        const percent = item.maxStock ? Math.round((item.currentStock / item.maxStock) * 100) : 0;
                                        return (
                                            <div key={item.id} className="min-w-[220px] space-y-2 bg-gray-50 rounded-lg p-4 shadow-sm">
                                                <div className="flex justify-between text-sm">
                                                    <span>{item.name}</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <Progress value={percent} className="h-2" />
                                                <p className={`text-xs ${percent < 20 ? 'text-red-500' : 'text-gray-500'}`}>{item.currentStock} {item.unit} / {item.maxStock} {item.unit}</p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
function setUnit(arg0: any): any {
    throw new Error("Function not implemented.")
}

