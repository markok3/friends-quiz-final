import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";

export async function DELETE(request: any) {
  const id = request.nextUrl.searchParams.get("id");

  if (typeof id !== "string") {
    throw new Error("Invalid ID");
  }

  const quiz = await prisma.quiz.delete({
    where: { id },
  });

  return NextResponse.json(quiz);
}
