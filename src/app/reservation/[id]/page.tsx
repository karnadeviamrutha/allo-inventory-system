"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReservationPage() {
  const params = useParams();

  const [reservation, setReservation] =
    useState<any>(null);

  const [timeLeft, setTimeLeft] =
    useState(0);

  useEffect(() => {
    document.title =
      "Reservation Checkout";
  }, []);

  async function fetchReservation() {
    const res = await fetch(
      `http://localhost:3000/api/reservations/${params.id}`
    );

    const data = await res.json();

    setReservation(data);

    const expires =
      new Date(data.expiresAt).getTime();

    const now = Date.now();

    setTimeLeft(
      Math.floor((expires - now) / 1000)
    );
  }

  async function confirmReservation() {
    await fetch(
      `http://localhost:3000/api/reservations/${params.id}/confirm`,
      {
        method: "POST",
      }
    );

    fetchReservation();
  }

  async function cancelReservation() {
    await fetch(
      `http://localhost:3000/api/reservations/${params.id}/release`,
      {
        method: "POST",
      }
    );

    fetchReservation();
  }

  useEffect(() => {
    fetchReservation();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev: number) =>
        prev > 0 ? prev - 1 : 0
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const minutes = Math.floor(
    timeLeft / 60
  );

  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      {/* GLOW */}

      <div className="absolute w-[500px] h-[500px] bg-violet-500/10 blur-[140px] rounded-full" />

      {/* CARD */}

      <div className="relative w-full max-w-2xl rounded-[32px] border border-white/10 bg-gradient-to-br from-zinc-900 via-[#111114] to-black backdrop-blur-2xl shadow-[0_0_80px_rgba(139,92,246,0.12)] p-8 md:p-10">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-violet-400 uppercase tracking-[0.3em] text-xs mb-3">
            Reservation Checkout
          </p>

          <h1 className="text-5xl font-black tracking-tight">
            {
              reservation.inventory.product
                .name
            }
          </h1>

          <p className="text-zinc-400 mt-3 flex items-center gap-2 text-lg">
            <span className="text-violet-400">
              📍
            </span>

            {
              reservation.inventory
                .warehouse.name
            }
          </p>
        </div>

        {/* GRID */}

        <div className="grid grid-cols-2 gap-5">

          {/* RESERVED */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-zinc-500 text-sm mb-3">
              Reserved Units
            </p>

            <h2 className="text-4xl font-black">
              {reservation.quantity}
            </h2>
          </div>

          {/* STATUS */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

            <p className="text-zinc-500 text-sm mb-3">
              Status
            </p>

            <h2
              className={`
                text-3xl font-black
                ${
                  reservation.status ===
                  "CONFIRMED"
                    ? "text-emerald-400"
                    : reservation.status ===
                      "RELEASED"
                    ? "text-red-400"
                    : "text-violet-400"
                }
              `}
            >
              {reservation.status}
            </h2>
          </div>
        </div>

        {/* TIMER */}

        <div className="mt-10">

          <p className="text-zinc-500 mb-4 text-lg">
            Reservation expires in
          </p>

          <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            {minutes}m {seconds}s
          </h1>
        </div>

        {/* BUTTONS */}

        <div className="grid grid-cols-2 gap-5 mt-10">

          <button
            onClick={
              confirmReservation
            }
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-5 text-lg font-bold hover:scale-[1.02] transition-all duration-300 shadow-xl shadow-violet-500/20"
          >
            Confirm
          </button>

          <button
            onClick={
              cancelReservation
            }
            className="rounded-2xl border border-red-500/30 bg-red-500/10 py-5 text-lg font-bold text-red-400 hover:bg-red-500/20 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}