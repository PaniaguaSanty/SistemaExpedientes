'use client'

import { useState, useMemo, useRef } from "react"

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
    ubicaciones: [],
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
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#1A2E4A]">Gestión de Expedientes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Expedientes</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{filteredExpedientes.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Año Seleccionado</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{selectedYear || "Ninguno"}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Años Disponibles</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm font-medium">{years.join(", ")}</div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
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
          <button 
            onClick={handleAddYear} 
            disabled={!newYear}
            className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Añadir Año
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Buscar expedientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-64"
          />
          <button className="border border-gray-300 rounded-md p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {selectedYear && !editingExpediente && (
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Añadir Nuevo Expediente para {selectedYear}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="Número de Orden"
              value={newExpediente.numeroOrden || ""}
              onChange={(e) => setNewExpediente({...newExpediente, numeroOrden: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Número de Expediente"
              value={newExpediente.numeroExpediente || ""}
              onChange={(e) => setNewExpediente({...newExpediente, numeroExpediente: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Emisor"
              value={newExpediente.emisor || ""}
              onChange={(e) => setNewExpediente({...newExpediente, emisor: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Reglamentación"
              value={newExpediente.reglamentacion || ""}
              onChange={(e) => setNewExpediente({...newExpediente, reglamentacion: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Pedido"
              value={newExpediente.pedido || ""}
              onChange={(e) => setNewExpediente({...newExpediente, pedido: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <div className="col-span-2 flex items-center space-x-2">
              <input
                placeholder="Nueva Ubicación"
                value={newUbicacion}
                onChange={(e) => setNewUbicacion(e.target.value)}
                className="border border-gray-300 rounded-md p-2 flex-grow"
              
              />
              <button 
                onClick={() => handleAddUbicacion()} 
                disabled={!newUbicacion}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 flex-shrink-0"
              >
                
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011  1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir
              </button>
            </div>
            <div className="col-span-2">
              <h3 className="font-bold mb-2">Ubicación actual:</h3>
              {newExpediente.ubicaciones && newExpediente.ubicaciones.length > 0 ? (
                <p>{newExpediente.ubicaciones[0].lugar}</p>
              ) : (
                <p>Sin ubicación</p>
              )}
              {newExpediente.ubicaciones && newExpediente.ubicaciones.length > 1 && (
                <div className="mt-2">
                  <button
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    onClick={() => toggleUbicaciones(-1)}
                  >
                    {expandedUbicaciones.includes(-1) ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Ocultar ubicaciones anteriores
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Ver ubicaciones anteriores
                      </>
                    )}
                  </button>
                  {expandedUbicaciones.includes(-1) && (
                    <ul className="list-disc pl-5 mt-2">
                      {newExpediente.ubicaciones.slice(1).map((ubicacion, index) => (
                        <li key={index}>{new Date(ubicacion.fecha).toLocaleDateString()}: {ubicacion.lugar}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                Adjuntar PDF
              </button>
              <span className="text-sm text-gray-500">
                {newExpediente.pdfPath ? (new URL(newExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
              </span>
            </div>
            <button 
              onClick={handleAddExpediente} 
              className="col-span-full bg-green-500 text-white px-4 py-2 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Guardar Expediente
            </button>
          </div>
        </div>
      )}

      {editingExpediente && (
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <h2 className="text-xl font-bold mb-4">Editar Expediente: {editingExpediente.codigo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              placeholder="Número de Orden"
              value={editingExpediente.numeroOrden}
              onChange={(e) => setEditingExpediente({...editingExpediente, numeroOrden: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Número de Expediente"
              value={editingExpediente.numeroExpediente}
              onChange={(e) => setEditingExpediente({...editingExpediente, numeroExpediente: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Emisor"
              value={editingExpediente.emisor}
              onChange={(e) => setEditingExpediente({...editingExpediente, emisor: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Reglamentación"
              value={editingExpediente.reglamentacion}
              onChange={(e) => setEditingExpediente({...editingExpediente, reglamentacion: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <input
              placeholder="Pedido"
              value={editingExpediente.pedido}
              onChange={(e) => setEditingExpediente({...editingExpediente, pedido: e.target.value})}
              className="border border-gray-300 rounded-md p-2"
            />
            <div className="col-span-2 flex items-center space-x-2">
              <input
                placeholder="Nueva Ubicación"
                value={newUbicacion}
                onChange={(e) => setNewUbicacion(e.target.value)}
                className="border border-gray-300 rounded-md p-2 flex-grow"
              />
              <button 
                onClick={() => handleAddUbicacion(true)} 
                disabled={!newUbicacion}
                className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50 flex-shrink-0"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir
              </button>
            </div>
            <div className="col-span-2">
              <h3 className="font-bold mb-2">Ubicación actual:</h3>
              {editingExpediente.ubicaciones.length > 0 ? (
                <p>{editingExpediente.ubicaciones[0].lugar}</p>
              ) : (
                <p>Sin ubicación</p>
              )}
              {editingExpediente.ubicaciones.length > 1 && (
                <div className="mt-2">
                  <button
                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                    onClick={() => toggleUbicaciones(editingExpediente.id)}
                  >
                    {expandedUbicaciones.includes(editingExpediente.id) ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Ocultar ubicaciones anteriores
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Ver ubicaciones anteriores
                      </>
                    )}
                  </button>
                  {expandedUbicaciones.includes(editingExpediente.id) && (
                    <ul className="list-disc pl-5 mt-2">
                      {editingExpediente.ubicaciones.map((ubicacion, index) => (
                        <li key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="text"
                            value={ubicacion.lugar}
                            onChange={(e) => {
                              const newUbicaciones = [...editingExpediente.ubicaciones];
                              newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                              setEditingExpediente(prev => prev ? {...prev, ubicaciones: newUbicaciones} : prev);
                            }}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                          />
                          <input
                            type="date"
                            value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                            onChange={(e) => {
                              const newUbicaciones = [...editingExpediente.ubicaciones];
                              newUbicaciones[index] = { ...newUbicaciones[index], fecha: new Date(e.target.value).toISOString() };
                              setEditingExpediente(prev => prev ? {...prev, ubicaciones: newUbicaciones} : prev);
                            }}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleEditUbicacion(editingExpediente.id, index, ubicacion.lugar, ubicacion.fecha)}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            Guardar
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                Adjuntar PDF
              </button>
              <span className="text-sm text-gray-500">
                {editingExpediente.pdfPath ? (new URL(editingExpediente.pdfPath)).pathname.split('/').pop() : 'Ningún PDF adjuntado'}
              </span>
            </div>
            <div className="col-span-full flex justify-end space-x-2">
              <button 
                onClick={handleCancelEdit}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20"  fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
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
            {filteredExpedientes.map((expediente) => (
              <tr key={expediente.id} className="border-b hover:bg-gray-50">
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
                      <p>Actual: {expediente.ubicaciones[0].lugar}</p>
                      {expediente.ubicaciones.length > 1 && (
                        <div>
                          <button
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                            onClick={() => toggleUbicaciones(expediente.id)}
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
                          </button>
                          {expandedUbicaciones.includes(expediente.id) && (
                            <ul className="list-disc pl-5 mt-2">
                              {expediente.ubicaciones.map((ubicacion, index) => (
                                <li key={index} className="flex items-center space-x-2 mb-2">
                                  <input
                                    type="text"
                                    value={ubicacion.lugar}
                                    onChange={(e) => {
                                      const newUbicaciones = [...expediente.ubicaciones];
                                      newUbicaciones[index] = { ...newUbicaciones[index], lugar: e.target.value };
                                      setExpedientes(expedientes.map(exp => 
                                        exp.id === expediente.id ? { ...exp, ubicaciones: newUbicaciones } : exp
                                      ));
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm mr-2"
                                  />
                                  <input
                                    type="date"
                                    value={new Date(ubicacion.fecha).toISOString().split('T')[0]}
                                    onChange={(e) => {
                                      const newUbicaciones = [...expediente.ubicaciones];
                                      newUbicaciones[index] = { ...newUbicaciones[index], fecha: new Date(e.target.value).toISOString() };
                                      setExpedientes(expedientes.map(exp => 
                                        exp.id === expediente.id ? { ...exp, ubicaciones: newUbicaciones } : exp
                                      ));
                                    }}
                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                                  />
                                  <button
                                    onClick={() => handleEditUbicacion(expediente.id, index, ubicacion.lugar, ubicacion.fecha)}
                                    className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                                  >
                                    Guardar
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2">
                  {expediente.pdfPath ? (
                    <button 
                      className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                      onClick={() => handleOpenPDF(expediente.pdfPath!)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      Ver PDF
                    </button>
                  ) : (
                    "No hay PDF"
                  )}
                </td>
                <td className="px-4 py-2">
                  <button 
                    className="border border-gray-300 text-gray-700 px-2 py-1 rounded-md text-sm"
                    onClick={() => handleEditExpediente(expediente)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}