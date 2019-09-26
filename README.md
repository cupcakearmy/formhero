![Logo](./.github/Logo.svg)

![Version](https://badgen.net/npm/v/formhero)
![Dependencies](https://badgen.net/david/dep/cupcakearmy/formhero)
![Size Badge](https://badgen.net/bundlephobia/minzip/formhero)

**Fully customisable react form utility.**

## 🌈 Features

- Typescript compatible
- Customizable extractor, validator, getter and setters. (More in the docs)
- No Deps
- Tiny
- React Hooks

## 🚀 Quickstart

```typescript
import ReactDOM from 'react-dom'
import { useForm } from 'formhero'

const Form = () => {

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
        <input {...auto('username')} />
        {errors.username && 'Something went wrong'}
        <br />

        <div>Password</div>
        <input {...auto('password')} />
        <br />

        <div>Which one to choose?</div>
        <select {...auto('type')}>
          <option value="redux-form">Redux-Form</option>
          <option value="react-hook-forms">React-Hook-Forms</option>
          <option value="formik">Formik</option>
          <option value="formhero">FormHero</option>
        </select>
        <br />

        <div>Is it awesome?</div>
        <input type="checkbox" name="vehicle" {...auto('awesome', {
          setter: 'checked',
          getter: 'onChange',
          extractor: (e) => e.target.checked
        })} />
        <br />

        <button type="submit">Go 🚀</button>
      </form>
    </div>
  )
}
```

## 📖 Docs

### `useForm`

```typescript
const {auto, errors, update, form} = useForm(initial, validators, options)
```

### Initial

This is the base state of the form. Also the typescript types are inhered by this.

###### Example

```javascript
const initial = {
  username: 'defaultValue',
  password: '',
  rememberMe: true,
}
```

### Validators

A validator is an object that taked in either a `RegExp` or a `Function` (can be async). Optionally you can pass a message string that will be displayed instead of the default one.

###### Example: Regular Expression

```javascript
const validators = {
  // Only contains letters. 
  // This could also be a (also async) function that returns a boolean.
  username: /^[A-z]*$/,
}
```

###### Example: Function

```typescript
const validators = {
  username: (value: string) => value.lenght > 3,
}
```

###### Example: With Object

```javascript
const validators = {
  username: {
    validator: /^[A-z]*$/,
    message: 'My custom error message',
  }
}
```
