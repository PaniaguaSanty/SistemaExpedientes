import { motion } from "framer-motion"
import { Dispatch, SetStateAction, RefObject } from "react"

type Ubicacion = {
  fecha: string;
  lugar: string;
}

type Expediente = {
  id: number
  codigo: string
  numeroOrden: string
  numeroExpediente: string
  emisor: string
  ano: number
  reglamentacion: string
  pedido: string
  ubicaciones: Ubicacion[]
  pdfPath?: string
}

type DashboardAddExpedienteProps = {
  selectedYear: number | null;
  newExpediente: Partial<Expediente>;
  setNewExpediente: Dispatch<SetStateAction<Partial<Expediente>>>;
  newUbicacion: string;
  setNewUbicacion: Dispatch<SetStateAction<string>>;
  handleAddUbicacion: () => void;
  handleAddExpediente: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePDF: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  buttonVariants: any;
}

const DashboardAddExpediente: React.FC<DashboardAddExpedienteProps> = ({
  selectedYear,
  newExpediente,
  setNewExpediente,
  newUbicacion,
  setNewUbicacion,
  handleAddUbicacion,
  handleAddExpediente,
  handleFileChange,
  handleDeletePDF,
  fileInputRef,
  buttonVariants
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Añadir Nuevo Expediente para {selectedYear}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Número de Orden"
          value={newExpediente.numeroOrden || ''}
          onChange={(e) => setNewExpediente({...newExpediente, numeroOrden: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Número de Expediente"
          value={newExpediente.numeroExpediente || ''}
          onChange={(e) => setNewExpediente({...newExpediente, numeroExpediente: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Emisor"
          value={newExpediente.emisor || ''}
          onChange={(e) => setNewExpediente({...newExpediente, emisor: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Reglamentación"
          value={newExpediente.reglamentacion || ''}
          onChange={(e) => setNewExpediente({...newExpediente, reglamentacion: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Pedido"
          value={newExpediente.pedido || ''}
          onChange={(e) => setNewExpediente({...newExpediente, pedido: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nueva ubicación"
            value={newUbicacion}
            onChange={(e) => setNewUbicacion(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-grow"
          />
          <motion.button
            onClick={() => handleAddUbicacion()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Añadir
          </motion.button>
        </div>
        {newExpediente.ubicaciones && newExpediente.ubicaciones.length > 0 && (
          <div className="col-span-full mt-2">
            <h4 className="font-medium mb-2">Ubicaciones añadidas:</h4>
            <ul className="space-y-2">
              {newExpediente.ubicaciones.map((ubicacion, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ubicacion.lugar}
                    onChange={(e) => {
                      const newUbicaciones = [...(newExpediente.ubicaciones || [])];
                      newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                      setNewExpediente({...newExpediente, ubicaciones: newUbicaciones});
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
                    type="date"
                    value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const newUbicaciones = [...(newExpediente.ubicaciones || [])];
                      newUbicaciones[index] = { ...newUbicaciones[index], fecha: new Date(e.target.value).toISOString() };
                      setNewExpediente({...newExpediente, ubicaciones: newUbicaciones});
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <motion.button
                    onClick={() => {
                      const newUbicaciones = (newExpediente.ubicaciones || []).filter((_, i) => i !== index);
                      setNewExpediente({...newExpediente, ubicaciones: newUbicaciones});
                    }}
                    className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Eliminar
                  </motion.button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="col-span-full flex items-center space-x-2 mt-4">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <motion.button
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {newExpediente.pdfPath ? 'Cambiar PDF' : 'Adjuntar PDF'}
          </motion.button>
          {newExpediente.pdfPath && (
            <motion.button
              onClick={() => handleDeletePDF()}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar PDF
            </motion.button>
          )}
          <span className="text-sm text-gray-500">
            {newExpediente.pdfPath ? (new URL(newExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
          </span>
        </div>
        <motion.button
          onClick={handleAddExpediente}
          className="col-span-full bg-green-500 text-white px-4 py-2 rounded-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Guardar Expediente
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DashboardAddExpediente
