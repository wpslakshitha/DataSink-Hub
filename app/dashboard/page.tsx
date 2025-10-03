import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import ProjectList from "@/components/ProjectList";

const prisma = new PrismaClient();

async function getProjects(userId: string) {
    const projects = await prisma.project.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
    return projects;
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/");
  }

  const projects = await getProjects(session.user.email);

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-muted-foreground">Manage your data collection projects.</p>
        </div>
        <p>Welcome, {session.user?.name || session.user?.email}</p>
      </div>
      <ProjectList initialProjects={projects} />
    </div>
  );
}