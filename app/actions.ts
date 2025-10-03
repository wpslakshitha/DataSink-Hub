"use server";
import { PrismaClient, Project } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function createProjectAction({ name, allowedFields }: { name: string, allowedFields: string[] }): Promise<Project | null> {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return null;
    }

    const project = await prisma.project.create({
        data: {
            name,
            allowedFields,
            userId: session.user.email,
        },
    });

    return project;
}