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
        };

        try {
            console.log("Order to update:", order);
            await api.updateOrder(updatedOrder);
            router.push(`/recipe-screen`);
        } catch (error) {
            console.error("Failed to update order:", error);
            alert("Could not save dish selection. Please try again.");
        }
    };

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
                                            className={(timeLabel === time ? "button-grid-item-selected" : "")}
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
                    </div>
                    {/* right summary div */}
                    <div className="div2">
                        <div className="left">
                            {order?.email}
                            <p><strong>Selected Dish:</strong>{order?.dish?.strMeal}</p>
                            <p>Price: </p>
                            <p><strong>Selected Drinks:</strong></p>
                            {order?.drinks?.length ? (
                                order.drinks.map((drink) => (
                                    <div key={drink.idDrink}>{drink.strDrink}</div>
                                ))
                            ) : (
                                <p>No drinks selected.</p>
                            )}

                            <p><strong>Selected Date: </strong> {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'No date selected'}</p>
                            <p><strong>Time selected: </strong>{time}</p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">
                            <button
                                className="button"
                                onClick={() => {
                                    handleSelectDate();
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

