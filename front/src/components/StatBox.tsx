import { motion } from "framer-motion"

type StatBoxProps = {
  title: string
  value: number | string
}

const statBoxVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.5
    }
  },
  hover: {
    scale: 1.05,
    boxShadow: "0px 5px 10px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
}

const StatBox: React.FC<StatBoxProps> = ({ title, value }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow p-4 cursor-pointer"
      variants={statBoxVariants}
      whileHover="hover"
    >
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
        </svg>
      </div>
      <motion.div
        className="text-2xl font-bold"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
          delay: 0.2
        }}
      >
        {value}
      </motion.div>
    </motion.div>
  )
}

export default StatBox
