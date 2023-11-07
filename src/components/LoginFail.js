// LoginSuccess.js 파일 내에 다음과 같이 작성합니다.

import React, { useEffect } from "react";
import { useLocation, useSearchParams } from 'react-router-dom';

export function LoginFail() {
  const [searchParams, setSearchParams] = useSearchParams ();
  const message = searchParams.get("message");
  // const location = useLocation();
  
  // // 쿼리 스트링을 파싱하는 함수
  // function useQuery() {
  //   return new URLSearchParams(location.search);
  // }

  // const query = useQuery();
  console.log("LoginFail");

  return <div>
      <div>LoginFail</div>
      <div>{message}</div>
    </div>;
}

// export default LoginFail;
