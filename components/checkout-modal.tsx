"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  total: number
  onSubmit: (data: any) => void
}

export function CheckoutModal({ isOpen, onClose, total, onSubmit }: CheckoutModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSubmit(formData)
    setLoading(false)
    setFormData({ name: "", email: "" })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-md w-full p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Checkout</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-muted border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div className="bg-muted p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-border">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-border">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-semibold text-foreground">Free</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-foreground">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-muted text-foreground font-semibold py-2 px-4 rounded-lg hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-primary to-accent text-white font-semibold py-2 px-4 rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {loading ? "Processing..." : "Complete Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
