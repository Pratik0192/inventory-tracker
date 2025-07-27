import { prisma } from "@/lib/prisma";
import { NextRequest,NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const designs = await prisma.design.findMany({
      include: {
        sizes: true,
        components: {
          include: {
            processes: true,
          }
        }
      }
    })

    return NextResponse.json({ data: designs }, { status: 200 });
  } catch (error) {
    console.error("GET /api/design/get error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}