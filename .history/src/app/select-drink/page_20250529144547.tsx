"use client";

import { useEffect, useState } from "react";
import api from "../../api/api";
import { Drink, Order } from "../../types/types";
import { useRouter } from "next/navigation";

type ApiResponse = {
    drinks: Drink[];
};

const SelectDrink = () => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    const [drinkAmounts, setDrinkAmounts] = useState<{ [idDrink: string]: number }>({});
    const router = useRouter();

    // Detect if we're editing an existing order (have drinks in order)
    const isEditMode = !!order?.drinks && order.drinks.length > 0;

    useEffect(() => {
        const storedOrderJson = localStorage.getItem("userOrder");
        if (storedOrderJson) {
            const storedOrder = JSON.parse(storedOrderJson);
            // Ensure drinks is an array
            storedOrder.drinks = Array.isArray(storedOrder.drinks) ? storedOrder.drinks : [];
            setOrder(storedOrder);
            // Initialize drinkAmounts for all stored drinks
            const amounts: { [id: string]: number } = {};
            storedOrder.drinks.forEach((d: Drink) => {
                amounts[d.idDrink] = d.count ?? 1;
            });
            setDrinkAmounts(amounts);
        } else {
            // No order saved yet — create blank order object with empty drinks array
            setOrder({ email: "", drinks: [] });
        }
    }, []);

    // Fetch order from localStorage/email on mount
    useEffect(() => {
        async function fetchDrinks() {
            try {
                const res = await fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s=");
                const data: ApiResponse = await res.json();
                setDrinks(Array.isArray(data.drinks) ? data.drinks : []);
            } catch (error) {
                console.error("Failed to fetch drinks", error);
                setDrinks([]);
            }
        }
        fetchDrinks();
    }, []);

    // Add or remove drink from selection
    const toggleDrink = (drink: Drink) => {
        if (!order) return;
        let updatedDrinks = order.drinks ? [...order.drinks] : [];

        const index = updatedDrinks.findIndex(d => d.idDrink === drink.idDrink);
        if (index >= 0) {
            // Remove drink
            updatedDrinks.splice(index, 1);
            const newAmounts = { ...drinkAmounts };
            delete newAmounts[drink.idDrink];
            setDrinkAmounts(newAmounts);
        } else {
            // Add drink with default count 1
            updatedDrinks.push({ ...drink, count: 1 });
            setDrinkAmounts({ ...drinkAmounts, [drink.idDrink]: 1 });
        }
        setOrder({ ...order, drinks: updatedDrinks });
    };

    // Update quantity for a selected drink
    const updateDrinkAmount = (idDrink: string, newCount: number) => {
        if (!order) return;
        if (newCount < 1) return; // minimum 1

        const updatedDrinks = order.drinks ? [...order.drinks] : [];
        const drinkIndex = updatedDrinks.findIndex(d => d.idDrink === idDrink);
        if (drinkIndex >= 0) {
            updatedDrinks[drinkIndex] = { ...updatedDrinks[drinkIndex], count: newCount };
            setOrder({ ...order, drinks: updatedDrinks });
            setDrinkAmounts({ ...drinkAmounts, [idDrink]: newCount });
        }
    };

    // Remove a drink from selection
    const removeDrink = (idDrink: string) => {
        if (!order) return;
        const updatedDrinks = order.drinks ? order.drinks.filter(d => d.idDrink !== idDrink) : [];
        setOrder({ ...order, drinks: updatedDrinks });
        const newAmounts = { ...drinkAmounts };
        delete newAmounts[idDrink];
        setDrinkAmounts(newAmounts);
    };

    // Save/update order with drinks and counts
    const handleSave = async () => {
        if (!order) return;

        try {
            await api.updateOrder(order);
            alert("Drinks updated successfully!");
            router.push("/order-summary"); // or next page you want
        } catch (error) {
            alert("Failed to save order. Try again.");
        }
    };

    // Calculate total price (assume $10 per drink for example)
    const totalPrice = order?.drinks?.reduce((sum, d) => {
        const count = d.count ?? 1;
        return sum + count * 10; // example price per drink
    }, 0) ?? 0;

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdrink">
                    {/* Left: List of drinks */}
                    <div className="div5">
                        <h2>{isEditMode ? "Edit Your Drinks" : "Select Your Drinks"}</h2>
                        <ul>
                            {Array.isArray(drinks) ? drinks.map(drink => {
                                const selected = order?.drinks?.some(d => d.idDrink === drink.idDrink);
                                return (
                                    <li key={drink.idDrink} style={{ marginBottom: 15 }}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={!!selected}
                                                onChange={() => toggleDrink(drink)}
                                            />
                                            {" "}
                                            {drink.strDrink}
                                        </label>
                                        {selected && (
                                            <div style={{ marginLeft: 20 }}>
                                                <button onClick={() => updateDrinkAmount(drink.idDrink, (drinkAmounts[drink.idDrink] || 1) - 1)}>-</button>
                                                <span style={{ margin: "0 10px" }}>{drinkAmounts[drink.idDrink]}</span>
                                                <button onClick={() => updateDrinkAmount(drink.idDrink, (drinkAmounts[drink.idDrink] || 1) + 1)}>+</button>
                                                <button style={{ marginLeft: 10, color: "red" }} onClick={() => removeDrink(drink.idDrink)}>Remove</button>
                                            </div>
                                        )}
                                    </li>
                                );
                            }) : <p>No drinks available.</p>}
                        </ul>
                    </div>

                    {/* Right: Order summary */}
                    <div className="div2">
                        <h3>Your Order Summary</h3>
                        <p><strong>Email:</strong> {order?.email || "No email set"}</p>
                        <p><strong>Selected Drinks:</strong></p>
                        <ul>
                            {order?.drinks?.map(d => (
                                <li key={d.idDrink}>
                                    {d.strDrink} x {d.count}
                                </li>
                            ))}
                            {(!order?.drinks || order.drinks.length === 0) && <li>No drinks selected</li>}
                        </ul>
                        <p><strong>Total Price:</strong> ${totalPrice}</p>
                        <button className="button" onClick={handleSave} disabled={!order?.drinks || order.drinks.length === 0}>
                            {isEditMode ? "Update Drinks" : "Save Drinks"}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SelectDrink;
