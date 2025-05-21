"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../../api/api";
import { Order } from "../../types/types";

// Define the shape of a Cat image object returned by the API
type Dish = {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strArea: string;
    strCategory: string;
};

type ApiResponse = {
    meals: Dish[];
};

// const order = await api.getOrdeByEmail(email);
// await api.updateOrder(updatedOrder);

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

const SelectDish = () => {
    const [dish, setDish] = useState<Dish | null>(null);
    const [mealPrice, setMealPrice] = useState<number>(0);
    const [mealCalories, setMealCalories] = useState<number>(0);
    const [order, setOrder] = useState<Order | null>(null);
    const router = useRouter();

    const fetchOrderByEmail = async (email: string) => {
        try {
            const order = await api.getOrderByEmail(email);
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

            //Parse the response JSON into an array of Dish objects (ApiResponse)
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
        setMealPrice(randomPrice());
        setMealCalories(randomCalories());
    };

    //everything loads once per mount
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


    const handleSelectDish = async () => {
        if (!dish || !order) return;

        const updatedDish = {
            id: dish.idMeal,
            name: dish.strMeal,
            category: dish.strCategory || "Unknown",
            cousine: dish.strArea || "Unknown",
            description: "",  // add if you have one
            imageSource: dish.strMealThumb,
            price: mealPrice,
        };

        // Create updated order with full required properties
        const updatedOrder: Order = {
            ...order,
            date: new Date(order.date), // ensure it's a Date object
            dish: updatedDish,
        };

        try {
            console.log("Updating order:", updatedOrder);
            await api.updateOrder(updatedOrder);
            router.push(`/select-drink`);
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

            </main >
        </div >
    )
}

export default SelectDish;

//remember to clear local storage when not needed anymore
//localStorage.removeItem("userEmail");
