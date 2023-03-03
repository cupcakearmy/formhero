import React from 'react'

// Custom field with non standard setter and getter. Emulate custom component from a library
export function NumberField(props: { number: number; update: (value: number) => void }) {
  return <input data-testid="field" value={props.number} onChange={(e) => props.update(parseInt(e.target.value))} />
}

// Component that needs a different extractor, as it's returning the actual value and not the event.
export function DirectReturnInput(props: { value: string; onChange: (v: string) => void }) {
  return <input data-testid="field" value={props.value} onChange={(e) => props.onChange(e.target.value)} />
}
