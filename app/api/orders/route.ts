import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value || "default-session"

    const db = await getDatabase()
    const ordersCollection = db.collection("orders")

    const orders = await ordersCollection.find({ sessionId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      orders: orders || [],
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
