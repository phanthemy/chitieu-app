import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TransactionList from './pages/TransactionList'
import AddTransaction from './pages/AddTransaction'
import BudgetPage from './pages/BudgetPage'
import './App.css'

const API_BASE = '/api'

// Category name → display info mapping
const CATEGORY_ICONS = {
  'Ăn uống': { icon: '🍜', value: 'food' },
  'Đi lại': { icon: '🚗', value: 'transport' },
  'Nhà ở': { icon: '🏠', value: 'rent' },
  'Mua sắm': { icon: '🛍️', value: 'shopping' },
  'Hóa đơn': { icon: '💡', value: 'bills' },
  'Sức khỏe': { icon: '💊', value: 'health' },
  'Giải trí': { icon: '🎮', value: 'entertainment' },
  'Khác (Chi)': { icon: '📦', value: 'other' },
  'Khác': { icon: '📦', value: 'other' },
  'Chi tiêu khác': { icon: '📦', value: 'other' },
  'Lương': { icon: '💰', value: 'salary' },
  'Freelance': { icon: '💻', value: 'freelance' },
  'Khác (Thu)': { icon: '🤝', value: 'other_income' },
}

const DEFAULT_CATEGORIES = [
  { name: 'Ăn uống', type: 'EXPENSE' },
  { name: 'Đi lại', type: 'EXPENSE' },
  { name: 'Nhà ở', type: 'EXPENSE' },
  { name: 'Mua sắm', type: 'EXPENSE' },
  { name: 'Hóa đơn', type: 'EXPENSE' },
  { name: 'Sức khỏe', type: 'EXPENSE' },
  { name: 'Giải trí', type: 'EXPENSE' },
  { name: 'Khác (Chi)', type: 'EXPENSE' },
  { name: 'Lương', type: 'INCOME' },
  { name: 'Freelance', type: 'INCOME' },
  { name: 'Khác (Thu)', type: 'INCOME' },
]

function useRouter() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/login')
  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.slice(1) || '/login')
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  const navigate = (path) => { window.location.hash = path; setRoute(path) }
  return { route, navigate }
}

function getAuthHeaders() {
  const token = localStorage.getItem('token')
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

function mapTransactionFromAPI(tx) {
  const catName = tx.category?.name || 'Khác'
  const catInfo = CATEGORY_ICONS[catName] || { icon: '📦', value: 'other' }
  const isIncome = tx.category?.type === 'INCOME'
  return {
    id: tx.id,
    type: isIncome ? 'income' : 'expense',
    amount: tx.amount,
    category: catInfo.value,
    categoryId: tx.categoryId,
    categoryName: catName,
    note: tx.description || catName,
    date: tx.date ? tx.date.split('T')[0] : new Date().toISOString().split('T')[0],
    icon: catInfo.icon,
  }
}

const DEFAULT_BUDGETS = [
  { id: 1, category: 'food', label: 'Ăn uống', icon: '🍜', limit: 3000000, color: '#ff6b6b' },
  { id: 2, category: 'transport', label: 'Đi lại', icon: '🚗', limit: 1500000, color: '#ffa726' },
  { id: 3, category: 'shopping', label: 'Mua sắm', icon: '🛍️', limit: 2000000, color: '#a855f7' },
  { id: 4, category: 'bills', label: 'Hóa đơn', icon: '💡', limit: 2000000, color: '#0984e3' },
  { id: 5, category: 'health', label: 'Sức khỏe', icon: '💊', limit: 1000000, color: '#26de81' },
  { id: 6, category: 'entertainment', label: 'Giải trí', icon: '🎮', limit: 1000000, color: '#00cec9' },
  { id: 7, category: 'rent', label: 'Nhà ở', icon: '🏠', limit: 4000000, color: '#3867d6' },
  { id: 8, category: 'other', label: 'Chi tiêu khác', icon: '📦', limit: 1000000, color: '#e84393' },
]

const getStorageKey = (user) => (user?.id ? `spendwise_budgets_${user.id}` : 'spendwise_budgets')

function loadBudgetsFromStorage(user) {
  try {
    const key = getStorageKey(user)
    const saved = localStorage.getItem(key) || localStorage.getItem('spendwise_budgets')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return DEFAULT_BUDGETS.map(def => {
          const match = parsed.find(p => p.category === def.category)
          return match && typeof match.limit === 'number' ? { ...def, limit: match.limit } : def
        })
      }
    }
  } catch (e) {
    console.error('Error reading budgets from localStorage:', e)
  }
  return DEFAULT_BUDGETS
}

function App() {
  const { route, navigate } = useRouter()
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [budgets, setBudgets] = useState(() => loadBudgetsFromStorage(user))

  // Global Time/Period state: default to current month and year
  const currentNow = new Date()
  const [selectedPeriod, setSelectedPeriod] = useState({
    month: currentNow.getMonth() + 1,
    year: currentNow.getFullYear(),
    allTime: false
  })

  // Sync budgets when user changes
  useEffect(() => {
    setBudgets(loadBudgetsFromStorage(user))
  }, [user?.id])

  // Auto-login nếu có token saved
  useEffect(() => {
    if (user && localStorage.getItem('token')) {
      loadData()
      if (route === '/login') navigate('/dashboard')
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    await Promise.all([loadTransactions(), loadCategories()])
    setLoading(false)
  }

  const loadTransactions = async () => {
    try {
      const res = await fetch(`${API_BASE}/transactions`, { headers: getAuthHeaders() })
      if (res.status === 401) { handleLogout(); return }
      const data = await res.json()
      if (Array.isArray(data)) {
        setTransactions(data.map(mapTransactionFromAPI))
      }
    } catch (err) {
      console.error('Load transactions error:', err)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/categories`, { headers: getAuthHeaders() })
      if (!res.ok) return []
      const data = await res.json()
      if (Array.isArray(data)) {
        if (data.length === 0) {
          return await seedDefaultCategories()
        }
        setCategories(data)
        return data
      }
    } catch (err) {
      console.error('Load categories error:', err)
    }
    return []
  }

  const seedDefaultCategories = async () => {
    const created = []
    for (const cat of DEFAULT_CATEGORIES) {
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(cat)
        })
        if (res.ok) created.push(await res.json())
      } catch (err) { /* ignore */ }
    }
    setCategories(created)
    return created
  }

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    setBudgets(loadBudgetsFromStorage(userData))
    navigate('/dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setTransactions([])
    setCategories([])
    navigate('/login')
  }

  const addTransaction = async (transaction) => {
    try {
      let cats = categories
      if (cats.length === 0) cats = await loadCategories()

      const txType = transaction.type === 'income' ? 'INCOME' : 'EXPENSE'

      // Find matching category by value/icon key
      let cat = cats.find(c => {
        const info = CATEGORY_ICONS[c.name]
        return info && info.value === transaction.category && c.type === txType
      })

      if (!cat) {
        // Try just by value
        cat = cats.find(c => {
          const info = CATEGORY_ICONS[c.name]
          return info && info.value === transaction.category
        })
      }

      if (!cat) {
        // Create new category
        const catName = Object.entries(CATEGORY_ICONS).find(([, v]) => v.value === transaction.category)?.[0]
          || transaction.category
        const createRes = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: catName, type: txType })
        })
        if (createRes.ok) {
          cat = await createRes.json()
          setCategories(prev => [...prev, cat])
        }
      }

      if (!cat) {
        throw new Error('Cannot find or create category')
      }

      const res = await fetch(`${API_BASE}/transactions`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          amount: transaction.amount,
          description: transaction.note,
          date: transaction.date,
          categoryId: cat.id
        })
      })

      if (res.status === 401) { handleLogout(); return }
      if (res.ok) {
        const newTx = await res.json()
        setTransactions(prev => [mapTransactionFromAPI(newTx), ...prev])
        navigate('/transactions')
      } else {
        throw new Error('API error')
      }
    } catch (err) {
      console.error('Add transaction error:', err)
      // Fallback: add locally with temp id
      const newTx = { ...transaction, id: Date.now() }
      setTransactions(prev => [newTx, ...prev])
      navigate('/transactions')
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/transactions/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      if (res.status === 401) { handleLogout(); return }
    } catch (err) {
      console.error('Delete transaction error:', err)
    }
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const updateBudget = (id, newLimit) => {
    setBudgets(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, limit: newLimit } : b)
      try {
        const key = getStorageKey(user)
        localStorage.setItem(key, JSON.stringify(updated))
        localStorage.setItem('spendwise_budgets', JSON.stringify(updated))
      } catch (err) {
        console.error('Failed to save budgets to localStorage', err)
      }
      return updated
    })
  }

  const isLoggedIn = !!user
  const showNavbar = isLoggedIn && route !== '/login'

  const renderPage = () => {
    if (!isLoggedIn && route !== '/login') {
      navigate('/login')
      return <LoginPage onLogin={handleLogin} />
    }
    switch (route) {
      case '/login':
        return <LoginPage onLogin={handleLogin} />
      case '/dashboard':
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            navigate={navigate}
            loading={loading}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )
      case '/transactions':
        return (
          <TransactionList
            transactions={transactions}
            onDelete={deleteTransaction}
            navigate={navigate}
            onRefresh={loadTransactions}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )
      case '/add':
        return <AddTransaction onAdd={addTransaction} navigate={navigate} />
      case '/budget':
        return (
          <BudgetPage
            budgets={budgets}
            transactions={transactions}
            onUpdateBudget={updateBudget}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )
      default:
        return (
          <Dashboard
            transactions={transactions}
            budgets={budgets}
            navigate={navigate}
            loading={loading}
            period={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        )
    }
  }

  return (
    <div className="app">
      {showNavbar && <Navbar route={route} navigate={navigate} onLogout={handleLogout} user={user} />}
      <main className={showNavbar ? 'main-content' : ''}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App
