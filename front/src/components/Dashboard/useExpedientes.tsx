import { useState, useMemo, useRef } from "react";
import { Expediente, Ubicacion } from "../../model/Expediente";
import { Regulation } from "../../model/Regulation";

const useExpedientes = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [newYear, setNewYear] = useState<string>("");
  const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
    ano: selectedYear || undefined,
    ubicaciones: [],
    reglamentacion: []
  });
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null);
  const [newUbicacion, setNewUbicacion] = useState<string>("");
  const [expandedUbicaciones, setExpandedUbicaciones] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(expedientes.map(exp => exp.ano)));
    return uniqueYears.sort((a, b) => b - a);
  }, [expedientes]);

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((expediente) => {
      const matchesSearch = Object.entries(expediente).some(([key, value]) => {
        if (value === undefined || value === null) return false;
        if (Array.isArray(value)) {
          return value.some(item =>
            Object.values(item).some(v =>
              v.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      const matchesYear = selectedYear ? expediente.ano === selectedYear : true;
      return matchesSearch && matchesYear;
    });
  }, [expedientes, searchTerm, selectedYear]);

  const handleAddYear = () => {
    const yearToAdd = parseInt(newYear);
    if (yearToAdd && !years.includes(yearToAdd)) {
      setSelectedYear(yearToAdd);
      setNewYear("");
    }
  };

  const handleAddUbicacion = (isEditing: boolean = false) => {
    if (newUbicacion) {
      const nuevaUbicacion: Ubicacion = {
        fecha: new Date().toISOString(),
        lugar: newUbicacion
      };
      if (isEditing && editingExpediente) {
        setEditingExpediente({
          ...editingExpediente,
          ubicaciones: [nuevaUbicacion, ...editingExpediente.ubicaciones]
        });
      } else {
        setNewExpediente({
          ...newExpediente,
          ubicaciones: [nuevaUbicacion, ...(newExpediente.ubicaciones || [])]
        });
      }
      setNewUbicacion("");
    }
  };

  const handleAddExpediente = () => {
    if (selectedYear) {
      const id = Date.now();
      const newExp: Expediente = {
        id: id,
        codigo: `EXP${id}`,
        numeroOrden: newExpediente.numeroOrden || "",
        numeroExpediente: newExpediente.numeroExpediente || "",
        emisor: newExpediente.emisor || "",
        ano: selectedYear,
        reglamentacion: newExpediente.reglamentacion || [],
        pedido: newExpediente.pedido || "",
        ubicaciones: newExpediente.ubicaciones || [],
        pdfPath: newExpediente.pdfPath
      };
      setExpedientes([...expedientes, newExp]);
      setNewExpediente({ ano: selectedYear, ubicaciones: [], reglamentacion: [] });
    }
  };

  const handleEditExpediente = (expediente: Expediente) => {
    setEditingExpediente(expediente);
  };

  const handleSaveEdit = () => {
    if (editingExpediente) {
      setExpedientes(expedientes.map(exp =>
        exp.id === editingExpediente.id ? editingExpediente : exp
      ));
      setEditingExpediente(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpediente(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      if (editingExpediente) {
        setEditingExpediente({ ...editingExpediente, pdfPath: fileURL });
      } else {
        setNewExpediente({ ...newExpediente, pdfPath: fileURL });
      }
    }
  };

  const handleDeletePDF = (isEditing: boolean = false) => {
    if (isEditing && editingExpediente) {
      setEditingExpediente({ ...editingExpediente, pdfPath: undefined });
    } else {
      setNewExpediente({ ...newExpediente, pdfPath: undefined });
    }
  };

  const handleOpenPDF = (pdfPath: string) => {
    if (pdfPath.startsWith('blob:') || pdfPath.startsWith('file:')) {
      window.open(pdfPath, '_blank');
    } else {
      const fileURL = `file://${pdfPath}`;
      window.open(fileURL, '_blank');
    }
  };

  const toggleUbicaciones = (id: number) => {
    setExpandedUbicaciones(prev =>
      prev.includes(id) ? prev.filter(expId => expId !== id) : [...prev, id]
    );
  };

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
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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

  return {
    expedientes,
    searchTerm,
    setSearchTerm,
    selectedYear,
    setSelectedYear,
    newYear,
    setNewYear,
    newExpediente,
    setNewExpediente,
    editingExpediente,
    setEditingExpediente,
    newUbicacion,
    setNewUbicacion,
    expandedUbicaciones,
    setExpandedUbicaciones,
    fileInputRef,
    years,
    filteredExpedientes,
    handleAddYear,
    handleAddUbicacion,
    handleAddExpediente,
    handleEditExpediente,
    handleSaveEdit,
    handleCancelEdit,
    handleFileChange,
    handleDeletePDF,
    handleOpenPDF,
    toggleUbicaciones,
    handleEditUbicacion,
    buttonVariants,
    fadeInVariants,
    listItemVariants,
    statBoxVariants,
  };
};

export default useExpedientes;
