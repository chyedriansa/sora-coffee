"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Coffee, Package, TrendingUp, AlertTriangle, Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogTrigger, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Jwt } from "jsonwebtoken"

//inventory data

type InventoryItem = {
  id?: string | number
  name: string
  category?: { title: string }
  categoryTitle?: string
  supplier?: { name: string }
  supplierName?: string
  currentStock?: number
  minStock?: number
  maxStock?: number
  unit?: string
  price?: number
  lastUpdated?: string
}

export default function StockOpnameDashboard() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showUpdateStockDialog, setShowUpdateStockDialog] = useState(false);
  const [updateStockItem, setUpdateStockItem] = useState<InventoryItem | null>(null);
  const [updateStockQty, setUpdateStockQty] = useState("");
  const [updateType, setUpdateType] = useState<"increase" | "decrease">("increase");
  const [supplier, setSupplier] = useState<Supplier[]>([]);
  type Supplier = { id: string | number; name: string };
  const [category, setCategory] = useState<category[]>([]);
  type category = { id: string | number; title: string };
  const [unit, setUnit] = useState<string[]>([]);
  const categories = ["All", ...Array.from(new Set(inventoryData.map(item => item.category?.title || item.categoryTitle).filter(Boolean)))];
  type unit = { id: string | number; title: string };
  const [newItem, setNewItem] = useState({
    name: "",
    categoryTitle: "",
    supplierName: "",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "",
    price: "",
  })

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

  useEffect(() => {
    if (showAddForm) {
      fetch("/api/suppliers")
        .then(response => response.json())
        .then(data => setSupplier(data))
        .catch(() => setSupplier([]))
    }
  }, [showAddForm]);

  useEffect(() => {
    if (showAddForm) {
      fetch("/api/category")
        .then(response => response.json())
        .then(data => setCategory(data))
        .catch(() => setCategory([]))
    }
  }, [showAddForm]);

  useEffect(() => {
    if (showAddForm) {
      fetch("/api/unit")
        .then(response => response.json())
        .then(data => {
          // Extract only the unit strings and remove duplicates
          const uniqueUnits = Array.from(new Set(data.map((item: { unit: string }) => item.unit).filter(Boolean))) as string[];
          setUnit(uniqueUnits);
        })
        .catch(() => setUnit([]));


    }
  }, [showAddForm]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);


  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category?.title || item.categoryTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier?.name || item.supplierName || "").toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || (item.category?.title || item.categoryTitle) === selectedCategory
    return matchesSearch && matchesCategory
  })
  const totalItems = inventoryData.length
  const lowStockItems = inventoryData.filter((item) => (item.currentStock || 0) <= (item.minStock || 0)).length
  const totalValue = inventoryData.reduce((sum, item) => sum + (item.currentStock || 0) * (item.price || 0), 0)


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  };
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newItem.name,
        categoryTitle: newItem.categoryTitle,
        supplierName: newItem.supplierName,
        currentStock: Number(newItem.currentStock),
        minStock: Number(newItem.minStock),
        maxStock: Number(newItem.maxStock),
        unit: newItem.unit,
        price: Number(newItem.price),
      }),
    })
    if (res.ok) {
      const added = await res.json()
      setInventoryData([...inventoryData, added])
      setShowAddForm(false)
      setNewItem({
        name: "",
        categoryTitle: "",
        supplierName: "",
        currentStock: "",
        minStock: "",
        maxStock: "",
        unit: "",
        price: "",
      })
    }
  }

  function formatCurrency(value: number): React.ReactNode {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  // Helper to determine stock status
  function getStockStatus(
    currentStock?: number,
    minStock?: number,
    maxStock?: number
  ): { status: string; variant: "secondary" | "destructive" | "default" | "outline" | null | undefined } {
    if (currentStock === undefined || minStock === undefined || maxStock === undefined) {
      return { status: "Unknown", variant: "secondary" }
    }
    if (currentStock <= minStock) {
      return { status: "Low", variant: "destructive" }
    }
    if (currentStock >= maxStock) {
      // Use a valid variant, e.g., "default" for "Full"
      return { status: "Full", variant: "default" }
    }
    return { status: "Normal", variant: "default" }
  }

  const handleDeleteItem = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const res = await fetch("/api/inventory", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setInventoryData(inventoryData.filter(item => item.id !== id));
    } else {
      console.error("Failed to delete item");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <span className="ml-4 text-black font-semibold">Loading dashboard...</span>
      </div>
    );
  }
  if (checkingAuth) {
    return null;
  }
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

        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">Active inventory items</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alert</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
                <p className="text-xs text-muted-foreground">Items need restocking</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
                <p className="text-xs text-muted-foreground">Current inventory value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <Coffee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length - 1}</div>
                <p className="text-xs text-muted-foreground">Product categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage your coffee shop inventory and track stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items, categories, or suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Category: {selectedCategory}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categories.map((category) => (
                      <DropdownMenuItem key={category ?? "Unknown"} onClick={() => setSelectedCategory(category ?? "")}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <div>

                  <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                    <DialogTrigger asChild>

                      <Button onClick={() => setShowAddForm(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="mb-6 w-full max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col gap-4">
                      <DialogHeader>
                        <DialogTitle >
                        </DialogTitle>
                      </DialogHeader>
                      <DialogDescription></DialogDescription>
                      {showAddForm && (
                        <form
                          onSubmit={handleAddItem}
                          className="mb-6 w-full justify-center max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col gap-4"
                        >
                          <h2 className="text-xl font-bold text-amber-50  mb-2 w-full flex justify-center">Add New Inventory Item</h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-300 mb-1">Item Name</label>
                              <Input
                                placeholder="Item Name"
                                value={newItem.name}
                                onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Category</label>
                              <select
                                value={newItem.categoryTitle}
                                onChange={e => setNewItem({ ...newItem, categoryTitle: e.target.value })}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">

                                <option value="">Select Category</option>
                                {category.map(cat => (
                                  <option key={cat.id} value={cat.title}>
                                    {cat.title}
                                  </option>
                                ))}
                              </select>

                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Supplier</label>
                              <select
                                value={newItem.supplierName}
                                onChange={e => setNewItem({ ...newItem, supplierName: e.target.value })}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                              >
                                <option value="">Select Supplier</option>
                                {supplier.map(supplier => (
                                  <option key={supplier.id} value={supplier.name}>
                                    {supplier.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Unit</label>
                              <select
                                value={newItem.unit}
                                onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white">

                                <option value="">Select Unit</option>
                                {unit.map(u => (
                                  <option key={u} value={u}>
                                    {u}
                                  </option>
                                ))}
                              </select>

                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Current Stock</label>
                              <Input
                                placeholder="Current Stock"
                                type="number"
                                value={newItem.currentStock}
                                onChange={e => setNewItem({ ...newItem, currentStock: e.target.value })}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Min Stock</label>
                              <Input
                                placeholder="Min Stock"
                                type="number"
                                value={newItem.minStock}
                                onChange={e => setNewItem({ ...newItem, minStock: e.target.value })}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Max Stock</label>
                              <Input
                                placeholder="Max Stock"
                                type="number"
                                value={newItem.maxStock}
                                onChange={e => setNewItem({ ...newItem, maxStock: e.target.value })}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-300 mb-1">Price</label>
                              <Input
                                placeholder="Price"
                                type="number"
                                value={newItem.price}
                                onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-6">
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => setShowAddForm(false)}
                              className="bg-amber hover:bg-white text-white font-semibold"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              type="submit"
                              className="bg-amber  hover:bg-amber-700 text-white font-semibold"
                            >
                              Add Item
                            </Button>
                          </div>
                        </form>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showUpdateStockDialog} onOpenChange={setShowUpdateStockDialog}>
                    <DialogContent className="flex flex-col gap-4 w-full justify-center max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
                      <DialogHeader>
                        <DialogTitle className="flex justify-center max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-2 text-amber-100 font-semibold">Update Stock: {updateStockItem?.name}</DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          if (!updateStockItem) return;
                          const res = await fetch("/api/inventory", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              id: updateStockItem.id,
                              updateStockQty: Number(updateStockQty),
                              updateType,
                            }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setInventoryData((prev) =>
                              prev.map((item) =>
                                item.id === updated.id ? { ...item, currentStock: updated.currentStock } : item
                              )
                            );
                            setShowUpdateStockDialog(false);
                            setUpdateStockQty("");
                          }
                        }}
                        className="flex flex-col gap-4 mb-6 w-full justify-center max-w-2xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6"
                      >
                        <label className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-100">
                          <span>Type :</span>
                          <select
                            value={updateType}
                            onChange={e => setUpdateType(e.target.value as "increase" | "decrease")}
                            // className="ml-2 border rounded px-2 py-1"
                          >
                            <option className="bg-gray-900" value="increase">Stock In</option>
                            <option className="bg-gray-900" value="decrease">Stock Out</option>
                          </select>
                        </label>
                        <label className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-100">
                          Quantity :
                          <Input
                            type="number"
                            min={1}
                            value={updateStockQty}
                            onChange={(e) => setUpdateStockQty(e.target.value)}
                            required
                          />
                        </label>
                        <Button
                          className="justify-end-safe mb-6 w-30 bg-amber  hover:bg-amber-700 text-white font-semibold  " type="submit" variant={"outline"}>Update Stock</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Current Stock</TableHead>
                      <TableHead>Min/Max</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => {
                      const stockStatus = getStockStatus(item.currentStock, item.minStock, item.maxStock)
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category?.title || item.categoryTitle}</TableCell>
                          <TableCell>
                            <span className="font-medium">{item.currentStock}</span> {item.unit}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.minStock} / {item.maxStock} {item.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price ?? 0)}</TableCell>
                          <TableCell>{item.supplier?.name || item.supplierName}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button className="hover:bg-gray-200"variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="text-blue-500">
                                  <Edit className="mr-2 h-4 w-4 " />
                                  Edit Item
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setUpdateStockItem(item);
                                  setShowUpdateStockDialog(true);
                                  setUpdateType("increase"); // default to increase
                                }}
                                  className="text-green-700">
                                  <Package className="mr-2 h-4 w-4" />
                                  Update Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive"
                                  onClick={() => handleDeleteItem(item.id!)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Item
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function setStockOutItem(item: InventoryItem) {
  throw new Error("Function not implemented.")
}
