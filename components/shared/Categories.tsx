export default function Categories() {
	const Categories = [
		{
			name: "All",
			href: "/",
		},
		{
			name: "Technology",
			href: "/category/technology",
		},
		{
			name: "Health",
			href: "/category/health",
		},
		{
			name: "Finance",
			href: "/category/finance",
		},
		{
			name: "Travel",
			href: "/category/travel",
		},
		{
			name: "Food",
			href: "/category/food",
		},
		{
			name: "Lifestyle",
			href: "/category/lifestyle",
		},
		{
			name: "Education",
			href: "/category/education",
		},
		{
			name: "Entertainment",
			href: "/category/entertainment",
		},
		{
			name: "Sports",
			href: "/category/sports",
		},
	];

	return (
		<div className='w-full  px-4 py-1 sm:px-6 lg:px-8 bg-gray-900'>
			<div className='flex space-x-4 overflow-x-auto'>
				{Categories.map((category) => (
					<a
						key={category.name}
						href={category.href}
						className='whitespace-nowrap px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors'
					>
						{category.name}
					</a>
				))}
			</div>
		</div>
	);
}
