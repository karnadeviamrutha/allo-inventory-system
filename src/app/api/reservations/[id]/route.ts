import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;

    let reservation =
      await prisma.reservation.findUnique({
        where: {
          id: resolvedParams.id,
        },

        include: {
          inventory: {
            include: {
              product: true,
              warehouse: true,
            },
          },
        },
      });

    if (!reservation) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 }
      );
    }

    // AUTO EXPIRE LOGIC
    const now = new Date();

    const isExpired =
      reservation.status === "PENDING" &&
      new Date(reservation.expiresAt) < now;

    if (isExpired) {
      await prisma.$transaction(async (tx) => {
        await tx.inventory.update({
          where: {
            id: reservation!.inventoryId,
          },

          data: {
            reservedQuantity: {
              decrement: reservation!.quantity,
            },
          },
        });

        await tx.reservation.update({
          where: {
            id: reservation!.id,
          },

          data: {
            status: "RELEASED",
          },
        });
      });

      // REFETCH UPDATED RESERVATION
      reservation =
        await prisma.reservation.findUnique({
          where: {
            id: resolvedParams.id,
          },

          include: {
            inventory: {
              include: {
                product: true,
                warehouse: true,
              },
            },
          },
        });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reservation" },
      { status: 500 }
    );
  }
}