import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, Quant } = await req.json();

    if (!id || !name || !Quant) {
      return NextResponse.json({ message: "ID, name, and Quant are required" }, { status: 400 });
    }

    const existing = await prisma.component.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (existing) {
      return NextResponse.json({ message: "Another component with this name already exists." }, { status: 400 });
    }

    const component = await prisma.component.findUnique({ where: { id } });

    if (!component) {
      return NextResponse.json({ message: "Component not found." }, { status: 404 });
    }

    const usedInDesign = await prisma.componentInDesign.findFirst({
      where: { name: component.name }
    })

    if (usedInDesign) {
      return NextResponse.json({
        message: "Cannot update this component as it is used in a design.",
      }, { status: 400 });
    }

    const uniqueId = `${name}${Quant}`;

    const updatedComponent = await prisma.component.update({
      where: { id },
      data: { name, Quant, uniqueId },
    });

    return NextResponse.json({
      message: "Component updated successfully",
      data: updatedComponent,
    });
  } catch (err: any) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}
