import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = req.cookies.get("sessionId")?.value || "default-session"
    const itemId = params.id

    const db = await getDatabase()
    const cartCollection = db.collection("carts")

    await cartCollection.updateOne(
      { sessionId },
      {
        $pull: {
          items: {
            _id: new ObjectId(itemId),
          },
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from cart:", error)
    return NextResponse.json({ error: "Failed to remove from cart" }, { status: 500 })
  }
}
