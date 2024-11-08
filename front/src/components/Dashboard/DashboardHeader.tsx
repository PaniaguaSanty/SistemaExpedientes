import { motion } from "framer-motion"

const DashboardHeader = () => {
  return (
    <motion.h1
      className="text-3xl font-bold mb-8 text-center text-[#1A2E4A]"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      Gestión de Expedientes
    </motion.h1>
  )
}

export default DashboardHeader
