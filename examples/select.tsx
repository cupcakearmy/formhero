import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../dist'

const Index: React.FC = () => {
  const { field, form, errors } = useForm({
    type: 'formhero',
  })

  return (
    <form
      onSubmit={e => {
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

ReactDOM.render(<Index />, document.getElementById('select'))
