"use client";
// https://react-bootstrap.netlify.app/docs/components/carousel/
// import api from "@/api/api";
// import type { Expense } from "@/types/types";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link } from 'react-router-dom';
import UncontrolledExample from "../components/UncontrolledExample";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';


const Home = () => {
	return (
		<div className="page-container">

			<main className="grid-wrapper">
				<div className="parent">
					<div className="div1">
						{/* Carousel or any content */}
						<UncontrolledExample />
					</div>
					<div className="div2">
						<div>
							<p>Hey, listen. <br></br>Is your mouth tiny and small?
								WHy don't you order from 'Little Bits' where the food is tiny?
								it looks like regular food, but really tiny. You put it in your mouth and eat it.
								Nothing gets stuck in your lips. It's just tiny and tiny and fits, fits right in!
							</p>
							<p>
								We got....tiny uh-lasagna. tiny pizza, tiny pie. Mmh! Little tiny...fried eggs!
								Oh, s***! We got tiny people!
								Tiny people that are ready to deliver to you!
							</p>

						</div >
						<Link href={"/select-dish"}>
							<button className="button">Start Tiny Order</button>
						</Link>
					</div>
					<div className="div3">

					</div>
					<div className="div4">
						<input
							type="text"
							placeholder="Enter something..."
							className="custom-input"
						/>
						<Link href={"/order-dish"}>
							<button className="button">Find Tiny Order</button>
						</Link>
					</div>

				</div>
				{/* <div className="bg-blue-500">
					refreshingcheck - delete later
				</div> */}
			</main>
		</div>

	);
};

export default Home;
