import { act, cleanup, fireEvent, render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, test } from 'vitest'

import { useForm } from '../lib'
import { Insight, Util } from './shared'

beforeEach(cleanup)

describe('Validation', () => {
  test('Basic', async () => {
    function Component() {
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
    function Component() {
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

  // https://github.com/testing-library/react-testing-library/issues/828
  test.skip('Invalid rule', async () => {
    function Component() {
      const { field } = useForm(
        { username: '' },
        {
          rules: {
            username: [
              // @ts-ignore Give an invalid rules and expect to fail
              5,
            ],
          },
        }
      )

      return (
        <form>
          <input data-testid="field" {...field('username')} />
        </form>
      )
    }

    render(<Component />)
    const field = await Util.find('field')
    await act(() => {
      Util.writeToField(field, 'abc')
    })
  })

  test('Invalid dependency on other component', async () => {
    function Component() {
      const { errors, field } = useForm(
        { min: 10, max: 20 },
        {
          rules: {
            max: (value, form) => value > form.min,
          },
        }
      )
      return (
        <form>
          <input type="number" {...field('min')} />
          <input type="number" {...field('max')} data-testid="max" />
          <Insight.Portal data={errors} />
        </form>
      )
    }

    render(<Component />)
    const field = await Util.find('max')
    const value = 5
    await act(() => {
      fireEvent.change(field, { target: { value } })
    })
    await Insight.verify({ max: true })
  })
})
