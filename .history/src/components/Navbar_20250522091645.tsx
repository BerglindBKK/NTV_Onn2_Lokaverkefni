"use client"

import { usePathname } from "next/navigation";

const Navbar = () => {

  const pathname = usePathname();

  return (
    <nav className="navbar">
      <div className="nav-title"><img src="/assets/logo.png" /></div>
      <div className="nav-links">
        <span className={pathname === "/" ? "active-link" : ""}>HOME</span>
        <span className={pathname === "/select-dish" ? "active-link" : ""}>SELECT DISH</span>
        <span className={pathname === "/select-drink" ? "active-link" : ""}>SELECT DRINK</span>
        <span className={pathname === "/order-screen" ? "active-link" : ""}>ORDER SCREEN</span>
        <span className={pathname === "/receipt-screen" ? "active-link" : ""}>RECEIPT SCREEN</span>
      </div>
    </nav>
  );
};

export default Navbar;