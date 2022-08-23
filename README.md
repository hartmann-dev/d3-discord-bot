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
  "D3_API_VERSION": "0.7"
  "DICT_MAX_RESULTS": 3
}
```

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

![Bildschirmfoto 2022-08-23 um 12 25 46](https://user-images.githubusercontent.com/606560/186135518-b009745d-62f0-4fe7-a69f-747608705b58.png)


## 🗺 Roadmap

- [ ] Hilfe
- [x] Übersetzung
- [ ] Monster
- [ ] Schatzgenerator
- [ ] ...
