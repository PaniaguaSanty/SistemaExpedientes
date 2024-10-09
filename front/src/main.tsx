import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Prueba from '../src/components/Expediente.tsx'
import ExpedientesCRUD from '../src/components/Expediente.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <ExpedientesCRUD/>
  </>,
)

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
