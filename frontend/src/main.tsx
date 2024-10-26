import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext'
import { PlayContextProvider } from './context/PlayContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <BrowserRouter>
    <AuthContextProvider>
      <PlayContextProvider>
        <App />
      </PlayContextProvider>
    </AuthContextProvider>
    </BrowserRouter>
  ,
)
