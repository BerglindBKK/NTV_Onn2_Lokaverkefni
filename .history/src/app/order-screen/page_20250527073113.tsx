"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "../../types/types";
import api from "../../api/api";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';

const OrderScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [time, setTime] = useState("");
    const router = useRouter();

    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    const drinkPrice: number = 20;
    const totalDrinkPrice = (order?.drinks || []).reduce((total, drink) => {
        return total + (drink.count || 0);
    }, 0) * drinkPrice;
    const totalPrice = totalDrinkPrice + (order?.price || 0);

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

    const handleSelectDate = async () => {
        if (!order) {
            console.warn("Missing date or order, cannot proceed");
            return;
        }

        // const formatted =
        //     selectedDate instanceof Date ? format(selectedDate, 'yyyy-MM-dd') : '';

        console.log("Order date:", order.date);
        if (!selectedDateTime) {
            alert("Please select date and time");
            return;
        }

        const updatedOrder: Order = {
            ...order,
            date: selectedDateTime as Date,  // now definitely a Date here
            time: time,
        };

        try {
            console.log("Order to update:", order);
            await api.updateOrder(updatedOrder);
            router.push(`/receipt-screen`);
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Could not save dish selection. Please try again.");
        }
    };

    if (!order) return <div>Loading...</div>;

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <div className="timetable">
                            <div className="datepicker">
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
                            <div className="div-time">
                                {[...Array(15)].map((_, i) => {
                                    const startHour = 16; // 16:00
                                    const totalMinutes = startHour * 60 + i * 30;
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                                    return (
                                        <button
                                            key={i}
                                            className={(timeLabel === time ? "button-grid-item-selected" : "button-grid-item")}
                                            onClick={() => {
                                                setTime(timeLabel);
                                                if (selectedDate) {
                                                    const [hourStr, minuteStr] = timeLabel.split(":");
                                                    const combinedDate = new Date(selectedDate);
                                                    combinedDate.setHours(parseInt(hourStr, 10), parseInt(minuteStr, 10), 0, 0);
                                                    setSelectedDateTime(combinedDate);
                                                }
                                            }}
                                        >
                                            {timeLabel}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                        sfs
                    </div>

                    {/* right summary div */}
                    <div className="div2">
                        <div className="left">
                            <p className="title"><strong>Your Tiny Receipt:</strong></p>

                            <p><strong>Tiny Order Email:</strong></p>
                            <p>{order?.email}</p><br></br>

                            <p><strong>Tiny Selected Dish:</strong></p>
                            <p>{order?.dish?.strMeal} x {order.count}</p>
                            <p>Total Meal Price  =  ${order?.price}</p><br></br>


                            <p><strong>Tiny Selected Drinks:</strong></p>
                            {order?.drinks.map((im, idx) =>
                                <div key={im.idDrink}>
                                    <p>{order?.drinks[idx].strDrink} x  {order?.drinks[idx].count} </p>
                                </div>
                            )}
                            <p>Total Drink Price = ${totalDrinkPrice}</p><br></br>

                            <p><strong>Selected Date and time: </strong></p>
                            <p> {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'No date selected'} at {time ? time : 'No time selected'}</p>
                            <br></br>

                            <p><strong>Total price: ${totalPrice.toFixed(2)} </strong></p>


                        </div >


                        <div className="centered">
                            <button
                                className="button"
                                onClick={() => {
                                    handleSelectDate();
                                }}
                            >
                                Complete Tiny Order
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OrderScreen;

