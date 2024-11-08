'use client'

import { motion, AnimatePresence } from "framer-motion"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Expediente } from '../../model/Expediente'
import Pagination from '../../components/Pagination'
import ExpedienteService from '../../service/ExpedienteService'
import '../../styles/Pagination.css'

type DashboardExpedientesTableProps = {
  expedientes: Expediente[]
  setExpedientes: Dispatch<SetStateAction<Expediente[]>>
  handleEditExpediente: (expediente: Expediente) => void
  handleEditUbicacion: (expedienteId: number, ubicacionIndex: number, newLugar: string) => void
  handleOpenPDF: (pdfPath: string) => void
  expandedUbicaciones: number[]
  setExpandedUbicaciones: Dispatch<SetStateAction<number[]>>
  toggleUbicaciones: (id: number) => void
  buttonVariants: any
  listItemVariants: any
  fadeInVariants: any
}

export default function DashboardExpedientesTable({
  expedientes,
  setExpedientes,
  handleEditExpediente,
  handleEditUbicacion,
  handleOpenPDF,
  expandedUbicaciones,
  toggleUbicaciones,
  buttonVariants,
  listItemVariants,
  fadeInVariants
}: DashboardExpedientesTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(40)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        const response = await ExpedienteService.findAllExpedientsPageable(currentPage, itemsPerPage)
        setExpedientes(response.data)
      } catch (error) {
        console.error('Error fetching expedients:', error)
      }
    }

    fetchExpedientes()
  }, [currentPage, itemsPerPage, setExpedientes])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentExpedientes = expedientes.slice(indexOfFirstItem, indexOfLastItem)

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
            {currentExpedientes.map((expediente) => (
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
                          value={expediente.locations[0].place}
                          onChange={() => handleEditUbicacion(expediente.id, 0, expediente.locations[0].place)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                        />
                        <motion.button
                          onClick={() => handleEditUbicacion(expediente.id, 0, expediente.locations[0].place)}
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
                              exp.id === expediente.id ? { ...exp, locations: newUbicaciones } : exp
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
                                {expediente.locations.slice(1).map((ubicacion, index) => (
                                  <motion.li
                                    key={`${expediente.id}-${index + 1}`}
                                    className="flex items-center space-x-2 mb-2"
                                    variants={listItemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                  >
                                    <input
                                      type="text"
                                      value={ubicacion.place}
                                      onChange={(e) => handleEditUbicacion(expediente.id, index + 1, e.target.value)}
                                      className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                                    />
                                    <motion.button
                                      onClick={() => handleEditUbicacion(expediente.id, index + 1, ubicacion.place)}
                                      className="bg-green-500 text-white px-2 py-1 rounded-md text-sm transition-all duration-300 ease-in-out"
                                      variants={buttonVariants}
                                      whileHover="hover"
                                      whileTap="tap"
                                    >
                                      Guardar
                                    </motion.button>
                                    <motion.button
                                      onClick={() => {
                                        const newUbicaciones = expediente.locations.filter((_, i) => i !== index + 1);
                                        setExpedientes(expedientes.map(exp =>
                                          exp.id === expediente.id ? { ...exp, locations: newUbicaciones } : exp
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
                    onClick={() => handleOpenPDF(expediente.pdfPath || "")}
                    className="text-blue-500 hover:underline"
                    disabled={!expediente.pdfPath}
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
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={expedientes.length}
        onPageChange={handlePageChange}
      />
    </motion.div>
  )
}
