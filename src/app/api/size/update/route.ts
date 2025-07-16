import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSize } from "@/utils/normalizeSize";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, noOfPieces } = await req.json();

    if (!id || !name || !noOfPieces) {
      return NextResponse.json({ message: "ID, name, and noOfPieces are required" }, { status: 400 });
    }

    const isUsed = await prisma.designSize.findFirst({
      where: { size: name },
    });

    if (isUsed) {
      return NextResponse.json({
        message: "Size is currently used in some designs and cannot be updated.",
      }, { status: 400 });
    }

    const normalizedName = normalizeSize(name);

    const existingSize = await prisma.size.findFirst({
      where: {
        id: { not: id },
        name: { equals: normalizedName, mode: "insensitive" }
      }
    });

    if (existingSize) {
      return NextResponse.json({ message: "Another size with this name already exists" }, { status: 400 });
    }

    const updatedSize = await prisma.size.update({
      where: { id },
      data: { name: normalizedName, noOfPieces }
    });

    return NextResponse.json({ message: "Size updated successfully", data: updatedSize });
  } catch (err: any) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}
