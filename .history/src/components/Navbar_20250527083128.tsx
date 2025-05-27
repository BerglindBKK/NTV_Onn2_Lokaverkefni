"use client"

import { usePathname } from "next/navigation";
import Link from 'next/link';


const Navbar = () => {

  const pathname = usePathname();

  const getCurrentLabel = () => {
    switch (pathname) {
      case "/":
        return "HOME";
      case "/select-dish":
        return "SELECT DISH";
      case "/select-drink":
        return "SELECT DRINK";
      case "/order-screen":
        return "ORDER SCREEN";
      case "/receipt-screen":
        return "RECEIPT SCREEN";
      default:
        return "";
    }
  };

  eturn(
    <nav className="navbar">
      <div className="nav-title">
        <img src="/assets/logo.png" />
      </div>

      {/* Desktop Nav */}
      <div className="nav-desktop">
        <Link href="/" className={pathname === "/" ? "active-link" : "nav-links"}>HOME</Link>
        <span className={pathname === "/select-dish" ? "active-link" : "nav-links"}>SELECT DISH</span>
        <span className={pathname === "/select-drink" ? "active-link" : "nav-links"}>SELECT DRINK</span>
        <span className={pathname === "/order-screen" ? "active-link" : "nav-links"}>ORDER SCREEN</span>
        <span className={pathname === "/receipt-screen" ? "active-link" : "nav-links"}>RECEIPT SCREEN</span>
      </div>

      {/* Mobile Nav */}
      <div className="nav-mobile">
        {getCurrentLabel()}
      </div>
    </nav>
  );
};

export default Navbar;