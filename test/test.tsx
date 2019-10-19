import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../'

const TextError: React.FC<{ error?: string }> = ({ error }) => (!error ? null : <div className="has-text-danger">{error}</div>)

const initial = {
  username: '',
  password: '',
  type: 'formhero',
  awesome: true,
}

const Index: React.FC = () => {
  const { field, form, errors, isValid, setForm, setErrors } = useForm(initial, {
    username: [
      /^test/,
      {
        validator: async () => {
          return true
        },
        message: 'Digits please',
      },
    ],
    password: {
      validator: /^.{3,}$/,
      message: 'To short',
    },
    awesome: value => !!value,
  })

  const _submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form, errors, isValid)
  }

  const reset = () => {
    setForm(initial)
  }

  const error = () => {
    setErrors({
      username: 'nope',
    })
  }

  return (
    <div>
      <form onSubmit={_submit}>
        <div>Username</div>
        <input className="input" {...field('username')} />
        <TextError error={errors.username} />
        <br />
        <br />

        <div>Password</div>
        <input className="input" {...field('password')} />
        <TextError error={errors.password} />
        <br />
        <br />

        <div>Which one to choose?</div>
        <div className="select">
          <select {...field('type')}>
            <option value="redux-form">Redux-Form</option>
            <option value="react-hook-forms">React-Hook-Forms</option>
            <option value="formik">Formik</option>
            <option value="formhero">FormHero</option>
          </select>
        </div>
        <br />
        <br />

        <label className="checkbox">
          <input
            type="checkbox"
            {...field('awesome', {
              setter: 'checked',
              getter: 'onChange',
              extractor: e => e.target.checked,
            })}
          />
          Is it awesome?
        </label>
        <TextError error={errors.awesome} />
        <br />
        <br />

        <button className="button" type="submit">
          Go 🚀
        </button>

        <br />
        <br />
        <button className="button" onClick={reset}>
          Reset 🔥
        </button>

        <br />
        <br />
        <button className="button" onClick={error}>
          Set Error ❌
        </button>
      </form>
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'))
