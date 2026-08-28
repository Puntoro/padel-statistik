import { useState, useMemo, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, Legend, Cell } from "recharts";
import { storage } from "./storage";

// ============================================================
// THEME - Puntoro gold
// ============================================================
const T = {
  bg: "#FBF7EF",
  card: "#FFFFFF",
  cardAlt: "#F7F0E3",
  border: "#E5D6B8",
  borderLight: "#F0E6D3",
  accent: "#8F6D24",
  accentDark: "#6F5015",
  accentLight: "#F8F1DF",
  warm: "#A45F36",
  warmLight: "#F6E8DD",
  warmDark: "#7F4324",
  green: "#4F7A5A",
  greenLight: "#E8F1E9",
  red: "#C62828",
  redLight: "#FBEAEA",
  gold: "#8F6D24",
  goldLight: "#F8F1DF",
  brandGold: "#C9A24B",
  text: "#3D3024",
  textMid: "#665542",
  textMuted: "#756451",
  textLight: "#81705E",
  shadow: "0 2px 12px rgba(81,58,24,0.08)",
  shadowHover: "0 4px 20px rgba(81,58,24,0.14)",
  chartColors: ["#8F6D24", "#2F6F6C", "#A45F36", "#3F6E9D", "#4F7A5A", "#C62828", "#755394", "#7A5940"],
};

const MEDAL = ["🥇", "🥈", "🥉"];

// ============================================================
// ALL MATCH DAYS FROM CSVs - COMPLETE DATA
// ============================================================
const MATCH_DAYS_2024 = [
  { date:"2024-01-07", label:"7.1", players:[{name:"Manuele",s:3,w:0},{name:"Linus",s:3,w:2},{name:"Max",s:3,w:2},{name:"René",s:3,w:2}], teams:[] },
  { date:"2024-01-21", label:"21.1", players:[{name:"Manuele",s:3,w:2},{name:"Max",s:3,w:2},{name:"Floh",s:3,w:0},{name:"René",s:3,w:2}], teams:[] },
  { date:"2024-01-28", label:"28.1", players:[{name:"Manuele",s:4,w:3},{name:"Max",s:4,w:2},{name:"David",s:4,w:0},{name:"René",s:4,w:3}], teams:[] },
  { date:"2024-02-25", label:"25.2", players:[{name:"Max",s:4,w:3},{name:"Sinz",s:4,w:2},{name:"Floh",s:4,w:0},{name:"René",s:4,w:3}], teams:[] },
  { date:"2024-03-10", label:"10.3", players:[{name:"Manuele",s:6,w:1},{name:"Sinz",s:6,w:3},{name:"Andre",s:6,w:5},{name:"René",s:6,w:3}], teams:[] },
  { date:"2024-03-17", label:"17.3", players:[{name:"Manuele",s:4,w:2},{name:"Sinz",s:4,w:4},{name:"Linus",s:4,w:1},{name:"René",s:4,w:1}], teams:[] },
  { date:"2024-04-01", label:"1.4", players:[{name:"Manuele",s:4,w:3},{name:"Sinz",s:4,w:3},{name:"Benzer",s:4,w:0},{name:"René",s:4,w:2}], teams:[{t:"Benzer+René",s:2,w:0},{t:"Benzer+Manuele",s:1,w:0},{t:"Benzer+Sinz",s:1,w:0},{t:"Manuele+René",s:1,w:1},{t:"Manuele+Sinz",s:2,w:2},{t:"Sinz+René",s:1,w:1}] },
  { date:"2024-04-07", label:"7.4", players:[{name:"Manuele",s:7,w:5},{name:"Sinz",s:7,w:4},{name:"Benzer",s:7,w:0},{name:"René",s:7,w:5}], teams:[{t:"Benzer+René",s:2,w:0},{t:"Benzer+Manuele",s:2,w:0},{t:"Benzer+Sinz",s:3,w:0},{t:"Manuele+René",s:3,w:3},{t:"Manuele+Sinz",s:2,w:2},{t:"Sinz+René",s:2,w:2}] },
  { date:"2024-04-14", label:"14.4", players:[{name:"Benzer",s:6,w:3},{name:"Beni",s:6,w:3},{name:"Jan",s:6,w:6},{name:"René",s:6,w:0}], teams:[{t:"Beni+René",s:3,w:0},{t:"Beni+Jan",s:3,w:3},{t:"Benzer+Jan",s:3,w:3},{t:"Benzer+René",s:3,w:0}] },
  { date:"2024-04-18", label:"18.4", players:[{name:"Manuele",s:4,w:1},{name:"Max",s:4,w:2},{name:"Kasi",s:4,w:2},{name:"René",s:4,w:3}], teams:[{t:"Manuele+René",s:2,w:1},{t:"Max+Kasi",s:2,w:1},{t:"Max+Manuele",s:1,w:0},{t:"Max+René",s:1,w:1},{t:"Manuele+Kasi",s:1,w:0},{t:"Kasi+René",s:1,w:1}] },
  { date:"2024-04-26", label:"26.4", players:[{name:"Manuele",s:5,w:4},{name:"Max",s:5,w:3},{name:"Benzer",s:5,w:0},{name:"René",s:5,w:3}], teams:[{t:"Benzer+René",s:2,w:0},{t:"Benzer+Max",s:2,w:0},{t:"Benzer+Manuele",s:1,w:0},{t:"Manuele+Max",s:2,w:2},{t:"Manuele+René",s:2,w:2},{t:"Max+René",s:1,w:1}] },
  { date:"2024-05-10", label:"10.5", players:[{name:"Manuele",s:6,w:4},{name:"Max",s:6,w:4},{name:"Benzer",s:6,w:0},{name:"René",s:6,w:4}], teams:[{t:"Benzer+René",s:2,w:0},{t:"Benzer+Max",s:2,w:0},{t:"Benzer+Manuele",s:2,w:0},{t:"Manuele+Max",s:2,w:2},{t:"Manuele+René",s:2,w:2},{t:"Max+René",s:2,w:2}] },
  { date:"2024-05-16", label:"16.5", players:[{name:"Manuele",s:5,w:4},{name:"Max",s:5,w:4},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:1}], teams:[{t:"Benzer+René",s:5,w:1},{t:"Manuele+Max",s:5,w:4}] },
  { date:"2024-05-23", label:"23.5", players:[{name:"Manuele",s:4,w:3},{name:"Max",s:4,w:3},{name:"Kasi",s:4,w:1},{name:"René",s:4,w:1}], teams:[{t:"Max+Manuele",s:2,w:2},{t:"Max+Kasi",s:2,w:1},{t:"Manuele+René",s:2,w:1},{t:"Kasi+René",s:2,w:0}] },
  { date:"2024-05-30", label:"30.5", players:[{name:"Manuele",s:4,w:1},{name:"Kasi",s:4,w:3},{name:"Benzer",s:4,w:1},{name:"René",s:4,w:3}], teams:[{t:"Benzer+René",s:2,w:1},{t:"Benzer+Manuele",s:2,w:0},{t:"Kasi+René",s:2,w:2},{t:"Kasi+Manuele",s:2,w:1}] },
  { date:"2024-06-07", label:"7.6", players:[{name:"Max",s:5,w:1},{name:"Kasi",s:5,w:0},{name:"Santer",s:5,w:4},{name:"René",s:5,w:5}], teams:[{t:"Max+Kasi",s:4,w:0},{t:"Max+René",s:1,w:1},{t:"Santer+Kasi",s:1,w:0},{t:"Santer+René",s:4,w:4}] },
  { date:"2024-06-13", label:"13.6", players:[{name:"Max",s:5,w:3},{name:"Kasi",s:5,w:3},{name:"Santer",s:5,w:2},{name:"René",s:5,w:2}], teams:[{t:"Max+Kasi",s:5,w:3},{t:"Santer+René",s:5,w:2}] },
  { date:"2024-06-27", label:"27.6", players:[{name:"Manuele",s:5,w:3},{name:"Max",s:5,w:2},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:4}], teams:[{t:"Benzer+René",s:2,w:1},{t:"Benzer+Max",s:2,w:0},{t:"Benzer+Manuele",s:1,w:0},{t:"Manuele+Max",s:2,w:1},{t:"Manuele+René",s:2,w:2},{t:"Max+René",s:1,w:1}] },
  { date:"2024-07-11", label:"11.7", players:[{name:"Max",s:5,w:1},{name:"Manuele",s:5,w:5},{name:"Benzer",s:5,w:0},{name:"Kasi",s:4,w:4},{name:"Simon",s:4,w:2},{name:"Santer",s:4,w:2},{name:"Fränki",s:4,w:0},{name:"René",s:5,w:4}], teams:[{t:"Max+Benzer",s:2,w:0},{t:"Max+Manuele",s:1,w:1},{t:"Max+Fränki",s:2,w:0},{t:"Manuele+René",s:2,w:2},{t:"Manuele+Kasi",s:2,w:2},{t:"Benzer+René",s:1,w:0},{t:"Benzer+Simon",s:2,w:0},{t:"Kasi+Simon",s:2,w:2},{t:"Santer+Fränki",s:2,w:0},{t:"Santer+René",s:2,w:2}] },
  { date:"2024-07-18", label:"18.7", players:[{name:"Max",s:4,w:3},{name:"Manuele",s:4,w:1},{name:"Sinz",s:4,w:4},{name:"Benzer",s:3,w:2},{name:"Simon",s:3,w:0},{name:"Kasi",s:4,w:2},{name:"Santer",s:3,w:0},{name:"René",s:3,w:2}], teams:[{t:"Benzer+René",s:3,w:2},{t:"Sinz+Max",s:3,w:3},{t:"Max+Manuele",s:1,w:0},{t:"Kasi+Manuele",s:3,w:1},{t:"Simon+Santer",s:3,w:0},{t:"Sinz+Kasi",s:1,w:1}] },
  { date:"2024-07-25", label:"25.7", players:[{name:"Max",s:5,w:1},{name:"Manuele",s:7,w:4},{name:"Benzer",s:7,w:3},{name:"Simon V",s:4,w:3},{name:"Ricardo",s:6,w:3},{name:"Simon",s:6,w:5},{name:"Santer",s:4,w:1},{name:"René",s:5,w:2}], teams:[{t:"Manuele+René",s:3,w:1},{t:"Benzer+Max",s:3,w:1},{t:"Max+Santer",s:2,w:0},{t:"Simon V+Simon",s:2,w:2},{t:"Simon V+René",s:2,w:1},{t:"Ricardo+Santer",s:2,w:1},{t:"Benzer+Ricardo",s:4,w:2},{t:"Manuele+Simon",s:4,w:3}] },
  { date:"2024-08-01", label:"1.8", players:[{name:"Max",s:4,w:2},{name:"Manuele",s:4,w:2},{name:"Kasi",s:4,w:0},{name:"René",s:4,w:4}], teams:[{t:"Max+René",s:2,w:2},{t:"Max+Kasi",s:2,w:0},{t:"Kasi+Manuele",s:2,w:0},{t:"Manuele+René",s:2,w:2}] },
  { date:"2024-08-08", label:"8.8", players:[{name:"Simon V",s:4,w:1},{name:"Santer",s:4,w:1},{name:"Kasi",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Simon V+Santer",s:4,w:1},{t:"Kasi+René",s:4,w:3}] },
  { date:"2024-08-16", label:"16.8", players:[{name:"Simon V",s:4,w:0},{name:"Santer",s:4,w:1},{name:"Manuele",s:4,w:3},{name:"René",s:4,w:4}], teams:[{t:"Simon V+Santer",s:3,w:0},{t:"Simon V+Manuele",s:1,w:0},{t:"Manuele+René",s:3,w:3},{t:"Santer+René",s:1,w:1}] },
  { date:"2024-08-29", label:"29.8", players:[{name:"Simon V",s:4,w:0},{name:"Santer",s:4,w:3},{name:"Kasi",s:4,w:1},{name:"René",s:4,w:4}], teams:[{t:"Simon V+Kasi",s:3,w:0},{t:"Simon V+Santer",s:1,w:0},{t:"Santer+René",s:3,w:3},{t:"Kasi+René",s:1,w:1}] },
  { date:"2024-09-05", label:"5.9", players:[{name:"Manuele",s:4,w:1},{name:"Simon V",s:4,w:3},{name:"Max",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Manuele+René",s:3,w:1},{t:"Max+Simon V",s:3,w:2},{t:"Max+Manuele",s:1,w:0},{t:"Simon V+René",s:1,w:1}] },
  { date:"2024-09-15", label:"15.9", players:[{name:"Benzer",s:5,w:2},{name:"Manuele",s:5,w:3},{name:"Max",s:5,w:2},{name:"René",s:5,w:3}], teams:[{t:"Max+Manuele",s:4,w:2},{t:"Benzer+René",s:4,w:2},{t:"Benzer+Max",s:1,w:0},{t:"Manuele+René",s:1,w:1}] },
  { date:"2024-09-19", label:"19.9", players:[{name:"Simon V",s:4,w:1},{name:"Kasi",s:4,w:1},{name:"Max",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Simon V+Kasi",s:4,w:1},{t:"Max+René",s:4,w:3}] },
  { date:"2024-09-26", label:"26.9", players:[{name:"Simon V",s:4,w:1},{name:"Manuele",s:4,w:4},{name:"Kasi",s:4,w:0},{name:"René",s:4,w:3}], teams:[{t:"Simon V+Kasi",s:3,w:0},{t:"Simon V+Manuele",s:1,w:1},{t:"Kasi+René",s:1,w:0},{t:"Manuele+René",s:3,w:3}] },
  { date:"2024-10-03", label:"3.10", players:[{name:"Kasi",s:4,w:2},{name:"Benzer",s:4,w:2},{name:"Max",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Kasi+Max",s:4,w:2},{t:"Benzer+René",s:4,w:2}] },
  { date:"2024-10-13", label:"13.10", players:[{name:"Max",s:5,w:3},{name:"Manuele",s:5,w:1},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:5}], teams:[{t:"Benzer+Manuele",s:3,w:0},{t:"Benzer+Max",s:1,w:0},{t:"Benzer+René",s:1,w:1},{t:"Manuele+René",s:1,w:1},{t:"Max+René",s:2,w:2}] },
  { date:"2024-10-20", label:"20.10", players:[{name:"Max",s:5,w:4},{name:"Manuele",s:5,w:3},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:2}], teams:[{t:"Benzer+Manuele",s:3,w:1},{t:"Max+René",s:3,w:2},{t:"Benzer+René",s:2,w:0},{t:"Manuele+Max",s:2,w:2}] },
  { date:"2024-10-31", label:"31.10", players:[{name:"Santer",s:3,w:1},{name:"Kasi",s:3,w:2},{name:"Manuele",s:3,w:2},{name:"René",s:3,w:1}], teams:[{t:"Santer+René",s:3,w:1},{t:"Kasi+Manuele",s:3,w:2}] },
  { date:"2024-11-07", label:"7.11", players:[{name:"Ricardo",s:1,w:1},{name:"Simon V",s:1,w:0},{name:"Santer",s:1,w:1},{name:"René",s:1,w:0}], teams:[{t:"Ricardo+Santer",s:1,w:1},{t:"Simon V+René",s:1,w:0}] },
  { date:"2024-11-14", label:"14.11", players:[{name:"Kasi",s:5,w:5},{name:"Max",s:5,w:0},{name:"Böhler",s:5,w:0},{name:"René",s:5,w:5}], teams:[{t:"Max+Böhler",s:5,w:0},{t:"Kasi+René",s:5,w:5}] },
  { date:"2024-11-24", label:"24.11", players:[{name:"Benzer",s:4,w:0},{name:"Max",s:4,w:3},{name:"Manuele",s:4,w:2},{name:"René",s:4,w:3}], teams:[{t:"Max+René",s:2,w:2},{t:"Manuele+Benzer",s:2,w:0},{t:"Max+Benzer",s:1,w:0},{t:"Manuele+René",s:1,w:1},{t:"Max+Manuele",s:1,w:1},{t:"Benzer+René",s:1,w:0}] },
  { date:"2024-12-01", label:"1.12", players:[{name:"Sinz",s:5,w:1},{name:"Max",s:5,w:1},{name:"Manuele",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Sinz+Max",s:5,w:1},{t:"Manuele+René",s:5,w:4}] },
  { date:"2024-12-15", label:"15.12", players:[{name:"Manuele",s:4,w:3},{name:"Santer",s:4,w:1},{name:"Max",s:4,w:0},{name:"René",s:4,w:4}], teams:[{t:"Manuele+René",s:3,w:3},{t:"Max+Santer",s:3,w:0},{t:"Max+Manuele",s:1,w:0},{t:"Santer+René",s:1,w:1}] },
  { date:"2024-12-22", label:"22.12", players:[{name:"Andre",s:4,w:1},{name:"Manuele",s:4,w:1},{name:"Benzer",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Andre+Manuele",s:4,w:1},{t:"Benzer+René",s:4,w:3}] },
  { date:"2024-12-29", label:"29.12", players:[{name:"Simon V",s:5,w:4},{name:"Manuele",s:5,w:2},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:3}], teams:[{t:"Manuele+Simon V",s:3,w:2},{t:"Manuele+Benzer",s:2,w:0},{t:"Benzer+René",s:3,w:1},{t:"Simon V+René",s:2,w:2}] },
];

const MATCH_DAYS_2025 = [
  { date:"2025-01-02", label:"2.1", players:[{name:"Benzer",s:4,w:1},{name:"Kasi",s:4,w:3},{name:"René",s:4,w:1},{name:"Partel",s:4,w:3}], teams:[{t:"Benzer+René",s:4,w:1},{t:"Kasi+Partel",s:4,w:3}] },
  { date:"2025-01-12", label:"12.1", players:[{name:"Simon V",s:4,w:3},{name:"Manuele",s:4,w:1},{name:"Benzer",s:4,w:1},{name:"René",s:4,w:3}], teams:[{t:"Simon V+Manuele",s:2,w:1},{t:"Simon V+René",s:2,w:2},{t:"Benzer+Manuele",s:2,w:0},{t:"Benzer+René",s:2,w:1}] },
  { date:"2025-01-19", label:"19.1", players:[{name:"Manuele",s:3,w:0},{name:"Andre",s:3,w:1},{name:"Max",s:1,w:1},{name:"Benzer",s:2,w:1},{name:"René",s:3,w:3}], teams:[{t:"Manuele+Andre",s:2,w:0},{t:"Manuele+Benzer",s:1,w:0},{t:"Max+René",s:1,w:1},{t:"Benzer+René",s:1,w:1},{t:"Andre+René",s:1,w:1}] },
  { date:"2025-01-24", label:"24.1", players:[{name:"Max",s:5,w:2},{name:"Manuele",s:5,w:2},{name:"Benzer",s:5,w:1},{name:"René",s:5,w:5}], teams:[{t:"Max+Manuele",s:1,w:0},{t:"Max+Benzer",s:2,w:0},{t:"Max+René",s:2,w:2},{t:"Manuele+Benzer",s:2,w:0},{t:"Manuele+René",s:2,w:2},{t:"Benzer+René",s:1,w:1}] },
  { date:"2025-02-02", label:"2.2", players:[{name:"Manuele",s:4,w:1},{name:"Benzer",s:4,w:1},{name:"Max",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Manuele+Benzer",s:4,w:1},{t:"Max+René",s:4,w:3}] },
  { date:"2025-02-09", label:"9.2", players:[{name:"Manuele",s:4,w:0},{name:"Simon V",s:4,w:0},{name:"Santer",s:4,w:4},{name:"René",s:4,w:4}], teams:[{t:"Manuele+Simon V",s:4,w:0},{t:"Santer+René",s:4,w:4}] },
  { date:"2025-03-02", label:"2.3", players:[{name:"Manuele",s:3,w:1},{name:"Benzer",s:3,w:1},{name:"Santer",s:3,w:2},{name:"René",s:3,w:2}], teams:[{t:"Manuele+Benzer",s:3,w:1},{t:"Santer+René",s:3,w:2}] },
  { date:"2025-03-16", label:"16.3", players:[{name:"Manuele",s:5,w:2},{name:"Benzer",s:5,w:2},{name:"Santer",s:5,w:3},{name:"René",s:5,w:3}], teams:[{t:"Manuele+Benzer",s:3,w:1},{t:"Santer+René",s:3,w:2},{t:"Manuele+Santer",s:2,w:1},{t:"Benzer+René",s:2,w:1}] },
  { date:"2025-03-21", label:"21.3", players:[{name:"Linus",s:4,w:3},{name:"Kasi",s:5,w:1},{name:"Benzer",s:5,w:2},{name:"René",s:5,w:4}], teams:[{t:"Linus+René",s:3,w:3},{t:"Benzer+Kasi",s:4,w:1},{t:"Benzer+René",s:1,w:1},{t:"Linus+Kasi",s:1,w:0},{t:"René",s:1,w:0}] },
  { date:"2025-03-30", label:"30.3", players:[{name:"Sinz",s:4,w:0},{name:"Max",s:4,w:4},{name:"Böhler",s:4,w:0},{name:"René",s:4,w:4}], teams:[{t:"Sinz+Böhler",s:4,w:0},{t:"Max+René",s:4,w:4}] },
  { date:"2025-04-04", label:"4.4", players:[{name:"Böhler",s:5,w:1},{name:"Max",s:5,w:1},{name:"Kasi",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Böhler+Max",s:5,w:1},{t:"Kasi+René",s:5,w:4}] },
  { date:"2025-04-11", label:"11.4", players:[{name:"Max",s:4,w:2},{name:"Simon V",s:4,w:2},{name:"Benzer",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Max+Simon V",s:4,w:2},{t:"Benzer+René",s:4,w:2}] },
  { date:"2025-04-18", label:"18.4", players:[{name:"Manuele",s:4,w:1},{name:"Böhler",s:4,w:1},{name:"Simon V",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Manuele+Böhler",s:4,w:1},{t:"Simon V+René",s:4,w:3}] },
  { date:"2025-04-25", label:"25.4", players:[{name:"Manuele",s:5,w:1},{name:"Benzer",s:5,w:4},{name:"Santer",s:5,w:1},{name:"René",s:5,w:4}], teams:[{t:"Manuele+Santer",s:5,w:1},{t:"Benzer+René",s:5,w:4}] },
  { date:"2025-05-04", label:"4.5", players:[{name:"Manuele",s:4,w:2},{name:"Max",s:4,w:2},{name:"Benzer",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Manuele+Max",s:4,w:2},{t:"Benzer+René",s:4,w:2}] },
  { date:"2025-05-15", label:"15.5", players:[{name:"Benzer",s:4,w:3},{name:"Manuele",s:4,w:1},{name:"Kasi",s:4,w:1},{name:"René",s:4,w:3}], teams:[{t:"Kasi+Manuele",s:4,w:1},{t:"Benzer+René",s:4,w:3}] },
  { date:"2025-05-22", label:"22.5", players:[{name:"Max",s:4,w:1},{name:"Kasi",s:4,w:1},{name:"Benzer",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Max+Kasi",s:4,w:1},{t:"Benzer+René",s:4,w:3}] },
  { date:"2025-06-17", label:"17.6", players:[{name:"Böhler",s:5,w:1},{name:"Max",s:5,w:1},{name:"Kasi",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Böhler+Max",s:5,w:1},{t:"Kasi+René",s:5,w:4}] },
  { date:"2025-06-24", label:"24.6", players:[{name:"Kasi",s:5,w:4},{name:"Simon",s:5,w:4},{name:"Max",s:5,w:1},{name:"René",s:5,w:1}], teams:[{t:"Kasi+Simon",s:5,w:4},{t:"Max+René",s:5,w:1}] },
  { date:"2025-07-01", label:"1.7", players:[{name:"Kasi",s:5,w:1},{name:"Manuele",s:5,w:4},{name:"Max",s:5,w:1},{name:"René",s:5,w:4}], teams:[{t:"Max+Kasi",s:5,w:1},{t:"Manuele+René",s:5,w:4}] },
  { date:"2025-07-08", label:"8.7", players:[{name:"Simon V",s:5,w:3},{name:"Santer",s:5,w:1},{name:"Kasi",s:5,w:1},{name:"René",s:5,w:5}], teams:[{t:"Simon V+Kasi",s:1,w:0},{t:"Simon V+Santer",s:1,w:0},{t:"Simon V+René",s:3,w:3},{t:"Kasi+René",s:1,w:1},{t:"Kasi+Santer",s:3,w:0},{t:"Santer+René",s:1,w:1}] },
  { date:"2025-07-14", label:"14.7", players:[{name:"Simon V",s:5,w:0},{name:"Kasi",s:5,w:1},{name:"Manuele",s:5,w:4},{name:"René",s:5,w:5}], teams:[{t:"Simon V+Kasi",s:4,w:0},{t:"Manuele+René",s:4,w:4},{t:"Simon V+Manuele",s:1,w:0},{t:"Kasi+René",s:1,w:1}] },
  { date:"2025-07-22", label:"22.7", players:[{name:"Simon V",s:4,w:0},{name:"Max",s:4,w:0},{name:"Kasi",s:4,w:4},{name:"René",s:4,w:4}], teams:[{t:"Simon V+Max",s:4,w:0},{t:"Kasi+René",s:4,w:4}] },
  { date:"2025-08-05", label:"5.8", players:[{name:"Simon V",s:4,w:2},{name:"Max",s:4,w:2},{name:"Kasi",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Simon V+Max",s:4,w:2},{t:"Kasi+René",s:4,w:2}] },
  { date:"2025-08-13", label:"13.8", players:[{name:"Simon V",s:3,w:2},{name:"Max",s:3,w:2},{name:"Benzer",s:3,w:1},{name:"René",s:3,w:1}], teams:[{t:"Simon V+Max",s:3,w:2},{t:"Benzer+René",s:3,w:1}] },
  { date:"2025-08-19", label:"19.8", players:[{name:"Simon V",s:5,w:1},{name:"Kasi",s:5,w:1},{name:"Benzer",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Simon V+Kasi",s:5,w:1},{t:"Benzer+René",s:5,w:4}] },
  { date:"2025-08-26", label:"26.8", players:[{name:"Simon V",s:5,w:1},{name:"Kasi",s:5,w:1},{name:"Max",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Simon V+Kasi",s:5,w:1},{t:"Max+René",s:5,w:4}] },
  { date:"2025-08-28", label:"28.8", players:[{name:"Max",s:4,w:0},{name:"Kasi",s:4,w:0},{name:"Manuele",s:4,w:4},{name:"René",s:4,w:4}], teams:[{t:"Max+Kasi",s:4,w:0},{t:"Manuele+René",s:4,w:4}] },
  { date:"2025-09-02", label:"2.9", players:[{name:"Max",s:3,w:1},{name:"Kasi",s:3,w:1},{name:"Benzer",s:3,w:2},{name:"René",s:3,w:2}], teams:[{t:"Max+Kasi",s:3,w:1},{t:"Benzer+René",s:3,w:2}] },
  { date:"2025-09-16", label:"16.9", players:[{name:"Kasi",s:3,w:0},{name:"Lukas Achmüller",s:3,w:0},{name:"Simon V",s:3,w:3},{name:"René",s:3,w:3}], teams:[{t:"Lukas A+Kasi",s:3,w:0},{t:"Simon V+René",s:3,w:3}] },
  { date:"2025-09-24", label:"24.9", players:[{name:"Max",s:3,w:0},{name:"Kasi",s:3,w:0},{name:"Benzer",s:3,w:3},{name:"René",s:3,w:3}], teams:[{t:"Max+Kasi",s:3,w:0},{t:"Benzer+René",s:3,w:3}] },
  { date:"2025-10-08", label:"8.10", players:[{name:"Kasi",s:4,w:0},{name:"Max",s:4,w:0},{name:"Simon V",s:4,w:4},{name:"René",s:4,w:4}], teams:[{t:"Kasi+Max",s:4,w:0},{t:"Simon V+René",s:4,w:4}] },
  { date:"2025-11-09", label:"9.11", players:[{name:"Max",s:5,w:0},{name:"René",s:5,w:5}], teams:[] },
  { date:"2025-11-16", label:"16.11", players:[{name:"Benzer",s:4,w:4},{name:"Manuele",s:4,w:0},{name:"Max",s:4,w:0},{name:"René",s:4,w:4}], teams:[{t:"Manuele+Max",s:4,w:0},{t:"Benzer+René",s:4,w:4}] },
  { date:"2025-11-23", label:"23.11", players:[{name:"Max",s:5,w:1},{name:"René",s:5,w:4}], teams:[] },
  { date:"2025-11-30", label:"30.11", players:[{name:"Simon V",s:3,w:1},{name:"Max",s:3,w:1},{name:"Benzer",s:3,w:2},{name:"René",s:3,w:2}], teams:[{t:"Simon V+Max",s:3,w:1},{t:"Benzer+René",s:3,w:2}] },
  { date:"2025-12-19", label:"19.12", players:[{name:"Max",s:4,w:0},{name:"René",s:4,w:4}], teams:[] },
  { date:"2025-12-23", label:"23.12", players:[{name:"Sinz",s:5,w:1},{name:"Simon V",s:5,w:1},{name:"Manuele",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Sinz+Simon V",s:5,w:1},{t:"Manuele+René",s:5,w:4}] },
  { date:"2025-12-30", label:"30.12", players:[{name:"Manuele",s:6,w:0},{name:"Kasi",s:6,w:0},{name:"Reto",s:6,w:6},{name:"René",s:6,w:6}], teams:[{t:"Manuele+Kasi",s:6,w:0},{t:"Reto+René",s:6,w:6}] },
];

const MATCH_DAYS_2026 = [
  { date:"2026-01-08", label:"8.1", players:[{name:"Florian",s:4,w:4},{name:"Kasi",s:4,w:4},{name:"Benzer",s:4,w:0},{name:"Max",s:4,w:0}], teams:[{t:"Florian+Kasi",s:4,w:4},{t:"Benzer+Max",s:4,w:0}], games:[
    {team1:["Florian","Kasi"],team2:["Benzer","Max"],winner:1,score1:7,score2:6,t1Key:"Florian+Kasi",t2Key:"Benzer+Max"},
    {team1:["Florian","Kasi"],team2:["Benzer","Max"],winner:1,score1:6,score2:3,t1Key:"Florian+Kasi",t2Key:"Benzer+Max"},
    {team1:["Florian","Kasi"],team2:["Benzer","Max"],winner:1,score1:6,score2:4,t1Key:"Florian+Kasi",t2Key:"Benzer+Max"},
    {team1:["Florian","Kasi"],team2:["Benzer","Max"],winner:1,score1:6,score2:4,t1Key:"Florian+Kasi",t2Key:"Benzer+Max"},
  ]},
  { date:"2026-01-13", label:"13.1", players:[{name:"Max",s:4,w:1},{name:"René",s:4,w:3}], teams:[] },
  { date:"2026-01-18", label:"18.1", players:[{name:"Max",s:2,w:0},{name:"René",s:2,w:2}], teams:[] },
  { date:"2026-01-23", label:"23.1", players:[{name:"Max",s:4,w:2},{name:"Simon V",s:4,w:2},{name:"Benzer",s:4,w:2},{name:"René",s:4,w:2}], teams:[{t:"Max+Simon V",s:4,w:2},{t:"Benzer+René",s:4,w:2}] },
  { date:"2026-01-30", label:"30.1", players:[{name:"Manuele",s:4,w:1},{name:"Simon V",s:4,w:1},{name:"Böhler",s:4,w:3},{name:"René",s:4,w:3}], teams:[{t:"Manuele+Simon V",s:4,w:1},{t:"Böhler+René",s:4,w:3}] },
  { date:"2026-02-13", label:"13.2", players:[{name:"Max",s:3,w:2},{name:"Simon V",s:3,w:2},{name:"Manuele",s:3,w:1},{name:"René",s:3,w:1}], teams:[{t:"Max+Simon V",s:3,w:2},{t:"Manuele+René",s:3,w:1}] },
  { date:"2026-02-20", label:"20.2", players:[{name:"Max",s:5,w:1},{name:"Simon V",s:5,w:1},{name:"Böhler",s:5,w:4},{name:"René",s:5,w:4}], teams:[{t:"Max+Simon V",s:5,w:1},{t:"Böhler+René",s:5,w:4}] },
  { date:"2026-03-01", label:"1.3", players:[{name:"René",s:5,w:3},{name:"Benzer",s:5,w:3},{name:"Santer",s:5,w:2},{name:"Simon",s:1,w:1},{name:"Simon V",s:4,w:1}], teams:[{t:"Benzer+René",s:5,w:3},{t:"Simon+Santer",s:1,w:1},{t:"Santer+Simon V",s:4,w:1}], games:[
    {team1:["Simon","Santer"],team2:["Benzer","René"],winner:1,score1:6,score2:1,t1Key:"Santer+Simon",t2Key:"Benzer+René"},
    {team1:["Simon V","Santer"],team2:["Benzer","René"],winner:2,score1:0,score2:6,t1Key:"Santer+Simon V",t2Key:"Benzer+René"},
    {team1:["Benzer","René"],team2:["Santer","Simon V"],winner:1,score1:6,score2:1,t1Key:"Benzer+René",t2Key:"Santer+Simon V"},
    {team1:["Benzer","René"],team2:["Santer","Simon V"],winner:1,score1:6,score2:2,t1Key:"Benzer+René",t2Key:"Santer+Simon V"},
    {team1:["Benzer","René"],team2:["Santer","Simon V"],winner:2,score1:1,score2:6,t1Key:"Benzer+René",t2Key:"Santer+Simon V"},
  ]},
  { date:"2026-03-08", label:"8.3", mode:"einzel", players:[{name:"René",s:4,w:3},{name:"Max",s:4,w:1}], teams:[], games:[
    {team1:["René"],team2:["Max"],winner:1,score1:6,score2:3,t1Key:"René",t2Key:"Max"},
    {team1:["Max"],team2:["René"],winner:1,score1:6,score2:4,t1Key:"Max",t2Key:"René"},
    {team1:["René"],team2:["Max"],winner:1,score1:7,score2:6,t1Key:"René",t2Key:"Max"},
    {team1:["René"],team2:["Max"],winner:1,score1:6,score2:2,t1Key:"René",t2Key:"Max"},
  ]},
  { date:"2026-03-13", label:"13.3", players:[{name:"Manuele",s:4,w:4},{name:"René",s:4,w:4},{name:"Max",s:4,w:0},{name:"Simon V",s:4,w:0}], teams:[{t:"Manuele+René",s:4,w:4},{t:"Max+Simon V",s:4,w:0}], games:[
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
  ]},
  { date:"2026-03-20", label:"20.3", players:[{name:"Böhler",s:4,w:2},{name:"René",s:4,w:2},{name:"Kasi",s:4,w:2},{name:"Max",s:4,w:2}], teams:[{t:"Böhler+René",s:4,w:2},{t:"Kasi+Max",s:4,w:2}], games:[
    {team1:["Kasi","Max"],team2:["Böhler","René"],winner:1,t1Key:"Kasi+Max",t2Key:"Böhler+René"},
    {team1:["Böhler","René"],team2:["Kasi","Max"],winner:1,t1Key:"Böhler+René",t2Key:"Kasi+Max"},
    {team1:["Kasi","Max"],team2:["Böhler","René"],winner:1,t1Key:"Kasi+Max",t2Key:"Böhler+René"},
    {team1:["Böhler","René"],team2:["Kasi","Max"],winner:1,t1Key:"Böhler+René",t2Key:"Kasi+Max"},
  ]},
  { date:"2026-03-27", label:"27.3", players:[{name:"René",s:5,w:5},{name:"Max",s:5,w:2},{name:"Florian",s:5,w:3},{name:"Klaus Ruppert",s:5,w:0}], teams:[{t:"Max+René",s:2,w:2},{t:"Florian+Klaus Ruppert",s:2,w:0},{t:"Florian+René",s:3,w:3},{t:"Klaus Ruppert+Max",s:3,w:0}], games:[
    {team1:["Max","René"],team2:["Florian","Klaus Ruppert"],winner:1,t1Key:"Max+René",t2Key:"Florian+Klaus Ruppert"},
    {team1:["Max","René"],team2:["Florian","Klaus Ruppert"],winner:1,t1Key:"Max+René",t2Key:"Florian+Klaus Ruppert"},
    {team1:["Florian","René"],team2:["Max","Klaus Ruppert"],winner:1,t1Key:"Florian+René",t2Key:"Klaus Ruppert+Max"},
    {team1:["Florian","René"],team2:["Max","Klaus Ruppert"],winner:1,t1Key:"Florian+René",t2Key:"Klaus Ruppert+Max"},
    {team1:["Florian","René"],team2:["Max","Klaus Ruppert"],winner:1,t1Key:"Florian+René",t2Key:"Klaus Ruppert+Max"},
  ]},
  { date:"2026-04-05", label:"5.4", players:[{name:"Benzer",s:4,w:2},{name:"René",s:4,w:2},{name:"Max",s:4,w:2},{name:"Manuele",s:4,w:2}], teams:[{t:"Benzer+René",s:4,w:2},{t:"Manuele+Max",s:4,w:2}], games:[
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
  ]},
  { date:"2026-04-10", label:"10.4", players:[{name:"Manuele",s:4,w:3},{name:"René",s:4,w:3},{name:"Simon V",s:4,w:1},{name:"Max",s:4,w:1}], teams:[{t:"Manuele+René",s:4,w:3},{t:"Max+Simon V",s:4,w:1}], games:[
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:2,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
    {team1:["Manuele","René"],team2:["Max","Simon V"],winner:1,t1Key:"Manuele+René",t2Key:"Max+Simon V"},
  ]},
  { date:"2026-04-28", label:"28.4", mode:"einzel", players:[{name:"René",s:3,w:2},{name:"Max",s:3,w:1}], teams:[], games:[
    {team1:["Max"],team2:["René"],winner:1,t1Key:"Max",t2Key:"René"},
    {team1:["René"],team2:["Max"],winner:1,t1Key:"René",t2Key:"Max"},
    {team1:["René"],team2:["Max"],winner:1,t1Key:"René",t2Key:"Max"},
  ]},
  { date:"2026-05-15", label:"15.5", players:[{name:"René",s:3,w:2},{name:"Max",s:3,w:2},{name:"Simon V",s:3,w:1},{name:"Kasi",s:3,w:1}], teams:[{t:"Max+René",s:3,w:2},{t:"Kasi+Simon V",s:3,w:1}], games:[
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:2,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
  ]},
  { date:"2026-05-22", label:"22.5", players:[{name:"Benzer",s:5,w:1},{name:"René",s:5,w:1},{name:"Kasi",s:5,w:4},{name:"Max",s:5,w:4}], teams:[{t:"Benzer+René",s:5,w:1},{t:"Kasi+Max",s:5,w:4}], games:[
    {team1:["Benzer","René"],team2:["Kasi","Max"],winner:1,t1Key:"Benzer+René",t2Key:"Kasi+Max"},
    {team1:["Benzer","René"],team2:["Kasi","Max"],winner:2,t1Key:"Benzer+René",t2Key:"Kasi+Max"},
    {team1:["Benzer","René"],team2:["Kasi","Max"],winner:2,t1Key:"Benzer+René",t2Key:"Kasi+Max"},
    {team1:["Benzer","René"],team2:["Kasi","Max"],winner:2,t1Key:"Benzer+René",t2Key:"Kasi+Max"},
    {team1:["Benzer","René"],team2:["Kasi","Max"],winner:2,t1Key:"Benzer+René",t2Key:"Kasi+Max"},
  ]},
  { date:"2026-05-31", label:"31.5", players:[{name:"Benzer",s:3,w:1},{name:"René",s:3,w:1},{name:"Max",s:3,w:2},{name:"Simon V",s:3,w:2}], teams:[{t:"Benzer+René",s:3,w:1},{t:"Max+Simon V",s:3,w:2}], games:[
    {team1:["Benzer","René"],team2:["Max","Simon V"],winner:1,t1Key:"Benzer+René",t2Key:"Max+Simon V"},
    {team1:["Benzer","René"],team2:["Max","Simon V"],winner:2,t1Key:"Benzer+René",t2Key:"Max+Simon V"},
    {team1:["Benzer","René"],team2:["Max","Simon V"],winner:2,t1Key:"Benzer+René",t2Key:"Max+Simon V"},
  ]},
  { date:"2026-06-05", label:"5.6", players:[{name:"Benzer",s:5,w:3},{name:"René",s:5,w:3},{name:"Max",s:5,w:2},{name:"Manuele",s:5,w:2}], teams:[{t:"Benzer+René",s:5,w:3},{t:"Manuele+Max",s:5,w:2}], games:[
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
  ]},
  { date:"2026-06-19", label:"19.6", players:[{name:"René",s:5,w:3},{name:"Max",s:5,w:3},{name:"Kasi",s:5,w:2},{name:"Simon V",s:5,w:2}], teams:[{t:"Max+René",s:5,w:3},{t:"Kasi+Simon V",s:5,w:2}], games:[
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:2,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:2,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
  ]},
  { date:"2026-07-02", label:"2.7", mode:"einzel", players:[{name:"René",s:0,w:0},{name:"Benzer",s:0,w:0}], teams:[] },
  { date:"2026-07-10", label:"10.7", players:[{name:"Manuele",s:5,w:3},{name:"René",s:5,w:3},{name:"Kasi",s:5,w:2},{name:"Max",s:5,w:2}], teams:[{t:"Manuele+René",s:5,w:3},{t:"Kasi+Max",s:5,w:2}], games:[
    {team1:["Manuele","René"],team2:["Kasi","Max"],winner:1,t1Key:"Manuele+René",t2Key:"Kasi+Max"},
    {team1:["Manuele","René"],team2:["Kasi","Max"],winner:1,t1Key:"Manuele+René",t2Key:"Kasi+Max"},
    {team1:["Manuele","René"],team2:["Kasi","Max"],winner:2,t1Key:"Manuele+René",t2Key:"Kasi+Max"},
    {team1:["Manuele","René"],team2:["Kasi","Max"],winner:1,t1Key:"Manuele+René",t2Key:"Kasi+Max"},
    {team1:["Manuele","René"],team2:["Kasi","Max"],winner:2,t1Key:"Manuele+René",t2Key:"Kasi+Max"},
  ]},
  { date:"2026-07-15", label:"15.7", players:[{name:"René",s:4,w:3},{name:"Max",s:4,w:3},{name:"Simon V",s:4,w:1},{name:"Kasi",s:4,w:1}], teams:[{t:"Max+René",s:4,w:3},{t:"Kasi+Simon V",s:4,w:1}], games:[
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:2,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Simon V","Kasi"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
  ]},
  { date:"2026-07-23", label:"23.7", players:[{name:"René",s:4,w:4},{name:"Max",s:4,w:4},{name:"Kasi",s:4,w:0},{name:"Simon V",s:4,w:0}], teams:[{t:"Max+René",s:4,w:4},{t:"Kasi+Simon V",s:4,w:0}], games:[
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
  ]},
  { date:"2026-07-31", label:"31.7", players:[{name:"Benzer",s:4,w:1},{name:"René",s:4,w:1},{name:"Max",s:4,w:3},{name:"Manuele",s:4,w:3}], teams:[{t:"Benzer+René",s:4,w:1},{t:"Manuele+Max",s:4,w:3}], games:[
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:1,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
    {team1:["Benzer","René"],team2:["Max","Manuele"],winner:2,t1Key:"Benzer+René",t2Key:"Manuele+Max"},
  ]},
  { date:"2026-08-04", label:"4.8", mode:"einzel", players:[{name:"René",s:4,w:4},{name:"Simon V",s:4,w:0}], teams:[], games:[
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
  ]},
  { date:"2026-08-13", label:"13.8", players:[{name:"René",s:4,w:3},{name:"Max",s:4,w:3},{name:"Kasi",s:4,w:1},{name:"Simon V",s:4,w:1}], teams:[{t:"Max+René",s:2,w:2},{t:"Kasi+Simon V",s:2,w:0},{t:"Kasi+Max",s:2,w:1},{t:"René+Simon V",s:2,w:1}], games:[
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","Kasi"],team2:["René","Simon V"],winner:1,t1Key:"Kasi+Max",t2Key:"René+Simon V"},
    {team1:["Max","Kasi"],team2:["René","Simon V"],winner:2,t1Key:"Kasi+Max",t2Key:"René+Simon V"},
  ]},
  { date:"2026-08-17", label:"17.8", mode:"einzel", players:[{name:"René",s:4,w:4},{name:"Simon V",s:4,w:0}], teams:[], games:[
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
    {team1:["René"],team2:["Simon V"],winner:1,t1Key:"René",t2Key:"Simon V"},
  ]},
  { date:"2026-08-27", label:"27.8", players:[{name:"René",s:4,w:4},{name:"Max",s:4,w:4},{name:"Kasi",s:4,w:0},{name:"Simon V",s:4,w:0}], teams:[{t:"Max+René",s:4,w:4},{t:"Kasi+Simon V",s:4,w:0}], games:[
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
    {team1:["Max","René"],team2:["Kasi","Simon V"],winner:1,t1Key:"Max+René",t2Key:"Kasi+Simon V"},
  ]},
];

const ALL_MATCH_DAYS = [...MATCH_DAYS_2024, ...MATCH_DAYS_2025, ...MATCH_DAYS_2026].sort((a,b) => a.date.localeCompare(b.date));

// Splitwise data from screenshots
const INITIAL_DEBTS = [
  { person: "Florian Giesinger", amount: 0, note: "quitt", history: [
    { date: "2025-01-01", type: "platz", amount: -20, desc: "Platzbuchung (Splitwise)" },
    { date: "2026-03-27", type: "platz", amount: -21, desc: "Platz 27.3." },
    { date: "2026-03-27", type: "platz", amount: -21, desc: "Platz 27.3. (für Klaus Ruppert)" },
    { date: "2026-04-10", type: "zahlung", amount: 62, desc: "Zahlung erhalten (€62)" },
  ]},
  { person: "Manuele", amount: 202, note: "Du schuldest", history: [
    { date: "2025-01-01", type: "saldo", amount: 221, desc: "Übernahme Splitwise-Saldo" },
    { date: "2026-04-05", type: "platz", amount: -14, desc: "Platz 5.4." },
    { date: "2026-05-15", type: "platz", amount: 43, desc: "Manuele hat für dich bezahlt (€43)" },
    { date: "2026-06-05", type: "platz", amount: -16, desc: "Platz 5.6." },
    { date: "2026-07-10", type: "platz", amount: -16, desc: "Platz 10.7." },
    { date: "2026-07-31", type: "platz", amount: -16, desc: "Platz 31.7." },
  ]},
  { person: "Max", amount: 90, note: "Du schuldest", history: [
    { date: "2025-01-01", type: "saldo", amount: -0.50, desc: "Übernahme Splitwise-Saldo" },
    { date: "2026-03-01", type: "platz", amount: -62, desc: "Platz 1.3. (14+14+14+20€)" },
    { date: "2026-03-08", type: "platz", amount: -25, desc: "Einzelcourt 8.3." },
    { date: "2026-03-13", type: "platz", amount: -28, desc: "Platz 13.3." },
    { date: "2026-03-13", type: "zahlung", amount: 115.50, desc: "Zahlung erhalten (€115.50)" },
    { date: "2026-03-20", type: "platz", amount: -14, desc: "Platz 20.3." },
    { date: "2026-03-27", type: "platz", amount: -14, desc: "Platz 27.3." },
    { date: "2026-04-05", type: "platz", amount: -14, desc: "Platz 5.4." },
    { date: "2026-04-10", type: "platz", amount: -28, desc: "Platz 10.4." },
    { date: "2026-04-10", type: "zahlung", amount: 70, desc: "Zahlung erhalten (€70)" },
    { date: "2026-04-28", type: "platz", amount: -25, desc: "Einzelcourt 28.4." },
    { date: "2026-05-15", type: "platz", amount: -14, desc: "Platz 15.5." },
    { date: "2026-05-19", type: "zahlung", amount: 289, desc: "Überweisung erhalten (€289)" },
    { date: "2026-05-22", type: "platz", amount: -16, desc: "Platz 22.5." },
    { date: "2026-05-31", type: "platz", amount: -16, desc: "Platz 31.5." },
    { date: "2026-06-05", type: "platz", amount: -16, desc: "Platz 5.6." },
    { date: "2026-06-19", type: "platz", amount: -16, desc: "Platz 19.6." },
    { date: "2026-07-10", type: "platz", amount: -16, desc: "Platz 10.7." },
    { date: "2026-07-15", type: "platz", amount: -16, desc: "Platz 15.7." },
    { date: "2026-07-23", type: "platz", amount: -16, desc: "Platz 23.7." },
    { date: "2026-07-31", type: "platz", amount: -16, desc: "Platz 31.7." },
    { date: "2026-08-13", type: "platz", amount: -16, desc: "Platz 13.8." },
    { date: "2026-08-27", type: "platz", amount: -16, desc: "Platz 27.8." },
  ]},
  { person: "Kasi", amount: 138, note: "Du schuldest", history: [
    { date: "2025-01-01", type: "saldo", amount: 84, desc: "Übernahme Splitwise-Saldo" },
    { date: "2026-03-20", type: "platz", amount: -14, desc: "Platz 20.3." },
    { date: "2026-04-29", type: "platz", amount: 20, desc: "Kasi hat für dich bezahlt (andere Gruppe)" },
    { date: "2026-05-15", type: "platz", amount: -14, desc: "Platz 15.5." },
    { date: "2026-05-19", type: "zahlung", amount: 174, desc: "Überweisung erhalten (€174)" },
    { date: "2026-05-22", type: "platz", amount: -16, desc: "Platz 22.5." },
    { date: "2026-06-19", type: "platz", amount: -16, desc: "Platz 19.6." },
    { date: "2026-07-10", type: "platz", amount: -16, desc: "Platz 10.7." },
    { date: "2026-07-15", type: "platz", amount: -16, desc: "Platz 15.7." },
    { date: "2026-07-23", type: "platz", amount: -16, desc: "Platz 23.7." },
    { date: "2026-08-13", type: "platz", amount: -16, desc: "Platz 13.8." },
    { date: "2026-08-27", type: "platz", amount: -16, desc: "Platz 27.8." },
  ]},
  { person: "Simon V", amount: -68, note: "schuldet dir", history: [
    { date: "2025-01-01", type: "saldo", amount: 40, desc: "Übernahme Splitwise-Saldo (du schuldest)" },
    { date: "2026-03-13", type: "platz", amount: -40, desc: "Platz 13.3." },
    { date: "2026-04-10", type: "platz", amount: -40, desc: "Platz 10.4." },
    { date: "2026-04-10", type: "zahlung", amount: 40, desc: "Zahlung erhalten (€40)" },
    { date: "2026-05-15", type: "platz", amount: -20, desc: "Platz 15.5." },
    { date: "2026-05-31", type: "platz", amount: -21, desc: "Platz 31.5." },
    { date: "2026-06-19", type: "platz", amount: -21, desc: "Platz 19.6." },
    { date: "2026-07-15", type: "platz", amount: -21, desc: "Platz 15.7." },
    { date: "2026-07-23", type: "platz", amount: -21, desc: "Platz 23.7." },
    { date: "2026-08-04", type: "platz", amount: -26, desc: "Einzelcourt 4.8." },
    { date: "2026-08-13", type: "platz", amount: -21, desc: "Platz 13.8." },
    { date: "2026-08-13", type: "zahlung", amount: 130, desc: "Zahlung erhalten (€130)" },
    { date: "2026-08-17", type: "platz", amount: -26, desc: "Einzelcourt 17.8." },
    { date: "2026-08-27", type: "platz", amount: -21, desc: "Platz 27.8." },
  ]},
  { person: "Benzer", amount: 161, note: "Du schuldest", history: [
    { date: "2025-01-01", type: "saldo", amount: 132, desc: "Übernahme Splitwise-Saldo" },
    { date: "2026-04-05", type: "platz", amount: -14, desc: "Platz 5.4." },
    { date: "2026-05-15", type: "platz", amount: 132, desc: "Benzer hat für dich bezahlt (€132)" },
    { date: "2026-05-22", type: "platz", amount: -16, desc: "Platz 22.5." },
    { date: "2026-05-31", type: "platz", amount: -16, desc: "Platz 31.5." },
    { date: "2026-06-05", type: "platz", amount: -16, desc: "Platz 5.6." },
    { date: "2026-07-02", type: "platz", amount: -25, desc: "Einzelcourt 2.7." },
    { date: "2026-07-31", type: "platz", amount: -16, desc: "Platz 31.7." },
  ]},
  { person: "Matthias", amount: 0, note: "quitt", history: [] },
  { person: "Santer", amount: 0, note: "quitt", history: [] },
  { person: "Böhler", amount: 0, note: "quitt", history: [
    { date: "2025-01-01", type: "saldo", amount: -20, desc: "Übernahme Splitwise-Saldo (schuldet dir)" },
    { date: "2026-03-13", type: "zahlung", amount: 20, desc: "Zahlung erhalten" },
    { date: "2026-03-20", type: "platz", amount: -20, desc: "Platz 20.3." },
    { date: "2026-05-15", type: "zahlung", amount: 20, desc: "Zahlung erhalten (€20)" },
  ]},
];

const DATA_VERSION = "2026-08-27-v2"; // Bump this when hardcoded data changes

// ============================================================
// HELPERS
// ============================================================
function pct(w, s) { return s ? (w / s) * 100 : 0; }
function fmt(v) { return v.toFixed(1) + "%"; }
function getYear(d) { return new Date(d).getFullYear(); }

const RANK_MIN = 20;
const RANK_MIN_TEAM = 10;

function calcPlayers(days) {
  const m = {};
  days.forEach(d => d.players.forEach(p => {
    if (!m[p.name]) m[p.name] = { name: p.name, spiele: 0, siege: 0, days: 0, history: [] };
    m[p.name].spiele += p.s;
    m[p.name].siege += p.w;
    m[p.name].days++;
    m[p.name].history.push({ date: d.date, label: d.label, s: p.s, w: p.w, q: pct(p.w, p.s) });
  }));
  const all = Object.values(m).map(p => ({ ...p, quote: pct(p.siege, p.spiele), ranked: p.spiele >= RANK_MIN }));
  // Ranked first sorted by quote, then unranked sorted by spiele
  const ranked = all.filter(p => p.ranked).sort((a, b) => b.quote - a.quote);
  const unranked = all.filter(p => !p.ranked).sort((a, b) => b.spiele - a.spiele);
  return [...ranked, ...unranked];
}

function calcTeams(days) {
  const m = {};
  days.forEach(d => d.teams.forEach(t => {
    // Normalize team key: sort names alphabetically
    const k = t.t.split("+").sort().join("+");
    if (!k.includes("+")) return; // Skip Einzel (single player) entries
    if (!m[k]) m[k] = { team: k, spiele: 0, siege: 0 };
    m[k].spiele += t.s;
    m[k].siege += t.w;
  }));
  const all = Object.values(m).map(t => ({ ...t, quote: pct(t.siege, t.spiele), ranked: t.spiele >= RANK_MIN_TEAM }));
  const ranked = all.filter(t => t.ranked).sort((a, b) => b.quote - a.quote);
  const unranked = all.filter(t => !t.ranked).sort((a, b) => b.spiele - a.spiele);
  return [...ranked, ...unranked];
}

const STREAK_START = "2026-01-08"; // Streaks ab hier gezählt (exakte Spiel-Reihenfolge vorhanden)

function calcStreaks(days, name) {
  const sess = [];
  const allGameResults = []; // exact game-by-game results

  days.forEach(d => {
    const f = d.players.find(p => p.name === name);
    if (f) {
      sess.push({ date: d.date, label: d.label, won: f.w > f.s / 2, w: f.w, s: f.s });

      // Only count streaks from games with exact data
      if (d.games && d.games.length > 0 && d.date >= STREAK_START) {
        d.games.forEach(g => {
          const inT1 = g.team1.includes(name);
          const inT2 = g.team2.includes(name);
          if (!inT1 && !inT2) return;
          const won = (inT1 && g.winner === 1) || (inT2 && g.winner === 2);
          allGameResults.push({ won, label: d.label });
        });
      }
    }
  });

  let bestW = 0, bestL = 0, tC = 0, tT = null;
  allGameResults.forEach(g => {
    if (g.won === tT) tC++;
    else { if (tT === true) bestW = Math.max(bestW, tC); if (tT === false) bestL = Math.max(bestL, tC); tT = g.won; tC = 1; }
  });
  if (tT === true) bestW = Math.max(bestW, tC);
  if (tT === false) bestL = Math.max(bestL, tC);

  let cur = { type: null, count: 0 };
  if (allGameResults.length) {
    let lt = allGameResults[allGameResults.length - 1].won, c = 0;
    for (let i = allGameResults.length - 1; i >= 0; i--) { if (allGameResults[i].won === lt) c++; else break; }
    cur = { type: lt ? "win" : "loss", count: c };
  }

  const hasStreakData = allGameResults.length > 0;
  return { cur, bestW, bestL, sess, hasStreakData };
}

function calcH2H(days) {
  const h = {};
  days.forEach(d => {
    if (d.teams.length === 2) {
      const t1P = d.teams[0].t.split(/[+&]/).map(s => s.trim());
      const t2P = d.teams[1].t.split(/[+&]/).map(s => s.trim());
      const all = [...t1P, ...t2P];
      all.forEach(p1 => all.forEach(p2 => {
        if (p1 >= p2) return;
        const k = [p1, p2].sort().join(" vs ");
        if (!h[k]) h[k] = { p1, p2, w1: 0, w2: 0, m: 0 };
        const in1 = t1P.includes(p1), in1b = t2P.includes(p2);
        if (in1 === (t1P.includes(p2))) return;
        h[k].m += d.teams[0].s;
        if (in1) { h[k].w1 += d.teams[0].w; h[k].w2 += d.teams[1].w; }
        else { h[k].w2 += d.teams[0].w; h[k].w1 += d.teams[1].w; }
      }));
    }
  });
  return Object.values(h).filter(x => x.m > 0).sort((a, b) => b.m - a.m);
}

// ============================================================
// STYLE HELPERS
// ============================================================
const card = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, boxShadow: T.shadow };
const inputStyle = {
  background: T.cardAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "10px 14px",
  color: T.text, fontSize: 14, outline: "none", width: "100%", boxSizing: "border-box",
  fontFamily: "inherit",
};
const btnPrimary = {
  background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
  border: "none", borderRadius: 12, padding: "12px 28px",
  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
};
const pill = (active, color = T.accent) => ({
  background: active ? color : T.cardAlt,
  border: `1px solid ${active ? color : T.border}`,
  borderRadius: 20, padding: "6px 16px",
  color: active ? "#fff" : T.textMid,
  fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
});

// ============================================================
// MAIN APP
// ============================================================
export default function PadelTracker() {
  const [days, setDays] = useState(ALL_MATCH_DAYS);
  const [debts, setDebts] = useState(INITIAL_DEBTS);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("overview");
  const [yearF, setYearF] = useState("Gesamt");
  const [selPlayer, setSelPlayer] = useState("René");
  const [chartP, setChartP] = useState(["René", "Max", "Benzer"]);
  const [chartTeams, setChartTeams] = useState([]);
  const [minG, setMinG] = useState(1);
  const [paymentName, setPaymentName] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  // Load from persistent storage on mount
  useEffect(() => {
    (async () => {
      try {
        const versionResult = await storage.get("padel-version");
        const savedVersion = versionResult ? versionResult.value : null;
        
        if (savedVersion === DATA_VERSION) {
          // Same version — load saved data
          const daysResult = await storage.get("padel-days");
          const debtsResult = await storage.get("padel-debts");
          if (daysResult && daysResult.value) {
            const saved = JSON.parse(daysResult.value);
            if (saved.length > 0) setDays(saved);
          }
          if (debtsResult && debtsResult.value) {
            const saved = JSON.parse(debtsResult.value);
            if (saved.length > 0) setDebts(saved);
          }
        } else {
          // New version — use hardcoded data and save it
          await storage.set("padel-days", JSON.stringify(ALL_MATCH_DAYS));
          await storage.set("padel-debts", JSON.stringify(INITIAL_DEBTS));
          await storage.set("padel-version", DATA_VERSION);
        }
      } catch (e) {
        console.log("No saved data, using defaults");
      }
      setLoaded(true);
    })();
  }, []);

  // Save to persistent storage whenever days or debts change
  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        await storage.set("padel-days", JSON.stringify(days));
        await storage.set("padel-debts", JSON.stringify(debts));
      } catch (e) {
        console.error("Storage save error:", e);
      }
    })();
  }, [days, debts, loaded]);

  // Adding match - game by game with sets
  const [showAdd, setShowAdd] = useState(false);
  const [addDate, setAddDate] = useState("");
  const [addMode, setAddMode] = useState("doppel"); // "doppel" or "einzel"
  const [addSessionPlayers, setAddSessionPlayers] = useState(["", "", "", ""]);
  const [addGames, setAddGames] = useState([]); // [{team1:[names], team2:[names], score1:num, score2:num}]
  const [addCosts, setAddCosts] = useState({});
  const [addTotalCost, setAddTotalCost] = useState("");
  const [expandedDay, setExpandedDay] = useState(null);
  const [expandedDebt, setExpandedDebt] = useState(null); // date string of expanded match day
  // Current game setup
  const [curT1, setCurT1] = useState([]);
  const [curT2, setCurT2] = useState([]);
  const [curS1, setCurS1] = useState("");
  const [curS2, setCurS2] = useState("");
  const [teamsLocked, setTeamsLocked] = useState(false);

  const activeSessionPlayers = addSessionPlayers.filter(n => n.trim());
  const teamSize = addMode === "doppel" ? 2 : 1;

  const handleAddGame = (winner) => {
    if (curT1.length !== teamSize || curT2.length !== teamSize) return;
    const s1 = parseInt(curS1) || 0;
    const s2 = parseInt(curS2) || 0;
    const hasScore = s1 > 0 || s2 > 0;
    setAddGames(prev => [...prev, { team1: [...curT1], team2: [...curT2], winner, score1: hasScore ? s1 : null, score2: hasScore ? s2 : null }]);
    setCurS1(""); setCurS2("");
    if (!teamsLocked) setTeamsLocked(true);
  };

  const handleRemoveGame = (idx) => setAddGames(prev => prev.filter((_, i) => i !== idx));

  const resetAdd = () => {
    setShowAdd(false); setAddDate(""); setAddMode("doppel");
    setAddSessionPlayers(["","","",""]); setAddGames([]);
    setAddCosts({}); setAddTotalCost("");
    setCurT1([]); setCurT2([]); setCurS1(""); setCurS2("");
    setTeamsLocked(false);
  };

  const handleSaveSession = () => {
    if (!addDate || addGames.length === 0) return;
    const parts = addDate.split("-");
    const pStats = {}, tStats = {};
    let pSets = {}, tSets = {};
    addGames.forEach(g => {
      const t1Key = [...g.team1].sort().join("+");
      const t2Key = [...g.team2].sort().join("+");
      [...g.team1, ...g.team2].forEach(n => {
        if (!pStats[n]) pStats[n] = { s: 0, w: 0 };
        if (!pSets[n]) pSets[n] = { sw: 0, sl: 0 };
        pStats[n].s++;
        const inT1 = g.team1.includes(n);
        const won = (inT1 && g.winner === 1) || (!inT1 && g.winner === 2);
        if (won) pStats[n].w++;
        pSets[n].sw += inT1 ? g.score1 : g.score2;
        pSets[n].sl += inT1 ? g.score2 : g.score1;
      });
      if (!tStats[t1Key]) tStats[t1Key] = { s: 0, w: 0 };
      if (!tStats[t2Key]) tStats[t2Key] = { s: 0, w: 0 };
      if (!tSets[t1Key]) tSets[t1Key] = { sw: 0, sl: 0 };
      if (!tSets[t2Key]) tSets[t2Key] = { sw: 0, sl: 0 };
      tStats[t1Key].s++; tStats[t2Key].s++;
      tSets[t1Key].sw += g.score1; tSets[t1Key].sl += g.score2;
      tSets[t2Key].sw += g.score2; tSets[t2Key].sl += g.score1;
      if (g.winner === 1) tStats[t1Key].w++; else tStats[t2Key].w++;
    });
    const ps = Object.entries(pStats).map(([name, v]) => ({ name, s: v.s, w: v.w, setsW: pSets[name].sw, setsL: pSets[name].sl }));
    const ts = Object.entries(tStats).map(([t, v]) => ({ t, s: v.s, w: v.w, setsW: tSets[t].sw, setsL: tSets[t].sl }));
    const gamesArr = addGames.map(g => ({
      team1: g.team1, team2: g.team2, winner: g.winner,
      score1: g.score1, score2: g.score2,
      t1Key: [...g.team1].sort().join("+"), t2Key: [...g.team2].sort().join("+"),
    }));
    Object.entries(addCosts).forEach(([name, cost]) => {
      if (name === "René" || !parseFloat(cost)) return;
      const c = parseFloat(cost);
      setDebts(prev => {
        const idx = prev.findIndex(d => d.person === name);
        const entry = { date: addDate, type: "platz", amount: -c, desc: `Platz ${addDate.split("-").reverse().slice(0,2).join(".")} (€${c})` };
        if (idx >= 0) return prev.map((d, i) => i === idx ? { ...d, amount: d.amount - c, history: [...(d.history || []), entry] } : d);
        return [...prev, { person: name, amount: -c, note: "schuldet dir", history: [entry] }];
      });
    });
    setDays(prev => [...prev, { date: addDate, label: `${+parts[2]}.${+parts[1]}`, players: ps, teams: ts, games: gamesArr, mode: addMode }].sort((a, b) => a.date.localeCompare(b.date)));
    resetAdd();
  };

  const years = useMemo(() => {
    const y = new Set(days.map(d => getYear(d.date)));
    return ["Gesamt", ...Array.from(y).sort((a,b) => b - a).map(String)];
  }, [days]);

  const filtered = useMemo(() => yearF === "Gesamt" ? days : days.filter(d => String(getYear(d.date)) === yearF), [days, yearF]);
  const players = useMemo(() => calcPlayers(filtered), [filtered]);
  const teams = useMemo(() => calcTeams(filtered), [filtered]);
  const fPlayers = useMemo(() => players.filter(p => p.spiele >= minG), [players, minG]);
  const fTeams = useMemo(() => teams.filter(t => t.spiele >= minG), [teams, minG]);
  const allNames = useMemo(() => { const n = new Set(); days.forEach(d => d.players.forEach(p => n.add(p.name))); return Array.from(n).sort(); }, [days]);
  const allTeamNames = useMemo(() => { const n = new Set(); days.forEach(d => d.teams.forEach(t => n.add(t.t))); return Array.from(n).sort(); }, [days]);

  const totalGames = filtered.reduce((a, d) => a + (d.players.length ? d.players[0].s : 0), 0);
  const rankedPlayers = useMemo(() => fPlayers.filter(p => p.ranked), [fPlayers]);
  const topP = rankedPlayers.length ? rankedPlayers[0] : null;

  // Streak calculations — current + record for players and teams
  const streakData = useMemo(() => {
    // Player streaks
    const playerStreaks = {};
    allNames.forEach(n => {
      const sk = calcStreaks(filtered, n);
      if (sk.hasStreakData) playerStreaks[n] = { bestW: sk.bestW, cur: sk.cur };
    });
    
    // Find record holder(s)
    let recordW = 0;
    Object.values(playerStreaks).forEach(s => { if (s.bestW > recordW) recordW = s.bestW; });
    const recordNames = Object.entries(playerStreaks).filter(([_, s]) => s.bestW === recordW).map(([n]) => n);
    
    // Find current best active win streak
    let curBestW = 0;
    Object.values(playerStreaks).forEach(s => { if (s.cur.type === "win" && s.cur.count > curBestW) curBestW = s.cur.count; });
    const curBestNames = Object.entries(playerStreaks).filter(([_, s]) => s.cur.type === "win" && s.cur.count === curBestW).map(([n]) => n);

    // Team streaks
    const teamStreaks = {};
    const tNames = new Set();
    filtered.forEach(d => { if (d.games && d.date >= STREAK_START) d.games.forEach(g => { if (g.t1Key.includes("+")) tNames.add(g.t1Key); if (g.t2Key.includes("+")) tNames.add(g.t2Key); }); });
    tNames.forEach(tName => {
      let bestW = 0, curW = 0, curL = 0, lastWon = null;
      filtered.forEach(d => {
        if (!d.games || d.date < STREAK_START) return;
        d.games.forEach(g => {
          const isT1 = g.t1Key === tName;
          const isT2 = g.t2Key === tName;
          if (!isT1 && !isT2) return;
          const won = (isT1 && g.winner === 1) || (isT2 && g.winner === 2);
          if (won) { curW++; bestW = Math.max(bestW, curW); curL = 0; }
          else { curL++; curW = 0; }
          lastWon = won;
        });
      });
      teamStreaks[tName] = { bestW, cur: { type: lastWon ? "win" : "loss", count: lastWon ? curW : curL } };
    });

    let tRecordW = 0;
    Object.values(teamStreaks).forEach(s => { if (s.bestW > tRecordW) tRecordW = s.bestW; });
    const tRecordNames = Object.entries(teamStreaks).filter(([_, s]) => s.bestW === tRecordW).map(([n]) => n);

    let tCurBestW = 0;
    Object.values(teamStreaks).forEach(s => { if (s.cur.type === "win" && s.cur.count > tCurBestW) tCurBestW = s.cur.count; });
    const tCurBestNames = Object.entries(teamStreaks).filter(([_, s]) => s.cur.type === "win" && s.cur.count === tCurBestW).map(([n]) => n);

    return {
      record: recordW > 0 ? { names: recordNames, count: recordW } : null,
      current: curBestW > 0 ? { names: curBestNames, count: curBestW } : null,
      teamRecord: tRecordW > 0 ? { names: tRecordNames, count: tRecordW } : null,
      teamCurrent: tCurBestW > 0 ? { names: tCurBestNames, count: tCurBestW } : null,
    };
  }, [filtered, allNames]);

  const handlePayment = () => {
    const a = parseFloat(paymentAmount);
    if (!paymentName || !a) return;
    const today = new Date().toISOString().split("T")[0];
    setDebts(prev => {
      const idx = prev.findIndex(d => d.person === paymentName);
      if (idx >= 0) return prev.map(d => d.person === paymentName ? {
        ...d, amount: d.amount - a,
        history: [...(d.history || []), { date: today, type: "zahlung", amount: a, desc: `Zahlung erhalten (€${a})` }]
      } : d);
      return [...prev, { person: paymentName, amount: -a, note: "schuldet dir", history: [{ date: today, type: "zahlung", amount: a, desc: `Zahlung erhalten (€${a})` }] }];
    });
    setPaymentName(""); setPaymentAmount("");
  };

  const tabs = [
    { id: "overview", label: "Übersicht", icon: "📊" },
    { id: "players", label: "Spieler", icon: "👤" },
    { id: "teams", label: "Teams", icon: "👥" },
    { id: "h2h", label: "Head-to-Head", icon: "⚔️" },
    { id: "charts", label: "Entwicklung", icon: "📈" },
    { id: "money", label: "Finanzen", icon: "💰" },
    { id: "add", label: "Erfassen", icon: "➕" },
  ];

  if (!loaded) return (
    <div style={{ fontFamily: "'Nunito', sans-serif", minHeight: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: T.textMid }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎾</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>Lade Daten…</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { border-color: ${T.accent} !important; box-shadow: 0 0 0 3px ${T.accentLight}; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
        @media (max-width: 640px) {
          .grid-2col { grid-template-columns: 1fr !important; }
          .grid-teams { grid-template-columns: 1fr !important; gap: 8px !important; }
          .nav-tabs { gap: 0 !important; overflow-x: auto; }
          .nav-tabs button { padding: 10px 6px !important; font-size: 14px !important; }
          .nav-label { display: none; }
          .content-area { padding: 12px 14px !important; }
          .filter-bar { padding: 10px 14px !important; }
          .app-header { padding: 18px 14px 14px !important; }
          .app-header h1 { font-size: 18px !important; }
          .locked-teams { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      {/* HEADER */}
      <div className="app-header" style={{ background: `linear-gradient(135deg, ${T.text} 0%, ${T.warmDark} 58%, ${T.brandGold} 100%)`, borderBottom: `3px solid ${T.brandGold}`, boxShadow: "0 4px 18px rgba(81,58,24,0.18)", padding: "28px 24px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.25)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>🎾</div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>Padel Tracker</h1>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", margin: 0 }}>Statistiken & Analysen</p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <div style={{ background: T.card, borderBottom: `1px solid ${T.border}`, overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "0 14px" }}>
        <div className="nav-tabs" style={{ maxWidth: 960, margin: "0 auto", display: "flex", gap: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? T.accentLight : "transparent",
              border: "none", borderBottom: tab === t.id ? `3px solid ${T.accent}` : "3px solid transparent",
              padding: "12px 14px", color: tab === t.id ? T.accent : T.textMuted,
              fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit", flex: "1 1 0",
              justifyContent: "center", whiteSpace: "nowrap",
            }}>
              {t.icon} <span className="nav-label">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FILTERS */}
      <div className="filter-bar" style={{ padding: "12px 24px", borderBottom: `1px solid ${T.borderLight}`, background: T.cardAlt }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {years.map(y => (
            <button key={y} onClick={() => setYearF(y)} style={pill(yearF === y)}>{y}</button>
          ))}
          {tab !== "add" && tab !== "money" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
              <span style={{ fontSize: 12, color: T.textMuted }}>Min. Spiele:</span>
              <select value={minG} onChange={e => setMinG(+e.target.value)} style={{ ...inputStyle, width: 60, padding: "4px 8px", fontSize: 12 }}>
                {[1, 3, 5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="content-area" style={{ maxWidth: 960, margin: "0 auto", padding: "20px 24px" }}>

        {/* ===== OVERVIEW ===== */}
        {tab === "overview" && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
            {[
              { l: "Spieltage", v: filtered.length, icon: "📅", c: T.accent },
              { l: "Spiele", v: totalGames, icon: "🎾", c: T.warm },
              { l: "Spieler", v: players.length, icon: "👥", c: T.green },
              topP ? { l: "Top Spieler", v: topP.name, icon: "🏆", c: T.gold, sub: `${fmt(topP.quote)} · ${topP.spiele} Sp.` } : null,
              streakData.current ? { l: "Aktuelle Serie", v: streakData.current.names.join(", "), icon: "🔥", c: T.green, sub: `${streakData.current.count} Siege in Folge` } : null,
              streakData.record ? { l: "Rekord Siegesserie", v: streakData.record.names.join(", "), icon: "⭐", c: T.gold, sub: `${streakData.record.count} Spiele in Folge` } : null,
              streakData.teamCurrent ? { l: "Aktuelle Team-Serie", v: streakData.teamCurrent.names.join(", "), icon: "🔥", c: T.accent, sub: `${streakData.teamCurrent.count} Siege in Folge` } : null,
              streakData.teamRecord ? { l: "Rekord Team-Serie", v: streakData.teamRecord.names.join(", "), icon: "⭐", c: T.warm, sub: `${streakData.teamRecord.count} Spiele in Folge` } : null,
            ].filter(Boolean).map((s, i) => (
              <div key={i} style={{ ...card, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -15, right: -15, width: 60, height: 60, borderRadius: "50%", background: `${s.c}15` }} />
                <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
                  {s.icon} {s.l}
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: s.c }}>{s.v}</div>
                {s.sub && <div style={{ fontSize: 11, color: T.textLight, marginTop: 2 }}>{s.sub}</div>}
              </div>
            ))}
          </div>

          <div style={{ padding: "8px 14px", background: T.accentLight, borderRadius: 10, fontSize: 12, color: T.accentDark, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 14 }}>ℹ️</span> Ranking nach Siegquote — Spieler ab {RANK_MIN}, Teams ab {RANK_MIN_TEAM} Spielen gewertet.
          </div>

          <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: T.textMid }}>👤 Spieler Ranking</h3>
              <Table data={fPlayers.slice(0, 15)} type="player" />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 800, marginBottom: 12, color: T.textMid }}>👥 Team Ranking</h3>
              <Table data={fTeams.slice(0, 15)} type="team" />
            </div>
          </div>
        </div>)}

        {/* ===== PLAYERS ===== */}
        {tab === "players" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Alle Spieler</h3>
          <div style={{ padding: "8px 14px", background: T.accentLight, borderRadius: 10, fontSize: 12, color: T.accentDark, marginBottom: 14 }}>
            ℹ️ Ranking nach Siegquote — ab {RANK_MIN} Spielen gewertet
          </div>
          <Table data={fPlayers} type="player" searchable />
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>Spieler-Detail & Streaks</h3>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {allNames.map(n => <button key={n} onClick={() => setSelPlayer(n)} style={pill(selPlayer === n, T.warm)}>{n}</button>)}
            </div>
            {selPlayer && (() => {
              const sk = calcStreaks(filtered, selPlayer);
              return (<div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 10 }}>Serien — {selPlayer}</div>
                  {sk.hasStreakData ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                      <div style={{ ...card, textAlign: "center", padding: 14 }}>
                        <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Aktuelle Serie</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: sk.cur.type === "win" ? T.green : T.red }}>
                          {sk.cur.count}<span style={{ fontSize: 11 }}> {sk.cur.type === "win" ? "Siege" : "Niederl."}</span>
                        </div>
                      </div>
                      <div style={{ ...card, textAlign: "center", padding: 14 }}>
                        <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Längste Siegesserie</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: T.green }}>{sk.bestW}<span style={{ fontSize: 11 }}> Spiele</span></div>
                      </div>
                      <div style={{ ...card, textAlign: "center", padding: 14 }}>
                        <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1 }}>Längste Niederl.serie</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: T.red }}>{sk.bestL}<span style={{ fontSize: 11 }}> Spiele</span></div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ ...card, padding: 16, marginBottom: 14 }}>
                      <div style={{ fontSize: 13, color: T.textMuted, textAlign: "center" }}>
                        📊 Serien-Tracking ab <strong>8. Januar 2026</strong><br/>
                        <span style={{ fontSize: 12 }}>Erst wenn Spiele einzeln erfasst werden, können exakte Serien berechnet werden.</span>
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 6 }}>Spieltage (W = Mehrheit gewonnen)</div>
                  <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
                    {sk.sess.map((s, i) => (
                      <div key={i} title={`${s.label}: ${s.w}/${s.s}`} style={{
                        width: 26, height: 26, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 9, fontWeight: 800, background: s.won ? T.greenLight : T.redLight,
                        color: s.won ? T.green : T.red, border: `1px solid ${s.won ? T.green : T.red}30`,
                      }}>{s.won ? "W" : "L"}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 8 }}>Kumulative Quote — {selPlayer}</div>
                  <CumulChart days={filtered} name={selPlayer} />
                </div>
              </div>);
            })()}
          </div>
        </div>)}

        {/* ===== TEAMS ===== */}
        {tab === "teams" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>Alle Team-Paarungen</h3>
          <div style={{ padding: "8px 14px", background: T.accentLight, borderRadius: 10, fontSize: 12, color: T.accentDark, marginBottom: 14 }}>
            ℹ️ Ranking nach Siegquote — ab {RANK_MIN_TEAM} Spielen gewertet
          </div>
          <Table data={fTeams} type="team" searchable />
        </div>)}

        {/* ===== H2H ===== */}
        {tab === "h2h" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Head-to-Head</h3>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 16 }}>Direkte Duelle bei Doppelspielen</p>
          {calcH2H(filtered).slice(0, 25).map((h, i) => {
            const tot = h.w1 + h.w2;
            const p1p = tot ? (h.w1 / tot) * 100 : 50;
            return (
              <div key={i} style={{ ...card, padding: "14px 18px", marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{h.p1}</span>
                  <span style={{ fontSize: 13, color: T.textMid, fontWeight: 800 }}>{h.w1} : {h.w2}</span>
                  <span style={{ fontWeight: 700, color: T.text, fontSize: 14 }}>{h.p2}</span>
                </div>
                <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", background: T.cardAlt }}>
                  <div style={{ width: `${p1p}%`, background: T.accent, borderRadius: "4px 0 0 4px" }} />
                  <div style={{ width: `${100 - p1p}%`, background: T.warm, borderRadius: "0 4px 4px 0" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  <span style={{ fontSize: 11, color: T.accent, fontWeight: 700 }}>{fmt(p1p)}</span>
                  <span style={{ fontSize: 11, color: T.textLight }}>{h.m} Spiele</span>
                  <span style={{ fontSize: 11, color: T.warm, fontWeight: 700 }}>{fmt(100 - p1p)}</span>
                </div>
              </div>
            );
          })}
        </div>)}

        {/* ===== CHARTS ===== */}
        {tab === "charts" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>Entwicklung über Zeit</h3>

          {/* PLAYER CHARTS */}
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 10, marginTop: 16 }}>👤 Spieler — wähle bis zu 6</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {allNames.map(n => {
              const idx = chartP.indexOf(n);
              const active = idx >= 0;
              return <button key={n} onClick={() => setChartP(prev => active ? prev.filter(x => x !== n) : prev.length < 6 ? [...prev, n] : prev)} style={{
                ...pill(active, active ? T.chartColors[idx % T.chartColors.length] : T.accent),
                borderColor: active ? T.chartColors[idx % T.chartColors.length] : T.border,
              }}>{n}</button>;
            })}
          </div>
          {chartP.length > 0 && (
            <div style={{ ...card, marginBottom: 20 }}>
              <DevChart days={filtered} names={chartP} type="player" />
            </div>
          )}

          {/* TEAM CHARTS */}
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 10 }}>👥 Teams — wähle bis zu 6</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
            {fTeams.slice(0, 20).map(t => {
              const idx = chartTeams.indexOf(t.team);
              const active = idx >= 0;
              return <button key={t.team} onClick={() => setChartTeams(prev => active ? prev.filter(x => x !== t.team) : prev.length < 6 ? [...prev, t.team] : prev)} style={{
                ...pill(active, active ? T.chartColors[idx % T.chartColors.length] : T.warm),
                borderColor: active ? T.chartColors[idx % T.chartColors.length] : T.border,
                fontSize: 12,
              }}>{t.team} ({t.spiele})</button>;
            })}
          </div>
          {chartTeams.length > 0 && (
            <div style={{ ...card, marginBottom: 20 }}>
              <DevChart days={filtered} names={chartTeams} type="team" />
            </div>
          )}

          {/* BAR CHART */}
          <div style={card}>
            <div style={{ fontSize: 13, color: T.textMuted, marginBottom: 12 }}>Siegquoten-Vergleich (Spieler)</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={fPlayers.slice(0, 12)}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
                <XAxis dataKey="name" stroke={T.textLight} fontSize={11} angle={-30} textAnchor="end" height={55} />
                <YAxis stroke={T.textLight} fontSize={11} domain={[0, 100]} tickFormatter={v => v + "%"} />
                <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10 }} formatter={v => [fmt(v), "Quote"]} />
                <Bar dataKey="quote" radius={[6, 6, 0, 0]}>
                  {fPlayers.slice(0, 12).map((_, i) => <Cell key={i} fill={T.chartColors[i % T.chartColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>)}

        {/* ===== MONEY ===== */}
        {tab === "money" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4 }}>💰 Finanzen / Splitwise</h3>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 16 }}>Schulden-Übersicht (aus Sicht von René) · Klicke auf einen Eintrag für Details</p>

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {debts.filter(d => d.amount !== 0).sort((a, b) => {
              if (a.amount < 0 && b.amount < 0) return a.amount - b.amount;
              if (a.amount > 0 && b.amount > 0) return b.amount - a.amount;
              return a.amount - b.amount;
            }).map((d, i) => {
              const isOpen = expandedDebt === d.person;
              return (
                <div key={i}>
                  <div onClick={() => setExpandedDebt(isOpen ? null : d.person)} style={{
                    ...card, padding: "14px 18px",
                    borderLeft: `4px solid ${d.amount > 0 ? T.red : T.green}`,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    cursor: "pointer", borderColor: isOpen ? T.accent : T.border,
                    borderLeftColor: d.amount > 0 ? T.red : T.green,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{d.person}</span>
                      <span style={{ color: T.textLight, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: d.amount > 0 ? T.red : T.green }}>
                      {d.amount > 0 ? `Du schuldest €${d.amount.toFixed(2)}` : `schuldet dir €${Math.abs(d.amount).toFixed(2)}`}
                    </div>
                  </div>
                  {isOpen && d.history && d.history.length > 0 && (
                    <div style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 14 }}>
                      <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Verlauf</div>
                      {d.history.map((h, hi) => {
                        const isPlus = h.amount > 0;
                        return (
                          <div key={hi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, padding: "6px 10px", background: T.card, borderRadius: 8, border: `1px solid ${T.border}` }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: T.accent, minWidth: 65 }}>{h.date.split("-").reverse().slice(0,2).join(".")}</span>
                            <span style={{ fontSize: 12, color: T.textMid, flex: 1 }}>{h.desc}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: h.type === "zahlung" ? T.green : h.amount < 0 ? T.red : T.warm }}>
                              {h.type === "zahlung" ? `+€${h.amount.toFixed(0)}` : h.amount < 0 ? `-€${Math.abs(h.amount).toFixed(0)}` : `€${h.amount.toFixed(0)}`}
                            </span>
                          </div>
                        );
                      })}
                      <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                        <span style={{ color: T.textMuted }}>Saldo</span>
                        <span style={{ fontWeight: 800, color: d.amount > 0 ? T.red : d.amount < 0 ? T.green : T.textMid }}>€{d.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                  {isOpen && (!d.history || d.history.length === 0) && (
                    <div style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 14, fontSize: 12, color: T.textLight, fontStyle: "italic" }}>
                      Kein detaillierter Verlauf vorhanden
                    </div>
                  )}
                </div>
              );
            })}
            {debts.filter(d => d.amount === 0).map((d, i) => {
              const isOpen = expandedDebt === d.person;
              return (
                <div key={`q${i}`}>
                  <div onClick={() => setExpandedDebt(isOpen ? null : d.person)} style={{ ...card, padding: "12px 18px", display: "flex", justifyContent: "space-between", opacity: 0.6, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{d.person}</span>
                      {d.history && d.history.length > 0 && <span style={{ color: T.textLight, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>}
                    </div>
                    <span style={{ color: T.textMuted, fontWeight: 600 }}>quitt ✓</span>
                  </div>
                  {isOpen && d.history && d.history.length > 0 && (
                    <div style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 14 }}>
                      <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Verlauf</div>
                      {d.history.map((h, hi) => (
                        <div key={hi} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, padding: "6px 10px", background: T.card, borderRadius: 8, border: `1px solid ${T.border}` }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.accent, minWidth: 65 }}>{h.date.split("-").reverse().slice(0,2).join(".")}</span>
                          <span style={{ fontSize: 12, color: T.textMid, flex: 1 }}>{h.desc}</span>
                          <span style={{ fontSize: 13, fontWeight: 800, color: h.type === "zahlung" ? T.green : T.warm }}>
                            {h.type === "zahlung" ? `+€${h.amount.toFixed(0)}` : `€${h.amount.toFixed(0)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={card}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: T.textMid, marginBottom: 12 }}>Zahlung erhalten</h4>
            <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 10 }}>Wenn jemand dir Geld überweist, trag es hier ein</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <select value={paymentName} onChange={e => setPaymentName(e.target.value)} style={inputStyle}>
                <option value="">Spieler wählen…</option>
                {allNames.filter(n => n !== "René").map(n => <option key={n} value={n}>{n}{(() => { const d = debts.find(x => x.person === n); return d ? ` (Saldo: €${d.amount.toFixed(2)})` : ""; })()}</option>)}
              </select>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Betrag €" type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} style={inputStyle} />
                <button onClick={handlePayment} style={{ ...btnPrimary, whiteSpace: "nowrap", padding: "10px 18px", fontSize: 13 }}>Buchen</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, padding: "12px 16px", background: T.warmLight, borderRadius: 12, fontSize: 12, color: T.warmDark }}>
            <strong>Gesamt-Saldo:</strong> Du schuldest insgesamt <strong>€{debts.filter(d => d.amount > 0).reduce((a, d) => a + d.amount, 0).toFixed(2)}</strong> · Dir wird geschuldet <strong>€{Math.abs(debts.filter(d => d.amount < 0).reduce((a, d) => a + d.amount, 0)).toFixed(2)}</strong>
          </div>
        </div>)}

        {/* ===== ADD ===== */}
        {tab === "add" && (<div>
          <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16 }}>Spieltag erfassen</h3>
          {!showAdd ? (
            <button onClick={() => setShowAdd(true)} style={btnPrimary}>➕ Neuer Spieltag</button>
          ) : (
            <div style={{ ...card, borderColor: `${T.accent}44`, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h4 style={{ fontWeight: 800, fontSize: 15 }}>Neuer Spieltag</h4>
                <button onClick={resetAdd} style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 18 }}>✕</button>
              </div>

              {/* DATE + MODE */}
              <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Datum</label>
                  <input type="date" value={addDate} onChange={e => setAddDate(e.target.value)} style={{ ...inputStyle, width: 180 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Modus</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setAddMode("doppel"); setCurT1([]); setCurT2([]); setTeamsLocked(false); }} style={pill(addMode === "doppel")}>👥 Doppel</button>
                    <button onClick={() => { setAddMode("einzel"); setCurT1([]); setCurT2([]); setTeamsLocked(false); }} style={pill(addMode === "einzel")}>👤 Einzel</button>
                  </div>
                </div>
              </div>

              {/* PLAYERS */}
              <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Wer spielt mit?</label>
              {addSessionPlayers.map((n, i) => (
                <div key={i} style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                  <input placeholder={`Spieler ${i + 1}`} value={n} onChange={e => { const a = [...addSessionPlayers]; a[i] = e.target.value; setAddSessionPlayers(a); }} style={{ ...inputStyle, flex: 1 }} />
                  {addSessionPlayers.length > 2 && (
                    <button onClick={() => { setAddSessionPlayers(addSessionPlayers.filter((_, j) => j !== i)); setCurT1(prev => prev.filter(x => x !== n)); setCurT2(prev => prev.filter(x => x !== n)); }} style={{ background: T.redLight, border: `1px solid ${T.red}30`, borderRadius: 8, color: T.red, cursor: "pointer", fontSize: 14, fontWeight: 700, width: 32 }}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={() => setAddSessionPlayers([...addSessionPlayers, ""])} style={{ background: T.accentLight, border: `1px solid ${T.accent}40`, borderRadius: 8, padding: "6px 14px", color: T.accent, fontSize: 12, fontWeight: 700, cursor: "pointer", marginBottom: 20 }}>+ Spieler</button>

              {/* GAME ENTRY */}
              {activeSessionPlayers.length >= teamSize * 2 && (
                <div style={{ borderTop: `2px solid ${T.border}`, paddingTop: 16 }}>

                  {/* TEAM SELECTION — only if not locked or first game */}
                  {!teamsLocked && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Teams aufstellen {addMode === "doppel" ? "(je 2 Spieler)" : "(je 1 Spieler)"}</label>
                      <div className="grid-teams" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "start" }}>
                        <div style={{ background: T.accentLight, borderRadius: 12, padding: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: T.accent, marginBottom: 8 }}>TEAM 1 ({curT1.length}/{teamSize})</div>
                          {activeSessionPlayers.map(n => {
                            const inT1 = curT1.includes(n), inT2 = curT2.includes(n);
                            if (inT2) return null;
                            const dis = !inT1 && curT1.length >= teamSize;
                            return <button key={n} disabled={dis} onClick={() => setCurT1(p => inT1 ? p.filter(x => x !== n) : [...p, n])} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 4, background: inT1 ? T.accent : dis ? T.cardAlt : T.card, color: inT1 ? "#fff" : dis ? T.textLight : T.textMid, border: `1px solid ${inT1 ? T.accent : T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: dis ? "default" : "pointer", opacity: dis ? 0.5 : 1 }}>{inT1 ? "✓ " : ""}{n}</button>;
                          })}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", paddingTop: 30 }}>
                          <button onClick={() => { setCurT1(curT2); setCurT2(curT1); }} style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16 }}>⇄</button>
                        </div>
                        <div style={{ background: T.warmLight, borderRadius: 12, padding: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 800, color: T.warmDark, marginBottom: 8 }}>TEAM 2 ({curT2.length}/{teamSize})</div>
                          {activeSessionPlayers.map(n => {
                            const inT1 = curT1.includes(n), inT2 = curT2.includes(n);
                            if (inT1) return null;
                            const dis = !inT2 && curT2.length >= teamSize;
                            return <button key={n} disabled={dis} onClick={() => setCurT2(p => inT2 ? p.filter(x => x !== n) : [...p, n])} style={{ display: "block", width: "100%", textAlign: "left", marginBottom: 4, background: inT2 ? T.warm : dis ? T.cardAlt : T.card, color: inT2 ? "#fff" : dis ? T.textLight : T.textMid, border: `1px solid ${inT2 ? T.warm : T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, fontWeight: 700, cursor: dis ? "default" : "pointer", opacity: dis ? 0.5 : 1 }}>{inT2 ? "✓ " : ""}{n}</button>;
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* LOCKED TEAMS DISPLAY + UNLOCK */}
                  {teamsLocked && (
                    <div className="locked-teams" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ background: T.accentLight, borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: T.accent }}>
                        {curT1.join(" + ")}
                      </div>
                      <span style={{ fontSize: 12, color: T.textLight, fontWeight: 800 }}>vs</span>
                      <div style={{ background: T.warmLight, borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, color: T.warmDark }}>
                        {curT2.join(" + ")}
                      </div>
                      <button onClick={() => setTeamsLocked(false)} style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, color: T.textMid, cursor: "pointer", fontWeight: 600 }}>✏️ Teams ändern</button>
                    </div>
                  )}

                  {/* GAME ENTRY */}
                  {curT1.length === teamSize && curT2.length === teamSize && (
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Spiel {addGames.length + 1} — Wer gewinnt?</label>
                      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
                        <button onClick={() => handleAddGame(1)} style={{
                          flex: 1, minWidth: 120, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`,
                          border: "none", borderRadius: 10, padding: "12px", color: "#fff",
                          fontSize: 13, fontWeight: 800, cursor: "pointer",
                        }}>🏆 {curT1.join(" + ")}</button>
                        <button onClick={() => handleAddGame(2)} style={{
                          flex: 1, minWidth: 120, background: `linear-gradient(135deg, ${T.warm}, ${T.warmDark})`,
                          border: "none", borderRadius: 10, padding: "12px", color: "#fff",
                          fontSize: 13, fontWeight: 800, cursor: "pointer",
                        }}>🏆 {curT2.join(" + ")}</button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: T.textMuted }}>Sätze (optional):</span>
                        <input type="number" min="0" placeholder="-" value={curS1} onChange={e => setCurS1(e.target.value)} style={{ ...inputStyle, width: 50, textAlign: "center", fontSize: 16, fontWeight: 800, padding: "6px 4px" }} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: T.textLight }}>:</span>
                        <input type="number" min="0" placeholder="-" value={curS2} onChange={e => setCurS2(e.target.value)} style={{ ...inputStyle, width: 50, textAlign: "center", fontSize: 16, fontWeight: 800, padding: "6px 4px" }} />
                      </div>
                    </div>
                  )}

                  {/* RECORDED GAMES */}
                  {addGames.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Eingetragene Spiele</label>
                      {addGames.map((g, i) => {
                        const w1 = g.winner === 1;
                        return (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, background: T.cardAlt, borderRadius: 10, padding: "8px 12px", flexWrap: "wrap" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: T.accent, minWidth: 44 }}>#{i + 1}</span>
                            <span style={{ fontSize: 12, fontWeight: w1 ? 800 : 400, color: w1 ? T.green : T.textMid }}>{g.team1.join("+")}</span>
                            {g.score1 != null ? (
                              <span style={{ fontSize: 14, fontWeight: 800, color: T.text, fontFamily: "monospace" }}>{g.score1}:{g.score2}</span>
                            ) : (
                              <span style={{ fontSize: 12, color: T.textLight }}>vs</span>
                            )}
                            <span style={{ fontSize: 12, fontWeight: !w1 ? 800 : 400, color: !w1 ? T.green : T.textMid }}>{g.team2.join("+")}</span>
                            <button onClick={() => handleRemoveGame(i)} style={{ marginLeft: "auto", background: "none", border: "none", color: T.red, cursor: "pointer", fontSize: 12, padding: 4 }}>✕</button>
                          </div>
                        );
                      })}

                      {/* LIVE STATS */}
                      <div style={{ marginTop: 12, padding: "10px 14px", background: T.accentLight, borderRadius: 10, fontSize: 12, color: T.accentDark }}>
                        <strong>Zwischenstand:</strong>{" "}
                        {(() => {
                          const st = {};
                          addGames.forEach(g => {
                            [...g.team1, ...g.team2].forEach(n => {
                              if (!st[n]) st[n] = { s: 0, w: 0, sw: 0, sl: 0 };
                              st[n].s++;
                              const inT1 = g.team1.includes(n);
                              const won = (inT1 && g.winner === 1) || (!inT1 && g.winner === 2);
                              if (won) st[n].w++;
                              st[n].sw += inT1 ? g.score1 : g.score2;
                              st[n].sl += inT1 ? g.score2 : g.score1;
                            });
                          });
                          return Object.entries(st).map(([n, v]) => `${n} ${v.w}/${v.s} (Sätze ${v.sw}:${v.sl})`).join(" · ");
                        })()}
                      </div>

                      {/* TEAM STATS */}
                      {addMode === "doppel" && (
                        <div style={{ marginTop: 8, padding: "10px 14px", background: T.warmLight, borderRadius: 10, fontSize: 12, color: T.warmDark }}>
                          <strong>Teams:</strong>{" "}
                          {(() => {
                            const ts = {};
                            addGames.forEach(g => {
                              const k1 = [...g.team1].sort().join("+"), k2 = [...g.team2].sort().join("+");
                              if (!ts[k1]) ts[k1] = { s: 0, w: 0, sw: 0, sl: 0 };
                              if (!ts[k2]) ts[k2] = { s: 0, w: 0, sw: 0, sl: 0 };
                              ts[k1].s++; ts[k2].s++;
                              ts[k1].sw += g.score1; ts[k1].sl += g.score2;
                              ts[k2].sw += g.score2; ts[k2].sl += g.score1;
                              if (g.winner === 1) ts[k1].w++; else ts[k2].w++;
                            });
                            return Object.entries(ts).map(([k, v]) => `${k} ${v.w}/${v.s} (${v.sw}:${v.sl})`).join(" · ");
                          })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* COSTS */}
                  {addGames.length > 0 && (
                    <div style={{ marginTop: 16, borderTop: `2px solid ${T.border}`, paddingTop: 16 }}>
                      <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>💰 Kosten pro Spieler</label>
                      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                        {[...new Set(addGames.flatMap(g => [...g.team1, ...g.team2]))].map(name => (
                          <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, color: T.textMid, fontWeight: 600, minWidth: 70 }}>{name}</span>
                            <input type="number" placeholder="0" value={addCosts[name] || ""} onChange={e => setAddCosts(prev => ({ ...prev, [name]: e.target.value }))} style={{ ...inputStyle, padding: "6px 10px", fontSize: 13 }} />
                            <span style={{ fontSize: 11, color: T.textLight }}>€</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SAVE */}
                  {addGames.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <button onClick={handleSaveSession} style={btnPrimary}>✓ Spieltag speichern ({addGames.length} Spiele)</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <h4 style={{ fontSize: 14, color: T.textMuted, marginTop: 24, marginBottom: 10 }}>Spieltage — {yearF} ({filtered.length})</h4>
          {[...filtered].reverse().map((d, i) => {
            const isOpen = expandedDay === d.date;
            const nGames = d.players.length ? d.players[0].s : 0;
            return (
              <div key={i} style={{ marginBottom: 6 }}>
                <div onClick={() => setExpandedDay(isOpen ? null : d.date)} style={{ ...card, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderColor: isOpen ? T.accent : T.border }}>
                  <div>
                    <span style={{ fontWeight: 800, color: T.accent, fontSize: 13 }}>{d.date}</span>
                    <span style={{ color: T.textMuted, fontSize: 12, marginLeft: 10 }}>{d.players.map(p => p.name).join(", ")}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: T.textLight, fontSize: 12 }}>{nGames} Spiele</span>
                    <span style={{ color: T.textLight, fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isOpen && (
                  <div style={{ background: T.cardAlt, border: `1px solid ${T.border}`, borderTop: "none", borderRadius: "0 0 16px 16px", padding: 16 }}>
                    {/* Player results */}
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Spieler</div>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {[...d.players].sort((a, b) => b.w - a.w).map(p => (
                          <div key={p.name} style={{ background: T.card, borderRadius: 10, padding: "8px 12px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontWeight: 700, fontSize: 13 }}>{p.name}</span>
                            <span style={{ fontWeight: 800, fontSize: 13, color: p.w > p.s / 2 ? T.green : p.w === p.s / 2 ? T.gold : T.red }}>{p.w}/{p.s}</span>
                            <span style={{ fontSize: 11, color: T.textMuted }}>{fmt(pct(p.w, p.s))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Team results */}
                    {d.teams.length > 0 && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Teams</div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {[...d.teams].sort((a, b) => b.w - a.w).map(t => (
                            <div key={t.t} style={{ background: T.card, borderRadius: 10, padding: "8px 12px", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontWeight: 700, fontSize: 13 }}>{t.t}</span>
                              <span style={{ fontWeight: 800, fontSize: 13, color: t.w > t.s / 2 ? T.green : t.w === t.s / 2 ? T.gold : T.red }}>{t.w}/{t.s}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Individual games with scores */}
                    {d.games && d.games.length > 0 && (
                      <div>
                        <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Einzelne Spiele</div>
                        {d.games.map((g, gi) => {
                          const w1 = g.winner === 1;
                          return (
                            <div key={gi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, background: T.card, borderRadius: 10, padding: "6px 12px", border: `1px solid ${T.border}`, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 11, fontWeight: 800, color: T.accent, minWidth: 36 }}>#{gi + 1}</span>
                              <span style={{ fontSize: 13, fontWeight: w1 ? 800 : 400, color: w1 ? T.green : T.textMid }}>{g.team1.join(" + ")}</span>
                              {g.score1 != null && (
                                <span style={{ fontSize: 15, fontWeight: 800, color: T.text, fontFamily: "monospace" }}>{g.score1}:{g.score2}</span>
                              )}
                              <span style={{ fontSize: 13, fontWeight: !w1 ? 800 : 400, color: !w1 ? T.green : T.textMid }}>{g.team2.join(" + ")}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {/* No game data */}
                    {(!d.games || d.games.length === 0) && (
                      <div style={{ fontSize: 12, color: T.textLight, fontStyle: "italic" }}>Keine Einzelspiel-Daten vorhanden (vor März 2026 erfasst)</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>)}
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================
function Table({ data, type, searchable }) {
  const [search, setSearch] = useState("");
  const filteredData = search.trim()
    ? data.filter(r => {
        const name = type === "player" ? r.name : r.team;
        return name.toLowerCase().includes(search.toLowerCase());
      })
    : data;
  const ranked = filteredData.filter(r => r.ranked);
  const unranked = filteredData.filter(r => !r.ranked);
  return (
    <div>
      {searchable && (
        <input placeholder={`🔍 ${type === "player" ? "Spieler" : "Team"} suchen…`} value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 10, fontSize: 13, padding: "8px 12px", width: "100%", maxWidth: 280 }} />
      )}
      <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 3px", fontSize: 13 }}>
        <thead>
          <tr style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: T.textMuted }}>
            <th style={{ padding: "6px 10px", textAlign: "left" }}>#</th>
            <th style={{ padding: "6px 10px", textAlign: "left" }}>{type === "player" ? "Spieler" : "Team"}</th>
            <th style={{ padding: "6px 10px", textAlign: "right" }}>Sp.</th>
            <th style={{ padding: "6px 10px", textAlign: "right" }}>S.</th>
            <th style={{ padding: "6px 10px", textAlign: "right" }}>Quote</th>
            <th style={{ padding: "6px 10px", textAlign: "right", minWidth: 90 }}></th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((r, i) => {
            const q = r.quote;
            const name = type === "player" ? r.name : r.team;
            return (
              <tr key={name + i} style={{ background: i < 3 ? T.accentLight : "transparent" }}>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: T.textLight }}>{i < 3 ? MEDAL[i] : i + 1}</td>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: T.text }}>{name}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: T.textMid }}>{r.spiele}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: T.textMid }}>{r.siege}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 800, color: q >= 60 ? T.green : q >= 40 ? T.gold : T.red }}>{fmt(q)}</td>
                <td style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: 70, height: 6, background: T.cardAlt, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(q, 100)}%`, height: "100%", borderRadius: 3, background: q >= 60 ? T.green : q >= 40 ? T.gold : T.red }} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
          {unranked.length > 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "10px 10px 6px", fontSize: 10, color: T.textLight, textTransform: "uppercase", letterSpacing: 1.5, borderTop: `2px dashed ${T.border}` }}>
                Ungewertet · unter {type === "team" ? RANK_MIN_TEAM : RANK_MIN} Spiele
              </td>
            </tr>
          )}
          {unranked.map((r, i) => {
            const q = r.quote;
            const name = type === "player" ? r.name : r.team;
            return (
              <tr key={name + "u" + i} style={{ opacity: 0.6 }}>
                <td style={{ padding: "8px 10px", fontWeight: 700, color: T.textLight }}>—</td>
                <td style={{ padding: "8px 10px", fontWeight: 600, color: T.textMid }}>{name}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: T.textMuted }}>{r.spiele}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", color: T.textMuted }}>{r.siege}</td>
                <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: T.textMuted }}>{fmt(q)}</td>
                <td style={{ padding: "8px 10px" }}>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ width: 70, height: 6, background: T.cardAlt, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${Math.min(q, 100)}%`, height: "100%", borderRadius: 3, background: T.textLight }} />
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

function CumulChart({ days, name }) {
  const data = useMemo(() => {
    let tS = 0, tW = 0;
    return days.map(d => {
      const f = d.players.find(p => p.name === name);
      if (f) { tS += f.s; tW += f.w; }
      return f ? { label: d.label, q: tS ? pct(tW, tS) : 0 } : null;
    }).filter(Boolean);
  }, [days, name]);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
        <XAxis dataKey="label" stroke={T.textLight} fontSize={10} />
        <YAxis stroke={T.textLight} fontSize={10} domain={[0, 100]} tickFormatter={v => v + "%"} />
        <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12 }} formatter={v => [fmt(v), "Quote"]} />
        <Line type="monotone" dataKey="q" stroke={T.accent} strokeWidth={2.5} dot={{ r: 3, fill: T.accent }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function DevChart({ days, names, type = "player" }) {
  const data = useMemo(() => {
    const dates = [...new Set(days.map(d => d.date))].sort();
    return dates.map(dt => {
      const d = days.find(x => x.date === dt);
      const pt = { label: d.label };
      if (type === "player") {
        names.forEach(n => { const f = d.players.find(p => p.name === n); if (f) pt[n] = pct(f.w, f.s); });
      } else {
        names.forEach(n => { const f = d.teams.find(t => t.t === n); if (f) pt[n] = pct(f.w, f.s); });
      }
      return pt;
    });
  }, [days, names, type]);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={T.border} />
        <XAxis dataKey="label" stroke={T.textLight} fontSize={10} />
        <YAxis stroke={T.textLight} fontSize={10} domain={[0, 100]} tickFormatter={v => v + "%"} />
        <Tooltip contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12 }} formatter={v => [fmt(v), ""]} />
        <Legend />
        {names.map((n, i) => <Line key={n} type="monotone" dataKey={n} stroke={T.chartColors[i % T.chartColors.length]} strokeWidth={2} dot={{ r: 3 }} connectNulls />)}
      </LineChart>
    </ResponsiveContainer>
  );
}
