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

type Expediente = {
  id: number
  codigo: string
  numeroOrden: string
  numeroExpediente: string
  emisor: string
  ano: number
  resolucion: string
  pedido: string
  ubicacion: string
}

const expedientesIniciales: Expediente[] = [
  {
    id: 1,
    codigo: "EXP001",
    numeroOrden: "5700",
    numeroExpediente: "NE001",
    emisor: "Departamento de Educación",
    ano: 2023,
    resolucion: "Aprobado",
    pedido: "Insumos para librerías",
    ubicacion: "Estante A, Fila 1"
  },
  {
    id: 2,
    codigo: "EXP002",
    numeroOrden: "5701",
    numeroExpediente: "NE002",
    emisor: "Departamento de Salud",
    ano: 2023,
    resolucion: "En revisión",
    pedido: "Equipos médicos",
    ubicacion: "Estante B, Fila 3"
  },
  {
    id: 20,
    codigo: "EXP020",
    numeroOrden: "5719",
    numeroExpediente: "NE020",
    emisor: "Departamento de Obras Públicas",
    ano: 2023,
    resolucion: "Pendiente",
    pedido: "Materiales de construcción",
    ubicacion: "Estante E, Fila 2"
  }
]

export default function ExpedientesCRUD() {
  const [expedientes, setExpedientes] = useState<Expediente[]>(expedientesIniciales)
  const [expedienteActual, setExpedienteActual] = useState<Expediente | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const itemsPerPage = 20

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

  const handleDelete = (id: number) => {
    setExpedientes(expedientes.filter(exp => exp.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const nuevoExpediente: Expediente = {
      id: expedienteActual ? expedienteActual.id : Date.now(),
      codigo: formData.get('codigo') as string,
      numeroOrden: formData.get('numeroOrden') as string,
      numeroExpediente: formData.get('numeroExpediente') as string,
      emisor: formData.get('emisor') as string,
      ano: parseInt(formData.get('ano') as string),
      resolucion: formData.get('resolucion') as string,
      pedido: formData.get('pedido') as string,
      ubicacion: formData.get('ubicacion') as string,
    }

    // Simular una operación asíncrona
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (expedienteActual) {
      setExpedientes(expedientes.map(exp => exp.id === expedienteActual.id ? nuevoExpediente : exp))
    } else {
      setExpedientes([...expedientes, nuevoExpediente])
    }

    setIsLoading(false)
    setIsConfirmed(true)
    setTimeout(() => {
      setIsConfirmed(false)
      setIsDialogOpen(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 bg-white font-sans">
      <h1 className="text-3xl font-bold mb-6 text-[#1A2E4A]">Gestión de Expedientes</h1>
      <div className="mb-6 flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="bg-[#1A2E4A] hover:bg-[#255EA9] text-white">
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Expediente
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#1A2E4A] text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{expedienteActual ? 'Editar Expediente' : 'Añadir Expediente'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="text-sm font-medium">
                    Código
                  </Label>
                  <Input
                    id="codigo"
                    name="codigo"
                    defaultValue={expedienteActual?.codigo}
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
                    defaultValue={expedienteActual?.numeroOrden}
                    className="w-full bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroExpediente" className="text-sm font-medium">
                    Número de Expediente
                  </Label>
                  <Input
                    id="numeroExpediente"
                    name="numeroExpediente"
                    defaultValue={expedienteActual?.numeroExpediente}
                    className="w-full bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emisor" className="text-sm font-medium">
                    Emisor
                  </Label>
                  <Input
                    id="emisor"
                    name="emisor"
                    defaultValue={expedienteActual?.emisor}
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
                    defaultValue={expedienteActual?.ano}
                    className="w-full bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resolucion" className="text-sm font-medium">
                    Resolución
                  </Label>
                  <Input
                    id="resolucion"
                    name="resolucion"
                    defaultValue={expedienteActual?.resolucion}
                    className="w-full bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pedido" className="text-sm font-medium">
                    Pedido
                  </Label>
                  <Input
                    id="pedido"
                    name="pedido"
                    defaultValue={expedienteActual?.pedido}
                    className="w-full bg-white text-black"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ubicacion" className="text-sm font-medium">
                    Ubicación
                  </Label>
                  <Input
                    id="ubicacion"
                    name="ubicacion"
                    defaultValue={expedienteActual?.ubicacion}
                    className="w-full bg-white text-black"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#1A2E4A] hover:bg-[#255EA9] text-white">
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
            {isConfirmed && <div className="mt-4 text-green-500">Expediente guardado con éxito.</div>}
          </DialogContent>
        </Dialog>

        <div className="flex items-center">
          <Input
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-1/3 mr-4"
          />
          <Button className="bg-[#1A2E4A] hover:bg-[#255EA9] text-white">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Número de Orden</TableHead>
            <TableHead>Número de Expediente</TableHead>
            <TableHead>Emisor</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Resolución</TableHead>
            <TableHead>Pedido</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((expediente) => (
            <TableRow key={expediente.id}>
              <TableCell>{expediente.codigo}</TableCell>
              <TableCell>{expediente.numeroOrden}</TableCell>
              <TableCell>{expediente.numeroExpediente}</TableCell>
              <TableCell>{expediente.emisor}</TableCell>
              <TableCell>{expediente.ano}</TableCell>
              <TableCell>{expediente.resolucion}</TableCell>
              <TableCell>{expediente.pedido}</TableCell>
              <TableCell>{expediente.ubicacion}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(expediente)} className="mr-2">
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button onClick={() => handleDelete(expediente.id)} className="text-red-600">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between mt-6">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span>Página {currentPage} de {totalPages}</span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
