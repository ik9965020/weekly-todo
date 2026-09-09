import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Pencil,
  Plus,
  Repeat,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';

type Category = { id: string; name: string; color: string };
type TodoScope = 'weekly' | 'monthly' | 'long-term';
type Todo = {
  id: string;
  title: string;
  categoryId: string;
  scope?: TodoScope;
  weekKey?: string;
  monthKey?: string;
  deadline?: string;
  completed: boolean;
  recurring: boolean;
  recurrenceId?: string;
};
type Store = { categories: Category[]; todos: Todo[] };
type TodoDraft = {
  title: string;
  categoryId: string;
  scope: TodoScope;
  recurring: boolean;
  weekKey?: string;
  monthKey?: string;
  deadline?: string;
};
type CollapseState = { longTerm: boolean; monthly: boolean; weekly: boolean };

const STORAGE_KEY = 'shizuku-weekly-todo-v1';
const UI_STORAGE_KEY = 'weekly-todo-ui-v2';
const CATEGORY_COLORS = ['#7D8F87', '#B79A8C', '#A8A07C', '#8B98A7', '#9B8E9B', '#8E9E88', '#A18D7E'];

function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function dayStart(date: Date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function mondayOf(date: Date) {
  const value = dayStart(date);
  const day = value.getDay();
  value.setDate(value.getDate() + (day === 0 ? -6 : 1 - day));
  return value;
}

function weekKey(date: Date) {
  const monday = mondayOf(date);
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatRange(key: string) {
  const start = new Date(`${key}T00:00:00`);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`;
}

function formatMonth(key: string) {
  const [year, month] = key.split('-').map(Number);
  return `${year}年${month}月`;
}

function weekOffset(key: string) {
  const current = weekKey(new Date());
  return Math.round((new Date(`${key}T00:00:00`).getTime() - new Date(`${current}T00:00:00`).getTime()) / 604800000);
}

function monthOffset(key: string) {
  const [year, month] = key.split('-').map(Number);
  const now = new Date();
  return (year - now.getFullYear()) * 12 + month - (now.getMonth() + 1);
}

function formatDeadline(value?: string) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return `${year}/${month}/${day}`;
}

function seedStore(): Store {
  const key = weekKey(new Date());
  return {
    categories: [
      { id: 'cat-work', name: '仕事', color: CATEGORY_COLORS[0] },
      { id: 'cat-life', name: '暮らし', color: CATEGORY_COLORS[1] },
      { id: 'cat-care', name: '自分のこと', color: CATEGORY_COLORS[2] },
    ],
    todos: [
      { id: 'todo-plan', title: '今週の予定を見渡す', categoryId: 'cat-work', scope: 'weekly', weekKey: key, completed: true, recurring: true, recurrenceId: 'todo-plan' },
      { id: 'todo-report', title: '週次レポートの下書き', categoryId: 'cat-work', scope: 'weekly', weekKey: key, completed: false, recurring: false },
      { id: 'todo-groceries', title: '食材を買い足す', categoryId: 'cat-life', scope: 'weekly', weekKey: key, completed: false, recurring: false },
      { id: 'todo-walk', title: '水曜日に少し長く歩く', categoryId: 'cat-care', scope: 'weekly', weekKey: key, completed: false, recurring: true, recurrenceId: 'todo-walk' },
    ],
  };
}

function readStore(): Store {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedStore();
    const parsed = JSON.parse(saved) as Store;
    if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.todos)) return seedStore();
    return {
      categories: parsed.categories,
      todos: parsed.todos.map((todo) => ({ ...todo, scope: todo.scope ?? 'weekly' })),
    };
  } catch {
    return seedStore();
  }
}

function readCollapseState(): CollapseState {
  try {
    const saved = localStorage.getItem(UI_STORAGE_KEY);
    if (!saved) return { longTerm: false, monthly: false, weekly: true };
    return { longTerm: false, monthly: false, weekly: true, ...JSON.parse(saved) };
  } catch {
    return { longTerm: false, monthly: false, weekly: true };
  }
}

function AppHome() {
  const [store, setStore] = useState<Store>(() => readStore());
  const [selectedWeek, setSelectedWeek] = useState(() => weekKey(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(() => monthKey(new Date()));
  const [collapse, setCollapse] = useState<CollapseState>(() => readCollapseState());
  const [todoModal, setTodoModal] = useState<{ mode: 'add' | 'edit'; todo?: Todo } | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch { /* ignore */ }
  }, [store]);

  useEffect(() => {
    try { localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(collapse)); } catch { /* ignore */ }
  }, [collapse]);

  useEffect(() => {
    document.title = 'ToDo';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute('content', '長期・月次・週次で整理できるシンプルなToDoリスト。');
  }, []);

  useEffect(() => {
    const recurring = store.todos.filter((todo) => (todo.scope ?? 'weekly') === 'weekly' && todo.recurring && todo.weekKey !== selectedWeek);
    const missing = recurring.filter((todo) => {
      const root = todo.recurrenceId ?? todo.id;
      return !store.todos.some((item) => (item.scope ?? 'weekly') === 'weekly' && item.weekKey === selectedWeek && (item.recurrenceId ?? item.id) === root);
    });
    if (missing.length) {
      setStore((current) => ({
        ...current,
        todos: [...current.todos, ...missing.map((todo) => ({
          ...todo,
          id: uid('todo'),
          weekKey: selectedWeek,
          completed: false,
          recurrenceId: todo.recurrenceId ?? todo.id,
        }))],
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeek]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 1900);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const currentTodos = useMemo(() => store.todos.filter((todo) => (todo.scope ?? 'weekly') === 'weekly' && todo.weekKey === selectedWeek), [store.todos, selectedWeek]);
  const monthlyTodos = useMemo(() => store.todos.filter((todo) => todo.scope === 'monthly' && todo.monthKey === selectedMonth), [store.todos, selectedMonth]);
  const longTermTodos = useMemo(() => store.todos.filter((todo) => todo.scope === 'long-term'), [store.todos]);
  const offset = weekOffset(selectedWeek);
  const selectedMonthOffset = monthOffset(selectedMonth);

  function updateStore(updater: (current: Store) => Store) {
    setStore((current) => updater(current));
  }

  function toggleTodo(todoId: string) {
    updateStore((current) => ({ ...current, todos: current.todos.map((todo) => todo.id === todoId ? { ...todo, completed: !todo.completed } : todo) }));
  }

  function deleteTodo(todoId: string) {
    if (!window.confirm('このToDoを削除しますか？')) return;
    updateStore((current) => ({ ...current, todos: current.todos.filter((todo) => todo.id !== todoId) }));
    setToast('削除しました');
  }

  function saveTodo(draft: TodoDraft, existing?: Todo) {
    updateStore((current) => {
      if (existing) {
        return { ...current, todos: current.todos.map((todo) => todo.id === existing.id ? { ...todo, ...draft } : todo) };
      }
      return {
        ...current,
        todos: [...current.todos, {
          ...draft,
          id: uid('todo'),
          completed: false,
          recurrenceId: draft.recurring ? uid('repeat') : undefined,
        }],
      };
    });
    setTodoModal(null);
    setToast(existing ? '更新しました' : '追加しました');
  }

  function addCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    updateStore((current) => ({
      ...current,
      categories: [...current.categories, { id: uid('cat'), name: trimmed, color: CATEGORY_COLORS[current.categories.length % CATEGORY_COLORS.length] }],
    }));
  }

  function renameCategory(id: string, name: string) {
    updateStore((current) => ({ ...current, categories: current.categories.map((category) => category.id === id ? { ...category, name } : category) }));
  }

  function deleteCategory(id: string) {
    const category = store.categories.find((item) => item.id === id);
    if (!category || !window.confirm(`「${category.name}」と、その中のすべてのToDoを削除しますか？`)) return;
    updateStore((current) => ({
      ...current,
      categories: current.categories.filter((item) => item.id !== id),
      todos: current.todos.filter((todo) => todo.categoryId !== id),
    }));
  }

  function moveCategory(id: string, direction: -1 | 1) {
    updateStore((current) => {
      const index = current.categories.findIndex((category) => category.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.categories.length) return current;
      const categories = [...current.categories];
      [categories[index], categories[nextIndex]] = [categories[nextIndex], categories[index]];
      return { ...current, categories };
    });
  }

  function openAddTodo(scope: TodoScope, categoryId: string) {
    setTodoModal({
      mode: 'add',
      todo: {
        id: '',
        title: '',
        categoryId,
        scope,
        weekKey: scope === 'weekly' ? selectedWeek : undefined,
        monthKey: scope === 'monthly' ? selectedMonth : undefined,
        completed: false,
        recurring: false,
        deadline: '',
      },
    });
  }

  function toggleSection(key: keyof CollapseState) {
    setCollapse((current) => ({ ...current, [key]: !current[key] }));
  }

  return (
    <div className="app-shell">
      <main className="app-main">
        <div className="top-tools">
          <button className="manage-categories-btn" type="button" onClick={() => setCategoryModal(true)}>
            <Settings2 size={16} /> カテゴリ編集
          </button>
        </div>

        <ScopeSection
          title="長期"
          subtitle="いつか・そのうち"
          count={longTermTodos.filter((todo) => !todo.completed).length}
          open={collapse.longTerm}
          onToggle={() => toggleSection('longTerm')}
        >
          <TodoCategoryGroups categories={store.categories} todos={longTermTodos} scope="long-term" onAdd={(categoryId) => openAddTodo('long-term', categoryId)} onToggle={toggleTodo} onEdit={(todo) => setTodoModal({ mode: 'edit', todo })} onDelete={deleteTodo} />
        </ScopeSection>

        <ScopeSection
          title="月次"
          subtitle={selectedMonthOffset === 0 ? '今月' : formatMonth(selectedMonth)}
          count={monthlyTodos.filter((todo) => !todo.completed).length}
          open={collapse.monthly}
          onToggle={() => toggleSection('monthly')}
          headerExtra={
            <div className="period-nav compact-period-nav" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="nav-btn" onClick={() => { const date = new Date(`${selectedMonth}-01T00:00:00`); date.setMonth(date.getMonth() - 1); setSelectedMonth(monthKey(date)); }} aria-label="前の月"><ChevronLeft size={16} /></button>
              <span>{selectedMonthOffset === 0 ? '今月' : formatMonth(selectedMonth)}</span>
              <button type="button" className="nav-btn" onClick={() => { const date = new Date(`${selectedMonth}-01T00:00:00`); date.setMonth(date.getMonth() + 1); setSelectedMonth(monthKey(date)); }} aria-label="次の月"><ChevronRight size={16} /></button>
            </div>
          }
        >
          {selectedMonthOffset !== 0 && <button className="reset-period" type="button" onClick={() => setSelectedMonth(monthKey(new Date()))}>今月に戻る</button>}
          <TodoCategoryGroups categories={store.categories} todos={monthlyTodos} scope="monthly" onAdd={(categoryId) => openAddTodo('monthly', categoryId)} onToggle={toggleTodo} onEdit={(todo) => setTodoModal({ mode: 'edit', todo })} onDelete={deleteTodo} />
        </ScopeSection>

        <ScopeSection
          title="週次"
          subtitle={offset === 0 ? '今週' : offset < 0 ? '過去の週' : '先の週'}
          count={currentTodos.filter((todo) => !todo.completed).length}
          open={collapse.weekly}
          onToggle={() => toggleSection('weekly')}
        >
          <div className="week-switcher">
            <button className="nav-btn large" type="button" onClick={() => setSelectedWeek(weekKey(new Date(new Date(`${selectedWeek}T00:00:00`).getTime() - 604800000)))} aria-label="前の週"><ChevronLeft size={20} /></button>
            <button className="week-center" type="button" onClick={() => offset !== 0 && setSelectedWeek(weekKey(new Date()))}>
              <span className="week-status">{offset === 0 ? '今週' : offset === -1 ? '先週' : offset === 1 ? '来週' : `${Math.abs(offset)}週${offset < 0 ? '前' : '後'}`}</span>
              <span className="week-range">{formatRange(selectedWeek)}</span>
            </button>
            <button className="nav-btn large" type="button" onClick={() => setSelectedWeek(weekKey(new Date(new Date(`${selectedWeek}T00:00:00`).getTime() + 604800000)))} aria-label="次の週"><ChevronRight size={20} /></button>
          </div>
          <TodoCategoryGroups categories={store.categories} todos={currentTodos} scope="weekly" onAdd={(categoryId) => openAddTodo('weekly', categoryId)} onToggle={toggleTodo} onEdit={(todo) => setTodoModal({ mode: 'edit', todo })} onDelete={deleteTodo} />
        </ScopeSection>
      </main>

      {todoModal && <TodoModal categories={store.categories} initial={todoModal.todo} isEdit={todoModal.mode === 'edit'} onClose={() => setTodoModal(null)} onSave={(draft) => saveTodo(draft, todoModal.mode === 'edit' ? todoModal.todo : undefined)} />}
      {categoryModal && <CategoryModal categories={store.categories} onClose={() => setCategoryModal(false)} onAdd={addCategory} onRename={renameCategory} onDelete={deleteCategory} onMove={moveCategory} />}
      {toast && <div className="toast-note" role="status">{toast}</div>}
    </div>
  );
}

function ScopeSection({ title, subtitle, count, open, onToggle, headerExtra, children }: {
  title: string;
  subtitle: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  headerExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={`scope-card ${open ? 'is-open' : ''}`}>
      <button className="scope-toggle" type="button" onClick={onToggle} aria-expanded={open}>
        <div className="scope-copy">
          <div className="scope-title-line"><h2>{title}</h2><span className="scope-count">{count}</span></div>
          <span className="scope-subtitle">{subtitle}</span>
        </div>
        <div className="scope-right">
          {headerExtra}
          <span className="collapse-icon">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
        </div>
      </button>
      {open && <div className="scope-content">{children}</div>}
    </section>
  );
}

function TodoCategoryGroups({ categories, todos, scope, onAdd, onToggle, onEdit, onDelete }: {
  categories: Category[];
  todos: Todo[];
  scope: TodoScope;
  onAdd: (categoryId: string) => void;
  onToggle: (todoId: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
}) {
  return <div className="category-groups">
    {categories.map((category) => {
      const categoryTodos = todos.filter((todo) => todo.categoryId === category.id);
      return (
        <section className="category-block" key={`${scope}-${category.id}`}>
          <div className="category-heading">
            <div className="category-title">
              <span className="category-dot" style={{ '--category-color': category.color } as CSSProperties} />
              <span>{category.name}</span>
              <span className="category-count">{categoryTodos.length}</span>
            </div>
            <button className="category-add-btn" type="button" onClick={() => onAdd(category.id)} aria-label={`${category.name}にToDoを追加`}><Plus size={17} /></button>
          </div>
          {categoryTodos.length > 0 && <div className="todo-list">
            {categoryTodos.map((todo) => (
              <div className={`todo-row ${todo.completed ? 'is-complete' : ''}`} key={todo.id}>
                <button className={`check-btn ${todo.completed ? 'is-checked' : ''}`} type="button" onClick={() => onToggle(todo.id)} aria-label={todo.completed ? `${todo.title}の完了を取り消す` : `${todo.title}を完了にする`}>{todo.completed && <Check size={15} strokeWidth={2.6} />}</button>
                <div className={`todo-title ${todo.completed ? 'is-complete' : ''}`}>
                  <span>{todo.title}</span>
                  {todo.recurring && <span className="meta-mark"><Repeat size={11} /> 毎週</span>}
                  {scope === 'long-term' && todo.deadline && <span className="meta-mark deadline">期限 {formatDeadline(todo.deadline)}</span>}
                </div>
                <div className="row-actions">
                  <button className="row-action" type="button" onClick={() => onEdit(todo)} aria-label={`${todo.title}を編集`}><Pencil size={15} /></button>
                  <button className="row-action delete" type="button" onClick={() => onDelete(todo.id)} aria-label={`${todo.title}を削除`}><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>}
        </section>
      );
    })}
    {categories.length === 0 && <div className="empty-note">「カテゴリ編集」からカテゴリを追加してください。</div>}
  </div>;
}

function TodoModal({ categories, initial, isEdit, onClose, onSave }: { categories: Category[]; initial?: Todo; isEdit: boolean; onClose: () => void; onSave: (draft: TodoDraft) => void }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '');
  const scope = initial?.scope ?? 'weekly';
  const [recurring, setRecurring] = useState(initial?.recurring ?? false);
  const [deadline, setDeadline] = useState(initial?.deadline ?? '');

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim() || !categoryId) return;
    onSave({
      title: title.trim(),
      categoryId,
      scope,
      recurring: scope === 'weekly' ? recurring : false,
      weekKey: scope === 'weekly' ? initial?.weekKey : undefined,
      monthKey: scope === 'monthly' ? initial?.monthKey : undefined,
      deadline: scope === 'long-term' ? deadline : undefined,
    });
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <form className="modal-card" onSubmit={submit}>
      <div className="modal-heading">
        <div><h2>{isEdit ? 'ToDoを編集' : 'ToDoを追加'}</h2><p>{scope === 'weekly' ? '週次' : scope === 'monthly' ? '月次' : '長期'}のToDo</p></div>
        <button className="modal-close" type="button" onClick={onClose} aria-label="閉じる"><X size={18} /></button>
      </div>
      <label className="form-field"><span>やること</span><input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="ToDoを入力" /></label>
      <label className="form-field"><span>カテゴリ</span><select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      {scope === 'long-term' && <label className="form-field"><span>締切日（任意）</span><input type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>}
      {scope === 'weekly' && <label className="form-check"><input type="checkbox" checked={recurring} onChange={(event) => setRecurring(event.target.checked)} /> 毎週くり返す</label>}
      <div className="modal-actions"><button className="btn secondary" type="button" onClick={onClose}>キャンセル</button><button className="btn primary" type="submit" disabled={!title.trim() || !categoryId}>{isEdit ? '更新' : '追加'}</button></div>
    </form>
  </div>;
}

function CategoryModal({ categories, onClose, onAdd, onRename, onDelete, onMove }: {
  categories: Category[];
  onClose: () => void;
  onAdd: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
}) {
  const [newName, setNewName] = useState('');
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="modal-card category-modal" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div className="modal-heading">
        <div><h2 id="category-modal-title">カテゴリ編集</h2><p>ここでの変更は長期・月次・週次すべてに反映されます。</p></div>
        <button className="modal-close" type="button" onClick={onClose} aria-label="閉じる"><X size={18} /></button>
      </div>
      <div className="category-edit-list">
        {categories.map((category, index) => <div className="category-edit-row" key={category.id}>
          <span className="category-color" style={{ background: category.color }} />
          <input value={category.name} aria-label={`${category.name}の名前`} onChange={(event) => onRename(category.id, event.target.value)} />
          <div className="order-buttons">
            <button type="button" disabled={index === 0} onClick={() => onMove(category.id, -1)} aria-label={`${category.name}を上へ`}><ArrowUp size={14} /></button>
            <button type="button" disabled={index === categories.length - 1} onClick={() => onMove(category.id, 1)} aria-label={`${category.name}を下へ`}><ArrowDown size={14} /></button>
          </div>
          <button className="row-action delete" type="button" onClick={() => onDelete(category.id)} aria-label={`${category.name}を削除`}><Trash2 size={15} /></button>
        </div>)}
      </div>
      <div className="category-add-row">
        <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="新しいカテゴリ名" onKeyDown={(event) => { if (event.key === 'Enter' && newName.trim()) { event.preventDefault(); onAdd(newName); setNewName(''); } }} />
        <button className="btn primary add" type="button" disabled={!newName.trim()} onClick={() => { onAdd(newName); setNewName(''); }}><Plus size={15} />追加</button>
      </div>
      <div className="modal-actions"><button className="btn primary" type="button" onClick={onClose}>完了</button></div>
    </div>
  </div>;
}

export default function App() {
  return <AppHome />;
}
