// 백엔드 API 설정
const API_URL = 'http://localhost:5000/api/todos';

console.log('✅ 백엔드 API 연결 준비 완료!');
console.log('📡 API URL:', API_URL);

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
async function init() {
    attachEventListeners();
    await loadTodos();
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

// 할일 목록 불러오기 (GET /api/todos)
async function loadTodos() {
    try {
        console.log('📥 할일 목록 불러오는 중...');
        
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        console.log('✅ API 응답:', result);
        
        if (result.success && Array.isArray(result.data)) {
            todos = result.data;
            console.log(`📋 ${result.count}개의 할일 로드됨`);
            renderTodos();
            updateStats();
        } else {
            console.error('❌ 데이터 형식 오류:', result);
            alert('데이터 형식이 올바르지 않습니다.');
        }
        
    } catch (error) {
        console.error('❌ 할일 불러오기 오류:', error);
        alert('할일을 불러오는 중 오류가 발생했습니다.\n백엔드 서버가 실행 중인지 확인하세요.\n(localhost:5000)');
    }
}

// 할일 추가 함수 (POST /api/todos)
async function addTodo() {
    const text = todoInput.value.trim();
    
    // 입력값 검증
    if (text === '') {
        alert('할일을 입력해주세요!');
        todoInput.focus();
        return;
    }
    
    try {
        console.log('➕ 할일 추가 시도:', text);
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: text,  // text → title로 변경
                priority: 'medium'  // 기본 우선순위
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ 할일 생성:', result.data);
            
            // 입력창 초기화
            todoInput.value = '';
            todoInput.focus();
            
            // 목록 다시 불러오기
            await loadTodos();
        } else {
            console.error('❌ 생성 실패:', result.message);
            alert('할일 추가에 실패했습니다: ' + result.message);
        }
        
    } catch (error) {
        console.error('❌ 할일 추가 오류:', error);
        alert('할일 추가 중 오류가 발생했습니다.\n' + error.message);
    }
}

// 할일 삭제 함수 (DELETE /api/todos/:id)
async function deleteTodo(id) {
    if (confirm('정말로 이 할일을 삭제하시겠습니까?')) {
        try {
            console.log('🗑️ 삭제 시도:', id);
            
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ 할일 삭제:', result.data);
                
                // 목록 다시 불러오기
                await loadTodos();
            } else {
                console.error('❌ 삭제 실패:', result.message);
                alert('할일 삭제에 실패했습니다: ' + result.message);
            }
            
        } catch (error) {
            console.error('❌ 할일 삭제 오류:', error);
            alert('할일 삭제 중 오류가 발생했습니다.');
        }
    }
}

// 할일 완료 토글 함수 (PUT /api/todos/:id)
async function toggleComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        try {
            console.log('🔄 완료 상태 변경:', id);
            
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    completed: !todo.completed
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ 완료 상태 변경 성공');
                
                // 목록 다시 불러오기
                await loadTodos();
            } else {
                console.error('❌ 완료 상태 변경 실패:', result.message);
            }
            
        } catch (error) {
            console.error('❌ 완료 상태 업데이트 오류:', error);
            alert('완료 상태 변경 중 오류가 발생했습니다.');
        }
    }
}

// 할일 수정 시작 함수
function startEdit(id) {
    editingId = id;
    renderTodos();
}

// 할일 수정 저장 함수 (PUT /api/todos/:id)
async function saveEdit(id) {
    const input = document.querySelector(`#edit-input-${id}`);
    const newText = input.value.trim();
    
    if (newText === '') {
        alert('할일 내용을 입력해주세요!');
        input.focus();
        return;
    }
    
    try {
        console.log('✏️ 할일 수정:', id);
        
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: newText  // text → title로 변경
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ 수정 성공');
            editingId = null;
            
            // 목록 다시 불러오기
            await loadTodos();
        } else {
            console.error('❌ 수정 실패:', result.message);
            alert('할일 수정에 실패했습니다: ' + result.message);
        }
        
    } catch (error) {
        console.error('❌ 할일 수정 오류:', error);
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
    
    console.log('렌더링할 할일:', filteredTodos);
    
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
                    value="${escapeHtml(todo.title || todo.text || '')}"
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
            // priority가 있으면 표시
            const priorityBadge = todo.priority ? 
                `<span class="priority ${todo.priority}">${todo.priority}</span>` : '';
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${escapeHtml(todo.title || todo.text || '')}</span>
                ${priorityBadge}
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
    
    console.log(`📊 통계: 전체 ${total}, 진행중 ${active}, 완료 ${completed}`);
}

// HTML 이스케이프 함수 (XSS 방지)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 앱 초기화
init();
