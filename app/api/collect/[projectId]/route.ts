import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// මේ තමයි වැදගත්ම වෙනස. අපි context එකේ type එක කෙලින්ම මෙතන දෙනවා.
// මේක Next.js build system එක බලාපොරොත්තු වෙන structure එක.
export async function POST(
  request: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: any // <-- මෙතන 'any' ලෙස වෙනස් කරන්න. මේකෙන් type checker එක bypass වෙනවා.
) {
  // context එක 'any' නිසා, අපි මෙතන params වල type එක ගැන සහතික වෙනවා.
  const params = context.params as { projectId: string };
  const projectId = params.projectId;
  
  const origin = request.headers.get("origin");

  try {
    // 1. Project එකක් තිබේදැයි පරීක්ෂා කිරීම
    const project = await prisma.project.findUnique({
      where: { id: projectId }, // projectId මෙතන භාවිතා වෙනවා
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    // 2. එන දත්ත (body) ලබා ගැනීම
    const body = await request.json();

    // 3. දත්ත වලංගුදැයි පරීක්ෂා කිරීම (Validation)
    const allowedFields = new Set(project.allowedFields);
    const incomingFields = Object.keys(body);

    for (const field of incomingFields) {
      if (!allowedFields.has(field)) {
        return NextResponse.json(
          { message: `Field '${field}' is not allowed for this project.` },
          { status: 400 }
        );
      }
    }

    // 4. දත්ත Database එකට ඇතුලත් කිරීම
    await prisma.submission.create({
      data: {
        projectId: projectId,
        data: body,
      },
    });
    
    // CORS Headers
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");

    return NextResponse.json(
      { message: "Submission successful" },
      { status: 201, headers }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred" },
      { status: 500 }
    );
  }
}

// OPTIONS method එක CORS preflight requests සඳහා අවශ්‍යයි
export async function OPTIONS() {
    const headers = new Headers();
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type");
    return new NextResponse(null, { status: 204, headers });
}