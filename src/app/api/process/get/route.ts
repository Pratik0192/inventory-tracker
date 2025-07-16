import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const processes = await prisma.process.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        concernedDept: {
          select: { id: true, name: true, phoneNo: true, email: true, role: true },
        },
      },
    });

    return NextResponse.json({ message: "Fetched successfully", data: processes });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to fetch", error: err.message }, { status: 500 });
  }
}
