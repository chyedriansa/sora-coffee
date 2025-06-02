"use client"

import { useState } from "react"
import { Coffee, Package, TrendingUp, AlertTriangle, Search, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

// Sample inventory data
const inventoryData = [
  {
    id: 1,
    name: "Arabica Coffee Beans",
    category: "Coffee Beans",
    currentStock: 25,
    minStock: 10,
    maxStock: 100,
    unit: "kg",
    price: 45000,
    supplier: "Local Farm Co.",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Robusta Coffee Beans",
    category: "Coffee Beans",
    currentStock: 8,
    minStock: 15,
    maxStock: 80,
    unit: "kg",
    price: 35000,
    supplier: "Mountain Coffee",
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    name: "Whole Milk",
    category: "Dairy",
    currentStock: 12,
    minStock: 5,
    maxStock: 30,
    unit: "liters",
    price: 8000,
    supplier: "Fresh Dairy Ltd.",
    lastUpdated: "2024-01-16",
  },
  {
    id: 4,
    name: "Sugar",
    category: "Sweeteners",
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unit: "kg",
    price: 12000,
    supplier: "Sweet Supply Co.",
    lastUpdated: "2024-01-15",
  },
  {
    id: 5,
    name: "Paper Cups (12oz)",
    category: "Packaging",
    currentStock: 200,
    minStock: 100,
    maxStock: 1000,
    unit: "pieces",
    price: 150,
    supplier: "Pack Solutions",
    lastUpdated: "2024-01-16",
  },
  {
    id: 6,
    name: "Croissants",
    category: "Pastries",
    currentStock: 24,
    minStock: 10,
    maxStock: 50,
    unit: "pieces",
    price: 5000,
    supplier: "Bakery Fresh",
    lastUpdated: "2024-01-16",
  },
  {
    id: 7,
    name: "Espresso Machine Filters",
    category: "Equipment",
    currentStock: 5,
    minStock: 10,
    maxStock: 30,
    unit: "pieces",
    price: 25000,
    supplier: "Coffee Tech",
    lastUpdated: "2024-01-10",
  },
]

function getStockStatus(current: number, min: number, max: number) {
  if (current <= min) return { status: "Low Stock", variant: "destructive" as const }
  if (current >= max * 0.8) return { status: "High Stock", variant: "secondary" as const }
  return { status: "Normal", variant: "default" as const }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function StockOpnameDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = ["All", ...Array.from(new Set(inventoryData.map((item) => item.category)))]

  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalItems = inventoryData.length
  const lowStockItems = inventoryData.filter((item) => item.currentStock <= item.minStock).length
  const totalValue = inventoryData.reduce((sum, item) => sum + item.currentStock * item.price, 0)

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
                      <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
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
                          <TableCell>{item.category}</TableCell>
                          <TableCell>
                            <span className="font-medium">{item.currentStock}</span> {item.unit}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.minStock} / {item.maxStock} {item.unit}
                          </TableCell>
                          <TableCell>
                            <Badge variant={stockStatus.variant}>{stockStatus.status}</Badge>
                          </TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{item.supplier}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.lastUpdated}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Actions
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Item
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Package className="mr-2 h-4 w-4" />
                                  Update Stock
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
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
