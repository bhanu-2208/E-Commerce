"use client"

import type React from "react"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ShoppingCart, Search } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch("/api/cart")
        const data = await response.json()
        setCartCount(data.items?.length || 0)
      } catch (error) {
        console.error("Error fetching cart count:", error)
      }
    }

    fetchCartCount()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-primary via-purple-500 to-accent shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-primary text-lg">V</span>
            </div>
            <span className="font-bold text-white text-xl hidden sm:inline">Vibe Commerce</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-secondary transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-white">
              <Link href="/" className="hover:text-secondary transition-colors">
                Shop
              </Link>
              <Link href="/products" className="hover:text-secondary transition-colors">
                All Products
              </Link>
              <Link href="/orders" className="hover:text-secondary transition-colors">
                Orders
              </Link>
            </nav>

            <Link
              href="/cart"
              className="flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-secondary hover:text-white transition-all relative"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
