  'use client'

  import { useState, useMemo, useRef, useEffect } from "react"
  import { motion, AnimatePresence } from "framer-motion"
  import axios from "../../config/axiosConfig"; // Dos niveles arriba
  import DashboardHeader from './DashboardHeader'
  import DashboardFilters from './DashboardFilters'
  import DashboardAddExpediente from './DashboardAddExpediente'
  import DashboardEditExpediente from './DashboardEditExpediente'
  import DashboardExpedientesTable from './DashboardExpedientesTable'

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

  export default function Dashboard() {
    const [expedientes, setExpedientes] = useState<Expediente[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedYear, setSelectedYear] = useState<number | null>(null)
    const [newYear, setNewYear] = useState<string>("")
    const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
      ano: selectedYear || undefined,
      ubicaciones: [], // Inicializar como un array vacío
    })
    const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null)
    const [newUbicacion, setNewUbicacion] = useState<string>("")
    const [expandedUbicaciones, setExpandedUbicaciones] = useState<number[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    const years = useMemo(() => {
      const uniqueYears = Array.from(new Set(expedientes.map(exp => exp.ano)))
      return uniqueYears.sort((a, b) => b - a)
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
        const matchesYear = selectedYear ? expediente.ano === selectedYear : true
        return matchesSearch && matchesYear
      })
    }, [expedientes, searchTerm, selectedYear])


    useEffect(() => {
      // Fetch expedientes from the backend using the Axios instance
      axios.get('/getAll')
        .then(response => {
          if (Array.isArray(response.data)) {
            setExpedientes(response.data)
          } else {
            console.error('Invalid response format:', response.data)
          }
        })
        .catch(error => {
          console.error('Error fetching expedientes:', error)
        })
    }, [])
    const handleAddYear = () => {
      const yearToAdd = parseInt(newYear)
      if (yearToAdd && !years.includes(yearToAdd)) {
        setSelectedYear(yearToAdd)
        setNewYear("")
      }
    }

    const handleAddUbicacion = (isEditing: boolean = false) => {
      if (newUbicacion) {
        const nuevaUbicacion: Ubicacion = {
          fecha: new Date().toISOString(),
          lugar: newUbicacion
        }
        if (isEditing && editingExpediente) {
          setEditingExpediente({
            ...editingExpediente,
            ubicaciones: [nuevaUbicacion, ...editingExpediente.ubicaciones]
          })
        } else {
          setNewExpediente({
            ...newExpediente,
            ubicaciones: [nuevaUbicacion, ...(newExpediente.ubicaciones || [])]
          })
        }
        setNewUbicacion("")
      }
    }

    const handleAddExpediente = () => {
      if (selectedYear) {
        const newExp: Expediente = {
          id: Date.now(),
          codigo: `EXP${Date.now()}`,
          numeroOrden: newExpediente.numeroOrden || "",
          numeroExpediente: newExpediente.numeroExpediente || "",
          emisor: newExpediente.emisor || "",
          ano: selectedYear,
          reglamentacion: newExpediente.reglamentacion || "",
          pedido: newExpediente.pedido || "",
          ubicaciones: newExpediente.ubicaciones || [],
          pdfPath: newExpediente.pdfPath
        }

        axios.post('/api/expedients/create', newExp)
          .then(response => {
            setExpedientes([...expedientes, response.data])
            setNewExpediente({ ano: selectedYear, ubicaciones: [] })
          })
          .catch(error => {
            console.error('Error adding expediente:', error)
          })
      }
    }

    const handleEditExpediente = (expediente: Expediente) => {
      setEditingExpediente(expediente)
    }

    const handleSaveEdit = () => {
      if (editingExpediente) {
        axios.put('/api/expedients/update', editingExpediente)
          .then(response => {
            setExpedientes(expedientes.map(exp =>
              exp.id === editingExpediente.id ? response.data : exp
            ))
            setEditingExpediente(null)
          })
          .catch(error => {
            console.error('Error updating expediente:', error)
          })
      }
    }

    const handleCancelEdit = () => {
      setEditingExpediente(null)
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append('file', file)

        axios.post('/api/expedients/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          if (editingExpediente) {
            setEditingExpediente({...editingExpediente, pdfPath: response.data.pdfPath})
          } else {
            setNewExpediente({...newExpediente, pdfPath: response.data.pdfPath})
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error)
        })
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

    const toggleUbicaciones = (id: number) => {
      setExpandedUbicaciones(prev =>
        prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
      )
    }

    const handleEditUbicacion = (expedienteId: number, ubicacionIndex: number, newLugar: string, newFecha: string) => {
      setExpedientes(expedientes.map(exp => {
        if (exp.id === expedienteId) {
          const updatedUbicaciones = [...exp.ubicaciones];
          updatedUbicaciones[ubicacionIndex] = {
            ...updatedUbicaciones[ubicacionIndex],
            lugar: newLugar,
            fecha: newFecha
          };
          return { ...exp, ubicaciones: updatedUbicaciones };
        }
        return exp;
      }));

      // Add this line to trigger the animation
      document.getElementById(`save-button-${expedienteId}-${ubicacionIndex}`)?.classList.add('animate-pulse');
      setTimeout(() => {
        document.getElementById(`save-button-${expedienteId}-${ubicacionIndex}`)?.classList.remove('animate-pulse');
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
        <DashboardHeader />
        <DashboardFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          newYear={newYear}
          setNewYear={setNewYear}
          handleAddYear={handleAddYear}
          years={years}
          fadeInVariants={fadeInVariants}
        />
        <AnimatePresence>
          {selectedYear && !editingExpediente && (
            <DashboardAddExpediente
              selectedYear={selectedYear}
              newExpediente={newExpediente}
              setNewExpediente={setNewExpediente}
              newUbicacion={newUbicacion}
              setNewUbicacion={setNewUbicacion}
              handleAddUbicacion={handleAddUbicacion}
              handleAddExpediente={handleAddExpediente}
              handleFileChange={handleFileChange}
              handleDeletePDF={handleDeletePDF}
              fileInputRef={fileInputRef}
              buttonVariants={buttonVariants}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editingExpediente && (
            <DashboardEditExpediente
              editingExpediente={editingExpediente}
              setEditingExpediente={setEditingExpediente}
              newUbicacion={newUbicacion}
              setNewUbicacion={setNewUbicacion}
              handleAddUbicacion={handleAddUbicacion}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleFileChange={handleFileChange}
              handleDeletePDF={handleDeletePDF}
              fileInputRef={fileInputRef}
              buttonVariants={buttonVariants}
            />
          )}
        </AnimatePresence>
        <DashboardExpedientesTable
          expedientes={filteredExpedientes}
          setExpedientes={setExpedientes}
          handleEditExpediente={handleEditExpediente}
          handleEditUbicacion={handleEditUbicacion}
          handleOpenPDF={handleOpenPDF}
          expandedUbicaciones={expandedUbicaciones}
          setExpandedUbicaciones={setExpandedUbicaciones}
          toggleUbicaciones={toggleUbicaciones}
          buttonVariants={buttonVariants}
          listItemVariants={listItemVariants}
          fadeInVariants={fadeInVariants}
        />
      </motion.div>
    )
  }
