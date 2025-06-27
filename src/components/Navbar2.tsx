import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "../styles/Navbar.css";
import { Link } from "react-router-dom";
const NavbarComponent: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 80) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 py-5 min-h-[120px] ${
        scrolled ? "bg-[#160935]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between relative">
        {/* LOGO */}
        <div className="flex-shrink-0">
          <a href="#" className="flex items-center">
            <img
              src="rockstargames.svg"
              alt="Rockstar Logo"
              className="h-[90px]"
            />
          </a>
        </div>

        {/* MENÚ CENTRADO (ESCRITORIO) */}
        <ul className="hidden lg:flex items-center justify-center space-x-36 absolute left-1/2 -translate-x-1/2">
          <li>
            <Link
              to="/"
              className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
            >
              {t("nav.home")}
            </Link>
          </li>
          <li>
            <Link
              to="/blogs"
              className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
            >
              {t("nav.gta6")}
            </Link>
          </li>
          <li>
            <Link
              to="videojuegos"
              className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
            >
              {t("nav.games")}
            </Link>
          </li>
        </ul>

        {/* IDIOMA + REDES A LA DERECHA (ESCRITORIO) */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Botón idioma */}
          <button
            onClick={toggleLanguage}
            className="flex items-center text-white text-sm"
          >
            <img
              src={
                i18n.language === "es"
                  ? "https://flagcdn.com/mx.svg"
                  : "https://flagcdn.com/us.svg"
              }
              alt={i18n.language.toUpperCase()}
              className="w-5 h-auto mr-2"
            />
            {i18n.language === "es" ? "ES" : "EN"}
          </button>

          {/* Redes sociales */}
          <ul className="flex space-x-2">
            <li>
              <a
                href="https://www.facebook.com/share/19oREA4ava/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 border-2 border-[#E5E3D4] rounded-full flex items-center justify-center">
                  <FaFacebookF className="w-5 h-5 invert" />
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/soltech_mx/profilecard/?igsh=MXNjODhlaDcycWZhcw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="w-10 h-10 border-2 border-[#E5E3D4] rounded-full flex items-center justify-center">
                  <FaInstagram className="w-5 h-5 invert" />
                </div>
              </a>
            </li>
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <div className="w-10 h-10 border-2 border-[#E5E3D4] rounded-full flex items-center justify-center">
                  <FaXTwitter className="w-5 h-5 invert" />
                </div>
              </a>
            </li>
          </ul>
        </div>

        {/* BOTÓN HAMBURGUESA (MÓVIL) */}
        <button
          className="lg:hidden text-white text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* MENÚ MÓVIL (visible solo cuando menuOpen es true) */}
      {menuOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 w-full h-[300px] bg-[#160935] text-[#E5E3D4] z-[999] overflow-y-auto" // ¡Z-index ajustado a 999!
        >
          {/* BOTÓN DE CERRADO DEL MENÚ MÓVIL */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-[#E5E3D4] text-3xl font-bold"
          >
            &times; {/* Símbolo 'X' */}
          </button>

          {/* Contenido del menú - Ajustado con padding para desplazarlo debajo del logo/hamburguesa */}
          <ul className="flex flex-col items-center gap-4 pt-[80px] pb-8">
            <li>
              <Link
                to="/"
                className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
              >
                {t("nav.gta6")}
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className="text-white font-semibold text-m hover:text-white transition-colors duration-200"
              >
                {t("nav.games")}
              </Link>
            </li>
          </ul>

          <div className="mt-4 flex justify-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="flex items-center text-[#E5E3D4] text-sm transition-transform duration-300 hover:scale-110"
            >
              <img
                src={
                  i18n.language === "es"
                    ? "https://flagcdn.com/mx.svg"
                    : "https://flagcdn.com/us.svg"
                }
                alt={i18n.language.toUpperCase()}
                className="w-5 h-auto mr-2 transition-transform duration-300 hover:rotate-6"
              />
              {i18n.language === "es" ? "ES" : "EN"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;
