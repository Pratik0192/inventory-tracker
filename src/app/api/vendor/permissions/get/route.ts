import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vendorId = body.vendorId;

    if (!vendorId || isNaN(vendorId)) {
      return NextResponse.json({ message: "Invalid vendor ID" }, { status: 400 });
    }

    const permissions = await prisma.userPagePermission.findMany({
      where: { userId: parseInt(vendorId) },
      select: {
        page: true,
        canView: true,
        canEdit: true
      }
    })

    return NextResponse.json({ data: permissions });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to fetch permissions", error: err.message }, { status: 500 });
  }
}