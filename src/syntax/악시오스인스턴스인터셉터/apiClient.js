// import axios from "axios";

// // axios instance 생성
// export const apiClient = axios.create({
//    headers: { 'Content-Type': 'application/json',"sex " : "Apache-HttpClient/4.5.14 (Java/11.0.19)" }
   
// });

// apiClient.interceptors.request.use(
//     (config) => {
//           config.headers.Authorization={"sssssssssssssssssssssssssssssssssssssssssss":"sssssssssssssssssssssssssssssssssssssssssss"};
//         console.log("인터셉트 요청 성공!");
//         console.log(config)
//         return config;
//     },
//     (error) => {
//         // 요청에 실패했을 때 수행되는 함수 (오류 요청을 보내기 전)
//         console.log("인터셉트 요청 오류!");
//         return Promise.reject(error);
//     }
// );

// apiClient.interceptors.response.use(
//     (response) => {
//         // 응답을 받았을 때 수행되는 함수 (응답을 내보내기 전)
//         console.log("인터셉트 응답 받음!");
//         return response;
//     },
//     (error) => {
//         // 응답이 실패했을 때 수행되는 함수 (오류응답을 내보내기 전)
//         console.log("인터셉트 응답 오류 발생!");
//         return Promise.reject(error);
//     }
// );