# Trendify Launchpad

Статический launchpad для запуска community-токенов в поддержку TikTok-креаторов. Проект подготовлен для импорта и публикации через Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alexvladimirovich888/trendify-launchpad)

## Структура

```text
public/                 Готовый сайт, который публикует Vercel
  assets/               Логотипы и локальные изображения
  index.html            Home
  explore.html          Explore
  donos.html            Creator Support
  launch.html           Launch
  flow.html             Capital Flow
  docs.html             Documentation
  site.js               Интерактивность, wallet connector и карточки
  site.css              Собранный production CSS
src/styles/input.css    Исходник Tailwind CSS
tailwind.config.js      Цвета и пути Tailwind
vercel.json             Build, output, clean URLs и headers
```

## Локальный запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run dev
```

Production-сборка CSS:

```bash
npm run build
```

## Деплой на Vercel

1. Импортируйте GitHub-репозиторий в Vercel.
2. Framework Preset: `Other`.
3. Root Directory: `./`.
4. Build Command и Output Directory уже заданы в `vercel.json`.
5. Переменные окружения не требуются.

Vercel опубликует clean URLs: `/`, `/explore`, `/launch`, `/flow`, `/docs` и `/donos`.

## Wallet connector

MetaMask подключается через EIP-6963/EIP-1193, Phantom через injected Solana provider. Проверять подключение нужно в обычном Chrome или Edge с установленным и разрешённым расширением кошелька.

## Ограничение

Форма Launch сохраняет подготовленный draft локально. Для реального выпуска токена on-chain потребуется отдельный backend/API и контракт launchpad.