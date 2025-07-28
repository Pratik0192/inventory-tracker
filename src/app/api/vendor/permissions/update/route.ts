import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorId, permissions } = body;

    if(!vendorId || Array.isArray(permissions)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    await prisma.userPagePermission.deleteMany({
      where: { userId: parseInt(vendorId) }
    });

    await prisma.userPagePermission.createMany({
      data: permissions.map((perm: { page: string; canView: boolean; canEdit: boolean }) => ({
        userId: parseInt(vendorId),
        page: perm.page,
        canView: perm.canView,
        canEdit: perm.canEdit,
      })),
    })

    return NextResponse.json({ message: "Permissions updated" });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to update permissions", error: err.message }, { status: 500 });
  }
}