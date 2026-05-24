import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const warehouses = await prisma.warehouse.findMany();

  return NextResponse.json(warehouses);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const warehouse = await prisma.warehouse.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json(warehouse);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 }
    );
  }
}