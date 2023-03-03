import { cleanup, render } from '@testing-library/react'
import React, { useEffect } from 'react'
import { beforeEach, describe, expect, test } from 'vitest'

import { useForm } from '../lib'
import { Insight, Util } from './shared'

beforeEach(cleanup)

describe('Utility', () => {
  test('Manually set a single field', async () => {
    const value = 'foo'
    function Component() {
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
    const node = await Util.find('field')
    expect(node.value).toBe(value)
    Insight.verify({ username: value, password: '' })
  })

  test('Manually set the form state later on', async () => {
    const value = 'foo'
    function Component() {
      const { form, field, setForm } = useForm({ username: '' })

      useEffect(() => {
        setForm({
          username: value,
        })
      }, [])

      return (
        <form>
          <input data-testid="username" {...field('username')} />
          <Insight.Portal data={form} />
        </form>
      )
    }

    render(<Component />)
    const node = await Util.find('username')
    expect(node.value).toBe(value)
    await Insight.verify({ username: value })
  })
})
