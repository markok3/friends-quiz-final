import { Answer, Question } from "@/app/components/types/types";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { attempt, quizId } = body;

  if (
    typeof quizId !== "string" ||
    typeof attempt !== "object" ||
    attempt === null
  ) {
    return NextResponse.json({ error: "Invalid request body" });
  }

  if (quizId === undefined) {
    return NextResponse.json({ error: "ZASO KUR E UNDEFIDED" });
  }

  // Find the quiz by its id
  const quiz = await prisma.quiz.findUnique({
    where: {
      id: quizId,
    },
  });

  // If the quiz exists, add the attempt
  if (quiz) {
    const createAttempt = await prisma.attempt.create({
      data: {
        userName: attempt.userName,
        score: attempt.score,
        quizId: quizId,
      },
    });

    const updatedQuiz = await prisma.quiz.update({
      where: {
        id: quizId,
      },
      data: {
        attempts: {
          connect: {
            id: createAttempt.id,
          },
        },
      },
      include: {
        attempts: true, // Include attempts in the response
      },
    });

    return NextResponse.json(updatedQuiz);
  } else {
    return NextResponse.json({ error: "Quiz not found" });
  }
}
