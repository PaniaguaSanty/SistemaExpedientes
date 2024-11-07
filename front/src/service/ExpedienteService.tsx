import axios, { AxiosResponse } from 'axios';
import { Expediente } from '../model/Expediente'; // Ajusta la ruta según la ubicación de tus modelos
import { Ubicacion } from '../model/Ubicacion';
import { Regulation } from '../model/Regulation';
import { Course } from '../model/Course';

const API_URL = 'http://localhost:8080/api';

class ExpedienteService {

    async createExpedient(expedientRequest: Expediente): Promise<AxiosResponse<Expediente>> {
        try {
            const response = await axios.post(`${API_URL}/expedients/create`, expedientRequest);
            return response;
        } catch (error) {
            console.error('Error creating expedient:', error);
            throw error;
        }
    }

    async updateExpedient(expedientRequest: Expediente): Promise<AxiosResponse<Expediente>> {
        try {
            const response = await axios.put(`${API_URL}/expedients/update`, expedientRequest);
            return response;
        } catch (error) {
            console.error('Error updating expedient:', error);
            throw error;
        }
    }

    async deleteExpedient(id: string): Promise<AxiosResponse> {
        try {
            const response = await axios.delete(`${API_URL}/expedients/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting expedient:', error);
            throw error;
        }
    }

    async addLocation(id: number, locationDto: Ubicacion): Promise<AxiosResponse<Ubicacion>> {
        try {
            const response = await axios.put(`${API_URL}/expedients/addLocation/${id}`, locationDto);
            return response;
        } catch (error) {
            console.error('Error adding location:', error);
            throw error;
        }
    }

    async editLocation(id: number, existingPlace: string, locationDetails: Ubicacion): Promise<AxiosResponse<Ubicacion>> {
        try {
            const response = await axios.put(`${API_URL}/expedients/editLocation/${id}/${existingPlace}`, locationDetails);
            return response;
        } catch (error) {
            console.error('Error editing location:', error);
            throw error;
        }
    }

    async uploadExcelFile(file: File): Promise<AxiosResponse<string>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_URL}/expedients/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error uploading Excel file:', error);
            throw error;
        }
    }

    async uploadCoursesExcel(file: File): Promise<AxiosResponse<string>> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await axios.post(`${API_URL}/expedients/upload-courses`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response;
        } catch (error) {
            console.error('Error uploading courses Excel file:', error);
            throw error;
        }
    }

    async findExpedientById(id: string): Promise<AxiosResponse<Expediente>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/${id}`);
            return response;
        } catch (error) {
            console.error('Error finding expedient by ID:', error);
            throw error;
        }
    }

    async findAllExpedients(): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/findAll`);
            return response;
        } catch (error) {
            console.error('Error finding all expedients:', error);
            throw error;
        }
    }

    async findAllExpedientsPageable(page: number, size: number): Promise<{ data: Expediente[], totalItems: number }> {
        try {
            const response = await axios.get(`${API_URL}/expedients?page=${page}&size=${size}`);
            return {
                data: response.data.content, // Ajusta según la estructura de tu respuesta
                totalItems: response.data.totalElements, // Asegúrate de que esto esté presente
            };
        } catch (error) {
            console.error('Error finding all expedients pageable:', error);
            throw error;
        }
    }

    async fetchCourses(page: number, size: number): Promise<{ data: Course[], totalItems: number }> {
        try {
            const response = await axios.get(`${API_URL}/expedients/findAllCoursesPaged?page=${page}&size=${size}`);
            return {
                data: response.data.content, // Ajusta según la estructura de tu respuesta
                totalItems: response.data.totalElements, // Asegúrate de que esto esté presente
            };
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    }

    async findByOrganizationCode(orgCode: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/organization/${orgCode}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by organization code:', error);
            throw error;
        }
    }

    async findByYear(year: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/year/${year}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by year:', error);
            throw error;
        }
    }

    async findByCorrelativeNumber(number: string): Promise<AxiosResponse<Expediente>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/correlative/${number}`);
            return response;
        } catch (error) {
            console.error('Error finding expedient by correlative number:', error);
            throw error;
        }
    }

    async findByIssuer(issuer: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/issuer/${issuer}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by issuer:', error);
            throw error;
        }
    }

    async findByLocation(location: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/location/${location}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by location:', error);
            throw error;
        }
    }

    async findRegulationsByExpedientId(expedientId: number): Promise<AxiosResponse<Regulation[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/regulations/${expedientId}`);
            return response;
        } catch (error) {
            console.error('Error finding regulations by expedient ID:', error);
            throw error;
        }
    }

    async findSolicitudeByIssuer(issuer: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/solicitudes/${issuer}`);
            return response;
        } catch (error) {
            console.error('Error finding solicitudes by issuer:', error);
            throw error;
        }
    }

    async findBySolicitude(solicitude: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/solicitude/${solicitude}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by solicitude:', error);
            throw error;
        }
    }

    async findByStatus(status: string): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/status/${status}`);
            return response;
        } catch (error) {
            console.error('Error finding expedients by status:', error);
            throw error;
        }
    }

    async getAllExpedientes(): Promise<AxiosResponse<Expediente[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/getAll`);
            return response;
        } catch (error) {
            console.error('Error getting all expedientes:', error);
            throw error;
        }
    }

    async findRegulationsByIssuer(issuer: string): Promise<AxiosResponse<Regulation[]>> {
        try {
            const response = await axios.get(`${API_URL}/expedients/findRegulationsByIssuer/${issuer}`);
            return response;
        } catch (error) {
            console.error('Error finding regulations by issuer:', error);
            throw error;
        }
    }
}

export default new ExpedienteService();
