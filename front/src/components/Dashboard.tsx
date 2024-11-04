//ELVIEJO
import { useState, useMemo, useRef, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ExpedienteForm from "../Dashboard/ExpedienteForm";
import ExpedienteTable from "../Dashboard/ExpedienteTable";
import StatBox from "../StatBox";
import { Expediente } from "../../model/Expediente";
import useExpedientes from "./useExpedientes";

export default function Dashboard() {
  const {
    expedientes,
    setExpedientes, // Añadir setExpedientes
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
  } = useExpedientes();

  const handleSearchByYear = async () => {
    if (newYear) {
      try {
        const response = await findByYear(newYear);
        setExpedientes(response.data);
      } catch (error) {
        console.error('Error finding expedients by year:', error);
      }
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
          <motion.button
            onClick={handleSearchByYear}
            disabled={!newYear}
            className="bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Buscar por Año
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
            newExpediente={newExpediente}
            setNewExpediente={setNewExpediente}
            newUbicacion={newUbicacion}
            setNewUbicacion={setNewUbicacion}
            handleAddUbicacion={handleAddUbicacion}
            handleAddExpediente={handleAddExpediente}
            handleFileChange={handleFileChange}
            handleDeletePDF={handleDeletePDF}
            buttonVariants={buttonVariants}
            fadeInVariants={fadeInVariants} setExpediente={function (value: SetStateAction<Expediente | null>): void {
              throw new Error("Function not implemented.");
            } }          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingExpediente && (
          <ExpedienteForm
            isEditing
            expediente={editingExpediente}
            setExpediente={setEditingExpediente}
            newUbicacion={newUbicacion}
            setNewUbicacion={setNewUbicacion}
            handleAddUbicacion={handleAddUbicacion}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleFileChange={handleFileChange}
            handleDeletePDF={handleDeletePDF}
            buttonVariants={buttonVariants}
            fadeInVariants={fadeInVariants} setNewExpediente={function (value: SetStateAction<Partial<Expediente>>): void {
              throw new Error("Function not implemented.");
            } }          />
        )}
      </AnimatePresence>

      <ExpedienteTable
        expedientes={filteredExpedientes}
        handleEditExpediente={handleEditExpediente}
        handleOpenPDF={handleOpenPDF}
        handleEditUbicacion={handleEditUbicacion}
        toggleUbicaciones={toggleUbicaciones}
        expandedUbicaciones={expandedUbicaciones}
        buttonVariants={buttonVariants}
        listItemVariants={listItemVariants}
      />
    </motion.div>
  );
}
