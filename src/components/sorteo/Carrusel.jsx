import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const imagenes = [
  "/items/1.png",
  "/items/2.png",
  "/items/3.png",
  "/items/4.png",
  "/items/5.png",
  "/items/6.png",
  "/items/7.png",
  "/items/8.png",
];

export default function Carrusel() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndice((prev) => (prev + 1) % imagenes.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  const anterior = () => {
    setIndice((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  const siguiente = () => {
    setIndice((prev) => (prev + 1) % imagenes.length);
  };

  return (
    <div className="relative w-full h-36 overflow-hidden rounded-xl shadow-md">
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
      </div>

      <img
        src={imagenes[indice]}
        alt={`Imagen ${indice + 1}`}
        className="w-full h-full object-cover transition-all duration-500"
      />

      <button
        onClick={anterior}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full z-10"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={siguiente}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full z-10"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
