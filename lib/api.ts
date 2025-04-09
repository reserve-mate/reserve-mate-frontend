import axios,{AxiosRequestConfig, AxiosResponse} from "axios";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

//Axios 생성
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

//요청 인터셉터(AccessToken)
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if(token){
      // config.headers.Authorization = `Bearer ${token}`; 
      config.headers["access"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//응답 인터셉터 - access 토큰 헤더에서 가져와서 저장
apiInstance.interceptors.response.use(
  (response) => {
    const newAccessToken = response.headers["access"];
    console.log("accessToken:"+ newAccessToken);
    if(newAccessToken){
      localStorage.setItem("access", newAccessToken);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // 로그아웃 예외처리
    if(originalRequest.url === '/logout'){
      return Promise.reject(error);
    }

    // 에러응답,401,재시도x
    if(error.response && error.response.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;
      
      try {
        await api.post("/reissue");
        return apiInstance(originalRequest);  //기존 요청 재시도
      } catch (reissueError) {
        //refreshToken 만료 -> 로그인 페이지 이동
        localStorage.removeItem("access");
        window.location.href = "/login";
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);

// API 메서드
export const api = {
  //GET
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await apiInstance.get(url, config);
    return res.data;
  },
  //POST
  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await apiInstance.post(url, data, config);
    return res.data;
  },
  //PUT
  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await apiInstance.put(url, data, config);
    return res.data;
  },
  //PATCH
  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await apiInstance.patch(url, data, config);
    return res.data;
  },
  //DELETE
  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const res: AxiosResponse<T> = await apiInstance.delete(url, config);
    return res.data;
  },
}; 

