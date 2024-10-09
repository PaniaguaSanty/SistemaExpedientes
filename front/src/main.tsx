import ReactDOM from 'react-dom/client'
import './index.css'
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
