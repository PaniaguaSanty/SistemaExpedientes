import { motion } from "framer-motion"
import { RefObject } from "react"

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

type DashboardFileUploadProps = {
  fileInputRef: RefObject<HTMLInputElement>;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePDF: () => void;
  buttonVariants: any;
  newExpediente: Partial<Expediente>;
  editingExpediente: Partial<Expediente> | null;
}

const DashboardFileUpload: React.FC<DashboardFileUploadProps> = ({
  fileInputRef,
  handleFileChange,
  handleDeletePDF,
  buttonVariants,
  newExpediente,
  editingExpediente
}) => {
  return (
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
  )
}

export default DashboardFileUpload
