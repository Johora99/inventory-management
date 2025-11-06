import axios from "axios"

const axiosPublic = axios.create({
  // baseURL: "http://localhost:5001",
    baseURL:'https://inventory-management-khaki-six.vercel.app',
})
export default function useAxiosPublic() {
  return axiosPublic  

}
