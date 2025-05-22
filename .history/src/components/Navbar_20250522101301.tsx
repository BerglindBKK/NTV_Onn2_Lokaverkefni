"use client"

import { usePathname } from "next/navigation";
import Link from 'next/link';


const Navbar = () => {

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title"><img src="/assets/logo.png" /></div>
      <div className="nav-links">
        <Link href="/" className={pathname === "/" ? "active-link" : "a"}>HOME</Link>
        <Link href="/" className={pathname === "/select-dish" ? "active-link" : "a"}>SELECT DISH</Link>
        <Link href="/" className={pathname === "/select-drink" ? "active-link" : "a"}>SELECT DRINK</Link>
        <Link href="/" className={pathname === "/order-screen" ? "active-link" : "a"}>ORDER SCREEN</Link>
        <Link href="/" className={pathname === "/receipt-screen" ? "active-link" : "a"}>RECEIPT SCREEN</Link>
      </div>
    </nav>
  );
};

export default Navbar;