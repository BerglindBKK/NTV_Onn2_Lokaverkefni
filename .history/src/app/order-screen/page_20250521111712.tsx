"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DatePicker from "react-datepicker";

const OrderScreen = () => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <div>
                            <h2>Select a date:</h2>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date: Date | null) => setSelectedDate(date)}
                                dateFormat="yyyy/MM/dd"
                                minDate={new Date()}
                                placeholderText="Click to select a date"
                                inline
                            />
                        </div>
                    </div>
                    {/* right summary div */}
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong>{order?.email}</p>
                            <p>Price: </p>
                            <p><strong>Selected Drinks:</strong>{order.dish?.strMeal}</p>

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

