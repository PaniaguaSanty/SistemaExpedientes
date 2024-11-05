import { motion, AnimatePresence } from "framer-motion"
import { Dispatch, SetStateAction } from "react"

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

type DashboardUbicacionesProps = {
  expediente: Expediente;
  handleEditUbicacion: (expedienteId: number, ubicacionIndex: number, newLugar: string, newFecha: string) => void;
  expandedUbicaciones: number[];
  setExpandedUbicaciones: Dispatch<SetStateAction<number[]>>;
  toggleUbicaciones: (id: number) => void;
  buttonVariants: any;
  listItemVariants: any;
}

const DashboardUbicaciones: React.FC<DashboardUbicacionesProps> = ({
  expediente,
  handleEditUbicacion,
  expandedUbicaciones,
  setExpandedUbicaciones,
  toggleUbicaciones,
  buttonVariants,
  listItemVariants
}) => {
  return (
    <td className="px-4 py-2">
      {expediente.ubicaciones.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={expediente.ubicaciones[0].lugar}
              onChange={(e) => handleEditUbicacion(expediente.id, 0, e.target.value, expediente.ubicaciones[0].fecha)}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
            />
            <motion.button
              id={`save-button-${expediente.id}-0`}
              onClick={() => handleEditUbicacion(expediente.id, 0, expediente.ubicaciones[0].lugar, expediente.ubicaciones[0].fecha)}
              className="bg-green-500 text-white px-2 py-1 rounded-md text-sm transition-all duration-300 ease-in-out"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Guardar
            </motion.button>
            <motion.button
              onClick={() => {
                const newUbicaciones = expediente.ubicaciones.filter((_, i) => i !== 0);
                setExpandedUbicaciones(prev =>
                  prev.filter(id => id !== expediente.id).concat(expediente.id)
                );
              }}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm ml-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar
            </motion.button>
          </div>
          {expediente.ubicaciones.length > 1 && (
            <div>
              <motion.button
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                onClick={() => toggleUbicaciones(expediente.id)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                {expandedUbicaciones.includes(expediente.id) ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Ocultar anteriores
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Ver anteriores
                  </>
                )}
              </motion.button>
              <AnimatePresence>
                {expandedUbicaciones.includes(expediente.id) && (
                  <motion.ul
                    className="list-disc pl-5 mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {expediente.ubicaciones.map((ubicacion, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center space-x-2 mb-2"
                        variants={listItemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <input
                          type="text"
                          value={ubicacion.lugar}
                          onChange={(e) => handleEditUbicacion(expediente.id, index, e.target.value, ubicacion.fecha)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                        />
                        <input
                          type="date"
                          value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                          onChange={(e) => handleEditUbicacion(expediente.id, index, ubicacion.lugar, new Date(e.target.value).toISOString())}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                        />
                        <motion.button
                          id={`save-button-${expediente.id}-${index}`}
                          onClick={() => handleEditUbicacion(expediente.id, index, ubicacion.lugar, ubicacion.fecha)}
                          className="bg-green-500 text-white px-2 py-1 rounded-md text-sm transition-all duration-300 ease-in-out"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Guardar
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            const newUbicaciones = expediente.ubicaciones.filter((_, i) => i !== index);
                            setExpandedUbicaciones(prev =>
                              prev.filter(id => id !== expediente.id).concat(expediente.id)
                            );
                          }}
                          className="bg-red-500 text-white px-2 py-1 rounded-md text-sm ml-2"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Eliminar
                        </motion.button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </td>
  )
}

export default DashboardUbicaciones
