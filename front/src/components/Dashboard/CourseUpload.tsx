import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpedienteService from '../../service/ExpedienteService';
import Pagination from '../../components/Pagination';
import { Course } from '../../model/Course'; // Asegúrate de que esta importación sea correcta

const CourseUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(40);
  const [totalItems, setTotalItems] = useState(0);

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
          console.log('Datos guardados en la base de datos:', response);
          setMessage('Archivo subido y datos guardados correctamente!');
          setFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
          // Actualizar la tabla después de subir el archivo
          fetchCourses();
        })
        .catch(error => {
          setMessage('Error al procesar el archivo: ' + error.message);
        });
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await ExpedienteService.fetchCourses(currentPage, itemsPerPage);
      setCourses(response.data);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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

      <motion.div className="bg-white rounded-lg shadow overflow-x-auto mt-8">
        <table className="min-w-full">
          <thead className="bg-[#1A2E4A] text-white">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Denominaciones</th>
              <th className="px-4 py-2 text-left">Destinatarios</th>
              <th className="px-4 py-2 text-left">Instituciones Responsables</th>
              <th className="px-4 py-2 text-left">Año</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {courses.map((course) => (
                <motion.tr
                  key={course.id}
                  className="border-b hover:bg-gray-50"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-4 py-2">{course.id}</td>
                  <td className="px-4 py-2">{course.denominations}</td>
                  <td className="px-4 py-2">{course.recipients}</td>
                  <td className="px-4 py-2">{course.responsibleInstitutions}</td>
                  <td className="px-4 py-2">{course.year}</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </motion.div>
    </motion.div>
  );
};

export default CourseUploadPage;
