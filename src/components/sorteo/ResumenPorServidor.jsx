import React from 'react';

const ResumenPorServidor = ({ participantes }) => {
  const contarVentasPorServidor = () => {
    const conteo = {};

    participantes.forEach((p) => {
      const servidor = p.servidor;
      const cantidad = Array.isArray(p.numeroRifa) ? p.numeroRifa.length : 1;
      conteo[servidor] = (conteo[servidor] || 0) + cantidad;
    });

    return conteo;
  };

  const descargarDatos = async () => {
    try {
      const response = await fetch("https://sxh-server.onrender.com/api/datos");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "datos.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar datos:", error);
    }
  };

  const resumen = contarVentasPorServidor();
  const totalRifas = Object.values(resumen).reduce((a, b) => a + b, 0);
  const totalPesos = totalRifas * 50;

  return (
    <div className="mt-6 text-sm">
      <h3 className="text-base font-semibold mb-2">Resumen de ventas por servidor</h3>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-1 text-left">Servidor</th>
            <th className="px-2 py-1 text-left">Cantidad de rifas</th>
            <th className="px-2 py-1 text-left">Total en $</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(resumen).map(([servidor, cantidad]) => (
            <tr key={servidor}>
              <td className="border px-2 py-1">{servidor}</td>
              <td className="border px-2 py-1">{cantidad}</td>
              <td className="border px-2 py-1">${cantidad * 50}</td>
            </tr>
          ))}
          <tr className="font-bold bg-gray-100">
            <td className="border px-2 py-1">Total</td>
            <td className="border px-2 py-1">{totalRifas}</td>
            <td className="border px-2 py-1">${totalPesos}</td>
          </tr>
        </tbody>
      </table>
      <button
        onClick={descargarDatos}
        className="mt-6 mb-10 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Descargar datos
      </button>
    </div>
  );
};

export default ResumenPorServidor;
