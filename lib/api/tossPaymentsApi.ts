import axios from 'axios';

// 토스페이먼츠 API 호출을 위한 베이스 URL과 시크릿 키
const TOSS_PAYMENTS_API_BASE_URL = 'https://api.tosspayments.com/v1';
const TOSS_PAYMENTS_SECRET_KEY = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_SECRET_KEY || '';

// 토스페이먼츠 API를 위한 인스턴스 생성
const tossPaymentsApi = axios.create({
  baseURL: TOSS_PAYMENTS_API_BASE_URL,
  headers: {
    'Authorization': `Basic ${Buffer.from(TOSS_PAYMENTS_SECRET_KEY + ':').toString('base64')}`,
    'Content-Type': 'application/json',
  },
});

// 결제 취소 API
export const cancelPayment = async (paymentKey: string, cancelReason: string) => {
  try {
    const response = await tossPaymentsApi.post(`/payments/${paymentKey}/cancel`, {
      cancelReason,
    });
    return response.data;
  } catch (error) {
    console.error('토스페이먼츠 결제 취소 오류:', error);
    throw error;
  }
};

// 결제 정보 조회 API
export const getPaymentInfo = async (paymentKey: string) => {
  try {
    const response = await tossPaymentsApi.get(`/payments/${paymentKey}`);
    return response.data;
  } catch (error) {
    console.error('토스페이먼츠 결제 정보 조회 오류:', error);
    throw error;
  }
};

export default {
  cancelPayment,
  getPaymentInfo
}; 