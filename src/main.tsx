import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)

// Excluded from normal builds. Review adapters are selected only by Vite --mode review.
if (import.meta.env.MODE === 'review') {
    import('./review/ReviewToolbar').then(({ default: ReviewToolbar }) => {
        const controls = document.createElement('div')
        document.body.appendChild(controls)
        document.body.style.paddingBottom = '140px'
        createRoot(controls).render(<ReviewToolbar />)
    })
}
