import React from "react";
import Sorteo from "../sorteo/Sorteo";
import logoNA from "../../assets/simbolo.png";

const Home = () => {
  return (
    <div className="text-center">
      <img src={logoNA} alt="Narcóticos Anónimos" className="mx-auto mb-4 w-32" />
      <Sorteo />
    </div>
  );
};

export default Home;
