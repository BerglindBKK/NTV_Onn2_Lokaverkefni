"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Order, Dish } from "../../types/types";

//meals is an array of Dish
type ApiResponse = {
    meals: Dish[];
};

//make random price - remove? and make constant price?
const randomPrice = (min = 5, max = 100) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(2));
};

//random calories
const randomCalories = (min = 300, max = 1000) => {
    const price = Math.random() * (max - min) + min;
    return Number(price.toFixed(0));
};

//reacht hooks
const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);
    const [mealPrice, setMealPrice] = useState<number>(0);
    const [mealCalories, setMealCalories] = useState<number>(0);
    const [order, setOrder] = useState<Order | null>(null);
    const router = useRouter();
    const [dishAmount, setDishAmount] = useState<number>(1);

    //fetching the order by users email and store it in state 
    // - kannski betra að refactora setOrder og geyma í sér file? -seinna
    const fetchOrderByEmail = async (email: string) => {
        try {
            const order = await api.getOrderByEmail(email);
            // order.date = new Date(order.date);
            order.count = order.count ?? 1; // Troubleshooting, Ensure 'count' is defined
            setOrder(order);
        }
        catch (err: any) {
            if (err.message.includes("Order not found")) {
                console.warn(`No order found for email: ${email}`);
                localStorage.removeItem("userEmail");
                setOrder(null);
            } else {
                console.error("Failed to fetch order:", err);
            }
        }
    }

    //fetching dish from url and storing it in a json file
    const getDishData = async () => {
        try {
            const url = "https://themealdb.com/api/json/v1/1/random.php";
            const response = await fetch(url); //waits while making the API request

            //If the response is not OK (status 200), throw error
            if (response.status != 200) {
                throw new Error(`Response status: ${response.status}`);
            }

            //Parse the response JSON into an array of Dish objects (ApiResponse), 
            //svo það sé hægt að nota jsonDish.meals[0], þó það sé bara einn diskur, samt array
            const jsonDish: ApiResponse = await response.json();
            // picks first (and only) element of the meal array and returns it
            const meal = jsonDish.meals[0];
            return meal;
        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching dish:", error);
            return null;
        }
    };
    // Function to load and store dish, price and calories in state
    const fetchDish = async () => {
        const dish = await getDishData();
        setDish(dish);
        setMealPrice(randomPrice()); //ofaukið - eyða?
        setMealCalories(randomCalories()); // ofaukið - eyða?
    };

    //everything loads once per mount, stores email in local storage for next pages to look the order up
    useEffect(() => {
        fetchDish();
        const storedEmail = localStorage.getItem("userEmail");
        console.log("storedEmail:", storedEmail);
        if (storedEmail) {
            fetchOrderByEmail(storedEmail);
        } else {
            console.warn("No email found in localStorage");
        }
    }, []);

    // commenta út troubleshooting kóðann, - eyða? ofaukið
    const handleSelectDish = async () => {
        // console.log("handleSelectDish called");
        // console.log("dish:", dish);
        // console.log("order:", order);
        if (!dish || !order) {
            console.warn("Missing dish or order, cannot proceed");
            return;
        }

        // const updatedDish = {
        //     id: dish.idMeal,
        //     name: dish.strMeal,
        //     category: dish.strCategory || "Unknown",
        //     cousine: dish.strArea || "Unknown",
        //     description: dish.strTags || "Unknown",
        //     imageSource: dish.strMealThumb,
        //     price: mealPrice,
        // };

        console.log("Order drinks:", order.drinks);
        const updatedOrder: Order = {
            ...order,
            dish: dish,
            price: mealPrice,
            count: dishAmount,
            drinks: order.drinks || [],
        };
        console.log(order)

        // console.log("Order object being sent to API:", updatedOrder);
        // console.log("Order to send:", JSON.stringify(updatedOrder, null, 2));

        // if (!updatedDish.name || !updatedDish.cousine || !updatedDish.price) {
        //     console.error("Dish is missing required fields:", updatedDish);
        //     alert("Dish is missing required fields. Cannot update order.");
        //     return;
        // }

        try {
            console.log("Order to update:", order);
            await api.updateOrder(updatedOrder);
            router.push(`/select-drink`);
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
                        <div className="dish-info">
                            <div className="dish-photo">
                                {dish && (
                                    <img src={dish.strMealThumb} alt={dish.strMeal} />
                                )}
                            </div>
                            <div className="dish-info">
                                <p className="title-text centered"><strong>{dish?.strMeal}</strong></p>
                                <p className="centered"> A tiny {dish?.strArea} {dish?.strMeal} meal that fits, fits right in</p>
                                <br></br>
                                <p className="centered"> Tiny calories: {mealCalories.toFixed(0)} kCal</p>
                                <p className="centered"> Tiny price: $ {mealPrice.toFixed(2)}</p>
                            </div>
                        </div>
                        <button
                            className="button"
                            onClick={() => {
                                fetchDish();
                            }}
                        >

                            Generate new tiny dish
                        </button>
                    </div>
                    <div className="div2">
                        <div className="left">
                            {order && (
                                <div className="order-info">
                                    <p><strong>Order Email:</strong> {order.email}</p>

                                </div>
                            )}

                            <p><strong>Selected Dish:</strong></p>
                            {dish?.strMeal}
                            <p>Price: ${mealPrice.toFixed(2)}</p>

                        </div >

                        <div className="lower">
                            <p className="center">How many Tiny Dishes would you like?</p>
                            <div className="amount">
                                <button
                                    className="minus-one"
                                    onClick={() => {
                                        setDishAmount(prev => (prev - 1 >= 1 ? prev - 1 : 1));
                                    }}>-</button>
                                {dishAmount}
                                <button
                                    className="plus-one"
                                    onClick={() => {
                                        setDishAmount(prev => (prev + 1));
                                    }}>+</button>
                            </div>
                            <button
                                className="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSelectDish();
                                }}
                            >
                                Select Tiny Dish
                            </button>
                        </div>
                    </div>
                </div>

            </main >
        </div >
    )
}

export default SelectDish;

//remember to clear local storage when not needed anymore
//localStorage.removeItem("userEmail");
