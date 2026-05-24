import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { inventoryId, quantity } = body;

    let reservation;

    await prisma.$transaction(async (tx) => {

      // FIND INVENTORY

      const inventory = await tx.inventory.findUnique({
        where: {
          id: inventoryId,
        },
      });

      if (!inventory) {
        throw new Error("Inventory not found");
      }

      // CHECK AVAILABLE STOCK

      const available =
        inventory.totalQuantity -
        inventory.reservedQuantity;

      if (available < quantity) {
        throw new Error("OUT_OF_STOCK");
      }

      // INCREASE RESERVED STOCK

      await tx.inventory.update({
        where: {
          id: inventoryId,
        },

        data: {
          reservedQuantity: {
            increment: quantity,
          },
        },
      });

      // CREATE RESERVATION

      reservation = await tx.reservation.create({
        data: {
          inventoryId,
          quantity,

          status: "PENDING",

          expiresAt: new Date(
            Date.now() + 15 * 60 * 1000
          ),
        },
      });
    });

    return NextResponse.json(reservation);

  } catch (error: any) {

    // OUT OF STOCK

    if (error.message === "OUT_OF_STOCK") {
      return NextResponse.json(
        {
          error: "Not enough stock available",
        },
        {
          status: 409,
        }
      );
    }

    // GENERAL ERROR

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}