"use client";
import React, { useState, useEffect, ReactNode } from "react";
import {
	Home,
	User,
	Settings,
	FileText,
	Mail,
	Calendar,
	Menu,
	X,
	ChevronLeft,
	ChevronRight,
	ChevronDown,
	ChevronUp,
	FolderOpen,
	Folder,
	Users,
	BarChart3,
	ShoppingCart,
	CreditCard,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Sidebar = ({
	children,
	menuItems,
}: {
	children?: ReactNode;
	menuItems: Array<Record<string, any>>;
}) => {
	const [isMobile, setIsMobile] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState({});
	const [currentPath, setCurrentPath] = useState("/admin"); // Simulate current page

	// change selected sidebar item
	const pathname = usePathname();
	useEffect(()=>{
		setCurrentPath(pathname);
	}, [pathname])

	// Check if device is mobile and auto-expand parent items
	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIfMobile();
		window.addEventListener("resize", checkIfMobile);

		// Auto-expand parent items if sub-item is active
		const autoExpandParents = () => {
			const newExpandedItems = {};
			menuItems.forEach((item, index) => {
				if (item.subItems) {
					const hasActiveSubItem = item.subItems.some(
						(subItem) => subItem.href === currentPath
					);
					if (hasActiveSubItem) {
						newExpandedItems[index] = true;
					}
				}
			});
			setExpandedItems((prev) => ({ ...prev, ...newExpandedItems }));
		};

		autoExpandParents();

		return () => window.removeEventListener("resize", checkIfMobile);
	}, [currentPath]);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const toggleSubMenu = (index) => {
		setExpandedItems((prev) => ({
			...prev,
			[index]: !prev[index],
		}));
	};

	// Helper functions for active states
	const isItemActive = (item) => {
		return item.href === currentPath;
	};

	const isParentActive = (item) => {
		if (!item.subItems) return false;
		return item.subItems.some((subItem) => subItem.href === currentPath);
	};

	const handleNavClick = (href, e) => {
		// e.preventDefault();
		setCurrentPath(href);
		if (isMobile) {
			toggleMobileMenu();
		}
	};

 	// Mobile Mode
	if (isMobile) {
		return (
			<>
				{/* Mobile Menu Button */}
				<button
					onClick={toggleMobileMenu}
					className='fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg md:hidden'
				>
					{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>

				{/* Mobile Sidebar Overlay */}
				{mobileMenuOpen && (
					<div className='fixed inset-0 z-40 md:hidden'>
						<div
							className='absolute inset-0 bg-black bg-opacity-50'
							onClick={toggleMobileMenu}
						/>
						<div className='relative w-64 h-full bg-white shadow-xl flex flex-col'>
							<div className='p-6 border-b border-gray-200 flex-shrink-0'>
								<h2 className='text-xl font-bold text-gray-800'>Menu</h2>
							</div>

							{/* Scrollable Navigation Area */}
							<div className='flex-1 overflow-y-auto p-6'>
								<nav className='space-y-2'>
									{menuItems.map((item, index) => {
										const Icon = item.icon;
										const hasSubItems =
											item.subItems && item.subItems.length > 0;
										const isItemExpanded = expandedItems[index];

										return (
											<div key={index}>
												{hasSubItems ? (
													<button
														onClick={() => toggleSubMenu(index)}
														className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${
															isParentActive(item)
																? "bg-blue-100 text-blue-700 font-medium"
																: "text-gray-700 hover:bg-gray-100"
														}`}
													>
														<div className='flex items-center'>
															<Icon size={20} className='mr-3' />
															<span className='font-medium'>{item.label}</span>
														</div>
														{isItemExpanded ? (
															<ChevronUp size={16} />
														) : (
															<ChevronDown size={16} />
														)}
													</button>
												) : (
													<Link
														href={item.href}
														onClick={(e) => handleNavClick(item.href, e)}
														className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
															isItemActive(item)
																? "bg-blue-600 text-white font-medium"
																: "text-gray-700 hover:bg-gray-100"
														}`}
													>
														<Icon size={20} className='mr-3' />
														<span className='font-medium'>{item.label}</span>
													</Link>
												)}

												{/* Sub Items */}
												{hasSubItems && isItemExpanded && (
													<div className='ml-6 mt-2 space-y-1'>
														{item.subItems.map((subItem, subIndex) => {
															const SubIcon = subItem.icon;
															return (
																<Link
																	key={subIndex}
																	href={subItem.href}
																	onClick={(e) =>
																		handleNavClick(subItem.href, e)
																	}
																	className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
																		isItemActive(subItem)
																			? "bg-blue-600 text-white font-medium"
																			: "text-gray-600 hover:bg-gray-50"
																	}`}
																>
																	<SubIcon size={16} className='mr-3' />
																	<span className='text-sm'>
																		{subItem.label}
																	</span>
																</Link>
															);
														})}
													</div>
												)}
											</div>
										);
									})}
								</nav>
							</div>
						</div>
					</div>
				)}
				{children}
			</>
		);
	}

	// Desktop Mode (Mini/Expanded)
	const sidebarWidth = isExpanded ? "w-64" : "w-16";
	const hoveredWidth = isHovered && !isExpanded ? "w-64" : sidebarWidth;
	const isShowingContent = isExpanded || isHovered;

	return (
		<div className='hidden md:block'>
			{/* Sidebar */}
			<div
				className={`fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300 ease-in-out z-30 flex flex-col ${
					isHovered && !isExpanded ? "shadow-2xl" : "shadow-lg"
				}`}
				style={{
					width: isExpanded ? "256px" : isHovered ? "256px" : "64px",
				}}
				onMouseEnter={() => !isExpanded && setIsHovered(true)}
				onMouseLeave={() => !isExpanded && setIsHovered(false)}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-gray-800 flex-shrink-0'>
					<div className='flex items-center'>
						<div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center'>
							<span className='text-white font-bold text-sm'>L</span>
						</div>
						{isShowingContent && (
							<h1 className='ml-3 text-lg font-semibold whitespace-nowrap overflow-hidden'>
								Logo
							</h1>
						)}
					</div>

					{isShowingContent && (
						<button
							onClick={toggleExpanded}
							className='p-1 rounded-md hover:bg-gray-800 transition-colors duration-200'
						>
							{isExpanded ? (
								<ChevronLeft size={16} />
							) : (
								<ChevronRight size={16} />
							)}
						</button>
					)}
				</div>

				{/* Scrollable Navigation */}
				<div className='flex-1 overflow-y-auto'>
					<nav className='mt-6 px-2 pb-20'>
						{menuItems.map((item, index) => {
							const Icon = item.icon;
							const hasSubItems = item.subItems && item.subItems.length > 0;
							const isItemExpanded = expandedItems[index];

							return (
								<div key={index} className='mb-2'>
									{hasSubItems ? (
										<button
											onClick={() => isShowingContent && toggleSubMenu(index)}
											className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
												isParentActive(item)
													? "bg-blue-600 text-white"
													: "text-gray-300 hover:bg-gray-800 hover:text-white"
											}`}
										>
											<div className='flex items-center'>
												<Icon size={20} className='flex-shrink-0' />
												{isShowingContent && (
													<span className='ml-3 whitespace-nowrap overflow-hidden font-medium'>
														{item.label}
													</span>
												)}
											</div>
											{isShowingContent && (
												<div className='ml-2'>
													{isItemExpanded ? (
														<ChevronUp size={16} />
													) : (
														<ChevronDown size={16} />
													)}
												</div>
											)}

											{/* Tooltip for mini mode when not hovered */}
											{!isExpanded && !isHovered && (
												<div className='absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
													{item.label}
												</div>
											)}
										</button>
									) : (
										<Link
											href={item.href}
											onClick={(e) => handleNavClick(item.href, e)}
											className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 group ${
												isItemActive(item)
													? "bg-blue-600 text-white"
													: "text-gray-300 hover:bg-gray-800 hover:text-white"
											}`}
										>
											<Icon size={20} className='flex-shrink-0' />
											{isShowingContent && (
												<span className='ml-3 whitespace-nowrap overflow-hidden font-medium'>
													{item.label}
												</span>
											)}

											{/* Tooltip for mini mode when not hovered */}
											{!isExpanded && !isHovered && (
												<div className='absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50'>
													{item.label}
												</div>
											)}
										</Link>
									)}

									{/* Sub Items */}
									{hasSubItems && isItemExpanded && isShowingContent && (
										<div className='ml-6 mt-1 space-y-1'>
											{item.subItems.map((subItem, subIndex) => {
												const SubIcon = subItem.icon;
												return (
													<Link
														key={subIndex}
														href={subItem.href}
														onClick={(e) => handleNavClick(subItem.href, e)}
														className={`flex items-center px-3 py-2 rounded-lg transition-all duration-200 ${
															isItemActive(subItem)
																? "bg-blue-500 text-white"
																: "text-gray-400 hover:bg-gray-800 hover:text-white"
														}`}
													>
														<SubIcon size={16} className='flex-shrink-0' />
														<span className='ml-3 text-sm whitespace-nowrap overflow-hidden'>
															{subItem.label}
														</span>
													</Link>
												);
											})}
										</div>
									)}
								</div>
							);
						})}
					</nav>
				</div>

				{/* Footer - Fixed at bottom */}
				{isShowingContent && (
					<div className='p-4 border-t border-gray-800 flex-shrink-0'>
						<div className='flex items-center'>
							<div className='w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center'>
								<User size={16} />
							</div>
							<div className='ml-3 overflow-hidden'>
								<p className='text-sm font-medium text-white whitespace-nowrap'>
									John Doe
								</p>
								<p className='text-xs text-gray-400 whitespace-nowrap'>
									john@example.com
								</p>
							</div>
						</div>
					</div>
				)}

				{/* Toggle button for mini mode - Fixed at bottom */}
				{!isHovered && !isExpanded && (
					<button
						onClick={toggleExpanded}
						className='absolute bottom-4 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200'
					>
						<ChevronRight size={16} />
					</button>
				)}
			</div>

			{/* Main Content Area - shifts when sidebar is expanded */}
			<div
				className={`transition-all duration-300 ease-in-out ${
					isExpanded ? "ml-64" : "ml-16"
				}`}
			>
				<div className='p-8'>{children}</div>
			</div>
		</div>
	);
};

export default Sidebar;
