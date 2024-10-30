import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ExpedienteForm from "./ExpedienteForm"
import ExpedienteTable from "./ExpedienteTable"
import StatBox from "./StatBox"
import { Expediente } from "../model/Expediente"

export default function Dashboard() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [newYear, setNewYear] = useState<string>("")
  const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
    year: selectedYear || undefined,
    regulations: [],
    locations: [],
  })
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null)
  const [newLocation, setNewLocation] = useState<string>("")
  const [expandedLocations, setExpandedLocations] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(expedientes.map(exp => exp.year)))
    return uniqueYears.sort((a, b) => b.localeCompare(a))
  }, [expedientes])

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((expediente) => {
      const matchesSearch = Object.entries(expediente).some(([key, value]) => {
        if (value === undefined || value === null) return false
        if (Array.isArray(value)) {
          return value.some(item =>
            Object.values(item).some(v =>
              v.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        }
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
      const matchesYear = selectedYear ? expediente.year === selectedYear : true
      return matchesSearch && matchesYear
    })
  }, [expedientes, searchTerm, selectedYear])

  const handleAddYear = () => {
    const yearToAdd = newYear.trim()
    if (yearToAdd && !years.includes(yearToAdd)) {
      setSelectedYear(yearToAdd)
      setNewYear("")
    }
  }

  const handleAddLocation = (isEditing: boolean = false) => {
    if (newLocation) {
      const nuevaLocation: Location = {
        id: Date.now(),
        origin: newLocation,
        destiny: newLocation,
        place: newLocation,
        expedient: isEditing ? editingExpediente! : newExpediente as Expediente,
      }
      if (isEditing && editingExpediente) {
        setEditingExpediente({
          ...editingExpediente,
        //  locations: [nuevaLocation, ...editingExpediente.locations]
        })
      } else {
        setNewExpediente({
          ...newExpediente,
          //locations: [nuevaLocation, ...(newExpediente.locations || [])]
        })
      }
      setNewLocation("")
    }
  }
  

  const handleAddExpediente = () => {
    if (selectedYear) {
      const id = Date.now()
      const newExp: Expediente = {
        id: id,
        issuer: newExpediente.issuer || "",
        organizationCode: newExpediente.organizationCode || "",
        correlativeNumber: newExpediente.correlativeNumber || "",
        solicitude: newExpediente.solicitude || "",
        year: selectedYear,
        status: newExpediente.status || "",
        pdfPath: newExpediente.pdfPath,
        regulations: newExpediente.regulations || [],
        locations: newExpediente.locations || [],
      }
      setExpedientes([...expedientes, newExp])
      setNewExpediente({ year: selectedYear, regulations: [], locations: [] })
    }
  }

  const handleEditExpediente = (expediente: Expediente) => {
    setEditingExpediente(expediente)
  }

  const handleSaveEdit = () => {
    if (editingExpediente) {
      setExpedientes(expedientes.map(exp =>
        exp.id === editingExpediente.id ? editingExpediente : exp
      ))
      setEditingExpediente(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingExpediente(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      if (editingExpediente) {
        setEditingExpediente({...editingExpediente, pdfPath: fileURL})
      } else {
        setNewExpediente({...newExpediente, pdfPath: fileURL})
      }
    }
  }

  const handleDeletePDF = (isEditing: boolean = false) => {
    if (isEditing && editingExpediente) {
      setEditingExpediente({...editingExpediente, pdfPath: undefined})
    } else {
      setNewExpediente({...newExpediente, pdfPath: undefined})
    }
  }

  const handleOpenPDF = (pdfPath: string) => {
    if (pdfPath.startsWith('blob:') || pdfPath.startsWith('file:')) {
      window.open(pdfPath, '_blank')
    } else {
      const fileURL = `file://${pdfPath}`
      window.open(fileURL, '_blank')
    }
  }

  const toggleLocations = (id: number) => {
    setExpandedLocations(prev =>
      prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
    )
  }

  const handleEditLocation = (expedienteId: number, locationIndex: number, newOrigin: string, newDestiny: string, newPlace: string) => {
    setExpedientes(expedientes.map(exp => {
      if (exp.id === expedienteId) {
        const updatedLocations = [...exp.locations];
        updatedLocations[locationIndex] = {
          ...updatedLocations[locationIndex],
          origin: newOrigin,
          destiny: newDestiny,
          place: newPlace,
        };
        return { ...exp, locations: updatedLocations };
      }
      return exp;
    }));

    // Add this line to trigger the animation
    document.getElementById(`save-button-${expedienteId}-${locationIndex}`)?.classList.add('animate-pulse');
    setTimeout(() => {
      document.getElementById(`save-button-${expedienteId}-${locationIndex}`)?.classList.remove('animate-pulse');
    }, 1000);
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.2 } },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  }

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
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
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8 bg-gray-100"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <motion.h1
        className="text-3xl font-bold mb-8 text-center text-[#1A2E4A]"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Gestión de Expedientes
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        variants={fadeInVariants}
      >
        <StatBox title="Total Expedientes" value={filteredExpedientes.length} />
        <StatBox title="Año Seleccionado" value={selectedYear || "N/A"} />
        <StatBox title="Años Disponibles" value={years.length} />
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        variants={fadeInVariants}
      >
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value ? e.target.value : null)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <input
            type="text"
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

      <AnimatePresence>
        {selectedYear && !editingExpediente && (
          <ExpedienteForm
            selectedYear={selectedYear}
            newExpediente={newExpediente}
            setNewExpediente={setNewExpediente}
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            handleAddLocation={handleAddLocation}
            handleAddExpediente={handleAddExpediente}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleDeletePDF={handleDeletePDF}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingExpediente && (
          <ExpedienteForm
            isEditing
            editingExpediente={editingExpediente}
            setEditingExpediente={setEditingExpediente}
            newLocation={newLocation}
            setNewLocation={setNewLocation}
            handleAddLocation={handleAddLocation}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            fileInputRef={fileInputRef}
            handleFileChange={handleFileChange}
            handleDeletePDF={handleDeletePDF} handleAddExpediente={function (): void {
              throw new Error("Function not implemented.")
            } }          />
        )}
      </AnimatePresence>

      <ExpedienteTable
        expedientes={filteredExpedientes}
        handleEditExpediente={handleEditExpediente}
        handleOpenPDF={handleOpenPDF}
        expandedLocations={expandedLocations}
        toggleLocations={toggleLocations}
        handleEditLocation={handleEditLocation}
      />
    </motion.div>
  )
}

