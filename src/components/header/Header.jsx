import React from "react";

function Header({ toggleMenu }) {
    return (
        <header className="header">
            <button className="menu-toggle" onClick={toggleMenu}>
                &#9776;
            </button>
            <h1 className="header-title">Grupo Simple Y Espiritual</h1>
        </header>
    );
}

export default Header;
