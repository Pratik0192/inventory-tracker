

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // const vendors = await prisma.user.findMany({
    //   where: {
    //     role: "VENDOR",
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     phoneNo: true,
    //     email: true,
    //     permissions: true
    //   }
    // })

    const vendors = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phoneNo: true,
        email: true,
        permissions: true
      }
    })

    return NextResponse.json({ success: true, vendors })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, message: "Failed to fetch permissions" }, { status: 500 });
  }
}