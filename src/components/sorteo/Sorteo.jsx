import { useState, useEffect } from "react";
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent } from '../../components/ui/card';
import { motion } from "framer-motion";

export default function Sorteo() {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [numeroRifa, setNumeroRifa] = useState("");
  const [fecha, setFecha] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [ganador, setGanador] = useState(null);
  const [animando, setAnimando] = useState(false);
  const [indexActual, setIndexActual] = useState(null);
  const [finalizado, setFinalizado] = useState(false);

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toISOString().split('T')[0];  // Esto devuelve la fecha en formato "YYYY-MM-DD"
  };

  const cargarParticipantes = async () => {
    try {
      const response = await fetch("http://localhost:5000/participantes");
      const data = await response.json();
      setParticipantes(data);
    } catch (error) {
      console.error("Error al cargar los participantes:", error);
    }
  };

  useEffect(() => {
    cargarParticipantes();
  }, []);

  const agregarParticipante = async () => {
    if (nombre.trim() && whatsapp.trim() && numeroRifa.trim() && fecha.trim()) {
      try {
        const response = await fetch("http://localhost:5000/participantes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, whatsapp, numeroRifa, fecha })
        });
        const data = await response.json();
        if (response.ok) {
          setNombre("");
          setWhatsapp("");
          setNumeroRifa("");
          setFecha("");
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
        const elegido = participantes[Math.floor(Math.random() * participantes.length)];
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

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Sorteo de Compas</h2>
      <div className="flex flex-col gap-2 mb-4">
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
        <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" />
        <Input value={numeroRifa} onChange={(e) => setNumeroRifa(e.target.value)} placeholder="Número de Rifa" />
        <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} placeholder="Fecha" />
        <Button onClick={agregarParticipante}>Agregar Compa</Button>
      </div>
      <ul className="mb-4">
        {participantes.map((p, i) => (
          <motion.li key={p.id} className={`text-lg py-2 px-4 my-1 rounded-md ${finalizado && p.nombre === ganador?.nombre ? "bg-green-500 text-white" : "bg-gray-100"}`}>
            {p.nombre} - {p.whatsapp} - #{p.numeroRifa} - {formatFecha(p.fecha)}
          </motion.li>
        ))}
      </ul>
      <Button onClick={realizarSorteo} disabled={animando || participantes.length < 2} className="w-full mb-4">
        {animando ? "Sorteando..." : "Iniciar Sorteo"}
      </Button>
      {ganador && (
        <Card className="mt-4 p-6 bg-green-500">
          <CardContent>
            <motion.h3 className="text-3xl font-bold text-white" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.5 }}>
              {animando ? "Eligiendo..." : `¡Ganador: ${ganador.nombre}!`}
            </motion.h3>
            <p className="text-white">WhatsApp: {ganador.whatsapp}</p>
            <p className="text-white">Número de Rifa: {ganador.numeroRifa}</p>
            <p className="text-white">Fecha: {formatFecha(ganador.fecha)}</p>  {/* Aquí también se usa la función */}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
