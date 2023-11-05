import { Answer, Question } from "@/app/components/types/types";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, creatorName, questions, accessId } = body;

  const createdQuiz = await prisma.quiz.create({
    data: {
      name,
      creatorName,
      questions: {
        create: questions.map((question: Question) => ({
          question: question.question,
          borderColor: question.borderColor,
          answers: {
            create: question.answers.map((answer: Answer) => ({
              text: answer.text,
              isCorrect: answer.isCorrect,
            })),
          },
        })),
      },
      attempts: {
        create: [],
      },
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  });
  return NextResponse.json(createdQuiz);
}
