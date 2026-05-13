import type { LucideIcon } from "lucide-react";
import { Smartphone, Car, Home, Tv, Sofa, Shirt, BookOpen, Baby, Wrench, PawPrint, Briefcase, Package } from "lucide-react";

export type FieldType = "select" | "text" | "number" | "boolean";

export type CategoryField = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  unit?: string;
  placeholder?: string;
  required?: boolean;
};

export type SubcategoryDef = {
  label: string;
  fields: CategoryField[];
};

export type Category = {
  slug: string;
  label: string;
  Icon: LucideIcon;
  color: string;
  iconColor: string;
  subcategories: SubcategoryDef[];
};

// ─── Field option lists ───────────────────────────────────────────────────────

const MOBILE_BRANDS = ["Samsung", "Apple", "Xiaomi", "Oppo", "Vivo", "Realme", "OnePlus", "Tecno", "Infinix", "Nokia", "Huawei", "Other"];
const STORAGE_OPTIONS = ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"];
const RAM_OPTIONS = ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"];
const PTA_OPTIONS = ["PTA Approved", "Non-PTA / JV", "Under Approval"];

const CAR_MAKES = ["Toyota", "Honda", "Suzuki", "Kia", "Hyundai", "Daihatsu", "Nissan", "Mitsubishi", "BMW", "Mercedes-Benz", "Audi", "Changan", "Proton", "MG", "Other"];
const FUEL_TYPES = ["Petrol", "CNG", "Petrol & CNG", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic", "CVT", "Semi-Automatic"];
const MOTO_MAKES = ["Honda", "Yamaha", "Suzuki", "United", "Ravi", "Road Prince", "Super Power", "Metro", "Hi-Speed", "Other"];
const MOTO_CC = ["70cc", "100cc", "110cc", "125cc", "150cc", "200cc", "250cc", "400cc+"];
const ASSEMBLY = ["Local", "Imported"];

const AREA_UNITS = ["Marla", "Kanal", "Sq Ft", "Sq Yard", "Acre"];
const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5", "6+"];
const BATH_OPTIONS = ["1", "2", "3", "4", "5+"];
const PURPOSE_OPTIONS = ["For Sale", "For Rent"];

const TV_BRANDS = ["Samsung", "LG", "Sony", "TCL", "Hisense", "Haier", "Orient", "Changhong Ruba", "Ecostar", "Other"];
const TV_SIZES = ['24"', '32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"+'];
const TV_PANELS = ["LED", "OLED", "QLED", "4K LED", "Full HD LED"];
const FRIDGE_BRANDS = ["Dawlance", "Haier", "PEL", "Samsung", "LG", "Waves", "Orient", "Kenwood", "Other"];
const FRIDGE_CAP = ["100–150 L", "150–200 L", "200–250 L", "250–300 L", "300–400 L", "400+ L"];
const FRIDGE_TYPES = ["Single Door", "Double Door", "Side-by-Side", "Mini Fridge", "Deep Freezer"];
const WM_BRANDS = ["Haier", "Dawlance", "Samsung", "LG", "PEL", "Kenwood", "Super Asia", "Other"];
const WM_CAPACITY = ["5 kg", "6 kg", "7 kg", "8 kg", "9 kg", "10 kg", "11+ kg"];
const WM_TYPES = ["Top Load Automatic", "Front Load Automatic", "Semi-Automatic", "Twin Tub"];
const AC_BRANDS = ["Gree", "Haier", "Dawlance", "Orient", "Kenwood", "LG", "Samsung", "Changhong Ruba", "Ecostar", "Other"];
const AC_TONS = ["0.75 Ton", "1 Ton", "1.5 Ton", "2 Ton", "2.5 Ton", "3 Ton"];
const AC_TYPES = ["Split AC", "Window AC", "Cassette AC", "Portable AC", "Floor Standing"];
const LAPTOP_BRANDS = ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "MSI", "Microsoft", "Other"];
const PC_BRANDS = ["Dell", "HP", "Lenovo", "Apple", "Custom Build", "Other"];
const PC_RAM = ["4GB", "8GB", "16GB", "32GB", "64GB+"];
const PC_STORAGE = ["128GB SSD", "256GB SSD", "512GB SSD", "1TB SSD", "1TB HDD", "2TB HDD", "2TB+ HDD"];
const CAM_BRANDS = ["Canon", "Nikon", "Sony", "Fujifilm", "Panasonic", "Olympus", "GoPro", "DJI", "Other"];
const CAM_TYPES = ["DSLR", "Mirrorless", "Point & Shoot", "Action Camera", "Drone", "Security Camera"];

const CLOTHING_SIZES_MEN = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const CLOTHING_SIZES_WOMEN = ["XS", "S", "M", "L", "XL", "XXL"];
const KIDS_SIZES = ["0–3 Months", "3–6 Months", "6–12 Months", "1 Year", "2 Years", "3 Years", "4 Years", "5–6 Years", "7–8 Years", "9–10 Years", "11–12 Years", "12+ Years"];
const WATCH_TYPES = ["Analog", "Digital", "Smart Watch", "Pocket Watch"];
const BAG_TYPES = ["Handbag", "Backpack", "Clutch", "Tote", "Wallet", "Laptop Bag", "Trolley", "Other"];
const JEWELLERY_MATERIALS = ["Gold (22K)", "Gold (18K)", "Silver", "Diamond", "Pearl", "Artificial", "Stone", "Other"];

const LIVESTOCK_TYPES = ["Cow", "Goat", "Sheep", "Buffalo", "Camel", "Hen", "Rooster", "Other"];
const PET_AGES = ["Less than 1 month", "1–3 months", "3–6 months", "6–12 months", "1–2 years", "2–5 years", "5+ years"];
const PET_GENDERS = ["Male", "Female", "Unknown"];

const EXPERIENCE_LEVELS = ["Fresh / No Experience", "Less than 1 year", "1–2 years", "3–5 years", "5–10 years", "10+ years"];

// ─── Category definitions ─────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    slug: "mobiles", label: "Mobiles", Icon: Smartphone, color: "#e8f5e9", iconColor: "#1D9E75",
    subcategories: [
      {
        label: "Mobile Phones", fields: [
          { key: "brand", label: "Brand", type: "select", options: MOBILE_BRANDS, required: true },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. Galaxy A54, iPhone 14", required: true },
          { key: "storage", label: "Storage", type: "select", options: STORAGE_OPTIONS },
          { key: "ram", label: "RAM", type: "select", options: RAM_OPTIONS },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Midnight Black" },
          { key: "pta_status", label: "PTA Status", type: "select", options: PTA_OPTIONS },
        ],
      },
      {
        label: "Tablets", fields: [
          { key: "brand", label: "Brand", type: "select", options: MOBILE_BRANDS },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. iPad Air, Galaxy Tab S8" },
          { key: "storage", label: "Storage", type: "select", options: STORAGE_OPTIONS },
          { key: "ram", label: "RAM", type: "select", options: RAM_OPTIONS },
          { key: "connectivity", label: "Connectivity", type: "select", options: ["Wi-Fi Only", "Wi-Fi + SIM"] },
        ],
      },
      {
        label: "Accessories", fields: [
          { key: "accessory_type", label: "Type", type: "select", options: ["Charger", "Case / Cover", "Screen Protector", "Earphones / Headphones", "Power Bank", "Cable", "Memory Card", "Selfie Stick", "Holder / Mount", "Other"] },
          { key: "compatible_with", label: "Compatible With", type: "text", placeholder: "e.g. iPhone 15, Samsung S24" },
        ],
      },
      {
        label: "SIM Cards", fields: [
          { key: "network", label: "Network", type: "select", options: ["Jazz", "Telenor", "Zong", "Ufone", "SCOM"], required: true },
          { key: "sim_type", label: "SIM Type", type: "select", options: ["Golden Number", "Regular", "Data SIM"] },
        ],
      },
    ],
  },

  {
    slug: "vehicles", label: "Vehicles", Icon: Car, color: "#fde8e0", iconColor: "#E85D24",
    subcategories: [
      {
        label: "Cars", fields: [
          { key: "make", label: "Make", type: "select", options: CAR_MAKES, required: true },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. Corolla, Civic, Alto", required: true },
          { key: "year", label: "Year", type: "number", placeholder: "e.g. 2022" },
          { key: "mileage", label: "Mileage", type: "number", unit: "km", placeholder: "e.g. 45000" },
          { key: "fuel", label: "Fuel Type", type: "select", options: FUEL_TYPES },
          { key: "transmission", label: "Transmission", type: "select", options: TRANSMISSIONS },
          { key: "engine_cc", label: "Engine CC", type: "text", placeholder: "e.g. 1300, 1800" },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Pearl White" },
          { key: "assembly", label: "Assembly", type: "select", options: ASSEMBLY },
          { key: "registered_city", label: "Registered In", type: "text", placeholder: "e.g. Karachi, Lahore" },
        ],
      },
      {
        label: "Motorcycles", fields: [
          { key: "make", label: "Make", type: "select", options: MOTO_MAKES, required: true },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. CD 70, CG 125" },
          { key: "year", label: "Year", type: "number", placeholder: "e.g. 2023" },
          { key: "mileage", label: "Mileage", type: "number", unit: "km", placeholder: "e.g. 12000" },
          { key: "engine_cc", label: "Engine", type: "select", options: MOTO_CC },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Black Red" },
        ],
      },
      {
        label: "Rickshaws", fields: [
          { key: "make", label: "Make", type: "text", placeholder: "e.g. Qingqi, Apsco" },
          { key: "year", label: "Year", type: "number", placeholder: "e.g. 2021" },
          { key: "fuel", label: "Fuel Type", type: "select", options: ["CNG", "Petrol"] },
        ],
      },
      {
        label: "Trucks & Buses", fields: [
          { key: "vehicle_type", label: "Type", type: "select", options: ["Truck", "Bus", "Mini Bus", "Dumper", "Trailer", "Van", "Other"] },
          { key: "make", label: "Make", type: "text", placeholder: "e.g. Hino, Isuzu, Tata" },
          { key: "year", label: "Year", type: "number", placeholder: "e.g. 2019" },
          { key: "mileage", label: "Mileage", type: "number", unit: "km" },
        ],
      },
      {
        label: "Boats", fields: [
          { key: "boat_type", label: "Type", type: "text", placeholder: "e.g. Fishing Boat, Speed Boat" },
          { key: "length_ft", label: "Length", type: "text", unit: "ft", placeholder: "e.g. 20" },
          { key: "engine_hp", label: "Engine Power", type: "text", unit: "HP", placeholder: "e.g. 40" },
        ],
      },
      {
        label: "Auto Parts", fields: [
          { key: "part_type", label: "Part Name", type: "text", placeholder: "e.g. Headlight, Bumper, Engine" },
          { key: "compatible_with", label: "Compatible With", type: "text", placeholder: "e.g. Toyota Corolla 2018–2022" },
          { key: "part_condition", label: "Part Condition", type: "select", options: ["Original OEM", "Aftermarket", "Used / Pulled", "Refurbished"] },
        ],
      },
      {
        label: "Vehicle Accessories", fields: [
          { key: "accessory_type", label: "Accessory Type", type: "text", placeholder: "e.g. Car Cover, Seat Cover, Dashcam" },
          { key: "compatible_with", label: "Compatible With", type: "text", placeholder: "e.g. Universal, Honda City" },
        ],
      },
    ],
  },

  {
    slug: "property", label: "Property", Icon: Home, color: "#fff8e1", iconColor: "#F59E0B",
    subcategories: [
      {
        label: "Houses", fields: [
          { key: "purpose", label: "Purpose", type: "select", options: PURPOSE_OPTIONS, required: true },
          { key: "bedrooms", label: "Bedrooms", type: "select", options: BEDROOM_OPTIONS },
          { key: "bathrooms", label: "Bathrooms", type: "select", options: BATH_OPTIONS },
          { key: "area_size", label: "Area Size", type: "text", placeholder: "e.g. 5, 240" },
          { key: "area_unit", label: "Area Unit", type: "select", options: AREA_UNITS },
          { key: "floors", label: "Floors", type: "select", options: ["1", "2", "3", "4+"] },
        ],
      },
      {
        label: "Apartments", fields: [
          { key: "purpose", label: "Purpose", type: "select", options: PURPOSE_OPTIONS, required: true },
          { key: "bedrooms", label: "Bedrooms", type: "select", options: BEDROOM_OPTIONS },
          { key: "bathrooms", label: "Bathrooms", type: "select", options: BATH_OPTIONS },
          { key: "floor", label: "Floor", type: "text", placeholder: "e.g. 3rd, Ground" },
          { key: "area_size", label: "Area Size", type: "text", placeholder: "e.g. 1200" },
          { key: "area_unit", label: "Area Unit", type: "select", options: AREA_UNITS },
        ],
      },
      {
        label: "Plots", fields: [
          { key: "purpose", label: "Purpose", type: "select", options: PURPOSE_OPTIONS, required: true },
          { key: "plot_type", label: "Plot Type", type: "select", options: ["Residential", "Commercial", "Industrial", "Agricultural"] },
          { key: "area_size", label: "Area Size", type: "text", placeholder: "e.g. 5, 240" },
          { key: "area_unit", label: "Area Unit", type: "select", options: AREA_UNITS },
        ],
      },
      {
        label: "Shops & Offices", fields: [
          { key: "purpose", label: "Purpose", type: "select", options: PURPOSE_OPTIONS, required: true },
          { key: "space_type", label: "Type", type: "select", options: ["Shop", "Office", "Showroom", "Warehouse", "Factory"] },
          { key: "area_size", label: "Area Size", type: "text", placeholder: "e.g. 500" },
          { key: "area_unit", label: "Area Unit", type: "select", options: AREA_UNITS },
          { key: "floor", label: "Floor", type: "text", placeholder: "e.g. Ground, 1st" },
        ],
      },
      {
        label: "Rooms", fields: [
          { key: "room_type", label: "Room Type", type: "select", options: ["Single Room", "Double Room", "Furnished Room", "Hostel Bed"] },
          { key: "attached_bath", label: "Attached Bathroom", type: "boolean" },
          { key: "furnished", label: "Furnished", type: "boolean" },
        ],
      },
      {
        label: "Vacation Rentals", fields: [
          { key: "rental_type", label: "Type", type: "select", options: ["Room", "Apartment", "House", "Chalet", "Farmhouse", "Cottage"] },
          { key: "bedrooms", label: "Bedrooms", type: "select", options: BEDROOM_OPTIONS },
          { key: "max_guests", label: "Max Guests", type: "text", placeholder: "e.g. 6" },
        ],
      },
    ],
  },

  {
    slug: "electronics", label: "Electronics", Icon: Tv, color: "#ede9fe", iconColor: "#6366F1",
    subcategories: [
      {
        label: "TVs", fields: [
          { key: "brand", label: "Brand", type: "select", options: TV_BRANDS, required: true },
          { key: "screen_size", label: "Screen Size", type: "select", options: TV_SIZES },
          { key: "panel_type", label: "Panel Type", type: "select", options: TV_PANELS },
          { key: "smart_tv", label: "Smart TV", type: "boolean" },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. 55Q80C" },
        ],
      },
      {
        label: "Fridges & Freezers", fields: [
          { key: "brand", label: "Brand", type: "select", options: FRIDGE_BRANDS, required: true },
          { key: "capacity", label: "Capacity", type: "select", options: FRIDGE_CAP },
          { key: "fridge_type", label: "Type", type: "select", options: FRIDGE_TYPES },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. 9165 WBM" },
        ],
      },
      {
        label: "Washing Machines", fields: [
          { key: "brand", label: "Brand", type: "select", options: WM_BRANDS, required: true },
          { key: "capacity", label: "Capacity", type: "select", options: WM_CAPACITY },
          { key: "wm_type", label: "Type", type: "select", options: WM_TYPES },
        ],
      },
      {
        label: "ACs", fields: [
          { key: "brand", label: "Brand", type: "select", options: AC_BRANDS, required: true },
          { key: "capacity", label: "Capacity", type: "select", options: AC_TONS },
          { key: "ac_type", label: "Type", type: "select", options: AC_TYPES },
          { key: "inverter", label: "Inverter", type: "boolean" },
        ],
      },
      {
        label: "Generators & UPS", fields: [
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Honda, Perkins, APC" },
          { key: "gen_type", label: "Type", type: "select", options: ["Generator", "UPS", "Inverter", "Solar System"] },
          { key: "capacity", label: "Capacity", type: "text", placeholder: "e.g. 5 KVA, 2000W" },
          { key: "fuel", label: "Fuel", type: "select", options: ["Petrol", "Diesel", "Gas", "N/A"] },
        ],
      },
      {
        label: "Computers", fields: [
          { key: "pc_type", label: "Type", type: "select", options: ["Laptop", "Desktop", "All-in-One", "Mac"], required: true },
          { key: "brand", label: "Brand", type: "select", options: [...LAPTOP_BRANDS, ...PC_BRANDS.filter(b => !LAPTOP_BRANDS.includes(b))] },
          { key: "processor", label: "Processor", type: "text", placeholder: "e.g. Intel i7-12th Gen, Ryzen 5 5500" },
          { key: "ram", label: "RAM", type: "select", options: PC_RAM },
          { key: "storage", label: "Storage", type: "select", options: PC_STORAGE },
          { key: "gpu", label: "GPU / Graphics", type: "text", placeholder: "e.g. RTX 3060, Integrated" },
          { key: "display", label: "Display Size", type: "text", placeholder: "e.g. 15.6\"" },
        ],
      },
      {
        label: "Cameras", fields: [
          { key: "brand", label: "Brand", type: "select", options: CAM_BRANDS, required: true },
          { key: "cam_type", label: "Type", type: "select", options: CAM_TYPES },
          { key: "model", label: "Model", type: "text", placeholder: "e.g. EOS 80D, A7 III" },
          { key: "megapixels", label: "Megapixels", type: "text", placeholder: "e.g. 24.1 MP" },
        ],
      },
      {
        label: "Other Electronics", fields: [
          { key: "electronics_type", label: "Item Type", type: "text", placeholder: "e.g. Projector, Soundbar, Router" },
          { key: "brand", label: "Brand", type: "text", placeholder: "Brand name" },
        ],
      },
    ],
  },

  {
    slug: "furniture", label: "Furniture", Icon: Sofa, color: "#e0f2fe", iconColor: "#0EA5E9",
    subcategories: [
      {
        label: "Sofa Sets", fields: [
          { key: "seating", label: "Seating Capacity", type: "select", options: ["1 Seater", "2 Seater", "3 Seater", "5 Seater (3+2)", "7 Seater (3+2+2)", "L-Shape", "Corner Sofa"] },
          { key: "material", label: "Material", type: "select", options: ["Leather", "Suede / Velvet", "Fabric", "Rexine", "Other"] },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Beige, Dark Brown" },
        ],
      },
      {
        label: "Beds", fields: [
          { key: "bed_size", label: "Size", type: "select", options: ["Single", "Double", "Queen", "King", "Bunk Bed", "Divan"] },
          { key: "material", label: "Material", type: "select", options: ["Solid Wood", "Engineered Wood", "Metal", "Upholstered", "Other"] },
          { key: "with_mattress", label: "With Mattress", type: "boolean" },
        ],
      },
      {
        label: "Dining Tables", fields: [
          { key: "seats", label: "Seats", type: "select", options: ["2", "4", "6", "8", "10", "12+"] },
          { key: "material", label: "Material", type: "select", options: ["Wood", "Glass", "Marble", "Metal", "Other"] },
          { key: "with_chairs", label: "With Chairs", type: "boolean" },
        ],
      },
      {
        label: "Wardrobes", fields: [
          { key: "doors", label: "Doors", type: "select", options: ["2 Doors", "3 Doors", "4 Doors", "Sliding"] },
          { key: "material", label: "Material", type: "select", options: ["Solid Wood", "Engineered Wood", "Steel", "Other"] },
          { key: "with_mirror", label: "With Mirror", type: "boolean" },
        ],
      },
      {
        label: "Curtains & Rugs", fields: [
          { key: "item_type", label: "Item", type: "select", options: ["Curtains", "Blinds", "Rug / Carpet", "Shaggy Rug", "Janamaz", "Other"] },
          { key: "color", label: "Color / Pattern", type: "text", placeholder: "e.g. Beige floral" },
        ],
      },
      {
        label: "Home Decor", fields: [
          { key: "decor_type", label: "Item Type", type: "text", placeholder: "e.g. Wall Art, Vase, Mirror, Lamp" },
        ],
      },
    ],
  },

  {
    slug: "fashion", label: "Fashion", Icon: Shirt, color: "#fce7f3", iconColor: "#EC4899",
    subcategories: [
      {
        label: "Men's Clothing", fields: [
          { key: "clothing_type", label: "Type", type: "select", options: ["Shalwar Kameez", "Kurta", "Suit", "Shirt", "T-Shirt", "Jeans / Pants", "Jacket", "Shawl / Waistcoat", "Other"] },
          { key: "size", label: "Size", type: "select", options: CLOTHING_SIZES_MEN },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Bonanza, J.", required: false },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. White, Navy" },
        ],
      },
      {
        label: "Women's Clothing", fields: [
          { key: "clothing_type", label: "Type", type: "select", options: ["Shalwar Kameez", "Saree", "Dress", "Kurta", "Abaya", "Lehenga", "Jacket", "Tops", "Other"] },
          { key: "size", label: "Size", type: "select", options: CLOTHING_SIZES_WOMEN },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Khaadi, Gul Ahmed" },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Emerald Green" },
        ],
      },
      {
        label: "Kids' Clothing", fields: [
          { key: "size", label: "Size / Age", type: "select", options: KIDS_SIZES },
          { key: "gender", label: "For", type: "select", options: ["Boys", "Girls", "Unisex"] },
          { key: "clothing_type", label: "Type", type: "text", placeholder: "e.g. Suit, Dress, Shirt" },
        ],
      },
      {
        label: "Shoes", fields: [
          { key: "gender", label: "For", type: "select", options: ["Men", "Women", "Kids"], required: true },
          { key: "shoe_size", label: "Size (UK)", type: "text", placeholder: "e.g. 9, 7, 4" },
          { key: "shoe_type", label: "Type", type: "select", options: ["Sneakers", "Sandals", "Formal Shoes", "Boots", "Slippers / Chappal", "Sports Shoes", "Heels", "Other"] },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Servis, Bata, Nike" },
        ],
      },
      {
        label: "Watches", fields: [
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Casio, Rolex, Fossil", required: true },
          { key: "watch_type", label: "Type", type: "select", options: WATCH_TYPES },
          { key: "gender", label: "For", type: "select", options: ["Men", "Women", "Unisex"] },
        ],
      },
      {
        label: "Bags", fields: [
          { key: "bag_type", label: "Type", type: "select", options: BAG_TYPES, required: true },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Gucci, Local Brand" },
          { key: "color", label: "Color", type: "text", placeholder: "e.g. Black" },
          { key: "material", label: "Material", type: "select", options: ["Leather", "Rexine", "Canvas", "Fabric", "Plastic", "Other"] },
        ],
      },
      {
        label: "Jewellery", fields: [
          { key: "jewellery_type", label: "Type", type: "text", placeholder: "e.g. Necklace, Ring, Earrings, Bracelet", required: true },
          { key: "material", label: "Material", type: "select", options: JEWELLERY_MATERIALS },
          { key: "weight", label: "Weight (grams)", type: "text", placeholder: "e.g. 12.5" },
          { key: "gender", label: "For", type: "select", options: ["Women", "Men", "Kids", "Unisex"] },
        ],
      },
    ],
  },

  {
    slug: "books-sports", label: "Books & Sports", Icon: BookOpen, color: "#d1fae5", iconColor: "#10B981",
    subcategories: [
      {
        label: "Books & Magazines", fields: [
          { key: "genre", label: "Genre / Subject", type: "select", options: ["Fiction", "Non-Fiction", "Islamic", "Education / Textbook", "Self-Help", "Biography", "Kids Book", "Magazine", "Comics", "Other"] },
          { key: "language", label: "Language", type: "select", options: ["Urdu", "English", "Arabic", "Other"] },
          { key: "author", label: "Author", type: "text", placeholder: "e.g. Bano Qudsia" },
        ],
      },
      {
        label: "Sports Equipment", fields: [
          { key: "sport", label: "Sport", type: "select", options: ["Cricket", "Football", "Volleyball", "Basketball", "Badminton", "Tennis", "Hockey", "Swimming", "Cycling", "Other"] },
          { key: "equipment_type", label: "Equipment", type: "text", placeholder: "e.g. Bat, Ball, Jersey" },
        ],
      },
      {
        label: "Musical Instruments", fields: [
          { key: "instrument", label: "Instrument", type: "select", options: ["Guitar", "Violin", "Keyboard", "Tabla", "Harmonium", "Flute", "Drums", "Ukulele", "Other"] },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Yamaha, Casio" },
        ],
      },
      {
        label: "Gym Equipment", fields: [
          { key: "equipment_type", label: "Equipment Type", type: "select", options: ["Treadmill", "Dumbbells", "Bench", "Barbell Set", "Pull-Up Bar", "Resistance Bands", "Stationary Bike", "Elliptical", "Weight Plates", "Other"] },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Cybex, Local" },
        ],
      },
      {
        label: "Art & Collectibles", fields: [
          { key: "item_type", label: "Item", type: "text", placeholder: "e.g. Painting, Coin, Antique" },
        ],
      },
    ],
  },

  {
    slug: "kids", label: "Kids", Icon: Baby, color: "#fff3e0", iconColor: "#F97316",
    subcategories: [
      {
        label: "Baby Gear", fields: [
          { key: "item_type", label: "Item", type: "select", options: ["Stroller / Pram", "Car Seat", "Baby Crib / Cot", "High Chair", "Baby Walker", "Baby Monitor", "Baby Swing", "Bath Tub", "Other"] },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. Mothercare, Graco" },
          { key: "age_range", label: "Age Range", type: "text", placeholder: "e.g. 0–6 months" },
        ],
      },
      {
        label: "Toys", fields: [
          { key: "toy_type", label: "Toy Type", type: "select", options: ["Action Figures", "Dolls", "Board Games", "Puzzles", "Building Blocks / LEGO", "Remote Control Toys", "Educational Toys", "Outdoor Toys", "Stuffed Animals", "Other"] },
          { key: "age_group", label: "Age Group", type: "select", options: ["0–2 years", "3–5 years", "6–8 years", "9–12 years", "12+ years"] },
          { key: "brand", label: "Brand", type: "text", placeholder: "e.g. LEGO, Hot Wheels" },
        ],
      },
      {
        label: "Kids' Furniture", fields: [
          { key: "item_type", label: "Item", type: "select", options: ["Baby Crib", "Kids Bed", "Study Table", "Kids Chair", "Bookshelf", "Storage Unit", "Other"] },
          { key: "age_range", label: "Age Range", type: "text", placeholder: "e.g. 3–8 years" },
        ],
      },
    ],
  },

  {
    slug: "services", label: "Services", Icon: Wrench, color: "#ede9fe", iconColor: "#8B5CF6",
    subcategories: [
      {
        label: "Home Services", fields: [
          { key: "service_type", label: "Service", type: "select", options: ["Plumbing", "Electrical", "Painting", "Carpentry", "Cleaning", "AC Repair & Service", "Pest Control", "Renovation", "Interior Design", "Other"] },
          { key: "experience_years", label: "Experience", type: "select", options: EXPERIENCE_LEVELS },
        ],
      },
      {
        label: "Tutoring", fields: [
          { key: "subject", label: "Subject", type: "text", placeholder: "e.g. Maths, English, Physics", required: true },
          { key: "level", label: "Level", type: "select", options: ["Primary (Class 1–5)", "Middle (Class 6–8)", "Matric (Class 9–10)", "FSc / FA (Class 11–12)", "O-Level / A-Level", "Undergraduate", "Other"] },
          { key: "mode", label: "Mode", type: "select", options: ["Home Visit", "Online", "Both"] },
        ],
      },
      {
        label: "Repair Services", fields: [
          { key: "service_type", label: "Repair Type", type: "select", options: ["Mobile Repair", "Laptop / Computer Repair", "TV Repair", "AC Repair", "Fridge Repair", "Washing Machine Repair", "Generator Repair", "Vehicle Repair", "Other"] },
          { key: "experience_years", label: "Experience", type: "select", options: EXPERIENCE_LEVELS },
        ],
      },
      {
        label: "Other Services", fields: [
          { key: "service_type", label: "Service Type", type: "text", placeholder: "e.g. Photography, Tailoring, Catering", required: true },
        ],
      },
    ],
  },

  {
    slug: "animals", label: "Animals", Icon: PawPrint, color: "#ccfbf1", iconColor: "#14B8A6",
    subcategories: [
      {
        label: "Cats", fields: [
          { key: "breed", label: "Breed", type: "text", placeholder: "e.g. Persian, British Shorthair, Domestic", required: true },
          { key: "age", label: "Age", type: "select", options: PET_AGES },
          { key: "gender", label: "Gender", type: "select", options: PET_GENDERS },
          { key: "vaccinated", label: "Vaccinated", type: "boolean" },
          { key: "color", label: "Color / Markings", type: "text", placeholder: "e.g. White with grey" },
        ],
      },
      {
        label: "Dogs", fields: [
          { key: "breed", label: "Breed", type: "text", placeholder: "e.g. German Shepherd, Labrador", required: true },
          { key: "age", label: "Age", type: "select", options: PET_AGES },
          { key: "gender", label: "Gender", type: "select", options: PET_GENDERS },
          { key: "vaccinated", label: "Vaccinated", type: "boolean" },
        ],
      },
      {
        label: "Birds", fields: [
          { key: "species", label: "Species", type: "select", options: ["Parrot", "Love Birds", "Budgerigar (Budgie)", "Cockatiel", "Finch", "Pigeon", "Hen / Rooster", "Peacock", "Other"] },
          { key: "age", label: "Age", type: "select", options: PET_AGES },
          { key: "gender", label: "Gender", type: "select", options: PET_GENDERS },
          { key: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 1 pair, 3" },
          { key: "color", label: "Color / Mutation", type: "text", placeholder: "e.g. Yellow Pied" },
        ],
      },
      {
        label: "Fish", fields: [
          { key: "species", label: "Species", type: "text", placeholder: "e.g. Goldfish, Arowana, Guppy", required: true },
          { key: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 5 pairs" },
          { key: "with_tank", label: "With Tank / Aquarium", type: "boolean" },
        ],
      },
      {
        label: "Livestock", fields: [
          { key: "animal_type", label: "Animal", type: "select", options: LIVESTOCK_TYPES, required: true },
          { key: "breed", label: "Breed / Type", type: "text", placeholder: "e.g. Sahiwal, Desi" },
          { key: "age", label: "Age", type: "text", placeholder: "e.g. 2 years, 6 months" },
          { key: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 1, 3" },
          { key: "weight_kg", label: "Weight", type: "text", unit: "kg", placeholder: "e.g. 250" },
        ],
      },
      {
        label: "Other Animals", fields: [
          { key: "animal_type", label: "Animal Type", type: "text", placeholder: "e.g. Rabbit, Hamster, Turtle", required: true },
          { key: "quantity", label: "Quantity", type: "text", placeholder: "e.g. 1 pair" },
        ],
      },
    ],
  },

  {
    slug: "jobs", label: "Jobs", Icon: Briefcase, color: "#e2e8f0", iconColor: "#64748B",
    subcategories: [
      {
        label: "Full Time", fields: [
          { key: "job_title", label: "Job Title", type: "text", placeholder: "e.g. Accountant, Sales Manager", required: true },
          { key: "company", label: "Company Name", type: "text", placeholder: "e.g. XYZ Pvt Ltd" },
          { key: "experience", label: "Experience Required", type: "select", options: EXPERIENCE_LEVELS },
          { key: "salary", label: "Monthly Salary (PKR)", type: "text", placeholder: "e.g. 50000" },
          { key: "education", label: "Education", type: "select", options: ["Matric", "Intermediate", "Bachelor's", "Master's", "Any"] },
        ],
      },
      {
        label: "Part Time", fields: [
          { key: "job_title", label: "Job Title", type: "text", placeholder: "e.g. Data Entry Operator", required: true },
          { key: "hours_per_week", label: "Hours/Week", type: "text", placeholder: "e.g. 20" },
          { key: "salary", label: "Pay", type: "text", placeholder: "e.g. Rs 500/hr, Rs 10000/month" },
        ],
      },
      {
        label: "Freelance", fields: [
          { key: "skill", label: "Skill / Service", type: "text", placeholder: "e.g. Web Development, Logo Design", required: true },
          { key: "rate_type", label: "Rate Type", type: "select", options: ["Hourly Rate", "Per Project", "Monthly Retainer"] },
          { key: "portfolio", label: "Portfolio Link", type: "text", placeholder: "e.g. behance.net/username" },
        ],
      },
    ],
  },

  {
    slug: "other", label: "Other", Icon: Package, color: "#ede9fe", iconColor: "#A78BFA",
    subcategories: [
      {
        label: "Everything Else", fields: [
          { key: "item_type", label: "What is it?", type: "text", placeholder: "Describe the item type", required: true },
        ],
      },
    ],
  },
];

export const CATEGORY_TABS = [
  { slug: "all", label: "All" },
  ...CATEGORIES.map(c => ({ slug: c.slug, label: c.label })),
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(c => c.slug === slug);
}

export function getSubcategories(slug: string): string[] {
  return getCategoryBySlug(slug)?.subcategories.map(s => s.label) ?? [];
}

export function getSubcategoryDef(categorySlug: string, subcategoryLabel: string): SubcategoryDef | undefined {
  return getCategoryBySlug(categorySlug)?.subcategories.find(s => s.label === subcategoryLabel);
}

export function getSubcategoryFields(categorySlug: string, subcategoryLabel: string): CategoryField[] {
  return getSubcategoryDef(categorySlug, subcategoryLabel)?.fields ?? [];
}

export const CONDITIONS = [
  "Brand New / Box Pack",
  "Like New (< 3 months)",
  "Excellent (10/10)",
  "Very Good (9/10)",
  "Good (8/10)",
  "Fair (minor repair needed)",
  "For Parts / Not Working",
];
