import * as React from 'react'
import { useEffect, useState } from 'react'

export type FieldOptions<G extends string = 'onChange', S extends string = 'value'> = {
  extractor?: useFormExtractor
  getter: G
  setter: S
}

type RuleFunctionReturn = boolean | string
type RuleFunction<I> = (value: I) => RuleFunctionReturn | Promise<RuleFunctionReturn>
type Rule<I> = RuleFunction<I> | RegExp
type RuleObject<I> = Rule<I> | { rule: Rule<I>; message: string }
type RuleSet<I> = RuleObject<I> | RuleObject<I>[]

function isSimpleRule<I>(obj: RuleObject<I>): obj is Rule<I> {
  return obj instanceof RegExp || typeof obj === 'function'
}

export type useFormExtractor = (from: any) => any
export const HTMLInputExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value
export const HTMLCheckboxExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.checked

export type FormOptions<R> = {
  rules: R
  // fields: FieldOptions
}

// Form = Type of form
// R = Rules, derived from F
// E = Errors, derived from F
export const useForm = <Form extends object, R extends { [K in keyof Form]?: RuleSet<Form[K]> }, E extends { [key in keyof R]?: RuleFunctionReturn }>(init: Form, options?: FormOptions<R>) => {
  const validators: R = options?.rules ?? ({} as R)

  const [form, setForm] = useState<Form>(init)
  const [errors, setErrors] = useState<E>({} as E)
  const [isValid, setIsValid] = useState<boolean>(true)

  useEffect(() => {
    setIsValid(!Object.values(errors).reduce((acc, cur) => acc || cur !== undefined, false))
  }, [errors])

  const setField = <A extends keyof Form>(key: A, value: Form[A]) => {
    setForm({
      ...form,
      [key]: value,
    })
  }

  async function applyRule<I>(value: any, rule: Rule<I>): Promise<RuleFunctionReturn> {
    if (typeof rule === 'function') return await rule(value)
    if (rule instanceof RegExp) return rule.test(value)
    throw new Error(`Unsupported validator: ${rule}`)
  }

  async function validate<K extends keyof Form>(key: K, value: Form[K]) {
    const set: RuleSet<Form[K]> | undefined = validators[key] as any
    if (!set) return

    const rules = Array.isArray(set) ? set : [set]
    let newValue = undefined
    for (const rule of rules) {
      const simple = isSimpleRule(rule)
      const fn = simple ? rule : rule.rule
      const result = await applyRule(value, fn)
      if (result !== true) {
        newValue = simple ? (typeof result === 'string' ? result : true) : rule.message
        break
      }
    }
    setErrors({
      ...errors,
      [key]: newValue,
    })
  }

  function update<A extends keyof Form, RAW = any>(key: A, extractor?: (e: RAW) => Form[A]) {
    return (value: RAW) => {
      const extracted = extractor ? extractor(value) : HTMLInputExtractor(value)
      setField(key, extracted)
      validate(key, extracted)
    }
  }

  type FieldReturn<K extends keyof Form, G extends string, S extends string> = { [getter in G]: ReturnType<typeof update<K>> } & { [setter in S]: Form[K] }
  function field<K extends keyof Form>(key: K): FieldReturn<K, 'onChange', 'value'>
  function field<K extends keyof Form, G extends string, S extends string>(key: K, opts: FieldOptions<G, S>): FieldReturn<K, G, S>
  function field<K extends keyof Form, G extends string, S extends string>(key: K, opts?: FieldOptions<G, S>): FieldReturn<K, G, S> {
    return {
      [opts?.getter || 'onChange']: update<K>(key, opts?.extractor),
      [opts?.setter || 'value']: form[key],
    } as FieldReturn<K, G, S>
  }

  return { form, field, errors, isValid, setForm, setErrors, setField }
}
