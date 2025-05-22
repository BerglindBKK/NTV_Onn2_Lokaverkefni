"use client"

import { usePathname } from "next/navigation";

const Navbar = () => {

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title"><img src="/assets/logo.png" /></div>
      <div className="nav-links">
        <span className={pathname === "select-dish" ? "active-link" : ""}>SELECT DISH</span>
        <span>SELECT DRINK</span>
        <span>ORDER SCREEN</span>
        <span>RECEIPT SCREEN</span>
      </div>
    </nav>
  );
};

export default Navbar;