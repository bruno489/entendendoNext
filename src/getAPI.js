import axios from "axios"

export default function getAPI() {
  
    const api = axios.create({
      baseURL: process.env.API_URL,
    })
  
    return api
  }