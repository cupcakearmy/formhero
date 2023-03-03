import { act, cleanup, render } from '@testing-library/react'
import React from 'react'
import { beforeEach, describe, test } from 'vitest'

import { useForm } from '../lib'
import { DirectReturnInput, NumberField } from './blocks'
import { Insight, Util } from './shared'

beforeEach(cleanup)

describe('Options', () => {
  test('Custom component props', async () => {
    function Component() {
      const { form, field } = useForm({ foo: 5 })

      return (
        <div>
          <NumberField
            {...field('foo', {
              setter: 'number',
              getter: 'update',
              extractor: null,
            })}
          />
          <Insight.Portal data={form} />
        </div>
      )
    }

    render(<Component />)
    const node = await Util.find('field')
    await act(() => {
      Util.writeToField(node, '123')
    })
    Insight.verify({ foo: 123 })
  })

  test('Disable default extractor', async () => {
    function Component() {
      const { form, field } = useForm({ username: '' })

      return (
        <div>
          <DirectReturnInput {...field('username', { extractor: null })} />
          <Insight.Portal data={form} />
        </div>
      )
    }

    render(<Component />)
    const node = await Util.find('field')
    await act(() => {
      Util.writeToField(node, '123')
    })
    Insight.verify({ username: '123' })
  })
})
