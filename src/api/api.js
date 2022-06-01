import { get, post, put } from "./axios"
import { BACKEND_API_URL } from '../config'

export const registerAccount = async (acc) => 
    post(BACKEND_API_URL + '/register/register-test-account', acc)