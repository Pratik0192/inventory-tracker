import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const sizes = await prisma.size.findMany({
      orderBy: { name: "asc" }
    });

    return NextResponse.json({ message: "Sizes fetched successfully", data: sizes });
  } catch (err: any) {
    return NextResponse.json({ message: "Fetch failed", error: err.message }, { status: 500 });
  }
}
