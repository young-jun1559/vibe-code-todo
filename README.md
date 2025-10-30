# 🔥 Firebase 할일 관리 앱

Firebase Realtime Database를 활용한 실시간 동기화 할일 관리 애플리케이션입니다.

## 🌐 Live Demo

**[🚀 앱 실행하기](https://minsu-gnd-todo-app.vercel.app)**

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://minsu-gnd-todo-app.vercel.app)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

## ✨ 주요 기능

- ➕ **할일 추가**: 새로운 할일을 Firebase에 저장
- ✏️ **할일 수정**: 기존 할일 내용 수정
- 🗑️ **할일 삭제**: 불필요한 할일 제거
- ✅ **완료 체크**: 할일 완료 상태 관리
- 🔄 **실시간 동기화**: 여러 기기에서 즉시 동기화
- 🔍 **필터링**: 전체 / 진행중 / 완료 상태별 필터
- 📊 **통계**: 할일 개수 실시간 표시
- 📱 **반응형**: 모바일/데스크탑 모두 지원

## 🛠️ 기술 스택

- **Frontend**: HTML, CSS, JavaScript (ES6+)
- **Backend**: Firebase Realtime Database
- **호스팅**: 정적 웹 호스팅 (GitHub Pages, Netlify 등)

## 📦 파일 구조

```
todo-firebase/
├── index.html                          # 메인 HTML 파일
├── style.css                           # 스타일시트
├── app.js                              # JavaScript (Firebase 연동)
├── test.html                           # 테스트 페이지
├── .gitignore                          # Git 제외 파일
├── REALTIME-DATABASE-설정가이드.md    # Firebase 설정 가이드
└── README.md                           # 프로젝트 설명
```

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone https://github.com/young-jun1559/vibe-code-todo.git
cd vibe-code-todo
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. **Realtime Database** 생성
4. 보안 규칙 설정 (테스트 모드):

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

5. `app.js`의 Firebase 설정 정보 업데이트:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.firebasestorage.app",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};
```

### 3. 로컬 서버 실행

#### Python 사용:
```bash
python -m http.server 8000
```

#### Node.js 사용:
```bash
npx http-server -p 8000
```

### 4. 브라우저에서 열기

```
http://localhost:8000
```

## 📱 사용 방법

### 할일 추가
1. 입력창에 할일 입력
2. "추가" 버튼 클릭 또는 Enter 키

### 할일 수정
1. 할일 오른쪽의 "수정" 버튼 클릭
2. 내용 수정 후 "저장" 또는 Enter 키

### 할일 삭제
1. 할일 오른쪽의 "삭제" 버튼 클릭
2. 확인 메시지에서 "확인" 클릭

### 완료 체크
- 할일 왼쪽의 체크박스 클릭

### 필터링
- **전체**: 모든 할일 표시
- **진행중**: 미완료 할일만 표시
- **완료**: 완료된 할일만 표시

## 🎨 화면 구성

```
┌─────────────────────────────────────┐
│        📝 할일 관리                  │
│   오늘 할 일을 관리해보세요          │
├─────────────────────────────────────┤
│ [새로운 할일 입력...     ] [추가]   │
├─────────────────────────────────────┤
│ [전체] [진행중] [완료]              │
├─────────────────────────────────────┤
│ ☐ 장보기          [수정] [삭제]     │
│ ☑ 운동하기        [수정] [삭제]     │
│ ☐ 책 읽기         [수정] [삭제]     │
├─────────────────────────────────────┤
│ 전체: 3  진행중: 2  완료: 1         │
└─────────────────────────────────────┘
```

## 🔒 보안 주의사항

⚠️ **중요**: 현재 보안 규칙은 테스트용입니다!

실제 서비스 배포 시 다음을 고려하세요:

1. **Firebase Authentication** 추가
2. **보안 규칙** 강화:

```json
{
  "rules": {
    "todos": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

3. **API 키** 환경변수로 관리
4. **도메인 제한** 설정

## 🌐 배포

### GitHub Pages
```bash
# gh-pages 브랜치로 배포
git checkout -b gh-pages
git push origin gh-pages
```

### Netlify
1. Netlify에 리포지토리 연결
2. 자동 배포 설정

### Firebase Hosting
```bash
firebase init hosting
firebase deploy
```

## 📝 데이터 구조

Firebase Realtime Database에 저장되는 데이터 구조:

```json
{
  "todos": {
    "-O1a2b3c4d5e6": {
      "text": "장보기",
      "completed": false,
      "createdAt": 1730266943000
    },
    "-O1a2b3c4d5e7": {
      "text": "운동하기",
      "completed": true,
      "createdAt": 1730266950000
    }
  }
}
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 👤 개발자

**young-jun1559**

- GitHub: [@young-jun1559](https://github.com/young-jun1559)

## 🙏 감사의 말

- [Firebase](https://firebase.google.com/) - 백엔드 서비스
- [Google Fonts](https://fonts.google.com/) - 폰트

## 📞 문의

프로젝트에 대한 문의사항이나 버그 리포트는 [Issues](https://github.com/young-jun1559/vibe-code-todo/issues) 페이지를 이용해주세요.

---

⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!

