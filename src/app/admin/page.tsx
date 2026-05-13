"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, Clock, Users, FileText, Flag,
  Search, ChevronRight, Eye, AlertTriangle, MapPin, Shield,
  Camera, CreditCard, ScanFace, Loader2, LogOut, X, Ban,
  ShieldCheck, ShieldOff,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TABS = ["Dashboard", "Ad Queue", "CNIC Queue", "Users", "Reports", "Location Requests", "Blocked Users"];

type PendingAd = {
  id: number;
  title: string;
  price: number;
  city: string | null;
  created_at: string;
  ownership_proof_url: string | null;
  ad_photos: { url: string; order_index: number }[];
  users: { full_name: string | null; cnic_verified: boolean } | null;
};

type CnicUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  cnic_front_url: string | null;
  cnic_back_url: string | null;
  selfie_url: string | null;
  created_at: string;
  cnic_front_signed?: string | null;
  cnic_back_signed?: string | null;
  selfie_signed?: string | null;
};

type BlockedUser = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  ban_reason: string | null;
  banned_at: string | null;
  cnic_front_signed: string | null;
  cnic_back_signed: string | null;
  selfie_signed: string | null;
};

type Report = {
  id: number;
  reason: string;
  status: string;
  created_at: string;
  ads: { title: string } | null;
};

type AdminUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
  is_admin: boolean;
  cnic_verified: boolean;
  banned: boolean;
};

type UserDetail = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
  is_admin: boolean;
  cnic_verified: boolean;
  cnic_front_url: string | null;
  cnic_back_url: string | null;
  selfie_url: string | null;
  cnic_front_signed: string | null;
  cnic_back_signed: string | null;
  selfie_signed: string | null;
  banned: boolean;
  ban_reason: string | null;
  banned_at: string | null;
  ad_count: number;
};

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [cnicQueue, setCnicQueue] = useState<CnicUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [showBanInput, setShowBanInput] = useState(false);
  const [rejectingAdId, setRejectingAdId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const supabase = createClient();
      const [adsRes, repsRes, countRes, usersRes, cnicsRes, blockedRes] = await Promise.allSettled([
        fetch("/api/admin/ads-queue").then(r => r.json()),
        supabase.from("reports").select("id, reason, status, created_at, ads(title)").eq("status", "open").order("created_at", { ascending: false }),
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("users").select("id, full_name, phone, city, created_at, is_admin, cnic_verified, banned").order("created_at", { ascending: false }).limit(50),
        fetch("/api/admin/cnic-queue").then(r => r.json()),
        fetch("/api/admin/blocked-users").then(r => r.json()),
      ]);

      if (adsRes.status === "fulfilled") setPendingAds(Array.isArray(adsRes.value) ? adsRes.value : []);
      if (cnicsRes.status === "fulfilled") setCnicQueue(Array.isArray(cnicsRes.value) ? cnicsRes.value : []);
      if (blockedRes.status === "fulfilled") setBlockedUsers(Array.isArray(blockedRes.value) ? blockedRes.value : []);
      if (repsRes.status === "fulfilled") setReports((repsRes.value.data as unknown as Report[]) ?? []);
      if (countRes.status === "fulfilled") setTotalUsers(countRes.value.count ?? 0);
      if (usersRes.status === "fulfilled") setAdminUsers((usersRes.value.data as AdminUser[]) ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function approveAd(id: number) {
    setActioning(`ad-${id}`);
    const res = await fetch("/api/admin/ads-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: id, action: "approve" }),
    });
    if (res.ok) setPendingAds(prev => prev.filter(a => a.id !== id));
    setActioning(null);
  }

  async function rejectAd(id: number) {
    setActioning(`ad-rej-${id}`);
    const res = await fetch("/api/admin/ads-queue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adId: id, action: "reject", rejectionReason: rejectReason || null }),
    });
    if (res.ok) {
      setPendingAds(prev => prev.filter(a => a.id !== id));
      setRejectingAdId(null);
      setRejectReason("");
    }
    setActioning(null);
  }

  async function doUserAction(userId: string, action: "verify" | "reject" | "ban") {
    setActioning(`${action}-${userId}`);
    const res = await fetch("/api/admin/verify-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action, banReason: action === "ban" ? banReason : undefined }),
    });
    if (!res.ok) { setActioning(null); return; }

    if (action === "verify") {
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, cnic_verified: true } : u));
      setCnicQueue(prev => prev.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(d => d ? { ...d, cnic_verified: true } : d);
    } else if (action === "reject") {
      setCnicQueue(prev => prev.filter(u => u.id !== userId));
      if (selectedUser?.id === userId) setSelectedUser(d => d ? { ...d, cnic_front_url: null, cnic_back_url: null, selfie_url: null, cnic_front_signed: null, cnic_back_signed: null, selfie_signed: null } : d);
    } else if (action === "ban") {
      setAdminUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: true } : u));
      if (selectedUser?.id === userId) setSelectedUser(d => d ? { ...d, banned: true } : d);
      setShowBanInput(false);
      setBanReason("");
    }
    setActioning(null);
  }

  async function dismissReport(id: number) {
    const supabase = createClient();
    await supabase.from("reports").update({ status: "dismissed" }).eq("id", id);
    setReports(prev => prev.filter(r => r.id !== id));
  }

  async function loadUserDetail(userId: string) {
    setLoadingDetail(true);
    setShowBanInput(false);
    setBanReason("");
    const res = await fetch(`/api/admin/user-detail?userId=${userId}`);
    const data = await res.json();
    setSelectedUser(data as UserDetail);
    setLoadingDetail(false);
  }

  async function logout() {
    sessionStorage.removeItem("sellz_admin_auth");
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const filteredUsers = adminUsers.filter(u =>
    !userSearch || (u.full_name ?? "").toLowerCase().includes(userSearch.toLowerCase()) || (u.phone ?? "").includes(userSearch)
  );

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F0F0EE]">
        <Loader2 size={28} strokeWidth={2} className="animate-spin" style={{ color: "var(--brand-green)" }} />
      </div>
    );
  }

  return (
    <>
    <div className="min-h-dvh flex flex-col bg-[#F0F0EE]">
      <header className="bg-[#1a1a1a] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-bold text-sm">sellz.pk</span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-xs font-medium">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-xs font-bold">A</div>
            <span className="text-xs text-white/60">Admin</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
          >
            <LogOut size={14} strokeWidth={2} />
            Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-52 bg-white border-r border-[var(--border)] py-4">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between ${
                activeTab === tab
                  ? "text-[var(--brand-green)] bg-[var(--brand-green-light)] border-r-2 border-[var(--brand-green)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"
              }`}
            >
              {tab}
              {tab === "Ad Queue" && pendingAds.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[var(--brand-green)] text-white text-[10px] font-bold flex items-center justify-center">
                  {pendingAds.length}
                </span>
              )}
              {tab === "CNIC Queue" && cnicQueue.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {cnicQueue.length}
                </span>
              )}
              {tab === "Blocked Users" && blockedUsers.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {blockedUsers.length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden overflow-x-auto no-scrollbar border-b border-[var(--border)] bg-white w-full fixed top-[44px] z-10">
          <div className="flex gap-0 w-max">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab ? "border-[var(--brand-green)] text-[var(--brand-green)]" : "border-transparent text-[var(--text-secondary)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-auto mt-10 md:mt-0">
          {activeTab === "Dashboard" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-6">Dashboard</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FileText size={20} strokeWidth={2} />} value={pendingAds.length} label="Pending Ads" color="green" />
                <StatCard icon={<Shield size={20} strokeWidth={2} />} value={cnicQueue.length} label="CNIC Verifications" color="blue" />
                <StatCard icon={<Flag size={20} strokeWidth={2} />} value={reports.length} label="Active Reports" color="red" />
                <StatCard icon={<Users size={20} strokeWidth={2} />} value={totalUsers} label="Total Users" color="gray" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Ad Submissions</h3>
                    <button onClick={() => setActiveTab("Ad Queue")} className="text-xs text-[var(--brand-green)] font-medium">View all</button>
                  </div>
                  {pendingAds.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-4 text-center">No pending ads</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingAds.slice(0, 3).map(ad => (
                        <div key={ad.id} className="flex items-center gap-3">
                          <Clock size={14} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[var(--text-primary)] truncate">{ad.title}</p>
                            <p className="text-[11px] text-[var(--text-muted)]">{ad.users?.full_name ?? "Unknown"} · {relTime(ad.created_at)}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Reports</h3>
                    <button onClick={() => setActiveTab("Reports")} className="text-xs text-[var(--brand-green)] font-medium">View all</button>
                  </div>
                  {reports.length === 0 ? (
                    <p className="text-xs text-[var(--text-muted)] py-4 text-center">No active reports</p>
                  ) : (
                    <div className="space-y-3">
                      {reports.slice(0, 3).map(r => (
                        <div key={r.id} className="flex items-start gap-3">
                          <AlertTriangle size={14} strokeWidth={2} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-[var(--text-primary)]">{r.ads?.title ?? "Ad"}: {r.reason}</p>
                            <p className="text-[11px] text-[var(--text-muted)]">{relTime(r.created_at)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Ad Queue" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Ad Approval Queue</h1>
                <span className="text-sm text-[var(--text-muted)]">{pendingAds.length} pending</span>
              </div>
              {pendingAds.length === 0 ? (
                <div className="card p-8 text-center">
                  <CheckCircle size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--brand-green)]" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">All caught up!</p>
                  <p className="text-xs text-[var(--text-muted)]">No ads pending review</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingAds.map(ad => {
                    const isApprov = actioning === `ad-${ad.id}`;
                    const isRejecting = rejectingAdId === ad.id;
                    const isConfirmingReject = actioning === `ad-rej-${ad.id}`;
                    const sortedPhotos = [...ad.ad_photos].sort((a, b) => a.order_index - b.order_index);
                    return (
                      <div key={ad.id} className="card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{ad.title}</p>
                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                              <span className="flex items-center gap-1">
                                {ad.users?.cnic_verified && <ShieldCheck size={11} style={{ color: "var(--brand-green)" }} />}
                                {ad.users?.full_name ?? "Unknown"}
                              </span>
                              {ad.city && <span className="flex items-center gap-1"><MapPin size={11} />{ad.city}</span>}
                              <span className="flex items-center gap-1"><Clock size={11} />{relTime(ad.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[var(--text-primary)] whitespace-nowrap">
                            Rs {ad.price >= 100000 ? `${(ad.price / 100000).toFixed(1)}L` : `${(ad.price / 1000).toFixed(0)}k`}
                          </p>
                        </div>

                        {/* Ownership proof — prominent */}
                        {ad.ownership_proof_url && (
                          <div className="mb-3">
                            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1.5">Ownership Proof</p>
                            <img
                              src={ad.ownership_proof_url}
                              alt="Ownership proof"
                              onClick={() => setLightboxUrl(ad.ownership_proof_url!)}
                              className="w-full rounded-lg cursor-zoom-in"
                              style={{ maxHeight: 200, objectFit: "cover" }}
                            />
                          </div>
                        )}

                        {/* Ad photos */}
                        {sortedPhotos.length > 0 && (
                          <div className="mb-3">
                            <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">
                              <Camera size={10} className="inline mr-1" />{sortedPhotos.length} photos
                            </p>
                            <div className="flex gap-2 overflow-x-auto">
                              {sortedPhotos.slice(0, 5).map((p, i) => (
                                <img
                                  key={i}
                                  src={p.url}
                                  alt=""
                                  onClick={() => setLightboxUrl(p.url)}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 cursor-zoom-in"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {!ad.ownership_proof_url && (
                          <div className="mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-100">
                            <p className="text-xs text-amber-700">⚠️ No ownership proof submitted</p>
                          </div>
                        )}

                        {isRejecting ? (
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Rejection reason (optional)"
                              value={rejectReason}
                              onChange={e => setRejectReason(e.target.value)}
                              className="input-base text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => { setRejectingAdId(null); setRejectReason(""); }}
                                className="flex-1 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)]"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => rejectAd(ad.id)}
                                disabled={isConfirmingReject}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold disabled:opacity-50"
                              >
                                {isConfirmingReject ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} strokeWidth={2} />}
                                Confirm Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => approveAd(ad.id)}
                              disabled={!!actioning}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors disabled:opacity-50"
                            >
                              {isApprov ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} strokeWidth={2} />} Approve
                            </button>
                            <button
                              onClick={() => setRejectingAdId(ad.id)}
                              disabled={!!actioning}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                            >
                              <XCircle size={15} strokeWidth={2} /> Reject
                            </button>
                            <button onClick={() => setLightboxUrl(sortedPhotos[0]?.url ?? null)} className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg)]">
                              <Eye size={15} strokeWidth={2} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "CNIC Queue" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">CNIC Verification Queue</h1>
                <span className="text-sm text-[var(--text-muted)]">{cnicQueue.length} pending</span>
              </div>
              {cnicQueue.length === 0 ? (
                <div className="card p-8 text-center">
                  <Shield size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--brand-green)]" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Queue empty</p>
                  <p className="text-xs text-[var(--text-muted)]">No CNICs pending verification</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cnicQueue.map(item => {
                    const verifying = actioning === `verify-${item.id}`;
                    const rejecting = actioning === `reject-${item.id}`;
                    return (
                      <div key={item.id} className="card p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-blue-500">
                            {(item.full_name ?? "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{item.full_name ?? "Unknown"}</p>
                            <p className="text-xs text-[var(--text-muted)]">{item.phone ?? "—"} · {item.city ?? "—"} · {relTime(item.created_at)}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          {[
                            { label: "CNIC Front", url: item.cnic_front_signed, icon: <CreditCard size={20} strokeWidth={1.5} /> },
                            { label: "CNIC Back", url: item.cnic_back_signed, icon: <CreditCard size={20} strokeWidth={1.5} /> },
                            { label: "Selfie", url: item.selfie_signed, icon: <ScanFace size={20} strokeWidth={1.5} /> },
                          ].map(({ label, url, icon }) => (
                            <div
                              key={label}
                              onClick={() => url && setLightboxUrl(url)}
                              className="relative rounded-lg border border-[var(--border)] overflow-hidden flex flex-col items-center justify-center gap-1"
                              style={{ height: 120, background: "var(--bg)", cursor: url ? "pointer" : "default" }}
                            >
                              {url ? (
                                <>
                                  <img src={url} alt={label} className="w-full h-full object-cover"
                                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).innerHTML = `<span style="color:#999;font-size:11px;padding:8px;text-align:center">${label}<br/>Load error</span>`; }}
                                  />
                                  <span className="absolute bottom-1 right-1 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">expand</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-[var(--text-muted)]">{icon}</span>
                                  <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                                </>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => doUserAction(item.id, "verify")}
                            disabled={verifying || rejecting}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors disabled:opacity-50"
                          >
                            {verifying ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} strokeWidth={2} />} Verify
                          </button>
                          <button
                            onClick={() => doUserAction(item.id, "reject")}
                            disabled={verifying || rejecting}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {rejecting ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} strokeWidth={2} />} Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "Users" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">User Management</h1>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[var(--border)] rounded-lg px-3 py-2.5">
                  <Search size={16} strokeWidth={2} className="text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm"
                  />
                </div>
              </div>
              <div className="card overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] text-center py-8">No users found</p>
                ) : (
                  filteredUsers.map((user, i) => (
                    <button
                      key={user.id}
                      onClick={() => loadUserDetail(user.id)}
                      className={`w-full flex items-center gap-3 p-4 hover:bg-[var(--bg)] transition-colors text-left ${i > 0 ? "border-t border-[var(--border)]" : ""}`}
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ background: user.banned ? "#dc2626" : user.is_admin ? "#7c3aed" : "var(--brand-green)" }}>
                        {(user.full_name ?? "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{user.full_name ?? "—"}</p>
                        <p className="text-xs text-[var(--text-muted)]">{user.phone ?? "—"} · {user.city ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {user.banned && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Banned</span>}
                        {user.cnic_verified && !user.banned && <ShieldCheck size={14} strokeWidth={2} style={{ color: "var(--brand-green)" }} />}
                        {user.is_admin && !user.banned && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">Admin</span>}
                        <ChevronRight size={16} strokeWidth={2} className="text-[var(--text-muted)]" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "Reports" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">Reports Queue</h1>
              {reports.length === 0 ? (
                <div className="card p-8 text-center">
                  <Flag size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--text-muted)]" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">No active reports</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reports.map(r => (
                    <div key={r.id} className="card p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-amber-50">
                          <AlertTriangle size={16} strokeWidth={2} className="text-amber-500" />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs text-[var(--text-muted)]">{relTime(r.created_at)}</span>
                          <p className="text-sm text-[var(--text-primary)] mb-1">{r.ads?.title ?? "Ad"}: {r.reason}</p>
                        </div>
                        <button onClick={() => dismissReport(r.id)} className="px-3 py-1.5 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-xs font-semibold">
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "Location Requests" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">Location Change Requests</h1>
              <div className="card p-8 text-center">
                <MapPin size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--text-muted)]" />
                <p className="text-sm font-semibold text-[var(--text-primary)]">No pending requests</p>
              </div>
            </div>
          )}

          {activeTab === "Blocked Users" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Blocked Users</h1>
                <span className="text-sm text-[var(--text-muted)]">{blockedUsers.length} blocked</span>
              </div>
              {blockedUsers.length === 0 ? (
                <div className="card p-8 text-center">
                  <Ban size={32} strokeWidth={1.5} className="mx-auto mb-3 text-[var(--text-muted)]" />
                  <p className="text-sm font-semibold text-[var(--text-primary)]">No blocked users</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blockedUsers.map(user => (
                    <div key={user.id} className="card p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {(user.full_name ?? "U")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <p className="text-sm font-bold text-[var(--text-primary)]">{user.full_name ?? "Unknown"}</p>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">BANNED</span>
                          </div>
                          {user.email && <p className="text-xs text-[var(--text-muted)]">{user.email}</p>}
                          <p className="text-xs text-[var(--text-muted)]">{user.phone ?? "No phone"} · {user.city ?? "—"}</p>
                          {user.banned_at && (
                            <p className="text-xs text-[var(--text-muted)]">Banned {relTime(user.banned_at)}</p>
                          )}
                        </div>
                      </div>

                      {user.ban_reason && (
                        <div className="mb-4 px-3 py-2.5 rounded-lg bg-red-50 border border-red-100">
                          <p className="text-[10px] font-semibold text-red-700 uppercase tracking-wide mb-0.5">Ban Reason</p>
                          <p className="text-xs text-red-600">{user.ban_reason}</p>
                        </div>
                      )}

                      <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-2">Submitted Documents</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "CNIC Front", url: user.cnic_front_signed, icon: <CreditCard size={18} strokeWidth={1.5} /> },
                          { label: "CNIC Back", url: user.cnic_back_signed, icon: <CreditCard size={18} strokeWidth={1.5} /> },
                          { label: "Selfie", url: user.selfie_signed, icon: <ScanFace size={18} strokeWidth={1.5} /> },
                        ].map(({ label, url, icon }) => (
                          <div
                            key={label}
                            onClick={() => url && setLightboxUrl(url)}
                            className="relative rounded-lg border border-[var(--border)] overflow-hidden flex flex-col items-center justify-center gap-1"
                            style={{ height: 110, background: "var(--bg)", cursor: url ? "pointer" : "default" }}
                          >
                            {url ? (
                              <>
                                <img src={url} alt={label} className="w-full h-full object-cover"
                                  onError={(e) => { (e.currentTarget.parentElement as HTMLElement).innerHTML = `<span style="color:#999;font-size:11px;padding:8px;text-align:center">${label}<br/>Load error</span>`; }}
                                />
                                <span className="absolute bottom-1 right-1 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">{label}</span>
                              </>
                            ) : (
                              <>
                                <span className="text-[var(--text-muted)]">{icon}</span>
                                <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                                <span className="text-[9px] text-[var(--text-muted)]">Not submitted</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>

    {/* Lightbox */}
    {lightboxUrl && (
      <div onClick={() => setLightboxUrl(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
        <img src={lightboxUrl} alt="Document" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8, boxShadow: "0 4px 40px rgba(0,0,0,0.6)" }} />
        <button onClick={() => setLightboxUrl(null)} style={{ position: "absolute", top: 20, right: 20, background: "white", border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>
      </div>
    )}

    {/* User detail modal */}
    {(selectedUser || loadingDetail) && (
      <div onClick={() => { setSelectedUser(null); setShowBanInput(false); setBanReason(""); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <div onClick={e => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-2xl overflow-hidden" style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
            <h2 className="text-base font-bold text-[var(--text-primary)]">User Detail</h2>
            <button onClick={() => { setSelectedUser(null); setShowBanInput(false); setBanReason(""); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg)]">
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>

          {loadingDetail ? (
            <div className="flex-1 flex items-center justify-center py-16">
              <Loader2 size={28} className="animate-spin" style={{ color: "var(--brand-green)" }} />
            </div>
          ) : selectedUser && (
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: selectedUser.banned ? "#dc2626" : selectedUser.is_admin ? "#7c3aed" : "var(--brand-green)" }}>
                  {(selectedUser.full_name ?? "U")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-bold text-[var(--text-primary)]">{selectedUser.full_name ?? "Unknown"}</p>
                    {selectedUser.cnic_verified && <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--brand-green-light)] text-[var(--brand-green)]"><ShieldCheck size={10} /> Verified</span>}
                    {selectedUser.banned && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">Banned</span>}
                    {selectedUser.is_admin && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">Admin</span>}
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{selectedUser.phone ?? "—"} · {selectedUser.city ?? "—"}</p>
                  <p className="text-xs text-[var(--text-muted)]">{selectedUser.ad_count} ads · Joined {new Date(selectedUser.created_at).toLocaleDateString("en-PK", { month: "short", year: "numeric" })}</p>
                </div>
              </div>

              {selectedUser.banned && selectedUser.ban_reason && (
                <div className="rounded-lg bg-red-50 border border-red-100 p-3">
                  <p className="text-xs font-semibold text-red-700 mb-0.5">Ban reason</p>
                  <p className="text-xs text-red-600">{selectedUser.ban_reason}</p>
                </div>
              )}

              {(selectedUser.cnic_front_signed || selectedUser.cnic_back_signed || selectedUser.selfie_signed) && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2 uppercase tracking-wide">CNIC Documents</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Front", url: selectedUser.cnic_front_signed, icon: <CreditCard size={18} strokeWidth={1.5} /> },
                      { label: "Back", url: selectedUser.cnic_back_signed, icon: <CreditCard size={18} strokeWidth={1.5} /> },
                      { label: "Selfie", url: selectedUser.selfie_signed, icon: <ScanFace size={18} strokeWidth={1.5} /> },
                    ].map(({ label, url, icon }) => (
                      <div key={label} onClick={() => url && setLightboxUrl(url)} className="relative rounded-lg border border-[var(--border)] overflow-hidden flex items-center justify-center" style={{ height: 100, background: "var(--bg)", cursor: url ? "pointer" : "default" }}>
                        {url ? (
                          <><img src={url} alt={label} className="w-full h-full object-cover" /><span className="absolute bottom-1 right-1 text-[10px] text-white bg-black/50 px-1 py-0.5 rounded">{label}</span></>
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-[var(--text-muted)]">{icon}<span className="text-[10px]">{label}</span></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedUser.cnic_front_signed && !selectedUser.cnic_back_signed && !selectedUser.selfie_signed && (
                <div className="rounded-lg bg-[var(--bg)] border border-[var(--border)] p-4 flex items-center gap-3">
                  <ShieldOff size={20} className="text-[var(--text-muted)]" />
                  <p className="text-xs text-[var(--text-muted)]">No CNIC documents submitted</p>
                </div>
              )}

              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                {!selectedUser.cnic_verified && (selectedUser.cnic_front_signed || selectedUser.cnic_back_signed) && (
                  <div className="flex gap-2">
                    <button onClick={() => doUserAction(selectedUser.id, "verify")} disabled={!!actioning}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors disabled:opacity-50">
                      {actioning === `verify-${selectedUser.id}` ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} strokeWidth={2} />} Verify CNIC
                    </button>
                    <button onClick={() => doUserAction(selectedUser.id, "reject")} disabled={!!actioning}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50">
                      <XCircle size={15} strokeWidth={2} /> Reject CNIC
                    </button>
                  </div>
                )}
                {!selectedUser.banned && (
                  showBanInput ? (
                    <div className="space-y-2">
                      <input type="text" placeholder="Ban reason (required)" value={banReason} onChange={e => setBanReason(e.target.value)} className="input-base text-sm" autoFocus />
                      <div className="flex gap-2">
                        <button onClick={() => { setShowBanInput(false); setBanReason(""); }} className="flex-1 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text-secondary)]">Cancel</button>
                        <button onClick={() => doUserAction(selectedUser.id, "ban")} disabled={!banReason.trim() || !!actioning}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
                          {actioning === `ban-${selectedUser.id}` ? <Loader2 size={15} className="animate-spin" /> : <Ban size={15} strokeWidth={2} />} Confirm Ban
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowBanInput(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                      <Ban size={15} strokeWidth={2} /> Ban User
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  const colors: Record<string, string> = { green: "var(--brand-green-light)", blue: "#eff6ff", red: "#fef2f2", gray: "var(--bg)" };
  const textColors: Record<string, string> = { green: "var(--brand-green)", blue: "#3b82f6", red: "#e53e3e", gray: "var(--text-primary)" };
  return (
    <div className="card p-4">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: colors[color], color: textColors[color] }}>{icon}</div>
      <p className="text-2xl font-black text-[var(--text-primary)] mb-0.5" style={{ letterSpacing: "-0.5px" }}>{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
