"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const SelectDrink = () => {

    return (
        <div className="page-container">

            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <div className="dish-photo">

                        </div>
                        <div className="drink-info">

                        </div>
                    </div>
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong></p>
                            <p>Price: </p>
                            <p><strong>Selected Drink:</strong></p>

                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">
                            {/* <p>To select this tiny dish and continue to tiny drinks selection click this tiny button</p> */}
                            <Link href={"../select-drink"}>
                                <button className="button">
                                    Select This Tiny Dish
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDrink;