import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const size = await prisma.size.findUnique({ where: { id } });

    if (!size) {
      return NextResponse.json({ message: "Size not found" }, { status: 404 });
    }

    const isUsed = await prisma.designSize.findFirst({
      where: { size: size.name },
    });

    if (isUsed) {
      return NextResponse.json({
        message: "Size is currently used in some designs and cannot be deleted.",
      }, { status: 400 });
    }

    await prisma.size.delete({ where: { id } });

    return NextResponse.json({ message: "Size deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}
