import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../'

const Index: React.FC = () => {

	const { auto, form, errors, isValid } = useForm({
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
		<form onSubmit={(e) => {
			e.preventDefault()
			if (isValid) console.log(form)
		}}>

			<h1>Errors & Validation</h1>

			<input {...auto('username')} placeholder="Username" />
			{errors.username && 'Must be longer than 3'}

			<input {...auto('email')} placeholder="EMail" />
			{errors.email}

			<input {...auto('password')} placeholder="Password" type="password" />
			{errors.password}

			<input type="submit" />

		</form>
	)
}

ReactDOM.render(<Index />, document.getElementById('errors'))