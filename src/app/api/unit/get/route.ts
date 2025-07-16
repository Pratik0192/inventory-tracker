import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const units = await prisma.unit.findMany({
            orderBy: { createdAt: "desc" }
        })

        return NextResponse.json({ success: true, data: units }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ message: "Failed to fetch units", error: err.message }, { status: 500 });
    }
}