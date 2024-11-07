import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ExpedienteService from '../../service/ExpedienteService';
import * as XLSX from 'xlsx';

interface CourseData {
  id: number;
  denominations: string;
  recipients: string;
  responsible_institutions: string;
  year: string;
}

const CourseUploadPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<CourseData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const allData: CourseData[] = [];

        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

          // Mapea los datos a las columnas de la base de datos
          const mappedData = jsonData.slice(1).map((row: any[]) => ({
            id: row[0] as number,
            denominations: row[1] as string,
            recipients: row[2] as string,
            responsible_institutions: row[3] as string,
            year: sheetName, // Usa el nombre de la hoja como el año
          })) as CourseData[];

          allData.push(...mappedData);
        });

        setCourseData(allData);
        setMessage('Archivo subido y datos guardados correctamente!');
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsArrayBuffer(file);

      // Aquí puedes llamar a tu servicio para guardar los datos en la base de datos
      ExpedienteService.uploadCoursesExcel(file)
        .then(response => {
          console.log('Datos guardados en la base de datos:', response);
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
      {courseData.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">Datos del Archivo</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Denominaciones</th>
                <th className="py-2 px-4 border-b">Destinatarios</th>
                <th className="py-2 px-4 border-b">Instituciones Responsables</th>
                <th className="py-2 px-4 border-b">Año</th>
              </tr>
            </thead>
            <tbody>
              {courseData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="py-2 px-4 border-b">{row.id}</td>
                  <td className="py-2 px-4 border-b">{row.denominations}</td>
                  <td className="py-2 px-4 border-b">{row.recipients}</td>
                  <td className="py-2 px-4 border-b">{row.responsible_institutions}</td>
                  <td className="py-2 px-4 border-b">{row.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default CourseUploadPage;
