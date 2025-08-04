
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const userId = parseInt(decoded.id)

    const permissions = await prisma.pagePermission.findMany({
      where: {
        userId: userId,
      },
      select: {
        page: true,
        canView: true,
        canEdit: true
      }
    })

    return NextResponse.json({ permissions });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Invalid token" }, { status: 403 });
  }
}