"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight, Award, Backpack, CalendarDays, Check, ChevronDown, CircleHelp,
  Coins, Compass, Crown, Download, Heart, Map as MapIcon, MapPin, Menu, Minus,
  Plus, Search, Settings, ShoppingBag, Sparkles, Star, UserRound, Users, Wallet,
  X, Clock3, Trees, Utensils, Landmark, Coffee, Route, Footprints, Car, Shirt,
  RotateCcw, MessageCircle, Send, Trophy, LockKeyhole, SlidersHorizontal, Bookmark
} from "lucide-react";

const LeafletMapView = dynamic(() => import("../components/LeafletMapView"), {
  ssr: false,
  loading: () => <div className="map-canvas map-loading">Memuat peta perjalanan...</div>,
});

type Place = {
  id: number; day?: number; name: string; category: string; area: string; time: string;
  duration: string; price: number; rating: string; color: string; icon: string;
  description: string; mode: string;
};
type AvatarItem = { id: string; name: string; type: string; price: number; emoji: string; color: string };
type AvatarState = { name: string; gender: "Laki-laki" | "Perempuan"; owned: string[]; equipped: Record<string, string> };

const cities = [
  "Ambon", "Balikpapan", "Banda Aceh", "Bandar Lampung", "Bandung", "Banjarbaru", "Banjarmasin", "Banyuwangi", "Batam", "Batu", "Bekasi", "Bengkulu", "Bogor", "Bukittinggi", "Cilegon", "Cirebon", "Denpasar", "Depok", "Garut", "Gili Trawangan", "Gorontalo", "Jakarta", "Jambi", "Jayapura", "Jember", "Kediri", "Kendari", "Kupang", "Labuan Bajo", "Lhokseumawe", "Madiun", "Magelang", "Makassar", "Malang", "Manado", "Mataram", "Medan", "Padang", "Palangka Raya", "Palembang", "Palu", "Pangandaran", "Pekanbaru", "Pontianak", "Probolinggo", "Purwokerto", "Purworejo", "Salatiga", "Samarinda", "Semarang", "Serang", "Sibolga", "Solo", "Sorong", "Sukabumi", "Surabaya", "Surakarta", "Tasikmalaya", "Tegal", "Ternate", "Ubud", "Yogyakarta", "Wakatobi"
];
const defaultPlaces: Place[] = [
  { id: 1, day: 1, name: "Keraton Yogyakarta", category: "Budaya", area: "Kraton", time: "08:30", duration: "90 menit", price: 15000, rating: "Perlu verifikasi", color: "sand", icon: "landmark", description: "Mulai perjalanan dengan mengenal sejarah dan budaya Kesultanan Yogyakarta.", mode: "Mobil / ride-hailing" },
  { id: 2, day: 1, name: "Taman Sari", category: "Sejarah", area: "Patehan", time: "10:30", duration: "75 menit", price: 15000, rating: "Perlu verifikasi", color: "sage", icon: "trees", description: "Jelajahi kompleks taman kerajaan dengan lorong dan arsitektur yang khas.", mode: "Jalan kaki" },
  { id: 3, day: 1, name: "Makan siang kuliner lokal", category: "Kuliner", area: "Prawirotaman", time: "12:15", duration: "60 menit", price: 35000, rating: "Perlu verifikasi", color: "terracotta", icon: "utensils", description: "Istirahat dan coba makanan khas daerah.", mode: "Mobil / ride-hailing" },
  { id: 4, day: 2, name: "Museum Sonobudoyo", category: "Sejarah", area: "Ngupasan", time: "09:00", duration: "75 menit", price: 10000, rating: "Perlu verifikasi", color: "blue", icon: "landmark", description: "Kenali koleksi sejarah, seni, dan budaya Jawa.", mode: "Mobil / ride-hailing" },
  { id: 5, day: 2, name: "Pasar Beringharjo", category: "Belanja", area: "Malioboro", time: "11:00", duration: "75 menit", price: 0, rating: "Perlu verifikasi", color: "sand", icon: "coffee", description: "Cari batik, jajanan, dan oleh-oleh lokal.", mode: "Jalan kaki" },
  { id: 6, day: 3, name: "Hutan Pinus Mangunan", category: "Alam", area: "Dlingo", time: "08:00", duration: "120 menit", price: 15000, rating: "Perlu verifikasi", color: "sage", icon: "trees", description: "Nikmati udara segar dan pemandangan perbukitan.", mode: "Mobil / ride-hailing" },
];
const avatarItems: AvatarItem[] = [
  { id: "basic-shirt", name: "Kaos mint", type: "Atasan", price: 0, emoji: "👕", color: "#b7e4d1" },
  { id: "sunset-hoodie", name: "Hoodie sunset", type: "Atasan", price: 80, emoji: "🧥", color: "#f2a779" },
  { id: "explorer-jacket", name: "Jaket explorer", type: "Atasan", price: 120, emoji: "🥼", color: "#8eb9d6" },
  { id: "denim-pants", name: "Celana denim", type: "Bawahan", price: 0, emoji: "👖", color: "#8da9c4" },
  { id: "cargo-pants", name: "Celana cargo", type: "Bawahan", price: 70, emoji: "🩳", color: "#b8bd8b" },
  { id: "curly-hair", name: "Rambut ikal", type: "Rambut", price: 60, emoji: "🦱", color: "#554338" },
  { id: "long-hair", name: "Rambut panjang", type: "Rambut", price: 60, emoji: "💇‍♀️", color: "#554338" },
  { id: "bucket-hat", name: "Bucket hat", type: "Aksesori", price: 45, emoji: "👒", color: "#e7c76d" },
  { id: "round-glasses", name: "Kacamata bulat", type: "Aksesori", price: 35, emoji: "🤓", color: "#6e8c82" },
  { id: "traveler-pack", name: "Tas traveler", type: "Aksesori", price: 90, emoji: "🎒", color: "#d88b64" },
];
const categories = ["Semua", "Budaya", "Kuliner", "Alam", "Sejarah", "Belanja", "Tempat ibadah"];
const navItems = [
  { id: "overview", label: "Beranda", icon: Compass },
  { id: "plan", label: "Rencana perjalanan", icon: Sparkles },
  { id: "map", label: "Peta perjalanan", icon: MapIcon },
  { id: "explore", label: "Jelajahi tempat", icon: Search },
  { id: "saved", label: "Perjalanan tersimpan", icon: Bookmark },
  { id: "avatar", label: "Karakter saya", icon: UserRound },
  { id: "achievements", label: "Achievement", icon: Trophy },
  { id: "settings", label: "Pengaturan", icon: Settings },
];
function rupiah(value: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value); }
function PlaceIcon({ name }: { name: string }) {
  if (name === "trees") return <Trees size={19} />;
  if (name === "utensils") return <Utensils size={19} />;
  if (name === "coffee") return <Coffee size={19} />;
  if (name === "map") return <MapIcon size={19} />;
  return <Landmark size={19} />;
}
function AvatarPreview({ avatar, size = "large" }: { avatar: AvatarState; size?: "small" | "large" }) {
  const hair = avatar.equipped.hair ? avatarItems.find((item) => item.id === avatar.equipped.hair)?.emoji : avatar.gender === "Perempuan" ? "💇‍♀️" : "🦱";
  const top = avatar.equipped.top ? avatarItems.find((item) => item.id === avatar.equipped.top) : avatarItems[0];
  const bottom = avatar.equipped.bottom ? avatarItems.find((item) => item.id === avatar.equipped.bottom) : avatarItems[3];
  const accessory = avatar.equipped.accessory ? avatarItems.find((item) => item.id === avatar.equipped.accessory) : null;
  return <div className={`avatar-preview ${size}`} aria-label={`Karakter ${avatar.name}`}><div className="avatar-spark spark-one">✦</div><div className="avatar-hair">{hair}</div>{accessory && <div className="avatar-accessory">{accessory.emoji}</div>}<div className="avatar-face">{avatar.gender === "Perempuan" ? "👧🏻" : "👦🏻"}</div><div className="avatar-top" style={{ background: top?.color || "#b7e4d1" }} /><div className="avatar-bottom" style={{ background: bottom?.color || "#8da9c4" }} /><div className="avatar-shoes">👟</div><div className="avatar-spark spark-two">✦</div></div>;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [days, setDays] = useState(3);
  const [travelers, setTravelers] = useState(2);
  const [budgetTier, setBudgetTier] = useState("Standar");
  const [travelPace, setTravelPace] = useState("Seimbang");
  const [budget, setBudget] = useState("1500000");
  const [budgetScope, setBudgetScope] = useState(["tickets", "food", "local_transport"]);
  const [interests, setInterests] = useState(["Budaya", "Kuliner"]);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");
  const [activeDay, setActiveDay] = useState(1);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [showSetup, setShowSetup] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<number | null>(null);
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");
  const [profileName, setProfileName] = useState("Traveler");
  const [coins, setCoins] = useState(120);
  const [visited, setVisited] = useState<number[]>([]);
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<AvatarState>({ name: "Mochi", gender: "Laki-laki", owned: ["basic-shirt", "denim-pants"], equipped: { top: "basic-shirt", bottom: "denim-pants" } });
  const [shopFilter, setShopFilter] = useState("Semua");
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [askingAI, setAskingAI] = useState(false);
  const [savedTrips, setSavedTrips] = useState<string[]>([]);
  const [settings, setSettings] = useState({ compact: false, notifications: true, currency: "IDR" });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("jelajah-profile-v1");
      if (stored) {
        const data = JSON.parse(stored);
        if (data.profileName) setProfileName(data.profileName);
        if (Number.isFinite(data.coins)) setCoins(data.coins);
        if (Array.isArray(data.visited)) setVisited(data.visited);
        if (Array.isArray(data.claimedAchievements)) setClaimedAchievements(data.claimedAchievements);
        if (data.avatar) setAvatar(data.avatar);
        if (Array.isArray(data.savedTrips)) setSavedTrips(data.savedTrips);
        if (data.settings) setSettings((prev) => ({ ...prev, ...data.settings }));
      }
    } catch { /* Ignore invalid local profile data. */ }
    finally { setHydrated(true); }
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem("jelajah-profile-v1", JSON.stringify({ profileName, coins, visited, claimedAchievements, avatar, savedTrips, settings })); } catch { /* Storage may be disabled. */ }
  }, [hydrated, profileName, coins, visited, claimedAchievements, avatar, savedTrips, settings]);

  const mapPlaces = useMemo(() => itinerary.filter((place) => (place.day ?? 1) === activeDay), [itinerary, activeDay]);
  const visiblePlaces = useMemo(() => mapPlaces.filter((place) => activeCategory === "Semua" || place.category === activeCategory), [mapPlaces, activeCategory]);
  const suggestions = useMemo(() => cities.filter((item) => item.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 8), [citySearch]);
  const estimate = useMemo(() => {
    const perDay = (budgetScope.includes("tickets") ? 40000 : 0) + (budgetScope.includes("food") ? 120000 : 0) + (budgetScope.includes("local_transport") ? 65000 : 0) + (budgetScope.includes("accommodation") ? 250000 : 0) + (budgetScope.includes("intercity_transport") ? 100000 : 0);
    return perDay * days * travelers;
  }, [budgetScope, days, travelers]);
  const achievements = [
    { id: "first", title: "Langkah Pertama", desc: "Tandai destinasi pertama sebagai dikunjungi.", goal: 1, progress: visited.length, reward: 20, icon: "🧭" },
    { id: "five", title: "Penjelajah Aktif", desc: "Kunjungi 5 destinasi berbeda.", goal: 5, progress: visited.length, reward: 50, icon: "🥾" },
    { id: "cities", title: "Pemburu Kota", desc: "Buat itinerary di 3 kota berbeda.", goal: 3, progress: new Set(savedTrips).size, reward: 75, icon: "🏙️" },
    { id: "collector", title: "Kolektor Gaya", desc: "Miliki 5 item avatar.", goal: 5, progress: avatar.owned.length, reward: 40, icon: "✨" },
  ];
  const toggleChoice = (value: string, setter: (fn: (prev: string[]) => string[]) => void) => setter((prev) => prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]);
  const selectCity = (value: string) => { setCity(value); setCitySearch(value); };
  const navigate = (id: string) => { setActiveNav(id); setMobileMenu(false); if (id === "plan") setShowSetup(true); else if (id !== "overview") setShowSetup(false); if (id === "map") setNotice("Peta menampilkan destinasi pada hari yang sedang dipilih."); };

  const generate = async () => {
    const normalizedCity = cities.find((item) => item.toLowerCase() === citySearch.trim().toLowerCase());
    if (!normalizedCity) { setNotice("Pilih kota atau destinasi Indonesia dari daftar pencarian agar lokasi lebih akurat."); return; }
    setCity(normalizedCity);
    setIsGenerating(true); setNotice("");
    try {
      const response = await fetch("/api/itinerary", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ city: normalizedCity, days, travelers, budgetTier, budget: Number(budget) || 0, budgetScope, interests, travelPace, startTime, endTime }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Gagal membuat itinerary.");
      if (!Array.isArray(payload.itinerary) || !payload.itinerary.length) throw new Error("AI belum mengembalikan itinerary. Coba lagi.");
      setItinerary(payload.itinerary as Place[]); setActiveDay(1); setActiveCategory("Semua"); setSelectedPlace(payload.itinerary[0]?.id ?? null); setShowSetup(false); setActiveNav("overview");
      setNotice(`Itinerary AI untuk ${normalizedCity} berhasil dibuat. Harga dan jam operasional perlu diverifikasi.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Terjadi kesalahan saat menghubungi AI."); }
    finally { setIsGenerating(false); }
  };

  const saveTrip = () => {
    if (!savedTrips.includes(city)) { setSavedTrips((prev) => [...prev, city]); setCoins((prev) => prev + 10); setNotice(`Perjalanan ${city} disimpan! Kamu mendapat 10 koin demo.`); }
    else setNotice(`${city} sudah ada di perjalanan tersimpan.`);
  };
  const markVisited = (place: Place) => {
    if (visited.includes(place.id)) return;
    setVisited((prev) => [...prev, place.id]); setCoins((prev) => prev + 10);
    setNotice(`Mantap! ${place.name} ditandai dikunjungi. +10 koin demo.`);
  };
  const exportTrip = () => {
    const content = [`JELAJAH — ITINERARY ${city.toUpperCase()}`, `${days} hari · ${travelers} orang · Budget ${budgetTier}`, `Aktivitas: ${startTime}–${endTime}`, "", ...Array.from({ length: days }, (_, i) => [`HARI ${i + 1}`, ...itinerary.filter((p) => (p.day ?? 1) === i + 1).map((p) => `${p.time} | ${p.name} | ${p.duration} | ${rupiah(p.price)} (estimasi)`), ""].join("\n")), "Catatan: verifikasi harga, jam buka, dan rute sebelum berangkat."].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = `jelajah-${city.toLowerCase().replaceAll(" ", "-")}.txt`; a.click(); URL.revokeObjectURL(url); setNotice("Itinerary berhasil diekspor sebagai file TXT.");
  };
  const askAI = async () => {
    if (!assistantQuestion.trim()) return;
    setAskingAI(true); setAssistantAnswer("");
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: assistantQuestion.trim(), city, itinerary: itinerary.filter((p) => (p.day ?? 1) === activeDay).map((p) => p.name) }) });
      const payload = await response.json(); if (!response.ok) throw new Error(payload.error || "AI belum bisa menjawab."); setAssistantAnswer(payload.answer || "Belum ada jawaban.");
    } catch (error) { setAssistantAnswer(error instanceof Error ? error.message : "Gagal menghubungi AI."); }
    finally { setAskingAI(false); }
  };
  const buyOrEquip = (item: AvatarItem) => {
    if (avatar.owned.includes(item.id)) {
      const slot = item.type === "Atasan" ? "top" : item.type === "Bawahan" ? "bottom" : item.type === "Rambut" ? "hair" : "accessory";
      setAvatar((prev) => ({ ...prev, equipped: { ...prev.equipped, [slot]: item.id } })); setNotice(`${item.name} dipakai oleh ${avatar.name}.`); return;
    }
    if (coins < item.price) { setNotice(`Koin belum cukup. Kamu butuh ${item.price - coins} koin lagi.`); return; }
    const slot = item.type === "Atasan" ? "top" : item.type === "Bawahan" ? "bottom" : item.type === "Rambut" ? "hair" : "accessory";
    setCoins((prev) => prev - item.price); setAvatar((prev) => ({ ...prev, owned: [...prev.owned, item.id], equipped: { ...prev.equipped, [slot]: item.id } })); setNotice(`${item.name} berhasil dibeli dan langsung dipakai!`);
  };

  return <main className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${settings.compact ? "compact-mode" : ""}`}>
    {mobileMenu && <button className="mobile-scrim" aria-label="Tutup menu" onClick={() => setMobileMenu(false)} />}
    <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Compass size={22}/></div>{!sidebarCollapsed && <div><div className="brand-name">jelajah<span>.</span></div><div className="brand-caption">AI TRAVEL COMPANION</div></div>}<button className="icon-button mobile-close" onClick={() => setMobileMenu(false)} aria-label="Tutup menu"><X size={18}/></button></div>
      {!sidebarCollapsed && <div className="sidebar-label">RUANG PERJALANAN</div>}
      <nav className="nav-list">{navItems.map(({ id, label, icon: Icon }) => <button key={id} title={sidebarCollapsed ? label : undefined} className={`nav-item ${activeNav === id ? "active" : ""}`} onClick={() => navigate(id)}><Icon size={18}/>{!sidebarCollapsed && <span>{label}</span>}{id === "avatar" && !sidebarCollapsed && <span className="nav-badge">NEW</span>}</button>)}</nav>
      {!sidebarCollapsed && <div className="sidebar-coin"><div className="coin-icon"><Coins size={17}/></div><div><strong>{coins} koin</strong><span>Saldo petualangan</span></div><button onClick={() => navigate("achievements")} aria-label="Lihat pencapaian"><ArrowRight size={16}/></button></div>}
      <div className="sidebar-bottom"><div className="sidebar-profile"><div className="profile-mini">{profileName.slice(0, 1).toUpperCase()}</div>{!sidebarCollapsed && <div className="profile-copy"><strong>{profileName}</strong><span>Traveler level {Math.floor(visited.length / 3) + 1}</span></div>}<button className="profile-settings" onClick={() => navigate("settings")} aria-label="Pengaturan profil"><Settings size={16}/></button></div><button className="collapse-sidebar" onClick={() => setSidebarCollapsed((prev) => !prev)}><ChevronDown size={16} className={sidebarCollapsed ? "rotate-side" : ""}/>{!sidebarCollapsed && "Sembunyikan menu"}</button></div>
    </aside>

    <section className="main-area"><header className="topbar"><div className="topbar-left"><button className="icon-button mobile-menu" onClick={() => setMobileMenu(true)} aria-label="Buka menu"><Menu size={20}/></button><button className="icon-button desktop-menu" onClick={() => setSidebarCollapsed((prev) => !prev)} aria-label="Sembunyikan/tampilkan menu"><Menu size={19}/></button><div className="breadcrumb">Jelajah <span>/</span> <strong>{navItems.find((item) => item.id === activeNav)?.label || "Beranda"}</strong></div></div><div className="topbar-actions"><div className="coin-pill"><Coins size={15}/>{coins}</div><button className="icon-button" aria-label="Bantuan" onClick={() => setNotice("Pilih kota Indonesia, atur preferensi, lalu generate itinerary dengan AI.")}><CircleHelp size={18}/></button><button className="user-avatar" onClick={() => navigate("settings")}>{profileName.slice(0, 1).toUpperCase()}</button></div></header>

    <div className="content-wrap">
      <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line"/> TRAVEL MORE, WORRY LESS</div><h1>{activeNav === "avatar" ? <>Karakter <em>perjalananmu.</em></> : activeNav === "achievements" ? <>Setiap perjalanan punya <em>cerita.</em></> : activeNav === "settings" ? <>Atur pengalaman <em>terbaikmu.</em></> : activeNav === "map" ? <>Jelajahi lewat <em>peta.</em></> : <>Petualangan dimulai <em>di sini.</em></>}</h1><p className="heading-description">Rencanakan perjalanan Indonesia, kumpulkan koin, dan buat karakter unikmu.</p></div><div className="heading-actions"><button className="button button-secondary" onClick={exportTrip}><Download size={16}/> Ekspor</button><button className="button button-primary" onClick={() => { setShowSetup((prev) => !prev); setActiveNav("plan"); }}><Plus size={17}/> Rencanakan trip</button></div></div>
      {notice && <div className="notice"><Sparkles size={17}/><span>{notice}</span><button onClick={() => setNotice("")} aria-label="Tutup pemberitahuan"><X size={15}/></button></div>}

      {activeNav === "settings" ? <section className="feature-panel settings-panel"><div className="section-heading"><div><span className="section-kicker">PREFERENSI AKUN</span><h2>Pengaturan pengguna</h2></div><Settings size={22}/></div><div className="settings-form"><label className="field"><span>Nama pengguna</span><input value={profileName} onChange={(e) => setProfileName(e.target.value.slice(0, 32))} placeholder="Nama kamu" maxLength={32}/></label><label className="field"><span>Mata uang</span><select value={settings.currency} onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value }))}><option value="IDR">Rupiah (IDR)</option></select></label><label className="setting-toggle"><span><strong>Tampilan ringkas</strong><small>Kurangi jarak antar elemen agar lebih banyak konten terlihat.</small></span><input type="checkbox" checked={settings.compact} onChange={(e) => setSettings((prev) => ({ ...prev, compact: e.target.checked }))}/></label><label className="setting-toggle"><span><strong>Notifikasi pencapaian</strong><small>Tampilkan pemberitahuan saat mendapat koin atau achievement.</small></span><input type="checkbox" checked={settings.notifications} onChange={(e) => setSettings((prev) => ({ ...prev, notifications: e.target.checked }))}/></label><div className="settings-note"><LockKeyhole size={18}/><span>Profil, saldo demo, item karakter, dan perjalanan tersimpan disimpan di browser perangkat ini. Belum disinkronkan ke akun cloud.</span></div><button className="button button-secondary" onClick={() => { setProfileName("Traveler"); setCoins(120); setVisited([]); setClaimedAchievements([]); setSavedTrips([]); setAvatar({ name: "Mochi", gender: "Laki-laki", owned: ["basic-shirt", "denim-pants"], equipped: { top: "basic-shirt", bottom: "denim-pants" } }); setSettings({ compact: false, notifications: true, currency: "IDR" }); setNotice("Profil demo berhasil direset."); }}><RotateCcw size={15}/> Reset data lokal</button></div></section>
      : activeNav === "explore" ? <section className="feature-panel explore-panel"><div className="section-heading"><div><span className="section-kicker">DESTINASI INDONESIA</span><h2>Kota untuk petualangan berikutnya</h2></div><MapPin size={22}/></div><div className="explore-search"><Search size={17}/><input value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Cari kota di Indonesia..." list="explore-cities"/><datalist id="explore-cities">{cities.map((item) => <option key={item} value={item}/>)}</datalist></div><div className="explore-city-grid">{cities.filter((item) => item.toLowerCase().includes(citySearch.toLowerCase())).slice(0, 30).map((item, index) => <button className="explore-city-card" key={item} onClick={() => { selectCity(item); setShowSetup(true); setActiveNav("plan"); }}><span className={`city-art city-art-${index % 5}`}>{["🏞️", "🏙️", "🌋", "🏝️", "🍃"][index % 5]}</span><span><strong>{item}</strong><small>Indonesia · Rancang trip</small></span><ArrowRight size={15}/></button>)}</div><p className="explore-footnote">Pilih kota untuk mengisi tujuan perjalanan. Destinasi rekomendasi selanjutnya akan dibuat oleh AI.</p></section>
      : activeNav === "saved" ? <section className="feature-panel saved-panel"><div className="section-heading"><div><span className="section-kicker">KOLEKSI PRIBADI</span><h2>Perjalanan tersimpan</h2></div><Bookmark size={22}/></div>{savedTrips.length ? <div className="saved-city-list">{savedTrips.map((item) => <article className="saved-city-row" key={item}><div className="saved-city-icon"><MapPin size={19}/></div><div><strong>{item}</strong><span>Tujuan tersimpan di perangkat ini</span></div><button className="button button-secondary" onClick={() => { selectCity(item); setShowSetup(true); setActiveNav("plan"); }}>Buat itinerary <ArrowRight size={14}/></button></article>)}</div> : <div className="empty-state"><Bookmark size={24}/><strong>Belum ada perjalanan tersimpan</strong><p>Simpan kota favorit dari ringkasan perjalanan dengan menekan ikon hati.</p><button className="button button-primary" onClick={() => { setActiveNav("plan"); setShowSetup(true); }}>Rencanakan perjalanan</button></div>}<div className="settings-note"><CircleHelp size={16}/><span>Versi demo menyimpan daftar kota pada browser ini. Rute AI lengkap belum disimpan di cloud.</span></div></section>
      : activeNav === "avatar" ? <div className="avatar-layout"><section className="avatar-stage feature-panel"><div className="section-heading"><div><span className="section-kicker">AVATAR STUDIO</span><h2>Kenalan dengan karaktermu</h2></div><span className="level-pill"><Crown size={14}/> Level {Math.floor(visited.length / 3) + 1}</span></div><div className="avatar-stage-art"><AvatarPreview avatar={avatar}/><div className="avatar-speech">Siap menjelajah! <span>✦</span></div></div><div className="avatar-editor"><label className="field"><span>Nama karakter</span><input value={avatar.name} onChange={(e) => setAvatar((prev) => ({ ...prev, name: e.target.value.slice(0, 20) }))} maxLength={20} placeholder="Nama karakter"/></label><div className="field"><span>Gender karakter</span><div className="gender-switch"><button className={avatar.gender === "Laki-laki" ? "selected" : ""} onClick={() => setAvatar((prev) => ({ ...prev, gender: "Laki-laki" }))}>👦 Laki-laki</button><button className={avatar.gender === "Perempuan" ? "selected" : ""} onClick={() => setAvatar((prev) => ({ ...prev, gender: "Perempuan" }))}>👧 Perempuan</button></div></div></div><div className="equipped-row"><span>Item dipakai</span>{avatar.owned.filter((id) => Object.values(avatar.equipped).includes(id)).map((id) => <span className="equipped-chip" key={id}>{avatarItems.find((item) => item.id === id)?.emoji} {avatarItems.find((item) => item.id === id)?.name}</span>)}</div></section><section className="feature-panel shop-panel"><div className="section-heading"><div><span className="section-kicker">JELAJAH SHOP</span><h2>Item karakter</h2></div><div className="coin-pill"><Coins size={15}/>{coins}</div></div><div className="shop-filters">{["Semua", "Atasan", "Bawahan", "Rambut", "Aksesori"].map((filter) => <button key={filter} className={shopFilter === filter ? "selected" : ""} onClick={() => setShopFilter(filter)}>{filter}</button>)}</div><div className="shop-grid">{avatarItems.filter((item) => shopFilter === "Semua" || item.type === shopFilter).map((item) => { const owned = avatar.owned.includes(item.id); const equipped = Object.values(avatar.equipped).includes(item.id); return <article className="shop-item" key={item.id}><div className="shop-item-art" style={{ background: `${item.color}44` }}>{item.emoji}</div><strong>{item.name}</strong><span>{item.type}</span><button className={`shop-buy ${equipped ? "equipped" : ""}`} onClick={() => buyOrEquip(item)}>{equipped ? <><Check size={13}/> Dipakai</> : owned ? "Pakai item" : <><Coins size={13}/>{item.price === 0 ? "Gratis" : item.price}</>}</button></article>; })}</div></section></div>
      : activeNav === "achievements" ? <section className="feature-panel achievements-panel"><div className="section-heading"><div><span className="section-kicker">MILESTONES</span><h2>Pencapaian petualangan</h2></div><div className="coin-pill"><Coins size={15}/>{coins} koin</div></div><div className="achievement-hero"><div className="achievement-medal">🏆</div><div><span>TRAVELER LEVEL {Math.floor(visited.length / 3) + 1}</span><h3>Terus jelajahi tempat baru!</h3><p>Tandai tempat sebagai dikunjungi untuk mengumpulkan koin dan membuka gaya karakter.</p></div><div className="achievement-stats"><strong>{visited.length}</strong><span>tempat dikunjungi</span></div></div><div className="achievement-grid">{achievements.map((item) => { const complete = item.progress >= item.goal; return <article className={`achievement-card ${complete ? "achievement-complete" : ""}`} key={item.id}><div className="achievement-icon">{item.icon}</div><div className="achievement-copy"><h3>{item.title}</h3><p>{item.desc}</p><div className="progress-track"><span style={{ width: `${Math.min(100, item.progress / item.goal * 100)}%` }}/></div><small>{Math.min(item.progress, item.goal)} / {item.goal}</small></div><button className={`achievement-reward ${claimedAchievements.includes(item.id) ? "reward-claimed" : ""}`} disabled={!complete || claimedAchievements.includes(item.id)} onClick={() => { setCoins((prev) => prev + item.reward); setClaimedAchievements((prev) => [...prev, item.id]); setNotice(`Achievement ${item.title} berhasil diklaim: +${item.reward} koin!`); }}><Coins size={13}/>{claimedAchievements.includes(item.id) ? "Diklaim" : complete ? `Klaim ${item.reward}` : `+${item.reward}`}</button>{complete && <span className="achievement-check"><Check size={14}/></span>}</article>; })}</div><div className="achievement-footnote"><CircleHelp size={16}/> Pencapaian dan koin saat ini masih demo lokal. Sinkronisasi lintas perangkat membutuhkan database dan akun pengguna.</div></section>
      : <>
        {showSetup && <section className="setup-panel"><div className="section-heading"><div><span className="section-kicker">TRIP BUILDER</span><h2>Rancang perjalananmu</h2></div><button className="icon-button" onClick={() => { setShowSetup(false); setActiveNav("overview"); }} aria-label="Tutup form"><X size={18}/></button></div><div className="form-grid"><div className="field field-wide city-field"><span><MapPin size={15}/> Cari kota / destinasi di Indonesia</span><div className="city-input-wrap"><Search size={16}/><input list="indonesia-cities" value={citySearch} onChange={(e) => setCitySearch(e.target.value)} placeholder="Cari kota, misalnya Purwokerto" autoComplete="off"/><datalist id="indonesia-cities">{cities.map((c) => <option key={c} value={c}/>)}</datalist><button onClick={() => { const match = cities.find((c) => c.toLowerCase() === citySearch.trim().toLowerCase()); if (match) selectCity(match); else setNotice("Pilih salah satu kota Indonesia dari daftar saran."); }} aria-label="Pilih kota"><Check size={16}/></button></div>{citySearch && suggestions.length > 0 && citySearch.toLowerCase() !== city.toLowerCase() && <div className="city-suggestions">{suggestions.slice(0, 5).map((item) => <button key={item} onClick={() => selectCity(item)}><MapPin size={14}/>{item}<ArrowRight size={13}/></button>)}</div>}<small>Pencarian kota dibatasi ke daftar destinasi Indonesia yang tersedia.</small></div><label className="field"><span><CalendarDays size={15}/> Durasi</span><select value={days} onChange={(e) => setDays(Number(e.target.value))}>{[1,2,3,4,5].map((d) => <option key={d} value={d}>{d} hari</option>)}</select></label><div className="field"><span><Users size={15}/> Jumlah orang</span><div className="stepper"><button onClick={() => setTravelers(Math.max(1, travelers - 1))} aria-label="Kurangi orang"><Minus size={14}/></button><strong>{travelers} orang</strong><button onClick={() => setTravelers(Math.min(30, travelers + 1))} aria-label="Tambah orang"><Plus size={14}/></button></div></div><label className="field"><span><Clock3 size={15}/> Mulai aktivitas</span><input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)}/></label><label className="field"><span><Clock3 size={15}/> Selesai aktivitas</span><input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)}/></label></div><div className="form-divider"/><div className="form-section-label">TEMPO PERJALANAN</div><div className="choice-row">{["Santai", "Seimbang", "Padat"].map((v) => <button key={v} className={`choice-chip ${travelPace === v ? "selected" : ""}`} onClick={() => setTravelPace(v)}>{v}</button>)}</div><div className="form-section-label">MINAT DESTINASI</div><div className="choice-row">{["Budaya", "Kuliner", "Alam", "Sejarah", "Belanja", "Tempat ibadah"].map((v) => <button key={v} className={`choice-chip ${interests.includes(v) ? "selected" : ""}`} onClick={() => toggleChoice(v, setInterests)}>{interests.includes(v) && <Check size={13}/>} {v}</button>)}</div><div className="form-divider"/><div className="section-heading compact"><div><span className="section-kicker">BUDGET PLANNER</span><h2>Atur anggaran</h2></div></div><div className="budget-tiers">{["Hemat", "Standar", "Premium", "Custom"].map((tier) => <button key={tier} className={`tier-card ${budgetTier === tier ? "tier-active" : ""}`} onClick={() => { setBudgetTier(tier); if (tier === "Hemat") setBudget("750000"); if (tier === "Standar") setBudget("1500000"); if (tier === "Premium") setBudget("3000000"); }}><span>{tier}</span><strong>{tier === "Hemat" ? "≤ Rp750 rb" : tier === "Standar" ? "≤ Rp1,5 jt" : tier === "Premium" ? "≤ Rp3 jt" : "Atur sendiri"}</strong></button>)}</div><label className="field budget-input"><span><Wallet size={15}/> Budget per orang (IDR)</span><input type="number" min="0" value={budget} onChange={(e) => { setBudget(e.target.value); setBudgetTier("Custom"); }}/></label><div className="form-section-label">KOMPONEN BIAYA</div><div className="expense-grid">{[{id:"tickets",label:"Tiket wisata",icon:Landmark},{id:"food",label:"Makanan",icon:Utensils},{id:"local_transport",label:"Transportasi lokal",icon:Car},{id:"accommodation",label:"Penginapan",icon:Backpack},{id:"intercity_transport",label:"Transport antarkota",icon:Route}].map(({id,label,icon:Icon}) => <button key={id} className={`expense-option ${budgetScope.includes(id) ? "expense-selected" : ""}`} onClick={() => toggleChoice(id, setBudgetScope)}><span className="expense-check">{budgetScope.includes(id) && <Check size={12}/>}</span><Icon size={17}/><span>{label}</span></button>)}</div><div className="form-footer"><span><CircleHelp size={15}/> AI membuat saran. Verifikasi harga dan jam operasional sebelum berangkat.</span><button className="button button-primary" onClick={generate} disabled={isGenerating}><Sparkles size={16}/>{isGenerating ? "AI sedang merancang..." : "Buat itinerary"}{!isGenerating && <ArrowRight size={16}/>}</button></div>{isGenerating && <div className="generating-state"><span className="loading-orbit"/><div><strong>AI sedang menyusun rute unik untukmu</strong><p>Memilih destinasi, mengatur waktu, dan menyesuaikan minat. Biasanya perlu beberapa detik.</p></div></div>}</section>}
        <section className="trip-summary"><div className="trip-summary-main"><div className="destination-overline"><MapPin size={14}/> DESTINASI PILIHANMU</div><div className="trip-title-row"><h2>{city}<span>, Indonesia</span></h2><button className="heart-button" onClick={saveTrip} aria-label="Simpan perjalanan"><Heart size={19}/></button></div><div className="trip-meta"><span><CalendarDays size={15}/>{days} hari</span><i/><span><Users size={15}/>{travelers} traveler</span><i/><span><Clock3 size={15}/>{startTime}–{endTime}</span></div><div className="trip-tags"><span className="tag-green"><Sparkles size={12}/>{budgetTier}</span><span className="tag-neutral">AI itinerary</span><span className="tag-neutral">Indonesia</span></div></div><div className="budget-summary"><span className="budget-caption">ESTIMASI KOMPONEN TERPILIH</span><strong>{rupiah(estimate)}</strong><span className="budget-sub">{travelers} orang · {days} hari</span><button onClick={() => { setShowSetup(true); setActiveNav("plan"); }}>Rincian anggaran <ArrowRight size={14}/></button></div></section>
        <div className={`workspace-grid ${activeNav === "map" ? "map-focus" : ""}`}><section className="itinerary-column"><div className="section-heading"><div><span className="section-kicker">PERSONAL ITINERARY</span><h2>Rundown perjalanan</h2></div><button className="text-button" onClick={() => { setActiveCategory("Semua"); setNotice("Semua kategori destinasi ditampilkan untuk hari yang dipilih."); }}>Reset filter <RotateCcw size={14}/></button></div><div className="day-tabs">{Array.from({ length: days }, (_, i) => i + 1).map((day) => <button key={day} className={`day-tab ${activeDay === day ? "day-active" : ""}`} onClick={() => setActiveDay(day)}><span>HARI 0{day}</span><strong>{["Awal petualangan", "Jelajah lokal", "Hari santai", "Eksplorasi", "Penutup trip"][day - 1]}</strong></button>)}</div><div className="category-filters">{categories.map((category) => <button key={category} className={activeCategory === category ? "selected" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="itinerary-list">{visiblePlaces.map((place) => <article className={`itinerary-item ${selectedPlace === place.id ? "item-selected" : ""}`} key={`${activeDay}-${place.id}`}><button className="itinerary-main" onClick={() => setSelectedPlace(place.id)}><div className="time-rail"><span>{place.time}</span><div className="rail-dot"/></div><div className={`place-thumb ${place.color}`}><PlaceIcon name={place.icon}/></div><div className="place-details"><div className="place-category">{place.category}<span>·</span>{place.area || city}</div><h3>{place.name}</h3><p>{place.description}</p><div className="place-meta"><span>◷ {place.duration}</span><span className="place-cost">{place.price ? rupiah(place.price) : "Gratis / cek harga"}</span></div></div><ChevronDown className="item-chevron" size={16}/></button><div className="place-actions"><span><Route size={13}/>{place.mode}</span><button className={visited.includes(place.id) ? "visited-button" : ""} onClick={() => markVisited(place)} disabled={visited.includes(place.id)}>{visited.includes(place.id) ? <><Check size={13}/> Dikunjungi</> : "+10 koin · Tandai dikunjungi"}</button></div></article>)}</div>{visiblePlaces.length === 0 && <div className="empty-state"><Search size={22}/><strong>Belum ada tempat di kategori ini</strong><p>Coba pilih kategori lain atau generate itinerary baru.</p><button className="button button-secondary" onClick={() => setActiveCategory("Semua")}>Tampilkan semua</button></div>}<button className="add-stop" onClick={() => { setAssistantQuestion(`Rekomendasikan satu tempat tambahan di ${city} untuk hari ke-${activeDay}, minat ${interests.join(", ") || "umum"}.`); setAssistantAnswer(""); setNotice("Pertanyaan untuk AI sudah disiapkan. Kirim dari panel Asisten AI di bawah."); }}><Plus size={16}/> Minta rekomendasi tempat</button></section>
        <section className="map-column"><div className="map-header"><div><span className="section-kicker">EXPLORE THE AREA</span><h2>Peta perjalanan</h2></div><button className="map-filter" onClick={() => setActiveNav("map")}><SlidersHorizontal size={15}/> Peta penuh</button></div><LeafletMapView city={city} places={mapPlaces} selectedPlaceId={selectedPlace} onSelectPlace={setSelectedPlace} avatarName={avatar.name} avatarGender={avatar.gender}/><div className="map-legend"><span><i className="legend-dot emerald-dot"/> Destinasi hari {activeDay}</span><span><i className="legend-line"/> Alur kunjungan</span><button onClick={() => window.open(`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${city}, Indonesia`)}`, "_blank", "noopener,noreferrer")}>Buka OpenStreetMap <ArrowRight size={14}/></button></div><div className="route-insight"><div className="insight-icon"><Route size={18}/></div><div><strong>Rute hari ke-{activeDay}</strong><p>Pin lokasi dicari melalui geocoding publik. Posisi dan rute aktual perlu diperiksa kembali sebelum perjalanan.</p></div></div></section></div>
        <section className="lower-panels"><div className="feature-panel budget-card"><div className="section-heading"><div><span className="section-kicker">SMART BUDGET</span><h2>Anggaran perjalanan</h2></div><Wallet size={20}/></div><div className="budget-total"><span>Estimasi seluruh komponen</span><strong>{rupiah(estimate)}</strong><small>Perkiraan demo berdasarkan pilihan biaya.</small></div>{[{id:"tickets",label:"Tiket & aktivitas",value:40000},{id:"food",label:"Makanan & minuman",value:120000},{id:"local_transport",label:"Transportasi lokal",value:65000},{id:"accommodation",label:"Penginapan",value:250000},{id:"intercity_transport",label:"Transport antarkota",value:100000}].filter((item) => budgetScope.includes(item.id)).map((item) => <div className="budget-row" key={item.id}><span>{item.label}</span><strong>{rupiah(item.value * days * travelers)}</strong></div>)}<button className="budget-edit" onClick={() => { setShowSetup(true); setActiveNav("plan"); }}><SlidersHorizontal size={15}/> Ubah anggaran</button></div>
        <div className="feature-panel ai-panel"><div className="section-heading"><div><span className="section-kicker">TANYA JELAJAH AI</span><h2>Ada ide tempat?</h2></div><div className="ai-orb"><Sparkles size={18}/></div></div><p className="ai-intro">Tanya rekomendasi kuliner, tempat ramah keluarga, destinasi gratis, atau tips lokal di {city}. Menggunakan API Gemini yang sama.</p><div className="suggested-questions">{[`Kuliner khas ${city} yang wajib dicoba?`, `Tempat gratis di ${city}?`, `Tips jalan-jalan hemat di ${city}?`].map((q) => <button key={q} onClick={() => setAssistantQuestion(q)}>{q}<ArrowRight size={13}/></button>)}</div><div className="assistant-input"><input value={assistantQuestion} onChange={(e) => setAssistantQuestion(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") void askAI(); }} placeholder="Tanya rekomendasi ke AI..."/><button disabled={askingAI || !assistantQuestion.trim()} onClick={askAI} aria-label="Kirim pertanyaan">{askingAI ? <span className="tiny-spinner"/> : <Send size={16}/>}</button></div>{assistantAnswer && <div className="assistant-answer"><Sparkles size={15}/><p>{assistantAnswer}</p></div>}</div></section>
      </>}
      <footer className="footer"><div className="footer-brand"><Compass size={16}/> jelajah<span>.</span></div><p>Perjalanan Indonesia yang terasa milikmu.</p><span className="footer-version">BETA · LOCAL PROFILE</span></footer>
    </div></section>
  </main>;
}
