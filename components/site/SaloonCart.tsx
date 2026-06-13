"use client";
import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SaloonCard({ saloon }: { saloon: any }) {
	return (
		<Link
			href={`/saloons/${saloon.id}`}
			className='group bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all'
		>
			<div className='relative h-48 overflow-hidden'>
				<img
					src={saloon.imageUrl || "/placeholder-pitch.jpg"}
					alt={saloon.name}
					className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
				/>
				<Badge className='absolute top-2 right-2 bg-orange-500'>
					Available Today
				</Badge>
			</div>

			<div className='p-4'>
				<h3 className='text-lg font-bold text-gray-900 line-clamp-1'>
					{saloon.name}
				</h3>

				<div className='flex items-center text-sm text-gray-500 mt-2'>
					<MapPin className='w-4 h-4 mr-1 text-orange-500' />
					<span className='line-clamp-1'>{saloon.address}</span>
				</div>

				<div className='flex items-center justify-between mt-4 pt-4 border-t'>
					<div className='flex items-center text-sm font-semibold'>
						<Clock className='w-4 h-4 mr-1' />
						60 min
					</div>
					<div className='text-orange-600 font-bold'>
						{saloon.pricePerSlot || "500"} AFG
					</div>
				</div>
			</div>
		</Link>
	);
}
