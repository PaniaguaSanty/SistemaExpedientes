import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpedienteForm from "../Dashboard/ExpedienteForm";
import ExpedienteTable from "../Dashboard/ExpedienteTable";
import StatBox from "../StatBox";
import { Expediente, Ubicacion } from "../../model/Expediente";
import ExpedienteService from '../../service/ExpedienteService';

const useExpedientes = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [newYear, setNewYear] = useState<string>("");
  const [newExpediente, setNewExpediente] = useState<Partial<Expediente>>({
    year: selectedYear !== null ? selectedYear : undefined,
    locations: [],
    regulations: []
  });
  const [editingExpediente, setEditingExpediente] = useState<Expediente | null>(null);
  const [newUbicacion, setNewUbicacion] = useState<string>("");
  const [expandedUbicaciones, setExpandedUbicaciones] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const fetchExpedientes = async () => {
    try {
      const response = await ExpedienteService.findAllExpedients();
      setExpedientes(response.data);
    } catch (error) {
      console.error('Error fetching expedientes:', error);
    }
  };

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(expedientes.map(exp => exp.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [expedientes]);

  const filteredExpedientes = useMemo(() => {
    return expedientes.filter((expediente) => {
      const matchesSearch = Object.entries(expediente).some(([key, value]) => {
        if (value === undefined || value === null) return false;
        if (Array.isArray(value)) {
          return value.some(item =>
            Object.values(item).some(v =>
              value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
          );
        }
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      });
      const matchesYear = selectedYear ? expediente.year === selectedYear : true;
      return matchesSearch && matchesYear;
    });
  }, [expedientes, searchTerm, selectedYear]);

  const handleAddYear = async () => {
    const yearToAdd = parseInt(newYear);
    if (yearToAdd && !years.includes(yearToAdd)) {
      setSelectedYear(yearToAdd);
      setNewYear("");
      await fetchExpedientes();
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
          locations: [nuevaUbicacion, ...editingExpediente.locations]
        });
      } else {
        setNewExpediente({
          ...newExpediente,
          locations: [nuevaUbicacion, ...(newExpediente.locations || [])]
        });
      }
      setNewUbicacion("");
    }
  };

  const handleAddExpediente = async () => {
    try {
      const response = await ExpedienteService.createExpedient(newExpediente as Expediente);
      setExpedientes([...expedientes, response.data]);
      setNewExpediente({ year: selectedYear !== null ? selectedYear : undefined, locations: [], regulations: [] });
    } catch (error) {
      console.error('Error adding expediente:', error);
    }
  };

  const handleEditExpediente = (expediente: Expediente) => {
    setEditingExpediente(expediente);
  };

  const handleSaveEdit = async () => {
    if (editingExpediente) {
      try {
        const response = await ExpedienteService.updateExpedient(editingExpediente);
        setExpedientes(expedientes.map(exp =>
          exp.id === editingExpediente.id ? response.data : exp
        ));
        setEditingExpediente(null);
      } catch (error) {
        console.error('Error saving edit:', error);
      }
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
        const updatedUbicaciones = [...exp.locations];
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

  const findByYear = async (year: string) => {
    try {
      const response = await ExpedienteService.findByYear(year);
      return response;
    } catch (error) {
      console.error('Error finding expedients by year:', error);
      throw error;
    }
  };

  return {
    expedientes,
    setExpedientes, // Añadir setExpedientes al objeto de retorno
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
    findByYear, // Añadir la función findByYear
  };
};

export default useExpedientes;
