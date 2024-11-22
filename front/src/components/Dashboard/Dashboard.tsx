//Dashboard.tsx
'use client'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useMemo, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ExpedienteService from '../../service/ExpedienteService';
import { Expediente } from '../../model/Expediente';
import { Ubicacion } from '../../model/Ubicacion';
import DashboardHeader from './DashboardHeader'
import DashboardFilters from './DashboardFilters'
import DashboardAddExpediente from './DashboardAddExpediente'
import DashboardEditExpediente from './DashboardEditExpediente'
import DashboardExpedientesTable from './DashboardExpedientesTable'
import { AxiosResponse } from 'axios';

export default function Dashboard() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [newYear, setNewYear] = useState<string>("")
  const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
    year: selectedYear || undefined,
    locations: [],
  })
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null)
  const [newUbicacion, setNewUbicacion] = useState<string>("")
  const [expandedUbicaciones, setExpandedUbicaciones] = useState<number[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(expedientes.map(exp => exp.year)))
    return uniqueYears.sort((a, b) => parseInt(b) - parseInt(a))
  }, [expedientes])

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((expediente) => {
      const matchesSearch = Object.entries(expediente).some(([, value]) => {
        if (value === undefined || value === null) return false
        if (Array.isArray(value)) {
          return value.some(item =>
            Object.values(item).some(() =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
        }
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      })
      const matchesYear = selectedYear ? expediente.year === selectedYear : true
      return matchesSearch && matchesYear
    })
  }, [expedientes, searchTerm, selectedYear])

  useEffect(() => {
    ExpedienteService.findAllExpedients()
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
    const yearToAdd = parseInt(newYear);
    if (!isNaN(yearToAdd) && !years.includes(yearToAdd.toString())) {
      setSelectedYear(yearToAdd.toString());
      setNewYear("");
    }
  }

  const handleAddUbicacion = (isEditing: boolean = false) => {
    if (newUbicacion) {
      const nuevaUbicacion: Ubicacion = {
        id: null,
        place: newUbicacion
      }
      if (isEditing && editingExpediente) {
        setEditingExpediente({
          ...editingExpediente,
          locations: [nuevaUbicacion, ...editingExpediente.locations]
        })
      } else {
        setNewExpediente({
          ...newExpediente,
          locations: [nuevaUbicacion, ...(newExpediente.locations || [])]
        })
      }
      setNewUbicacion("")
    }
  }

  const handleAddExpediente = () => {
    if (selectedYear) {
      const newExp: Expediente = {
        id: Date.now(),
        organizationCode: newExpediente.organizationCode || "",
        correlativeNumber: newExpediente.correlativeNumber || "",
        issuer: newExpediente.issuer || "",
        year: selectedYear,
        regulations: newExpediente.regulations || [],
        solicitude: newExpediente.solicitude || "",
        locations: newExpediente.locations || [],
        pdfPath: newExpediente.pdfPath
      }

      ExpedienteService.createExpedient(newExp)
        .then(response => {
          setExpedientes([...expedientes, response.data])
          setNewExpediente({ year: selectedYear, locations: [], })
        })
        .catch(error => {
          console.error('Error adding expediente:', error)
        })
    }
  }

  const handleEditExpediente = (expediente: Expediente) => {
    setEditingExpediente(expediente)
  }

  const handleCancelEdit = () => {
    setEditingExpediente(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      ExpedienteService.uploadExcelFile(file)
        .then(response => {
          if (editingExpediente) {
            setEditingExpediente({ ...editingExpediente, pdfPath: response.data })
          } else {
            setNewExpediente({ ...newExpediente, pdfPath: response.data })
          }
        })
        .catch(error => {
          console.error('Error uploading file:', error)
        })
    }
  }

  const handleDeletePDF = (isEditing: boolean = false) => {
    if (isEditing && editingExpediente) {
      setEditingExpediente({ ...editingExpediente, pdfPath: undefined })
    } else {
      setNewExpediente({ ...newExpediente, pdfPath: undefined })
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

  const handleEditUbicacion = (expedienteId: number, ubicacionIndex: number, newLugar: string) => {
    setExpedientes(expedientes.map(exp => {
      if (exp.id === expedienteId) {
        const updatedUbicaciones = [...exp.locations];
        updatedUbicaciones[ubicacionIndex] = {
          ...updatedUbicaciones[ubicacionIndex],
          place: newLugar,
        };
        return { ...exp, locations: updatedUbicaciones };
      }
      return exp;
    }));

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
            handleCancelEdit={handleCancelEdit}
            handleFileChange={handleFileChange}
            handleDeletePDF={handleDeletePDF}
            fileInputRef={fileInputRef}
            buttonVariants={buttonVariants}
            setExpedientes={setExpedientes}
            expedientes={expedientes} // Pasar expedientes como prop
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
      <Link to="/course-upload" className="bg-green-500 text-white p-2 mt-4 inline-block">
        Subir Archivo de Cursos
      </Link>
    </motion.div>
  )
}

function setError(arg0: string) {
  throw new Error('Function not implemented.');
}
