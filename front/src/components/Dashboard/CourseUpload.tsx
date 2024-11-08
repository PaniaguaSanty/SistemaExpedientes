import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExpedienteService from '../../service/ExpedienteService';
import Pagination from '../../components/Pagination';
import { Course } from '../../model/Course'; 
import { useNavigate } from 'react-router-dom';
import '../../styles/Pagination.css'
import '../../styles/BackButton.css';
import '../../styles/UploadButton.css';

const CourseUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(40);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (file: File) => {
    setLoading(true);
    ExpedienteService.uploadCoursesExcel(file)
      .then(response => {
        console.log('Datos guardados en la base de datos:', response);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        fetchCourses();
      })
      .catch(error => {
        setMessage('Error al procesar el archivo: ' + error.message);
      })
      .finally(() => {
        setLoading(false);
      });
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

  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior
  };

  return (
    <motion.div className="container mx-auto px-4 py-8 bg-gray-100" initial="hidden" animate="visible">
      <button onClick={handleGoBack} className="back-button mt-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={() => fileInputRef.current?.click()} className="upload-button">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />

        
        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="upload-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
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
