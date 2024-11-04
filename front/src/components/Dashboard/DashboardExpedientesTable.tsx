import { motion, AnimatePresence } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import { Expediente } from '../../model/Expediente'; // Ajusta la ruta según la ubicación de tus modelos
import { Ubicacion } from '../../model/Ubicacion'; // Ajusta la ruta según la ubicación de tus modelos
import { Regulation } from '../../model/Regulation'; // Ajusta la ruta según la ubicación de tus modelos

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
            <th className="px-4 py-2 text-left">ID</th>
            <th className="px-4 py-2 text-left">Número de Orden</th>
            <th className="px-4 py-2 text-left">Código de Organización</th>
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
                <td className="px-4 py-2">{expediente.id}</td>
                <td className="px-4 py-2">{expediente.correlativeNumber}</td>
                <td className="px-4 py-2">{expediente.organizationCode}</td>
                <td className="px-4 py-2">{expediente.issuer}</td>
                <td className="px-4 py-2">{expediente.year}</td>
                <td className="px-4 py-2 bg-blue-100 font-medium">
                  {expediente.regulations.map((regulation, index) => (
                    <div key={index} className="mb-1">
                      {regulation.description}
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2">{expediente.solicitude}</td>
                <td className="px-4 py-2">
                  {expediente.locations && expediente.locations.length > 0 ? (
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={expediente.locations[0].lugar}
                          onChange={(e) => handleEditUbicacion(expediente.id, 0, e.target.value, expediente.locations[0].fecha)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                        />
                        <motion.button
                          id={`save-button-${expediente.id}-0`}
                          onClick={() => handleEditUbicacion(expediente.id, 0, expediente.locations[0].lugar, expediente.locations[0].fecha)}
                          className="bg-green-500 text-white px-2 py-1 rounded-md text-sm transition-all duration-300 ease-in-out"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Guardar
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            const newUbicaciones = expediente.locations.filter((_, i) => i !== 0);
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
                      {expediente.locations.length > 1 && (
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
                                {expediente.locations.map((ubicacion, index) => (
                                  <motion.li
                                    key={`${expediente.id}-${index}`}
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
                                    <motion.button
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
                                        const newUbicaciones = expediente.locations.filter((_, i) => i !== index);
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
                  ) : (
                    <span>No hay ubicaciones</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleOpenPDF(expediente.pdfPath || "")} // Proporciona un string vacío como valor por defecto
                    className="text-blue-500 hover:underline"
                    disabled={!expediente.pdfPath} // Deshabilitar el botón si pdfPath no está disponible
                  >
                    {expediente.pdfPath ? "Ver PDF" : "No disponible"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button onClick={() => handleEditExpediente(expediente)} className="text-blue-500 hover:underline">
                    Editar
                  </button>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </motion.div>
  );
}

export default DashboardExpedientesTable;
