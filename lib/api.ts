import axios,{AxiosRequestConfig, AxiosResponse} from "axios";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Axios 생성
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*"
  }
});

// 요청 인터셉터 - access 토큰 추가
apiInstance.interceptors.request.use(
  (config) => {
    // 인증이 필요없는 엔드포인트 목록
    const publicEndpoints = ['/api/mail/send/authCode', '/api/mail/check/authCode', '/users/register', '/login'];
    
    // 현재 요청 URL 확인 (baseURL 제외)
    const requestPath = config.url || '';
    
    // 인증이 필요없는 엔드포인트인 경우 토큰을 추가하지 않음
    if (publicEndpoints.some(endpoint => requestPath.includes(endpoint))) {
      return config;
    }
    
    const token = localStorage.getItem("accessToken");
    console.log("요청"+ token);
    if(token){
      config.headers["access"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh Token 으로 토큰 재발급
async function postRefreshToken(){
  return await axios.post(`${API_BASE_URL}/reissue`,null,{
    withCredentials: true,
  })
}
// 응답 인터셉터
apiInstance.interceptors.response.use(
  // 200 응답 성공
  (response) => {
    const newAccessToken = response.headers["access"];
    console.log("응답 accessToken:"+ newAccessToken);
    if(newAccessToken){
      localStorage.setItem("accessToken", newAccessToken);
      apiInstance.defaults.headers.common["access"] = newAccessToken;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.log("인터셉터 에러 상태:", error.response?.status);
    console.log("원본 요청 헤더:", originalRequest?.headers);
    
    if (error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;
      try {
        console.log("토큰 재발급 시도");
        const response = await postRefreshToken();
        if (response.status === 200){
          const newAccessToken = response.headers["access"];
          console.log("재발급 성공, 새로운 accessToken: "+ newAccessToken);
          if(newAccessToken){
            localStorage.setItem("accessToken", newAccessToken);
            
            originalRequest.headers = { 
              ...originalRequest.headers,
              "access": newAccessToken
            };
            
            console.log("재요청 headers:", originalRequest.headers);
            return apiInstance(originalRequest);
          }
        }
      // 재발급 실패
      } catch (error) {
        console.log("재발급실패", error);
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    console.log("응답 인터셉터 error",error);
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

