import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Ubicacion = {
  fecha: string;
  lugar: string;
};

type Expediente = {
  id: number;
  codigo: string;
  numeroOrden: string;
  numeroExpediente: string;
  emisor: string;
  ano: number;
  reglamentacion: string;
  pedido: string;
  ubicaciones: Ubicacion[];
  pdfPath?: string;
};

export default function Dashboard() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [newYear, setNewYear] = useState<string>("");
  const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
    ano: selectedYear || undefined,
    ubicaciones: [], // Inicializamos como un array vacío
  });
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null);
  const [newUbicacion, setNewUbicacion] = useState<string>("");
  const [expandedUbicaciones, setExpandedUbicaciones] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        lugar: newUbicacion,
      };
      if (isEditing && editingExpediente) {
        setEditingExpediente({
          ...editingExpediente,
          ubicaciones: [nuevaUbicacion, ...editingExpediente.ubicaciones],
        });
      } else {
        setNewExpediente({
          ...newExpediente,
          ubicaciones: [nuevaUbicacion, ...(newExpediente.ubicaciones || [])],
        });
      }
      setNewUbicacion("");
    }
  };

  const handleAddExpediente = () => {
    if (selectedYear) {
      const id = Date.now()
      const newExp: Expediente = {
        id: id,
        codigo: `EXP${id}`,
        numeroOrden: newExpediente.numeroOrden || "",
        numeroExpediente: newExpediente.numeroExpediente || "",
        emisor: newExpediente.emisor || "",
        ano: selectedYear,
        reglamentacion: newExpediente.reglamentacion || "",
        pedido: newExpediente.pedido || "",
        ubicaciones: newExpediente.ubicaciones || [],
        pdfPath: newExpediente.pdfPath
      }
      setExpedientes([...expedientes, newExp])
      setNewExpediente({ ano: selectedYear, ubicaciones: [] })
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
        <motion.div
          className="bg-white rounded-lg shadow p-4 cursor-pointer"
          variants={statBoxVariants}
          whileHover="hover"
        >
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Expedientes</h3>
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
            {filteredExpedientes.length}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-4 cursor-pointer"
          variants={statBoxVariants}
          whileHover="hover"
        >
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Año Seleccionado</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
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
            {selectedYear || "N/A"}
          </motion.div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-4 cursor-pointer"
          variants={statBoxVariants}
          whileHover="hover"
        >
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Años Disponibles</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
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
            {years.length}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0"
        variants={fadeInVariants}
      >
        <div className="flex items-center space-x-2">
          <select
            value={selectedYear || ""}
            onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : null)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
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

      <AnimatePresence>
        {selectedYear && !editingExpediente && (
          <motion.div
            className="bg-white rounded-lg shadow p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Añadir Nuevo Expediente para {selectedYear}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Número de Orden"
                value={newExpediente.numeroOrden || ''}
                onChange={(e) => setNewExpediente({...newExpediente, numeroOrden: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Número de Expediente"
                value={newExpediente.numeroExpediente || ''}
                onChange={(e) => setNewExpediente({...newExpediente, numeroExpediente: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Emisor"
                value={newExpediente.emisor || ''}
                onChange={(e) => setNewExpediente({...newExpediente, emisor: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Reglamentación"
                value={newExpediente.reglamentacion || ''}
                onChange={(e) => setNewExpediente({...newExpediente, reglamentacion: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Pedido"
                value={newExpediente.pedido || ''}
                onChange={(e) => setNewExpediente({...newExpediente, pedido: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Nueva ubicación"
                  value={newUbicacion}
                  onChange={(e) => setNewUbicacion(e.target.value)}
                  className="border border-gray-300 rounded-md p-2 flex-grow"
                />
                <motion.button
                  onClick={() => handleAddUbicacion()}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Añadir
                </motion.button>
              </div>
              {(newExpediente.ubicaciones || []).length > 0 && (
  <div className="col-span-full mt-2">
    <h4 className="font-medium mb-2">Ubicaciones añadidas:</h4>
    <ul className="space-y-2">
        {(newExpediente.ubicaciones || []).map((ubicacion, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={ubicacion.lugar}
              onChange={(e) => {
                const newUbicaciones = [...(newExpediente.ubicaciones || [])];
                newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                setNewExpediente({ ...newExpediente, ubicaciones: newUbicaciones });
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
            <input
              type="date"
              value={ubicacion.fecha ? new Date(ubicacion.fecha).toISOString().split('T')[0] : ""}
              onChange={(e) => {
                const newUbicaciones = [...(newExpediente.ubicaciones || [])];
                newUbicaciones[index] = { ...newUbicaciones[index], fecha: new Date(e.target.value).toISOString() };
                setNewExpediente({ ...newExpediente, ubicaciones: newUbicaciones });
              }}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
            <motion.button
              onClick={() => {
                const newUbicaciones = (newExpediente.ubicaciones || []).filter((_, i) => i !== index);
                setNewExpediente({ ...newExpediente, ubicaciones: newUbicaciones });
              }}
              className="text-red-500 hover:text-red-700"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Eliminar
            </motion.button>
          </li>
        ))}
      </ul>
    </div>
  )}
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
              <motion.button
                onClick={handleAddExpediente}
                className="col-span-full bg-green-500 text-white px-4 py-2 rounded-md"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardar Expediente
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingExpediente && (
          <motion.div
            className="bg-white rounded-lg shadow p-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Editar Expediente: {editingExpediente.codigo}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Número de Orden"
                value={editingExpediente.numeroOrden}
                onChange={(e) => setEditingExpediente({...editingExpediente, numeroOrden: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Número de Expediente"
                value={editingExpediente.numeroExpediente}
                onChange={(e) => setEditingExpediente({...editingExpediente, numeroExpediente: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Emisor"
                value={editingExpediente.emisor}
                onChange={(e) => setEditingExpediente({...editingExpediente, emisor: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Reglamentación"
                value={editingExpediente.reglamentacion}
                onChange={(e) => setEditingExpediente({...editingExpediente, reglamentacion: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Pedido"
                value={editingExpediente.pedido}
                onChange={(e) => setEditingExpediente({...editingExpediente, pedido: e.target.value})}
                className="border border-gray-300 rounded-md p-2"
              />
              <div className="col-span-full">
                <h3 className="text-lg font-semibold mb-2">Ubicaciones</h3>
                {editingExpediente.ubicaciones.map((ubicacion, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      value={ubicacion.lugar}
                      onChange={(e) => {
                        const newUbicaciones = [...editingExpediente.ubicaciones];
                        newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                        setEditingExpediente({...editingExpediente, ubicaciones: newUbicaciones});
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm flex-grow"
                    />
                    <input
                      type="date"
                      value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newUbicaciones = [...editingExpediente.ubicaciones];
                        newUbicaciones[index] = { ...newUbicaciones[index], fecha: new Date(e.target.value).toISOString() };
                        setEditingExpediente({...editingExpediente, ubicaciones: newUbicaciones});
                      }}
                      className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    />
                    <motion.button
                      onClick={() => {
                        const newUbicaciones = editingExpediente.ubicaciones.filter((_, i) => i !== index);
                        setEditingExpediente({...editingExpediente, ubicaciones: newUbicaciones});
                      }}
                      className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Eliminar
                    </motion.button>
                  </div>
                ))}
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nueva ubicación"
                    value={newUbicacion}
                    onChange={(e) => setNewUbicacion(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 flex-grow"
                  />
                  <motion.button
                    onClick={() => {
                      if (newUbicacion) {
                        const nuevaUbicacion = {
                          fecha: new Date().toISOString(),
                          lugar: newUbicacion
                        };
                        setEditingExpediente({
                          ...editingExpediente,
                          ubicaciones: [nuevaUbicacion, ...editingExpediente.ubicaciones]
                        });
                        setNewUbicacion("");
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Añadir
                  </motion.button>
                </div>
              </div>
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
                  {editingExpediente.pdfPath ? 'Cambiar PDF' : 'Adjuntar PDF'}
                </motion.button>
                {editingExpediente.pdfPath && (
                  <motion.button
                    onClick={() => handleDeletePDF(true)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Eliminar PDF
                  </motion.button>
                )}
                <span className="text-sm text-gray-500">
                  {editingExpediente.pdfPath ? (new URL(editingExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
                </span>
              </div>
              <div className="col-span-full flex justify-end space-x-2">
                <motion.button
                  onClick={handleCancelEdit}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Cancelar
                </motion.button>
                <motion.button
                  onClick={handleSaveEdit}
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20"  fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Guardar Cambios
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="bg-white rounded-lg shadow overflow-x-auto"
        variants={fadeInVariants}
      >
        <table className="min-w-full">
          <thead className="bg-[#1A2E4A] text-white">
            <tr>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Número de Orden</th>
              <th className="px-4 py-2 text-left">Número de Expediente</th>
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
              {filteredExpedientes.map((expediente) => (
                <motion.tr
                  key={expediente.id}
                  className="border-b hover:bg-gray-50"
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-2">{expediente.codigo}</td>
                  <td className="px-4 py-2">{expediente.numeroOrden}</td>
                  <td className="px-4 py-2">{expediente.numeroExpediente}</td>
                  <td className="px-4 py-2">{expediente.emisor}</td>
                  <td className="px-4 py-2">{expediente.ano}</td>
                  <td className="px-4 py-2 bg-blue-100 font-medium">{expediente.reglamentacion}</td>
                  <td className="px-4 py-2">{expediente.pedido}</td>
                  <td className="px-4 py-2">
                    {expediente.ubicaciones.length > 0 && (
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={expediente.ubicaciones[0].lugar}
                            onChange={(e) => handleEditUbicacion(expediente.id, 0, e.target.value, expediente.ubicaciones[0].fecha)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                          />
                          <motion.button
                            id={`save-button-${expediente.id}-0`}
                            onClick={() => handleEditUbicacion(expediente.id, 0, expediente.ubicaciones[0].lugar, expediente.ubicaciones[0].fecha)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-sm transition-all duration-300 ease-in-out"
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                          >
                            Guardar
                          </motion.button>
                          <motion.button
                            onClick={() => {
                              const newUbicaciones = expediente.ubicaciones.filter((_, i) => i !== 0);
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
                        {expediente.ubicaciones.length > 1 && (
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
                                  {expediente.ubicaciones.map((ubicacion, index) => (
                                    <motion.li
                                      key={index}
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
                                      <input
                                        type="date"
                                        value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                                        onChange={(e) => handleEditUbicacion(expediente.id, index, ubicacion.lugar, new Date(e.target.value).toISOString())}
                                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                      />
                                      <motion.button
                                        id={`save-button-${expediente.id}-${index}`}
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
                                          const newUbicaciones = expediente.ubicaciones.filter((_, i) => i !== index);
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
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {expediente.pdfPath ? (
                      <motion.button
                        className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                        onClick={() => handleOpenPDF(expediente.pdfPath!)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Ver PDF
                      </motion.button>
                    ) : (
                      "No hay PDF"
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                      onClick={() => handleEditExpediente(expediente)}
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      Editar
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  )
}
