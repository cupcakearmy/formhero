import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../'


const TextError: React.FC<{ error?: string }> = ({ error }) => !error
  ? null
  : <div className="has-text-danger">{error}</div>

const Index: React.FC = () => {

  const { auto, form, errors } = useForm({
    username: '',
    password: '',
    type: 'formhero',
    awesome: true,
  }, {
    username: /^test/,
    password: {
      validator: /^.{3,}$/,
      message: 'To short',
    },
    awesome: (value) => !!value
  })

  const _submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form, errors)
  }

  return (
    <div>
      <form onSubmit={_submit}>
        <div>Username</div>
        <input className="input" {...auto('username')} />
        <TextError error={errors.username} />
        <br /><br />

        <div>Password</div>
        <input className="input" {...auto('password')} />
        <TextError error={errors.password} />
        <br /><br />

        <div>Which one to choose?</div>
        <div className="select">
          <select {...auto('type')}>
            <option value="redux-form">Redux-Form</option>
            <option value="react-hook-forms">React-Hook-Forms</option>
            <option value="formik">Formik</option>
            <option value="formhero">FormHero</option>
          </select>
        </div>
        <br /><br />


        <label className="checkbox">
          <input type="checkbox" {...auto('awesome', {
            setter: 'checked',
            getter: 'onChange',
            extractor: (e) => e.target.checked
          })} />
          Is it awesome?
        </label>
        <TextError error={errors.awesome} />
        <br /><br />

        <button className="button" type="submit">Go 🚀</button>
      </form>
    </div>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'))

      // @ts-ignore
// if (module.hot) module.hot.accept()