import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../dist'

const Index: React.FC = () => {

	const { auto, form, errors } = useForm({
		username: 'unicorn',
		password: '',
	})

	return (
		<form onSubmit={e => {
			e.preventDefault()
			console.log(form)
		}}>

			<h1>Simple</h1>

			<input {...auto('username')} placeholder="Username" />
			<input {...auto('password')} placeholder="Password" type="password" />

			<input type="submit" />

		</form>
	)
}

ReactDOM.render(<Index />, document.getElementById('simple'))