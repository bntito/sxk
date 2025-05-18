import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../header/Header"; 

function MenuItem({ item, onClick }) {
    return (
        <div className="menu-item" onClick={onClick}>
            <Link to={item.route}>{item.title}</Link>
        </div>
    );
}

function Menu() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const menuItems = [
        { title: "Inicio", route: "/" }
    ];

    return (
        <div className="menu-container">
            <Header toggleMenu={toggleMenu} />
            <nav className={`menu ${isMenuOpen ? "open" : ""}`}>
                {menuItems.map((item) => (
                    <MenuItem key={item.title} item={item} onClick={closeMenu} />
                ))}
            </nav>
        </div>
    );
}

export default Menu;
