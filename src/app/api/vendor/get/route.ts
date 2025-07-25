import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const vendors = await prisma.user.findMany({
      where: { role: "VENDOR" },
      select:{
        id: true,
        name: true,
        typeOfWork: true,
        phoneNo: true,
        email: true,
        address: true,
        uniqueId: true,
        role: true,
        status: true,
      }
    })

    return NextResponse.json({ data: vendors });
  } catch (err: any) {
    return NextResponse.json({ message: "Failed to fetch users", error: err.message }, { status: 500 }); 
  }
}