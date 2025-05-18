// CuadriculaNumeros.jsx
import React from "react";

export default function CuadriculaNumeros({ numerosVendidos = [] }) {
  const vendidosSet = new Set(numerosVendidos.map(Number));

  return (
    <div className="grid grid-cols-10 gap-1 max-w-md mx-auto my-6">
      {Array.from({ length: 300 }, (_, i) => i + 1).map((num) => {
        const vendido = vendidosSet.has(num);
        return (
          <div
            key={num}
            className={`p-2 border rounded text-center select-none cursor-pointer ${
              vendido ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
            title={vendido ? "Vendido" : "Disponible"}
          >
            {num}
          </div>
        );
      })}
    </div>
  );
}
