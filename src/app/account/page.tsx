"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { User, Mail, Phone, MapPin, Shield, Bell, Eye, EyeOff, Camera, Save, Key } from "lucide-react"
import { useEffect } from "react"


export default function ManageAccountPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: true,
    })
    const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null)

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("user")
            if (userStr) {
                setUser(JSON.parse(userStr))
            }
        }
    }, [])
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Account</h1>
                    <p className="text-gray-600">Update your account settings and preferences</p>
                </div>

                <div className="max-w-4xl">
                    <Tabs defaultValue="profile" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="profile">Profile</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                            <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Profile Information
                                    </CardTitle>
                                    <CardDescription>Update your personal information and profile picture</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Profile Picture */}
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <Avatar className="w-24 h-24">
                                                <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                                                <AvatarFallback className="text-xl">
                                                    {user?.name
                                                        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                                                        : ""}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="font-semibold text-lg">{user?.name || "No Name"}</h3>
                                                <p className="text-gray-600">{user?.email}</p>
                                                <Badge variant="secondary" className="mt-1">
                                                    Active
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Form Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input id="fullName"
                                                defaultValue={user?.name || ""} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="email" type="email" defaultValue={user?.email || ""} className="pl-10" />                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="phone" defaultValue="+1 (555) 123-4567" className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="address">Address</Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="address" defaultValue="123 Coffee Street, Bean City, BC 12345" className="pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Changes
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Security Tab */}
                        <TabsContent value="security" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        Security Settings
                                    </CardTitle>
                                    <CardDescription>Manage your password and security preferences</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="currentPassword" type={showPassword ? "text" : "password"} className="pl-10 pr-10" />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="newPassword" type={showPassword ? "text" : "password"} className="pl-10" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <Input id="confirmPassword" type={showPassword ? "text" : "password"} className="pl-10" />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Two-Factor Authentication</h4>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">SMS Authentication</p>
                                                <p className="text-sm text-gray-600">Receive codes via SMS</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Authentication</p>
                                                <p className="text-sm text-gray-600">Receive codes via email</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Update Security
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Notifications Tab */}
                        <TabsContent value="notifications" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="w-5 h-5" />
                                        Notification Preferences
                                    </CardTitle>
                                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Email Notifications</p>
                                                <p className="text-sm text-gray-600">Receive updates via email</p>
                                            </div>
                                            <Switch
                                                checked={notifications.email}
                                                onCheckedChange={(checked: any) => setNotifications((prev) => ({ ...prev, email: checked }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Push Notifications</p>
                                                <p className="text-sm text-gray-600">Receive browser notifications</p>
                                            </div>
                                            <Switch
                                                checked={notifications.push}
                                                onCheckedChange={(checked: any) => setNotifications((prev) => ({ ...prev, push: checked }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">SMS Notifications</p>
                                                <p className="text-sm text-gray-600">Receive text messages</p>
                                            </div>
                                            <Switch
                                                checked={notifications.sms}
                                                onCheckedChange={(checked: any) => setNotifications((prev) => ({ ...prev, sms: checked }))}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Notification Types</h4>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Low stock alerts</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">New orders</span>
                                                <Switch defaultChecked />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">System updates</span>
                                                <Switch />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm">Weekly reports</span>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Preferences
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Preferences Tab */}
                        <TabsContent value="preferences" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Preferences</CardTitle>
                                    <CardDescription>Customize your application experience</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Dark Mode</p>
                                                <p className="text-sm text-gray-600">Use dark theme</p>
                                            </div>
                                            <Switch />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Auto-save</p>
                                                <p className="text-sm text-gray-600">Automatically save changes</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium">Compact View</p>
                                                <p className="text-sm text-gray-600">Show more items per page</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h4 className="font-medium">Language & Region</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="language">Language</Label>
                                                <select
                                                    id="language"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option>English (US)</option>
                                                    <option>Indonesian</option>
                                                    <option>Spanish</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="timezone">Timezone</Label>
                                                <select
                                                    id="timezone"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option>UTC-7 (Pacific Time)</option>
                                                    <option>UTC+7 (Jakarta Time)</option>
                                                    <option>UTC+0 (GMT)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Save Preferences
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
