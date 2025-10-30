// Firebase 모듈 import (Realtime Database)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    push, 
    set,
    update,
    remove,
    onValue,
    off
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyAtiTPY29YzrYQfd2yQwF1RuHoA3Nr-mzc",
    authDomain: "vibe-code-todo.firebaseapp.com",
    projectId: "vibe-code-todo",
    storageBucket: "vibe-code-todo.firebasestorage.app",
    messagingSenderId: "559794941817",
    appId: "1:559794941817:web:d249895eb147c1aa9089a8",
    databaseURL: "https://vibe-code-todo-default-rtdb.firebaseio.com/"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const todosRef = ref(db, 'todos');

console.log("✅ Firebase Realtime Database 초기화 완료!");

// DOM 요소 선택
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// 전역 변수
let todos = [];
let currentFilter = 'all';
let editingId = null;

// 초기화 함수
function init() {
    attachEventListeners();
    loadTodosRealtime();
}

// 이벤트 리스너 등록
function attachEventListeners() {
    // 추가 버튼 클릭
    addBtn.addEventListener('click', addTodo);
    
    // Enter 키로 할일 추가
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // 필터 버튼 클릭
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTodos();
        });
    });
}

// 실시간으로 Realtime Database에서 할일 불러오기
function loadTodosRealtime() {
    console.log("📡 실시간 리스너 설정 중...");
    
    onValue(todosRef, (snapshot) => {
        console.log("📦 데이터 수신!");
        todos = [];
        
        if (snapshot.exists()) {
            const data = snapshot.val();
            console.log("받은 데이터:", data);
            
            // 객체를 배열로 변환
            Object.keys(data).forEach(key => {
                todos.push({
                    id: key,
                    ...data[key]
                });
            });
            
            // 최신순 정렬
            todos.sort((a, b) => {
                const timeA = a.createdAt || 0;
                const timeB = b.createdAt || 0;
                return timeB - timeA;
            });
            
            console.log(`✅ ${todos.length}개의 할일 로드 완료`);
        } else {
            console.log("📭 데이터가 없습니다");
        }
        
        renderTodos();
        updateStats();
    }, (error) => {
        console.error("❌ 데이터 읽기 오류:", error);
        console.error("오류 코드:", error.code);
        console.error("오류 메시지:", error.message);
        alert('데이터를 불러오는 중 오류가 발생했습니다: ' + error.message);
    });
}

// 할일 추가 함수 (Realtime Database)
async function addTodo() {
    const text = todoInput.value.trim();
    
    // 입력값 검증
    if (text === '') {
        alert('할일을 입력해주세요!');
        todoInput.focus();
        return;
    }
    
    try {
        console.log("➕ 할일 추가 시도:", text);
        
        // Realtime Database에 추가
        const newTodoRef = push(todosRef);
        await set(newTodoRef, {
            text: text,
            completed: false,
            createdAt: Date.now()
        });
        
        console.log("✅ 할일 추가 성공! ID:", newTodoRef.key);
        
        // 입력창 초기화
        todoInput.value = '';
        todoInput.focus();
        
    } catch (error) {
        console.error("❌ 할일 추가 오류:", error);
        console.error("오류 코드:", error.code);
        console.error("오류 메시지:", error.message);
        alert('할일 추가 중 오류가 발생했습니다:\n' + error.message + '\n\nFirebase 콘솔에서 보안 규칙을 확인해주세요.');
    }
}

// 할일 삭제 함수 (Realtime Database)
async function deleteTodo(id) {
    if (confirm('정말로 이 할일을 삭제하시겠습니까?')) {
        try {
            console.log("🗑️ 삭제 시도:", id);
            const todoRef = ref(db, `todos/${id}`);
            await remove(todoRef);
            console.log("✅ 삭제 성공");
        } catch (error) {
            console.error("❌ 할일 삭제 오류:", error);
            alert('할일 삭제 중 오류가 발생했습니다.');
        }
    }
}

// 할일 완료 토글 함수 (Realtime Database)
async function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        try {
            console.log("🔄 완료 상태 변경:", id);
            const todoRef = ref(db, `todos/${id}`);
            await update(todoRef, {
                completed: !todo.completed
            });
            console.log("✅ 완료 상태 변경 성공");
        } catch (error) {
            console.error("❌ 완료 상태 업데이트 오류:", error);
            alert('완료 상태 변경 중 오류가 발생했습니다.');
        }
    }
}

// 할일 수정 시작 함수
function startEdit(id) {
    editingId = id;
    renderTodos();
}

// 할일 수정 저장 함수 (Realtime Database)
async function saveEdit(id) {
    const input = document.querySelector(`#edit-input-${id}`);
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('할일 내용을 입력해주세요!');
        input.focus();
        return;
    }
    
    try {
        console.log("✏️ 할일 수정:", id);
        const todoRef = ref(db, `todos/${id}`);
        await update(todoRef, {
            text: newText
        });
        console.log("✅ 수정 성공");
        editingId = null;
    } catch (error) {
        console.error("❌ 할일 수정 오류:", error);
        alert('할일 수정 중 오류가 발생했습니다.');
    }
}

// 할일 수정 취소 함수
function cancelEdit() {
    editingId = null;
    renderTodos();
}

// 할일 목록 렌더링 함수
function renderTodos() {
    // 필터링된 할일 가져오기
    let filteredTodos = todos;
    
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // 목록 비우기
    todoList.innerHTML = '';
    
    // 빈 상태 표시/숨김
    if (filteredTodos.length === 0) {
        emptyState.classList.remove('hidden');
        todoList.style.display = 'none';
    } else {
        emptyState.classList.add('hidden');
        todoList.style.display = 'block';
    }
    
    // 각 할일 렌더링
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        // 수정 모드인 경우
        if (editingId === todo.id) {
            li.innerHTML = `
                <input 
                    type="text" 
                    class="todo-edit-input" 
                    id="edit-input-${todo.id}"
                    value="${escapeHtml(todo.text)}"
                    autofocus
                >
                <div class="todo-actions">
                    <button class="todo-btn btn-save" data-id="${todo.id}">저장</button>
                    <button class="todo-btn btn-cancel">취소</button>
                </div>
            `;
            
            // 이벤트 리스너 추가
            setTimeout(() => {
                const input = li.querySelector(`#edit-input-${todo.id}`);
                const saveBtn = li.querySelector('.btn-save');
                const cancelBtn = li.querySelector('.btn-cancel');
                
                if (input) {
                    input.focus();
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            saveEdit(todo.id);
                        } else if (e.key === 'Escape') {
                            cancelEdit();
                        }
                    });
                }
                
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => saveEdit(todo.id));
                }
                
                if (cancelBtn) {
                    cancelBtn.addEventListener('click', cancelEdit);
                }
            }, 0);
        } 
        // 일반 표시 모드
        else {
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="todo-btn btn-edit" data-id="${todo.id}">수정</button>
                    <button class="todo-btn btn-delete" data-id="${todo.id}">삭제</button>
                </div>
            `;
            
            // 이벤트 리스너 추가
            const checkbox = li.querySelector('.todo-checkbox');
            const editBtn = li.querySelector('.btn-edit');
            const deleteBtn = li.querySelector('.btn-delete');
            
            if (checkbox) {
                checkbox.addEventListener('change', () => toggleComplete(todo.id));
            }
            
            if (editBtn) {
                editBtn.addEventListener('click', () => startEdit(todo.id));
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteTodo(todo.id));
            }
        }
        
        todoList.appendChild(li);
    });
}

// 통계 업데이트 함수
function updateStats() {
    const total = todos.length;
    const active = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;
    
    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 전역 스코프에 함수 노출 (모듈 방식이므로)
window.addTodo = addTodo;
window.deleteTodo = deleteTodo;
window.toggleComplete = toggleComplete;
window.startEdit = startEdit;
window.saveEdit = saveEdit;
window.cancelEdit = cancelEdit;

// 앱 초기화
init();
