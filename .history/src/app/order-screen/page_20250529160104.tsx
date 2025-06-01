"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "../../types/types";
import api from "../../api/api";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';

const OrderScreen = () => {
    // react hooks
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

    //check if we want to edit or make new
    let isEditMode;
    if (order && order.date) {
        isEditMode = true;
    } else {
        isEditMode = false;
    }

    //fetch the order by email from localstorage like before
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

    // email fetched from local storage, only once per mount
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        console.log("OrderScreen - storedEmail:", storedEmail);
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }
    }, []);

    //useeffect that renders when order changes
    //checks if there is an existing order, if not, make new order
    //if new order, then remove isNewOrder from local storage, 
    //if existing order, update time and date from that order
    useEffect(() => {
        if (!order) return;

        const isNewOrder = localStorage.getItem("isNewOrder") === "true";

        if (isNewOrder) {
            localStorage.removeItem("isNewOrder");
        } else if (order.date) {
            // Edit mode
            setSelectedDate(new Date(order.date));
            setTime(order.time);
        }
    }, [order]);

    //selects date and time
    const handleSelectDate = async () => {
        if (!order) {
            console.warn("Missing date or order, cannot proceed");
            return;
        }

        //user has to provide date and time
        console.log("Order date:", order.date);
        if (!selectedDateTime) {
            alert("Please select date and time");
            return;
        }

        //updates order with date and time
        const updatedOrder: Order = {
            ...order,
            date: selectedDateTime as Date,  // now definitely a Date here
            time: time,
        };

        //direcgts the user to next screen
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
                            {/* user picks a date */}
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
                            {/* user picks time */}
                            {/* orders available every 30 minutes or 15 times total from 5 to 23 */}
                            <div className="div-time">
                                {[...Array(15)].map((_, i) => {
                                    const startHour = 16; // 16:00
                                    const totalMinutes = startHour * 60 + i * 30;
                                    const hours = Math.floor(totalMinutes / 60);
                                    const minutes = totalMinutes % 60;
                                    const timeLabel = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                                    // returns 3x5 array:
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

                    </div>

                    {/* right summary div like previous pages - fetches info from saved order, date and time from hooks*/}
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

                            <p><strong>Total price: ${totalPrice.toFixed(0)} </strong></p>
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

