"use server";
import { authOptions } from "@/lib/auth";
import { PrismaClient, Project } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function createProjectAction({ name, allowedFields }: { name: string, allowedFields: string[] }): Promise<Project | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return null;
    }

    const project = await prisma.project.create({
        data: {
            name,
            allowedFields,
            userId: session.user.id,
        },
    });

    return project;
}