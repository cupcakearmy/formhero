import React, { useState, useEffect } from 'react'

export type useFormExtractor = (from: any) => any

export type useFormOptions = {
  extractor?: useFormExtractor
  getter?: string
  setter?: string
}

export type useFormValidatorFunctionReturn = boolean | string
export type useFormValidatorFunction = (s: any) => useFormValidatorFunctionReturn | Promise<useFormValidatorFunctionReturn>
export type useFormValidatorMethod = useFormValidatorFunction | RegExp

export type useFormValidatorObject = {
  validator: useFormValidatorMethod
  message?: string
}

export type useFormValidator = useFormValidatorMethod | useFormValidatorObject

export type useFormValidatorParameter = useFormValidator | useFormValidator[]

export const HTMLInputExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value
export const HTMLCheckboxExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.checked

function isFormValidatorObject(validator: useFormValidatorMethod | useFormValidatorObject): validator is useFormValidatorObject {
  return validator.constructor.name === 'Object'
}

const defaultErrorMessage = (key: any) => `Error in ${key}`

export const useForm = <T extends object, U extends { [key in keyof T]: useFormValidatorParameter }, E extends { [key in keyof U]?: string }>(
  init: T,
  validators: Partial<U> = {},
  options: useFormOptions = {}
) => {
  const [form, setForm] = useState<T>(init)

  const [errors, setErrors] = useState<Partial<E>>({})
  const [isValid, setIsValid] = useState(true)

  useEffect(() => {
    setIsValid(!Object.values(errors).reduce((acc, cur) => acc || cur !== undefined, false))
  }, [errors])

  const _set = <A extends keyof T>(key: A, value: T[A]) => {
    setForm({
      ...form,
      [key]: value,
    })
  }

  const _validateAll = async (value: any, object: useFormValidator): Promise<useFormValidatorFunctionReturn> => {
    const validator = isFormValidatorObject(object) ? object.validator : object

    if (validator.constructor.name === 'Function') return (validator as useFormValidatorFunction)(value)
    else if (validator.constructor.name === 'AsyncFunction') return await (validator as useFormValidatorFunction)(value)
    else if (validator.constructor.name === 'RegExp') return (validator as RegExp).test(value)
    else return false
  }

  const _getErrorMessage = (result: useFormValidatorFunctionReturn, key: keyof T, validator: useFormValidatorMethod | useFormValidatorObject) =>
    result === true ? undefined : result.constructor.name === 'String' ? result : isFormValidatorObject(validator) && validator.message ? validator.message : defaultErrorMessage(key)

  const _validate = (key: keyof T, value: any) => {
    const validator: useFormValidatorParameter | undefined = validators[key]
    if (!validator) return

    if (Array.isArray(validator)) {
      Promise.all(validator.map(v => _validateAll(value, v))).then(results => {
        const i = results.findIndex(result => result !== true)
        setErrors({
          ...errors,
          [key]: i === -1 ? undefined : _getErrorMessage(results[i], key, validator[i]),
        })
      })
    } else {
      _validateAll(value, validator).then(result => {
        setErrors({
          ...errors,
          [key]: _getErrorMessage(result, key, validator),
        })
      })
    }
  }

  const update = <A extends keyof T>(key: A, extractor = options.extractor) => (value: T[A]) => {
    const extracted = extractor ? extractor(value) : HTMLInputExtractor(value)
    _set(key, extracted)
    _validate(key, extracted)
  }

  const field = (key: keyof T, opts: useFormOptions = {}) => ({
    [opts.getter || options.getter || 'onChange']: update(key, opts.extractor),
    [opts.setter || options.setter || 'value']: form[key] as any,
  })

  return { form, update, field, errors, isValid, setForm, setErrors, setField: _set }
}
