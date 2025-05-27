"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order, Drink } from "../../types/types";
import api from "../../api/api";
import DatePicker from "react-datepicker";
import { format } from 'date-fns';

const ReceiptScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [time, setTime] = useState("");
    const router = useRouter();
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

    const drinkPrice: number = 20;
    const totalDrinkPrice = (order?.drinks?.length || 0) * drinkPrice;
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
            console.warn("Missing order");
            return;
        }

        // console.log("Order date:", order.date);
        // if (!selectedDateTime) {
        //     alert("Please select date and time");
        //     return;
        // }

        // const updatedOrder: Order = {
        //     ...order,
        //     date: selectedDateTime as Date,  // now definitely a Date here
        // };

        try {
            console.log("Order finished");
            localStorage.removeItem("userEmail");
            router.push(`/`);
        } catch (error) {
            console.error("Failed to complete order:", error);
            alert("Could not save dish selection. Please try again.");
        }
    };

    // const CalculatePrice = () => {
    //     {
    //         order?.drinks.map((im, idx) => (
    //             <div key={im.idDrink}>
    //                 {totalDrinkPrice? += drinkPrice}
    //             </div>
    //         ))

    //     }
    // }
    if (!order) return <div>Loading...</div>;


    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        <p className="title"><strong>Your Tiny Order:</strong></p>
                        <p>Tiny Dish:</p>
                        <div className="overview">
                            <div className="overview-left-lg">

                                <img src={`${order?.dish.strMealThumb}/small`}>
                                </img>
                            </div>
                            <div className="overview-right-lg-title">
                                <p><strong>{order?.dish.strMeal}</strong></p>
                                <p>Tiny Mouths: {order?.count}</p>
                            </div>

                        </div>
                        <p>Tiny Drinks:</p>
                        {order?.drinks.map((im) => (
                            <div key={im.idDrink}>
                                <div className="overview">
                                    <div className="overview-left">
                                        <img src={`${im.strDrinkThumb}/small`} />
                                    </div>
                                    <div className="overview-right">
                                        <p><strong>{im.strDrink}</strong></p>
                                        {im.count ?? 1}
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                    {/* right summary div */}
                    <div className="div2">
                        <div className="left">
                            <p className="title"><strong>Your Tiny Receipt:</strong></p>

                            <p><strong>Tiny Order Email:</strong></p>
                            <p>{order?.email}</p><br></br>

                            <p><strong>Tiny Selected Dish:</strong></p>
                            <p>{order?.dish?.strMeal} x {order.count}</p>
                            <p>Total Meal Price  = Price: ${order?.price}</p><br></br>


                            <p><strong>Tiny Selected Drinks:</strong></p>
                            {order?.drinks.map((im, idx) =>
                                <div key={im.idDrink}>
                                    <p>{order?.drinks[idx].strDrink} x  {order?.drinks[idx].count} </p>
                                </div>
                            )}
                            <p>Total Drink Price = ${totalDrinkPrice}</p><br></br>

                            <p><strong>Selected Date and time: </strong></p>
                            <p> {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'No date selected'} at {time ? format(time, 'hh:mm') : 'No time selected'}</p>
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
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default ReceiptScreen;

