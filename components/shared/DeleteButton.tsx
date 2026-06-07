import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeleteButton({ id, hooks }) {
	const hook = hooks?.useDelete({
		// onSuccess: () => {
		// 	alert("Deleted successfully");
		// },
	});
	async function handleClick() {
		if (!confirm("Are you sure you want to delete this item?")) return;
		await hook.mutateAsync({ id });
	}

	return (
		
		<Button title="Delete" size={"sm"} variant={"destructive"} disabled={hook.isPending} onClick={handleClick}>
			<Trash2 size={"1"} />
		</Button>
	);
}