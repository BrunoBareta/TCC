import axios from 'axios'

const host =
  typeof window !== 'undefined'
    ? window.location.hostname
    : 'localhost'

const api = axios.create({
  baseURL: `http://${host}:3000`
})

export default ({ app }) => {
  app.config.globalProperties.$api = api
}

export { api }