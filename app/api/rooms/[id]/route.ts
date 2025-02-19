import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { number, type, price } = await req.json();

    if (!id || !number || !type || !price) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: { number: Number(number), type, price: Number(price) },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar quarto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID do quarto é obrigatório" }, { status: 400 });
    }

    await prisma.room.delete({ where: { id } });

    return NextResponse.json({ message: "Quarto deletado" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar quarto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
