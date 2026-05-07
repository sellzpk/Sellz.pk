"use client";

import { useState } from "react";
import {
  CheckCircle, XCircle, Clock, Users, FileText, Flag,
  Search, ChevronRight, Eye, AlertTriangle, MapPin, Shield,
  Camera, CreditCard, ScanFace
} from "lucide-react";

const TABS = ["Dashboard", "Ad Queue", "CNIC Queue", "Users", "Reports", "Location Requests"];

const AD_QUEUE = [
  { id: "q1", title: "iPhone 15 Pro Max 256GB", price: 385000, seller: "Abdul Rehman", city: "Karachi", time: "10 min ago", photos: 4, hasOwnership: true },
  { id: "q2", title: "Toyota Corolla 2020", price: 4700000, seller: "Bilal Ahmed", city: "Lahore", time: "25 min ago", photos: 6, hasOwnership: true },
  { id: "q3", title: "Dell XPS 15 Laptop", price: 420000, seller: "Sana Malik", city: "Islamabad", time: "1 hour ago", photos: 3, hasOwnership: false },
  { id: "q4", title: "3 Bed Apartment Clifton", price: 22500000, seller: "Hassan Khan", city: "Karachi", time: "2 hours ago", photos: 8, hasOwnership: true },
];

const CNIC_QUEUE = [
  { id: "c1", name: "Fatima Shah", phone: "03001234567", city: "Karachi", matchScore: 97, time: "5 min ago" },
  { id: "c2", name: "Usman Ali", phone: "03219876543", city: "Lahore", matchScore: 89, time: "30 min ago" },
  { id: "c3", name: "Ayesha Noor", phone: "03451231234", city: "Rawalpindi", matchScore: 94, time: "1 hour ago" },
];

const REPORTS = [
  { id: "r1", type: "Ad", description: "Fake photos — item not as described", reportedBy: "User #445", time: "15 min ago" },
  { id: "r2", type: "User", description: "Suspected duplicate CNIC account", reportedBy: "System", time: "2 hours ago" },
  { id: "r3", type: "Ad", description: "Price manipulation — relisting at higher price", reportedBy: "User #612", time: "3 hours ago" },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [approved, setApproved] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);

  function approve(id: string) { setApproved(a => [...a, id]); }
  function reject(id: string) { setRejected(r => [...r, id]); }
  function isPending(id: string) { return !approved.includes(id) && !rejected.includes(id); }

  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F0EE]">
      {/* Admin header */}
      <header className="bg-[#1a1a1a] text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-green)" }}>
            <span className="text-white font-black text-xs">S</span>
          </div>
          <span className="font-bold text-sm">sellz.pk</span>
          <span className="text-white/30 text-xs">|</span>
          <span className="text-white/60 text-xs font-medium">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--brand-green)] flex items-center justify-center text-xs font-bold">A</div>
          <span className="text-xs text-white/60">Admin</span>
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
              {tab === "Ad Queue" && (
                <span className="w-5 h-5 rounded-full bg-[var(--brand-green)] text-white text-[10px] font-bold flex items-center justify-center">
                  {AD_QUEUE.filter(a => isPending(a.id)).length}
                </span>
              )}
              {tab === "CNIC Queue" && (
                <span className="w-5 h-5 rounded-full bg-[var(--brand-blue)] text-white text-[10px] font-bold flex items-center justify-center">
                  {CNIC_QUEUE.filter(c => isPending(c.id)).length}
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden overflow-x-auto no-scrollbar border-b border-[var(--border)] bg-white w-full">
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

        {/* Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {activeTab === "Dashboard" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-6">Dashboard</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard icon={<FileText size={20} strokeWidth={2} />} value={AD_QUEUE.filter(a => isPending(a.id)).length} label="Pending Ads" color="green" />
                <StatCard icon={<Shield size={20} strokeWidth={2} />} value={CNIC_QUEUE.filter(c => isPending(c.id)).length} label="CNIC Verifications" color="blue" />
                <StatCard icon={<Flag size={20} strokeWidth={2} />} value={REPORTS.length} label="Active Reports" color="red" />
                <StatCard icon={<Users size={20} strokeWidth={2} />} value={1247} label="Total Users" color="gray" />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Ad Submissions</h3>
                    <button onClick={() => setActiveTab("Ad Queue")} className="text-xs text-[var(--brand-green)] font-medium">View all</button>
                  </div>
                  <div className="space-y-3">
                    {AD_QUEUE.slice(0, 3).map(ad => (
                      <div key={ad.id} className="flex items-center gap-3">
                        <Clock size={14} strokeWidth={2} className="text-[var(--text-muted)] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[var(--text-primary)] truncate">{ad.title}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{ad.seller} · {ad.time}</p>
                        </div>
                        <PendingBadge id={ad.id} approved={approved} rejected={rejected} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Reports</h3>
                    <button onClick={() => setActiveTab("Reports")} className="text-xs text-[var(--brand-green)] font-medium">View all</button>
                  </div>
                  <div className="space-y-3">
                    {REPORTS.map(r => (
                      <div key={r.id} className="flex items-start gap-3">
                        <AlertTriangle size={14} strokeWidth={2} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-[var(--text-primary)]">{r.type}: {r.description}</p>
                          <p className="text-[11px] text-[var(--text-muted)]">{r.reportedBy} · {r.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Ad Queue" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">Ad Approval Queue</h1>
                <span className="text-sm text-[var(--text-muted)]">{AD_QUEUE.filter(a => isPending(a.id)).length} pending</span>
              </div>
              <div className="space-y-4">
                {AD_QUEUE.map(ad => (
                  <div key={ad.id} className="card p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{ad.title}</p>
                        <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                          <span>{ad.seller}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{ad.city}</span>
                          <span className="flex items-center gap-1"><Clock size={11} />{ad.time}</span>
                        </div>
                      </div>
                      <p className="text-base font-bold text-[var(--text-primary)] whitespace-nowrap">
                        Rs {(ad.price / 1000).toFixed(0)}k
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mb-3 text-xs text-[var(--text-muted)]">
                      <span className="flex items-center gap-1"><Camera size={13} strokeWidth={2} /> {ad.photos} photos</span>
                      {ad.hasOwnership && <span className="badge-owned">Ownership doc</span>}
                    </div>

                    {isPending(ad.id) ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(ad.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors"
                        >
                          <CheckCircle size={15} strokeWidth={2} /> Approve
                        </button>
                        <button
                          onClick={() => reject(ad.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <XCircle size={15} strokeWidth={2} /> Reject
                        </button>
                        <button className="px-3 py-2 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--bg)]">
                          <Eye size={15} strokeWidth={2} />
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium ${approved.includes(ad.id) ? "bg-[var(--brand-green-light)] text-[var(--brand-green)]" : "bg-red-50 text-red-600"}`}>
                        {approved.includes(ad.id) ? <CheckCircle size={15} strokeWidth={2} /> : <XCircle size={15} strokeWidth={2} />}
                        {approved.includes(ad.id) ? "Approved" : "Rejected"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "CNIC Queue" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">CNIC Verification Queue</h1>
                <span className="text-sm text-[var(--text-muted)]">{CNIC_QUEUE.filter(c => isPending(c.id)).length} pending</span>
              </div>
              <div className="space-y-4">
                {CNIC_QUEUE.map(item => (
                  <div key={item.id} className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: "var(--brand-blue)" }}>
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{item.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{item.phone} · {item.city} · {item.time}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-lg font-black" style={{ color: item.matchScore >= 90 ? "var(--brand-green)" : "var(--danger)" }}>
                          {item.matchScore}%
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)]">face match</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {["CNIC Front", "CNIC Back", "Selfie"].map((label, i) => (
                        <div key={label} className="aspect-video bg-[var(--bg)] rounded-lg border border-[var(--border)] flex flex-col items-center justify-center gap-1">
                          {i < 2
                            ? <CreditCard size={20} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                            : <ScanFace size={20} strokeWidth={1.5} className="text-[var(--text-muted)]" />
                          }
                          <span className="text-[10px] text-[var(--text-muted)]">{label}</span>
                        </div>
                      ))}
                    </div>

                    {isPending(item.id) ? (
                      <div className="flex gap-2">
                        <button onClick={() => approve(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold hover:bg-[var(--brand-green)] hover:text-white transition-colors">
                          <CheckCircle size={15} strokeWidth={2} /> Verify
                        </button>
                        <button onClick={() => reject(item.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-600 hover:text-white transition-colors">
                          <XCircle size={15} strokeWidth={2} /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-2 py-2 px-3 rounded-lg text-sm font-medium ${approved.includes(item.id) ? "bg-[var(--brand-green-light)] text-[var(--brand-green)]" : "bg-red-50 text-red-600"}`}>
                        {approved.includes(item.id) ? <CheckCircle size={15} strokeWidth={2} /> : <XCircle size={15} strokeWidth={2} />}
                        {approved.includes(item.id) ? "Verified" : "Rejected"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Users" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">User Management</h1>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 flex items-center gap-2 bg-white border border-[var(--border)] rounded-lg px-3 py-2.5">
                  <Search size={16} strokeWidth={2} className="text-[var(--text-muted)]" />
                  <input type="text" placeholder="Search by CNIC or phone..." className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              </div>
              <div className="card overflow-hidden">
                {[
                  { name: "Abdul Rehman", phone: "0300-1234567", cnic: "42101-XXXXX-X", city: "Karachi", ads: 5, status: "active" },
                  { name: "Bilal Ahmed", phone: "0321-9876543", cnic: "35202-XXXXX-X", city: "Lahore", ads: 3, status: "active" },
                  { name: "Sana Malik", phone: "0345-1231234", cnic: "61101-XXXXX-X", city: "Islamabad", ads: 1, status: "banned" },
                ].map((user, i) => (
                  <div key={i} className={`flex items-center gap-3 p-4 ${i > 0 ? "border-t border-[var(--border)]" : ""}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ background: user.status === "banned" ? "#e53e3e" : "var(--brand-green)" }}>
                      {user.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)]">{user.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{user.phone} · {user.city} · {user.ads} ads</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${user.status === "active" ? "bg-[var(--brand-green-light)] text-[var(--brand-green)]" : "bg-red-50 text-red-600"}`}>
                      {user.status}
                    </span>
                    <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--brand-green)]">
                      <ChevronRight size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Reports" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">Reports Queue</h1>
              <div className="space-y-3">
                {REPORTS.map(r => (
                  <div key={r.id} className="card p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${r.type === "User" ? "bg-red-50" : "bg-amber-50"}`}>
                        <AlertTriangle size={16} strokeWidth={2} className={r.type === "User" ? "text-red-500" : "text-amber-500"} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.type === "User" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-700"}`}>
                            {r.type}
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">{r.time}</span>
                        </div>
                        <p className="text-sm text-[var(--text-primary)] mb-1">{r.description}</p>
                        <p className="text-xs text-[var(--text-muted)]">Reported by: {r.reportedBy}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button className="px-3 py-1.5 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-xs font-semibold">
                          Dismiss
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold">
                          Ban
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Location Requests" && (
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)] mb-5">Location Change Requests</h1>
              <div className="space-y-3">
                {[
                  { name: "Ahmed Raza", from: "Lahore", to: "Karachi", reason: "Relocated for work", time: "1 day ago" },
                  { name: "Maria Qureshi", from: "Islamabad", to: "Peshawar", reason: "Family relocation", time: "3 days ago" },
                ].map((req, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--brand-green-light)] flex items-center justify-center text-sm font-bold text-[var(--brand-green)]">
                        {req.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{req.name}</p>
                        <p className="text-xs text-[var(--text-muted)]">{req.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <span className="px-2.5 py-1 bg-[var(--bg)] rounded-lg font-medium text-[var(--text-primary)]">{req.from}</span>
                      <ChevronRight size={14} strokeWidth={2} className="text-[var(--text-muted)]" />
                      <span className="px-2.5 py-1 bg-[var(--brand-green-light)] rounded-lg font-medium text-[var(--brand-green)]">{req.to}</span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mb-3">&quot;{req.reason}&quot;</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-[var(--brand-green-light)] text-[var(--brand-green)] text-sm font-semibold">Approve</button>
                      <button className="flex-1 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-semibold">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: number; label: string; color: string }) {
  const colors: Record<string, string> = {
    green: "var(--brand-green-light)",
    blue: "var(--brand-blue-light)",
    red: "#fef2f2",
    gray: "var(--bg)",
  };
  const textColors: Record<string, string> = {
    green: "var(--brand-green)",
    blue: "var(--brand-blue)",
    red: "#e53e3e",
    gray: "var(--text-primary)",
  };
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

function PendingBadge({ id, approved, rejected }: { id: string; approved: string[]; rejected: string[] }) {
  if (approved.includes(id)) return <span className="text-[10px] font-semibold text-[var(--brand-green)] bg-[var(--brand-green-light)] px-2 py-0.5 rounded-full">Approved</span>;
  if (rejected.includes(id)) return <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Rejected</span>;
  return <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Pending</span>;
}
