import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.tsx'
import { ComposeMailProvider } from '@/Context/ComposeMailContext.tsx'
import { GlobalContextProvider } from './Context/GlobalContext.tsx'
import { UserContextProvider } from './Context/UserContext.tsx'

createRoot(document.getElementById('root')!).render(
    <GlobalContextProvider>
        <UserContextProvider>
            <ComposeMailProvider>
                <App />
            </ComposeMailProvider>
        </UserContextProvider>
    </GlobalContextProvider>
)
