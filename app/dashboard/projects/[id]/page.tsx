import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ApiEndpointDisplay from "@/components/ApiEndpointDisplay";

const prisma = new PrismaClient();

async function getProjectDetails(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
        where: { id: projectId, userId },
        include: {
            submissions: {
                orderBy: { createdAt: 'desc' },
            },
        },
    });
    return project;
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/");
    }

    const project = await getProjectDetails(params.id, session.user.id);

    if (!project) {
        return <div className="text-center p-8">Project not found or you do not have permission.</div>
    }

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
            <div className="mb-6">
                {project.allowedFields.map(field => (
                    <Badge key={field} variant="secondary" className="mr-2">{field}</Badge>
                ))}
            </div>

            <ApiEndpointDisplay projectId={project.id} />
            
            <h2 className="text-2xl font-bold mt-10 mb-4">Submissions</h2>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Received At</TableHead>
                            <TableHead>Data</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {project.submissions.map(submission => (
                            <TableRow key={submission.id}>
                                <TableCell>{new Date(submission.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    <pre className="bg-gray-100 p-2 rounded-md text-sm">
                                        {JSON.stringify(submission.data, null, 2)}
                                    </pre>
                                </TableCell>
                            </TableRow>
                        ))}
                         {project.submissions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center">No submissions yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}