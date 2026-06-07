"use client";
import ProductCard from "@/components/site/SaloonCart";
import { useState } from "react";
import { useSaloon } from "@/hooks/useSaloon";

export default function Home() {
	const [showingState, setShowingState] = useState<
		"products" | "manifacturers"
	>("products");

	const saloonHooks = new useSaloon();
	const saloons = saloonHooks.useList();

	console.log(saloons.data)
	return (
		<>
			<div className='flex justify-center items-center gap-4 p-1 bg-orange-500 text-white'>
				<button
					onClick={() => setShowingState("products")}
					className={
						showingState == "products" ? "bg-white text-black p-2 rounded" : ""
					}
				>
					Products
				</button>
				<button
					onClick={() => setShowingState("manifacturers")}
					className={
						showingState == "manifacturers"
							? "bg-white text-black p-2 rounded"
							: ""
					}
				>
					Manifactures
				</button>
			</div>

			<div className='grid  grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-100'>
				{showingState == "products" && (
					<>
						{saloons?.data?.map((saloon) => (
							<ProductCard key={saloon.id} saloon={saloon} />
						))}
					</>
				)}
			</div>
		</>
	);
}
