import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";
import { Footer, FooterMobile } from "@/components/Footer";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import { BLOG_POSTS, getPost, formatDate } from "@/lib/blog";

export const dynamicParams = false;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not Found", robots: { index: false } };

  const ogUrl = `https://www.sellz.pk/api/og?title=${encodeURIComponent(post.title)}&sub=${encodeURIComponent("Sellz.pk Blog — Pakistan Marketplace Guide")}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `https://www.sellz.pk/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.sellz.pk/blog/${slug}`,
      type: "article",
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [ogUrl],
    },
  };
}

// ─── Post content ─────────────────────────────────────────────────────────────

function Post1() {
  return (
    <article>
      <p>Selling a used mobile phone in Pakistan is one of the most common transactions on classifieds platforms. Done right, you get a fair price and a smooth handover. Done wrong, you attract scammers, get lowballed, or end up in a dispute. This guide covers every step.</p>

      <h2>Step 1: Back up and factory reset your phone</h2>
      <p>Before anything else, back up your photos, contacts, and important files to Google Drive, iCloud, or your computer. Then perform a full factory reset. On Android: Settings → General Management → Reset → Factory Data Reset. On iPhone: Settings → General → Transfer or Reset iPhone → Erase All Content.</p>
      <p>For iPhones, you must also sign out of your Apple ID (Settings → your name → Sign Out) before erasing. If iCloud lock remains, the buyer cannot activate the phone — this is the single biggest cause of iPhone disputes in Pakistan.</p>

      <h2>Step 2: Check your phone's condition honestly</h2>
      <p>Buyers will inspect the phone before paying. If you misrepresent the condition, the deal falls apart — or worse, you get blamed for something later. Check the screen for scratches and dead pixels, test all buttons and ports, check the battery health (Settings → Battery → Battery Health on iPhone; use an app like AccuBattery on Android), and note any dents or damage.</p>

      <h2>Step 3: Take clear, honest photos</h2>
      <p>On Sellz.pk, photos must be taken live with your camera — no gallery uploads. Take photos in good lighting showing the front, back, sides, and any defects. Honest photos build trust and attract serious buyers rather than time-wasters who show up and find the phone worse than expected.</p>

      <h2>Step 4: Check the IMEI and PTA status</h2>
      <p>Dial <strong>*#06#</strong> to display your phone's IMEI. Then check its PTA approval status at the PTA Device Verification portal. PTA-approved phones have significantly higher resale value in Pakistan. Include the PTA status in your listing — buyers will ask anyway.</p>

      <h2>Step 5: Set a fair asking price</h2>
      <p>Search for similar listings in your area to understand market pricing. Factor in the phone's age, condition, PTA status, storage, and accessories included. Price slightly higher than your minimum to leave room for negotiation — buyers always try. Overpricing drives away genuine buyers; underpricing attracts flippers, not buyers.</p>

      <h2>Step 6: Write an honest description</h2>
      <p>Include: brand, model, storage, RAM, PTA status, battery health, condition (be specific about any faults), and what's included in the box. The more detail you provide, the fewer time-wasting questions you receive.</p>

      <h2>Step 7: Screen buyers before meeting</h2>
      <p>When buyers contact you, a few quick questions separate serious buyers from time-wasters: confirm they've read the listing, ask if the price works for them, and agree on a meeting time before giving your location. On Sellz.pk, all buyers must have accounts — you can check their profile before agreeing to meet.</p>

      <h2>Step 8: Meet in a safe public place</h2>
      <p>Always meet in a busy public location — a mall, a market, or a café. Avoid meeting at your home or in quiet areas. Bring a friend if possible. Inspect payment before handing over the phone: cash in hand is the safest option in Pakistan. If the buyer pays by bank transfer, wait for the actual credit to appear in your account — not just a screenshot.</p>

      <h2>What to avoid</h2>
      <ul>
        <li>Never send a phone by courier to someone you've never met in person</li>
        <li>Never accept payment via Easypaisa or JazzCash screenshots — these can be faked</li>
        <li>Don't unlock network locks or bypass PTA approval for buyers — this voids any warranty and creates legal issues</li>
        <li>Don't let buyers pressure you into a quick sale without proper inspection</li>
      </ul>

      <p>Selling on a CNIC-verified platform like Sellz.pk significantly reduces scam risk on both sides — buyers know who they're dealing with, and sellers have the same confidence about buyers.</p>
    </article>
  );
}

function Post2() {
  return (
    <article>
      <p>Buying a used car in Pakistan is one of the largest financial decisions most people make. The second-hand car market is active across Karachi, Lahore, Islamabad, and every major city — but it also attracts fraud. This guide gives you a systematic process to make a safe purchase.</p>

      <h2>Step 1: Set a realistic budget including transfer costs</h2>
      <p>Transfer costs in Pakistan typically run 3–5% of the car's value, covering excise fees, token tax arrears, and any outstanding fines. Budget for these upfront. Also factor in immediate maintenance costs — most used cars need at least minor servicing after purchase.</p>

      <h2>Step 2: Verify the seller's identity</h2>
      <p>Before inspecting the car, confirm the seller's identity. On Sellz.pk, every seller is CNIC-verified — you know you're dealing with a real, identified person. In any transaction, always ask to see the seller's original CNIC and confirm it matches the registration book.</p>

      <h2>Step 3: Check registration documents carefully</h2>
      <p>The registration book (RC book) is the most important document. Check that the vehicle's engine number and chassis number match the book exactly — even one digit different is a red flag. Confirm the registered owner's name matches the seller's CNIC. If the car has been transferred multiple times without proper documentation, ownership disputes can arise after you've already paid.</p>

      <h2>Step 4: Check for loans and court orders</h2>
      <p>Visit the local excise and taxation office (or use their online portal in larger cities) to check if the vehicle has any outstanding loans, bank liens, or court seizure orders. A car with a bank lien cannot be legally transferred until the loan is cleared — even if the seller tells you otherwise. This check costs little and can save you from a very expensive mistake.</p>

      <h2>Step 5: Get an independent mechanic inspection</h2>
      <p>Never rely on the seller's word about the car's condition. Bring your own trusted mechanic or take the car to a workshop for an inspection. Key things to check: engine oil (colour and level), gearbox smoothness, clutch, brakes, suspension, air conditioning, all electronics, rust under the car and in the wheel arches, and the condition of tyres. A proper inspection costs a few thousand rupees and is always worth it.</p>

      <h2>Step 6: Test drive properly</h2>
      <p>Test drive on different road types — a smooth road shows nothing. Drive on a bumpy road to check suspension, test the brakes hard at low speed, accelerate to highway speed if possible, and listen for unusual noises. A seller who refuses a test drive or tries to limit it is a warning sign.</p>

      <h2>Step 7: Complete the transfer at the excise office</h2>
      <p>Never accept a car on a power of attorney (POA) alone without completing the official transfer. Transfer the vehicle at the excise office with both buyer and seller present. You'll need the original registration book, both CNICs, and payment of transfer fees. Once transferred, the vehicle is officially in your name and protected from the seller's future issues.</p>

      <h2>Red flags to walk away from</h2>
      <ul>
        <li>Seller refuses to show the original registration book</li>
        <li>Car is not registered in the seller's name and they have no proper authority letter</li>
        <li>Price is significantly below market — usually means a hidden defect or legal issue</li>
        <li>Seller pressures for quick payment before inspection</li>
        <li>Engine or chassis numbers don't match the documents</li>
        <li>Seller wants to complete the deal away from the excise office</li>
      </ul>

      <p>Buying from a verified seller on a platform like Sellz.pk, where every seller's CNIC is confirmed, significantly reduces the risk of dealing with fraudulent ownership claims.</p>
    </article>
  );
}

function Post3() {
  return (
    <article>
      <p>Online classifieds in Pakistan have become a common hunting ground for scammers. Whether you're buying or selling, knowing the patterns these scams follow will protect you from losing money. This guide covers the most common scams and practical ways to avoid them.</p>

      <h2>The most common classifieds scams in Pakistan</h2>

      <h3>1. Advance payment scams</h3>
      <p>A "buyer" contacts you about your item, agrees to your price without negotiating, then says they can't meet in person but will send a courier — and asks you to send the item after an advance payment. The payment screenshot they send is fake. Once you send the item, you never hear from them again.</p>
      <p><strong>Rule:</strong> Never send any item to someone you haven't met in person. Cash on handover, always.</p>

      <h3>2. Fake photos and stolen images</h3>
      <p>Scam listings use photos stolen from other websites or previous listings to make a non-existent item look real. The "seller" has no actual item — they collect deposits or advance payments and disappear.</p>
      <p><strong>Rule:</strong> Only trust listings with live photos of the actual item. On Sellz.pk, all photos must be taken in real time with a camera — gallery uploads are blocked, making this scam impossible on the platform.</p>

      <h3>3. Fake bank transfer screenshots</h3>
      <p>A buyer meets you in person (or arranges collection) and shows you a screenshot of a bank transfer as proof of payment. The screenshot is edited or the transfer is initiated but immediately reversed. You hand over the item believing you've been paid.</p>
      <p><strong>Rule:</strong> For bank transfers, wait until the money actually appears in your account balance — not just a notification or screenshot. Ideally, collect cash for high-value items.</p>

      <h3>4. Easypaisa and JazzCash reversal fraud</h3>
      <p>Mobile wallet transactions can sometimes be reversed after the fact, especially if the scammer reports the transaction as fraudulent to the wallet company. You see the money arrive, hand over the item, then the money disappears.</p>
      <p><strong>Rule:</strong> For significant amounts, use bank transfer and wait for settlement, or use cash. Mobile wallets are fine for small amounts when you know the buyer.</p>

      <h3>5. "I'll send a helper to collect" scams</h3>
      <p>A buyer agrees to your item and price, then says they'll send someone else to collect. The "helper" arrives, inspects the item, and either claims the item isn't as described (to pressure a lower price) or attempts to take it without paying.</p>
      <p><strong>Rule:</strong> If a buyer sends someone else, treat that person as the buyer. Confirm payment in full before handing over anything. Don't be pressured into a discount at the handover point.</p>

      <h3>6. Identity fraud</h3>
      <p>Someone poses as a legitimate seller using a profile created with someone else's identity. They collect payment for items they don't own.</p>
      <p><strong>Rule:</strong> On Sellz.pk, every seller's CNIC is verified by the team before they can post. This makes identity fraud on the platform significantly harder than on anonymous platforms.</p>

      <h2>General safety rules for classifieds in Pakistan</h2>
      <ul>
        <li>Meet in a public place with other people around — not your home or a quiet location</li>
        <li>Inspect the item thoroughly before paying</li>
        <li>Never pay a deposit or advance without seeing and inspecting the item in person</li>
        <li>For vehicles and property, verify all documents and complete official transfers</li>
        <li>Trust your instincts — if something feels wrong, walk away</li>
        <li>Keep records of all communication in case of a dispute</li>
      </ul>

      <h2>What to do if you've been scammed</h2>
      <p>Report the incident to FIA Cybercrime at <strong>fia.gov.pk</strong> or call their helpline at <strong>9911</strong>. Also report to the platform where the transaction happened. Keep all screenshots and communication records — these are required for any complaint.</p>

      <p>Buying and selling on CNIC-verified platforms significantly reduces your exposure to these scams. When a seller's real identity is on file, the incentive to defraud drops sharply.</p>
    </article>
  );
}

const POST_CONTENT: Record<string, () => JSX.Element> = {
  "how-to-sell-mobile-phone-safely-pakistan": Post1,
  "used-car-buying-guide-pakistan": Post2,
  "how-to-avoid-classifieds-scams-pakistan": Post3,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const Content = POST_CONTENT[slug];
  if (!Content) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.date,
    "dateModified": post.date,
    "url": `https://www.sellz.pk/blog/${slug}`,
    "author": {
      "@type": "Organization",
      "name": "Sellz.pk",
      "url": "https://www.sellz.pk",
    },
    "publisher": {
      "@type": "Organization",
      "name": "Sellz.pk",
      "url": "https://www.sellz.pk",
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.sellz.pk/blog/${slug}`,
    },
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--brand-green)" }}>Home</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: "var(--brand-green)" }}>Blog</Link>
            <span>/</span>
            <span style={{ color: "var(--text-secondary)" }}>{post.category}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "var(--brand-green-light)", color: "var(--brand-green)" }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
              <Clock size={12} />
              {post.readTime}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {formatDate(post.date)}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black mb-6 leading-snug" style={{ color: "var(--text-primary)" }}>
            {post.title}
          </h1>

          {/* Article body */}
          <div
            className="prose-sellz"
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: "1.75",
            }}
          >
            <Content />
          </div>

          {/* CTA */}
          <div className="card p-5 mt-10 text-center">
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Buy and sell safely on Sellz.pk
            </p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Every seller CNIC-verified. Real photos only.
            </p>
            <Link href="/" className="btn-primary justify-center inline-flex px-6">
              Browse Listings
            </Link>
          </div>
        </div>
      </main>
      <BottomNav />
      <Footer />
      <FooterMobile />
    </div>
  );
}
