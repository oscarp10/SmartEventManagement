export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") ?? "http://localhost:5000";

export const ABOUT_IMAGE =
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=80";
export const CONTACT_IMAGE =
  "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1800&q=80";
export const SUPPORT_IMAGE =
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1800&q=80";

export const ANALYTICS_DATA = [
  { month: "Jan", attendance: 120 },
  { month: "Feb", attendance: 146 },
  { month: "Mar", attendance: 172 },
  { month: "Apr", attendance: 210 },
  { month: "May", attendance: 196 }
];
