"use client";
import Link from "next/link";

export default function SaloonCard({
	saloon,
}: {
	saloon: {
		id: number;
		name: string;
		address: string;
		phone: string;
	};
}) {
	return (
		<Link
			href={"saloons/" + saloon.id}
			className='bg-white shadow-md rounded-lg '
		>
			{/* the imageUrl should be centered and the overflow should not be shown */}
			<div className='overflow-hidden rounded-t-lg'>
				<img
					// src={saloon.imageUrl}
					alt=''
					className='h-40 md:h-96 object-cover w-full hover:scale-110 transition-transform duration-300 ease-in-out '
				/>
			</div>

			<div className='ps-1 h-24'>
				<Link
					href={"saloons/" + saloon.id}
					className=' text-orange-500 line-clamp-2'
				>
					{saloon.name}
				</Link>
				<h2 className='font-bold'>{saloon.address} AFG</h2>
				<div className='text-sm'>MOQ: {saloon.phone}</div>
			</div>
		</Link>
	);
}
