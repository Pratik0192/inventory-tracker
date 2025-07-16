import { prisma } from "@/lib/prisma";

export async function getUsersByPhones(userPhones: string[]) {
    return await prisma.user.findMany({
        where: {phoneNo: { in: userPhones }}
    })
}