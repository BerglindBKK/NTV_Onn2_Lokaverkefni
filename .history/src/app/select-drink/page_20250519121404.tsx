"use client";

//ToDo: Setja inn leitarglugga
//ToDo: Setja inn leit fyrir nafn, innihald
//Gefa drykkjum random verð - nei, fast verð á drykk, þarf að vera hægt að slá inn fjölda fyrir hvern
//Adda saman verðið í div2 allir drykkir + matur (plús fjöldi manns í næsta skrefi!)


import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [drink, setDrink] = useState<Drink[]>([]); //list of drinks
    const [hoveredDrinkId, setHoveredDrinkId] = useState<string | null>(null); //which one is hovered
    const [selectedDrinkId, setSelectedDrinkId] = useState<string[]>([]); //list of selected drinks
    const [drinkAmount, setdrinkAmount] = useState("");

    //fetching all drinks with initial letter a and storing it in a json file
    const getDrinkData = async () => {
        try {
            const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a";
            const response = await fetch(url); // Make the API request

            // If the response is not OK (status code 200), throw an error
            if (response.status !== 200) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json: ApiResponse = await response.json();
            console.log(json.drinks, "halló, er ég hér?");
            //returning only the "drinks" array from the api
            return json.drinks;

        } catch (error: any) {
            // If something goes wrong, log the error and return an empty array
            console.error("Error fetching drink data:", error);
            return [];
        }
    };

    // Function to load and store drink in state.
    const fetchDrink = async () => {
        const drink = await getDrinkData();
        setDrink(drink);
    };

    //  Loaded only on mount.
    useEffect(() => {
        fetchDrink();
    }, []);

    //filter: returns a new array for selected Drinks. Iterates over array and checks which drink d's idDrink is in selectedDrinkId
    const selectedDrinks = drink.filter(d => selectedDrinkId.includes(d.idDrink));

    return (
        <div className="page-container">
            <main className="grid-wrapper">
                <div className="parent-orderdish">
                    <div className="div5">
                        {/* checks if there are info to display in the array, if not say loading */}
                        {drink.length === 0 ? (
                            <div className="p-20">
                                <p>Loading...</p>
                            </div>
                        ) : (
                            // For each Drink in drink, make a new div and check if it's selected, then assigns the approriate css class
                            <div className="grid-container">
                                {drink.map((im, idx) => (
                                    <div
                                        className={
                                            "grid-item" +
                                            (selectedDrinkId.includes(im.idDrink) ? " grid-item--selected" : "")
                                        }
                                        key={im.idDrink}
                                        //if hovered, set as hovered drink
                                        onMouseEnter={() => {
                                            setHoveredDrinkId(im.idDrink);
                                        }}
                                        //when not hovered anymore, unselected from hovered drinks
                                        onMouseLeave={() => setHoveredDrinkId("")}
                                        //onClick is a toggle, if idDrinks is in SelectedDrinkId, then unselect. If not: select
                                        onClick={() => {
                                            setSelectedDrinkId(ids =>
                                                ids.includes(im.idDrink)
                                                    ? ids.filter(id => id !== im.idDrink)   // unselect
                                                    : [...ids, im.idDrink]                  // select
                                            );
                                        }}
                                    >
                                        {/* display drink photo, if hovered, use grid-item-fact from css for overlay and display info */}
                                        <img
                                            key={im.idDrink}
                                            src={im.strDrinkThumb}
                                            alt={im.strDrink}
                                        />
                                        {hoveredDrinkId === im.idDrink && (
                                            <div className="grid-item-fact">
                                                {im.idDrink}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        )}
                    </div>
                    {/* right summary div - samhæfa og uppfæra*/}
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong></p>
                            <p>Price: </p>
                            <p><strong>Selected Drinks:</strong></p>
                            {selectedDrinks.length === 0 ? (
                                <p>(none)</p>
                            ) : (
                                selectedDrinks.map(d => (
                                    <p key={d.idDrink}>
                                        <input className="input-amount"
                                            id="search"
                                            type="text"
                                            value={drinkAmount}
                                            onChange={e => setdrinkAmount(e.target.value)}
                                            placeholder="1"
                                        /> " ""
                                        {d.strDrink}
                                    </p>
                                ))
                            )}
                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">

                            <button
                                className="button"
                                onClick={() => {
                                    // handleSelcet  -> store dish info in api - bæta við
                                    router.push("/order-screen");
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

export default SelectDrink;

