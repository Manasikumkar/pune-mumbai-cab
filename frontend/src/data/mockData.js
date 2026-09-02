/**
 * =====================================================================
 *  MOCK DATABASE — single source of truth for all site content
 * =====================================================================
 *  Every collection below mirrors a future database table / REST
 *  resource 1:1. The API layer (src/services/api.js) wraps these
 *  records in the standard response envelope:
 *
 *    { success: true, data: <record | record[]>, meta: { total, ... } }
 *
 *  When the real backend is ready, delete this file and flip
 *  `USE_MOCK_API` in src/services/api.js — no component changes needed.
 *
 *  Images are real photographs served from Pexels (free licence).
 * =====================================================================
 */

const pexels = (id, w = 1200, h = 800) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=${w}&h=${h}`;

/* --------------------------------------------------------------------
 * TABLE: vehicles
 * ------------------------------------------------------------------ */
export const vehicles = [
  {
    id: 1,
    name: "Sedan",
    slug: "sedan",
    type: "Sedan",
    models: ["Swift Dzire", "Honda Amaze", "Toyota Etios", "Hyundai Aura"],
    image: pexels(9544521, 900, 600),
    imageAlt:
      "White sedan cab for Pune to Mumbai one-way taxi service parked beside a scenic highway",
    seatingCapacity: 4,
    luggageCapacity: 2,
    description:
      "Best value for solo travellers, couples and small families. Comfortable AC sedans that are ideal for a quick Pune–Mumbai dash with light luggage.",
    features: ["Air conditioned", "Verified driver", "Music system", "Phone charging", "Sanitised daily"],
    bestFor: "Solo travellers, couples, light luggage",
    price: 2499,
    pricePerKm: 11,
    currency: "INR",
    isPopular: false,
    status: "active",
  },
  {
    id: 2,
    name: "SUV",
    slug: "suv",
    type: "SUV / MUV",
    models: ["Maruti Ertiga", "Kia Carens", "Mahindra Marazzo"],
    image: pexels(17612417, 900, 600),
    imageAlt:
      "White SUV taxi driving on a tree-lined highway, available for Pune Mumbai cab booking",
    seatingCapacity: 6,
    luggageCapacity: 3,
    description:
      "Roomy 6-seaters with a high driving position and generous boot space. Perfect for families and small groups heading to Mumbai for the weekend.",
    features: ["Air conditioned", "Verified driver", "Extra legroom", "Roof carrier on request", "Sanitised daily"],
    bestFor: "Families of 5–6, weekend luggage",
    price: 3299,
    pricePerKm: 14,
    currency: "INR",
    isPopular: true,
    status: "active",
  },
  {
    id: 3,
    name: "Toyota Innova",
    slug: "innova",
    type: "MPV",
    models: ["Toyota Innova"],
    image: pexels(30195580, 900, 600),
    imageAlt:
      "Toyota Innova MPV cab cruising on an expressway, seven-seater taxi from Pune to Mumbai",
    seatingCapacity: 7,
    luggageCapacity: 4,
    description:
      "India's most trusted long-distance people-mover. The Innova offers a smooth, quiet ride on the Expressway with space for seven plus luggage.",
    features: ["Air conditioned", "Experienced Innova driver", "Reclining seats", "Ample boot space", "Sanitised daily"],
    bestFor: "Groups of 6–7 with lots of luggage",
    price: 3699,
    pricePerKm: 16,
    currency: "INR",
    isPopular: false,
    status: "active",
  },
  {
    id: 4,
    name: "Toyota Innova Crysta",
    slug: "innova-crysta",
    type: "Premium MPV",
    models: ["Toyota Innova Crysta"],
    image: pexels(37029578, 900, 600),
    imageAlt:
      "Silver Toyota Innova Crysta premium cab on a tree-lined city road for Mumbai to Pune airport transfers",
    seatingCapacity: 7,
    luggageCapacity: 4,
    description:
      "Our premium pick for corporate travel and airport transfers. Captain seats, climate control and a whisper-quiet cabin for the entire 150 km.",
    features: ["Dual-zone climate control", "Captain seats", "Chauffeur in uniform", "Complimentary water", "Sanitised daily"],
    bestFor: "Corporate travel, premium airport transfers",
    price: 4299,
    pricePerKm: 18,
    currency: "INR",
    isPopular: false,
    status: "active",
  },
];

/* --------------------------------------------------------------------
 * TABLE: routes  (with nested route_pricing relation)
 * ------------------------------------------------------------------ */
export const routes = [
  {
    id: 1,
    name: "Pune to Mumbai Cab",
    slug: "pune-to-mumbai-cab",
    origin: "Pune",
    destination: "Mumbai",
    distance: 150,
    distanceUnit: "km",
    travelTime: "3 – 3.5 hours",
    travelTimeMinutes: 195,
    oneWayPrice: 2499,
    roundTripPrice: 4599,
    currency: "INR",
    tollAmount: 336,
    shortDescription:
      "Door-to-door one-way and round-trip taxi from anywhere in Pune to anywhere in Mumbai via the Mumbai–Pune Expressway.",
    description:
      "The Pune to Mumbai cab journey covers roughly 150 km, most of it on the six-lane Yashwantrao Chavan Expressway. Leaving Pune via Wakad or Chandni Chowk, you climb past Talegaon and Lonavala, descend the Bhor Ghat towards Khopoli and Panvel, and enter Mumbai through the Sion–Panvel highway or the Eastern Freeway. In normal traffic the drive takes 3 to 3.5 hours, including a short tea break at the Food Mall.",
    image: pexels(33898148, 1200, 800),
    imageAlt:
      "Mumbai–Pune Expressway winding through misty Sahyadri hills, the route taken by our Pune to Mumbai cabs",
    highlights: [
      { label: "Expressway", value: "Yashwantrao Chavan Expressway (94.5 km)" },
      { label: "Ghat section", value: "Khandala–Khopoli (Bhor Ghat)" },
      { label: "Break stop", value: "Food Mall, Khalapur" },
      { label: "Mumbai entry", value: "Sion–Panvel Hwy / Eastern Freeway" },
    ],
    pricing: [
      { vehicleSlug: "sedan", oneWayPrice: 2499, roundTripPrice: 4599 },
      { vehicleSlug: "suv", oneWayPrice: 3299, roundTripPrice: 5999 },
      { vehicleSlug: "innova", oneWayPrice: 3699, roundTripPrice: 6799 },
      { vehicleSlug: "innova-crysta", oneWayPrice: 4299, roundTripPrice: 7899 },
    ],
    inclusions: [
      "Expressway & NH-48 tolls",
      "Driver allowance",
      "Fuel and state taxes",
      "Doorstep pickup anywhere in Pune / PCMC",
      "One short refreshment stop",
    ],
    exclusions: ["5% GST", "Parking at destination (if any)", "Waiting beyond 45 minutes"],
    surcharges: [
      { label: "Mumbai airport drop (T1 / T2)", amount: 0, note: "No extra charge" },
      { label: "Night pickup (11 PM – 5 AM)", amount: 300 },
      { label: "Extra stop en route", amount: 200 },
    ],
    pickupPoints: [
      "Hinjewadi (Phase 1, 2 & 3)",
      "Wakad, Baner & Balewadi",
      "Aundh & Pashan",
      "Kothrud & Karve Nagar",
      "Shivajinagar, Deccan & Camp",
      "Pune Railway Station & Swargate",
      "Hadapsar, Magarpatta & Amanora",
      "Kharadi, Viman Nagar & Pune Airport (PNQ)",
      "Pimpri-Chinchwad, Nigdi & Akurdi",
      "Lonavala & Khandala (en-route pickup)",
    ],
    dropPoints: [
      "Mumbai Airport — T1 Santacruz & T2 Sahar",
      "Navi Mumbai International Airport (NMIA)",
      "Navi Mumbai — Vashi, Belapur, Kharghar & Panvel",
      "Thane, Mulund & Ghodbunder Road",
      "Powai, Andheri & Goregaon",
      "Bandra, BKC & Santacruz",
      "Dadar, Sion & Chembur",
      "Lower Parel, Worli & Prabhadevi",
      "South Mumbai — Colaba, Nariman Point & CST",
      "Borivali, Kandivali & Malad",
    ],
    airport: {
      code: "BOM",
      name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
      terminals: ["Terminal 1 (Santacruz) — domestic", "Terminal 2 (Sahar) — international & domestic"],
      note: "We recommend leaving Pune at least 5.5 hours before a domestic departure and 6.5 hours before an international one.",
    },
    status: "active",
  },
  {
    id: 2,
    name: "Mumbai to Pune Cab",
    slug: "mumbai-to-pune-cab",
    origin: "Mumbai",
    destination: "Pune",
    distance: 150,
    distanceUnit: "km",
    travelTime: "3 – 3.5 hours",
    travelTimeMinutes: 195,
    oneWayPrice: 2499,
    roundTripPrice: 4599,
    currency: "INR",
    tollAmount: 336,
    shortDescription:
      "Airport, hotel or doorstep pickup anywhere in Mumbai, Navi Mumbai or Thane with a fixed-fare drop to any address in Pune.",
    description:
      "Heading out of Mumbai, your cab uses the Eastern Freeway or Sion–Panvel Highway to reach Kalamboli, joins the Expressway at Kalamboli/Panvel and climbs the Bhor Ghat past Khopoli into the cool air of Khandala and Lonavala. From Talegaon it's a straight run into Pune via Wakad, Hinjewadi or Chandni Chowk. Business travellers landing at Mumbai Airport typically reach Hinjewadi or Kharadi in 3.5 to 4 hours door-to-door.",
    image: pexels(33350001, 1200, 800),
    imageAlt:
      "Bandra–Worli Sea Link and Mumbai skyline, starting point for our Mumbai to Pune taxi service",
    highlights: [
      { label: "Airport pickup", value: "T1, T2 & NMIA with meet-and-greet" },
      { label: "Mumbai exit", value: "Eastern Freeway → Kalamboli" },
      { label: "Ghat section", value: "Khopoli–Khandala climb" },
      { label: "Pune entry", value: "Wakad / Hinjewadi / Chandni Chowk" },
    ],
    pricing: [
      { vehicleSlug: "sedan", oneWayPrice: 2499, roundTripPrice: 4599 },
      { vehicleSlug: "suv", oneWayPrice: 3299, roundTripPrice: 5999 },
      { vehicleSlug: "innova", oneWayPrice: 3699, roundTripPrice: 6799 },
      { vehicleSlug: "innova-crysta", oneWayPrice: 4299, roundTripPrice: 7899 },
    ],
    inclusions: [
      "Expressway & NH-48 tolls",
      "Driver allowance",
      "Fuel and state taxes",
      "Doorstep drop anywhere in Pune / PCMC",
      "Flight tracking & 45 min free waiting at airport",
    ],
    exclusions: ["5% GST", "Airport parking fee (₹150–₹250, actuals)", "Waiting beyond 45 minutes"],
    surcharges: [
      { label: "Airport pickup — parking & meet-and-greet", amount: 250 },
      { label: "Night pickup (11 PM – 5 AM)", amount: 300 },
      { label: "Extra stop en route", amount: 200 },
    ],
    pickupPoints: [
      "Mumbai Airport — T1 Santacruz & T2 Sahar",
      "Navi Mumbai International Airport (NMIA)",
      "Andheri, Powai & Goregaon",
      "Bandra, BKC & Khar",
      "Dadar, Sion & Chembur",
      "Lower Parel, Worli & Mahalaxmi",
      "South Mumbai — Colaba, Churchgate & CST",
      "Thane, Mulund & Bhandup",
      "Navi Mumbai — Vashi, Nerul, Belapur & Kharghar",
      "Borivali, Kandivali & Malad",
    ],
    dropPoints: [
      "Hinjewadi IT Park (Phase 1, 2 & 3)",
      "Wakad, Baner & Balewadi",
      "Aundh, Pashan & Bavdhan",
      "Kothrud, Karve Nagar & Warje",
      "Shivajinagar, Deccan & Camp",
      "Kharadi, Viman Nagar & Pune Airport (PNQ)",
      "Hadapsar, Magarpatta & Amanora",
      "Pimpri-Chinchwad, Nigdi & Talegaon",
      "Pune Railway Station & Swargate",
      "Lonavala & Khandala (en-route drop)",
    ],
    airport: {
      code: "BOM",
      name: "Chhatrapati Shivaji Maharaj International Airport, Mumbai",
      terminals: ["Terminal 1 (Santacruz) — Gate 1 pickup", "Terminal 2 (Sahar) — P7 arrivals pickup"],
      note: "Share your flight number and we track it live. Your driver waits at arrivals with a name placard — no extra waiting charge for delayed flights up to 45 minutes.",
    },
    status: "active",
  },
];

/* --------------------------------------------------------------------
 * TABLE: faqs  (routeSlug = null → general / site-wide FAQ)
 * ------------------------------------------------------------------ */
export const faqs = [
  // --- General
  {
    id: 1,
    routeSlug: null,
    question: "How do I book a Pune Mumbai cab?",
    answer:
      "Book in under a minute: fill the booking form on this site, call us, or send a WhatsApp message with your pickup address, date and time. You'll receive a confirmation with the driver's name, photo and vehicle number 2 hours before pickup.",
  },
  {
    id: 2,
    routeSlug: null,
    question: "Are tolls and taxes included in the fare?",
    answer:
      "Yes. Our one-way and round-trip fares include Expressway tolls, driver allowance, fuel and state taxes. Only 5% GST and destination parking (if any) are extra. There are no hidden kilometre or return charges on one-way trips.",
  },
  {
    id: 3,
    routeSlug: null,
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made more than 6 hours before pickup are free. Cancellations within 6 hours attract a ₹300 charge, and no-shows are billed at 50% of the fare. Rescheduling is always free.",
  },
  {
    id: 4,
    routeSlug: null,
    question: "Which payment methods do you accept?",
    answer:
      "Pay by UPI (Google Pay, PhonePe, Paytm), debit/credit card, net banking or cash to the driver at the end of the trip. Corporate clients can opt for monthly invoicing.",
  },
  {
    id: 5,
    routeSlug: null,
    question: "Do you operate at night and on public holidays?",
    answer:
      "We run 24×7, 365 days a year, including Diwali, Holi and New Year's Eve. Night pickups (11 PM – 5 AM) carry a small ₹300 surcharge to compensate the driver.",
  },
  {
    id: 6,
    routeSlug: null,
    question: "Is a one-way fare really one-way, with no return charge?",
    answer:
      "Absolutely. You pay only for the direction you travel. Because we run cabs in both directions all day, we never pass on the empty-return cost to you.",
  },
  {
    id: 7,
    routeSlug: null,
    question: "How much luggage can I carry?",
    answer:
      "Sedans take 2 large suitcases plus cabin bags; SUVs and Innovas take 3–4 large suitcases. Tell us if you have extra luggage and we'll arrange a roof carrier or recommend a bigger car at no consultation charge.",
  },
  {
    id: 8,
    routeSlug: null,
    question: "Can I book a cab for my parents or a guest travelling alone?",
    answer:
      "Yes, and it's very common. Add the traveller's name and number in the booking form and we'll share driver details with both of you. Live trip tracking is available on request.",
  },

  // --- Pune → Mumbai
  {
    id: 9,
    routeSlug: "pune-to-mumbai-cab",
    question: "How long does a Pune to Mumbai cab take?",
    answer:
      "Typically 3 to 3.5 hours door-to-door. Early-morning departures (before 6 AM) are the fastest. Friday evenings, monsoon weekends and long-weekend Sundays can stretch to 4–4.5 hours because of traffic at the Khopoli exit and Mumbai entry points.",
  },
  {
    id: 10,
    routeSlug: "pune-to-mumbai-cab",
    question: "Do you drop directly at Mumbai Airport Terminal 2?",
    answer:
      "Yes. We drop at the T2 departures forecourt (Level 4) or T1 departures at no extra charge. Tell us your flight time and we'll suggest the ideal departure time from Pune with a buffer for check-in.",
  },
  {
    id: 11,
    routeSlug: "pune-to-mumbai-cab",
    question: "Can we stop at Lonavala on the way to Mumbai?",
    answer:
      "Of course. A short stop for chikki or a tea break at Lonavala or the Food Mall is included. A longer sightseeing halt (over 45 minutes) is charged as an extra stop at ₹200.",
  },
  {
    id: 12,
    routeSlug: "pune-to-mumbai-cab",
    question: "Do you pick up from Hinjewadi or Kharadi at 4 AM for early flights?",
    answer:
      "Yes — early-morning airport runs are our most popular Pune to Mumbai booking. Drivers are assigned the night before and reach 10 minutes early. A ₹300 night surcharge applies for pickups before 5 AM.",
  },
  {
    id: 13,
    routeSlug: "pune-to-mumbai-cab",
    question: "What is the Pune to Mumbai cab fare for a one-way trip?",
    answer:
      "One-way fares start at ₹2,499 for a sedan and ₹3,299 for an SUV, inclusive of tolls and driver allowance. Innova and Innova Crysta are ₹3,699 and ₹4,299 respectively. GST at 5% is extra.",
  },
  {
    id: 14,
    routeSlug: "pune-to-mumbai-cab",
    question: "Is it safe to travel Pune to Mumbai by cab at night?",
    answer:
      "Yes. The Expressway is well-lit, patrolled and has 24-hour emergency assistance. All our drivers are police-verified, breathalyser-tested before night trips, and every vehicle carries GPS tracking that you can share with family.",
  },

  // --- Mumbai → Pune
  {
    id: 15,
    routeSlug: "mumbai-to-pune-cab",
    question: "Where will the driver meet me at Mumbai Airport?",
    answer:
      "At Terminal 2 the driver waits at the P7 arrivals pickup with a name placard; at Terminal 1 it's Gate 1 arrivals. You'll receive the driver's number and live location on WhatsApp as soon as your flight lands.",
  },
  {
    id: 16,
    routeSlug: "mumbai-to-pune-cab",
    question: "What if my flight is delayed?",
    answer:
      "We track your flight number, so the driver's arrival adjusts automatically. The first 45 minutes of waiting after landing are free; beyond that, waiting is billed at ₹100 per 30 minutes.",
  },
  {
    id: 17,
    routeSlug: "mumbai-to-pune-cab",
    question: "Can I get a GST invoice for corporate travel?",
    answer:
      "Yes. Share your company's GSTIN at booking and a GST-compliant invoice is emailed within 24 hours of the trip. Frequent business travellers can open a monthly account with consolidated billing.",
  },
  {
    id: 18,
    routeSlug: "mumbai-to-pune-cab",
    question: "What is the Mumbai to Pune cab fare?",
    answer:
      "One-way fares start at ₹2,499 (sedan), ₹3,299 (SUV), ₹3,699 (Innova) and ₹4,299 (Innova Crysta), inclusive of Expressway tolls. Airport pickups add ₹250 for parking and meet-and-greet, and 5% GST applies.",
  },
  {
    id: 19,
    routeSlug: "mumbai-to-pune-cab",
    question: "Do you pick up from Navi Mumbai, Thane or the new Navi Mumbai Airport?",
    answer:
      "Yes. We cover all of Mumbai, Navi Mumbai (Vashi, Nerul, Belapur, Kharghar, Panvel), Thane and the Navi Mumbai International Airport at the same fixed fare. Pickups from Panvel/Kharghar actually save you 30–40 minutes of city traffic.",
  },
  {
    id: 20,
    routeSlug: "mumbai-to-pune-cab",
    question: "Can I do a same-day Mumbai–Pune–Mumbai round trip for a meeting?",
    answer:
      "Yes. Book a round trip and the same cab and driver stay with you in Pune for up to 8 hours / 300 km total. Round trips start at ₹4,599 for a sedan — far cheaper than two separate one-way bookings.",
  },
];

/* --------------------------------------------------------------------
 * TABLE: testimonials
 * ------------------------------------------------------------------ */
export const testimonials = [
  {
    id: 1,
    name: "Rohan Deshmukh",
    location: "Hinjewadi, Pune",
    rating: 5,
    text: "Booked a 4 AM pickup from Hinjewadi for a T2 international flight. Driver arrived 10 minutes early, car was spotless and we reached Mumbai Airport in 3 hours flat. Exactly the fixed fare quoted, no surprises.",
    tripType: "One Way",
    vehicleSlug: "sedan",
    date: "2026-01-18",
  },
  {
    id: 2,
    name: "Priya Iyer",
    location: "Andheri West, Mumbai",
    rating: 5,
    text: "I travel to our Magarpatta office twice a month and have used Pune Mumbai Cab for over a year. The Innova Crysta is always on time at T1 and the GST invoice lands in my inbox the same evening. Effortless.",
    tripType: "Round Trip",
    vehicleSlug: "innova-crysta",
    date: "2026-02-02",
  },
  {
    id: 3,
    name: "Amit Kulkarni",
    location: "Kothrud, Pune",
    rating: 5,
    text: "Took my parents and kids to Mumbai for a wedding in the SUV. Plenty of room for six of us plus bags, and the driver was patient with our Lonavala chikki stop. Highly recommended for families.",
    tripType: "Round Trip",
    vehicleSlug: "suv",
    date: "2025-12-14",
  },
  {
    id: 4,
    name: "Sneha Patil",
    location: "Thane West",
    rating: 4,
    text: "Smooth ride from Thane to Baner on a Friday evening. There was traffic near Khopoli but the driver kept us updated and took the alternate exit. Fair price and a very courteous driver.",
    tripType: "One Way",
    vehicleSlug: "sedan",
    date: "2026-01-30",
  },
  {
    id: 5,
    name: "Karan Mehta",
    location: "Powai, Mumbai",
    rating: 5,
    text: "Our startup uses them for all Mumbai–Pune client visits. Clean cars, professional drivers who don't over-speed on the ghats, and one consolidated monthly bill. What more can you ask for?",
    tripType: "One Way",
    vehicleSlug: "innova",
    date: "2025-11-22",
  },
  {
    id: 6,
    name: "Neha Joshi",
    location: "Baner, Pune",
    rating: 5,
    text: "Booked for my mother travelling alone to Dadar. They shared the driver's details with both of us and I could track the trip live on WhatsApp. She felt completely safe. Thank you!",
    tripType: "One Way",
    vehicleSlug: "sedan",
    date: "2026-02-11",
  },
];

/* --------------------------------------------------------------------
 * TABLE: services  (home page overview cards)
 * ------------------------------------------------------------------ */
export const services = [
  {
    id: 1,
    slug: "pune-to-mumbai",
    name: "Pune → Mumbai Cab",
    description: "Doorstep pickup anywhere in Pune with a fixed-fare drop across Mumbai, Navi Mumbai or Thane.",
    icon: "route",
    href: "/pune-to-mumbai-cab",
    startingPrice: 2499,
  },
  {
    id: 2,
    slug: "mumbai-to-pune",
    name: "Mumbai → Pune Cab",
    description: "Airport, hotel or home pickup in Mumbai with a comfortable Expressway ride to any Pune address.",
    icon: "route-reverse",
    href: "/mumbai-to-pune-cab",
    startingPrice: 2499,
  },
  {
    id: 3,
    slug: "one-way",
    name: "One Way Drop",
    description: "Pay only for the direction you travel — no return fare, no per-km surprises, tolls included.",
    icon: "one-way",
    href: "/fleet",
    startingPrice: 2499,
  },
  {
    id: 4,
    slug: "round-trip",
    name: "Round Trip",
    description: "Same cab and driver for your same-day meeting or weekend trip. Up to 8 hours of local use included.",
    icon: "round-trip",
    href: "/contact",
    startingPrice: 4599,
  },
  {
    id: 5,
    slug: "airport-transfer",
    name: "Airport Transfer",
    description: "Flight-tracked pickups and drops at Mumbai T1, T2, Navi Mumbai Airport and Pune Airport.",
    icon: "plane",
    href: "/mumbai-to-pune-cab#airport",
    startingPrice: 2499,
  },
];

/* --------------------------------------------------------------------
 * TABLE: company_stats
 * ------------------------------------------------------------------ */
export const companyStats = [
  { id: 1, label: "Trips completed", value: "25,000+" },
  { id: 2, label: "Average rating", value: "4.8 / 5" },
  { id: 3, label: "Years on the Expressway", value: "12+" },
  { id: 4, label: "On-time pickups", value: "99.2%" },
];

/* --------------------------------------------------------------------
 * TABLE: enquiries  (admin mock data)
 * NOTE: In production this lives in the database, not in-memory.
 * ------------------------------------------------------------------ */
export const enquiries = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "+919876543210",
    email: "rahul@example.com",
    pickupLocation: "Hinjewadi Phase 3, Pune",
    dropLocation: "Mumbai Airport T2",
    travelDate: "2026-09-10",
    travelTime: "05:30",
    tripType: "ONE_WAY",
    vehicleId: 1,
    vehicleName: "Sedan",
    passengers: 2,
    message: "Early morning airport drop, 2 large bags",
    status: "NEW",
    createdAt: "2026-09-01T10:30:00",
  },
  {
    id: 2,
    name: "Priya Desai",
    phone: "+919988776655",
    email: "priya.d@example.com",
    pickupLocation: "Bandra West, Mumbai",
    dropLocation: "Kothrud, Pune",
    travelDate: "2026-09-12",
    travelTime: "14:00",
    tripType: "ONE_WAY",
    vehicleId: 3,
    vehicleName: "Toyota Innova",
    passengers: 5,
    message: "Family trip with kids, need Innova",
    status: "CONTACTED",
    createdAt: "2026-09-01T08:15:00",
  },
  {
    id: 3,
    name: "Amit Joshi",
    phone: "+919123456789",
    email: "amit.joshi@corp.com",
    pickupLocation: "Magarpatta, Pune",
    dropLocation: "BKC, Mumbai",
    travelDate: "2026-09-08",
    travelTime: "07:00",
    tripType: "ROUND_TRIP",
    vehicleId: 4,
    vehicleName: "Toyota Innova Crysta",
    passengers: 3,
    message: "Corporate meeting, need GST invoice",
    status: "CONFIRMED",
    createdAt: "2026-08-28T16:45:00",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    phone: "+919811223344",
    email: "sneha.k@example.com",
    pickupLocation: "Vashi, Navi Mumbai",
    dropLocation: "Swargate, Pune",
    travelDate: "2026-09-05",
    travelTime: "09:00",
    tripType: "ONE_WAY",
    vehicleId: 2,
    vehicleName: "SUV",
    passengers: 4,
    message: "",
    status: "CLOSED",
    createdAt: "2026-08-25T12:00:00",
  },
];

/* --------------------------------------------------------------------
 * TABLE: adminUsers  (mock — password must be BCrypt hashed server-side)
 * ------------------------------------------------------------------ */
export const adminUser = {
  username: "admin",
  password: "admin123",
  role: "ADMIN",
};

/* Convenience export for the mock API router */
export const db = { vehicles, routes, faqs, testimonials, services, companyStats, enquiries, adminUser };
