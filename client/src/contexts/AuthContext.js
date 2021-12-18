import { createContext, useReducer, useEffect } from "react"
import { authReducer } from "../reducers/authReducer"
import { apiUrl, LOCAl_STORAGE_TOKEN_NAME } from "./constants"
import axios from "axios"
import setAuthToken from "../utils/setAuthToken"

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: true,
    isAuthenticated: false,
    user: null,
  })

  // Authenticate user
  const loadUser = async () => {
    if (localStorage[LOCAl_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAl_STORAGE_TOKEN_NAME])
    }
    try {
      const response = await axios.get(`${apiUrl}/auth`)
      if (response.data.success) {
        dispatch({
          type: "SET_AUTH",
          payload: { isAuthenticated: true, user: response.data.user },
        })
      }
    } catch (error) {
      localStorage.removeItem(LOCAl_STORAGE_TOKEN_NAME)
      setAuthToken(null)
      dispatch({
        type: "SET_AUTH",
        payload: { isAuthenticated: false, user: null },
      })
    }
  }

  useEffect(() => loadUser(), [])

  //register
  const registerUser = async userForm => {
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userForm)
      if (response.data.success)
        localStorage.setItem(
          LOCAl_STORAGE_TOKEN_NAME,
          response.data.accessToken
        )
      await loadUser()
      return response.data
    } catch (error) {
      if (error.response.data) return error.response.data
      else return { success: false, message: error.message }
    }
  }
  //login
  const loginUser = async userForm => {
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userForm)
      if (response.data.success)
        localStorage.setItem(
          LOCAl_STORAGE_TOKEN_NAME,
          response.data.accessToken
        )
      await loadUser()
      return response.data
    } catch (error) {
      if (error.response.data) return error.response.data
      else return { success: false, message: error.message }
    }
  }
  //logout
  const logoutUser = () => {
    localStorage.removeItem(LOCAl_STORAGE_TOKEN_NAME)
    dispatch({
      type: "SET_AUTH",
      payload: { isAuthenticated: false, user: null },
    })
  }
  //context data
  const authContextData = { loginUser, registerUser, logoutUser, authState }
  // return provider
  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
