# SafeVibeCode (SVC) Landing Page

Landing page for the SafeVibeCode (SVC) technical token. Built as a 3D, cyberpunk-style single-page site with Russian/English localization.

Автор и разработка: **lightcom (Andrey Volkov)**.

---

## Стек

- Vite + React + TypeScript
- @react-three/fiber, @react-three/drei, three.js (3D сцена и графика)
- framer-motion (анимации и скролл-эффекты)
- Tailwind CSS (стилизация)

---

## Возможности

- **RU/EN переключатель** с русским языком по умолчанию
- **Hero-блок** с видео-коином (`coin.mp4`) в скруглённом квадрате
- 3D-куб и частицы на фоне с затемняющей подложкой для читаемости текста
- Блок "**AI + R&D / ВЕКТОР РОСТА**" с 3D-графиком роста
- Разделы Utility, Roadmap, CTA, терминальное окно с логами

---

## Запуск проекта

Требования:

- Node.js 18+ (рекомендуется LTS)
- npm 9+ (обычно идёт вместе с Node.js)

### Установка зависимостей

В корне проекта (`c:\Research\svc`):

```bash
npm install
```

### Запуск dev-сервера

```bash
npm run dev
```

После запуска открой в браузере адрес, который выведет Vite, обычно:

- `http://localhost:3000/`

При изменении файлов страница автоматически перезагружается.

### Сборка продакшн-версии

```bash
npm run build
```

Готовые файлы попадут в папку `dist/`.

### Предпросмотр собранной версии

```bash
npm run preview
```

Vite поднимет локальный сервер и покажет содержимое из `dist`.

---

## Структура

- `App.tsx` — основной React-компонент со всеми секциями и 3D-сценой
- `index.tsx` — входная точка React-приложения
- `index.html` — HTML-шаблон, который использует Vite
- `coin.mp4` — видео-коин в hero-блоке
- `logo.png` — логотип проекта

---

## Брендинг

- Текущий разработчик/бренд: **lightcom (Andrey Volkov)**.

При изменении текста или локализаций правь их в `App.tsx` в объекте `CONTENT` (RU/EN).
