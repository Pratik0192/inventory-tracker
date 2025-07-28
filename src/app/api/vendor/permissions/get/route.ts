import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uniqueId } = body;

    const user = await prisma.user.findUnique({
      where: { uniqueId },
    });

    if (!user) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    const permissions = await prisma.userPagePermission.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ data: permissions });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to fetch permissions", error: err.message }, { status: 500 });
  }
}