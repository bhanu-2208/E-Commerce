import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value || "default-session"
    const body = await req.json()
    const { name, email, cartItems, total } = body

    if (!name || !email || !cartItems || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()
    const ordersCollection = db.collection("orders")
    const cartCollection = db.collection("carts")

    // Create order
    const order = {
      orderId: `ORD-${Date.now()}`,
      sessionId,
      name,
      email,
      items: cartItems,
      total,
      status: "completed",
      createdAt: new Date(),
      timestamp: new Date().toISOString(),
    }

    const result = await ordersCollection.insertOne(order)

    // Clear cart
    await cartCollection.deleteOne({ sessionId })

    return NextResponse.json({
      success: true,
      receipt: order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
