import { motion } from "framer-motion"
import { Expediente, Location } from "../model/Expediente"

type ExpedienteFormProps = {
  selectedYear?: string | null
  newExpediente?: Partial<Expediente>
  setNewExpediente?: React.Dispatch<React.SetStateAction<Partial<Expediente>>>
  newLocation: string
  setNewLocation: React.Dispatch<React.SetStateAction<string>>
  handleAddLocation: (isEditing: boolean) => void
  handleAddExpediente: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleDeletePDF: (isEditing: boolean) => void
  isEditing?: boolean
  editingExpediente?: Expediente | null
  setEditingExpediente?: React.Dispatch<React.SetStateAction<Expediente | null>>
  handleSaveEdit?: () => void
  handleCancelEdit?: () => void
}

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.2 } },
}

const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  selectedYear,
  newExpediente,
  setNewExpediente,
  newLocation,
  setNewLocation,
  handleAddLocation,
  handleAddExpediente,
  fileInputRef,
  handleFileChange,
  handleDeletePDF,
  isEditing,
  editingExpediente,
  setEditingExpediente,
  handleSaveEdit,
  handleCancelEdit,
}) => {
  const expediente = isEditing ? editingExpediente : newExpediente
  const setExpediente = isEditing ? setEditingExpediente : setNewExpediente

  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? `Editar Expediente: ${editingExpediente?.correlativeNumber}` : `Añadir Nuevo Expediente para ${selectedYear}`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Emisor"
          value={expediente?.issuer || ''}
          onChange={(e) => setExpediente && setExpediente({...expediente, issuer: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Código de Organización"
          value={expediente?.organizationCode || ''}
          onChange={(e) => setExpediente && setExpediente({...expediente, organizationCode: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Número Correlativo"
          value={expediente?.correlativeNumber || ''}
          onChange={(e) => setExpediente && setExpediente({...expediente, correlativeNumber: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Solicitud"
          value={expediente?.solicitude || ''}
          onChange={(e) => setExpediente && setExpediente({...expediente, solicitude: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Estado"
          value={expediente?.status || ''}
          onChange={(e) => setExpediente && setExpediente({...expediente, status: e.target.value})}
          className="border border-gray-300 rounded-md p-2"
        />
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Nueva ubicación"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-grow"
          />
          <motion.button
            onClick={() => handleAddLocation(isEditing || false)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Añadir
          </motion.button>
        </div>
        {expediente?.locations && expediente.locations.length > 0 && (
          <div className="col-span-full mt-2">
            <h4 className="font-medium mb-2">Ubicaciones añadidas:</h4>
            <ul className="space-y-2">
              {expediente.locations.map((location, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={location.origin}
                    onChange={(e) => {
                      const newLocations = [...expediente.locations];
                      newLocations[index] = { ...newLocations[index], origin: e.target.value };
                      setExpediente && setExpediente({...expediente, locations: newLocations});
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    value={location.destiny}
                    onChange={(e) => {
                      const newLocations = [...expediente.locations];
                      newLocations[index] = { ...newLocations[index], destiny: e.target.value };
                      setExpediente && setExpediente({...expediente, locations: newLocations});
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
                    type="text"
                    value={location.place}
                    onChange={(e) => {
                      const newLocations = [...expediente.locations];
                      newLocations[index] = { ...newLocations[index], place: e.target.value };
                      setExpediente && setExpediente({...expediente, locations: newLocations});
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <motion.button
                    onClick={() => {
                      const newLocations = expediente.locations.filter((_, i) => i !== index);
                      setExpediente && setExpediente({...expediente, locations: newLocations});
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
            {expediente?.pdfPath ? 'Cambiar PDF' : 'Adjuntar PDF'}
          </motion.button>
          {expediente?.pdfPath && (
            <motion.button
              onClick={() => handleDeletePDF(isEditing || false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar PDF
            </motion.button>
          )}
          <span className="text-sm text-gray-500">
            {expediente?.pdfPath ? (new URL(expediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
          </span>
        </div>
        <motion.button
          onClick={isEditing ? handleSaveEdit : handleAddExpediente}
          className="col-span-full bg-green-500 text-white px-4 py-2 rounded-md"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {isEditing ? 'Guardar Cambios' : 'Guardar Expediente'}
        </motion.button>
        {isEditing && (
          <motion.button
            onClick={handleCancelEdit}
            className="col-span-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md mt-2"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default ExpedienteForm
