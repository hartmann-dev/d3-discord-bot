# D3-DISCORD-BOT

> **D3** ist ein Discord Bot um die API von **[dnddeutsch.de](https://www.dnddeutsch.de/api/)** zu verwenden.
>
> Aktuell befindet sich der Bot noch in Entwicklung und wird erweitert.

⚠️ **Verwendung auf eigene Gefahr**

## Requirements

- Discord Client ID
- Discord Bot Token
- Node.js 16.11.0 oder höher

## 🚀 Getting Started

```sh
git clone https://github.com/hartmann-dev/d3-discord-bot.git
cd d3-discord-bot
npm install
```

## ⚙️ Konfiguration

Kopiere `config.json.example` nach `config.json` und passe die Werte an

⚠️ **Mache niemals deine Client ID und dein Bot Token öffentlich** ⚠️

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

```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=PERMISSIONS&scope=bot%20applications.commands
```

## 🔥 Bot starten

### Entwicklung

```sh
npm run dev
```

## 📝 Befehle

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

- **short**: Zeigt die Ergebnisse in verkürzter Form an (Standard: False)

![Monster Preview](https://user-images.githubusercontent.com/606560/186379531-50626264-3023-433a-bf75-c85a6fe37dae.png)


## 🗺 Roadmap

- [ ] Hilfe
- [x] Übersetzung
- [x] Monster
- [ ] Schatzgenerator
- [ ] ...
