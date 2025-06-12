import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

// This would integrate with your NestJS backend
export async function POST(request: NextRequest, { params }: { params: { reportedUserId: string } }) {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("access_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Forward to your NestJS backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/report/users/${params.reportedUserId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Report API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
