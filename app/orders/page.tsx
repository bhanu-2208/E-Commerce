"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Order {
  _id: string
  orderId: string
  name: string
  email: string
  total: number
  status: string
  createdAt: string
  items: any[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        const data = await response.json()
        setOrders(data.orders || [])
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [toast])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back to Home</span>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-12">Order History</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping to create your first order</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                    <p className="font-bold text-foreground text-lg">{order.orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                    <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer</p>
                    <p className="font-semibold text-foreground">{order.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                    <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground mb-3">Items ({order.items?.length || 0})</p>
                  <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          {item.product?.name || "Product"} x {item.qty}
                        </span>
                        <span className="font-semibold text-foreground">
                          ${((item.product?.price || 0) * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
