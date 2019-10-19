import React, { useState, useEffect } from 'react'



export type useFormExtractor = (from: any) => any

export type useFormOptions = {
	extractor?: useFormExtractor,
	getter?: string,
	setter?: string,
}

export type useFormValidatorFunction = ((s: any) => boolean | Promise<boolean>)
export type useFormValidatorMethod = useFormValidatorFunction | RegExp

export type useFormValidatorObject = {
	validator: useFormValidatorMethod,
	message?: string,
}

export type useFormValidator = useFormValidatorMethod | useFormValidatorObject

export type useFormValidatorParameter = useFormValidator | useFormValidator[]

export const HTMLInputExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value
export const HTMLCheckboxExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.checked

function isFormValidatorObject(validator: useFormValidatorMethod | useFormValidatorObject): validator is useFormValidatorObject {
	return validator.constructor.name === 'Object'
}

const defaultErrorMessage = (key: any) => `Error in ${key}`

export const useForm = <T, U extends { [key in keyof T]: useFormValidatorParameter }, E extends { [key in keyof U]?: string }>(init: T, validators: Partial<U> = {}, options: useFormOptions = {}) => {
	const [form, setForm] = useState<T>(init)

	const [errors, setErrors] = useState<Partial<E>>({})
	const [isValid, setIsValid] = useState(true);

	useEffect(() => {
		setIsValid(!Object.values(errors).reduce((acc, cur) => acc || cur !== undefined, false))
	}, [errors])

	const _set = (key: keyof T, value: any) => {
		setForm({
			...form,
			[key]: value,
		})
	}

	const _validateAll = async (value: any, object: useFormValidator): Promise<boolean> => {
		const validator = isFormValidatorObject(object) ? object.validator : object

		if (validator.constructor.name === 'Function')
			return (validator as useFormValidatorFunction)(value)
		else if (validator.constructor.name === 'AsyncFunction')
			return await (validator as useFormValidatorFunction)(value)
		else if (validator.constructor.name === 'RegExp')
			return (validator as RegExp).test(value)
		else return false
	}

	const _validate = (key: keyof T, value: any) => {
		const validator: useFormValidatorParameter | undefined = validators[key]
		if (!validator) return

		if (Array.isArray(validator)) {
			Promise.all(validator.map(v => _validateAll(value, v)))
				.then(result => {
					const index = result.indexOf(false)
					setErrors({
						...errors,
						[key]: index === -1
							? undefined
							: isFormValidatorObject(validator[index]) && (validator[index] as useFormValidatorObject).message
								? (validator[index] as useFormValidatorObject).message
								: defaultErrorMessage(key)
					})
				})
		} else {
			_validateAll(value, validator)
				.then(valid => {
					setErrors({
						...errors,
						[key]: valid
							? undefined
							: isFormValidatorObject(validator) && validator.message
								? validator.message
								: defaultErrorMessage(key)
					})
				})
		}
	}

	const update = (key: keyof T, extractor = options.extractor) => (value: any) => {
		const extracted = extractor ? extractor(value) : HTMLInputExtractor(value)
		_set(key, extracted)
		_validate(key, extracted)
	}

	const field = (key: keyof T, opts: useFormOptions = {}) => ({
		[opts.getter || options.getter || 'onChange']: update(key, opts.extractor),
		[opts.setter || options.setter || 'value']: form[key] as any,
	})

	return { form, update, field, errors, isValid }
}
