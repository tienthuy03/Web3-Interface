// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <App />
// )
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'
import { initWeb3Modal } from './contracts/web3Modal'

initWeb3Modal()
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: '8px',
        },
      }}
    />
    <App />
  </BrowserRouter>
)
