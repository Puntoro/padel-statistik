# Padel Tracker

Statistik- und Finanz-Tracker für die Padel-Gruppe in Götzis.
React + Vite, keine Backend-Abhängigkeit — alle Daten liegen im Browser.

Stand der Daten: **27.08.2026** (108 Spieltage 2024–2026, 11 Finanz-Einträge).

---

## Starten

```bash
npm install
npm run dev
```

Läuft dann auf http://localhost:5173. Der Dev-Server ist mit `host: true`
konfiguriert, du kannst also vom Handy im gleichen WLAN auf die
Netzwerk-Adresse zugreifen, die Vite beim Start ausgibt.

Build für Produktion:

```bash
npm run build      # Output landet in dist/
npm run preview    # Build lokal testen
```

---

## Dateien

```
src/
  PadelTracker.jsx   Die komplette App: Daten, Berechnungen, UI (~1500 Zeilen)
  storage.js         Persistenz-Adapter (aktuell localStorage)
  main.jsx           React-Einstiegspunkt
  index.css          Nur Page-Shell, Komponente bringt eigene Styles mit
```

Alles steckt bewusst in einer Datei, weil die App aus einem Claude-Artifact
stammt. Wenn du in Claude Code weiterbaust, ist Aufteilen sinnvoll — siehe
"Nächste Schritte".

---

## Datenmodell

### Spieltag

```js
{
  date: "2026-08-13",       // ISO, wird zum Sortieren benutzt
  label: "13.8",            // Anzeige-Label
  mode: "einzel",           // optional; ohne Angabe = Doppel
  players: [                // Tagesbilanz pro Spieler
    { name: "René", s: 4, w: 3 }   // s = Spiele, w = Siege
  ],
  teams: [                  // Tagesbilanz pro Paarung
    { t: "Max+René", s: 2, w: 2 }
  ],
  games: [                  // Einzelspiele — Basis für Serien
    {
      team1: ["Max", "René"],
      team2: ["Kasi", "Simon V"],
      winner: 1,            // 1 oder 2
      score1: 6, score2: 3, // optional, null wenn nicht mitgeschrieben
      t1Key: "Max+René",    // alphabetisch sortierter Team-Key
      t2Key: "Kasi+Simon V"
    }
  ]
}
```

`players` und `teams` sind redundant zu `games` — sie existieren, weil die
alten Spieltage (2024/25) nur als Tagessumme vorliegen, ohne Spielreihenfolge.
Neue Einträge über die App füllen beides.

### Finanzen

```js
{
  person: "Max",
  amount: 106,              // > 0: du schuldest ihm | < 0: er schuldet dir
  note: "Du schuldest",
  history: [
    { date: "2026-08-13", type: "platz", amount: -16, desc: "Platz 13.8." }
  ]
}
```

`type` ist `platz` (Platzkosten), `zahlung` (Überweisung) oder `saldo`
(Altbestand aus Splitwise). Die History ist nur Anzeige — der `amount` ist
die Wahrheit und wird bei jeder Buchung direkt fortgeschrieben.

---

## Wichtige Konstanten

| Konstante | Wert | Bedeutung |
|---|---|---|
| `DATA_VERSION` | `"2026-08-27-v1"` | Ändert sich der hartkodierte Datenbestand, muss diese hochgezählt werden, sonst überschreibt der localStorage die neuen Daten. |
| `STREAK_START` | `"2026-01-08"` | Ab hier existieren Spiel-für-Spiel-Daten. Serien davor werden nicht berechnet, weil die Reihenfolge unbekannt ist. |
| `RANK_MIN` | `20` | Ab so vielen Spielen ist ein Spieler gewertet. |
| `RANK_MIN_TEAM` | `10` | Dasselbe für Teams. |

**Die `DATA_VERSION` ist die häufigste Fehlerquelle.** Wenn du in
`INITIAL_MATCH_DAYS` oder `INITIAL_DEBTS` etwas änderst und die App zeigt
weiter die alten Zahlen: Version hochzählen (oder localStorage leeren).

---

## Berechnungen

- `calcPlayers(days)` — Spieler-Ranking, teilt in gewertet/ungewertet
- `calcTeams(days)` — dasselbe für Teams; normalisiert Keys alphabetisch,
  damit `Max+Kasi` und `Kasi+Max` als ein Team zählen; Einzel-Einträge
  (kein `+` im Key) werden übersprungen
- `calcStreaks(days, name)` — aktuelle und Rekord-Serie eines Spielers,
  nur aus `games`-Daten ab `STREAK_START`
- `calcH2H(days, a, b)` — Direktvergleich zweier Spieler
- `streakData` (useMemo in der Komponente) — beste aktuelle und beste
  Rekord-Serie über alle Spieler und Teams, inkl. Gleichstand (mehrere Namen)

---

## Bekannte Eigenheiten

- Spieler-Namen sind der Primärschlüssel. Schreibweise muss exakt passen,
  sonst entstehen Doppel-Einträge. Bereits vereinheitlicht: `Santer`
  (nicht "Sandro Santer"), `Simon V` (nicht "SimonV"), `Böhler`
  (= Lukas Böhler, in Splitwise "Lukas"). `Simon` und `Simon V` sind
  zwei verschiedene Personen.
- Es gibt keine Nutzerverwaltung. Die App ist aus Renés Perspektive
  geschrieben — Schulden-Vorzeichen beziehen sich immer auf ihn.
- Die Spielanzahl eines Tages wird als `players[0].s` gelesen, weil beim
  Doppel alle gleich viele Spiele haben. Bei wechselnder Besetzung
  innerhalb eines Tages stimmt das nicht exakt.

---

## Nächste Schritte

Naheliegende Ausbaustufen, falls du weitermachst:

1. **Aufteilen** — `data/matchDays.js`, `data/debts.js`, `lib/stats.js`,
   `components/` je Tab. Die Datei ist an der Grenze zur Unübersichtlichkeit.
2. **Echtes Backend** — nur `src/storage.js` austauschen, die Signaturen
   (`get`/`set`/`remove`/`list`, alle async) bleiben. Damit könnten alle
   aus der Gruppe eintragen statt nur du. Supabase wäre wenig Aufwand.
3. **Sätze nachpflegen** — das Feld ist da (`score1`/`score2`, optional),
   wird aktuell aber selten befüllt.
4. **Tests** für `calcStreaks` — die Serien-Logik war mehrfach die
   Fehlerquelle (Einzel-Spiele als Teams, Reihenfolge über Spieltage hinweg).
