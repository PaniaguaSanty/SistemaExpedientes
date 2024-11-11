import { motion } from "framer-motion"
import { Dispatch, SetStateAction, RefObject } from "react"
import { Expediente } from '../../model/Expediente'; // Ajusta la ruta según la ubicación de tus modelos
import { Ubicacion } from '../../model/Ubicacion'; // Ajusta la ruta según la ubicación de tus modelos
import { Regulation } from '../../model/Regulation'; // Ajusta la ruta según la ubicación de tus modelos

type DashboardEditExpedienteProps = {
  editingExpediente: Expediente;
  setEditingExpediente: Dispatch<SetStateAction<Expediente | null>>;
  newUbicacion: string;
  setNewUbicacion: Dispatch<SetStateAction<string>>;
  handleAddUbicacion: () => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePDF: (isEditing: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  buttonVariants: any;
}

const DashboardEditExpediente: React.FC<DashboardEditExpedienteProps> = ({
  editingExpediente,
  setEditingExpediente,
  newUbicacion,
  setNewUbicacion,
  handleSaveEdit,
  handleCancelEdit,
  handleFileChange,
  handleDeletePDF,
  fileInputRef,
  buttonVariants
}) => {
  const handleAddRegulation = () => {
    const newRegulation: Regulation = {
      id: Date.now(),
      description: ''
    };
    setEditingExpediente({
      ...editingExpediente,
      regulations: [...editingExpediente.regulations, newRegulation]
    });
  };

  const handleRegulationChange = (index: number, value: string) => {
    const newRegulations = [...editingExpediente.regulations];
    newRegulations[index].description = value;
    setEditingExpediente({
      ...editingExpediente,
      regulations: newRegulations
    });
  };

  const handleDeleteRegulation = (index: number) => {
    const newRegulations = editingExpediente.regulations.filter((_, i) => i !== index);
    setEditingExpediente({
      ...editingExpediente,
      regulations: newRegulations
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Editar Expediente: {editingExpediente.id}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Número de Orden"
          value={editingExpediente.correlativeNumber}
          onChange={(e) => setEditingExpediente({ ...editingExpediente, correlativeNumber: e.target.value })}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Número de Expediente"
          value={editingExpediente.organizationCode}
          onChange={(e) => setEditingExpediente({ ...editingExpediente, organizationCode: e.target.value })}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Emisor"
          value={editingExpediente.issuer}
          onChange={(e) => setEditingExpediente({ ...editingExpediente, issuer: e.target.value })}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
  type="text"
  placeholder="Solicitud"
  value={editingExpediente.solicitude}
  onChange={(e) => setEditingExpediente({ ...editingExpediente, solicitude: e.target.value })}
  className="border border-gray-300 rounded-md p-2 mb-4"
/>
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-2">Reglamentaciones</h3>
          {editingExpediente.regulations.map((regulation, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={regulation.description}
                onChange={(e) => handleRegulationChange(index, e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm flex-grow"
              />
              <motion.button
                onClick={() => handleDeleteRegulation(index)}
                className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Eliminar
              </motion.button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            <motion.button
              onClick={handleAddRegulation}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Añadir Reglamentación
            </motion.button>
          </div>
        </div>
        <div className="col-span-full">
          <h3 className="text-lg font-semibold mb-2">Ubicaciones</h3>
          {editingExpediente.locations.map((location, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={location.place}
                onChange={(e) => {
                  const newUbicaciones = [...editingExpediente.locations];
                  newUbicaciones[index] = { ...newUbicaciones[index], place: e.target.value };
                  setEditingExpediente({ ...editingExpediente, locations: newUbicaciones });
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm flex-grow"
              />
              <motion.button
                onClick={() => {
                  const newUbicaciones = editingExpediente.locations.filter((_, i) => i !== index);
                  setEditingExpediente({ ...editingExpediente, locations: newUbicaciones });
                }}
                className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                Eliminar
              </motion.button>
            </div>
          ))}
          <div className="flex items-center space-x-2 mt-2">
            <input
              type="text"
              placeholder="Nueva ubicación"
              value={newUbicacion}
              onChange={(e) => setNewUbicacion(e.target.value)}
              className="border border-gray-300 rounded-md p-2 flex-grow"
            />
            <motion.button
              onClick={() => {
                if (newUbicacion) {
                  const nuevaUbicacion: Ubicacion = {

                    place: newUbicacion
                  };
                  setEditingExpediente({
                    ...editingExpediente,
                    locations: [nuevaUbicacion, ...editingExpediente.locations]
                  });
                  setNewUbicacion("");
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Añadir
            </motion.button>
          </div>
        </div>
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
            {editingExpediente.pdfPath ? 'Cambiar PDF' : 'Adjuntar PDF'}
          </motion.button>
          {editingExpediente.pdfPath && (
            <motion.button
              onClick={() => handleDeletePDF(true)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar PDF
            </motion.button>
          )}
          <span className="text-sm text-gray-500">
            {editingExpediente.pdfPath ? (new URL(editingExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
          </span>
        </div>
        <div className="col-span-full flex justify-end space-x-2">
          <motion.button
            onClick={handleCancelEdit}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </motion.button>
          <motion.button
            onClick={handleSaveEdit}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Guardar Cambios
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default DashboardEditExpediente

