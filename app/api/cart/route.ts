import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value || "default-session"

    const db = await getDatabase()
    const cartCollection = db.collection("carts")

    const cart = await cartCollection.findOne({ sessionId })

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 })
    }

    // Fetch product details
    const productsCollection = db.collection("products")
    const enrichedItems = await Promise.all(
      cart.items.map(async (item: any) => {
        const product = await productsCollection.findOne({
          _id: item.productId,
        })
        return {
          ...item,
          product,
        }
      }),
    )

    const total = enrichedItems.reduce((sum: number, item: any) => sum + (item.product?.price || 0) * item.qty, 0)

    return NextResponse.json({
      items: enrichedItems,
      total: Number.parseFloat(total.toFixed(2)),
    })
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value || "default-session"
    const body = await req.json()
    const { productId, qty } = body

    if (!productId || !qty || qty < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    const db = await getDatabase()
    const cartCollection = db.collection("carts")

    const result = await cartCollection.updateOne(
      { sessionId },
      {
        $push: {
          items: {
            _id: new ObjectId(),
            productId,
            qty,
            addedAt: new Date(),
          },
        },
      },
      { upsert: true },
    )

    return NextResponse.json({
      success: true,
      message: "Item added to cart",
    })
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
