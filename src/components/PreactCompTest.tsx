import type { FunctionComponent } from 'preact'
import { useState } from 'preact/hooks'

export const PreactCompTest: FunctionComponent = ({ children }) => {
  const [count, setCount] = useState(0)
  return (
    <div
      onClick={() => {
        setCount((p) => p + 1)
      }}
    >
      {children}, you clicked x{count}
    </div>
  )
}
