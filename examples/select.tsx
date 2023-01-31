import React from 'react'

import { useForm } from '../dist'
import { mount } from './common'

const Index: React.FC = () => {
  const { field, form } = useForm({
    type: 'formhero',
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(form)
      }}
    >
      <h1>Select</h1>

      <select {...field('type')}>
        <option value="redux-form">Redux-Form</option>
        <option value="react-hook-forms">React-Hook-Forms</option>
        <option value="formik">Formik</option>
        <option value="formhero">FormHero</option>
      </select>

      <input type="submit" />
    </form>
  )
}

mount(Index)
