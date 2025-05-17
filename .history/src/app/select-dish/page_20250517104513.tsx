"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define the shape of a Cat image object returned by the API
type Dish = {
    idMeal: string;
    url: string;
    //   width: number;
    //   height: number;
};

const SelectDish = () => {
    const [catImages, setCatImages] = useState<Cat[]>([]);
    const [catFact, setCatFact] = useState('');
    return (
        <div className="page-container">

            <main className="grid-wrapper">
                <div className="parent">
                    <div className="div1">dgsdfg</div>
                    <div className="div2">
                        <div className="left">
                            <p>
                                fd
                            </p>
                            <p>
                                sdfs
                            </p>
                        </div >
                        <div className="centered">
                            <Link href={"/select-dish"}>
                                <button className="button">Select Tiny Dish</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDish;