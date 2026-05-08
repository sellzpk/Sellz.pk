export type CityData = { name: string; areas: string[] };

export const CITY_DATA: CityData[] = [
  { name: "Karachi", areas: ["DHA Phase 1","DHA Phase 2","DHA Phase 3","DHA Phase 4","DHA Phase 5","DHA Phase 6","DHA Phase 7","DHA Phase 8","Clifton","Gulshan-e-Iqbal","PECHS","North Nazimabad","Nazimabad","Korangi","Landhi","Malir","Saddar","Lyari","Orangi Town","FB Area","Gulberg","Johar","Scheme 33","Bahria Town","Defence View","Other"] },
  { name: "Lahore", areas: ["DHA Phase 1","DHA Phase 2","DHA Phase 3","DHA Phase 4","DHA Phase 5","DHA Phase 6","DHA Phase 7","DHA Phase 8","DHA Phase 9","Gulberg","Model Town","Johar Town","Bahria Town","Lake City","Cantt","Iqbal Town","Garden Town","Township","Faisal Town","Allama Iqbal Town","Wapda Town","Valencia","Other"] },
  { name: "Islamabad", areas: ["F-6","F-7","F-8","F-10","F-11","G-9","G-10","G-11","G-13","E-7","E-11","Blue Area","Bahria Town","DHA","Bani Gala","Other"] },
  { name: "Rawalpindi", areas: ["Bahria Town","DHA","Saddar","Chaklala","Adiala Road","Murree Road","Westridge","Other"] },
  { name: "Faisalabad", areas: ["Gulberg","Madina Town","Peoples Colony","Satiana Road","Jaranwala Road","Other"] },
  { name: "Peshawar", areas: ["Hayatabad","University Road","Saddar","Cantonment","Ring Road","Other"] },
  { name: "Quetta", areas: ["Satellite Town","Airport Road","Jinnah Road","Brewery Road","Other"] },
  { name: "Multan", areas: ["Cantt","Gulgasht Colony","Shah Rukn-e-Alam","Bosan Road","Other"] },
  { name: "Gujranwala", areas: ["Satellite Town","Model Town","Trust Colony","Other"] },
  { name: "Sialkot", areas: ["Cantt","Defence Road","Paris Road","Other"] },
  { name: "Hyderabad", areas: ["Latifabad","Qasimabad","Hirabad","Other"] },
  { name: "Abbottabad", areas: ["Cantt","Mandian","Nawan Shehr","Other"] },
  { name: "Sukkur", areas: ["Airport Road","Military Road","Other"] },
  { name: "Mardan", areas: ["Cantt","Gulshan Colony","Other"] },
  { name: "Mingora", areas: ["Fizagat","Imam Deri","Other"] },
  { name: "Larkana", areas: ["Civil Lines","New Town","Other"] },
  { name: "Mirpur", areas: ["Allama Iqbal Town","New Mirpur City","Other"] },
  { name: "Muzaffarabad", areas: ["Main City","Chattar Park","Other"] },
  { name: "Other City", areas: ["Other"] },
];

export const CITIES = CITY_DATA.map(c => c.name);

export function getAreas(city: string): string[] {
  return CITY_DATA.find(c => c.name === city)?.areas ?? [];
}
