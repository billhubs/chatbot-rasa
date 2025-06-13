import React, { useState, useEffect, useRef, CSSProperties } from 'react'
import { HashRouter as Router, Link, Route, Routes, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Reports from './Reports'

const theme = {
  background: '#FFF',
  surface: '#FFF',
  shadow: '0 4px 12px rgba(0,0,0,0.1)',
  primary: '#FFD166',
  secondary: '#2D3748',
  text: '#2D3748',
  font: 'Inter, sans-serif'
}

const styles: Record<string, CSSProperties> = {
  layout: {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    background: theme.background,
    color: theme.text,
    fontFamily: theme.font
  },
  sidebar: {
    width: 200,
    background: theme.surface,
    boxShadow: theme.shadow,
    padding: '1rem',
    borderRadius: '0 16px 16px 0',
    margin: '1rem 0 1rem 1rem'
  },
  sidebarTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: theme.secondary,
    marginBottom: '1rem'
  },
  sidebarLink: {
    padding: '0.5rem 1rem',
    color: theme.text,
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    display: 'block'
  },
  sidebarLinkActive: {
    background: theme.primary,
    color: theme.secondary
  },
  mainColumn: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    height: '100vh',
    padding: '1rem'
  },
  topbar: {
    background: theme.surface,
    boxShadow: theme.shadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '50px',
    padding: '0 1rem',
    fontSize: '1rem',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderRadius: '12px',
    marginBottom: '1rem'
  },
  contentRow: {
    display: 'flex',
    flex: 1,
    minHeight: 0,
    width: '100%',
    height: '100%'
  },
  reportsWrapper: {
    width: '100%',
    maxWidth: '900px',
    margin: '1rem auto',
    background: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.shadow,
    padding: '1rem'
  },
  chatContainer: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 80px)',
    background: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.shadow
  },
  chatWindow: {
    flex: 1,
    padding: '1rem',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    borderRadius: '12px'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    fontSize: '0.9rem',
    lineHeight: 1.5,
    boxShadow: theme.shadow
  },
  botMessage: {
    background: '#FFF8E1',
    alignSelf: 'flex-start'
  },
  userMessage: {
    background: theme.primary,
    alignSelf: 'flex-end',
    color: theme.secondary
  },
  inputForm: {
    display: 'flex',
    padding: '0.5rem 1rem',
    background: theme.surface,
    borderRadius: '12px',
    gap: '0.5rem',
    boxShadow: theme.shadow
  },
  inputField: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '0.9rem',
    borderRadius: '8px',
    border: 'none',
    outline: 'none',
    background: '#F5F5F5',
    color: theme.text
  },
  sendButton: {
    padding: '0.5rem 1rem',
    background: theme.primary,
    border: 'none',
    borderRadius: '8px',
    color: theme.secondary,
    fontWeight: 500,
    cursor: 'pointer'
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    background: theme.surface,
    borderRadius: '12px'
  },
  actionButton: {
    padding: '0.5rem 1rem',
    background: '#F5F5F5',
    border: 'none',
    borderRadius: '8px',
    color: theme.text,
    fontWeight: 500,
    cursor: 'pointer'
  },
  pieChartContainer: {
    position: 'absolute',
    bottom: '50px',
    left: '1rem',
    width: '250px',
    height: '250px',
    background: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.shadow,
    padding: '0.5rem',
    zIndex: 100
  },
  frameContainer: {
    marginTop: '1rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '0.5rem'
  },
  frame: {
    background: theme.surface,
    borderRadius: '16px',
    boxShadow: theme.shadow,
    padding: '0.5rem',
    maxHeight: '250px',
    overflowY: 'auto'
  },
  frameTitle: {
    fontWeight: 600,
    fontSize: '1rem',
    marginBottom: '0.5rem',
    color: theme.secondary
  },
  listItem: {
    fontSize: '0.8rem',
    marginBottom: '0.5rem',
    color: theme.text
  }
}

const mobileStyles: Record<string, CSSProperties> = {
  layout: { flexDirection: 'column' },
  sidebar: { width: '100%', borderRadius: '12px', margin: '0.5rem', padding: '0.5rem' },
  mainColumn: { padding: '0.5rem' },
  chatContainer: { height: 'calc(100vh - 100px)' }
}

const sidebarLinks = [
  { to: '/', label: 'Reports' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/messages', label: 'Chat Assistant' }
]

function Sidebar() {
  const location = useLocation()
  return (
    <aside style={{ ...styles.sidebar, ...(window.innerWidth <= 768 ? mobileStyles.sidebar : {}) }}>
      <div style={styles.sidebarTitle}>Kirana AI</div>
      <nav style={{ flex: 1 }}>
        {sidebarLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              ...styles.sidebarLink,
              ...(location.pathname === link.to ? styles.sidebarLinkActive : {})
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}

function Topbar() {
  const location = useLocation()
  const title = location.pathname === '/messages' ? 'Chat Assistant' :
                location.pathname === '/bookings' ? 'Bookings' : 'Reports'
  return (
    <header style={styles.topbar}>
      <div style={{ fontWeight: 600, fontSize: '1.1rem', color: theme.secondary }}>{title}</div>
      <div style={{ fontWeight: 500 }}>Hello, Operator!</div>
    </header>
  )
}

const COLORS = ['#FFD166', '#06D6A0', '#EF476F']

function SalesPieChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={theme.primary}
          label
          isAnimationActive={false}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

interface Reservation {
  reservation_id: string
  pnr: string
  customer_name: string
  travel_date: string
  route: string
  price: number
  status: string
  phone?: string
  reservation_timestamp: string
}

function BookingsMain() {
  const [searchQuery, setSearchQuery] = useState('')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [error, setError] = useState<string | null>(null)
  const [salesData, setSalesData] = useState<{ name: string; value: number }[]>([])
  const [recentReservations, setRecentReservations] = useState<Reservation[]>([])
  const [loyalCustomers, setLoyalCustomers] = useState<{ name: string; phone: string; count: number }[]>([])
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([])

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch('http://192.168.0.9:5000/reservations/')
        if (!response.ok) throw new Error('Failed to fetch reservations')
        const data: Reservation[] = await response.json()
        setReservations(data)
        setError(null)

        const statusCounts: Record<string, number> = {}
        data.forEach(res => {
          const status = res.status.toLowerCase()
          statusCounts[status] = (statusCounts[status] || 0) + 1
        })
        setSalesData([
          { name: 'Pending', value: statusCounts.pending || 0 },
          { name: 'Confirmed', value: statusCounts.confirmed || 0 },
          { name: 'Cancelled', value: statusCounts.cancelled || 0 }
        ])

        const recent = data
          .filter(res => ['pending', 'confirmed', 'ongoing'].includes(res.status.toLowerCase()))
          .sort((a, b) => new Date(b.travel_date).getTime() - new Date(a.travel_date).getTime())
          .slice(0, 10)
        setRecentReservations(recent)

        const customerMap: Record<string, { count: number; phone: string }> = {}
        data.forEach(res => {
          const key = `${res.customer_name}-${res.phone || ''}`
          customerMap[key] = customerMap[key] ? { ...customerMap[key], count: customerMap[key].count + 1 } : { count: 1, phone: res.phone || '' }
        })
        const loyal = Object.entries(customerMap)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 5)
          .map(([key, val]) => ({ name: key.split('-')[0], phone: val.phone, count: val.count }))
        setLoyalCustomers(loyal)

        const pending = data
          .filter(res => res.status.toLowerCase() === 'pending')
          .sort((a, b) => new Date(b.reservation_timestamp).getTime() - new Date(a.reservation_timestamp).getTime())
          .slice(0, 10)
        setPendingReservations(pending)
      } catch (error) {
        setError('Failed to load reservations')
        console.error('Error:', error)
      }
    }
    fetchReservations()
  }, [])

  const filteredReservations = reservations.filter(r =>
    r.customer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{
      background: theme.surface,
      borderRadius: '16px',
      boxShadow: theme.shadow,
      padding: '1rem',
      margin: '1rem auto',
      maxWidth: '600px',
      fontFamily: theme.font,
      height: 'calc(100vh - 120px)',
      overflowY: 'auto',
      position: 'relative'
    }}>
      <h2 style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '1.3rem', color: theme.secondary }}>Bookings</h2>
      <input
        type="text"
        placeholder="Search reservations"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        style={{ ...styles.inputField, width: '100%', marginBottom: '0.5rem' }}
        aria-label="Search reservations"
      />
      {error && <div style={{ color: '#EF4444', marginBottom: '0.5rem', fontWeight: 500 }}>{error}</div>}

      <div style={styles.pieChartContainer}>
        <SalesPieChart data={salesData} />
      </div>

      <div style={styles.frameContainer}>
        <div style={styles.frame}>
          <h3 style={styles.frameTitle}>Recent Reservations</h3>
          {recentReservations.length === 0 ? (
            <p style={styles.listItem}>No recent reservations</p>
          ) : (
            recentReservations.map(res => (
              <p key={res.reservation_id} style={styles.listItem}>
                {res.customer_name} - {new Date(res.travel_date).toLocaleDateString()} - {res.status}
              </p>
            ))
          )}
        </div>
        <div style={styles.frame}>
          <h3 style={styles.frameTitle}>Loyal Customers</h3>
          {loyalCustomers.length === 0 ? (
            <p style={styles.listItem}>No loyal customers</p>
          ) : (
            loyalCustomers.map((cust, idx) => (
              <p key={idx} style={styles.listItem}>
                {cust.name} - {cust.phone} ({cust.count})
              </p>
            ))
          )}
        </div>
        <div style={styles.frame}>
          <h3 style={styles.frameTitle}>Pending Reservations</h3>
          {pendingReservations.length === 0 ? (
            <p style={styles.listItem}>No pending reservations</p>
          ) : (
            pendingReservations.map(res => (
              <p key={res.reservation_id} style={styles.listItem}>
                {res.customer_name} - {new Date(res.reservation_timestamp).toLocaleDateString()}
              </p>
            ))
          )}
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredReservations.length === 0 ? (
          <li style={{ color: theme.text, textAlign: 'center' }}>No reservations found</li>
        ) : (
          filteredReservations.map(r => (
            <motion.li
              key={r.pnr}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ padding: '0.5rem 0', borderBottom: '1px solid #F5F5F5', color: theme.text }}
            >
              {r.customer_name} - {new Date(r.travel_date).toLocaleDateString()} - {r.route} - Rp {r.price.toLocaleString()} - {r.status}
            </motion.li>
          ))
        )}
      </ul>
    </div>
  )
}

interface ChatProps {
  chatMessages: { text: string; isBot: boolean }[]
  sendToRasa: (msg: string) => void
  setChatMessages: React.Dispatch<React.SetStateAction<{ text: string; isBot: boolean }[]>>
}

function AnimatedRoutes({ chatMessages, sendToRasa, setChatMessages }: ChatProps) {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%' }}
          >
            <div style={styles.reportsWrapper}>
              <Reports />
            </div>
          </motion.div>
        } />
        <Route path="/bookings" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%' }}
          >
            <BookingsMain />
          </motion.div>
        } />
        <Route path="/messages" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ChatInterface
              messages={chatMessages}
              onSendMessage={sendToRasa}
              setChatMessages={setChatMessages}
            />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export function App() {
  const [chatMessages, setChatMessages] = useState<{ text: string; isBot: boolean }[]>([])

  const sendToRasa = async (message: string) => {
    try {
      setChatMessages(prev => [...prev, { text: message, isBot: false }])
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, user_id: 'user' })
      })
      if (!response.ok) throw new Error('Failed to send message')
      const data = await response.json()
      setChatMessages(prev => [...prev, { text: data.response, isBot: true }])
    } catch (error) {
      setChatMessages(prev => [...prev, { text: 'Server error', isBot: true }])
    }
  }

  useEffect(() => {
    setChatMessages([{ text: 'Hello I am Kirana your assistant How can I help today', isBot: true }])
  }, [])

  return (
    <Router>
      <div style={{ ...styles.layout, ...(window.innerWidth <= 768 ? mobileStyles.layout : {}) }}>
        <Sidebar />
        <div style={{ ...styles.mainColumn, ...(window.innerWidth <= 768 ? mobileStyles.mainColumn : {}) }}>
          <Topbar />
          <div style={styles.contentRow}>
            <AnimatedRoutes
              chatMessages={chatMessages}
              sendToRasa={sendToRasa}
              setChatMessages={setChatMessages}
            />
          </div>
        </div>
      </div>
    </Router>
  )
}

interface ChatInterfaceProps {
  messages: { text: string; isBot: boolean }[]
  onSendMessage: (msg: string) => void
  setChatMessages: React.Dispatch<React.SetStateAction<{ text: string; isBot: boolean }[]>>
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, setChatMessages }) => {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const lastBotMessage = messages.filter(m => m.isBot).slice(-1)[0]?.text || ''

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent | null) => {
    if (e) e.preventDefault()
    if (!input.trim()) return
    setIsLoading(true)
    onSendMessage(input.trim())
    setInput('')
    setIsLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(null)
    }
  }

  const handleActionButton = (action: string) => {
    setIsLoading(true)
    onSendMessage(action)
    setIsLoading(false)
  }

  const showActionButtons = lastBotMessage.includes('type confirm') || 
                           lastBotMessage.includes('What do you want to do next')

  return (
    <div style={{ ...styles.chatContainer, ...(window.innerWidth <= 768 ? mobileStyles.chatContainer : {}) }}>
      <div style={styles.chatWindow} aria-live="polite" aria-label="Chat messages">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                ...styles.messageBubble,
                ...(msg.isBot ? styles.botMessage : styles.userMessage)
              }}
            >
              {msg.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} style={styles.inputForm} aria-label="Send message form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message"
          style={styles.inputField}
          aria-label="Message input"
          autoComplete="off"
          disabled={isLoading}
        />
        {isLoading ? (
          <div style={{ width: '20px', height: '20px', border: `2px solid ${theme.primary}`, borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} aria-label="Loading" />
        ) : (
          <motion.button
            type="submit"
            style={styles.sendButton}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Send message"
          >
            Send
          </motion.button>
        )}
      </form>
      {showActionButtons && (
        <div style={styles.actionButtons}>
          {lastBotMessage.includes('type confirm') && (
            <>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('confirm')}
                disabled={isLoading}
                aria-label="Confirm"
              >
                Confirm
              </motion.button>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('repeat')}
                disabled={isLoading}
                aria-label="Repeat"
              >
                Repeat
              </motion.button>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('cancel')}
                disabled={isLoading}
                aria-label="Cancel"
              >
                Cancel
              </motion.button>
            </>
          )}
          {lastBotMessage.includes('What do you want to do next') && (
            <>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('finish')}
                disabled={isLoading}
                aria-label="Finish"
              >
                Finish
              </motion.button>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('make another reservation')}
                disabled={isLoading}
                aria-label="Another reservation"
              >
                Another Reservation
              </motion.button>
              <motion.button
                style={styles.actionButton}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleActionButton('search orders')}
                disabled={isLoading}
                aria-label="Search orders"
              >
                Search Orders
              </motion.button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
