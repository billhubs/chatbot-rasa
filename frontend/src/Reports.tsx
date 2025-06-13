import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import ReportsModal from './ReportsModal';

const API_BASE_URL = 'http://localhost:5000';
const ADMIN_PIN = '557755';

const aestheticTheme = {
  background: '#FFFFFF',
  surface: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  shadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
  primary: '#FFD166',
  secondary: '#2D3748',
  accent: '#4A5568',
  textPrimary: '#2D3748',
  textSecondary: '#4A5568',
  font: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

const tabList = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'finished', label: 'Finished' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'financial', label: 'Financial' },
];

interface Reservation {
  reservation_id: string;
  customer_name?: string;
  reservation_timestamp?: string;
  status: string;
  route_origin: string;
  route_destination: string;
  reservation_type: string;
  num_passengers: number;
  travel_date: string;
  pickup_time: string;
  pickup_address: string;
  dropoff_address?: string;
  flight_details?: string;
  notes?: string;
  cancellation_reason?: string;
  price?: number;
  bukti_transfer?: File | null;
}

interface Reports {
  [key: string]: number;
}

interface FinancialReports {
  total_revenue: number;
  revenue_by_status: { [key: string]: number };
  average_booking_value: number;
  total_bookings: number;
}

interface Message {
  text: string;
  type: 'success' | 'error';
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(timeString: string | null | undefined): string {
  if (!timeString) return '-';
  return timeString.substring(0, 5);
}

function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return 'Rp 0';
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function Reports() {
  const [reports, setReports] = useState<Reports>({});
  const [financialReports, setFinancialReports] = useState<FinancialReports | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('pending');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalReservation, setModalReservation] = useState<Reservation | null>(null);
  const [saving, setSaving] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  useEffect(() => {
    fetchReports();
    if (currentTab === 'financial') {
      fetchFinancialReports();
    } else {
      fetchReservations(currentTab);
    }
  }, [currentTab]);

  async function fetchReports(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reports`);
      setReports(await response.json());
    } catch {
      setReports({});
      showMessage('Gagal memuat data laporan.', 'error');
    }
  }

  async function fetchReservations(status: string): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/`);
      const allReservations = await response.json();
      const filtered = allReservations.filter((res: any) => res && res.status && typeof res.status === 'string' && res.status.toLowerCase() === status.toLowerCase());
      setReservations(filtered);
    } catch {
      setReservations([]);
      showMessage(`Gagal memuat reservasi ${status}.`, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchFinancialReports(): Promise<void> {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/financial-reports`);
      if (!response.ok) throw new Error('Gagal memuat laporan keuangan.');
      setFinancialReports(await response.json());
    } catch {
      setFinancialReports(null);
      showMessage('Gagal memuat laporan keuangan.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text: string, type: 'success' | 'error' = 'success'): void {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  }

  function openModal(reservation: Reservation): void {
    setModalReservation({ ...reservation });
    setModalOpen(true);
  }

  function closeModal(): void {
    setModalOpen(false);
    setModalReservation(null);
  }

  async function saveModal(updatedReservation: Reservation, adminPin: string): Promise<void> {
    if (!updatedReservation) return;
    if (adminPin !== ADMIN_PIN) {
      showMessage('PIN admin salah. Simpan dibatalkan.', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      for (const key in updatedReservation) {
        if (key === 'bukti_transfer' && updatedReservation.bukti_transfer instanceof File) {
          formData.append('bukti_transfer', updatedReservation.bukti_transfer);
        } else {
          const value = (updatedReservation as any)[key];
          if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        }
      }
      formData.append('admin_pin', adminPin);

      const response = await fetch(`${API_BASE_URL}/reservations/${updatedReservation.reservation_id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Gagal menyimpan perubahan.');
      showMessage('Perubahan reservasi berhasil disimpan.', 'success');
      closeModal();
      fetchReports();
      fetchReservations(currentTab);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showMessage(`Error: ${error.message}`, 'error');
      } else {
        showMessage('Error tidak diketahui.', 'error');
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: aestheticTheme.background,
      fontFamily: aestheticTheme.font,
      padding: '0 0 4rem 0',
      color: aestheticTheme.textPrimary,
    }}>
      <Helmet>
        <title>Laporan & Reservasi | Kirana Travel</title>
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: 1000,
          margin: '2rem auto',
          background: aestheticTheme.surface,
          backdropFilter: aestheticTheme.backdropFilter,
          borderRadius: '20px',
          boxShadow: aestheticTheme.shadow,
          padding: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: aestheticTheme.secondary }}>
            Laporan & Reservasi
          </h2>
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              background: aestheticTheme.primary,
              border: 'none',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: aestheticTheme.shadow,
            }}
            aria-label="Toggle tab menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={aestheticTheme.secondary} strokeWidth="2">
              <circle cx="12" cy="6" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="18" r="2" />
            </svg>
          </motion.button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                position: 'absolute',
                top: 110,
                right: 40,
                background: aestheticTheme.surface,
                backdropFilter: aestheticTheme.backdropFilter,
                borderRadius: '16px',
                boxShadow: aestheticTheme.shadow,
                padding: '1rem',
                zIndex: 20,
              }}
            >
              {tabList.map(tab => (
                <motion.button
                  key={tab.key}
                  onClick={() => {
                    setCurrentTab(tab.key);
                    setIsMenuOpen(false);
                  }}
                  whileHover={{ backgroundColor: 'rgba(255, 209, 102, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: currentTab === tab.key ? aestheticTheme.secondary : aestheticTheme.textSecondary,
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label} {tab.key !== 'financial' ? `(${reports[`${tab.key}_count`] || 0})` : ''}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginBottom: '1.5rem',
                padding: '1rem 1.5rem',
                borderRadius: '16px',
                background: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
                color: message.type === 'error' ? '#B91C1C' : '#065F46',
                fontWeight: 600,
                boxShadow: aestheticTheme.shadow,
              }}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {currentTab === 'financial' ? (
          <div style={{ padding: '1rem' }}>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  minHeight: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: aestheticTheme.primary,
                  fontWeight: 600,
                  fontSize: '1.25rem',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: `4px solid ${aestheticTheme.primary}`,
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    marginRight: '1rem',
                  }}
                />
                <span>Loading...</span>
              </motion.div>
            ) : financialReports ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: aestheticTheme.surface,
                    backdropFilter: aestheticTheme.backdropFilter,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: aestheticTheme.shadow,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: aestheticTheme.secondary, marginBottom: '0.5rem' }}>
                    Total Pendapatan
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: aestheticTheme.textPrimary }}>
                    {formatCurrency(financialReports.total_revenue)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: aestheticTheme.surface,
                    backdropFilter: aestheticTheme.backdropFilter,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: aestheticTheme.shadow,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: aestheticTheme.secondary, marginBottom: '0.5rem' }}>
                    Rata-rata Nilai Booking
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: aestheticTheme.textPrimary }}>
                    {formatCurrency(financialReports.average_booking_value)}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: aestheticTheme.surface,
                    backdropFilter: aestheticTheme.backdropFilter,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: aestheticTheme.shadow,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: aestheticTheme.secondary, marginBottom: '0.5rem' }}>
                    Total Booking
                  </h3>
                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: aestheticTheme.textPrimary }}>
                    {financialReports.total_bookings}
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    background: aestheticTheme.surface,
                    backdropFilter: aestheticTheme.backdropFilter,
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: aestheticTheme.shadow,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: aestheticTheme.secondary, marginBottom: '0.75rem' }}>
                    Pendapatan per Status
                  </h3>
                  {Object.entries(financialReports.revenue_by_status).map(([status, revenue]) => (
                    <p key={status} style={{ fontSize: '0.95rem', color: aestheticTheme.textSecondary, marginBottom: '0.5rem' }}>
                      <b>{status.charAt(0).toUpperCase() + status.slice(1)}:</b> {formatCurrency(revenue)}
                    </p>
                  ))}
                </motion.div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: aestheticTheme.textSecondary, textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem' }}
              >
                Tidak ada data keuangan tersedia.
              </motion.div>
            )}
          </div>
        ) : (
          <div ref={listRef} style={{
            maxHeight: '600px',
            overflowY: 'auto',
            paddingRight: '0.5rem',
            transition: 'all 0.3s ease',
          }}>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  minHeight: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: aestheticTheme.primary,
                  fontWeight: 600,
                  fontSize: '1.25rem',
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{
                    width: '32px',
                    height: '32px',
                    border: `4px solid ${aestheticTheme.primary}`,
                    borderTop: '4px solid transparent',
                    borderRadius: '50%',
                    marginRight: '1rem',
                  }}
                />
                <span>Loading...</span>
              </motion.div>
            ) : (
              reservations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: aestheticTheme.textSecondary, textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem' }}
                >
                  Tidak ada reservasi pada tab ini.
                </motion.div>
              ) : (
                <AnimatePresence>
                  {reservations.map(res => (
                    <motion.div
                      key={res.reservation_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        background: aestheticTheme.surface,
                        backdropFilter: aestheticTheme.backdropFilter,
                        borderRadius: '16px',
                        boxShadow: aestheticTheme.shadow,
                        marginBottom: '1.5rem',
                        padding: '1.5rem',
                        border: `1px solid ${aestheticTheme.primary}20`,
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontWeight: 700, color: aestheticTheme.textPrimary, fontSize: '1.25rem' }}>
                            #{res.reservation_id} - {res.customer_name || 'N/A'}
                          </span>
                        <span style={{ fontSize: '0.9rem', color: aestheticTheme.textSecondary }}>
                          {formatDate(res.reservation_timestamp?.split('T')[0])}, {formatTime(res.reservation_timestamp?.split('T')[1])}
                        </span>
                        <span style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          color: res.status === 'cancelled' ? '#EF4444' : aestheticTheme.primary,
                          background: res.status === 'cancelled' ? 'rgba(239, 68, 68, 0.1)' : `rgba(255, 209, 102, 0.1)`,
                          borderRadius: '10px',
                          padding: '0.25rem 1rem',
                        }}>
                          {res.status.charAt(0).toUpperCase() + res.status.slice(1)}
                        </span>
                      </div>
                      <div style={{ color: aestheticTheme.textSecondary, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        <b>Rute:</b> {res.route_origin} - {res.route_destination} | <b>Tipe:</b> {res.reservation_type} | <b>Penumpang:</b> {res.num_passengers}
                      </div>
                      <div style={{ color: aestheticTheme.textSecondary, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        <b>Tgl Jalan:</b> {formatDate(res.travel_date)} | <b>Jam Jemput:</b> {formatTime(res.pickup_time)}
                      </div>
                      <div style={{ color: aestheticTheme.textSecondary, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                        <b>Jemput:</b> {res.pickup_address}
                        {res.dropoff_address && <> | <b>Antar:</b> {res.dropoff_address}</>}
                      </div>
                      {res.flight_details && (
                        <div style={{ color: aestheticTheme.textSecondary, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                          <b>Flight:</b> {res.flight_details}
                        </div>
                      )}
                      {res.notes && (
                        <div style={{ color: aestheticTheme.textSecondary, fontSize: '0.9rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                          <b>Notes:</b> {res.notes}
                        </div>
                      )}
                      {res.cancellation_reason && (
                        <div style={{ color: '#EF4444', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                          <b>Alasan Batal:</b> {res.cancellation_reason}
                        </div>
                      )}
                      {res.price !== undefined && (
                        <div style={{ color: aestheticTheme.primary, fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          <b>Harga:</b> {formatCurrency(res.price)}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <motion.button
                          style={{
                            padding: '0.75rem 1.5rem',
                            background: aestheticTheme.primary,
                            color: aestheticTheme.secondary,
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: aestheticTheme.shadow,
                          }}
                          whileHover={{ background: '#F7C948', scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openModal(res)}
                          aria-label={`View details for reservation ${res.reservation_id}`}
                        >
                          Lihat Detail
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )
            )}
          </div>
        )}
      </motion.div>
      <ReportsModal
        reservation={modalReservation}
        onClose={closeModal}
        onSave={saveModal}
        saving={saving}
      />
    </div>
  );
}
