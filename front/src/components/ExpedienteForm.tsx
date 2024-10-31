import { motion } from "framer-motion";
import { Expediente, Ubicacion } from "../model/Expediente";
import { Regulation } from "../model/Regulation";
import { Key, useRef } from "react";

type ExpedienteFormProps = {
  isEditing?: boolean;
  expediente?: Expediente;
  setExpediente: React.Dispatch<React.SetStateAction<Expediente | null>>;
  newExpediente?: Partial<Expediente>;
  setNewExpediente: React.Dispatch<React.SetStateAction<Partial<Expediente>>>;
  newUbicacion: string;
  setNewUbicacion: React.Dispatch<React.SetStateAction<string>>;
  handleAddUbicacion: (isEditing?: boolean) => void;
  handleAddExpediente?: () => void;
  handleSaveEdit?: () => void;
  handleCancelEdit?: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePDF: (isEditing?: boolean) => void;
  buttonVariants: any;
  fadeInVariants: any;
};

const ExpedienteForm: React.FC<ExpedienteFormProps> = ({
  isEditing,
  expediente,
  setExpediente,
  newExpediente,
  setNewExpediente,
  newUbicacion,
  setNewUbicacion,
  handleAddUbicacion,
  handleAddExpediente,
  handleSaveEdit,
  handleCancelEdit,
  handleFileChange,
  handleDeletePDF,
  buttonVariants,
  fadeInVariants,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentExpediente = isEditing ? expediente : newExpediente;
  const setCurrentExpediente = isEditing ? setExpediente : setNewExpediente;

  if (!currentExpediente || !setCurrentExpediente) {
    return null; // O manejar el caso de manera apropiada
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? `Editar Expediente: ${currentExpediente?.codigo}` : `Añadir Nuevo Expediente para ${currentExpediente?.ano}`}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Número de Orden"
          value={currentExpediente?.numeroOrden || ''}
          onChange={(e) => setCurrentExpediente({ ...currentExpediente, numeroOrden: e.target.value } as any)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Número de Expediente"
          value={currentExpediente?.numeroExpediente || ''}
          onChange={(e) => setCurrentExpediente({ ...currentExpediente, numeroExpediente: e.target.value } as any)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Emisor"
          value={currentExpediente?.emisor || ''}
          onChange={(e) => setCurrentExpediente({ ...currentExpediente, emisor: e.target.value } as any)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Reglamentación"
          value={currentExpediente?.reglamentacion?.map((reg: { description: any; }) => reg.description).join(', ') || ''}
          onChange={(e) => setCurrentExpediente({ ...currentExpediente, reglamentacion: e.target.value.split(',').map(desc => ({ id: Date.now(), description: desc })) } as any)}
          className="border border-gray-300 rounded-md p-2"
        />
        <input
          type="text"
          placeholder="Pedido"
          value={currentExpediente?.pedido || ''}
          onChange={(e) => setCurrentExpediente({ ...currentExpediente, pedido: e.target.value } as any)}
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
            onClick={() => handleAddUbicacion(isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Añadir
          </motion.button>
        </div>
        {currentExpediente?.ubicaciones && currentExpediente.ubicaciones.length > 0 && (
          <div className="col-span-full mt-2">
            <h4 className="font-medium mb-2">Ubicaciones añadidas:</h4>
            <ul className="space-y-2">
              {currentExpediente.ubicaciones.map((ubicacion: { lugar: string | number | readonly string[] | undefined; fecha: string | number | Date; }, index: Key | null | undefined) => (
                <li key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={ubicacion.lugar}
                    onChange={(e) => {
                      const newUbicaciones = [...(currentExpediente.ubicaciones || [])];

                      if (typeof index === "number") {
                        newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                        setCurrentExpediente({ ...currentExpediente, ubicaciones: newUbicaciones } as any);
                      }
                    }}
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                  />
                  <input
  type="date"
  value={ubicacion.fecha ? new Date(ubicacion.fecha).toISOString().split('T')[0] : ""}
  onChange={(e) => {
    const newUbicaciones = [...(currentExpediente.ubicaciones || [])];
    
    if (typeof index === "number") {
      newUbicaciones[index] = { 
        ...newUbicaciones[index], 
        fecha: new Date(e.target.value).toISOString() 
      };
      setCurrentExpediente({ ...currentExpediente, ubicaciones: newUbicaciones } as any);
    }
  }}
  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
/>
                  <motion.button
                    onClick={() => {
                      const newUbicaciones = currentExpediente.ubicaciones?.filter((_: any, i: any) => i !== index) || [];
                      setCurrentExpediente({ ...currentExpediente, ubicaciones: newUbicaciones } as any);
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
            {currentExpediente.pdfPath ? 'Cambiar PDF' : 'Adjuntar PDF'}
          </motion.button>
          {currentExpediente.pdfPath && (
            <motion.button
              onClick={() => handleDeletePDF(isEditing)}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar PDF
            </motion.button>
          )}
          <span className="text-sm text-gray-500">
            {currentExpediente.pdfPath ? (new URL(currentExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
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
            className="col-span-full bg-red-500 text-white px-4 py-2 rounded-md mt-2"
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
  );
};

export default ExpedienteForm;