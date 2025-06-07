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

// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Eye, EyeOff, Coffee, User, Mail, Lock, ArrowLeft } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function AuthForm() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [activeTab, setActiveTab] = useState("login")

//   const handleSubmit = (e: React.FormEvent, type: string) => {
//     e.preventDefault()
//     console.log(`${type} form submitted`)
//     // Handle form submission logic here
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center mb-4">
//             <div className="bg-amber-600 p-3 rounded-full">
//               <Coffee className="h-8 w-8 text-white" />
//             </div>
//           </div>
//           <h1 className="text-2xl font-bold text-white mb-2">Sora Coffee</h1>
//           <p className="text-gray-400">Stock Management System</p>
//         </div>

//         <Card className="bg-gray-800 border-gray-700">
//           <CardHeader className="space-y-1 pb-4">
//             <CardTitle className="text-xl text-white text-center">Welcome Back</CardTitle>
//             <CardDescription className="text-gray-400 text-center">
//               Access your coffee shop management dashboard
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//               <TabsList className="grid w-full grid-cols-3 bg-gray-700">
//                 <TabsTrigger
//                   value="login"
//                   className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
//                 >
//                   Login
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="register"
//                   className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
//                 >
//                   Register
//                 </TabsTrigger>
//                 <TabsTrigger
//                   value="reset"
//                   className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
//                 >
//                   Reset
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="login" className="space-y-4 mt-6">
//                 <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="login-email" className="text-gray-300">
//                       Email Address
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="login-email"
//                         type="email"
//                         placeholder="admin@example.com"
//                         className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="login-password" className="text-gray-300">
//                       Password
//                     </Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="login-password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Enter your password"
//                         className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center space-x-2 text-sm text-gray-300">
//                       <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
//                       <span>Remember me</span>
//                     </label>
//                     <Button
//                       type="button"
//                       variant="link"
//                       className="text-amber-500 hover:text-amber-400 p-0 h-auto"
//                       onClick={() => setActiveTab("reset")}
//                     >
//                       Forgot password?
//                     </Button>
//                   </div>
//                   <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
//                     Sign In
//                   </Button>
//                 </form>
//               </TabsContent>

//               <TabsContent value="register" className="space-y-4 mt-6">
//                 <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="register-name" className="text-gray-300">
//                       Full Name
//                     </Label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="register-name"
//                         type="text"
//                         placeholder="John Doe"
//                         className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="register-email" className="text-gray-300">
//                       Email Address
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="register-email"
//                         type="email"
//                         placeholder="john@example.com"
//                         className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="register-password" className="text-gray-300">
//                       Password
//                     </Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="register-password"
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Create a password"
//                         className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
//                         onClick={() => setShowPassword(!showPassword)}
//                       >
//                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="confirm-password" className="text-gray-300">
//                       Confirm Password
//                     </Label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="confirm-password"
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm your password"
//                         className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       >
//                         {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                       </Button>
//                     </div>
//                   </div>
//                   <div className="flex items-start space-x-2">
//                     <input type="checkbox" className="rounded border-gray-600 bg-gray-700 mt-1" required />
//                     <label className="text-sm text-gray-300">
//                       I agree to the{" "}
//                       <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
//                         Terms of Service
//                       </Button>{" "}
//                       and{" "}
//                       <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
//                         Privacy Policy
//                       </Button>
//                     </label>
//                   </div>
//                   <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
//                     Create Account
//                   </Button>
//                 </form>
//               </TabsContent>

//               <TabsContent value="reset" className="space-y-4 mt-6">
//                 <div className="text-center mb-4">
//                   <h3 className="text-lg font-semibold text-white mb-2">Reset Password</h3>
//                   <p className="text-sm text-gray-400">
//                     Enter your email address and we'll send you a link to reset your password.
//                   </p>
//                 </div>
//                 <form onSubmit={(e) => handleSubmit(e, "reset")} className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="reset-email" className="text-gray-300">
//                       Email Address
//                     </Label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="reset-email"
//                         type="email"
//                         placeholder="Enter your email"
//                         className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
//                     Send Reset Link
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     className="w-full text-gray-400 hover:text-white"
//                     onClick={() => setActiveTab("login")}
//                   >
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back to Login
//                   </Button>
//                 </form>
//               </TabsContent>
//             </Tabs>
//           </CardContent>
//         </Card>

//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-400">
//             Need help?{" "}
//             <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
//               Contact Support
//             </Button>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }
