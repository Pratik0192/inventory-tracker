import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { id, name, email, phoneNo, address } = await req.json();

    if(!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if(!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const uniqueId = name && phoneNo ? `${name}${phoneNo}` : existingUser.uniqueId;

    const updatedUser = await prisma.user.update({
      where: {id},
      data: { name, email, phoneNo, address, uniqueId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNo: true,
        address: true,
        uniqueId: true,
        role: true,
      }
    })

    return NextResponse.json({ message: "User updated", data: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ message: "Update failed", error: err.message }, { status: 500 });
  }
}