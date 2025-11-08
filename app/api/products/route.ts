import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

const mockProducts = [
  {
    _id: "1",
    name: "Premium Wireless Headphones",
    price: 149.99,
    category: "Electronics",
    description: "High-quality sound with noise cancellation",
    image: "/wireless-headphones.png",
    inStock: true,
  },
  {
    _id: "2",
    name: "Elegant Wrist Watch",
    price: 199.99,
    category: "Fashion",
    description: "Luxury timepiece with classic design",
    image: "/wrist-watch.jpg",
    inStock: true,
  },
  {
    _id: "3",
    name: "Professional Camera",
    price: 899.99,
    category: "Electronics",
    description: "Advanced DSLR camera with 4K capability",
    image: "/vintage-camera-still-life.png",
    inStock: true,
  },
  {
    _id: "4",
    name: "Designer Sunglasses",
    price: 249.99,
    category: "Fashion",
    description: "UV protection with premium materials",
    image: "/stylish-sunglasses.png",
    inStock: true,
  },
  {
    _id: "5",
    name: "Portable Speaker",
    price: 79.99,
    category: "Electronics",
    description: "Waterproof with 12-hour battery life",
    image: "/bluetooth-speaker.jpg",
    inStock: true,
  },
  {
    _id: "6",
    name: "Smart Fitness Watch",
    price: 299.99,
    category: "Electronics",
    description: "Track your health and fitness goals",
    image: "/modern-smartwatch.png",
    inStock: true,
  },
  {
    _id: "7",
    name: "Premium Leather Bag",
    price: 349.99,
    category: "Fashion",
    description: "Handcrafted Italian leather",
    image: "/brown-leather-messenger-bag.png",
    inStock: true,
  },
  {
    _id: "8",
    name: "Wireless Charger Pad",
    price: 59.99,
    category: "Electronics",
    description: "Fast charging for all compatible devices",
    image: "/wireless-charger.png",
    inStock: true,
  },
]

export async function GET() {
  try {
    const db = await getDatabase()
    const productsCollection = db.collection("products")

    // Check if products exist, if not seed them
    const existingProducts = await productsCollection.find({}).toArray()

    if (existingProducts.length === 0) {
      await productsCollection.insertMany(mockProducts)
    }

    const products = await productsCollection.find({}).toArray()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
