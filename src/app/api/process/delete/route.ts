import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const process = await prisma.process.findUnique({ where: { id } });
    if (!process) return NextResponse.json({ message: "Process not found" }, { status: 404 });

    const isUsed = await prisma.processInComponent.findFirst({ where: { name: process.name } });
    if (isUsed) {
      return NextResponse.json({
        message: "Cannot delete. Process is used in one or more designs.",
      }, { status: 400 });
    }

    await prisma.typeOfWork.deleteMany({ where: { value: process.name } });

    await prisma.process.delete({ where: { id } });

    return NextResponse.json({ message: "Process deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: "Deletion failed", error: err.message }, { status: 500 });
  }
}
