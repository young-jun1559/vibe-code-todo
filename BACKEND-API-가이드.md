# 🔌 백엔드 API 연동 가이드

## 📋 개요

Firebase Realtime Database 대신 **REST API 백엔드 서버**를 사용하도록 변경되었습니다.

---

## 🌐 API 엔드포인트

### Base URL
```
http://localhost:5000/api/todos
```

### API 목록

| 메서드 | 엔드포인트 | 설명 | 요청 Body | 응답 |
|--------|-----------|------|----------|------|
| GET | `/api/todos` | 모든 할일 조회 | - | `Todo[]` |
| GET | `/api/todos/stats` | 통계 조회 | - | `Stats` |
| GET | `/api/todos/:id` | 특정 할일 조회 | - | `Todo` |
| POST | `/api/todos` | 새 할일 생성 | `{text, completed}` | `Todo` |
| PUT | `/api/todos/:id` | 할일 수정 | `{text?, completed?}` | `Todo` |
| DELETE | `/api/todos/:id` | 할일 삭제 | - | `{message}` |

---

## 📦 데이터 구조

### Todo 객체
```typescript
{
  id: number | string,
  text: string,
  completed: boolean,
  createdAt?: Date,
  updatedAt?: Date
}
```

### Stats 객체
```typescript
{
  total: number,
  active: number,
  completed: number
}
```

---

## 🔧 API 사용 예시

### 1️⃣ 모든 할일 조회
```javascript
const response = await fetch('http://localhost:5000/api/todos');
const todos = await response.json();
// [{id: 1, text: "장보기", completed: false}, ...]
```

### 2️⃣ 할일 추가
```javascript
const response = await fetch('http://localhost:5000/api/todos', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        text: '장보기',
        completed: false
    })
});
const newTodo = await response.json();
```

### 3️⃣ 할일 수정
```javascript
const response = await fetch('http://localhost:5000/api/todos/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        text: '장보기 완료',
        completed: true
    })
});
const updatedTodo = await response.json();
```

### 4️⃣ 할일 삭제
```javascript
const response = await fetch('http://localhost:5000/api/todos/1', {
    method: 'DELETE'
});
const result = await response.json();
```

### 5️⃣ 통계 조회
```javascript
const response = await fetch('http://localhost:5000/api/todos/stats');
const stats = await response.json();
// {total: 10, active: 3, completed: 7}
```

---

## 🚀 백엔드 서버 실행 방법

### 1. 백엔드 서버 준비

백엔드 프로젝트가 있다고 가정합니다:
```bash
cd your-backend-project
npm install
npm start
```

### 2. 포트 확인

백엔드 서버가 **5000번 포트**에서 실행되어야 합니다:
```
Server running on http://localhost:5000
```

### 3. CORS 설정 필요

백엔드에서 CORS를 허용해야 합니다:

**Express 예시:**
```javascript
const cors = require('cors');
app.use(cors());
```

또는 특정 origin만:
```javascript
app.use(cors({
    origin: 'http://localhost:8000'
}));
```

---

## 🧪 테스트 방법

### 방법 1: 테스트 페이지 사용

```bash
# 프론트엔드 서버 실행
python -m http.server 8000

# 브라우저에서 열기
http://localhost:8000/test-backend.html
```

테스트 페이지에서:
1. ✅ 연결 테스트
2. 📥 GET 테스트
3. ➕ POST 테스트
4. ✏️ PUT 테스트
5. 🗑️ DELETE 테스트

### 방법 2: curl 명령어

```bash
# 모든 할일 조회
curl http://localhost:5000/api/todos

# 할일 추가
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"text":"테스트","completed":false}'

# 할일 수정
curl -X PUT http://localhost:5000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"text":"수정됨","completed":true}'

# 할일 삭제
curl -X DELETE http://localhost:5000/api/todos/1
```

### 방법 3: Postman/Insomnia

1. Postman 또는 Insomnia 설치
2. 위의 API 엔드포인트 테스트

---

## 🔍 주요 변경 사항

### Firebase → REST API

| 항목 | Firebase (이전) | REST API (현재) |
|------|----------------|----------------|
| 연결 | Firebase SDK | fetch API |
| 실시간 | onSnapshot | 폴링 or WebSocket |
| 추가 | addDoc() | POST /api/todos |
| 수정 | updateDoc() | PUT /api/todos/:id |
| 삭제 | deleteDoc() | DELETE /api/todos/:id |
| 조회 | onValue() | GET /api/todos |

### 코드 변경 포인트

**app.js의 주요 변경:**
```javascript
// ❌ 이전 (Firebase)
import { getDatabase, ref, push } from "firebase-database.js";
const db = getDatabase(app);
await push(ref(db, 'todos'), data);

// ✅ 현재 (REST API)
const API_BASE_URL = 'http://localhost:5000/api/todos';
const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
});
```

---

## ⚠️ 주의사항

### 1. CORS 오류
```
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:8000' 
has been blocked by CORS policy
```

**해결 방법:** 백엔드에 CORS 미들웨어 추가

### 2. 백엔드 서버 미실행
```
Failed to fetch
```

**해결 방법:** 
- 백엔드 서버 실행 확인 (`http://localhost:5000`)
- 포트 번호 확인

### 3. 네트워크 오류
```
TypeError: Failed to fetch
```

**해결 방법:**
- 네트워크 연결 확인
- 방화벽 설정 확인
- 브라우저 개발자 도구(F12) → Network 탭 확인

---

## 🔄 실시간 동기화 옵션

현재는 **수동 새로고침** 방식입니다. 실시간 동기화를 원하면:

### 옵션 1: 폴링 (Polling)
```javascript
// 5초마다 자동 새로고침
setInterval(loadTodos, 5000);
```

### 옵션 2: WebSocket
백엔드에 WebSocket 추가:
```javascript
// Socket.io 예시
const socket = io('http://localhost:5000');
socket.on('todoUpdate', () => {
    loadTodos();
});
```

### 옵션 3: Server-Sent Events (SSE)
```javascript
const eventSource = new EventSource('http://localhost:5000/api/todos/stream');
eventSource.onmessage = (event) => {
    loadTodos();
};
```

---

## 📊 성능 비교

| 항목 | Firebase | REST API |
|------|----------|----------|
| 실시간 동기화 | ⭐⭐⭐ | ⭐ (폴링 필요) |
| 커스터마이징 | ⭐ | ⭐⭐⭐ |
| 비용 | 유료 (Free tier 제한) | 무료 (자체 서버) |
| 설정 복잡도 | 간단 | 중간 |
| 백엔드 제어 | 제한적 | 완전 제어 |

---

## 🎯 배포 시 주의사항

### 프로덕션 배포 시:

1. **API URL 변경**
```javascript
// 개발
const API_BASE_URL = 'http://localhost:5000/api/todos';

// 프로덕션
const API_BASE_URL = 'https://your-backend.com/api/todos';
```

2. **환경 변수 사용**
```javascript
const API_BASE_URL = process.env.API_URL || 'http://localhost:5000/api/todos';
```

3. **HTTPS 사용**
프로덕션에서는 반드시 HTTPS 사용

---

## 📞 문제 해결

### 연결이 안 될 때:
1. ✅ 백엔드 서버 실행 확인
2. ✅ 포트 번호 확인 (5000)
3. ✅ CORS 설정 확인
4. ✅ 브라우저 콘솔(F12) 확인
5. ✅ Network 탭에서 요청 확인

### 데이터가 안 보일 때:
1. ✅ API 응답 확인 (200 OK)
2. ✅ 응답 데이터 형식 확인
3. ✅ 브라우저 콘솔 로그 확인

---

## 🎉 완료!

백엔드 API 연동이 완료되었습니다!

이제 완전한 풀스택 애플리케이션입니다:
- ✅ 프론트엔드: HTML/CSS/JavaScript
- ✅ 백엔드: REST API (Node.js/Express 등)
- ✅ 데이터베이스: MySQL/PostgreSQL/MongoDB 등

