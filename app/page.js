"use client";

import { useState } from "react";
import { Fraunces, Manrope } from "next/font/google";

const display = Fraunces({ subsets: ["latin"], weight: ["600", "700"] });
const body = Manrope({ subsets: ["latin"] });

const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "buyers", icon: "🔍", label: "Find Buyers" },
  { id: "campaigns", icon: "📧", label: "Campaigns" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "settings", icon: "⚙️", label: "Settings" },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState("dashboard");

  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyers, setSelectedBuyers] = useState([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailsGenerated, setEmailsGenerated] = useState(43);

  const [campaigns, setCampaigns] = useState([
    { company: "Modern Living USA", status: "Sent" },
    { company: "Elegant Interiors", status: "Draft" },
    { company: "Decor Imports", status: "Sent" },
  ]);
  const [activity, setActivity] = useState([
    "Email sent to Modern Living USA",
    "New buyers found",
    "Campaign created",
    "API synced",
  ]);

  const log = (text) => setActivity((a) => [text, ...a].slice(0, 6));

  const findBuyers = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    try {
      const response = await fetch("/api/buyers");
      const data = await response.json();
      setBuyers(data);
      setSelectedBuyers([]);
      log(`${data.length} new buyers found`);
    } catch (e) {
      log("Buyer search failed");
    }
    setLoading(false);
  };

  const toggleBuyer = (buyer) => {
    const exists = selectedBuyers.some((b) => b.id === buyer.id);
    setSelectedBuyers(
      exists
        ? selectedBuyers.filter((b) => b.id !== buyer.id)
        : [...selectedBuyers, buyer]
    );
  };

  const generateEmail = () => {
    const companies = selectedBuyers.map((b) => b.company).join(", ");
    setGeneratedEmail(`Hello ${companies},

We manufacture premium ${product} products and would like to explore wholesale opportunities.

Category: ${category}

Description:
${description}

We believe our products would be a valuable addition to your offerings.

Looking forward to hearing from you.

Best Regards,
Home Decor Supplier`);
    setEmailsGenerated((n) => n + 1);
    setCampaigns((c) => [
      ...selectedBuyers.map((b) => ({ company: b.company, status: "Draft" })),
      ...c,
    ]);
    log("Email generated");
  };

  const sendEmail = () => {
    const emails = selectedBuyers.map((b) => b.email).join(",");
    const subject = encodeURIComponent("Wholesale Partnership Opportunity");
    const bodyText = encodeURIComponent(generatedEmail);
    alert("Opening Gmail Draft. Click Send in Gmail.");
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${subject}&body=${bodyText}`,
      "_blank"
    );
    const names = selectedBuyers.map((b) => b.company);
    setCampaigns((c) =>
      c.map((x) => (names.includes(x.company) ? { ...x, status: "Sent" } : x))
    );
    log("Email sent");
  };

  const badge = (status) =>
    status === "Sent"
      ? "bg-emerald-100 text-emerald-800"
      : status === "Draft"
      ? "bg-amber-100 text-amber-800"
      : "bg-slate-200 text-slate-700";

  const card = "bg-white rounded-2xl border border-[#DDE1DA] p-6";
  const input =
    "w-full border border-[#CBD1C8] bg-[#FAFBF9] p-3.5 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#C8963E]";

  /* ---------- LOGIN ---------- */
  if (!loggedIn) {
    return (
      <div className={`${body.className} min-h-screen grid md:grid-cols-2 bg-[#EEF0EB]`}>
        <div className="bg-[#12332F] text-white p-10 md:p-16 flex flex-col justify-between">
          <p className={`${display.className} text-2xl`}>HomeDecorConnect AI</p>
          <div className="py-16">
            <h1 className={`${display.className} text-4xl md:text-5xl leading-tight mb-5`}>
              AI-Powered Buyer Discovery Platform for Home Decor Exporters
            </h1>
            <p className="text-[#C9D8D2] text-lg">
              Discover Buyers • Generate Emails • Manage Campaigns
            </p>
          </div>
          <p className="text-sm text-[#8FAAA2]">Powered by APIs · Built with Next.js</p>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className={`${display.className} text-3xl text-[#12332F] mb-2`}>
              Welcome back
            </h2>
            <p className="text-slate-600 mb-8">Log in to manage your buyer outreach.</p>

            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@company.com"
              className={`${input} mt-1`}
            />
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${input} mt-1`}
            />
            {/* Fake login: any input works.
                With separate routes, use router.push("/dashboard") here instead. */}
            <button
              onClick={() => setLoggedIn(true)}
              className="w-full bg-[#12332F] text-white py-3.5 rounded-xl font-semibold hover:bg-[#0C2421]"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- VIEWS ---------- */
  const stats = [
    { label: "Total Buyers Found", value: 120 + buyers.length },
    { label: "Emails Generated", value: emailsGenerated },
    { label: "Campaigns Created", value: 8 + (generatedEmail ? 1 : 0) },
    { label: "API Status", value: "🟢 Active", small: true },
  ];

  const Stats = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className={card}>
          <p className="text-sm text-slate-500 mb-2">{s.label}</p>
          <p
            className={`${display.className} ${
              s.small ? "text-2xl" : "text-4xl"
            } text-[#12332F]`}
          >
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );

  const CampaignTable = () => (
    <div className={card}>
      <h2 className={`${display.className} text-2xl text-[#12332F] mb-4`}>
        Campaign History
      </h2>
      <table className="w-full">
        <thead>
          <tr className="text-left text-sm text-slate-500 border-b border-[#DDE1DA]">
            <th className="pb-3 font-semibold">Company</th>
            <th className="pb-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c, i) => (
            <tr key={i} className="border-b border-[#EEF0EB] last:border-0">
              <td className="py-3">{c.company}</td>
              <td className="py-3">
                <span className={`px-3 py-1 rounded-full text-sm ${badge(c.status)}`}>
                  {c.status === "Sent" ? "✅ " : c.status === "Draft" ? "📝 " : "⏳ "}
                  {c.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const Activity = () => (
    <div className={card}>
      <h2 className={`${display.className} text-2xl text-[#12332F] mb-4`}>
        Recent Activity
      </h2>
      <ul className="space-y-3">
        {activity.map((a, i) => (
          <li key={i} className="flex gap-3 text-slate-700">
            <span>✅</span>
            {a}
          </li>
        ))}
      </ul>
    </div>
  );

  const Discovery = () => (
    <>
      <div className={`${card} mb-8`}>
        <h2 className={`${display.className} text-2xl text-[#12332F] mb-5`}>
          Buyer Discovery
        </h2>
        <input
          type="text"
          placeholder="Product Name"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className={input}
        />
        <input
          type="text"
          placeholder="Product Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={input}
        />
        <textarea
          rows="4"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={input}
        />
        <button
          onClick={findBuyers}
          disabled={loading}
          className="w-full bg-[#C8963E] text-[#2A1E08] font-semibold py-3.5 rounded-xl hover:bg-[#B5852F] disabled:opacity-60"
        >
          {loading ? "Searching US buyers..." : "Find Buyers"}
        </button>
      </div>

      {buyers.length > 0 && (
        <div className="mb-8">
          <h2 className={`${display.className} text-2xl text-[#12332F] mb-4`}>
            Buyer Results
          </h2>
<div
  className="grid gap-4"
  style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 340px), 1fr))" }}
>            {buyers.map((buyer) => {
              const picked = selectedBuyers.some((b) => b.id === buyer.id);
              return (
              <label
  key={buyer.id}
  className={`${card} cursor-pointer flex justify-between gap-4 ${
    picked ? "ring-2 ring-[#C8963E]" : ""
  }`}
  style={{ minWidth: 0, overflow: "hidden" }}
>
  <div style={{ minWidth: 0, flex: 1 }} className="space-y-1">
    <h3
      className="text-lg font-bold text-[#12332F]"
      style={{ overflowWrap: "anywhere" }}
    >
      🏢 {buyer.company}
    </h3>

    {/* address: max 2 lines */}
    <p
      className="text-slate-600 text-sm"
      title={buyer.city}
      style={{
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        overflowWrap: "anywhere",
      }}
    >
      📍 {buyer.city}
    </p>

    {/* email: single line with ellipsis, full email on hover */}
    <p
      className="text-slate-600 text-sm"
      title={buyer.email}
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      📧 {buyer.email}
    </p>

    <p className="text-slate-600 text-sm">{buyer.category}</p>

    <span className="inline-block mt-2 bg-[#12332F] text-white px-3 py-1 rounded-full text-sm">
      🎯 {String(buyer.match).replace("%", "")}% Match
    </span>
  </div>

  <input
    type="checkbox"
    className="w-5 h-5 accent-[#C8963E] mt-1"
    style={{ flexShrink: 0 }}
    checked={picked}
    onChange={() => toggleBuyer(buyer)}
  />
</label>
              );
            })}
          </div>

          <button
            onClick={generateEmail}
            disabled={selectedBuyers.length === 0}
            className="mt-5 bg-[#12332F] text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-[#0C2421] disabled:opacity-40"
          >
            Generate Email ({selectedBuyers.length})
          </button>
        </div>
      )}

      {generatedEmail && (
        <div className={`${card} mb-8`}>
          <h2 className={`${display.className} text-2xl text-[#12332F] mb-4`}>
            Generated Outreach Email
          </h2>
          <textarea
            value={generatedEmail}
            readOnly
            rows="12"
            className={input}
          />
          <div className="flex gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(generatedEmail)}
              className="border border-[#12332F] text-[#12332F] px-5 py-3 rounded-xl font-semibold"
            >
              Copy Email
            </button>
            <button
              onClick={sendEmail}
              className="bg-[#C8963E] text-[#2A1E08] px-5 py-3 rounded-xl font-semibold hover:bg-[#B5852F]"
            >
              Send via Gmail
            </button>
          </div>
        </div>
      )}
    </>
  );

  const bars = [
    ["Mon", 40], ["Tue", 65], ["Wed", 52], ["Thu", 80], ["Fri", 70], ["Sat", 35], ["Sun", 55],
  ];

  const AnalyticsView = () => (
    <>
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          ["Response Rate", "18%"],
          ["Open Rate", "64%"],
          ["Campaign Performance", "Good"],
        ].map(([l, v]) => (
          <div key={l} className={card}>
            <p className="text-sm text-slate-500 mb-2">{l}</p>
            <p className={`${display.className} text-4xl text-[#12332F]`}>{v}</p>
          </div>
        ))}
      </div>
      <div className={card}>
        <h2 className={`${display.className} text-2xl text-[#12332F] mb-6`}>
          Buyer Discovery Trend
        </h2>
        <div className="flex items-end gap-4 h-48">
          {bars.map(([d, h]) => (
            <div key={d} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-[#12332F] rounded-t-lg"
                style={{ height: `${h}%` }}
              />
              <span className="text-xs text-slate-500">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-4">Demo values</p>
      </div>
    </>
  );

  const titles = {
    dashboard: "Dashboard Overview",
    buyers: "Find Buyers",
    campaigns: "Campaigns",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <div className={`${body.className} min-h-screen bg-[#EEF0EB] text-slate-800 md:flex`}>
      {/* Sidebar */}
     <aside
  className="md:w-64 bg-[#12332F] text-white p-5 md:p-6 md:min-h-screen md:sticky md:top-0 md:self-start"
  style={{ flexShrink: 0, overflow: "hidden" }}
>
  <h1
    className={`${display.className} text-xl leading-tight md:mb-10 mb-4`}
    style={{ overflowWrap: "anywhere" }}
  >
    HomeDecor
    <span className="block md:inline">Connect</span>
    <span className="block text-sm font-normal text-[#C8963E] mt-1">
      AI Buyer Discovery
    </span>
  </h1>
        <ul className="flex md:flex-col gap-2 overflow-x-auto">
          {NAV.map((n) => (
            <li
              key={n.id}
              onClick={() => setView(n.id)}
              className={`px-4 py-3 rounded-xl cursor-pointer whitespace-nowrap ${
                view === n.id
                  ? "bg-[#C8963E] text-[#2A1E08] font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {n.icon} {n.label}
            </li>
          ))}
        </ul>
        <button
          onClick={() => setLoggedIn(false)}
          className="hidden md:block mt-10 text-sm text-[#8FAAA2] hover:text-white"
        >
          Log out
        </button>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-[#DDE1DA] bg-white">
          <h2 className={`${display.className} text-2xl text-[#12332F]`}>
            {titles[view]}
          </h2>
          <span className="bg-[#12332F] text-white px-4 py-2 rounded-lg text-sm">
            USA Market
          </span>
        </header>

        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full">
          {view === "dashboard" && (
            <>
              <section className="mb-8">
                <h1 className={`${display.className} text-3xl md:text-4xl text-[#12332F] mb-2`}>
                  AI-Powered Buyer Discovery Platform for Home Decor Exporters
                </h1>
                <p className="text-slate-600">
                  Discover Buyers • Generate Emails • Manage Campaigns
                </p>
              </section>
              <Stats />
              <div className="grid lg:grid-cols-2 gap-6">
                <CampaignTable />
                <Activity />
              </div>
            </>
          )}

          {view === "buyers" && (
            <>
              <Stats />
              {Discovery()}
            </>
          )}

          {view === "campaigns" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <CampaignTable />
              <Activity />
            </div>
          )}

          {view === "analytics" && <AnalyticsView />}

          {view === "settings" && (
            <div className={`${card} max-w-lg`}>
              <h2 className={`${display.className} text-2xl text-[#12332F] mb-4`}>
                Account
              </h2>
              <p className="text-slate-600 mb-2">
                Signed in as {loginEmail || "demo user"}
              </p>
              <p className="text-slate-600">API status: 🟢 Active</p>
            </div>
          )}
        </main>

        <footer className="px-6 md:px-10 py-6 border-t border-[#DDE1DA] text-sm text-slate-500 flex flex-wrap justify-between gap-2">
          <span>Powered by APIs · Built with Next.js</span>
          <span>HomeDecorConnect AI © 2026</span>
        </footer>
      </div>
    </div>
  );
}