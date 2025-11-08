"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { CartItem } from "@/components/cart-item"
import { CheckoutModal } from "@/components/checkout-modal"
import { ReceiptModal } from "@/components/receipt-modal"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, ArrowLeft } from "lucide-react"

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showCheckout, setShowCheckout] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const response = await fetch("/api/cart")
      const data = await response.json()
      setCartItems(data.items)
      setTotal(data.total)
    } catch (error) {
      console.error("Error fetching cart:", error)
      toast({
        title: "Error",
        description: "Failed to load cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchCart()
        toast({
          title: "Success",
          description: "Item removed from cart",
        })
      }
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = async (formData: any) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cartItems,
          total,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setReceipt(data.receipt)
        setShowReceipt(true)
        setShowCheckout(false)
        setCartItems([])
        setTotal(0)
      } else {
        toast({
          title: "Error",
          description: data.error || "Checkout failed",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      toast({
        title: "Error",
        description: "Failed to complete checkout",
        variant: "destructive",
      })
    }
  }

  const handleReceiptClose = () => {
    setShowReceipt(false)
    setReceipt(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors mb-8">
          <ArrowLeft size={20} />
          <span className="font-semibold">Continue Shopping</span>
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart size={40} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">Add items to get started shopping</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all"
            >
              <ShoppingCart size={20} />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item._id} item={item} onRemove={handleRemoveItem} />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax</span>
                    <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 pb-8 border-b border-border">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    ${(total + total * 0.08).toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  Proceed to Checkout
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4">Secure checkout with SSL encryption</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        total={total + total * 0.08}
        onSubmit={handleCheckout}
      />
      <ReceiptModal isOpen={showReceipt} onClose={handleReceiptClose} receipt={receipt} />
    </main>
  )
}
