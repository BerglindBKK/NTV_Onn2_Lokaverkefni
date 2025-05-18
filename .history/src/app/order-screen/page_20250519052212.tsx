"use client";

//ToDo: Setja inn leitarglugga
//ToDo: Setja inn leit fyrir nafn, innihald
//Gefa drykkjum random verð - nei, fast verð á drykk, þarf að vera hægt að slá inn fjölda fyrir hvern
//Adda saman verðið í div2 allir drykkir + matur (plús fjöldi manns í næsta skrefi!)


// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";


const OrderScreen = () => {


    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                    </div>
                    {/* right summary div */}
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong></p>
                            <p>Price: </p>
                            <p><strong>Selected Drinks:</strong></p>

                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">
                            <button
                                className="button"
                                onClick={() => {
                                    // router.push("/receipt-screen");
                                }}
                            >
                                Select Tiny Drinks
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OrderScreen;

