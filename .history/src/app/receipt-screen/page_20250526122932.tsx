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
                        <p>Tiny Dish:</p>
                        <div className="overview">
                            <div className="overview-left">

                                <img src={`${order?.dish.strMealThumb}/small`}>
                                </img>
                            </div>
                            <div className="overview-right">
                                {order?.dish.strMeal}
                                {order?.count}
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
                            <p>{order?.dish?.strMeal} x {order.count}  = Price: ${order?.price}</p><br></br>


                            <p><strong>Tiny Selected Drinks:</strong></p>
                            {order?.drinks.map((im, idx) =>
                                <div key={im.idDrink}>
                                    <p>{order?.drinks[idx].strDrink} x  {order?.drinks[idx].count} </p>
                                </div>
                                <p>Tota Drink Price = ${order.drinks.price}</p>
                            )

                            }
                            {/* {order?.drinks?.length ? (
                                order.drinks.map((drink) => (
                                    <div key={drink.idDrink}>{drink.strDrink}</div>
                                ))
                            ) : (
                                <p>No drinks selected.</p>
                            )} */}

                            <p><strong>Selected Date: </strong></p>
                            <p> {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'No date selected'}</p>
                            <p><strong>Time selected: </strong></p>
                            <p>{time}</p>
                            <br></br>
                            <p><strong>Total price:</strong> ${totalPrice.toFixed(2)} </p>
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

