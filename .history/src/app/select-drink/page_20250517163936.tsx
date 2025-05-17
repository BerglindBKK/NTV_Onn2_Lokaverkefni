"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Drink = {
    idDrink: string;
    strDrink: string;
    strDrinkThumb: string;
}

type ApiResponse = {
    drinks: Drink[];
};
const SelectDrink = () => {
    // useState hook to store the list of drinks
    const [drink, setDrink] = useState<Drink[]>([]);

    const getDrinkData = async () => {
        try {
            const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a";
            const response = await fetch(url); // Make the API request

            // If the response is not OK (status code 200), throw an error
            if (response.status !== 200) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json: ApiResponse = await response.json();
            console.log(json.drinks, "tjekk");
            return json.drinks;

        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching drink data:", error);
            return [];
        }
    };

    useEffect(() => {
        // Function to load and store dish in state
        const fetchDrink = async () => {
            const drink = await getDrinkData();
            setDrink(drink);
            // setMealPrice(randomPrice());
            // setMealCalories(randomCalories());
        };
        fetchDrink();
    }, []);

    return (
        <div className="page-container">

            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        {drink.length === 0 ? (
                            <div className="p-20">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <div className="grid-container">
                                {/* Render each cat image inside a div */}
                                {drink.map((im, index) => (
                                    // <div
                                    // className="grid-item"
                                    // key={im.idDrink}
                                    // onClick={() => {
                                    //     setSelectedCatId(im.id);
                                    //     const facturl = im.url;
                                    // }}
                                    // >
                                    <img
                                        key={im.idDrink}
                                        src={im.strDrinkThumb}
                                        alt={`drink ${index}`} />
                                        {/* {showFact && <ChildFact />} */ }
                                        {/* {selectedCatId === im.id && (
                                            <div className="grid-item-fact">
                                                {catFact}
                                            </div>)} */}
                                    // </div>
                                ))}
                            </div>
                        )}



                        <div className="dish-photo">

                        </div>
                        <div className="drink-info">

                        </div>
                    </div>
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong></p>
                            <p>Price: </p>
                            <p><strong>Selected Drink:</strong></p>

                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">
                            {/* <p>To select this tiny dish and continue to tiny drinks selection click this tiny button</p> */}
                            <Link href={"../select-drink"}>
                                <button className="button">
                                    Select This Tiny Dish
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDrink;