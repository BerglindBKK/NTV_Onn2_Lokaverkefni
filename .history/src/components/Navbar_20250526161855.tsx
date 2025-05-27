"use client"

import { usePathname } from "next/navigation";
import Link from 'next/link';


const Navbar = () => {

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title"><img src="/assets/logo.png" /></div>
      <div>
        <Link href="/" className={pathname === "/" ? "active-link" : "nav-links"}>HOME</Link>
        <span>SELECT DISH</span>
        <span>SELECT DRINK</span>
        <Link href="" className={pathname === "/order-screen" ? "active-link" : "nav-links"}>ORDER SCREEN</Link>
        <Link href="" className={pathname === "/receipt-screen" ? "active-link" : "nav-links"}>RECEIPT SCREEN</Link>
      </div>
    </nav>
  );
};

export default Navbar;