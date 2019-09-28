![Logo](./.github/Logo.svg)

![Version](https://badgen.net/npm/v/formhero)
![Dependencies](https://badgen.net/david/dep/cupcakearmy/formhero)
![Size Badge](https://badgen.net/bundlephobia/minzip/formhero)

**Fully customisable react form utility.**

## 🌈 Features

- Typescript compatible
- Customizable extractor, validator, getter and setters. (More in the docs)
- **0** Dependencies
- Tiny
- React Hooks

###### Installation

```
npm i formhero
```

## 🚀 Quickstart

```typescript
import ReactDOM from 'react-dom'
import { useForm } from 'formhero'

const Form = () => {

  const { auto, form } = useForm({
    username: '',
    password: '',
  })

  const _submit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(form)
  }

  return (
    <div>
      <form onSubmit={_submit}>
        
        <input {...auto('username')} />
        <input {...auto('password')} />

        <button type="submit">Go 🚀</button>
      </form>
    </div>
  )
}
```

## 🔥 Examples

### Validation

```typescript
const Form = () => {

  const { auto, form, errors } = useForm({
    username: '',
    email: '',
    password: ''
  }, {
    username: value => value.length > 3,
    email: {
      validator: /@/,
      message: 'Must contain an @',
    },
    password: [
      {
        validator: /[A-Z]/,
        message: 'Must contain an uppercase letter'
      },
      {
        validator: /[\d]/,
        message: 'Must contain a digit'
      },
    ]
  })

  return (
    <form>

      <h1>Errors & Validation</h1>

      <input {...auto('username')} placeholder="Username" />
      {errors.username && 'Must be longer than 3'}

      <input {...auto('email')} placeholder="EMail" />
      {errors.email}

      <input {...auto('password')} placeholder="Password" type="password" />
      {errors.password}

    </form>
  )
}
```

### Easy Customization

Often it happens that you use a specific input or framework, so the default getter, setter and extractor for the event won't cut it. No worries: formhero got you covered!

```typescript
const Form = () => {

  const { auto, form, errors } = useForm({
    awesome: true,
  })

  return (
    <form onSubmit={e => {
      e.preventDefault()
      console.log(form)
    }}>

      <h1>Custom</h1>

      <label>
        <input type="checkbox" {...auto('awesome', {
          setter: 'checked',
          getter: 'onChange',
          extractor: (e) => e.target.checked
        })} />
        Is it awesome?
          </label>

      <input type="submit" />

    </form>
  )
}
```

## 📖 Docs

### `useForm`

```typescript
const {auto, errors, update, form, isValid} = useForm(initial, validators, options)
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
