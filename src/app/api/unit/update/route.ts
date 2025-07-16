import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        let { id, unitname } = body;

        if (!id || !unitname) {
            return NextResponse.json({ message: "ID and unit name are required" }, { status: 400 });
        }

        unitname = unitname.trim().toLowerCase();

        const existing = await prisma.unit.findFirst({
            where: { unitname }
        })

        if (existing && existing.id !== id) {
            return NextResponse.json({ message: "Another unit with the same name exists" }, { status: 409 });
        }

        const updated = await prisma.unit.update({
            where: { id },
            data: { unitname },
        });

        return NextResponse.json({ message: "Unit updated successfully", unit: updated }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
    }
}