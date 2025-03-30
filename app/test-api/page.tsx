"use client";

import { useState } from 'react';
import { userService } from '../../lib/services/userService';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const testLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.login({
        username: "testuser",
        password: "password123"
      });
      setResult(response);
      console.log('로그인 성공:', response);
    } catch (err) {
      console.error('로그인 실패:', err);
      setError(err instanceof Error ? err.message : '에러 발생');
    } finally {
      setLoading(false);
    }
  };
  
  const testGetCurrentUser = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getCurrentUser();
      setResult(response);
      console.log('사용자 정보:', response);
    } catch (err) {
      console.error('사용자 정보 조회 실패:', err);
      setError(err instanceof Error ? err.message : '에러 발생');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">API 테스트</h1>
      
      <div className="flex gap-4 mb-6">
        <button 
          onClick={testLogin}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          로그인 테스트
        </button>
        
        <button 
          onClick={testGetCurrentUser}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-green-300"
        >
          사용자 정보 조회
        </button>
      </div>
      
      {loading && <div className="mb-4">로딩 중...</div>}
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          <h3 className="font-bold">오류 발생</h3>
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="font-bold mb-2">응답 결과</h3>
          <pre className="whitespace-pre-wrap bg-white p-3 rounded border">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-yellow-50 text-sm rounded-md">
        <h3 className="font-bold mb-2">디버깅 팁</h3>
        <p>개발자 도구(F12)의 Network 탭과 Console 탭을 열고 버튼을 클릭하여 요청/응답을 확인하세요.</p>
      </div>
    </div>
  );
} 