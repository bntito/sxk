export default function CuadriculaNumeros({ numerosVendidos = [] }) {
  const vendidosSet = new Set(numerosVendidos.map(Number));
  const cantidadVendidos = vendidosSet.size;
  const disponibles = 500 - cantidadVendidos;

  return (
    <div className="my-6">
      <div className="text-center mb-4 space-y-2">
        <div>
          <span className="inline-block bg-red-100 text-red-800 font-semibold px-4 py-2 rounded-lg shadow">
            Números vendidos: {cantidadVendidos}
          </span>
        </div>
        <div>
          <span className="inline-block bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-lg shadow">
            Números disponibles: {disponibles}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-1 max-w-full mx-auto">
        {Array.from({ length: 500 }, (_, i) => i + 1).map((num) => {
          const vendido = vendidosSet.has(num);
          return (
            <div
              key={num}
              className={`w-8 h-8 flex items-center justify-center text-xs border rounded select-none cursor-pointer ${
                vendido ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
              title={vendido ? "Vendido" : "Disponible"}
            >
              {num}
            </div>
          );
        })}
      </div>
    </div>
  );
}
