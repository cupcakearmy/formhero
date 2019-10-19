![Logo](https://raw.githubusercontent.com/cupcakearmy/formhero/master/.github/Logo.jpg)

![Version](https://badgen.net/npm/v/formhero)
![Dependencies](https://badgen.net/david/dep/cupcakearmy/formhero)
![Size Badge](https://badgen.net/bundlephobia/minzip/formhero)

**Fully customisable react form utility.**

## 🌈 Features

- Typescript compatible
- Customizable extractor, validator, getter and setters. (More in the docs)
- **0** Dependencies
- Tiny **~0.7kB**
- React Hooks

###### Installation

```
npm i formhero
```

### 👁 Demos

- [**_Live Web_**](https://cupcakearmy.github.io/formhero/)
- [**_Live Codesandbox_**](https://codesandbox.io/embed/formhero-simple-bdcx2?expanddevtools=1&fontsize=14)
- [**_Live React-Native_**](https://snack.expo.io/@cupcakearmy/useform)

### Links

- [Examples](#-examples-more-here)
- [Docs](#-documentation)
  - Contructor
    - [Initial State](#initial)
    - [Validators](#validators)
    - [Options](#options)
  - Returns
    - [field](#field)
    - [form](#form)
    - [errors](#errors)
    - [isValid](#isvalid)
    - [setField](#setfield)
    - [setForm](#setform)
    - [setErrors](#seterrors)

## 🤔 Motivation

So why write yet another form utility you might ask? First off, I don't like the Formik approach. In my humble opition formik is very verbose and requires lots of boilerplate. Also does not work with hooks. [react-hook-form](https://react-hook-form.com/) is a very cool library and it is the main inspiration for formhero. It does almost everything right... typescript, no deps, small, concise.

The problem that I found while using it was that 3rd party ui libs like [Ant Design](https://ant.design/) or [Fabric UI](https://developer.microsoft.com/en-us/fabric#/controls/web) do not always have the standart `onChange` or `value` props in their components. That is where react-hook-form starts falling apart. This is what formhero tries to address in the most minimalistic way possible, with as little code as needed. All in pure typescript and no deps.

## 🚀 Quickstart

```typescript
import ReactDOM from 'react-dom'
import { useForm } from 'formhero'

const Form = () => {
  const { field, form } = useForm({
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
        <input {...field('username')} />
        <input {...field('password')} />

        <button type="submit">Go 🚀</button>
      </form>
    </div>
  )
}
```

## 🔥 Examples [(More Here)](https://github.com/CupCakeArmy/formhero/tree/master/examples)

### Validation

```typescript
const Form = () => {
  const { field, form, errors } = useForm(
    {
      username: '',
      email: '',
      password: '',
    },
    {
      username: value => value.length > 3,
      email: {
        validator: /@/,
        message: 'Must contain an @',
      },
      password: [
        {
          validator: /[A-Z]/,
          message: 'Must contain an uppercase letter',
        },
        {
          validator: /[\d]/,
          message: 'Must contain a digit',
        },
      ],
    }
  )

  return (
    <form>
      <h1>Errors & Validation</h1>

      <input {...field('username')} placeholder="Username" />
      {errors.username && 'Must be longer than 3'}

      <input {...field('email')} placeholder="EMail" />
      {errors.email}

      <input {...field('password')} placeholder="Password" type="password" />
      {errors.password}
    </form>
  )
}
```

### Easy Customization

Often it happens that you use a specific input or framework, so the default getter, setter and extractor for the event won't cut it. No worries: formhero got you covered!

```typescript
const Form = () => {
  const { field, form, errors } = useForm({
    awesome: true,
  })

  return (
    <form
      onSubmit={e => {
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
            extractor: e => e.target.checked,
          })}
        />
        Is it awesome?
      </label>

      <input type="submit" />
    </form>
  )
}
```

## 📖 Documentation

### `useForm`

```typescript
const { field, errors, update, form, isValid } = useForm(initial, validators, options)
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

A validator is an object that taked in either a `RegExp` or a `Function` (can be async) or an array of those. Optionally you can pass a message string that will be displayed instead of the default one.

A validator functions takes the current value as input and should return a `boolean` or a `string`. If returned `true` the input counts as valid, if `false` it's not. If you pass a string formhero will treat it as not valid and display the string returned as error message.

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
  },
}
```

###### Example: Multiple Validators

```javascript
const validators = {
  username: [
    {
      validator: /^[A-z]*$/,
      message: 'My custom error message',
    },
    /[\d]/,
    async value => value.length > 0,
    {
      validator: value => true,
      message: 'Some other error',
    },
  ],
}
```

###### Example: Dynamic Error Message

```javascript
const validators = {
  username: async (s: string) => {
    const taken = await API.isUsernameTaken(s)
    return taken ? 'Username is taken': true
  }
}
```

### Options

Sometimes it's practical to have some different default values when using for example react-native or some other framework where the default `value`, `onChange` and `(e)=> e.target.value` do not apply.

###### Example: React Native (Method 1 - Global options)

[Check the Expo Snack for a live preview](https://snack.expo.io/@cupcakearmy/useform)

```javascript
import * as React from 'react'
import { Text, SafeAreaView, TextInput } from 'react-native'
import { useForm } from 'formhero'

const initial = {
  username: 'i am all lowercase',
}
const validators = {}
const options = {
  setter: 'value', // This is not stricly necessarry as 'value' would already be the default.
  getter: 'onChangeText',
  extractor: text => text.toLowerCase(),
}

export default () => {
  const { form, field } = useForm(initial, validators, options)

  return (
    <SafeAreaView>
      <TextInput style={{ height: 40, borderColor: 'gray', borderWidth: 2 }} {...field('username')} />
      <Text>{form.username}</Text>
    </SafeAreaView>
  )
}
```

###### Example: React Native (Method 2 - Local overwrite)

```javascript
// ...

export default () => {
  const { form, field } = useForm({
    username: 'i am all lowercase',
  })

  return (
    <SafeAreaView>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 2 }}
        {...field('username', {
          setter: 'value', // This is not stricly necessarry as 'value' would already be the default.
          getter: 'onChangeText',
          extractor: text => text.toLowerCase(),
        })}
      />
      <Text>{form.username}</Text>
    </SafeAreaView>
  )
}
```

### field

The `field` object is used to bind the form state to the input.

###### Example: Simple

```javascript
const { field } = useForm()

<input {...field('username')} />
```

###### Example: With custom options

All are optional.

```javascript
const { field } = useForm()

<input {...field('username', {
  getter: 'onChage',
  setter: 'value',
  extractor: (e) => e.target.value
})} />
```

## Form

This is the form state that you can use when submitting the data

###### Example

```javascript

const { form } = useForm(...);

// ...

<form onSubmit={()=> console.log(form)}>
  // ...
</form>
```

## Errors

This object contains the error messages if a field is not valid.
The error message can be specified by you, otherwise it will return `Error in ${field}`

###### Example

```javascript
const { errors } = useForm(...)

//...

{errors.username}
{errors.password}
```

## isValid

`isValid` is a little simple helper that checks whether the `error` object is clear or if there are errors left.

## setField

The `setField` function allows you to manually change and assign the state of a field. The type of the field must be the same as the initial type given in the constructor.

###### Example

```javascript
const { form, setField } = useForm(...)

const resetUsername = () => {
  setField('username', 'new value')
}
```

## setForm

The `setForm` function allows you to manually change and assign the state of the form. This can be usefull when you want to reset a field or the whole form. The input must have the same type as the initial state.

###### Example

```javascript
const initial = {username: '', password: ''}

const { form, setForm } = useForm(initial, ...)

const resetForm = () => {
  setForm(initial)
}
```

## setErrors

The `setErrors` function allows you to manually change and assign the state of the errors. This can be usefull when you want to set an error manually (e.g. sent from the server).

###### Example

```javascript

const { form, setErrors } = useForm(...)

const setError = () => {
  setErrors({username: 'Already taken'})
}
```

### Thanks & Attributions

- Thanks for [brendanmckenzie](https://github.com/brendanmckenzie) for suggesting to change `auto` to `field`.
