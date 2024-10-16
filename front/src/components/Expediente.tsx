"use client"

import { useState, useEffect, useMemo } from "react"
import { PlusCircle, Check, Loader2, Search, ChevronRight, ChevronLeft, Pencil, Trash2 } from "lucide-react"

import { Button } from "../../@/components/button"
import { Input } from "../../@/components/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../@/components/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "../../@/components/dialog"
import { Label } from "../../@/components/label"

type Resolution = {
  id: number;
  resolutionNumber: string;
  expedientId: number; // Asumiendo que esto es el ID del expediente al que pertenece la resolución
  status: string;
};
type Location={
  id: number;
  origin: string;
  destiny: string;
  date: Date; 
}
type Expediente = {
  id: number;
  issuer: string;
  organizationCode: string;
  correlativeNumber: string;
  solicitude: string;
  year: number;
  resolutions: Resolution[];
  location: Location[];
};

export default function ExpedientesCRUD() {
  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [expedienteActual, setExpedienteActual] = useState<Expediente | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const itemsPerPage = 20

  // Fetch expedientes from API
  useEffect(() => {
    const fetchExpedientes = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:8080/api/expedients') // Reemplaza con tu endpoint
        const data = await response.json()
        setExpedientes(data)
      } catch (error) {
        console.error("Error fetching expedientes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpedientes()
  }, [])

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((expediente) =>
      Object.values(expediente).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [expedientes, searchTerm])

  const totalPages = Math.ceil(filteredExpedientes.length / itemsPerPage)

  const currentItems = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    return filteredExpedientes.slice(indexOfFirstItem, indexOfLastItem)
  }, [filteredExpedientes, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const handleAdd = () => {
    setExpedienteActual(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (expediente: Expediente) => {
    setExpedienteActual(expediente)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    // Suponiendo que tienes un endpoint para eliminar expedientes
    await fetch(`/api/expedientes/${id}`, {
      method: 'DELETE',
    })
    setExpedientes(expedientes.filter(exp => exp.id !== id))
  }

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   const formData = new FormData(e.currentTarget)
  //   const nuevoExpediente: Expediente = {
  //     id: expedienteActual ? expedienteActual.id : Date.now(),
  //     issuer: formData.get('issuer') as string,
  //     organizationCode: formData.get('organizationCode') as string,
  //     correlativeNumber: formData.get('correlativeNumber') as string,
  //     solicitude: formData.get('solicitude') as string,
  //     year: parseInt(formData.get('year') as string),

  //     location: []
  //   }

  //   const method = expedienteActual ? 'PUT' : 'POST'
  //   const endpoint = expedienteActual ? `/api/expedientes/${expedienteActual.id}` : '/api/expedientes'

  //   await fetch(endpoint, {
  //     method,
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(nuevoExpediente),
  //   })

  //   setExpedientes((prev) => {
  //     if (expedienteActual) {
  //       return prev.map(exp => exp.id === expedienteActual.id ? nuevoExpediente : exp)
  //     } else {
  //       return [...prev, nuevoExpediente]
  //     }
  //   })

  //   setIsLoading(false)
  //   setIsConfirmed(true)
  //   setTimeout(() => {
  //     setIsConfirmed(false)
  //     setIsDialogOpen(false)
  //   }, 1500)
  // }

  return (
    <div className="container mx-auto p-4 bg-white font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#1A2E4A]">Gestión de Expedientes</h1>
      <div className="mb-6 flex justify-between items-center">
        <Button onClick={handleAdd} className="bg-[#1A2E4A] hover:bg-[#255EA9] text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Añadir Expediente
        </Button>
        <div className="relative w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar expedientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-[#255EA9]"
          />
        </div>
      </div>
      <div className="overflow-x-auto bg-[#E0F0FF] rounded-lg shadow-lg">
      <Table>
          <TableHeader>
            <TableRow className="bg-[#1A2E4A] text-white">
              <TableHead className="py-3">Código</TableHead>
              <TableHead className="py-3">Número de Orden</TableHead>
              <TableHead className="py-3">Número de Expediente</TableHead>
              <TableHead className="py-3">Emisor</TableHead>
              <TableHead className="py-3">Año</TableHead>
              <TableHead className="py-3">Resolución</TableHead>
              <TableHead className="py-3">Pedido</TableHead>
              <TableHead className="py-3">Ubicación</TableHead>
              <TableHead className="py-3">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((expediente, index) => (
              <TableRow key={expediente.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#E0F0FF]'}>
                <TableCell className="py-3">{expediente?.id}</TableCell>
                <TableCell className="py-3">{expediente?.organizationCode}</TableCell>
                <TableCell className="py-3">{expediente?.correlativeNumber}</TableCell>
                <TableCell className="py-3">{expediente?.issuer}</TableCell>
                <TableCell className="py-3">{expediente?.year}</TableCell>
                <TableCell className="py-3">{expediente?.solicitude}</TableCell>
                <TableCell className="py-3">
  {expediente.resolutions?.length > 0 ? (
    expediente.resolutions.map((resolution, resIndex) => (
      <div key={resIndex}>{resolution.resolutionNumber}</div>
    ))
  ) : (
    <div>Sin resoluciones</div>
  )}
</TableCell>
<TableCell className="py-3">
  {expediente.location?.length > 0 ? (
    expediente.location.map((location, locIndex) => (
      <div key={locIndex}>{location.id}</div>
    ))
  ) : (
    <div>Sin ubicaciones</div>
  )}
</TableCell>

                <TableCell className="py-3">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(expediente)} className="text-[#255EA9] hover:text-[#1A2E4A]">
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(expediente.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-[#255EA9] hover:bg-[#1A2E4A] text-white"
        >
          <ChevronLeft className="h-5 w-5 mr-2" /> Anterior
        </Button>
        <span className="text-[#1A2E4A] font-medium">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-[#255EA9] hover:bg-[#1A2E4A] text-white"
        >
          Siguiente <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A2E4A] text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{expedienteActual ? 'Editar Expediente' : 'Añadir Expediente'}</DialogTitle>
          </DialogHeader>
          <form  className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="codigo" className="text-sm font-medium">
                  Código
                </Label>
                <Input
                  id="codigo"
                  name="codigo"
                  defaultValue={expedienteActual?.organizationCode}
                  className="w-full bg-white text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroOrden" className="text-sm font-medium">
                  Número de Orden
                </Label>
                <Input
                  id="numeroOrden"
                  name="numeroOrden"
                  defaultValue={expedienteActual?.correlativeNumber}
                  className="w-full bg-white text-black"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="numeroExpediente" className="text-sm font-medium">
                  Número de Expediente
                </Label>
                <Input
                  id="numeroExpediente"
                  name="numeroExpediente"
                  defaultValue={expedienteActual?.numeroExpediente}
                  className="w-full bg-white text-black"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="emisor" className="text-sm font-medium">
                  Emisor
                </Label>
                <Input
                  id="emisor"
                  name="emisor"
                  defaultValue={expedienteActual?.issuer}
                  className="w-full bg-white text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano" className="text-sm font-medium">
                  Año
                </Label>
                <Input
                  id="ano"
                  name="ano"
                  type="number"
                  defaultValue={expedienteActual?.year}
                  className="w-full bg-white text-black"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="resolucion" className="text-sm font-medium">
                  Resolución
                </Label>
                <Input
                  id="resolucion"
                  name="resolucion"
                  defaultValue={expedienteActual?.resolucion}
                  className="w-full bg-white text-black"
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="pedido" className="text-sm font-medium">
                  Pedido
                </Label>
                <Input
                  id="pedido"
                  name="pedido"
                  defaultValue={expedienteActual?.solicitude}
                  className="w-full bg-white text-black"
                />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="ubicacion" className="text-sm font-medium">
                  Ubicación
                </Label>
                <Input
                  id="ubicacion"
                  name="ubicacion"
                  defaultValue={expedienteActual?.ubicacion}
                  className="w-full bg-white text-black"
                />
              </div>  */}
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-[#255EA9] hover:bg-[#1A2E4A] text-white w-full justify-center"
                disabled={isLoading || isConfirmed}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isConfirmed ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  expedienteActual ? 'Actualizar' : 'Añadir'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}