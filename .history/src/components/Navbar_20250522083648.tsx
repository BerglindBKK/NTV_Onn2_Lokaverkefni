"use client"

import { usePathname } from 'next/navigation';

const HighlightNav = () => {
    const pathname = usePathname();
    console.log(pathname);
    return pathname
}

export default HighlightNav;