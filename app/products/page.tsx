"use client"

import { useEffect, useState, Suspense } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSearchParams } from "next/navigation"

interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
  category?: string
}

function ProductsPageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("featured")
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const { toast } = useToast()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        setProducts(data)

        // Extract unique categories
        const uniqueCategories = Array.from(new Set(data.map((p: Product) => p.category || "Other"))) as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [toast])

  // Apply filtering, search and sorting
  useEffect(() => {
    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => (p.category || "Other") === selectedCategory)
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "featured":
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, sortBy, selectedCategory, searchQuery])

  const handleAddToCart = async (productId: string, qty: number) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Added ${qty} item(s) to cart`,
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add to cart",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-purple-600 to-accent py-12 md:py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 text-balance">All Products</h1>
          <p className="text-base md:text-lg text-white/80 text-pretty">
            {searchQuery ? `Search results for "${searchQuery}"` : "Browse our complete collection"}
          </p>
        </div>
      </section>

      {/* Filters & Sorting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">
                {searchQuery ? "No products match your search" : "No products found"}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <ProductsPageContent />
      </Suspense>
    </main>
  )
}
