"use client"

import { usePathname } from "next/navigation";
import Link from 'next/link';


// Navigation bar. Highlights the page the user is currently on. Only Home is link
const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title">
        <Link href="/"><img src="/assets/logo.png" /></Link>
      </div>
      <div>
        <Link href="/" className={pathname === "/" ? "active-link" : "nav-links"}>HOME</Link>
        <span className={pathname === "/select-dish" ? "active-link" : "nav-links"}>SELECT DISH</span>
        <span className={pathname === "/select-drink" ? "active-link" : "nav-links"}>SELECT DRINK</span>
        <span className={pathname === "/order-screen" ? "active-link" : "nav-links"}>ORDER SCREEN</span>
        <span className={pathname === "/receipt-screen" ? "active-link" : "nav-links"}>RECEIPT SCREEN</span>
      </div>
    </nav>
  );
};

export default Navbar;