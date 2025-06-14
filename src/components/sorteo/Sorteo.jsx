import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { motion } from "framer-motion";
import CuadriculaNumeros from "./CuadriculaNumeros";
import ResumenPorServidor from './ResumenPorServidor';
import ListaGanadores from "./ListaGanadores";

export default function Sorteo() {
  const [nombre, setNombre] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [numerosRifa, setNumerosRifa] = useState([""]);
  const [fecha, setFecha] = useState("");
  const [servidor, setServidor] = useState("");
  const [pin, setPin] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [ganador, setGanador] = useState(null);
  const [ganadores, setGanadores] = useState([]); // historial de ganadores
  const [animando, setAnimando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  // Estados nuevos para confirmación de entrega
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [entregado, setEntregado] = useState(false);
  const [ganadorParaConfirmar, setGanadorParaConfirmar] = useState(null);

  const hostServer = import.meta.env.VITE_REACT_APP_SERVER_HOST;

  const servidores = [
    { nombre: "Carolina R", pin: "2985" },
    { nombre: "Alejandra B", pin: "1234" },
    { nombre: "Claudio O", pin: "5678" },
    { nombre: "Darwin G", pin: "4321" },
    { nombre: "Edgardo R", pin: "1111" },
    { nombre: "Facundo S", pin: "2222" },
    { nombre: "Gonzalo B", pin: "3333" },
    { nombre: "Leandro R", pin: "4444" },
    { nombre: "Matías N", pin: "5555" },
    { nombre: "Paula S", pin: "1411" },
    { nombre: "Verónica F", pin: "7777" },
    { nombre: "Nicolás P", pin: "8888" },
    { nombre: "Nicolás F", pin: "9999" },
    { nombre: "Pablo T", pin: "0000" },
    { nombre: "Bruno T", pin: "2468" },
    { nombre: "Martín G", pin: "2469" },
    { nombre: "Estefany D", pin: "1989" },
  ];

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const cargarParticipantes = async () => {
    setCargando(true);
    try {
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

  const validarPin = () => {
    const servidorSeleccionado = servidores.find((s) => s.nombre === servidor);
    return servidorSeleccionado && servidorSeleccionado.pin === pin;
  };

  const agregarCampoNumero = () => {
    setNumerosRifa([...numerosRifa, ""]);
  };

  const actualizarNumero = (index, value) => {
    const nuevos = [...numerosRifa];
    nuevos[index] = value;
    setNumerosRifa(nuevos);
  };

  const numerosVendidos = participantes.flatMap(p => p.numeroRifa).map(Number);

  const agregarParticipante = async () => {
    if (
      nombre.trim() &&
      whatsapp.trim() &&
      numerosRifa.some((n) => n.trim()) &&
      fecha.trim() &&
      servidor.trim() &&
      pin.trim()
    ) {
      if (!validarPin()) {
        alert("PIN incorrecto para el servidor seleccionado");
        return;
      }

      const numerosValidos = numerosRifa.map(n => n.trim()).filter(n => n);
      const duplicados = numerosValidos.filter((n) =>
        numerosVendidos.includes(Number(n))
      );

      if (duplicados.length > 0) {
        alert(`⚠️ Los siguientes números ya están vendidos: ${duplicados.join(", ")}`);
        return;
      }

      try {
        const response = await fetch(`${hostServer}/participantes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre,
            whatsapp,
            numeroRifa: numerosValidos,
            fecha,
            servidor,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setNombre("");
          setWhatsapp("");
          setNumerosRifa([""]);
          setFecha("");
          setServidor("");
          setPin("");
          cargarParticipantes();
        } else {
          console.error("Error al agregar el participante:", data.error);
          alert("Error al agregar participante");
        }
      } catch (error) {
        console.error("Error al agregar el participante:", error);
        alert("Error al agregar participante");
      }
    } else {
      alert("Complete todos los campos correctamente");
    }
  };

  // función para guardar ganador en backend
  const guardarGanador = async (ganador) => {
    try {
      const ganadorParaEnviar = {
        ...ganador,
        fecha: ganador.fecha ? ganador.fecha.slice(0, 10) : null,
        entregado: ganador.entregado || false, // agregá esto
      };

      const response = await fetch(`${hostServer}/ganadores`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ganadorParaEnviar),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error guardando ganador:", errorData);
        alert("No se pudo guardar el ganador en el servidor");
      }
    } catch (error) {
      console.error("Error guardando ganador:", error);
      alert("No se pudo guardar el ganador en el servidor");
    }
  };


  const realizarSorteo = () => {
    const numerosGanadores = ganadores.flatMap(g => 
      Array.isArray(g.numeroRifa) ? g.numeroRifa : [g.numeroRifa]
    ).map(Number);

    const participantesElegibles = participantes.filter(p => {
      const numeros = Array.isArray(p.numeroRifa) ? p.numeroRifa : [p.numeroRifa];
      return numeros.some(n => !numerosGanadores.includes(Number(n)));
    });

    if (participantesElegibles.length > 0) {
      setAnimando(true);
      setFinalizado(false);
      let iteraciones = 30;
      let intervalo = setInterval(() => {
        let elegido;
        let numeroGanador;

        do {
          elegido = participantesElegibles[Math.floor(Math.random() * participantesElegibles.length)];
          const numeros = Array.isArray(elegido.numeroRifa) ? elegido.numeroRifa : [elegido.numeroRifa];
          numeroGanador = numeros.find(n => !numerosGanadores.includes(Number(n)));
        } while (!numeroGanador);

        const ganadorFinal = {
          ...elegido,
          numeroRifa: [numeroGanador],
        };

        setGanador(ganadorFinal);
        iteraciones--;

        if (iteraciones <= 0) {
          clearInterval(intervalo);
          setAnimando(false);
          setFinalizado(true);
          setGanadorParaConfirmar(ganadorFinal);
          setMostrarConfirmacion(true);
        }
      }, 100);
    } else {
      alert("No quedan números disponibles sin haber salido ganadores.");
    }
  };

  const confirmarGanador = () => {
    const ganadorConEntrega = {...ganadorParaConfirmar, entregado};
    setGanadores(prev => [...prev, ganadorConEntrega]);
    guardarGanador(ganadorConEntrega);
    setMostrarConfirmacion(false);
    setEntregado(false);
    setGanadorParaConfirmar(null);
  };

  // Modal para confirmar entrega
  const modalConfirmacion = mostrarConfirmacion ? (
    <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content p-6 bg-white rounded shadow-lg max-w-sm w-full">
        <p className="mb-4 text-lg">¿Se entregó el premio a <strong>{ganadorParaConfirmar?.nombre}</strong>?</p>
        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={entregado} 
            onChange={() => setEntregado(!entregado)} 
            className="cursor-pointer"
          />
          Entregado
        </label>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>Cancelar</Button>
          <Button onClick={confirmarGanador}>Confirmar</Button>
        </div>
      </div>
    </div>
  ) : null;

  useEffect(() => {
    const objetivo = new Date();
    objetivo.setMonth(5); // junio (0-based)
    objetivo.setDate(28);
    objetivo.setHours(0, 0, 0, 0);

    const actualizarCuenta = () => {
      const ahora = new Date();
      const diferencia = objetivo - ahora;

      if (diferencia <= 0) {
        setTiempoRestante("¡Hoy es el sorteo!");
        return;
      }

      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((diferencia / (1000 * 60)) % 60);
      const segundos = Math.floor((diferencia / 1000) % 60);

      setTiempoRestante(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    };

    actualizarCuenta();
    const intervalo = setInterval(actualizarCuenta, 1000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto text-center bg-white">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">SORTEO</h2>
      <h2 className="text-3xl font-bold text-blue-700 mb-6">SIMPLE Y ESPIRITUAL</h2>
      {/* <ListaGanadores /> */}
      <ListaGanadores />
          {mostrarConfirmacion && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <p className="mb-4 text-lg">
            ¿Se entregó el premio a <strong>{ganadorParaConfirmar?.nombre}</strong>?
          </p>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={entregado}
              onChange={() => setEntregado(!entregado)}
            />
            Entregado
          </label>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setMostrarConfirmacion(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarGanador}>
              Confirmar
            </Button>
          </div>
        </div>
      </div>
    )}
      <h5 className="text-2xl font text-blue-500 mb-6">💰 $50 💰</h5>

      <div className="flex flex-col gap-2 mb-4">
        <Input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del comprador"
        />
        <Input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="WhatsApp del comprador"
        />

        <div className="flex flex-col gap-2 items-center">
          {numerosRifa.map((num, index) => (
            <div key={index} className="flex items-center gap-2 w-full">
              <Input
                value={num}
                onChange={(e) => actualizarNumero(index, e.target.value)}
                placeholder={`Número de Rifa  #${index + 1}`}
                className="flex-1"
              />
            </div>
          ))}

          <Button
            type="button"
            onClick={agregarCampoNumero}
            className="mt-4 bg-green-400 text-white hover:bg-green-500 px-4 py-2 rounded"
          >
            Agregar otro Número
          </Button>

          <div className="mt-4 font-semibold">
            Total a pagar: ${numerosRifa.length * 50}
          </div>
        </div>

        <label
          htmlFor="fecha"
          className="block text-left text-gray-500 text-sm mb-1"
        >
          Fecha
        </label>
        <Input
          id="fecha"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          placeholder="Fecha"
        />

        <select
          value={servidor}
          onChange={(e) => {
            setServidor(e.target.value);
            setPin("");
          }}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">Selecciona un servidor</option>
          {servidores.map((s) => (
            <option key={s.nombre} value={s.nombre}>
              {s.nombre}
            </option>
          ))}
        </select>

        {servidor && (
          <Input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Ingresa PIN del servidor"
          />
        )}

        <Button
          onClick={agregarParticipante}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
        >
          Vender Rifa
        </Button>
      </div>

      <br />
      <Button
        onClick={() => {
          if (!autorizado) {
            const user = prompt("Ingrese su nombre de usuario:");
            if (user?.trim().toLowerCase() !== "gonza") {
              alert("Acceso denegado. Solo Gonzalo B puede iniciar el sorteo.");
              return;
            }
            setAutorizado(true);
          }
          realizarSorteo();
        }}
        disabled={!botonHabilitado || animando || participantes.length < 2}
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
            <p className="text-white">
              Número de Rifa: {Array.isArray(ganador.numeroRifa) ? ganador.numeroRifa.join(", ") : ganador.numeroRifa}
            </p>
            <p className="text-white">Fecha: {formatFecha(ganador.fecha)}</p>
            <p className="text-white">Servidor: {ganador.servidor}</p>
          </CardContent>
        </Card>
      )}

      {/* 
      {ganadores.length > 0 && (
        <div className="mt-6 text-left">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">
            Ganadores anteriores
          </h3>
          <ul className="space-y-1 text-sm">
            {ganadores.map((g, idx) => (
              <li key={idx} className="bg-blue-100 p-2 rounded">
                <strong>{g.nombre}</strong> - N°:{" "}
                {Array.isArray(g.numeroRifa) ? g.numeroRifa.join(", ") : g.numeroRifa} -{" "}
                {formatFecha(g.fecha)} - Servidor: {g.servidor}
              </li>
            ))}
          </ul>
        </div>
      )}
      */}

      <h3 className="text-lg font-semibold mb-4 text-red-600">
        Cuenta regresiva al sorteo
        <br />
        <hr />
        {tiempoRestante}
      </h3>

      <p className="mt-6 text-sm text-gray-700">
        🎉 El sorteo se hará el mismo día del cumpleaños del grupo: <br />
        <strong>28 de junio</strong>.
        <br />
        🛠️ Las reuniones de servicio para formar parte de los servidores del
        cumple serán los sábados: <br />
        <strong>31 de mayo</strong> y <strong>14 de junio</strong>.
      </p>

      <CuadriculaNumeros numerosVendidos={numerosVendidos} />

      <div className="overflow-x-auto mb-6">
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
            {cargando ? (
              <tr>
                <td colSpan="5" className="text-center py-2">
                  Cargando...
                </td>
              </tr>
            ) : (
              participantes.map((p) => (
                <tr
                  key={p.id}
                  className={`${
                    finalizado && p.nombre === ganador?.nombre
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  <td className="border border-blue-300 px-1 py-0.5">{p.nombre}</td>
                  <td className="border border-blue-300 px-1 py-0.5">
                    {Array.isArray(p.numeroRifa) ? p.numeroRifa.join(", ") : p.numeroRifa}
                  </td>
                  <td className="border border-blue-300 px-1 py-0.5">{p.whatsapp}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{formatFecha(p.fecha)}</td>
                  <td className="border border-blue-300 px-1 py-0.5">{p.servidor}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ResumenPorServidor participantes={participantes} />
    </div>
  );
}
