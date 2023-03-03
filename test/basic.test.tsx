import { act, cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, expect, test } from 'vitest'

import { useForm } from '../lib'
import { Insight, Util } from './shared'

beforeEach(cleanup)

describe('Field', () => {
  test('Basic Form', async () => {
    function Component() {
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

    render(<Component />)
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

  test.skip('Checkbox', async () => {
    function Component() {
      const { field, form } = useForm({ cool: false })
      return (
        <form>
          <input
            data-testid="field"
            type="checkbox"
            {...field('cool', {
              setter: 'checked',
              getter: 'onChange',
              extractor: (e) => e.target.checked,
            })}
          />
          <Insight.Portal data={form} />
        </form>
      )
    }

    render(<Component />)
    const field = await Util.find('field')
    expect(field.checked).toBe(false)
    await Insight.verify({ cool: false })
    await act(() => {
      // Bugged for now
      fireEvent.click(field)
    })
    expect(field.checked).toBe(true)
    await Insight.verify({ cool: true })
  })

  test('Select', async () => {
    function Component() {
      const { form, field } = useForm({ letter: '' })
      return (
        <>
          <select data-testid="field" {...field('letter')}>
            <option value="a">A</option>
            <option value="b">B</option>
            <option value="c">C</option>
          </select>
          <Insight.Portal data={form} />
        </>
      )
    }

    render(<Component />)
    const field = await Util.find('field')
    const value = 'b'
    await act(() => {
      fireEvent.change(field, { target: { value } })
    })
    expect(field.value).toBe(value)
    await Insight.verify({ letter: value })
  })

  test('Field sync', async () => {
    const value = 'foo'
    function Component() {
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
