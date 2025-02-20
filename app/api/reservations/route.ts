import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: { room: true, customer: true }, 
    });
    return NextResponse.json(reservations, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    return NextResponse.json({ error: "Erro ao carregar reservas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { checkIn, checkOut, roomId, customerId, guests } = await req.json();

    if (!checkIn || !checkOut || !roomId || !customerId || !guests) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    if (guests.length > 3) {
      return NextResponse.json({ error: "O limite é de 3 hóspedes por quarto." }, { status: 400 });
    }

    const roomExists = await prisma.room.findUnique({ where: { id: String(roomId) } });
    const customerExists = await prisma.customer.findUnique({ where: { id: String(customerId) } });

    if (!roomExists) return NextResponse.json({ error: "Quarto não encontrado" }, { status: 404 });
    if (!customerExists) return NextResponse.json({ error: "Cliente pagante não encontrado" }, { status: 404 });

    const newReservation = await prisma.reservation.create({
      data: {
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        roomId: String(roomId),
        customerId: String(customerId),
        guests,
      },
    });

    return NextResponse.json(newReservation, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
