import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    const deletedUser = await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted", data: { id: deletedUser.id } });
  } catch (err: any) {
    return NextResponse.json({ message: "Delete failed", error: err.message }, { status: 500 });
  }
}