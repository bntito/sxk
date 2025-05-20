import React from "react";
import Sorteo from "../sorteo/Sorteo";
import logoNA from "../../assets/simbolo.png";

const Home = () => {
  return (
    <div className="text-center">
      <img src={logoNA} alt="Narcóticos Anónimos" className="mx-auto mb-0 w-24" />
      <Sorteo />
    </div>
  );
};

export default Home;
