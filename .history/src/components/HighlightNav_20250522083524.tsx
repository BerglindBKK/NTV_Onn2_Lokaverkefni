"use client"

import { usePathname } from 'next/navigation';

function HighlightNav = () => {
    const pathname = usePathname();
    console.log(pathname);
    return pathname
}

export default HighlightNav;