import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      let { unitname } = body;

      if (!unitname) {
        return NextResponse.json({ message: "Unit name is required" }, { status: 400 });
      }

      unitname = unitname.trim().toLowerCase();

      const existing = await prisma.unit.findFirst({
        where: { unitname },
      });

      if (existing) {
        return NextResponse.json({ message: "Unit already exists" }, { status: 409 });
      }

      const newUnit = await prisma.unit.create({
        data: {unitname},
      })

      return NextResponse.json({ message: "Unit created successfully", unit: newUnit }, { status: 201 });
    } catch (err: any) {
      return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
    }
}