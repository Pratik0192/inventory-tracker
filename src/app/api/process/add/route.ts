import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const { name, shortForm, userUniqueIds, targetDays } = await req.json();

        const existingProcess = await prisma.process.findFirst({ where: {name} });
        if (existingProcess) {
            return NextResponse.json({ message: "Process with this name already exists" }, { status: 400 });
        }

        const users = await prisma.user.findMany({ 
            where: { 
                uniqueId: {
                    in: userUniqueIds
                } 
            } 
        });

        if(users.length === 0) {
            return NextResponse.json({ message: "No valid users found" }, { status: 404 });
        }

        const newProcess = await prisma.process.create({
            data: {
                name,
                shortForm,
                targetDays,
                concernedDept: {
                    connect: users.map((u) => ({ id: u.id }))
                }
            }
        })

        for (const user of users) {
            await prisma.typeOfWork.create({
                data: { 
                    userId: user.id, 
                    value: name
                }
            })
        }

        return NextResponse.json({ message: "Process created successfully", data: newProcess }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: "Creation failed", error: err.message }, { status: 500 });
    }
}