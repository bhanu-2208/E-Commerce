"use client"

import { CheckCircle, X } from "lucide-react"

interface ReceiptModalProps {
  isOpen: boolean
  onClose: () => void
  receipt: any
}

export function ReceiptModal({ isOpen, onClose, receipt }: ReceiptModalProps) {
  if (!isOpen || !receipt) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-md w-full p-8 border border-border">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-muted rounded transition-colors">
          <X size={24} />
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <CheckCircle className="text-white" size={32} />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-foreground mb-2">Order Confirmed!</h2>
        <p className="text-center text-muted-foreground mb-6">Thank you for your purchase</p>

        <div className="bg-muted p-4 rounded-lg mb-6 space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-bold text-foreground">{receipt.orderId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Customer</p>
            <p className="font-bold text-foreground">{receipt.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-bold text-foreground text-sm">{receipt.email}</p>
          </div>
          <div className="pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ${receipt.total.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-semibold text-foreground">{new Date(receipt.timestamp).toLocaleString()}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg hover:shadow-lg transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}
