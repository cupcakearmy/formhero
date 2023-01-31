import React from 'react'

import { useForm } from '../dist'
import { mount } from './common'

const Index: React.FC = () => {
  const { field, form } = useForm({
    username: 'unicorn',
    password: '',
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        console.log(form)
      }}
    >
      <h1>Simple</h1>

      <input {...field('username')} placeholder="Username" />
      <input {...field('password')} placeholder="Password" type="password" />

      <input type="submit" />
    </form>
  )
}

mount(Index)
