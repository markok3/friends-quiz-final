const { PrismaClient } = require("@prisma/client");
import prisma from "@/app/libs/prismadb";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: any) {
  const id = request.nextUrl.searchParams.get("id");

  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      questions: {
        include: {
          answers: true, // Include answers for each question
        },
      },
      attempts: true, // Include attempts in the response
    },
  });

  return NextResponse.json(quiz);
}
