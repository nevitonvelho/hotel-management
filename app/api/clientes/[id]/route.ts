import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; 
    const { name, email, phone } = await req.json();

    if (!id || !name || !email || !phone) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const updatedCliente = await prisma.customer.update({
      where: { id: String(id) },
      data: { name, email, phone },
    });

    return NextResponse.json(updatedCliente, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID do cliente é obrigatório" }, { status: 400 });
    }

    const clienteExiste = await prisma.customer.findUnique({ where: { id } });
    if (!clienteExiste) {
      return NextResponse.json({ error: "Cliente não encontrado" }, { status: 404 });
    }

    await prisma.customer.delete({ where: { id } });

    return NextResponse.json({ message: "Cliente deletado com sucesso" }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Erro interno ao deletar cliente" }, { status: 500 });
  }
}