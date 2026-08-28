# Padel Statistik Privat

Private Statistik- und Finanz-App für Renés Padel-Gruppe (Götzis) — React + Vite, alle Daten fest im Code, kein Backend.

## Zweck
- Öffentlich lesbar für die Kollegen, **ändern darf nur René** (Änderungen laufen ausschließlich über dieses Repo/diesen Ordner).
- Veröffentlichung: **GitHub Pages** über das GitHub-Konto **Puntoro**, Repo `padel-statistik` → https://puntoro.github.io/padel-statistik/

## Daten pflegen
- Spieltage: `src/PadelTracker.jsx` → `MATCH_DAYS_2024/2025/2026` (players `s`=Spiele, `w`=Siege; teams; games).
- Finanzen/Schulden: `src/PadelTracker.jsx` → `INITIAL_DEBTS` (positiv = René schuldet der Person bzw. Guthaben der Person, negativ = Person schuldet René; Platz-Einträge negativ, Zahlungen positiv).
- Nach jeder Datenänderung: `DATA_VERSION` hochzählen (sonst zieht der Browser-Cache alte Daten).

## Bauen & Veröffentlichen
```bash
npm install && npm run build   # Output in dist/
```
Deploy: `dist/` auf Branch `gh-pages` pushen (Konto Puntoro). `vite.config.js` hat `base: "/padel-statistik/"`.

## Regeln
- Design: Puntoro-goldig (Gold als Leitfarbe, Puntoro-Rot #C62828 nur als Akzent).
- Echte Umlaute überall, lean bleiben (ponytail), keine neuen Abhängigkeiten ohne echten Grund.
- Gebaut wird über die Codex-Schleife (Claude plant/prüft, Codex baut).
