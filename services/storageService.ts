import { Reservation, SiteConfig } from "../types";

const KEYS = {
  AUTH: 'reserve_auth',
  CONFIG: 'reserve_config',
  RESERVATIONS: 'reserve_bookings',
  STATS: 'reserve_stats'
};

const DEFAULT_CONFIG: SiteConfig = {
  name: "Lumière Bistro",
  description: "Experience the finest modern dining in the heart of the city.",
  welcomeMessage: "Book your table for an unforgettable evening.",
  primaryColor: "slate",
  contactPhone: "+1 (555) 000-0000",
  address: "123 Innovation Ave, Tech City"
};

// --- Auth ---
export const getAuthStatus = () => {
  const stored = localStorage.getItem(KEYS.AUTH);
  return !!stored;
};

export const setupAdmin = (username: string, passwordHash: string) => {
  localStorage.setItem(KEYS.AUTH, JSON.stringify({ username, password: passwordHash }));
};

export const verifyLogin = (username: string, passwordHash: string) => {
  const stored = localStorage.getItem(KEYS.AUTH);
  if (!stored) return false;
  const creds = JSON.parse(stored);
  return creds.username === username && creds.password === passwordHash;
};

// --- Config ---
export const getSiteConfig = (): SiteConfig => {
  const stored = localStorage.getItem(KEYS.CONFIG);
  return stored ? JSON.parse(stored) : DEFAULT_CONFIG;
};

export const saveSiteConfig = (config: SiteConfig) => {
  localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
};

// --- Reservations ---
export const getReservations = (): Reservation[] => {
  const stored = localStorage.getItem(KEYS.RESERVATIONS);
  return stored ? JSON.parse(stored) : [];
};

export const addReservation = (booking: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
  const bookings = getReservations();
  const newBooking: Reservation = {
    ...booking,
    id: Date.now().toString(),
    createdAt: Date.now(),
    status: 'PENDING'
  };
  localStorage.setItem(KEYS.RESERVATIONS, JSON.stringify([newBooking, ...bookings]));
  return newBooking;
};

// --- Stats ---
export const incrementVisitorCount = () => {
  const stats = getStats();
  localStorage.setItem(KEYS.STATS, JSON.stringify({ ...stats, visitors: stats.visitors + 1 }));
};

export const getStats = () => {
  const stored = localStorage.getItem(KEYS.STATS);
  return stored ? JSON.parse(stored) : { visitors: 0 };
};