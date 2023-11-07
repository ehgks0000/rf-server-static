// LoginSuccess.js 파일 내에 다음과 같이 작성합니다.

import React, { useEffect } from "react";

export function LoginSuccess() {
  console.log("LoginSuccess");
  useEffect(() => {
    console.log("window.opener :", window.opener);
    console.log("window.location.origin :", window.location.origin);
    // 로그인 성공 시 메인 윈도우로 메시지를 보내고 현재 탭을 닫습니다.
    // window.opener.postMessage("loginSuccess", window.location.origin);
    if (window.opener) {
      // 팝업으로 열렸을 경우
      console.log("팝업으로 열림");
      window.opener.postMessage("loginSuccess", window.location.origin);
    } else {
      // 팝업이 아닌 일반 창으로 열렸을 경우, 리디렉션하거나 메인 앱으로의 상태를 전달합니다.
      // 여기서 추가적인 로직을 구현할 수 있습니다.
      console.log("로그인 성공 처리");
      setTimeout(() => {
        window.close();
      }, 0);
    }
  }, []);

  return <div>로그인 처리 중입니다. 잠시만 기다려 주세요...</div>;
}

