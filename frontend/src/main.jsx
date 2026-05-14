import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { StagewiseToolbar } from '@stagewise/toolbar-react'
import { ReactPlugin } from '@stagewise-plugins/react'
import { ThemeProvider } from './context/ThemeContext'

let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <StagewiseToolbar config={{ plugins: [ReactPlugin] }} />
          <App />
          <Toaster />
        </PersistGate>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)
