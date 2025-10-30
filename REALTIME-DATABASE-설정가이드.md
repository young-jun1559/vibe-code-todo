# 🔥 Firebase Realtime Database 설정 가이드

## ✅ Realtime Database로 변경 완료!

코드가 모두 Realtime Database 방식으로 변경되었습니다.

---

## 🚨 중요: Realtime Database 생성 필요!

### 1단계: Firebase Console 접속

1. **https://console.firebase.google.com/** 접속
2. **`vibe-code-todo`** 프로젝트 선택

### 2단계: Realtime Database 메뉴 이동

1. 왼쪽 메뉴에서 **"Realtime Database"** 클릭
   - ⚠️ "Firestore Database"가 아닙니다!
   - **"Realtime Database"**를 찾으세요

### 3단계: 데이터베이스 만들기

다음 중 하나가 보일 것입니다:

#### 🅰️ "데이터베이스 만들기" 버튼이 보이는 경우:

1. **"데이터베이스 만들기(Create Database)"** 클릭

2. **위치 선택**:
   - 추천: **`us-central1`** (미국 중부)
   - ⚠️ Realtime Database는 서울 리전이 없습니다
   - 한번 선택하면 변경 불가!

3. **보안 규칙 선택**:
   - **"테스트 모드로 시작(Start in test mode)"** 선택 ✅
   
   테스트 모드 규칙:
   ```json
   {
     "rules": {
       ".read": true,
       ".write": true
     }
   }
   ```
   
   - 또는 "잠금 모드"를 선택하고 나중에 규칙 수정

4. **"사용 설정(Enable)"** 클릭

5. 잠시 대기 (10~30초)

#### 🅱️ 이미 "데이터" 탭이 보이는 경우:

이미 Realtime Database가 생성되어 있습니다. 4단계로 이동하세요.

---

## 4단계: 보안 규칙 확인/수정

### A. "규칙(Rules)" 탭 클릭

### B. 현재 규칙 확인

테스트 모드로 시작했다면 이미 올바르게 설정되어 있습니다:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### C. 규칙 수정 (필요한 경우)

잠금 모드로 시작했거나 규칙이 다르다면, 위 코드로 교체하세요.

### D. 게시

**"게시(Publish)"** 버튼 클릭 ← **필수!**

---

## 🧪 5단계: 테스트

### A. 브라우저 완전 재시작
1. 모든 탭 닫기
2. 브라우저 종료
3. 다시 열기

### B. 테스트 페이지 열기
```
http://localhost:8000/test.html
```

### C. 개발자 도구 확인 (F12)
**Console** 탭에서 다음 메시지 확인:

#### ✅ 성공 시:
```
1. 🚀 Firebase Realtime Database 초기화 시작...
2. ✅ Firebase 초기화 성공!
3. 📡 실시간 리스너 설정 중...
4. 📦 데이터 수신!
   📭 데이터가 없습니다
```

화면에도 표시:
```
✅ Firebase Realtime Database 연결 성공!
할일 목록: 📋 할일이 없습니다
```

#### ❌ 실패 시:
```
PERMISSION_DENIED: Permission denied
```
→ 보안 규칙을 다시 확인하고 "게시" 버튼을 클릭하세요!

### D. 할일 추가 테스트
1. 입력창에 "테스트" 입력
2. "추가" 버튼 클릭
3. 콘솔 확인:
```
5. ➕ 할일 추가 시도: 테스트
6. ✅ 할일 추가 성공! ID: -O1a2b3c4d5e6
4. 📦 데이터 수신!
   ✅ 1개의 할일 로드 완료
```

### E. Firebase Console에서 확인
1. Realtime Database → **"데이터(Data)"** 탭
2. **`todos`** 노드 확인
3. 추가한 할일이 보여야 함:
```
todos
  └─ -O1a2b3c4d5e6
      ├─ text: "테스트"
      ├─ completed: false
      └─ createdAt: 1730266943000
```

---

## 🎯 6단계: 실제 앱 테스트

테스트가 성공했다면 실제 앱도 테스트:

```
http://localhost:8000/index.html
```

또는 브라우저에서 직접 `index.html` 파일을 엽니다.

---

## 📊 Realtime Database vs Firestore 비교

### 변경된 점:

| 항목 | Firestore (이전) | Realtime Database (현재) |
|------|------------------|--------------------------|
| SDK | `firebase-firestore.js` | `firebase-database.js` |
| 초기화 | `getFirestore()` | `getDatabase()` |
| 참조 | `collection(db, 'todos')` | `ref(db, 'todos')` |
| 추가 | `addDoc()` | `push() + set()` |
| 수정 | `updateDoc()` | `update()` |
| 삭제 | `deleteDoc()` | `remove()` |
| 실시간 | `onSnapshot()` | `onValue()` |
| 데이터 구조 | 문서/컬렉션 | JSON 트리 |

### Realtime Database 장점:
✅ 더 간단한 구조
✅ 설정이 쉬움
✅ 실시간 동기화 빠름
✅ JSON 형태로 직관적

---

## 🔒 보안 규칙 참고

### 테스트용 (현재):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ **경고**: 누구나 읽기/쓰기 가능! 실제 서비스에서는 사용하지 마세요.

### 더 안전한 규칙 (향후):
```json
{
  "rules": {
    "todos": {
      ".read": true,
      ".write": true,
      "$todoId": {
        ".validate": "newData.hasChildren(['text', 'completed', 'createdAt'])"
      }
    }
  }
}
```

---

## 🚨 문제 해결

### "PERMISSION_DENIED" 오류
→ 보안 규칙을 확인하고 "게시(Publish)" 클릭

### "Database not found" 오류
→ Realtime Database를 아직 생성하지 않음. 2단계로 돌아가기

### 데이터가 안 보임
→ F12 콘솔에서 오류 메시지 확인
→ 보안 규칙 확인
→ databaseURL이 올바른지 확인

### 서버가 응답하지 않음
→ `python -m http.server 8000` 실행 중인지 확인
→ `http://localhost:8000` 접속 확인

---

## ✅ 최종 체크리스트

- [ ] Firebase Console → Realtime Database 생성
- [ ] 보안 규칙: 테스트 모드 (`.read: true, .write: true`)
- [ ] "게시(Publish)" 버튼 클릭
- [ ] 브라우저 완전 재시작
- [ ] `test.html`에서 테스트 성공
- [ ] `index.html`에서 할일 추가/수정/삭제 테스트
- [ ] Firebase Console "데이터" 탭에서 데이터 확인

---

## 🎉 완료!

모든 단계를 완료하면 할일 앱이 Realtime Database와 함께 완벽하게 작동합니다!

문제가 있으면 F12 콘솔의 오류 메시지를 확인하세요.

