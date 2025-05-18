"use client";

//ToDo: Setja inn leitarglugga
//ToDo: Setja inn leit fyrri nafn, innihald
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
        };
        fetchDrink();
    }, []);

    const selectedDrinks = drink.filter(d => selectedDrinkId.includes(d.idDrink));

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
                                {drink.map((im, idx) => (
                                    <div
                                        className={
                                            "grid-item" +
                                            (selectedDrinkId.includes(im.idDrink) ? " grid-item--selected" : "")
                                        }
                                        key={im.idDrink}
                                        onMouseEnter={() => {
                                            setHoveredDrinkId(im.idDrink);
                                            // const facturl = im.strDrink;
                                        }}
                                        onMouseLeave={() => setHoveredDrinkId("")}
                                        //onClick is now a toggle
                                        onClick={() => {
                                            setSelectedDrinkId(ids =>
                                                ids.includes(im.idDrink)
                                                    ? ids.filter(id => id !== im.idDrink)   // unselect
                                                    : [...ids, im.idDrink]                  // select
                                            );
                                        }}
                                    >
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

                        <div className="dish-photo">

                        </div>
                        <div className="drink-info">

                        </div>
                    </div>
                    <div className="div2">
                        <div className="left">
                            <p><strong>Selected Dish:</strong></p>
                            <p>Price: </p>
                            <p><strong>Selected Drinks:</strong></p>
                            {selectedDrinks.length === 0 ? (
                                <p>(none)</p>
                            ) : (
                                selectedDrinks.map(d => (
                                    <p key={d.idDrink}>{d.strDrink}</p>
                                ))
                            )}
                            <p><strong>Selected Date:</strong></p>
                            <br></br>

                            <p><strong>Total price:</strong> </p>


                        </div >
                        <div className="centered">
                            {/* <p>To select this tiny dish and continue to tiny drinks selection click this tiny button</p> */}
                            <button
                                className="button"
                                onClick={() => {
                                    // e.g. store selection if you want:
                                    // localStorage.setItem(
                                    //     "selectedDrinkIds",
                                    //     JSON.stringify(selectedDrinkId)
                                    // );
                                    // then navigate:
                                    router.push("/next-page");
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

