export type CitySeo = {
  cityName: string;
  h1: string;
  metaTitle: string;
  metaDesc: string;
  intro: string[];
  faqs: { q: string; a: string }[];
};

export const CITY_SEO: Record<string, CitySeo> = {
  karachi: {
    cityName: "Karachi",
    metaTitle: "Buy & Sell in Karachi — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Karachi safely. CNIC-verified sellers, live photos, no fake listings. Mobiles, cars, property, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Karachi — Verified Classifieds",
    intro: [
      "Sellz.pk is Karachi's verified classifieds marketplace. Every seller is verified with their CNIC before they can post a listing — one real identity per account, no exceptions.",
      "Browse thousands of listings across Karachi's neighbourhoods: DHA, Clifton, Gulshan-e-Iqbal, PECHS, North Nazimabad, Korangi, and more. All photos are taken live on camera — no stolen images, no misleading listings.",
    ],
    faqs: [
      {
        q: "What is the best website to buy and sell in Karachi?",
        a: "Sellz.pk is Karachi's CNIC-verified classifieds platform. Every seller must verify their national identity before posting. Listings are shown chronologically — no paid bumps — so you always see the most recent items first. Categories include mobiles, cars, property, electronics, furniture, and more.",
      },
      {
        q: "How can I sell my mobile phone or laptop in Karachi quickly?",
        a: "Post a free listing on Sellz.pk with live photos of your item. Your listing appears in front of buyers searching in Karachi within seconds. Since all sellers are CNIC-verified, buyers trust the platform and respond faster. No registration fees, no commission.",
      },
      {
        q: "How do I find a verified property seller in Karachi?",
        a: "On Sellz.pk, all property listings in Karachi are from individual, CNIC-verified owners — no real estate agencies. You can filter by area (DHA, Clifton, Gulshan, etc.) and message sellers directly. Always verify property documents at the relevant Karachi registrar office before making any payment.",
      },
      {
        q: "Is it safe to buy a used car in Karachi from an individual seller?",
        a: "On Sellz.pk, all sellers — including car sellers in Karachi — are CNIC-verified. Before completing any vehicle purchase, verify the registration book matches the seller's CNIC, check for bank liens at the Karachi excise office, and get the car inspected by a trusted mechanic. Never pay in advance without seeing the vehicle and documents.",
      },
    ],
  },
  lahore: {
    cityName: "Lahore",
    metaTitle: "Buy & Sell in Lahore — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Lahore safely. CNIC-verified sellers, live photos, honest listings. Mobiles, cars, property, furniture and more on Sellz.pk.",
    h1: "Buy & Sell in Lahore — Verified Classifieds",
    intro: [
      "Sellz.pk is Lahore's trusted classifieds marketplace where every seller is CNIC-verified before they can post. No anonymous sellers, no fake listings.",
      "Find listings across all major Lahore areas — DHA, Gulberg, Johar Town, Model Town, Bahria Town, and more. Photos are taken live using the camera so what you see is what exists.",
    ],
    faqs: [
      {
        q: "What is the safest way to buy and sell in Lahore online?",
        a: "Sellz.pk requires all sellers in Lahore to verify their CNIC before posting any listing. This eliminates anonymous and fraudulent sellers. Listings include live photos taken on camera, not stock images. You can message sellers directly, agree on terms, and meet in a public place in Lahore to complete the transaction.",
      },
      {
        q: "Where can I find used cars for sale by individual owners in Lahore?",
        a: "Sellz.pk lists cars from CNIC-verified private owners in Lahore — no dealers allowed. You deal directly with the actual owner in DHA, Gulberg, Johar Town, or wherever they're based. All listing photos are live-taken. Before buying, verify the car's registration book, check for any outstanding loans, and get a mechanical inspection.",
      },
      {
        q: "How do I sell my house or plot in Lahore without an agent?",
        a: "Post your property on Sellz.pk for free. All property listings in Lahore are from individual, verified owners. Buyers contact you directly via the platform — no agency commission. Include clear, live photos and accurate location details (DHA phase, Gulberg block, etc.) for the best response rate.",
      },
      {
        q: "Can I find electronics and laptops for sale in Lahore at fair prices?",
        a: "Yes. Sellz.pk has hundreds of electronics listings from verified sellers in Lahore. All sellers are CNIC-verified and photos are live-taken so you see the actual condition of the item. You can negotiate directly with the seller and arrange to inspect the item in person before paying.",
      },
    ],
  },
  islamabad: {
    cityName: "Islamabad",
    metaTitle: "Buy & Sell in Islamabad — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Islamabad safely. CNIC-verified sellers, no fake listings. Mobiles, cars, property and more on Sellz.pk.",
    h1: "Buy & Sell in Islamabad — Verified Classifieds",
    intro: [
      "Sellz.pk connects verified buyers and sellers across Islamabad's sectors — F-7, F-10, G-11, DHA, Bahria Town, E-11, and beyond. Every seller verifies their CNIC before posting.",
      "No anonymous sellers, no manipulated rankings. Listings appear chronologically so you always see the most recent ads first. Live photos only — every image is taken with the camera at time of posting.",
    ],
    faqs: [
      {
        q: "Where can I buy second-hand items safely in Islamabad?",
        a: "Sellz.pk is Islamabad's CNIC-verified classifieds marketplace. Every seller must verify their national identity before listing. This means every item you see — whether a mobile phone, laptop, car, or furniture — comes from a real, identified person. Meet in a public place in Islamabad to inspect before buying.",
      },
      {
        q: "How do I sell my phone or laptop in Islamabad quickly?",
        a: "Post a free listing on Sellz.pk with live photos. Your listing is immediately visible to buyers in Islamabad. Since Sellz.pk shows listings chronologically without paid bumps, your listing gets genuine visibility. Buyers respond quickly because the platform's CNIC verification builds trust.",
      },
      {
        q: "Are there verified property listings available in Islamabad on Sellz.pk?",
        a: "Yes. Property listings in Islamabad on Sellz.pk are from CNIC-verified individual owners only — no agencies. Browse houses, apartments, and plots in F-sectors, G-sectors, DHA, Bahria Town, and other areas. Always verify property documents at the Islamabad registrar before making payment.",
      },
    ],
  },
  rawalpindi: {
    cityName: "Rawalpindi",
    metaTitle: "Buy & Sell in Rawalpindi — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Rawalpindi from CNIC-verified sellers. Mobiles, cars, property and electronics on Sellz.pk.",
    h1: "Buy & Sell in Rawalpindi — Verified Classifieds",
    intro: [
      "Find verified classifieds across Rawalpindi — Bahria Town, DHA, Saddar, Chaklala, Westridge, and more. Every seller is CNIC-verified before they can post on Sellz.pk.",
      "All listing photos are live-taken at time of posting. No misleading stock photos. Browse and buy with confidence from real, identified sellers.",
    ],
    faqs: [
      {
        q: "What is the best place to buy and sell online in Rawalpindi?",
        a: "Sellz.pk is Rawalpindi's verified classifieds platform. All sellers must verify their CNIC before listing. Listings are shown in time order — no paid bumps. You get genuine, recent listings from real people across Saddar, Bahria Town, DHA, and all other areas of Rawalpindi.",
      },
      {
        q: "How do I find second-hand electronics in Rawalpindi at good prices?",
        a: "Browse the electronics category on Sellz.pk and filter by Rawalpindi. All sellers are CNIC-verified and photos are live-taken. You can message sellers directly, negotiate, and meet in a public location in Rawalpindi to inspect before buying.",
      },
    ],
  },
  faisalabad: {
    cityName: "Faisalabad",
    metaTitle: "Buy & Sell in Faisalabad — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Faisalabad from CNIC-verified individual sellers. Mobiles, electronics, property and more on Sellz.pk.",
    h1: "Buy & Sell in Faisalabad — Verified Classifieds",
    intro: [
      "Sellz.pk connects verified buyers and sellers across Faisalabad — Gulberg, Madina Town, Peoples Colony, and beyond. Every seller is CNIC-verified before posting.",
      "Real listings, real people. Photos taken live on camera — no stock images. Browse and buy from identified sellers you can trust.",
    ],
    faqs: [
      {
        q: "Where can I buy and sell safely in Faisalabad?",
        a: "Sellz.pk has CNIC-verified sellers across Faisalabad. All listings include live photos of the actual item. You can message sellers directly and arrange a meeting in Faisalabad to inspect before buying. No anonymous sellers — every account is verified.",
      },
      {
        q: "How do I post a free ad in Faisalabad?",
        a: "Sign up on Sellz.pk, verify your CNIC, and post your listing for free. Your ad is immediately visible to buyers in Faisalabad. Live photos are required — taken directly from your camera. No charges for posting, no commission on sale.",
      },
    ],
  },
  peshawar: {
    cityName: "Peshawar",
    metaTitle: "Buy & Sell in Peshawar — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Peshawar from CNIC-verified sellers. Mobiles, vehicles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Peshawar — Verified Classifieds",
    intro: [
      "Find verified classifieds across Peshawar — Hayatabad, University Road, Saddar, Cantonment, and Ring Road. Every seller verifies their CNIC before posting.",
      "Browse live listings from real, identified people. All photos are taken using the camera at time of posting — no misleading images.",
    ],
    faqs: [
      {
        q: "How do I buy and sell safely in Peshawar online?",
        a: "Sellz.pk requires every seller in Peshawar to verify their CNIC before they can post. This eliminates anonymous and fraudulent sellers. Browse listings in Hayatabad, University Road, Saddar, and other areas. Meet in a public place in Peshawar to inspect items before buying.",
      },
      {
        q: "Is there a verified classifieds website for Peshawar?",
        a: "Yes, Sellz.pk has CNIC-verified listings from Peshawar across mobiles, electronics, vehicles, property, and more. Listings are shown chronologically so you always see the most recent first. No paid bumps, no manipulated rankings — just genuine listings from real people.",
      },
    ],
  },
  quetta: {
    cityName: "Quetta",
    metaTitle: "Buy & Sell in Quetta — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Quetta from CNIC-verified individual sellers. Mobiles, electronics, property and more on Sellz.pk.",
    h1: "Buy & Sell in Quetta — Verified Classifieds",
    intro: [
      "Sellz.pk brings verified classifieds to Quetta — Satellite Town, Airport Road, Jinnah Road, and beyond. Every seller is CNIC-verified before they can post.",
      "Real photos, real people. Browse listings from identified sellers you can trust.",
    ],
    faqs: [
      {
        q: "Where can I find genuine second-hand items for sale in Quetta?",
        a: "Sellz.pk has CNIC-verified sellers in Quetta posting mobiles, electronics, furniture, and more. All photos are taken live at time of posting — no stock images. Message sellers directly and meet in a public place to inspect before buying.",
      },
    ],
  },
  multan: {
    cityName: "Multan",
    metaTitle: "Buy & Sell in Multan — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Multan from CNIC-verified sellers. Mobiles, property, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Multan — Verified Classifieds",
    intro: [
      "Find verified classifieds across Multan — Cantt, Gulgasht Colony, Bosan Road, and Shah Rukn-e-Alam. Every seller verifies their CNIC before posting on Sellz.pk.",
      "All listing photos are live-taken at posting time. No fake images, no anonymous sellers. Genuine deals from verified individuals.",
    ],
    faqs: [
      {
        q: "How can I safely buy or sell in Multan online?",
        a: "Sellz.pk requires all sellers in Multan to verify their CNIC before posting. Photos must be taken live from the camera. You can message sellers directly through the platform and meet in a safe public location in Multan to inspect before buying. No advance payments — always inspect first.",
      },
    ],
  },
  gujranwala: {
    cityName: "Gujranwala",
    metaTitle: "Buy & Sell in Gujranwala — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Gujranwala from CNIC-verified sellers. Mobiles, electronics, property and more on Sellz.pk.",
    h1: "Buy & Sell in Gujranwala — Verified Classifieds",
    intro: [
      "Verified classifieds across Gujranwala — Satellite Town, Model Town, Trust Colony, and more. Every seller is CNIC-verified before posting on Sellz.pk.",
    ],
    faqs: [
      {
        q: "Where can I buy and sell items in Gujranwala safely?",
        a: "Sellz.pk has CNIC-verified sellers in Gujranwala listing mobiles, electronics, property, and more. All photos are live-taken. Contact sellers directly and arrange to meet locally before buying.",
      },
    ],
  },
  sialkot: {
    cityName: "Sialkot",
    metaTitle: "Buy & Sell in Sialkot — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Sialkot from CNIC-verified individual sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Sialkot — Verified Classifieds",
    intro: [
      "Verified classifieds in Sialkot — Cantt, Defence Road, Paris Road, and more. Every seller verifies their CNIC before listing on Sellz.pk.",
    ],
    faqs: [
      {
        q: "How do I sell items in Sialkot online?",
        a: "Post a free listing on Sellz.pk after CNIC verification. Your ad reaches buyers across Sialkot immediately. Live photos required — no stock images. No posting fees, no commission.",
      },
    ],
  },
  hyderabad: {
    cityName: "Hyderabad",
    metaTitle: "Buy & Sell in Hyderabad — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Hyderabad Sindh from CNIC-verified sellers. Mobiles, electronics, property and more on Sellz.pk.",
    h1: "Buy & Sell in Hyderabad — Verified Classifieds",
    intro: [
      "Verified classifieds across Hyderabad — Latifabad, Qasimabad, Hirabad, and more. Every seller is CNIC-verified before posting on Sellz.pk.",
    ],
    faqs: [
      {
        q: "Where can I buy and sell safely in Hyderabad?",
        a: "Sellz.pk has CNIC-verified sellers in Hyderabad. All listings have live photos. Message sellers directly and meet locally to inspect before buying.",
      },
    ],
  },
  abbottabad: {
    cityName: "Abbottabad",
    metaTitle: "Buy & Sell in Abbottabad — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Abbottabad from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Abbottabad — Verified Classifieds",
    intro: [
      "Verified classifieds in Abbottabad — Cantt, Mandian, Nawan Shehr. Every seller is CNIC-verified before posting on Sellz.pk.",
    ],
    faqs: [
      {
        q: "How do I find verified sellers in Abbottabad?",
        a: "All sellers on Sellz.pk are CNIC-verified before they can post. Browse listings in Abbottabad across mobiles, electronics, furniture, and more. Photos are live-taken so you see the actual item.",
      },
    ],
  },
  sukkur: {
    cityName: "Sukkur",
    metaTitle: "Buy & Sell in Sukkur — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Sukkur from CNIC-verified individual sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Sukkur — Verified Classifieds",
    intro: [
      "Verified classifieds in Sukkur. Every seller is CNIC-verified before posting on Sellz.pk. Real photos, honest listings.",
    ],
    faqs: [
      {
        q: "Is there a classifieds website for Sukkur?",
        a: "Sellz.pk covers Sukkur with CNIC-verified sellers. Post or browse listings across mobiles, electronics, furniture, and more. All photos are live-taken at time of posting.",
      },
    ],
  },
  mardan: {
    cityName: "Mardan",
    metaTitle: "Buy & Sell in Mardan — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Mardan from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Mardan — Verified Classifieds",
    intro: [
      "Verified classifieds in Mardan — Cantt and Gulshan Colony. Every seller is CNIC-verified before posting on Sellz.pk.",
    ],
    faqs: [
      {
        q: "How do I buy safely in Mardan?",
        a: "Sellz.pk verifies all sellers in Mardan by CNIC. Photos are live-taken. Message sellers and arrange to inspect items locally before buying.",
      },
    ],
  },
  mingora: {
    cityName: "Mingora",
    metaTitle: "Buy & Sell in Mingora — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Mingora Swat from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Mingora — Verified Classifieds",
    intro: [
      "Verified classifieds in Mingora, Swat. Every seller is CNIC-verified before posting on Sellz.pk. Browse real listings from identified sellers.",
    ],
    faqs: [
      {
        q: "Is there a classifieds website covering Mingora, Swat?",
        a: "Yes, Sellz.pk covers Mingora with CNIC-verified sellers. Browse mobiles, electronics, and more. All photos are live-taken. Message sellers directly through the platform.",
      },
    ],
  },
  larkana: {
    cityName: "Larkana",
    metaTitle: "Buy & Sell in Larkana — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Larkana from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Larkana — Verified Classifieds",
    intro: [
      "Verified classifieds in Larkana — Civil Lines, New Town. Every seller is CNIC-verified before posting on Sellz.pk.",
    ],
    faqs: [
      {
        q: "How do I find verified listings in Larkana?",
        a: "Sellz.pk requires all sellers in Larkana to verify their CNIC before posting. Browse and buy with confidence — real people, real items, live photos.",
      },
    ],
  },
  mirpur: {
    cityName: "Mirpur",
    metaTitle: "Buy & Sell in Mirpur AJK — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Mirpur AJK from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Mirpur AJK — Verified Classifieds",
    intro: [
      "Verified classifieds in Mirpur, AJK. Every seller is CNIC-verified before posting on Sellz.pk. Real photos, genuine listings.",
    ],
    faqs: [
      {
        q: "Is there a reliable classifieds website for Mirpur AJK?",
        a: "Sellz.pk covers Mirpur with CNIC-verified sellers. Browse mobiles, electronics, furniture and more. Live photos required — no stock images. Post free listings or buy with confidence.",
      },
    ],
  },
  muzaffarabad: {
    cityName: "Muzaffarabad",
    metaTitle: "Buy & Sell in Muzaffarabad — Verified Classifieds on Sellz.pk",
    metaDesc:
      "Buy and sell in Muzaffarabad AJK from CNIC-verified sellers. Mobiles, electronics and more on Sellz.pk.",
    h1: "Buy & Sell in Muzaffarabad — Verified Classifieds",
    intro: [
      "Verified classifieds in Muzaffarabad, AJK. Every seller is CNIC-verified before posting on Sellz.pk. Browse and buy safely.",
    ],
    faqs: [
      {
        q: "How do I buy and sell safely in Muzaffarabad?",
        a: "Sellz.pk verifies all sellers by CNIC before they can post. Browse listings in Muzaffarabad across mobiles, electronics, and more. All photos are live-taken. Arrange to inspect locally before buying.",
      },
    ],
  },
};

export const CITY_SLUGS = Object.keys(CITY_SEO);
