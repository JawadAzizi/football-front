"use client";
import ProductCard from "@/components/site/SaloonCart";
import { useState } from "react";
import { useSaloon } from "@/hooks/useSaloon";
import { useParams, useSearchParams } from "next/navigation";

export default function Home() {
	const param = useParams();

	const saloonHooks = new useSaloon();
	const saloon = saloonHooks.useGet(param.saloon_id);
	return (
		<>
			<ProductCard saloon={saloon.data ?? {}} />
		</>
	);
}
