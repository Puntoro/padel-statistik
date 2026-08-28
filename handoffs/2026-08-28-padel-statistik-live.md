# Hand-off: Padel-Statistik live geschaltet — 28.08.2026, Freitag

## Worum es ging (2-3 Sätze)
Renés private Padel-Statistik-App (aus ZIP + JSX in Downloads) sollte öffentlich zugänglich nachgebaut und veröffentlicht werden — lesbar für alle Kollegen, änderbar nur durch René. Dazu kamen der neue Spieltag vom 27.8. (Max+René 4:0 gegen Kasi+Simon V) samt neuen Salden und ein Umstyling ins goldene Puntoro-Design.

## Stand jetzt
- **Live und abgenommen:** https://puntoro.github.io/padel-statistik/ — Abnahme-Agent hat Zahlen, Umlaute, Design, Mobil-Ansicht geprüft: BESTANDEN.
- Projektordner `~/Documents/padel-statistik/` mit eigener CLAUDE.md (Pflege-Anleitung für Spieltage, Schulden, Deploy).
- Repo `Puntoro/padel-statistik` (GitHub-Konto Puntoro, `gh` auf dem Mac angemeldet): `main` = Quellcode, `gh-pages` = gebauter Stand. Deploy = `npm run build`, dann `dist/` force-pushen auf `gh-pages` (genauer Befehl in der Projekt-CLAUDE.md).
- Datenstand `2026-08-27-v2`: Salden Max 90 € (René schuldet), Kasi 138 € (René schuldet), Simon V 68 € (schuldet René — bestätigt: 21+21+26). Historie und Saldo stimmen überein.
- Gebaut wurde über die Codex-Schleife (Thread existiert, überlebt aber keinen MCP-Reconnect — nächste Sitzung startet einfach frisch).
- Wegweiser-Zeile in der globalen CLAUDE.md ergänzt.

## Noch offen (Regel 9b: jeder Punkt für sich verständlich)
- **Keine offenen Punkte.** Das Thema ist rund; künftige Spieltage sagt René im Klartext, die nächste Sitzung pflegt sie ein und deployt neu (Anleitung: [CLAUDE.md](../CLAUDE.md), Abschnitte „Daten pflegen" und „Bauen & Veröffentlichen").

## Learnings dieser Sitzung
- René hat ZWEI eigene Hetzner-Server (lieblingsstunde-1 UND webmaximale-1) — bei Hosting-Fragen beide nennen; für statische Seiten ohne Domain-Wunsch ist GitHub Pages der Weg mit null Aufwand für René (gh als Puntoro angemeldet).
- Vorzeichen-Logik in `INITIAL_DEBTS`: positiver `amount` = René schuldet der Person (oft Guthaben aus Vorauszahlungen), negativ = Person schuldet René; Platz-Einträge negativ, Zahlungen positiv. Nach Datenänderung immer `DATA_VERSION` hochzählen.
- Die globale CLAUDE.md ist ein Symlink auf `claude-sync/CLAUDE.md` in iCloud — Edits gehen nur über den echten Pfad.

## Fehlannahmen
- **„Simon Vs Historie (−47) passt nicht zum Saldo"** — falsch, reiner Rechenfehler von Claude (ein 21er-Eintrag beim Kopfrechnen übersehen). Die Daten waren von Anfang an konsistent; eine deshalb eingebaute „Korrektur" musste zurückgenommen werden. Lehre: Summen per Skript nachrechnen, nie im Kopf — Codex' Gegenrechnung hat den Fehler gefangen.

## Was hätte besser laufen können
- Saldo-Prüfung gleich per Skript statt Kopfrechnung — hätte eine unnötige Korrektur-Schleife (2 Codex-Runden + Redeploy) gespart.
- `theme-color`/`<title>` in index.html gleich im ersten Codex-Brief mitgeben statt als Nachtrag.

## Start der nächsten Sitzung
Lies `~/Documents/padel-statistik/handoffs/2026-08-28-padel-statistik-live.md` und pflege den nächsten Spieltag ein (Ablauf in der Projekt-CLAUDE.md).
