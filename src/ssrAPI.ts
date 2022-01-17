import axios, { AxiosInstance } from 'axios'
import * as next from 'next'
import router from 'next/router'
import { parseCookies } from 'nookies'

export function getAPIClient(
  ctx?:
    | Pick<next.NextPageContext, 'req'>
    | {
        req: next.NextApiRequest
      }
    | null
    | undefined
): AxiosInstance {
  const { 'medlife-auth': token } = parseCookies(ctx)
  const api = axios.create({
    baseURL: process.env.API_URL,
  })

  api.interceptors.request.use(config => {
    return config
  })

  api.interceptors.response.use(
    response => {
      // console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
      // console.log('Interceptando a resposta')
      // console.log(response)
      // console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')

      return response
    },
    function (error) {
      if (error.response) {
        console.log(error.response)
        if (error.response.status === 401) {
          console.error('Sessão expirada!')
          router.replace('/expired')
        }
      } else {
        console.log('=============================')
        console.error('Erro desconhecido!')
        console.log(error)
        console.log('=============================')
        // setStatusLogin(
        //   'Erro inesperado. Por favor, entre em contato com o suporte Medlife.'
        // )
        return Promise.reject(error)
      }
    }
  )

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`
  }

  return api
}
