"use client";

/**
 * فروشگاهٔ سمت‌کلاینت دمو: نشان‌شده‌ها، لیست مقایسه، حساب کاربری و آگهی‌های ثبت‌شده.
 * همه در localStorage نگه داشته می‌شوند تا بین صفحات و بعد از رفرش باقی بمانند.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const K_SAVED = "molkai:saved";
const K_COMPARE = "molkai:compare";
const K_USER = "molkai:user";
const K_LISTINGS = "molkai:listings";

export const COMPARE_LIMIT = 4;

export type DemoUser = { name: string; phone: string; role: "buyer" | "owner" | "manager"; since: string };
export type DraftListing = Record<string, unknown> & { id: string; createdAt: string; status: string };

type Store = {
  ready: boolean;
  saved: number[];
  compare: number[];
  user: DemoUser | null;
  listings: DraftListing[];
  toggleSaved: (id: number) => void;
  isSaved: (id: number) => boolean;
  toggleCompare: (id: number) => { ok: boolean; reason?: string };
  inCompare: (id: number) => boolean;
  clearCompare: () => void;
  signIn: (u: DemoUser) => void;
  signOut: () => void;
  addListing: (l: Omit<DraftListing, "id" | "createdAt" | "status">) => DraftListing;
};

const Ctx = createContext<Store | null>(null);

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* حالت خصوصی مرورگر — بی‌صدا رد شو */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [listings, setListings] = useState<DraftListing[]>([]);

  // بعد از mount می‌خوانیم تا رندر سرور و کلاینت یکی بماند
  useEffect(() => {
    setSaved(read<number[]>(K_SAVED, []));
    setCompare(read<number[]>(K_COMPARE, []));
    setUser(read<DemoUser | null>(K_USER, null));
    setListings(read<DraftListing[]>(K_LISTINGS, []));
    setReady(true);
  }, []);

  // همگام‌سازی بین تب‌ها
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === K_SAVED) setSaved(read<number[]>(K_SAVED, []));
      if (e.key === K_COMPARE) setCompare(read<number[]>(K_COMPARE, []));
      if (e.key === K_USER) setUser(read<DemoUser | null>(K_USER, null));
      if (e.key === K_LISTINGS) setListings(read<DraftListing[]>(K_LISTINGS, []));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => { if (ready) write(K_SAVED, saved); }, [ready, saved]);
  useEffect(() => { if (ready) write(K_COMPARE, compare); }, [ready, compare]);
  useEffect(() => { if (ready) write(K_USER, user); }, [ready, user]);
  useEffect(() => { if (ready) write(K_LISTINGS, listings); }, [ready, listings]);

  const toggleSaved = useCallback((id: number) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]));
  }, []);

  // از مقدار فعلی state تصمیم می‌گیریم تا updater خالص بماند و نتیجه را همان لحظه برگردانیم
  const toggleCompare = useCallback(
    (id: number) => {
      if (compare.includes(id)) {
        setCompare(compare.filter((x) => x !== id));
        return { ok: true };
      }
      if (compare.length >= COMPARE_LIMIT) {
        return { ok: false, reason: `حداکثر ${COMPARE_LIMIT} ملک را می‌توانید هم‌زمان مقایسه کنید.` };
      }
      setCompare([...compare, id]);
      return { ok: true };
    },
    [compare],
  );

  const clearCompare = useCallback(() => setCompare([]), []);

  const signIn = useCallback((u: DemoUser) => setUser(u), []);
  const signOut = useCallback(() => setUser(null), []);

  const addListing = useCallback((l: Omit<DraftListing, "id" | "createdAt" | "status">) => {
    const item: DraftListing = {
      ...l,
      id: `L-${Math.floor(Date.now() / 1000)}`,
      createdAt: new Date().toISOString(),
      status: "در انتظار بازبینی",
    };
    setListings((prev) => [item, ...prev]);
    return item;
  }, []);

  const value = useMemo<Store>(
    () => ({
      ready, saved, compare, user, listings,
      toggleSaved,
      isSaved: (id) => saved.includes(id),
      toggleCompare,
      inCompare: (id) => compare.includes(id),
      clearCompare, signIn, signOut, addListing,
    }),
    [ready, saved, compare, user, listings, toggleSaved, toggleCompare, clearCompare, signIn, signOut, addListing],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore باید داخل <StoreProvider> استفاده شود");
  return ctx;
}
