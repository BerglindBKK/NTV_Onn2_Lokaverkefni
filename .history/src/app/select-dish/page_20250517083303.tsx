import Link from "next/link";

const SelectDish = () => {
    return (
        <div className="page-container">

            <main className="grid-wrapper">
                <div className="parent">
                    <div className="div1">dgsdfg</div>
                    <div className="div2">
                        <div className="left">
                            <p>
                                fd
                            </p>
                            <p>
                                sdfs
                            </p>
                        </div >
                        <div className="centered">
                            <Link href={"/select-dish"}>
                                <button className="button">Select Tiny Dish</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SelectDish;