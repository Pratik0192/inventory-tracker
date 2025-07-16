import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt"

export async function POST(req: NextRequest) {
	try {
		const { name, password, phoneNo, role } = await req.json();

		const existingUser = await prisma.user.findUnique({ where: { phoneNo } });
    if (existingUser) {
      return NextResponse.json({ message: "Phone number already registered." }, { status: 400 });
    }

		const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role?.toUpperCase() || "VENDOR";

		const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        phoneNo,
        role: assignedRole,
        uniqueId: `${name}${phoneNo}`,
      },
    });

		return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
	} catch (error) {
		
	}
}