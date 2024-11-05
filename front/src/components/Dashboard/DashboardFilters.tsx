import { motion } from "framer-motion"
import { Dispatch, SetStateAction } from "react"

type DashboardFiltersProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedYear: string | null;
  setSelectedYear: Dispatch<SetStateAction<string | null>>;
  newYear: string;
  setNewYear: Dispatch<SetStateAction<string>>;
  handleAddYear: () => void;
  years: string[];
  fadeInVariants: any;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedYear,
  setSelectedYear,
  newYear,
  setNewYear,
  handleAddYear,
  years,
  fadeInVariants
}) => {
  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
      variants={fadeInVariants}
    >
      <div className="flex items-center space-x-2">
        <select
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(e.target.value ? String(e.target.value) : null)}
          className="border border-gray-300 rounded-md p-2"
        >
         {years?.map((year, index) => (
  <option key={`${year}-${index}`} value={year}>{year}</option>
))}
        </select>
        <input
          type="number"
          placeholder="Nuevo año"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-32"
        />
        <motion.button
          onClick={handleAddYear}
          disabled={!newYear}
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Añadir Año
        </motion.button>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Buscar expedientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-64"
        />
        <motion.button
          className="border border-gray-300 rounded-md p-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default DashboardFilters
