# D3-DISCORD-BOT - Alpha (v0.3.0)

> **D3** ist ein Discord Bot um die API von **[dnddeutsch.de](https://www.dnddeutsch.de/api/)** zu verwenden.
>
> Aktuell befindet sich der Bot noch in Entwicklung und wird erweitert.

⚠️ **Verwendung auf eigene Gefahr**

## Anforderungen

Kurzanleitung um einen Discord Bot im Discord Entwickler Portal anzulegen: https://github.com/hartmann-dev/discord-bot-config

- Discord CLIENT ID
- Discord Bot Token
- Node.js 16.11.0 oder höher (neuste Version empfohlen)

## 🚀 Getting Started

```sh
git clone https://github.com/hartmann-dev/d3-discord-bot.git
cd d3-discord-bot
npm install
```

## ⚙️ Konfiguration

Kopiere `config.json.example` nach `config.json` und passe die Werte an

⚠️ **Mache niemals dein Bot Token öffentlich** ⚠️

```json
{
  "TOKEN": "",
  "CLIENT_ID": "",
  "REST_VERSION": "10",
  "D3_BASE_URL": "https://www.dnddeutsch.de",
  "D3_API_BASE_URL": "https://www.dnddeutsch.de/tools/json.php",
  "D3_API_VERSION": "0.7",
  "D3_DEFAULT_BACKLINK": "https://www.dnddeutsch.de",
  "DICT_MAX_RESULTS": 3,
  "MONSTER_MAX_RESULTS": 3
}
```

### Updates

In Version 0.1.0 kamen folgende Keys dazu:

- D3_DEFAULT_BACKLINK
- MONSTER_MAX_RESULTS

## 🎂 Bot einladen

Benötigte Rechte

- Read Messages/View Channels
- Send Messages
- Manage Messages

Aktueller Wert: 11264

```
// CLIIENT_ID mit eigener CLIENT ID ersetzten
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=11264&scope=bot%20applications.commands
```

## 🔥 Bot starten

### Entwicklung

```sh
npm run dev
```

## 📝 Befehle

### 🤔 Hilfe

`/d3 help`
Zeigt die Hile zum Bot an

### 🔎 Übersetzung

`/d3 dict [suche]`

#### Optionen:

- **mi**: Magische Gegenstände berücksichtigen (Standard: True)
- **mo**: Monster berücksichtigen (Standard: True)
- **sp**: Zaubersprüche berücksichtigen (Standard: True)
- **it**: Ausrüstung berücksichtigen (Standard: True)
- **misc**: Sonstiges berücksichtigen (Standard: True)

![Dict Preview](https://user-images.githubusercontent.com/606560/186386167-4d671ad5-44e0-4c8a-8d0a-c83484cf5d45.png)

### 😈 Monster

`/d3 monster [name]`

#### Optionen:

- **short**: Zeigt die Ergebnisse in verkürzter Form an (Standard: False)

![Monster Preview](https://user-images.githubusercontent.com/606560/186379531-50626264-3023-433a-bf75-c85a6fe37dae.png)

### 💰 Schatzgenerator

`/d3 loot [hg] [anzahl]`

#### Optionen:

- **hg**: 0-4, 6-10. 11-16 oder 17-20 - Der Herausforderungsgrad der Monster bzw. des Horts
- **anzahl**: Eine Ganzzahl oder das Wort "Hort" - Die Gruppenstärke der Monster oder ein ganzer Hort

![Loot Preview](https://user-images.githubusercontent.com/606560/186641268-bdc70a74-1985-46ae-8a0f-c8ae77eef72a.png)

## 🗺 Roadmap

- [x] Hilfe
- [x] Übersetzung
- [x] Monster
- [x] Schatzgenerator
- - [x] Monster-(gruppen)
- - [x] Hort
- - [ ] Vault Eingabe?
- [ ] ...
