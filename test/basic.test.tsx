import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import React, { useEffect } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'

import { useForm } from '../lib'

beforeEach(cleanup)

const Insight = {
  Portal({ data }: { data: any }) {
    return <div data-testid="result">{JSON.stringify(data)}</div>
  },
  async verify(obj: any) {
    const result = await screen.findByTestId('result')
    const data = JSON.parse(result.innerText)
    expect(data).toMatchObject(obj)
  },
}

const Util = {
  find<E extends HTMLElement = HTMLInputElement>(id: string) {
    return screen.findByTestId<E>(id)
  },
  writeToField(node: HTMLInputElement, value: string) {
    fireEvent.change(node, { target: { value } })
  },
}

describe('Field', () => {
  test('Basic Form', async () => {
    const BasicForm = () => {
      const form = useForm({ username: '', password: '' })
      const { field } = form
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <input data-testid="username" {...field('username')} />
          <input data-testid="password" {...field('password')} />
          <button data-testid="submit" type="submit">
            Go
          </button>
          <Insight.Portal data={form} />
        </form>
      )
    }

    render(<BasicForm />)
    async function inputIntoForm(id: string, value: string) {
      const node = await Util.find(id)
      await act(() => {
        Util.writeToField(node, value)
      })
      await Insight.verify({ form: { [id]: value } })
    }

    await inputIntoForm('username', 'foo')
    await inputIntoForm('password', 'bar')
  })

  test('setField', async () => {
    const value = 'foo'
    const Component = () => {
      const { field, setField, form } = useForm({ username: '', password: '' })
      useEffect(() => setField('username', value), [])
      return (
        <div>
          <input data-testid="field" {...field('username')}></input>
          <Insight.Portal data={form} />
        </div>
      )
    }
    render(<Component />)
    const node = await screen.findByTestId<HTMLInputElement>('field')
    expect(node.value).toBe(value)
    Insight.verify({ username: value, password: '' })
  })

  test('Field sync', async () => {
    const value = 'foo'
    const Component = () => {
      const { field, form } = useForm({ name: '' })
      return (
        <form>
          <input {...field('name')} data-testid="a" />
          <input {...field('name')} data-testid="b" />
          <Insight.Portal data={form} />
        </form>
      )
    }

    render(<Component />)
    const a = await Util.find('a')
    const b = await Util.find('b')
    await act(() => {
      Util.writeToField(a, value)
    })
    await Insight.verify({ name: value })
    expect(a.value).toBe(b.value)
  })
})

describe('Validation', () => {
  test('Basic', async () => {
    const Component = () => {
      const { errors, field } = useForm({ password: '' }, { rules: { password: [(p) => p.length > 8] } })

      return (
        <div>
          <input {...field('password')} data-testid="field" />
          <Insight.Portal data={errors} />
        </div>
      )
    }
    render(<Component />)
    const node = await Util.find('field')
    await act(() => {
      Util.writeToField(node, '123')
    })
    Insight.verify({ password: true })
  })

  test('Array of rules', async () => {
    const Component = () => {
      const { errors, field } = useForm({ password: '' }, { rules: { password: [(p) => p.length > 8, /#/] } })

      return (
        <div>
          <input {...field('password')} data-testid="field" />
          <Insight.Portal data={errors} />
        </div>
      )
    }
    render(<Component />)
    const node = await Util.find('field')
    await act(() => {
      Util.writeToField(node, '12345678')
    })
    Insight.verify({ password: true })
    await act(() => {
      Util.writeToField(node, '1234#5678')
    })
    Insight.verify({})
  })
})

// Is valid
// Reset / setForm
// Set error
// Checkbox
// Extractor
// Custom extractor
