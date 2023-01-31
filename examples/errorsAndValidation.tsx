import React from 'react'

import { useForm } from '../'
import { mount } from './common'

const Index: React.FC = () => {
  const { field, form, errors, isValid } = useForm(
    {
      username: '',
      email: '',
      password: '',
    },
    {
      rules: {
        username: (value) => value.length > 3,
        email: {
          rule: /@/,
          message: 'Must contain an @',
        },
        password: [
          {
            rule: /[A-Z]/,
            message: 'Must contain an uppercase letter',
          },
          {
            rule: /[\d]/,
            message: 'Must contain a digit',
          },
        ],
      },
    }
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (isValid) console.log(form)
      }}
    >
      <h1>Errors & Validation</h1>

      <input {...field('username')} placeholder="Username" />
      {errors.username && 'Must be longer than 3'}

      <input {...field('email')} placeholder="EMail" />
      {errors.email}

      <input {...field('password')} placeholder="Password" type="password" />
      {errors.password}

      <input type="submit" />
    </form>
  )
}

mount(Index)
