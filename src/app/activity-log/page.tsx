"use client"

import { useState, useEffect } from "react"
import { Grid3X3, Coffee } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useRouter } from "next/navigation"
import AuthProvider from "@/components/AuthProvider"


// Define the type for AuditLog
interface AuditLog {
    id: string;
    userId: string;
    action: string;
    itemId: string | null;
    details: string | null;
    createdAt: string; // The date will come as a string from the API
    user: {
        name: string | null;
        email: string | null;
    };
    item: {
        name: string;
    } | null;
}

export default function DashboardPage() {
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [checkingAuth] = useState(false);
    const router = useRouter();


    useEffect(() => {
        if (!checkingAuth) {
            const token = localStorage.getItem("token");
            if (!token) return;

            fetch("/api/acitvity-log", { // Corrected endpoint URL
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setAuditLogs(data);
                })
                .catch((error) => {
                    console.error("Error fetching audit logs:", error);
                });
        }
    }, [checkingAuth]);

    async function updateStock(itemId: string, newStock: number) {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`/api/items/${itemId}`, {
                method: "PATCH", // Use PATCH request
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ currentStock: newStock }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Handle the response data (e.g., update the UI)
            console.log("Stock updated successfully:", data);
        } catch (error) {
            console.error("Error updating stock:", error);
            // Handle the error (e.g., display an error message)
        }
    }

    return (
        <AuthProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <div className="flex items-center gap-2">
                            <Coffee className="h-6 w-6" />
                            <h1 className="text-xl font-semibold">Sora Coffee Inventory</h1>
                        </div>
                    </header>

                    {/* Main Content */}
                    <div className="flex-1 p-6">
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Grid3X3 className="w-6 h-6 text-gray-600" />
                                    <h1 className="text-2xl font-semibold text-gray-900">Activity Log of Stock Opname</h1>
                                </div>
                            </div>
                        </div>

                        {/* Display Audit Logs */}
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Recent Activities</CardTitle>
                                <p className="text-sm text-muted-foreground">Latest activities in your management stock</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {auditLogs.map((log) => (
                                        <div key={log.id} className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">
                                                    {log.user?.name || "Unknown User"} - {log.action}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {log.details}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(log.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </AuthProvider>
    );
}