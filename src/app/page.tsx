"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Coffee, User, Mail, Lock, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [alert, setAlert] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent, type: string) => {
    e.preventDefault()
    setAlert(null)

    const form = e.target as HTMLFormElement

    

    if (type === "login") {
      const email = (form.elements.namedItem("login-email") as HTMLInputElement).value
      const password = (form.elements.namedItem("login-password") as HTMLInputElement).value

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "login", email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setAlert({
          type: "success",
          message: data.message || "Login Successful"
        })
        router.push("/inventory")
      } else {
        setAlert({
          type: "error",
          message: data.error || "Login Faild"
        })
      }
    } else if (type === "register") {
      const name = (form.elements.namedItem("register-name") as HTMLInputElement).value
      const email = (form.elements.namedItem("register-email") as HTMLInputElement).value
      const password = (form.elements.namedItem("register-password") as HTMLInputElement).value
      const confirm = (form.elements.namedItem("confirm-password") as HTMLInputElement).value

      if (password !== confirm) {
        setAlert({
          type: "error",
          message: "Passwords do not match"
        })
        return
      }

      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "register", name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setAlert({
          type: "success",
          message: data.success || "Register Sucessfull"
        })
        // setActiveTab("login")
      } else {
        setAlert({
          type: "error",
          message: data.error || "registration failed"
        })
      }
    } else if (type === "reset") {
      // Implement reset logic if needed
      const email = (form.elements.namedItem("reset-email") as HTMLInputElement).value
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if(res.ok){
        setAlert({
          type: "success",
          message: "Reset link sent to your email"
        })
      } else {
        const data = await res.json()
        setAlert({
          type: "error",
          message: data.error || "Failed to send reset link"
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-amber-600 p-3 rounded-full">
              <Coffee className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sora Coffee</h1>
          <p className="text-gray-400">Stock Management System</p>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              Access your coffee shop management dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger
                  value="login"
                  className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                {/* <TabsTrigger
                  value="register"
                  className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger> */}
                <TabsTrigger
                  value="reset"
                  className="text-gray-300 data-[state=active]:bg-amber-600 data-[state=active]:text-white"
                >
                  Forgot Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-6">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="admin@example.com"
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input

                        id="login-password"
                        autoComplete="off"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm text-gray-300">
                      <input type="checkbox" className="rounded border-gray-600 bg-gray-700" />
                      <span>Remember me</span>
                    </label>
                    <Button
                      type="button"
                      variant="link"
                      className="text-amber-500 hover:text-amber-400 p-0 h-auto"
                      onClick={() => setActiveTab("reset")}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  {alert && (
                    <div className="text-green-500 text-sm text-center">{alert.message}</div>
                  )}
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-6">
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-gray-300">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" className="rounded border-gray-600 bg-gray-700 mt-1" required />
                    <label className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
                        Terms of Service
                      </Button>{" "}
                      and{" "}
                      <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
                        Privacy Policy
                      </Button>
                    </label>
                  </div>
                  {alert && (
                    <div className={`text-sm text-center ${alert.type === "success" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {alert.message}</div>
                  )}
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4 mt-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">Reset Password</h3>
                  <p className="text-sm text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <form onSubmit={(e) => handleSubmit(e, "reset")} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-gray-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Send Reset Link
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white"
                    onClick={() => setActiveTab("login")}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Login
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-400">
            Need help?{" "}
            <Button variant="link" className="text-amber-500 hover:text-amber-400 p-0 h-auto">
              Contact Support
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}