import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { designNo, sizes, components } = body;

    if (!designNo || !Array.isArray(sizes) || !Array.isArray(components)) {
      return NextResponse.json({ message: "Missing or invalid fields" }, { status: 400 });
    }

    const newDesign = await prisma.design.create({
      data: {
        designNo,
        sizes: {
          create: sizes.map((size: string) => ({
            size,
          })),
        },
        components: {
          create: components.map((comp: any) => ({
            name: comp.name,
            totalTargetDays: comp.totalTargetDays,
            processes: {
              create: comp.processes.map((process: any) => ({
                name: process.name,
                targetDays: process.targetDays,
              })),
            },
          })),
        },
      },
      include: {
        sizes: true,
        components: {
          include: {
            processes: true,
          },
        },
      },
    });

    return NextResponse.json({ message: "Design created", data: newDesign }, { status: 201 });
  } catch (error) {
    console.error("POST /api/design/add error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}