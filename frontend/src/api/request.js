import axios from 'axios';
import { toast } from 'sonner';


// Retained for optional local study of the original Express API.
// The public portfolio build does not import this client or transmit form data.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/"

const request = axios.create({
  baseURL: baseURL,
  timeout: 4000,
  
});

request.interceptors.response.use(
  response => {
    const message = response?.data.message
    if(message){
        toast.success(message)
    }
    return response;
  },
  error => {
    console.log(error.response)
    const message = error.response?.data.message
    if(message){
        toast.error(message)
    }
     
    return Promise.reject(error);
  }
);

export default request;

