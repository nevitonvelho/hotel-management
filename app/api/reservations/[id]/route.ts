import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 🔹 Atualizar uma reserva
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { checkIn, checkOut, roomId, customerId, guests } = await req.json();

    if (!id || !checkIn || !checkOut || !roomId || !customerId || !guests) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    // Verificando se a reserva existe
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: String(id) },
    });

    if (!existingReservation) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    // Atualizando a reserva
    const updatedReservation = await prisma.reservation.update({
      where: { id: String(id) },
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        roomId: String(roomId),
        customerId: String(customerId),
        guests: Number(guests),
      },
    });

    return NextResponse.json(updatedReservation, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// 🔹 Deletar uma reserva
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID da reserva é obrigatório" }, { status: 400 });
    }

    // Verificando se a reserva existe antes de deletar
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: String(id) },
    });

    if (!existingReservation) {
      return NextResponse.json({ error: "Reserva não encontrada" }, { status: 404 });
    }

    await prisma.reservation.delete({ where: { id: String(id) } });

    return NextResponse.json({ message: "Reserva deletada" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar reserva:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
