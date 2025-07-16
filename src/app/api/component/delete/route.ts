import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const component = await prisma.component.findUnique({ where: { id } });

    if (!component) {
      return NextResponse.json({ message: "Component not found." }, { status: 404 });
    }

    const usedInDesign = await prisma.componentInDesign.findFirst({
      where: { name: component.name },
    });

    if (usedInDesign) {
      return NextResponse.json({
        message: "Cannot delete this component as it is used in a design.",
      }, { status: 400 });
    }

    await prisma.component.delete({ where: { id } });

    return NextResponse.json({ message: "Component deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}
