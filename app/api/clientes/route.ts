import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const customers = await prisma.customer.findMany();
  return NextResponse.json(customers, { status: 200 });
}

export async function POST(req: Request) {
  const { name, email, phone } = await req.json();
  const newCustomer = await prisma.customer.create({
    data: { name, email, phone },
  });
  return NextResponse.json(newCustomer, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, name, email, phone } = await req.json();
  const updatedCustomer = await prisma.customer.update({
    where: { id },
    data: { name, email, phone },
  });
  return NextResponse.json(updatedCustomer, { status: 200 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ message: "Cliente deletado" }, { status: 200 });
}
