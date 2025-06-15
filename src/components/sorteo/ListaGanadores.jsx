import React, { useEffect, useState } from "react";
import "./ListaGanadores.css";

const ListaGanadores = () => {
  const [ganadores, setGanadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;

  useEffect(() => {
    const fetchGanadores = async () => {
      try {
        const res = await fetch(`${hostServer}/ganadores`);
        if (!res.ok) throw new Error("No hay ganadores");
        const data = await res.json();
        setGanadores(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGanadores();
  }, [hostServer]);

  if (loading) return <p className="lg-loading">Cargando ganadores...</p>;
  if (error) return <p className="lg-error">Lista de ganadores: {error}</p>;

  return (
    <div className="lg-container">
      <h2 className="lg-title">Lista de Ganadores</h2>
      {ganadores.length === 0 ? (
        <p className="lg-no-data">No hay ganadores registrados.</p>
      ) : (
        <table className="lg-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Nº Rifa</th>
              <th>WhatsApp</th>
              <th>Servidor</th>
              <th>Entregado</th>
            </tr>
          </thead>
          <tbody>
            {ganadores.map((g) => (
              <tr key={g.id}>
                <td>{g.nombre}</td>
                <td>{g.numeroRifa}</td>
                <td>{g.whatsapp}</td>
                <td>{g.servidor}</td>
                <td>{g.entregado ? "Sí" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListaGanadores;
