import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { uniqueId, permissions } = body;

    if (!uniqueId || !Array.isArray(permissions)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { uniqueId },
    });

    if (!user) {
      return NextResponse.json({ message: "Vendor not found" }, { status: 404 });
    }

    await prisma.userPagePermission.deleteMany({
      where: { userId: user.id }
    });

    await prisma.userPagePermission.createMany({
      data: permissions.map((perm: { page: string; canView: boolean; canEdit: boolean }) => ({
        userId: user.id,
        page: perm.page,
        canView: perm.canView,
        canEdit: perm.canEdit,
      })),
    });

    return NextResponse.json({ message: "Permissions updated" });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to update permissions", error: err.message }, { status: 500 });
  }
}
