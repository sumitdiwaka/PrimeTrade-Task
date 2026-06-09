'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Task, User } from '@/types'

const STATUS_COLOR: Record<string, string> = { TODO: '#6c63ff', IN_PROGRESS: '#facc15', DONE: '#4ade80' }
const PRIORITY_COLOR: Record<string, string> = { LOW: '#4ade80', MEDIUM: '#facc15', HIGH: '#f87171' }
const STATUS_NEXT: Record<Task['status'], Task['status']> = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }
const STATUS_LABEL: Record<string, string> = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

function TaskCard({ task, onEdit, onDelete, onStatusChange }: {
  task: Task; onEdit: (t: Task) => void
  onDelete: (id: string) => void; onStatusChange: (id: string, s: Task['status']) => void
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderLeft: `3px solid ${STATUS_COLOR[task.status]}`,
      borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{task.title}</h3>
        <span style={{
          flexShrink: 0, fontSize: 10, padding: '3px 8px', borderRadius: 20, height: 'fit-content',
          background: `${PRIORITY_COLOR[task.priority]}18`, color: PRIORITY_COLOR[task.priority],
          fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
        }}>{task.priority}</span>
      </div>
      {task.description && <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.55 }}>{task.description}</p>}
      {task.dueDate && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>📅 {new Date(task.dueDate).toLocaleDateString()}</p>}
      <div style={{ display: 'flex', gap: 7, marginTop: 4 }}>
        <button onClick={() => onStatusChange(task.id, STATUS_NEXT[task.status])} style={{
          flex: 1, padding: '7px 4px', fontSize: 11, borderRadius: 7, border: 'none', cursor: 'pointer',
          background: `${STATUS_COLOR[task.status]}18`, color: STATUS_COLOR[task.status], fontWeight: 600,
        }}>
          {STATUS_LABEL[task.status]} ↻
        </button>
        <button onClick={() => onEdit(task)} style={{
          padding: '7px 12px', fontSize: 12, borderRadius: 7, cursor: 'pointer',
          background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)',
        }}>✏</button>
        <button onClick={() => onDelete(task.id)} style={{
          padding: '7px 12px', fontSize: 12, borderRadius: 7, cursor: 'pointer',
          background: 'rgba(248,113,113,0.08)', color: 'var(--error)', border: '1px solid rgba(248,113,113,0.2)',
        }}>🗑</button>
      </div>
    </div>
  )
}

function Modal({ task, onClose, onSave }: { task: Partial<Task> | null; onClose: () => void; onSave: (d: Partial<Task>) => void }) {
  const [form, setForm] = useState({
    title: task?.title || '', description: task?.description || '',
    status: task?.status || 'TODO', priority: task?.priority || 'MEDIUM',
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : '',
  })
  const iStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', background: 'var(--surface2)',
    border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontSize: 14, outline: 'none',
  }
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, marginBottom: '1.5rem' }}>{task?.id ? 'Edit Task' : '+ New Task'}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Title *</label>
            <input style={iStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="What needs to be done?" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Description</label>
            <textarea style={{ ...iStyle, resize: 'vertical', minHeight: 80 }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Optional details..." />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Status</label>
              <select style={iStyle} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Task['status'] }))}>
                <option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="DONE">Done</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Priority</label>
              <select style={iStyle} value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as Task['priority'] }))}>
                <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Due Date</label>
            <input type="date" style={iStyle} value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Cancel</button>
            <button onClick={() => { if (form.title.trim()) onSave({ ...form, dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null }) }}
              style={{ flex: 1, padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Save Task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; task: Partial<Task> | null }>({ open: false, task: null })
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [filter, setFilter] = useState('ALL')

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTasks = useCallback(async () => {
    const url = filter !== 'ALL' ? `/api/v1/tasks?status=${filter}` : '/api/v1/tasks'
    try {
      const res = await fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json()
      if (data.success) setTasks(data.data)
    } finally { setLoading(false) }
  }, [filter])
  useEffect(() => {
    const u = localStorage.getItem('user')
    const t = localStorage.getItem('token')
    if (!u || !t) {
      window.location.href = '/login'
      return
    }
    setUser(JSON.parse(u))
    fetchTasks()
  }, [fetchTasks])

  const handleSave = async (formData: Partial<Task>) => {
    const isEdit = !!modal.task?.id
    const res = await fetch(isEdit ? `/api/v1/tasks/${modal.task!.id}` : '/api/v1/tasks', {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(formData),
    })
    const data = await res.json()
    if (data.success) { showToast(isEdit ? 'Task updated!' : 'Task created!'); setModal({ open: false, task: null }); fetchTasks() }
    else showToast(data.message, 'error')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    const res = await fetch(`/api/v1/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } })
    const data = await res.json()
    if (data.success) { showToast('Task deleted.'); fetchTasks() }
  }

  const handleStatusChange = async (id: string, status: Task['status']) => {
    await fetch(`/api/v1/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ status }),
    })
    fetchTasks()
  }

  const logout = () => { localStorage.clear(); document.cookie = 'token=; max-age=0; path=/'; window.location.href = '/' }

  const stats = [
    { label: 'Total', value: tasks.length, color: '#a39fff' },
    { label: 'To Do', value: tasks.filter(t => t.status === 'TODO').length, color: '#6c63ff' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'IN_PROGRESS').length, color: '#facc15' },
    { label: 'Done', value: tasks.filter(t => t.status === 'DONE').length, color: '#4ade80' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', fontFamily: 'var(--font-body)' }}>
      <nav style={{ padding: '1rem 2rem', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 40 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>TaskFlow</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user?.role === 'ADMIN' && <Link href="/admin" style={{ color: 'var(--accent2)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>⚡ Admin</Link>}
          <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>👤 {user?.name}</span>
          <button onClick={logout} style={{ padding: '7px 16px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', cursor: 'pointer', fontSize: 13 }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '2rem' }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>My Tasks</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontWeight: 600,
                background: filter === f ? 'var(--accent)' : 'var(--surface2)',
                color: filter === f ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
              }}>{f.replace('_', ' ')}</button>
            ))}
            <button onClick={() => setModal({ open: true, task: {} })} style={{
              padding: '7px 20px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
              fontFamily: 'var(--font-display)', fontWeight: 700,
            }}>+ New Task</button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '4rem' }}>Loading your tasks...</div>
        ) : tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📋</div>
            <p style={{ fontSize: 18, marginBottom: 8 }}>No tasks yet</p>
            <p style={{ fontSize: 14 }}>Create your first task to get started</p>
            <button onClick={() => setModal({ open: true, task: {} })} style={{
              marginTop: 20, padding: '10px 24px', background: 'var(--accent)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-display)', fontWeight: 700,
            }}>+ Create Task</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onEdit={t => setModal({ open: true, task: t })} onDelete={handleDelete} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      {modal.open && <Modal task={modal.task} onClose={() => setModal({ open: false, task: null })} onSave={handleSave} />}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 100,
          padding: '12px 22px', borderRadius: 10, fontWeight: 600, fontSize: 14,
          background: toast.type === 'success' ? 'var(--success)' : 'var(--error)',
          color: '#000', boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
        }}>{toast.msg}</div>
      )}
    </div>
  )
}
