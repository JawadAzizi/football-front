"use client";
'use memo'
import React from "react";
import {
	ChevronUp,
	ChevronDown,
	Download,
	Eye,
	ArrowUpDown,
	Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

// Main DataTable Component for Backend Integration
function ListGenerator({
	columns = [],
	data = [],
	title = "Data Table",
	actionButtons = undefined,

	// Backend Integration Props
	totalCount = 0,
	loading = false,

	// State Props (controlled from parent)
	pagination = { page: 0, size: 10 },
	sorting = [],
	sort = "",
	filters = [],
	filter = {},
	globalFilter = "",
	columnVisibility = {},
	rowSelection = {},

	// Callback Props
	onPaginationChange,
	onSortingChange,
	onSortChange,
	onFiltersChange,
	onFilterChange,
	onGlobalFilterChange,
	onColumnVisibilityChange,
	onRowSelectionChange,
	onExport,

	// Feature flags
	showSearch = true,
	showFilter = true,
	showExport = true,
	showColumnToggle = true,

	// Filter options (provided by parent/backend)
	filterOptions = {},
}) {
	const totalPages = Math.ceil(totalCount / pagination.size);
	// const currentSort = sort[0];

	// const handleSorting = (columnId) => {
	// 	let newSorting = [];
	// 	const existing = sorting.find((s) => s.id === columnId);

	// 	if (!existing) {
	// 		newSorting = [{ id: columnId, desc: false }];
	// 	} else if (!existing.desc) {
	// 		newSorting = [{ id: columnId, desc: true }];
	// 	}
	// 	// If desc is true, we remove sorting (empty array)

	// 	onSortingChange?.(newSorting);
	// };
	const handleSort = (accessorKey) => {
		let new_sort = undefined;
		if (!sort) {
			new_sort = `${accessorKey},asc`;
		} else if (sort == `${accessorKey},asc`) {
			new_sort = `${accessorKey},desc`;
		} else {
			new_sort = undefined;
		}
		// If desc is true, we remove sorting (empty array)
		onSortChange?.(new_sort);
	};

	// const handleFilter = (columnId, value) => {
	// 	let newFilters = filters.filter((f) => f.id !== columnId);
	// 	if (value && value !== "all") {
	// 		newFilters.push({ id: columnId, value });
	// 	}
	// 	onFiltersChange?.(newFilters);
	// };
	const handleFilter = (accessorKey, value) => {
		let new_filter = {...filter}
		if (value && value !== "all") {
			new_filter[accessorKey] =  value ;
		} else {
			delete new_filter[accessorKey]
		}
		onFilterChange?.(new_filter)
	};

	const handleGlobalFilterChange = (value) => {
		onGlobalFilterChange?.(value);
	};

	const handlePaginationChange = (newPagination) => {
		onPaginationChange?.(newPagination);
	};

	const toggleColumnVisibility = (columnId) => {
		const newVisibility = {
			...columnVisibility,
			[columnId]: !columnVisibility[columnId],
		};
		onColumnVisibilityChange?.(newVisibility);
	};

	const handleRowSelection = (index, checked) => {
		const newSelection = { ...rowSelection };
		if (checked) {
			newSelection[index] = true;
		} else {
			delete newSelection[index];
		}
		onRowSelectionChange?.(newSelection);
	};

	const handleSelectAll = (checked) => {
		if (checked) {
			const newSelection = {};
			data.forEach((_, index) => {
				const globalIndex = pagination.page * pagination.size + index;
				newSelection[globalIndex] = true;
			});
			onRowSelectionChange?.({ ...rowSelection, ...newSelection });
		} else {
			const newSelection = { ...rowSelection };
			data.forEach((_, index) => {
				const globalIndex = pagination.page * pagination.size + index;
				delete newSelection[globalIndex];
			});
			onRowSelectionChange?.(newSelection);
		}
	};

	const visibleColumns = columns.filter(
		(col) => columnVisibility[col.accessorKey] !== false
	);

	const selectedRowsOnCurrentPage = data.filter((_, index) => {
		const globalIndex = pagination.page * pagination.size + index;
		return rowSelection[globalIndex];
	}).length;

	return (
		<div className='w-full space-y-4 p-6'>
			<div className='flex items-center justify-between w-full'>
				<h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
				{loading && (
					<div className='text-sm text-muted-foreground text-slate-500'>
						Loading...
					</div>
				)}
				{actionButtons && <div>{actionButtons}</div>}
			</div>

			<div className='flex items-center justify-between  gap-4 p-4 bg-orange-500 text-white mb-0'>
				<div className='flex flex-1 items-center space-x-2  '>
					{showSearch && (
						<div className='relative'>
							<Search className='bg-white absolute left-2 top-2.5 h-4 w-4  text-slate-500' />
							<Input
								placeholder='Search...'
								value={globalFilter}
								onChange={(e) => handleGlobalFilterChange(e.target.value)}
								className='pl-8 max-w-sm bg-white text-gray-700'
							/>
						</div>
					)}

					{showFilter &&
						columns.slice(0).map((col) => {
							const options = filterOptions[col.accessorKey] || [];
							// const currentFilter = filters.find(
							// 	(f) => f.id === col.accessorKey
							// );
							

							if (options.length > 0) {
								return (
									<Select
										className='bg-white'
										key={col.accessorKey}
										value={filter[col.accessorKey] || "all"}
										onValueChange={(value) =>
											handleFilter(col.accessorKey, value)
										}
									>
										<SelectTrigger className='w-[180px] bg-white text-gray-700'>
											<SelectValue>{"All " + col.header}</SelectValue>
										</SelectTrigger>
										<SelectContent className='bg-white'>
											<SelectGroup>
												{options.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								);
							}
							return null;
						})}
				</div>

				<div className='flex items-center space-x-2'>
					{showColumnToggle && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant={"secondary"} size='sm' className='ml-auto'>
									<Eye className='mr-2 h-4 w-4' />
									View
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								{columns
									.filter((column) =>
										Object.hasOwn(columnVisibility, column.accessorKey)
									)
									.map((column) => (
										<DropdownMenuItem
											key={column.accessorKey}
											onClick={() => toggleColumnVisibility(column.accessorKey)}
										>
											<Checkbox
												checked={columnVisibility[column.accessorKey] !== false}
												onCheckedChange={() =>
													toggleColumnVisibility(column.accessorKey)
												}
												className='mr-2'
											/>
											{column.header}
										</DropdownMenuItem>
									))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}

					{showExport && (
						<Button
							variant={"secondary"}
							onClick={onExport}
							size='sm'
							disabled={loading}
						>
							<Download className='mr-2 h-4 w-4' />
							Export
						</Button>
					)}
				</div>
			</div>

			<div className='rounded-md border border-slate-200'>
				<Table>
					<TableHeader>
						<TableRow>
							{/* <TableHead className='w-[50px] bg-gray-200 border border-gray-300'>
								<Checkbox
									checked={
										selectedRowsOnCurrentPage === data.length && data.length > 0
									}
									onCheckedChange={handleSelectAll}
									disabled={loading}
								/>
							</TableHead> */}
							{visibleColumns.map((column) => (
								<TableHead
									key={column.accessorKey}
									className='bg-gray-200 border border-gray-300'
								>
									<Button
										variant='ghost'
										onClick={() => handleSort(column.accessorKey)}
										className='h-auto p-0 font-medium'
										disabled={loading}
									>
										{column.header}
										{/* {currentSort?.id === column.accessorKey &&
											(currentSort.desc ? (
												<ChevronDown className='ml-2 h-4 w-4' />
											) : (
												<ChevronUp className='ml-2 h-4 w-4' />
											))}
										{(!currentSort ||
											currentSort.id !== column.accessorKey) && (
											<ArrowUpDown className='ml-2 h-4 w-4 opacity-50' />
										)} */}
										{sort == `${column.accessorKey},asc` && (
											<ChevronUp className='ml-2 h-4 w-4' />
										)}
										{sort == `${column.accessorKey},desc` && (
											<ChevronDown className='ml-2 h-4 w-4' />
										)}
										{(sort == "" ||
											!sort.startsWith(column.accessorKey + ",")) && (
											<ArrowUpDown className='ml-2 h-4 w-4 opacity-50' />
										)}
									</Button>
								</TableHead>
								

							))}
						</TableRow>
						{/* <TableRow>
							{visibleColumns.map((column) => (

								<TableHead
									key={column.accessorKey}
									className='bg-gray-200 border border-gray-300 p-0'
								>
								<input placeholder="search something" type="text" className=" px-1 w-full h-full bg-white" />
								</TableHead>
							))}
						</TableRow> */}
					</TableHeader>
					<TableBody>
						{data.length ? (
							data.map((row, index) => {
								const globalIndex = pagination.page * pagination.size + index;
								return (
									<TableRow
										key={globalIndex}
										data-state={rowSelection[globalIndex] && "selected"}
									>
										{/* <TableCell>
											<Checkbox
												checked={!!rowSelection[globalIndex]}
												onCheckedChange={(checked) =>
													handleRowSelection(globalIndex, checked)
												}
												disabled={loading}
											/>
										</TableCell> */}
										{visibleColumns.map((column) => (
											<TableCell key={column.accessorKey}>
												{column.cell
													? column.cell({
															getValue: () => row[column.accessorKey],
															row,
													  })
													: row[column.accessorKey]}
											</TableCell>
										))}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell
									colSpan={visibleColumns.length + 1}
									className='h-24 text-center'
								>
									{loading ? "Loading..." : "No results."}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex items-center justify-between space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground text-slate-500'>
					{Object.keys(rowSelection).length} of {totalCount} row(s) selected.
				</div>
				<div className='flex items-center space-x-6 lg:space-x-8'>
					<div className='flex items-center space-x-2'>
						<p className='text-sm font-medium'>Rows per page</p>
						<select
							value={pagination.size.toString()}
							onChange={({ target: { value } }) => {
								handlePaginationChange({
									page: 0,
									size: Number(value),
								});
							}}
						>
							<option value='10'>10</option>
							<option value='20'>20</option>
							<option value='50'>50</option>
							<option value='100'>100</option>
							<option value='500'>500</option>
						</select>
					</div>
					<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
						Page {pagination.page + 1} of {totalPages || 1}
					</div>
					<div className='flex items-center space-x-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								handlePaginationChange((prev) => ({ ...prev, page: 0 }))
							}
							disabled={pagination.page === 0 || loading}
						>
							First
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								handlePaginationChange((prev) => ({
									...prev,
									page: pagination.page - 1,
								}))
							}
							disabled={pagination.page === 0 || loading}
						>
							Previous
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								handlePaginationChange((prev) => ({
									...prev,
									page: pagination.page + 1,
								}))
							}
							disabled={pagination.page >= totalPages - 1 || loading}
						>
							Next
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() =>
								handlePaginationChange((prev) => ({
									...prev,
									page: totalPages - 1,
								}))
							}
							disabled={pagination.page >= totalPages - 1 || loading}
						>
							Last
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default React.memo(ListGenerator);