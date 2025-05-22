"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "../../types/types";
import api from "../../api/api";
import DatePicker from "react-datepicker";

const OrderScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);


    const fetchOrderByEmail = async (email: string) => {
        try {
            console.log("Fetching order with email:", email);
            const order = await api.getOrderByEmail(email);
            setOrder(order);
        }
        catch (err: any) {
            if (err.message.includes("Order not found")) {
                console.warn(`No order found for email: ${email}`);
                console.error("Error while fetching order:", err.message);
                localStorage.removeItem("userEmail");
                setOrder(null);
            } else {
                console.error("Failed to fetch order:", err);
            }
        }
    }

    useEffect(() => {
        // fetchDrink();
        const storedEmail = localStorage.getItem("userEmail");
        console.log("OrderScreen - storedEmail:", storedEmail);
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }

    }, []);

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

