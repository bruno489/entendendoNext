import { useRouter } from "next/router"
import axios from "axios"
import { responseSymbol } from "next/dist/server/web/spec-compliant/fetch-event"

//pega todo o conteudo da rota
export default function Profile(){
    console.log(user)
    const router = useRouter()
    //pega o conteudo da rota e add em router
    return <div>
        Profile com id {router.query.id}
        </div>
}

export async function getStaticProps(context) {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users',
    {params:{id:context.params.id}}
    )
    const user = await response.data[0]
    console.log(user)
    return {
      props: {user}, // will be passed to the page component as props
    }
  }