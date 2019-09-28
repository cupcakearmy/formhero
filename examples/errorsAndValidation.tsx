import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../'

const Index: React.FC = () => {

	const { auto, form, errors } = useForm({
		username: '',
		password: ''
	}, {
		username: value => value.length > 3,
		password: /[\d]{1,}/
	})

	return (
		<form>

			<h1>Errors & Validation</h1>

			<input {...auto('username')} placeholder="Username" />
			{errors.username && 'Must be longer than 3'}

			<input {...auto('password')} placeholder="Password" type="password" />
			{errors.password && 'Must contain a number'}

		</form>
	)
}

ReactDOM.render(<Index />, document.getElementById('errors'))