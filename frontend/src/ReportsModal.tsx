import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Reservation = {
  reservation_id: string;
  status: string;
  customer_name?: string;
  reservation_timestamp?: string;
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
};

type ReportsModalProps = {
  reservation: Reservation | null;
  onClose: () => void;
  onSave: (updatedReservation: Reservation, adminPin: string) => Promise<void>;
  saving: boolean;
};

const glassmorphism = {
  surface: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(5px)',
  shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  accent: '#3b82f6',
  textPrimary: '#1e293b',
};

const inputStyle: React.CSSProperties = {
  width: 'calc(100% - 20px)',
  padding: '0.75rem 1rem',
  marginBottom: '1rem',
  borderRadius: '10px',
  border: '1px solid #ccc',
  background: 'rgba(255, 255, 255, 0.9)',
  color: glassmorphism.textPrimary,
  fontSize: '1rem',
  outline: 'none',
  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  marginBottom: '0.5rem',
  color: glassmorphism.textPrimary,
  display: 'block',
  fontSize: '0.95rem',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  borderRadius: '10px',
  fontWeight: 600,
  cursor: 'pointer',
  border: 'none',
  userSelect: 'none',
};

const ReportsModal: React.FC<ReportsModalProps> = ({ reservation, onClose, onSave, saving }) => {
  const [localReservation, setLocalReservation] = useState<Reservation>(
    reservation || {
      reservation_id: '',
      status: '',
      customer_name: '',
      reservation_timestamp: '',
      route_origin: '',
      route_destination: '',
      reservation_type: '',
      num_passengers: 1,
      travel_date: '',
      pickup_time: '',
      pickup_address: '',
      dropoff_address: '',
      flight_details: '',
      notes: '',
      cancellation_reason: '',
      price: 0,
    }
  );
  const [adminPin, setAdminPin] = useState<string>('');

  const handleChange = (field: keyof Reservation, value: string | number | undefined) => {
    setLocalReservation({ ...localReservation, [field]: value });
  };

  const handleSave = () => {
    if (!reservation) return;
    onSave(localReservation, adminPin);
  };

  return (
    <AnimatePresence>
      {reservation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            padding: '1rem',
            overflowY: 'auto',
            paddingTop: '3rem',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              background: glassmorphism.surface,
              backdropFilter: glassmorphism.backdropFilter,
              borderRadius: '16px',
              maxWidth: '40vw',
              width: '100%',
              maxHeight: '70vh',
              padding: '1.5rem',
              boxShadow: glassmorphism.shadow,
              position: 'relative',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: '1.5rem', color: glassmorphism.textPrimary, fontWeight: 700, fontSize: '1.5rem' }}>
              Edit Reservasi #{localReservation.reservation_id || ''}
            </h3>

            <label style={labelStyle} htmlFor="customer_name">Nama Penumpang</label>
            <input
              id="customer_name"
              type="text"
              value={localReservation.customer_name || ''}
              onChange={(e) => handleChange('customer_name', e.target.value)}
              style={{ ...inputStyle, marginLeft: 0 }}
              placeholder="Masukkan nama lengkap"
              aria-label="Customer name"
            />

            <label style={labelStyle} htmlFor="num_passengers">Jumlah Penumpang</label>
            <input
              id="num_passengers"
              type="number"
              min={1}
              value={localReservation.num_passengers}
              onChange={(e) => handleChange('num_passengers', Number(e.target.value))}
              style={{ ...inputStyle, marginLeft: 0 }}
              placeholder="Masukkan jumlah penumpang"
              aria-label="Number of passengers"
            />

            <label style={labelStyle} htmlFor="pickup_address">Alamat Jemput</label>
            <textarea
              id="pickup_address"
              value={localReservation.pickup_address}
              onChange={(e) => handleChange('pickup_address', e.target.value)}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginLeft: 0 }}
              placeholder="Masukkan alamat penjemputan"
              aria-label="Pickup address"
            />

            <label style={labelStyle} htmlFor="dropoff_address">Alamat Antar (opsional)</label>
            <textarea
              id="dropoff_address"
              value={localReservation.dropoff_address || ''}
              onChange={(e) => handleChange('dropoff_address', e.target.value)}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginLeft: 0 }}
              placeholder="Masukkan alamat pengantaran"
              aria-label="Dropoff address"
            />

            <label style={labelStyle} htmlFor="notes">Catatan (opsional)</label>
            <textarea
              id="notes"
              value={localReservation.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical', marginLeft: 0 }}
              placeholder="Masukkan catatan tambahan"
              aria-label="Additional notes"
            />

            <label style={labelStyle} htmlFor="status">Status Reservasi</label>
            <select
              id="status"
              value={localReservation.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={{ ...inputStyle, marginLeft: 0 }}
              aria-label="Status Reservasi"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Removed bukti_transfer file input to fix TS error */}

            <label style={labelStyle} htmlFor="admin_pin">PIN Admin (wajib untuk simpan)</label>
            <input
              id="admin_pin"
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              style={{ ...inputStyle, marginLeft: 0 }}
              placeholder="Masukkan PIN admin"
              aria-label="Admin PIN"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <motion.button
                type="button"
                onClick={onClose}
                whileHover={{ backgroundColor: '#f1f5f9' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...buttonStyle,
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: glassmorphism.textPrimary,
                }}
                aria-label="Cancel"
              >
                Batal
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSave}
                disabled={saving || !reservation}
                whileHover={{ backgroundColor: '#2563eb' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  ...buttonStyle,
                  background: glassmorphism.accent,
                  color: '#fff',
                  opacity: saving || !reservation ? 0.7 : 1,
                  cursor: (saving || !reservation) ? 'not-allowed' : 'pointer',
                }}
                aria-label="Save changes"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReportsModal;
