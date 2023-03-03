import { fireEvent, screen } from '@testing-library/react'
import React from 'react'
import { expect } from 'vitest'

export const Insight = {
  Portal({ data }: { data: any }) {
    return <div data-testid="result">{JSON.stringify(data)}</div>
  },
  async verify(obj: any) {
    const result = await screen.findByTestId('result')
    const data = JSON.parse(result.innerText)
    expect(data).toMatchObject(obj)
  },
}

export const Util = {
  find<E extends HTMLElement = HTMLInputElement>(id: string) {
    return screen.findByTestId<E>(id)
  },
  writeToField(node: HTMLInputElement, value: string) {
    fireEvent.change(node, { target: { value } })
  },
}
