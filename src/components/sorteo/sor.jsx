// Sorteo.jsx
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";
import CuadriculaNumeros from "./CuadriculaNumeros";

export default function Sorteo() {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [numeroRifa, setNumeroRifa] = useState("");
  const [fecha, setFecha] = useState("");
  const [servidor, setServidor] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [ganador, setGanador] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [indexActual, setIndexActual] = useState(null);
  const [finalizado, setFinalizado] = useState(false);
  const [cargando, setCargando] = useState(true);

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const cargarParticipantes = async () => {
    try {
      setCargando(true);
      const response = await fetch(`${hostServer}/participantes`);
      const data = await response.json();
      setParticipantes(data);
    } catch (error) {
      console.error("Error al cargar los participantes:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const agregarParticipante = async () => {
    if (
      nombre.trim() &&
      whatsapp.trim() &&
      numeroRifa.trim() &&
      fecha.trim() &&
      servidor.trim()
    ) {
      try {
        const response = await fetch(`${hostServer}/participantes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, whatsapp, numeroRifa, fecha, servidor }),
        });
        const data = await response.json();
        if (response.ok) {
          setNombre("");
          setWhatsapp("");
          setNumeroRifa("");
          setFecha("");
          setServidor("");
          cargarParticipantes();
        } else {
          console.error("Error al agregar el participante:", data.error);
        }
      } catch (error) {
        console.error("Error al agregar el participante:", error);
      }
    }
  };

  const realizarSorteo = () => {
    if (participantes.length > 1) {
      setAnimando(true);
      setFinalizado(false);
      let iteraciones = 30;
      let intervalo = setInterval(() => {
        const elegido =
          participantes[Math.floor(Math.random() * participantes.length)];
        setGanador(elegido);
        setIndexActual(Math.floor(Math.random() * participantes.length));
        iteraciones--;
        if (iteraciones <= 0) {
          clearInterval(intervalo);
          setAnimando(false);
          setFinalizado(true);
        }
      }, 100);
    }
  };

  const numerosVendidos = participantes.map((p) => Number(p.numeroRifa));

  return (
    <div className="p-6 max-w-md mx-auto text-center bg-white">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">SORTEO</h2>
      <h2 className="text-3xl font-bold text-blue-700 mb-6">SIMPLE Y ESPIRITUAL</h2>
      <div className="flex flex-col gap-2 mb-4">
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
        />
        <Input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp"
        />
        <Input
          value={numeroRifa}
          onChange={(e) => setNumeroRifa(e.target.value)}
          placeholder="Número de Rifa"
        />
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          placeholder="Fecha"
        />
        <select
          value={servidor}
          onChange={(e) => setServidor(e.target.value)}
          className="border border-gray-300 rounded p-2"
        >
          <option value="">Selecciona un servidor</option>
          <option value="Gonzalo B">Gonzalo B</option>
          <option value="Mauricio L">Mauricio L</option>
          <option value="Paula S">Paula S</option>
          <option value="Bruno T">Bruno T</option>
        </select>
        <Button onClick={agregarParticipante} className="bg-blue-600 hover:bg-blue-700 text-white">
          Agregar Compa
        </Button>
      </div>

      <div className="overflow-x-auto mb-6">
        {cargando ? (
          <p className="text-blue-600">Cargando participantes...</p>
        ) : (
          <table className="w-full border-collapse border border-blue-300 text-sm">
            <thead>
              <tr className="bg-blue-100">
                <th className="border border-blue-300 px-1 py-0.5">Nombre</th>
                <th className="border border-blue-300 px-1 py-0.5">N° Rifa</th>
                <th className="border border-blue-300 px-1 py-0.5">WhatsApp</th>
                <th className="border border-blue-300 px-1 py-0.5">Fecha</th>
                <th className="border border-blue-300 px-1 py-0.5">Servidor</th>
              </tr>
            </thead>
            <tbody>
              {participantes.map((p) => (
                <tr
                  key={p.id}
                  className={`$ {
                    finalizado && p.nombre === ganador?.nombre ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  <td className="border border-blue-300 px-1 py-0.5">{p.nombre}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{p.numeroRifa}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{p.whatsapp}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{formatFecha(p.fecha)}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{p.servidor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Button
        onClick={realizarSorteo}
        disabled={animando || participantes.length < 2}
        className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
      >
        {animando ? "Sorteando..." : "Iniciar Sorteo"}
      </Button>

      {ganador && (
        <Card className="mt-4 p-6 bg-blue-600">
          <CardContent>
            <motion.h3
              className="text-3xl font-bold text-white"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              {animando ? "Eligiendo..." : `¡Ganador: ${ganador.nombre}!`}
            </motion.h3>
            <p className="text-white">WhatsApp: {ganador.whatsapp}</p>
            <p className="text-white">Número de Rifa: {ganador.numeroRifa}</p>
            <p className="text-white">Fecha: {formatFecha(ganador.fecha)}</p>
            <p className="text-white">Servidor: {ganador.servidor}</p>
          </CardContent>
        </Card>
      )}

      <CuadriculaNumeros numerosVendidos={numerosVendidos} />
    </div>
  );
}
