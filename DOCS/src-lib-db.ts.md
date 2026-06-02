# Datei: `src/lib/db.ts`

**[Zurück zu: README.MD](../README.MD)**

## 📝 Zweck der Datei

Diese Datei ist das **Herzstück der Datenbankschicht (Database Abstraction Layer)**. Sie stellt eine universelle, datenbankunabhängige Schnittstelle (`UniversalDB`) bereit. Basierend auf der Umgebungsvariable `DB_TYPE` entscheidet das Modul dynamisch beim Anwendungsstart, ob eine Verbindung zu einer **MySQL/MariaDB**-Datenbank via Connection-Pool oder zu einer lokalen/cloudbasierten **LibSQL/SQLite**-Datenbank aufgebaut wird. Sie vereinheitlicht die unterschiedlichen Rückgabeformate der Treiber in eine standardisierte, typsichere Struktur.

---

## 🛠️ Wichtige Strukturen & Funktionen

### 1. Typsichere Interfaces

- **`DBRow`**: Definiert die minimale Struktur einer Datenzeile (`id`, `title`, `content`, `category`). Ein Index-Signatur-Zusatz (`[key: string]: unknown`) erlaubt es, zusätzliche Spalten flexibel und typsicher mitzuführen.
- **`DBResult`**: Standardisiert das Rückgabeobjekt, das immer ein Array vom Typ `DBRow[]` liefert.
- **`UniversalDB`**: Beschreibt die einheitliche API, die jede implementierte Datenbank-Engine bereitstellen muss: die Methoden `execute` und `close`.

### 2. Dynamische Weichenstellung (Datenbank-Treiber)

#### Zweig A: MySQL / MariaDB (`dbType === "mysql"`)

- **Verbindungsaufbau (`getPool`)**: Implementiert ein Lazy-Loading-Verfahren (Singleton-Muster). Erst beim ersten tatsächlichen Datenbankzugriff wird der Treiber `mysql2/promise` dynamisch importiert und ein Connection-Pool mit vordefinierten Parametern (z. B. Verbindungs-Limit von 10, Standard-Port 3306) initialisiert.
- **`execute`**:
  1. Extrahiert flexibel SQL-Strings und Argumente.
  2. Ersetzt im SQL-String das SQLite-Schlüsselwort `AUTOINCREMENT` durch das MySQL-Äquivalent `AUTO_INCREMENT`.
  3. Führt die Abfrage auf dem Verbindungspool aus.
  4. Formatiert die erhaltenen Tabellenzeilen typsicher in das einheitliche `DBRow`-Format.
- **`close`**: Beendet den gesamten Verbindungspool (`pool.end()`).

#### Zweig B: LibSQL / SQLite (Standard-Fallback)

- **Verbindungsaufbau**: Nutzt den `@libsql/client`, um eine Verbindung zu einer lokalen Datei (Standard: `file:src/data/blog.db`) oder einer Cloud-Instanz herzustellen.
- **`execute`**: Führt die Abfrage über den LibSQL-Client aus und mappt die Ergebnisse mittels Nullish-Coalescing-Operatoren (`?? ""`) in dasselbe einheitliche `DBRow`-Format wie im MySQL-Zweig.
- **`close`**: Bleibt als Leerfunktion (No-Op) bestehen, da der Client keine permanente Pool-Verbindung offenhalten muss, die manuell gekappt werden müsste.

---

### 3. Export

- **`db`**: Exportiert das fertig konfigurierte Instanz-Objekt, welches die einheitliche `execute`-Methode bereitstellt. Alle anderen Dateien im Projekt (z. B. Server Actions und Server Pages) nutzen ausschließlich diesen Export, wodurch sie vollständig vom darunterliegenden Datenbanksystem entkoppelt sind.
