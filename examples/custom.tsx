import React from 'react'

import { useForm } from '../dist'
import { mount } from './common'

const Index: React.FC = () => {
  const { field, form } = useForm({
    awesome: true,
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(form)
      }}
    >
      <h1>Custom</h1>

      <label>
        <input
          type="checkbox"
          {...field('awesome', {
            setter: 'checked',
            getter: 'onChange',
            extractor: (e) => e.target.checked,
          })}
        />
        Is it awesome?
      </label>

      <input type="submit" />
    </form>
  )
}

mount(Index)
