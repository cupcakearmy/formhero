import React, { useState } from 'react'



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

export const HTMLInputExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value
export const HTMLCheckboxExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.checked

export const useForm = <T, U extends { [key in keyof T]: useFormValidator }, E extends { [key in keyof U]?: string }>(init: T, validators: Partial<U> = {}, options: useFormOptions = {}) => {
	const [form, setForm] = useState<T>(init)

	const [errors, setErrors] = useState<Partial<E>>({})

	const _set = (key: keyof T, value: any) => {
		setForm({
			...form,
			[key]: value,
		})
	}

	const _validateAll = async (value: any, validator: useFormValidatorMethod): Promise<boolean> => {
		if (validator.constructor.name === 'Function' || validator.constructor.name === 'AsyncFunction')
			return (validator as useFormValidatorFunction)(value)
		else if (validator.constructor.name === 'RegExp')
			return (validator as RegExp).test(value)
		else return false
	}

	const _getValidatorMessage = (key: keyof T): string => {
		// @ts-ignore
		if (validators[key] && validators[key].message) return validators[key].message
		else return `Error in: ${key}`
	}

	const _validate = (key: keyof T, value: any) => {
		const validator: useFormValidator | undefined = validators[key]
		if (!validator) return

		// @ts-ignore
		_validateAll(value, validator.constructor.name === 'Object' ? (validator as useFormValidatorObject).validator : validator)
			.then((valid: boolean) => {
				setErrors({
					...errors,
					[key]: valid
						? undefined
						: _getValidatorMessage(key),
				})
			})
	}

	const update = (key: keyof T, extractor = options.extractor) => (value: any) => {
		const extracted = extractor ? extractor(value) : HTMLInputExtractor(value)
		_set(key, extracted)
		_validate(key, extracted)
	}

	const auto = (key: keyof T, opts: useFormOptions = {}) => ({
		[opts.getter || options.getter || 'onChange']: update(key, opts.extractor),
		[opts.setter || options.setter || 'value']: form[key] as any,
	})

	return { form, update, auto, errors }
}