import * as React from 'react'
import { useMemo, useState } from 'react'

// Possible future ideas
// TODO: Scroll to error field
// TODO: Focus on error field

export type FieldOptions<G extends string = 'onChange', S extends string = 'value', T = any> = {
  extractor?: useFormExtractor<T> | null
  getter?: G
  setter?: S
}

type RuleFunctionReturn = boolean | string
type RuleFunction<I, F> = (value: I, data: F) => RuleFunctionReturn | Promise<RuleFunctionReturn>
type Rule<I, F> = RuleFunction<I, F> | RegExp
type RuleObject<I, F> = Rule<I, F> | { rule: Rule<I, F>; message: string }
type RuleSet<I, F> = RuleObject<I, F> | RuleObject<I, F>[]

function isSimpleRule<I, F>(obj: RuleObject<I, F>): obj is Rule<I, F> {
  return obj instanceof RegExp || typeof obj === 'function'
}

export type useFormExtractor<T = any> = (from: any) => T
export const NoExtractor: useFormExtractor = (v: unknown) => v
export const HTMLInputExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.value
export const HTMLCheckboxExtractor: useFormExtractor = (e: React.FormEvent<HTMLInputElement>) => e.currentTarget.checked

export type FormOptions<R> = {
  rules: R
}

// F = Type of form
// R = Rules, derived from F
// E = Errors, derived from F
export const useForm = <F extends object, R extends { [K in keyof F]?: RuleSet<F[K], F> }, E extends { [key in keyof R]?: RuleFunctionReturn }>(init: F, options?: FormOptions<R>) => {
  const validators: R = options?.rules ?? ({} as R)

  const [form, setForm] = useState<F>(init)
  const [errors, setErrors] = useState<E>({} as E)
  const isValid = useMemo(() => {
    return !Object.values(errors).reduce((acc, cur) => acc || cur !== undefined, false)
  }, [errors])

  const setField = <A extends keyof F>(key: A, value: F[A]) => {
    setForm({
      ...form,
      [key]: value,
    })
  }

  async function applyRule<I>(value: any, rule: Rule<I, F>): Promise<RuleFunctionReturn> {
    if (typeof rule === 'function') return await rule(value, form)
    if (rule instanceof RegExp) return rule.test(value)
    throw new Error(`Unsupported validator: ${rule}`)
  }

  async function validate<K extends keyof F>(key: K, value: F[K]) {
    const set: RuleSet<F[K], F> | undefined = validators[key] as any
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

  // Internal use
  function update<A extends keyof F>(key: A, extractor?: useFormExtractor<F[A]> | null) {
    return (value: any) => {
      const extracted = extractor ? extractor(value) : extractor === undefined ? HTMLInputExtractor(value) : value
      setField(key, extracted)
      validate(key, extracted)
    }
  }

  type FieldReturn<K extends keyof F, G extends string, S extends string> = { [getter in G]: ReturnType<typeof update<K>> } & { [setter in S]: F[K] }
  function field<K extends keyof F>(key: K): FieldReturn<K, 'onChange', 'value'>
  function field<K extends keyof F, G extends string, S extends string>(key: K, opts: FieldOptions<G, S, F[K]>): FieldReturn<K, G, S>
  function field<K extends keyof F, G extends string, S extends string>(key: K, opts?: FieldOptions<G, S, F[K]>): FieldReturn<K, G, S> {
    return {
      [opts?.getter || 'onChange']: update<K>(key, opts?.extractor),
      [opts?.setter || 'value']: form[key],
    } as FieldReturn<K, G, S>
  }

  return { form, field, errors, isValid, setForm, setErrors, setField }
}
