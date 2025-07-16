import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, Quant } = await req.json();

        if (!name || !Quant) {
            return NextResponse.json({ message: "Name and Quant are required" }, { status: 400 });
        }

        const existing = await prisma.component.findFirst({
            where: {
                name: { equals: name, mode: 'insensitive' }
            }
        })

        if (existing) {
            return NextResponse.json({ message: "Component with this name already exists." }, { status: 400 });
        }

        const uniqueId = `${name}${Quant}`;

        const newComponent = await prisma.component.create({
            data: {name, Quant, uniqueId},
        })

        return NextResponse.json({
            message: "Component added successfully",
            data: newComponent,
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
    }
}