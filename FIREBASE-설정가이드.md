# 🔥 Firebase 설정 가이드

## ⚠️ 중요: Firestore 보안 규칙 설정

할일이 화면에 나타나지 않는 가장 흔한 원인은 **Firestore 보안 규칙**입니다!

## 🛠️ 해결 방법 (5분 소요)

### 1단계: Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 선택: `vibe-code-todo`

### 2단계: Firestore Database 메뉴 이동
1. 왼쪽 메뉴에서 **"Firestore Database"** 클릭
2. 상단 탭에서 **"규칙(Rules)"** 클릭

### 3단계: 보안 규칙 수정

현재 규칙이 아마 이렇게 되어있을 것입니다:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;  // ❌ 모든 접근 차단!
    }
  }
}
```

아래 규칙으로 **복사 붙여넣기** 하세요:

#### 옵션 1: 테스트용 (모든 접근 허용) ⚠️ 주의
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;  // ✅ 테스트용 - 모든 접근 허용
    }
  }
}
```

#### 옵션 2: 더 안전한 규칙 (추천)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // todos 컬렉션만 읽기/쓰기 허용
    match /todos/{todoId} {
      allow read, write: if true;
    }
  }
}
```

### 4단계: 규칙 게시
1. **"게시(Publish)"** 버튼 클릭
2. 완료!

### 5단계: 앱 테스트
1. 브라우저에서 `index.html` 새로고침 (F5)
2. **F12** 눌러서 개발자 도구 열기
3. **Console** 탭에서 로그 확인
4. 할일 추가 시도

---

## 🔍 디버깅 로그 확인 방법

### 브라우저 개발자 도구 (F12)
1. **F12** 키를 누르세요
2. **Console** 탭 클릭
3. 할일 추가 시 나타나는 메시지 확인:

**정상 작동 시:**
```
할일 추가 시도: 장보기
할일 추가 성공! ID: abc123xyz
Firebase 데이터 수신: 1 개
할일 데이터: {text: "장보기", completed: false, ...}
```

**오류 발생 시:**
```
할일 추가 오류: FirebaseError: Missing or insufficient permissions
오류 코드: permission-denied
```
→ 위의 보안 규칙 설정을 다시 확인하세요!

---

## 📊 Firestore 데이터 구조

```
todos (컬렉션)
  ├─ [자동생성ID] (문서)
  │   ├─ text: "장보기"
  │   ├─ completed: false
  │   └─ createdAt: Timestamp
  │
  ├─ [자동생성ID] (문서)
  │   ├─ text: "운동하기"
  │   ├─ completed: true
  │   └─ createdAt: Timestamp
  │
  └─ ...
```

---

## 🔧 코드 변경 사항

### ✅ 개선된 점

1. **serverTimestamp() 사용**
   - 서버의 정확한 시간 사용 (클라이언트 시간 오류 방지)

2. **orderBy 제거**
   - Firestore 인덱스 생성 불필요
   - 클라이언트에서 정렬 (더 안정적)

3. **디버깅 로그 추가**
   - 모든 단계에서 console.log 출력
   - 문제 발생 시 원인 파악 쉬움

4. **상세한 오류 메시지**
   - 어떤 문제인지 명확하게 표시

---

## 🚨 문제 해결 체크리스트

- [ ] Firebase Console에서 보안 규칙 설정했나요?
- [ ] 브라우저 개발자 도구(F12)에서 Console 확인했나요?
- [ ] 인터넷 연결이 정상인가요?
- [ ] 페이지를 새로고침(F5)했나요?
- [ ] 브라우저 캐시를 삭제했나요? (Ctrl + Shift + Delete)

---

## 💡 추가 팁

### Firestore Database 직접 확인
1. Firebase Console → Firestore Database
2. **"데이터(Data)"** 탭 클릭
3. `todos` 컬렉션이 보이고 문서가 추가되는지 확인

### 브라우저 캐시 삭제
1. Ctrl + Shift + Delete
2. "캐시된 이미지 및 파일" 선택
3. "데이터 삭제" 클릭

---

## 📞 여전히 안 될 때

1. **콘솔 로그 복사해서 보내주세요** (F12 → Console 탭)
2. **Firebase Console 스크린샷** (보안 규칙 부분)
3. **오류 메시지 전체 내용**

---

## 🎓 참고 자료

- [Firestore 보안 규칙 문서](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore 시작하기](https://firebase.google.com/docs/firestore/quickstart)

