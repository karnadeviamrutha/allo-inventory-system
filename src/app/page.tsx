"use client";

import { useEffect, useState } from "react";

type InventoryItem = {
  id: string;
  totalQuantity: number;
  reservedQuantity: number;

  product: {
    name: string;
  };

  warehouse: {
    name: string;
  };
};

export default function Home() {
  const [inventory, setInventory] = useState<
    InventoryItem[]
  >([]);

  async function fetchInventory() {
    const res = await fetch(
      "http://localhost:3000/api/inventory"
    );

    const data = await res.json();

    setInventory(data);
  }

  async function reserveItem(
    inventoryId: string
  ) {
    const res = await fetch(
      "http://localhost:3000/api/reservations",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          inventoryId,
          quantity: 1,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }

    window.location.href = `/reservation/${data.id}`;
  }

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">

      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-violet-500/10 blur-[180px] rounded-full" />

      {/* NAVBAR */}

      <div className="relative z-10 flex items-center justify-between px-8 py-6">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-xl shadow-violet-500/30">
            <span className="text-xl">⬢</span>
          </div>

          <div>
            <h1 className="text-3xl font-black leading-none">
              ALLO
            </h1>

            <p className="text-zinc-500 text-sm tracking-[0.25em] mt-1">
              INVENTORY SYSTEM
            </p>
          </div>
        </div>

        <div className="border border-zinc-800 bg-zinc-900/40 backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-3">
          <span>⬚</span>

          <span className="font-semibold">
            Dashboard
          </span>

          <div className="w-2 h-2 rounded-full bg-violet-500" />
        </div>
      </div>

      {/* HERO */}

      <div className="relative z-10 flex flex-col items-center px-6 mt-4">

        <p className="uppercase tracking-[0.35em] text-violet-400 text-sm mb-3">
          SMART INVENTORY
        </p>

        <h1 className="text-5xl md:text-6xl font-black text-center leading-tight">
          Reservation Dashboard
        </h1>

        <p className="text-zinc-500 text-lg mt-5 text-center">
          Real-time inventory • Smart reservations • Zero conflicts
        </p>

        {/* CARD */}

        <div className="w-full max-w-3xl mt-12 rounded-[28px] border border-zinc-800 bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-violet-500/5 p-8">

          {inventory.map((item) => {
            const available =
              item.totalQuantity -
              item.reservedQuantity;

            const percentage =
              (available /
                item.totalQuantity) *
              100;

            return (
              <div key={item.id}>

                {/* HEADER */}

                <div className="flex items-start justify-between">

                  <div>
                    <h2 className="text-5xl font-black">
                      {item.product.name}
                    </h2>

                    <p className="text-zinc-400 text-lg mt-3 flex items-center gap-2">
                      <span className="text-violet-400">
                        📍
                      </span>

                      {item.warehouse.name}
                    </p>
                  </div>

                  <div className="bg-green-500/15 border border-green-500/30 px-5 py-2 rounded-2xl text-green-400 font-bold">
                    ● ACTIVE
                  </div>
                </div>

                {/* STOCK */}

                <div className="mt-10">

                  <div className="flex items-center justify-between mb-3">

                    <p className="text-zinc-400">
                      Available Stock
                    </p>

                    <p className="text-lg">
                      <span className="text-green-400 font-bold">
                        {available}
                      </span>

                      <span className="text-zinc-500">
                        {" "}
                        / {item.totalQuantity} units
                      </span>
                    </p>
                  </div>

                  <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* STATS */}

                <div className="grid grid-cols-3 gap-4 mt-8">

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">

                    <p className="text-zinc-500 mb-3">
                      Total Stock
                    </p>

                    <h3 className="text-4xl font-black">
                      {item.totalQuantity}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">

                    <p className="text-zinc-500 mb-3">
                      Reserved
                    </p>

                    <h3 className="text-4xl font-black text-yellow-400">
                      {item.reservedQuantity}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">

                    <p className="text-zinc-500 mb-3">
                      Available
                    </p>

                    <h3 className="text-4xl font-black text-green-400">
                      {available}
                    </h3>
                  </div>
                </div>

                {/* BUTTON */}

                <button
                  onClick={() =>
                    reserveItem(item.id)
                  }
                  className="w-full mt-8 rounded-2xl bg-gradient-to-r from-violet-500 to-blue-500 py-4 text-xl font-bold hover:scale-[1.01] transition-all duration-300 shadow-2xl shadow-violet-500/20"
                >
                   Reserve 1 Unit
                </button>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}

        <div className="flex items-center gap-8 text-zinc-500 mt-10 mb-8">
          <span>🛡 Secure</span>
          <span>⚡ Real-time</span>
          <span>✔ Reliable</span>
        </div>
      </div>
    </div>
  );
}