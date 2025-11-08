"use client"
import { Trash2 } from "lucide-react"

interface CartItemProps {
  item: any
  onRemove: (itemId: string) => void
}

export function CartItem({ item, onRemove }: CartItemProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-5 hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        <img
          src={item.product?.image || "/placeholder.svg"}
          alt={item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-foreground mb-1">{item.product?.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{item.product?.description}</p>

        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary">${(item.product?.price || 0).toFixed(2)}</div>
          <div className="text-sm font-semibold text-muted-foreground">Qty: {item.qty}</div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item._id)}
        className="p-2 hover:bg-destructive hover:text-white rounded-lg transition-colors flex-shrink-0"
      >
        <Trash2 size={20} />
      </button>
    </div>
  )
}
