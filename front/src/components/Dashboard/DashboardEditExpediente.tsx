//DashboarEditExpediente.tsx
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, RefObject } from "react";
import { Expediente } from '../../model/Expediente';
import { Ubicacion } from '../../model/Ubicacion';
import { Regulation } from '../../model/Regulation';
import ExpedienteService from '../../service/ExpedienteService';

type DashboardEditExpedienteProps = {
  editingExpediente: Expediente;
  setEditingExpediente: Dispatch<SetStateAction<Expediente | null>>;
  newUbicacion: string;
  setNewUbicacion: Dispatch<SetStateAction<string>>;
  handleCancelEdit: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePDF: (isEditing: boolean) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  buttonVariants: any;
  setExpedientes: Dispatch<SetStateAction<Expediente[]>>;
  expedientes: Expediente[]; // Añadir expedientes como prop
};

const DashboardEditExpediente: React.FC<DashboardEditExpedienteProps> = ({
  editingExpediente,
  setEditingExpediente,
  newUbicacion,
  setNewUbicacion,
  handleCancelEdit,
  handleFileChange,
  handleDeletePDF,
  fileInputRef,
  buttonVariants,
  setExpedientes,
  expedientes, // Usar expedientes como prop
}) => {
  const handleAddRegulation = async () => {
    const newRegulation: Regulation = {
      id: null, // No asignes un id temporal aquí
      description: ''
    };
    const addedRegulation = await ExpedienteService.addRegulation(editingExpediente.id, newRegulation);
    setEditingExpediente({
      ...editingExpediente,
      regulations: [...editingExpediente.regulations, addedRegulation.data]
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

  const handleDeleteRegulation = async (index: number) => {
    const regulationId = editingExpediente.regulations[index].id;
    await ExpedienteService.deleteRegulation(editingExpediente.id, regulationId);
    const newRegulations = editingExpediente.regulations.filter((_, i) => i !== index);
    setEditingExpediente({
      ...editingExpediente,
      regulations: newRegulations
    });
  };

  const handleDeleteLocation = async (index: number) => {
    const locationId = editingExpediente.locations[index].id; // Usar el id de la ubicación
    await ExpedienteService.deleteLocation(editingExpediente.id, locationId);
    const newLocations = editingExpediente.locations.filter((_, i) => i !== index);
    setEditingExpediente({
      ...editingExpediente,
      locations: newLocations
    });
  };

  const handleEditLocation = (index: number, value: string) => {
    const existingPlace = editingExpediente.locations[index].place;
    const newLocations = [...editingExpediente.locations];
    newLocations[index] = { ...newLocations[index], place: value };
    setEditingExpediente({ ...editingExpediente, locations: newLocations });

    // Asegúrate de que el objeto pasado a editLocation tenga tanto id como place
    const updatedLocation: Ubicacion = {
      id: newLocations[index].id,
      place: value
    };

    ExpedienteService.editLocation(editingExpediente.id, newLocations[index].id, updatedLocation);
  };

  const handleAddUbicacion = async () => {
    if (newUbicacion) {
      const nuevaUbicacion: Ubicacion = {
        id: null, // No asignes un id temporal aquí
        place: newUbicacion,
      };
      try {
        const addedLocation = await ExpedienteService.addLocation(editingExpediente.id, nuevaUbicacion);
        setEditingExpediente({
          ...editingExpediente,
          locations: [...editingExpediente.locations, addedLocation.data]
        });
        setNewUbicacion("");
      } catch (error) {
        console.error('Error adding location:', error);
      }
    }
  };

  const handleSaveEdit = async (expediente: Expediente) => {
    try {
      const originalExpediente = expedientes.find(exp => exp.id === expediente.id);
      if (!originalExpediente) {
        throw new Error('Expediente original no encontrado');
      }
  
      // Actualizar el expediente
      await ExpedienteService.updateExpedient(expediente);
  
      // Manejar ubicaciones
      const originalLocations = originalExpediente.locations || [];
      const newLocations = expediente.locations.filter(location => !originalLocations.some(originalLocation => originalLocation.id === location.id));
      const updatedLocations = expediente.locations.filter(location => {
        const originalLocation = originalLocations.find(originalLocation => originalLocation.id === location.id);
        return originalLocation && (originalLocation.place !== location.place);
      });
      const deletedLocations = originalLocations.filter(originalLocation => !expediente.locations.some(location => location.id === originalLocation.id));
  
      // Añadir nuevas ubicaciones
      for (const location of newLocations) {
        const newLocation = await ExpedienteService.addLocation(expediente.id, location);
        const locationIndex = expediente.locations.findIndex(l => l.id === location.id);
        if (locationIndex !== -1) {
          expediente.locations[locationIndex] = newLocation.data;
        }
        console.log("Se añadió una nueva ubicación:", newLocation.data);
      }
  
      // Editar ubicaciones existentes
      for (const location of updatedLocations) {
        console.log("Editing existing location:", location);
        await ExpedienteService.editLocation(expediente.id, location.id, location);
      }
  
      // Eliminar ubicaciones eliminadas
      for (const location of deletedLocations) {
        console.log('Deleting location:', location);
        await ExpedienteService.deleteLocation(expediente.id, location.id);
      }
  
      // Manejar regulaciones
      const originalRegulations = originalExpediente.regulations || [];
      const newRegulations = expediente.regulations.filter(regulation => !originalRegulations.some(originalRegulation => originalRegulation.id === regulation.id));
      const updatedRegulations = expediente.regulations.filter(regulation => {
        const originalRegulation = originalRegulations.find(originalRegulation => originalRegulation.id === regulation.id);
        return originalRegulation && (originalRegulation.description !== regulation.description);
      });
      const deletedRegulations = originalRegulations.filter(originalRegulation => !expediente.regulations.some(regulation => regulation.id === originalRegulation.id));
  
      // Añadir nuevas regulaciones
      for (const regulation of newRegulations) {
        const newRegulation = await ExpedienteService.addRegulation(expediente.id, regulation);
        const regulationIndex = expediente.regulations.findIndex(r => r.id === regulation.id);
        if (regulationIndex !== -1) {
          expediente.regulations[regulationIndex] = newRegulation.data;
        }
        console.log("Se añadió una nueva regulación:", newRegulation.data);
      }
  
      // Editar regulaciones existentes
      for (const regulation of updatedRegulations) {
        console.log('Editing existing regulation:', regulation);
        await ExpedienteService.editRegulation(expediente.id, regulation.id, regulation);
      }
  
      // Eliminar regulaciones eliminadas
      for (const regulation of deletedRegulations) {
        console.log('Deleting regulation:', regulation);
        await ExpedienteService.deleteRegulation(expediente.id, regulation.id);
      }
  
      // Actualizar el estado de los expedientes
      setExpedientes(prevExpedientes =>
        prevExpedientes.map(exp => (exp.id === expediente.id ? { ...exp, locations: expediente.locations, regulations: expediente.regulations } : exp))
      );
  
      // Limpiar el expediente en edición
      setEditingExpediente(null);
  
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      alert('Ocurrió un error al guardar los cambios. Por favor, inténtalo de nuevo.');
    }
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
                onChange={(e) => handleEditLocation(index, e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm flex-grow"
              />
              <motion.button
                onClick={() => handleDeleteLocation(index)}
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
              onClick={handleAddUbicacion}
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
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 11.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </motion.button>
          <motion.button
            onClick={() => handleSaveEdit(editingExpediente)} // Llamar a handleSaveEdit con el expediente
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

export default DashboardEditExpediente;