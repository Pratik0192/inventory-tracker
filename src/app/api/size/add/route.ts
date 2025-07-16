import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeSize } from "@/utils/normalizeSize";

export async function POST(req: NextRequest) {
  try {
    const { name, noOfPieces } = await req.json();

    if (!name || !noOfPieces) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const normalizedName = normalizeSize(name);

    const existingSize = await prisma.size.findFirst({
      where: {
        name: { equals: normalizedName, mode: "insensitive" }
      },
    });

    if (existingSize) {
      return NextResponse.json({ message: "Size with this name already exists" }, { status: 400 });
    }

    const newSize = await prisma.size.create({
      data: { name: normalizedName, noOfPieces },
    });

    return NextResponse.json({ message: "Size added successfully", data: newSize }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: "Add size failed", error: err.message }, { status: 500 });
  }
}