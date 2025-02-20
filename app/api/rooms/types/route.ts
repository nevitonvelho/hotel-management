import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {

    const rooms = await prisma.room.findMany({
      select: { type: true },
    });


    const uniqueTypes = [...new Set(rooms.map(room => room.type).filter(Boolean))];


    return NextResponse.json(uniqueTypes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao carregar tipos de quarto" }, { status: 500 });
  }
}
