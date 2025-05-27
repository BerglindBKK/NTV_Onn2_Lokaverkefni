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
        <p>SELECT DISH</p>
        <p>SELECT DRINK</p>
        <p>SELECT DISH</p>
        <p>SELECT DISH</p>

      </div>
    </nav>
  );
};

export default Navbar;