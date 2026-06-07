"use client";
import { useForm } from "@tanstack/react-form";
import * as React from "react";
import type { AnyFieldApi } from "@tanstack/react-form";

function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em className='text-red-500 text-sm'>
					{field.state.meta.errors.join(", ")}
				</em>
			) : null}
			{field.state.meta.isValidating ? (
				<span className='text-blue-500 text-sm'>Validating...</span>
			) : null}
		</>
	);
}

export default function FromGenerator({ defaultValues, onSubmit, fields } : {}) {
	const form = useForm({
		defaultValues,
		onSubmit,
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div>
				{fields.map((props, i) => (
					<form.Field
						key={i}
						{...props}
						children={(field) => <FormField field={field} prop={props} />}
					/>
				))}
			</div>

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
				children={([canSubmit, isSubmitting]) => (
					<div className='flex gap-4 mt-6'>
						<button
							type='submit'
							disabled={!canSubmit}
							className='px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300'
						>
							{isSubmitting ? "..." : "Submit"}
						</button>
						<button
							type='button'
							onClick={(e) => {
								e.preventDefault();
								form.reset();
							}}
							className='px-4 py-2 bg-gray-500 text-white rounded-lg'
						>
							Reset
						</button>
					</div>
				)}
			/>
		</form>
	);
}

const FIELD_TYPES = {
	TEXT: "text",
	EMAIL: "email",
	PASSWORD: "password",
	NUMBER: "number",
	TEXTAREA: "textarea",
	SELECT: "select",
	CHECKBOX: "checkbox",
	RADIO: "radio",
	DATE: "date",
	CUSTOM: "custom",
};

// Field Components
const TextInput = ({ field, prop }) => (
	<div>
		<input
			type={prop?.type || "text"}
			id={field?.name}
			name={field?.name}
			value={field?.state?.value || ""}
			onBlur={field?.handleBlur}
			onChange={(e) => field.handleChange(e.target.value)}
			placeholder={prop?.placeholder}
			className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
				field?.state.meta.isTouched && !field.state.meta.isValid
					? "border-red-500"
					: "border-gray-300"
			}`}
		/>
		<FieldInfo field={field} />
	</div>
);

const TextArea = ({ field, prop }) => (
	<div>
		<textarea
			value={field.state.value || ""}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			placeholder={prop.placeholder}
			rows={prop.rows || 3}
			className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical transition-colors ${
				field.state.meta.isTouched && !field.state.meta.isValid
					? "border-red-500"
					: "border-gray-300"
			}`}
		/>
		<FieldInfo field={field} />
	</div>
);

const SelectInput = ({ field, prop }) => (
	<div>
		<select
			value={field.state.value || ""}
			onChange={(e) => field.handleChange(e.target.value)}
			onBlur={field.handleBlur}
			className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
				field.state.meta.isTouched && !field.state.meta.isValid
					? "border-red-500"
					: "border-gray-300"
			}`}
		>
			<option value=''>Select an option...</option>
			{prop.options?.map((option, index) => (
				<option key={index} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
		<FieldInfo field={field} />
	</div>
);

const CheckboxInput = ({ field, prop }) => {
	const handleCheckboxChange = (optionValue, isChecked) => {
		if (prop.multiple) {
			const currentValues = field.state.value || [];
			if (isChecked) {
				field.handleChange([...currentValues, optionValue]);
			} else {
				field.handleChange(currentValues.filter((val) => val !== optionValue));
			}
		} else {
			field.handleChange(isChecked);
		}
	};

	if (prop.multiple && prop.options) {
		return (
			<div>
				<div className='space-y-2'>
					{prop.options.map((option, index) => (
						<label
							key={index}
							className='flex items-center space-x-2 cursor-pointer'
						>
							<input
								type='checkbox'
								checked={(field.state.value || []).includes(option.value)}
								onChange={(e) =>
									handleCheckboxChange(option.value, e.target.checked)
								}
								className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
							/>
							<span className='text-sm text-gray-700'>{option.label}</span>
						</label>
					))}
				</div>
				<FieldInfo field={field} />
			</div>
		);
	}

	return (
		<div>
			<label className='flex items-center space-x-2 cursor-pointer'>
				<input
					type='checkbox'
					checked={field.state.value || false}
					onChange={(e) => handleCheckboxChange(null, e.target.checked)}
					className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
				/>
				<span className='text-sm text-gray-700'>
					{prop.label || "Yes, I agree"}
				</span>
			</label>
			<FieldInfo field={field} />
		</div>
	);
};

const RadioInput = ({ field, prop }) => (
	<div>
		<div className='space-y-2'>
			{prop.options?.map((option, index) => (
				<label
					key={index}
					className='flex items-center space-x-2 cursor-pointer'
				>
					<input
						type='radio'
						name={field.name}
						value={option.value}
						checked={field.state.value === option.value}
						onChange={() => field.handleChange(option.value)}
						className='w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500'
					/>
					<span className='text-sm text-gray-700'>{option.label}</span>
				</label>
			))}
		</div>
		<FieldInfo field={field} />
	</div>
);

// Form Field Component
const FormField = ({ field, prop }) => {
	const renderField = () => {
		// Handle custom components
		if (prop.type === FIELD_TYPES.CUSTOM && prop.customComponent) {
			return prop.customComponent(field, prop);
		}

		switch (
			prop.type // Fixed: use prop.type instead of field.type
		) {
			case FIELD_TYPES.TEXT:
			case FIELD_TYPES.EMAIL:
			case FIELD_TYPES.PASSWORD:
			case FIELD_TYPES.NUMBER:
			case FIELD_TYPES.DATE:
				return <TextInput field={field} prop={prop} />;
			case FIELD_TYPES.TEXTAREA:
				return <TextArea field={field} prop={prop} />;
			case FIELD_TYPES.SELECT:
				return <SelectInput field={field} prop={prop} />;
			case FIELD_TYPES.CHECKBOX:
				return <CheckboxInput field={field} prop={prop} />;
			case FIELD_TYPES.RADIO:
				return <RadioInput field={field} prop={prop} />;
			default:
				return <TextInput field={field} prop={prop} />;
		}
	};

	return (
		<div className='mb-6'>
			<label className='block text-sm font-medium text-gray-700 mb-2'>
				{prop.label}
				{prop.required && <span className='text-red-500 ml-1'>*</span>}
			</label>
			{renderField()}
		</div>
	);
};
