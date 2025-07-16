import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, shortForm, userPhones, targetDays } = await req.json();

    if (!id) return NextResponse.json({ message: "Process ID is required" }, { status: 400 });

    const process = await prisma.process.findUnique({ where: { id } });
    if (!process) return NextResponse.json({ message: "Process not found" }, { status: 404 });

    const users = await prisma.user.findMany({ where: { phoneNo: { in: userPhones } } });
    if (users.length === 0) return NextResponse.json({ message: "No valid users found" }, { status: 404 });

    // Remove old typeOfWork
    await prisma.typeOfWork.deleteMany({ where: { value: process.name } });

    // Add new typeOfWork entries
    for (const user of users) {
      await prisma.typeOfWork.create({
        data: { userId: user.id, value: name },
      });
    }

    const updatedProcess = await prisma.process.update({
      where: { id },
      data: {
        name,
        shortForm,
        targetDays,
        concernedDept: {
          set: [], // Clear existing
          connect: users.map((u) => ({ id: u.id })),
        },
      },
    });

    return NextResponse.json({ message: "Process updated", data: updatedProcess });
  } catch (err: any) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}
