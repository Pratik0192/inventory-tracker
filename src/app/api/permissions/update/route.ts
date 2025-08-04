

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, page, canView, canEdit } = body;

    if(!userId || !page) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const updatedPermission = await prisma.pagePermission.upsert({
      where: {
        userId_page: { userId, page },
      },
      update: {
        canView,
        canEdit
      },
      create: {
        userId,
        page,
        canView,
        canEdit,
      }
    })

    return NextResponse.json({ success: true, permission: updatedPermission });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to update permission" }, { status: 500 });
  }
}