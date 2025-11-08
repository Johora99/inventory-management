import axios from "axios"

const axiosPublic = axios.create({
  // baseURL: "http://localhost:5001",
    baseURL:'https://inventory-management-nu-sandy-20.vercel.app',
})
export default function useAxiosPublic() {
  return axiosPublic  

}
