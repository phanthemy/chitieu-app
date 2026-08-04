import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import TransactionList from './pages/TransactionList'
import AddTransaction from './pages/AddTransaction'
import BudgetPage from './pages/BudgetPage'
import './App.css'

// Simple hash-based router
function useRouter() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/login')

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || '/login')
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (path) => {
    window.location.hash = path
    setRoute(path)
  }

  return { route, navigate }
}

function App() {
  const { route, navigate } = useRouter()
  const [user, setUser] = useState(null)
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 15000000, category: 'salary', note: 'Lương tháng 8', date: '2026-08-01' },
    { id: 2, type: 'expense', amount: 3500000, category: 'rent', note: 'Tiền nhà tháng 8', date: '2026-08-01' },
    { id: 3, type: 'expense', amount: 250000, category: 'food', note: 'Đi ăn với bạn bè', date: '2026-08-02' },
    { id: 4, type: 'expense', amount: 500000, category: 'transport', note: 'Đổ xăng + grab', date: '2026-08-02' },
    { id: 5, type: 'income', amount: 2000000, category: 'freelance', note: 'Dự án freelance', date: '2026-08-03' },
    { id: 6, type: 'expense', amount: 180000, category: 'shopping', note: 'Mua sách online', date: '2026-08-03' },
    { id: 7, type: 'expense', amount: 1200000, category: 'bills', note: 'Điện nước internet', date: '2026-08-03' },
    { id: 8, type: 'expense', amount: 350000, category: 'health', note: 'Khám bệnh + thuốc', date: '2026-08-04' },
    { id: 9, type: 'expense', amount: 420000, category: 'food', note: 'Thức ăn tuần này', date: '2026-08-04' },
    { id: 10, type: 'income', amount: 500000, category: 'other', note: 'Bạn trả tiền nợ', date: '2026-08-04' },
  ])

  const [budgets, setBudgets] = useState([
    { id: 1, category: 'food', label: 'Ăn uống', limit: 3000000, color: '#F97316' },
    { id: 2, category: 'transport', label: 'Đi lại', limit: 1500000, color: '#3B82F6' },
    { id: 3, category: 'shopping', label: 'Mua sắm', limit: 2000000, color: '#EC4899' },
    { id: 4, category: 'bills', label: 'Hóa đơn', limit: 2000000, color: '#06B6D4' },
    { id: 5, category: 'health', label: 'Sức khỏe', limit: 1000000, color: '#22C55E' },
    { id: 6, category: 'entertainment', label: 'Giải trí', limit: 1000000, color: '#F59E0B' },
  ])

  const handleLogin = (userData) => {
    setUser(userData)
    navigate('/dashboard')
  }

  const handleLogout = () => {
    setUser(null)
    navigate('/login')
  }

  const addTransaction = (transaction) => {
    const newTx = {
      ...transaction,
      id: Date.now(),
    }
    setTransactions(prev => [newTx, ...prev])
    navigate('/transactions')
  }

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const updateBudget = (id, newLimit) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, limit: newLimit } : b))
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
        return <Dashboard transactions={transactions} budgets={budgets} navigate={navigate} />
      case '/transactions':
        return <TransactionList transactions={transactions} onDelete={deleteTransaction} navigate={navigate} />
      case '/add':
        return <AddTransaction onAdd={addTransaction} navigate={navigate} />
      case '/budget':
        return <BudgetPage budgets={budgets} transactions={transactions} onUpdateBudget={updateBudget} />
      default:
        return <Dashboard transactions={transactions} budgets={budgets} navigate={navigate} />
    }
  }

  return (
    <div className="app-container">
      {showNavbar && <Navbar route={route} navigate={navigate} onLogout={handleLogout} user={user} />}
      <div className={showNavbar ? 'main-wrapper' : 'main-wrapper full-width'} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main className={showNavbar ? 'main-content' : 'main-content full-width'}>
          {renderPage()}
        </main>
      </div>
      {showNavbar && route !== '/add' && (
        <button className="fab" onClick={() => navigate('/add')}>
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}

export default App
