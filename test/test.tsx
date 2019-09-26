import React, { useState } from 'react'
import ReactDOM from 'react-dom'

import { useForm, HTMLInputExtractor } from '../'


const TextError: React.FC<{ error?: string }> = ({ error }) => !error
	? null
	: <div className="has-text-danger">{error}</div>

const Index: React.FC = () => {

	const { auto, form, update, errors } = useForm({
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
	}, { extractor: HTMLInputExtractor })

	const _submit = (e: React.MouseEvent) => {
		e.preventDefault()
		console.log(form, errors)
	}

	return (
		<div>
			<form>
				<div>Username</div>
				<input {...auto('username')} />
				<TextError error={errors.username} />
				<br />

				<div>Password</div>
				<input {...auto('password')} />
				<TextError error={errors.password} />
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
				<input type="checkbox" name="vehicle" {...auto('awesome', { setter: 'checked', extractor: (e) => e.target.checked })} />
				<TextError error={errors.awesome} />
				<br />

				<button onClick={_submit}>Test</button>
			</form>
		</div>
	)
}

ReactDOM.render(<Index />, document.getElementById('root'))

// @ts-ignore
// if (module.hot) module.hot.accept()