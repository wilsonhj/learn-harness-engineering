[English Version →](../../../en/projects/project-07-loop-engineering-first-loop/)

# Projekt 07. Baue deinen ersten automatisierten Loop

> Zugehörige Lektion: [L13. Warum du aufhören solltest, deinen Agenten zu prompten](./../../lectures/lecture-13-loop-engineering/index.md)

## Was du tust

Das ist das Übergangsprojekt von „Harness“ zu „Loop“. Du weißt bereits, wie man einen Agenten mit einer ordentlichen Umgebung, Anweisungen und Feedback einrichtet — jetzt verwandelst du dieses Setup in einen Loop, der von selbst läuft.

Du machst drei fortschreitende Experimente: zuerst wandelst du eine Aufgabe von manuell zu `/goal`, dann verwandelst du eine Überwachungsaufgabe in einen `/loop`-Timer, und schließlich baust du einen vollständigen Maker-Checker-Loop, um zu erleben, wie es sich anfühlt, wenn **du aus dem Loop heraustrittst.**

## Werkzeuge, die du nutzt

- Claude Code oder Codex
- Git
- Dein vollständiges Harness aus P06
- Ein Terminal-Multiplexer (tmux oder screen, zur Beobachtung lang andauernder Loops)
- Optional: GitHub Actions oder Cron (für fortgeschrittene ereignisgesteuerte / geplante Experimente)

## Schritte

### Vorbereitung

1. Starte von demselben Commit, an dem du P06 beendet hast.
2. Erstelle drei Branches: `p07-goal-loop`, `p07-timer-loop`, `p07-maker-checker`.
3. Bestätige, dass dein Harness funktioniert: führe init.sh aus, überprüfe, ob State-Datei, Feature-Liste und Handoff-Dokumente alle vorhanden sind.
4. Wähle eine **Zielaufgabe**, an der der Loop wiederholt arbeiten soll. Wähle etwas Mittelgroßes mit klaren Abschlusskriterien — z. B. „füge allen Modulen Unit-Tests hinzu und erreiche 80 % Abdeckung“ oder „füge allen API-Endpunkten Eingabevalidierung hinzu“.

### Experiment 1: Goal-Loop — Von manuellem Lauf zu automatischem Lauf

Wechsle zum Branch `p07-goal-loop`.

1. **Schreibe die Zielbeschreibung**: Wandle deine gewählte Aufgabe in eine `goal.md`-Datei um, die enthält:
   - Klares Ziel („was zählt als fertig“)
   - Verifikationsmethode („wie bestätigt man, dass es fertig ist“ — Tests ausführen? Lint ausführen? Abdeckung prüfen?)
   - Stoppbedingung („wann soll es aufhören“ — maximale Züge? Zeitlimit? Budgetlimit?)
   - Einschränkungen („was nicht anfassen“ — Produktionskonfiguration, Datenbankschema usw.)

2. **Erster manueller Lauf**: Gib die Aufgabe dem Agenten manuell, selbst. Protokolliere, wie viele Züge es gebraucht hat, wie oft du eingegriffen hast, und die Ergebnisqualität. Das ist dein Basiswert.

3. **Führe mit `/goal` aus**: Verwende dieselbe `goal.md` als Eingabe und führe sie im `/goal`-Modus aus. Der Agent loopt von selbst, bis das Ziel erreicht ist oder die Stoppbedingung auslöst.

4. **Vergleiche die Ergebnisse**:
   - Unterschied in der Zuganzahl
   - Unterschied in deiner Eingriffsanzahl
   - Unterschied in der Ergebnisqualität (mit demselben Verifikationsstandard)
   - Unterschied in der von dir aufgewendeten Zeit

5. **Iteriere an goal.md**: Wenn die Ergebnisse schlecht sind, überarbeite die Zielbeschreibung und führe sie erneut aus. Mach so lange weiter, bis du mit den Ergebnissen zufrieden bist, oder bis du die Grenze bestätigt hast, was ein Goal-Loop bei dieser Aufgabe leisten kann.

### Experiment 2: Timer-Loop — Verwandle Überwachung in einen Herzschlag

Wechsle zum Branch `p07-timer-loop`.

1. **Wähle eine Überwachungsaufgabe**: Finde eine wiederkehrende Prüfung, die du normalerweise manuell machst. Zum Beispiel:
   - Führe die Test-Suite jede Stunde aus, behebe Fehler
   - Prüfe jeden Morgen auf Sicherheitsupdates von Abhängigkeiten
   - Prüfe nach jedem Commit auf Verletzungen des Coding-Stils
   - Scanne periodisch TODO-Kommentare, um zu sehen, welche veraltet sind

2. **Schreibe den Überwachungs-Prompt / das Skript**: Stelle die Überwachungsschritte klar dar — was zu prüfen ist, was zu tun ist, wenn Probleme gefunden werden, und wann ein Mensch gerufen werden soll.

3. **Führe mit `/loop` aus (oder Codex Thread-Automatisierung)**:
   - Setze ein vernünftiges Intervall (10-30 Minuten empfohlen — zu kurz und du wirst genervt sein, zu lang und du wirst den Effekt nicht sehen)
   - Lass es mindestens 2 Stunden laufen (oder geh etwas anderes machen und komm später zurück)

4. **Protokolliere die Ergebnisse**:
   - Wie viele Probleme hat es gefunden?
   - Wie viele hat es selbst behoben?
   - Wie viele waren Fehlalarme?
   - Wie viele hat es verschlimmert?
   - Wie viel Zeit hast du damit verbracht, den Ergebnissen nachzugehen?

5. **Reflektiere**: Lohnt sich diese Überwachungsaufgabe zu automatisieren? Vergleiche die gesparte Zeit mit der Zeit, die du mit der Nachverfolgung verbracht hast. Wenn es sich nicht lohnt — hast du die falsche Aufgabe gewählt, oder ist der Loop schlecht designed?

### Experiment 3: Maker-Checker-Loop — Nimm dich selbst aus dem Loop

Wechsle zum Branch `p07-maker-checker`.

Das ist das wichtigste der drei Experimente. Du baust **einen vollständigen Loop, der dich nicht braucht, um da zu sein:**

1. **Designe die Loop-Struktur**:
   - **Maker-Agent**: implementiert, schreibt Code, ändert Dateien
   - **Checker-Agent**: verifiziert, führt Tests aus, macht Code-Review, besteht / fällt durch
   - **State-Datei** (`loop-state.md`): protokolliert aktuelle Runde, was gemacht wurde, Verifikationsergebnisse, was als Nächstes kommt
   - **Stoppbedingung**: N aufeinanderfolgende Bestehen, oder maximale Runden erreicht

2. **Schreibe drei Prompts**:
   - Maker-Anweisungen (was zu tun ist, wie es zu tun ist, was nicht anzufassen ist)
   - Checker-Anweisungen (was zu verifizieren ist, wie zu verifizieren ist, was als Bestehen zählt, wie Feedback zu geben ist)
   - Loop-Steuerlogik (wer anfängt, wie die Übergabe funktioniert, wie die nächste Runde gestartet wird)

3. **Führe mindestens 5 Runden aus**:
   - Runde 1: Maker implementiert → Checker verifiziert → Fehlschlag → Feedback an Maker
   - Runde 2: Maker überarbeitet basierend auf Feedback → Checker verifiziert → ...
   - ...
   - Bis aufeinanderfolgendes Bestehen, oder du brichst es ab

4. **Protokolliere den Status jeder Runde**:
   - Rundennummer
   - Was der Maker gemacht hat
   - Welche Probleme der Checker gefunden hat
   - Bestanden / durchgefallen
   - Hast du eingegriffen? (wenn ja, warum?)

5. **Abschließendes Retro**:
   - Wie oft hast du eingegriffen? Warum?
   - Was wäre passiert, wenn du nicht eingegriffen hättest?
   - Hat der Checker Probleme übersehen?
   - Hat der Maker immer wieder denselben Fehler gemacht?
   - Wo liegt die Qualitätsdecke dieses Loops? Maker-Fähigkeit oder Checker-Fähigkeit?

## Wie man Ergebnisse misst

| Metrik | Exp 1 (Goal) | Exp 2 (Timer) | Exp 3 (Maker-Checker) |
|--------|-------------|--------------|----------------------|
| Aufgabenabschlussrate | Wurde das Ziel erreicht? | Wie viele Überwachungszyklen sind gelaufen? | Wie viele Runden bis zum Bestehen? |
| Menschliche Eingriffe | Wie oft hast du eingegriffen? | Wie viel Zeit hast du mit der Nachverfolgung verbracht? | Wie oft hast du eingegriffen? |
| Ergebnisqualität | Wie schneidet es im Vergleich zu manuell ab? | Fehlalarmrate? Übersehene Probleme? | Wie viele Probleme hat der Checker gefunden, die du nicht gefunden hättest? |
| Gesparte Zeit | Wie viel Zeit hast du gespart? | Lohnt sich die Automatisierung? | Zeit für das Design des Loops vs. gesparte Zeit |
| Zuverlässigkeit | War die Stoppbedingung vertrauenswürdig? | Ist es durchgedreht? | Kann der Loop an derselben Stelle steckenbleiben? |

## Was einzureichen ist

- `goal.md` (Zielbeschreibung von Experiment 1, mindestens zwei Iterationen)
- Experiment 1 Vergleichsnotizen: manuell vs. Goal-Loop
- Experiment 2 Überwachungs-Prompt + 2-Stunden-Laufprotokoll
- Experiment 3's drei Prompts (Maker / Checker / Loop-Steuerung)
- Experiment 3's `loop-state.md` (mindestens 5 protokollierte Runden)
- Abschließendes Retro: Erkenntnisse aus allen drei Experimenten, wie sich dein Verständnis von Loop Engineering verändert hat, welche Dinge gute Kandidaten für Loop-ifizierung sind und welche nicht

## Zugehörige Lektionen

- [Lektion 13 — Warum du aufhören solltest, deinen Agenten zu prompten](../../lectures/lecture-13-loop-engineering/index.md)
- [Lektion 12 — Warum jede Session einen sauberen Zustand hinterlassen muss](../../lectures/lecture-12-why-every-session-must-leave-a-clean-state/index.md) (jede Runde eines Loops braucht sauberen State)
- [Lektion 11 — Warum Beobachtbarkeit ins Harness gehört](../../lectures/lecture-11-why-observability-belongs-inside-the-harness/index.md) (du musst sehen, was im Inneren des Loops passiert)
- [Lektion 05 — Warum State-Dateien das Rückgrat der Kontinuität sind](../../lectures/lecture-05-why-long-running-tasks-lose-continuity/index.md) (Loop-State-Dateien sind eine Erweiterung von State-Dateien)
