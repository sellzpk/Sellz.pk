"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, XCircle, Clock, Users, FileText, Flag,
  Search, ChevronRight, Eye, AlertTriangle, MapPin, Shield,
  Camera, CreditCard, ScanFace, Loader2, LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const TABS = ["Dashboard", "Ad Queue", "CNIC Queue", "Users", "Reports", "Location Requests"];

type PendingAd = {
  id: number;
  title: string;
  price: number;
  city: string | null;
  created_at: string;
  ad_photos: { url: string }[];
  users: { full_name: string | null } | null;
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
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pendingAds, setPendingAds] = useState<PendingAd[]>([]);
  const [cnicQueue, setCnicQueue] = useState<CnicUser[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [actioning, setActioning] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    setIsAdmin(true);
    const supabase = createClient();

    const [{ data: ads }, { data: reps }, { count }, { data: users }, cnicsRes] = await Promise.all([
      supabase.from("ads").select("id, title, price, city, created_at, ad_photos(url), users(full_name)").eq("status", "pending").order("created_at", { ascending: true }),
      supabase.from("reports").select("id, reason, status, created_at, ads(title)").eq("status", "open").order("created_at", { ascending: false }),
      supabase.from("users").select("id", { count: "exact", head: true }),
      supabase.from("users").select("id, full_name, phone, city, created_at, is_admin").order("created_at", { ascending: false }).limit(50),
      fetch("/api/admin/cnic-queue").then(r => r.json()),
    ]);

    setPendingAds((ads as unknown as PendingAd[]) ?? []);
    setCnicQueue(Array.isArray(cnicsRes) ? cnicsRes : []);
    setReports((reps as unknown as Report[]) ?? []);
    setTotalUsers(count ?? 0);
    setAdminUsers((users as AdminUser[]) ?? []);
    setLoading(false);
  }

  async function approveAd(id: number) {
    setActioning(`ad-${id}`);
    const supabase = createClient();
    await supabase.from("ads").update({ status: "active" }).eq("id", id);
    setPendingAds(prev => prev.filter(a => a.id !== id));
    setActioning(null);
  }

  async function rejectAd(id: number) {
    setActioning(`ad-rej-${id}`);
    const supabase = createClient();
    await supabase.from("ads").update({ status: "rejected" }).eq("id", id);
    setPendingAds(prev => prev.filter(a => a.id !== id));
    setActioning(null);
  }

  async function approveCnic(id: string) {
    setActioning(`cnic-${id}`);
    const supabase = createClient();
    await supabase.from("users").update({ cnic_verified: true }).eq("id", id);
    setCnicQueue(prev => prev.filter(u => u.id !== id));
    setActioning(null);
  }

  async function rejectCnic(id: string) {
    setCnicQueue(prev => prev.filter(u => u.id !== id));
  }

  async function dismissReport(id: number) {
    const supabase = createClient();
    await supabase.from("reports").update({ status: "dismissed" }).eq("id", id);
    setReports(prev => prev.filter(r => r.id !== id));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  useEffect(() => {
    if (isAdmin === false) router.replace("/admin/login");
  }, [isAdmin, router]);

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

  if (isAdmin === false) return null;

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
                    const isActioning = actioning === `ad-${ad.id}` || actioning === `ad-rej-${ad.id}`;
                    return (
                      <div key={ad.id} className="card p-4">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{ad.title}</p>
                            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                              <span>{ad.users?.full_name ?? "Unknown"}</span>
                              {ad.city && <span className="flex items-center gap-1"><MapPin size={11} />{ad.city}</span>}
                              <span className="flex items-center gap-1"><Clock size={11} />{relTime(ad.created_at)}</span>
                            </div>
                          </div>
                          <p className="text-base font-bold text-[var(--text-primary)] whitespace-nowrap">
                            Rs {ad.price >= 100000 ? `${(ad.price / 100000).toFixed(1)}L` : `${(ad.price / 1000).toFixed(0)}k`}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-muted)]">
                          <span className="flex items-center gap-1"><Camera size={13} strokeWidth={2} /> {ad.ad_photos.length} photos</span>
                        </div>

                        {ad.ad_photos.length > 0 && (
                          <div className="flex gap-2 mb-3 overflow-x-auto">
                            {ad.ad_photos.slice(0, 4).map((p, i) => (
                              <img key={i} src={p.url} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => approveAd(ad.id)}
                            disabled={isActioning}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors disabled:opacity-50"
                          >
                            {actioning === `ad-${ad.id}` ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} strokeWidth={2} />} Approve
                          </button>
                          <button
                            onClick={() => rejectAd(ad.id)}
                            disabled={isActioning}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                          >
                            {actioning === `ad-rej-${ad.id}` ? <Loader2 size={15} className="animate-spin" /> : <XCircle size={15} strokeWidth={2} />} Reject
                          </button>
                          <button className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg)]">
                            <Eye size={15} strokeWidth={2} />
                          </button>
                        </div>
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
                    const isActioning = actioning === `cnic-${item.id}`;
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
                              style={{
                                height: 120,
                                background: "var(--bg)",
                                cursor: url ? "pointer" : "default",
                              }}
                            >
                              {url ? (
                                <>
                                  <img
                                    src={url}
                                    alt={label}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { (e.currentTarget.parentElement as HTMLElement).innerHTML = `<span style="color:#999;font-size:11px;padding:8px;text-align:center">${label}<br/>Load error</span>`; }}
                                  />
                                  <span className="absolute bottom-1 right-1 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">
                                    expand
                                  </span>
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
                            onClick={() => approveCnic(item.id)}
                            disabled={isActioning}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors disabled:opacity-50"
                          >
                            {isActioning ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} strokeWidth={2} />} Verify
                          </button>
                          <button
                            onClick={() => rejectCnic(item.id)}
                            disabled={isActioning}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
                          >
                            <XCircle size={15} strokeWidth={2} /> Reject
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
                    <div key={user.id} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: user.is_admin ? "#7c3aed" : "var(--brand-green)" }}>
                        {(user.full_name ?? "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{user.full_name ?? "—"}</p>
                        <p className="text-xs text-[var(--text-muted)]">{user.phone ?? "—"} · {user.city ?? "—"}</p>
                      </div>
                      {user.is_admin && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600">Admin</span>
                      )}
                      <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--brand-green)]">
                        <ChevronRight size={16} strokeWidth={2} />
                      </button>
                    </div>
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-[var(--text-muted)]">{relTime(r.created_at)}</span>
                          </div>
                          <p className="text-sm text-[var(--text-primary)] mb-1">{r.ads?.title ?? "Ad"}: {r.reason}</p>
                        </div>
                        <button
                          onClick={() => dismissReport(r.id)}
                          className="px-3 py-1.5 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-xs font-semibold"
                        >
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
                <p className="text-xs text-[var(--text-muted)]">Location change requests will appear here</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>

    {/* Lightbox */}
    {lightboxUrl && (
      <div
        onClick={() => setLightboxUrl(null)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.92)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "zoom-out",
        }}
      >
        <img
          src={lightboxUrl}
          alt="CNIC document"
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            objectFit: "contain",
            borderRadius: 8,
            boxShadow: "0 4px 40px rgba(0,0,0,0.6)",
          }}
        />
        <button
          onClick={() => setLightboxUrl(null)}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
          }}
        >
          ✕
        </button>
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
      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: colors[color], color: textColors[color] }}>
        {icon}
      </div>
      <p className="text-2xl font-black text-[var(--text-primary)] mb-0.5" style={{ letterSpacing: "-0.5px" }}>{value}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  );
}
