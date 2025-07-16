import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const unitToDelete = await prisma.unit.findUnique({
      where: { id },
    });

    if (!unitToDelete) {
      return NextResponse.json({ message: "Unit not found" }, { status: 404 });
    }

    const usedInComponent = await prisma.component.findFirst({
      where: {
        Quant: unitToDelete.unitname,
      },
    });

    if (usedInComponent) {
      return NextResponse.json({ message: "Cannot delete, already in use." }, { status: 400 });
    }

    await prisma.unit.delete({ where: { id } });

    return NextResponse.json({ message: "Unit deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}
