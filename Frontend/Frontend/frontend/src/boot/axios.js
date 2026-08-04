import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

export default ({ app }) => {
  app.config.globalProperties.$api = api
}

export { api }