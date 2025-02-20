import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const status = url.searchParams.get("status");

    let query: any = {};

    if (type && type !== "Todos") {
      query.type = type;
    }

    const rooms = await prisma.room.findMany({
      include: {
        reservations: {
          where: {
            checkOut: { gte: new Date() },
          },
        },
      },
      where: query,
    });

    const updatedRooms = rooms.map((room) => ({
      ...room,
      isOccupied: room.reservations.length > 0,
    }));

    let filteredRooms = updatedRooms;
    if (status === "available") {
      filteredRooms = updatedRooms.filter(room => !room.isOccupied);
    } else if (status === "occupied") {
      filteredRooms = updatedRooms.filter(room => room.isOccupied);
    }

    return NextResponse.json(filteredRooms, { status: 200 });

  } catch (error) {
    console.error("Erro ao buscar quartos:", error);
    return NextResponse.json({ error: "Erro ao carregar quartos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, type, price } = body;

    if (!number || !type || !price) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const newRoom = await prisma.room.create({
      data: { number: Number(number), type, price: Number(price) },
    });

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar quarto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params; 
    const { number, type, price } = await req.json();

    if (!id || !number || !type || !price) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 });
    }

    const updatedRoom = await prisma.room.update({
      where: { id: String(id) }, 
      data: { number: Number(number), type, price: Number(price) },
    });

    return NextResponse.json(updatedRoom, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar quarto:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.room.delete({ where: { id } });
  return NextResponse.json({ message: "Quarto deletado" }, { status: 200 });
}
