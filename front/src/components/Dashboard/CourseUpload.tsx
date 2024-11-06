import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ExpedienteService from '../../service/ExpedienteService';

const CourseUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      ExpedienteService.uploadCoursesExcel(file)
        .then(response => {
          setMessage('Archivo subido y datos guardados correctamente!');
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        })
        .catch(error => {
          setMessage('Error al procesar el archivo: ' + error.message);
        });
    }
  };

  return (
    <motion.div className="container mx-auto px-4 py-8 bg-gray-100" initial="hidden" animate="visible">
      <h1 className="text-2xl mb-4">Subir Archivo de Cursos</h1>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="border p-2 mb-2"
      />
      <button onClick={handleUpload} className="bg-blue-500 text-white p-2">
        Subir Archivo
      </button>
      {message && <p className="mt-4">{message}</p>}
    </motion.div>
  );
};

export default CourseUploadPage;
