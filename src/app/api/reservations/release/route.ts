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

    if (reservation.status === "RELEASED") {
      return NextResponse.json(
        { error: "Reservation already released" },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.inventory.update({
        where: {
          id: reservation.inventoryId,
        },
        data: {
          reservedQuantity: {
            decrement: reservation.quantity,
          },
        },
      });

      await tx.reservation.update({
        where: {
          id: reservation.id,
        },
        data: {
          status: "RELEASED",
        },
      });
    });

    return NextResponse.json({
      message: "Reservation released successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Release failed" },
      { status: 500 }
    );
  }
}