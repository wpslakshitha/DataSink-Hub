import NextAuth from "next-auth";
// අලුත් තැනින් authOptions import කරන්න
import { authOptions } from "@/lib/auth"; 

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };