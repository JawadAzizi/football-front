"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useSaloon } from "@/hooks/useSaloon";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSlot } from "@/hooks/useSlot";
import { useReservation } from "@/hooks/useReservation";
import { Calendar } from "lucide-react";

export default function SaloonDetailPage() {
    const {saloon_id } = useParams();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    
    const saloonHook = new useSaloon();
    const slotHook = new useSlot();
    const bookingHook = new useReservation();

    const { data: saloon } = saloonHook.useGet(saloon_id as string);
    const { data: slots, isLoading } = slotHook.useList(
        saloon_id as string, 
        selectedDate?.toISOString().split('T')[0] || ""
    );

    const createBooking = bookingHook.useCreate();

    const handleBook = (slotId: string) => {
        createBooking.mutate({ slotId }, {
            onSuccess: () => toast.success("Booking requested! Waiting for manager approval."),
            onError: () => toast.error("Failed to book slot.")
        });
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <img src={saloon?.imageUrl} className="w-full h-64 object-cover rounded-xl" />
                <h1 className="text-3xl font-bold mt-4">{saloon?.name}</h1>
                <p className="text-gray-600">{saloon?.address}</p>
                
                <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">Select a Time Slot</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {isLoading ? <p>Loading slots...</p> : slots?.map((slot: any) => (
                            <Button 
                                key={slot.id} 
                                variant={slot.is_available ? "outline" : "ghost"}
                                disabled={!slot.is_available}
                                onClick={() => handleBook(slot.id)}
                            >
                                {slot.startTime} - {slot.endTime}
                                <br/>
                                {slot.price} AFG
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 border rounded-xl shadow-sm h-fit">
                <h3 className="font-bold mb-2">Select Date</h3>
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                />
            </div>
        </div>
    );
}