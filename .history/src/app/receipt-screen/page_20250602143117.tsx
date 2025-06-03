"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "../../types/types";
import api from "../../api/api";
import { format } from 'date-fns';

const ReceiptScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    //calculates price from order - can not fetch price from order? skoða seinna
    const drinkPrice: number = 20;
    const totalDrinkPrice = (order?.drinks || []).reduce((total, drink) => {
        return total + (drink.count || 0);
    }, 0) * drinkPrice;
    const totalPrice = totalDrinkPrice + ((order?.price || 0) * (Number(order?.count)));

    //fetch order by email like before
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




    //fetched once on mount only
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        console.log("OrderScreen - storedEmail:", storedEmail);
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }
    }, []);

    //order finished - rename function
    const handleSelectDate = async () => {
        if (!order) {
            console.warn("Missing order");
            return;
        }
        try {
            console.log("Order finished");
            localStorage.removeItem("userEmail");
            router.push(`/`);
        } catch (error) {
            console.error("Failed to complete order:", error);
            alert("Could not save dish selection. Please try again.");
        }
    };

    const handleDelete = async (email: string) => {
        if (!email) return;
        setLoading(true);
        try {
            const deleted = await api.deleteOrderByEmail(email);
            console.log("Delete response:", deleted);
            if (deleted) {
                alert("Order deleted");
                router.push("/");
            } else {
                alert("Order not found");
            }
        } catch (err) {

            console.error("Failed to delete order:", err);
            alert("Something went wrong while deleting the order.");
        } finally {
            setLoading(false);
        }
    };

    if (!order) return <div>Loading...</div>;


    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    {/* left hand order summary */}
                    <div className="div5-receipt">
                        <p className="title"><strong>Your Tiny Order:</strong></p>
                        <p className="left"><strong>Tiny Dish:</strong></p>
                        <div className="overview">
                            <div className="overview-left-lg">
                                <img src={`${order?.dish.strMealThumb}/small`} />
                            </div>
                            <div className="overview-right-lg">
                                <p><strong>{order?.dish.strMeal}</strong></p><br></br>
                                <p>Tiny Mouths: {order?.count}</p>
                                <p>Price per Mouth: ${order?.price} </p>
                            </div>

                        </div>
                        <p><strong>Tiny Drinks:</strong></p>
                        {order?.drinks.map((im) => (
                            <div key={im.idDrink}>
                                <div className="overview">
                                    <div className="overview-left-lg">
                                        <img src={`${im.strDrinkThumb}/small`} />
                                    </div>
                                    <div className="overview-right-lg">
                                        <p><strong>{im.strDrink}</strong></p>
                                        <p>Tiny Mouths: {im.count ?? 1}</p>
                                        <p>Price: {im.count} x ${drinkPrice} = ${drinkPrice * (Number(im.count) || 1)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                    {/* right hand receipt with prices */}
                    <div className="div2">
                        <div className="left receipt">
                            <p className="title"><strong>Your Tiny Receipt:</strong></p>

                            <p><strong>Tiny Order Email:</strong></p>
                            <p>{order?.email}</p><br></br>

                            <p><strong>Tiny Selected Dish:</strong></p>
                            <p>{order?.dish?.strMeal} x {order.count}</p>
                            <p>Total Meal Price  = ${order?.price * (Number(order.count))}</p><br></br>


                            <p><strong>Tiny Selected Drinks:</strong></p>
                            {order?.drinks.map((im, idx) =>
                                <div key={im.idDrink}>
                                    <p>{order?.drinks[idx].strDrink} x  {order?.drinks[idx].count} </p>
                                </div>
                            )}
                            <p>Total Drink Price = ${totalDrinkPrice}</p><br></br>

                            <p><strong>Selected Date and time: </strong></p>
                            <p> {order.date ? format(order.date, 'yyyy-MM-dd') : 'No date selected'} at {order.time ? order.time : 'No time selected'}</p>
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
                                Back
                            </button>
                            <button
                                onClick={() => handleDelete(order.email)}
                                disabled={loading}
                            >
                                {loading ? "Cancelling..." : "Cancel Order"}
                            </button>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}

export default ReceiptScreen;

