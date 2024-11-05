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

type DashboardExpedientesTableProps = {
  expedientes: Expediente[];
  setExpedientes: Dispatch<SetStateAction<Expediente[]>>;
  handleEditExpediente: (expediente: Expediente) => void;
  handleEditUbicacion: (expedienteId: number, ubicacionIndex: number, newLugar: string, newFecha: string) => void;
  handleOpenPDF: (pdfPath: string) => void;
  expandedUbicaciones: number[];
  setExpandedUbicaciones: Dispatch<SetStateAction<number[]>>;
  toggleUbicaciones: (id: number) => void;
  buttonVariants: any;
  listItemVariants: any;
  fadeInVariants: any;
}

const DashboardExpedientesTable: React.FC<DashboardExpedientesTableProps> = ({
  expedientes,
  setExpedientes,
  handleEditExpediente,
  handleEditUbicacion,
  handleOpenPDF,
  expandedUbicaciones,
  setExpandedUbicaciones,
  toggleUbicaciones,
  buttonVariants,
  listItemVariants,
  fadeInVariants
}) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow overflow-x-auto"
      variants={fadeInVariants}
    >
      <table className="min-w-full">
        <thead className="bg-[#1A2E4A] text-white">
          <tr>
            <th className="px-4 py-2 text-left">Código</th>
            <th className="px-4 py-2 text-left">Número de Orden</th>
            <th className="px-4 py-2 text-left">Número de Expediente</th>
            <th className="px-4 py-2 text-left">Emisor</th>
            <th className="px-4 py-2 text-left">Año</th>
            <th className="px-4 py-2 text-left">Reglamentación</th>
            <th className="px-4 py-2 text-left">Pedido</th>
            <th className="px-4 py-2 text-left">Ubicaciones</th>
            <th className="px-4 py-2 text-left">PDF</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {expedientes.map((expediente) => (
              <motion.tr
                key={expediente.id}
                className="border-b hover:bg-gray-50"
                variants={listItemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ duration: 0.3 }}
              >
                <td className="px-4 py-2">{expediente.codigo}</td>
                <td className="px-4 py-2">{expediente.numeroOrden}</td>
                <td className="px-4 py-2">{expediente.numeroExpediente}</td>
                <td className="px-4 py-2">{expediente.emisor}</td>
                <td className="px-4 py-2">{expediente.ano}</td>
                <td className="px-4 py-2 bg-blue-100 font-medium">{expediente.reglamentacion}</td>
                <td className="px-4 py-2">{expediente.pedido}</td>
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
                            setExpedientes(expedientes.map(exp =>
                              exp.id === expediente.id ? { ...exp, ubicaciones: newUbicaciones } : exp
                            ));
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
                                    key={`${expediente.id}-${index}`} // Cambiado aquí
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
                                        setExpedientes(expedientes.map(exp =>
                                          exp.id === expediente.id ? { ...exp, ubicaciones: newUbicaciones } : exp
                                        ));
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
                <td className="px-4 py-2">
                  {expediente.pdfPath ? (
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                      onClick={() => handleOpenPDF(expediente.pdfPath!)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Ver PDF
                    </motion.button>
                  ) : (
                    "No hay PDF"
                  )}
                </td>
                <td className="px-4 py-2">
                  <motion.button
                    className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                    onClick={() => handleEditExpediente(expediente)}
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  )
}

export default DashboardExpedientesTable
