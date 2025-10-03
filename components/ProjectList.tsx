"use client";
import { useState } from "react";
import { Project } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProjectDialog } from "./CreateProjectDialog";
import Link from "next/link";
import { createProjectAction } from "@/app/actions";

export default function ProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects);

  const handleCreateProject = async (name: string, fields: string) => {
    const allowedFields = fields.split(',').map(f => f.trim()).filter(Boolean);
    const newProject = await createProjectAction({ name, allowedFields });
    if (newProject) {
      setProjects([newProject, ...projects]);
    }
    return !!newProject; // Return true on success
  };

  return (
    <div>
      <div className="mb-6">
        <CreateProjectDialog onCreate={handleCreateProject} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>
                  {project.allowedFields.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}