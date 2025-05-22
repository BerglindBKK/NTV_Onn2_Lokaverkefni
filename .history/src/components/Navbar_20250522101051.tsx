"use client"

import { usePathname } from "next/navigation";
import Link from 'next/link';


const Navbar = () => {

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title"><img src="/assets/logo.png" /></div>
      <div className="nav-links">
        <Link href="/" className={pathname === "/" ? "active-link" : ""}>HOME</Link>
        <Link href="/" className={pathname === "/select-dish" ? "active-link" : ""}>SELECT DISH</Link>
        <Link href="/" className={pathname === "/select-drink" ? "active-link" : ""}>SELECT DRINK</Link>
        <Link href="/" className={pathname === "/order-screen" ? "active-link" : ""}>ORDER SCREEN</Link>
        <Link href="/" className={pathname === "/receipt-screen" ? "active-link" : ""}>RECEIPT SCREEN</Link>
      </div>
    </nav>
  );
};

export default Navbar;