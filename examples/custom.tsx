import React from 'react'
import ReactDOM from 'react-dom'

import { useForm } from '../dist'

const Index: React.FC = () => {

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

ReactDOM.render(<Index />, document.getElementById('custom'))