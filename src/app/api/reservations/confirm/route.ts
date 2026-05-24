import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const reservation = await prisma.reservation.findUnique({
      where: {
        id: body.reservationId,
      },
    });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: {
        id: reservation.id,
      },
      data: {
        status: "CONFIRMED",
      },
    });

    return NextResponse.json(updatedReservation);
  } catch (error) {
    return NextResponse.json(
      { error: "Confirmation failed" },
      { status: 500 }
    );
  }
}