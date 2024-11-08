import React from 'react';
import { Expediente } from '../../model/Expediente';
import { motion } from 'framer-motion';

interface ExpedienteTableProps {
  expedientes: Expediente[];
  handleEditExpediente: (expediente: Expediente) => void;
  handleOpenPDF: (pdfPath: string) => void;
  handleEditUbicacion: (id: number, ubicacionIndex: number, newLugar: string, newFecha: string) => void;
  toggleUbicaciones: (id: number) => void;
  expandedUbicaciones: number[];
  buttonVariants: any;
  listItemVariants: any;
}

const ExpedienteTable: React.FC<ExpedienteTableProps> = ({
  expedientes,
  handleEditExpediente,
  handleOpenPDF,
  handleEditUbicacion,
  toggleUbicaciones,
  expandedUbicaciones,
  buttonVariants,
  listItemVariants,
}) => {
  return (
    <motion.div
      className="bg-white p-4 rounded-md shadow-md"
      variants={listItemVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-xl font-bold mb-4">Lista de Expedientes</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Código</th>
            <th className="border border-gray-300 p-2">Número de Orden</th>
            <th className="border border-gray-300 p-2">Número de Expediente</th>
            <th className="border border-gray-300 p-2">Emisor</th>
            <th className="border border-gray-300 p-2">Año</th>
            <th className="border border-gray-300 p-2">Pedido</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {expedientes.map(expediente => (
            <React.Fragment key={expediente.id}>
              <tr>
                <td className="border border-gray-300 p-2">{expediente.id}</td>
                <td className="border border-gray-300 p-2">{expediente.correlativeNumber}</td>
                <td className="border border-gray-300 p-2">{expediente.organizationCode}</td>
                <td className="border border-gray-300 p-2">{expediente.issuer}</td>
                <td className="border border-gray-300 p-2">{expediente.year}</td>
                <td className="border border-gray-300 p-2">{expediente.solicitude}</td>

                <td className="border border-gray-300 p-2">
                  <motion.button
                    onClick={() => handleEditExpediente(expediente)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Editar
                  </motion.button>
                  {expediente.pdfPath && (
                    <motion.button
                      onClick={() => handleOpenPDF(expediente.pdfPath!)}
                      className="bg-green-500 text-white px-2 py-1 rounded-md"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Ver PDF
                    </motion.button>
                  )}
                </td>
              </tr>
              {expandedUbicaciones.includes(expediente.id) && (
                <tr>
                  <td colSpan={7} className="border border-gray-300 p-2">
                    <h3 className="text-lg font-bold mb-2">Ubicaciones</h3>
                    {expediente.locations.map((ubicacion, index) => (
                      <div key={index} className="mb-2">
                        <input
                          type="text"
                          value={ubicacion.lugar}
                          onChange={(e) => handleEditUbicacion(expediente.id, index, e.target.value, ubicacion.fecha)}
                          className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        <input
                          type="date"
                          value={ubicacion.fecha}
                          onChange={(e) => handleEditUbicacion(expediente.id, index, ubicacion.lugar, e.target.value)}
                          className="border border-gray-300 rounded-md p-2 w-full mt-2"
                        />
                      </div>
                    ))}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default ExpedienteTable;
