"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: string, qty: number) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    await onAddToCart(product._id, quantity)
    setQuantity(1)
    setLoading(false)
  }

  return (
    <div className="group bg-card hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden border border-border hover:border-primary">
      {/* Image Container */}
      <div className="relative w-full h-64 bg-muted overflow-hidden">
        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>

        {/* Price */}
        <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
          ${product.price.toFixed(2)}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mb-4 bg-muted p-2 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-1 hover:bg-border rounded transition-colors"
          >
            <Minus size={18} />
          </button>
          <span className="flex-1 text-center font-semibold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-border rounded transition-colors">
            <Plus size={18} />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
