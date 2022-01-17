import Router from 'next/router'
import { parseCookies } from 'nookies'
import { getAPIClient } from './ssrAPI'

export async function LoadSSRProps(endpoint: string, ctx: any) {
  // console.log('Server side...')
  if (ctx.req) {
    const api = getAPIClient(ctx)
    const { 'medlife-auth': token } = parseCookies(ctx)

    /* if (!token) {
      return {
        redirect: {
          destination: '/expired',
          permanent: false,
        },
      }
    } else {
      api.defaults.headers.Authorization = `Bearer ${token}`
    } */
    const resp = await api.get(endpoint, { withCredentials: true })

    /* console.log('Resposta do server:')
    console.log(resp) */

    /* if (resp.status === 401) {
      api.defaults.headers.Authorization = ''
      return {
        redirect: {
          destination: '/expired',
          permanent: false,
        },
      }
    } else {
      api.defaults.headers.Authorization = `Bearer ${token}`
    } */

    return resp.data
  } else {
    // console.log('Client side...')
    const api = getAPIClient()
    const resp = await api.get(endpoint, { withCredentials: true })

    if (resp.status === 401) {
      Router.replace('/expired')
      return {}
    }

    return resp.data
  }
}
