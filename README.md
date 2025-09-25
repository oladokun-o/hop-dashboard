<p align="center">
  <img src="https://dash.bunny.net/assets/web-ui/images/bunny-running-animated.svg" alt="Hop Dashboard Bunny" width="160"/>
</p>

# Hop Dashboard

Hop Dashboard is a modern **Angular 18** application built as a demo project for BunnyCDN.  
It showcases a responsive dashboard UI, reusable components, state management with **NgRx**, charting with **ng2-charts**, and a shared **UI library**.

---

## ✨ Features

- ⚡ **Angular 18** with Vite dev server for fast builds
- 🎨 **SCSS** styling with Angular CDK components
- 📦 **Shared UI Component Library** (`ui-components`)
- 🗂 **NgRx Store & Effects** for state management
- 📊 **ng2-charts** integration for data visualization
- 🧪 Unit tests with **Karma/Jasmine**
- 🌍 Multi-environment setup (`development`, `production`)
- 🚀 Easy deployment to **Netlify**, **Vercel**, or BunnyCDN edge storage

---

## 📂 Project Structure

```bash
hop-dashboard/
├── projects/
│   └── ui-components/      # Reusable Angular library
├── src/
│   ├── app/                # App modules & components
│   ├── assets/             # Static assets
│   ├── styles.scss         # Global styles
│   └── main.ts             # App bootstrap
├── angular.json            # Angular workspace config
├── package.json
└── README.md
````

---

## 🛠️ Getting Started

### Prerequisites

* **Node.js** v20+
* **npm** v10+
* Angular CLI globally:

  ```bash
  npm install -g @angular/cli
  ```

### Installation

Clone and install dependencies:

```bash
git clone https://github.com/oladokun-o/hop-dashboard.git
cd hop-dashboard
npm install
```

### Development Server

Run the app locally:

```bash
npm start
```

Visit: [http://localhost:4200](http://localhost:4200)

---

## 📦 Available Scripts

* `npm start` – Run dev server with live reload
* `npm run build` – Build for production
* `npm test` – Run unit tests
* `npm run lint` – Lint code with ESLint
* `npm run build:ui` – Build the `ui-components` library

---

## 🧩 UI Components Library

This workspace contains a reusable **UI Components** library (`ui-components`).
You can build and publish it independently:

```bash
cd projects/ui-components
npm run build
```

---

## 🔒 Security

* All dependencies kept up-to-date via `npm audit` and Dependabot
* Vulnerabilities addressed promptly
* SSR explicitly **disabled** for simplicity

---

## 🚀 Deployment

You can deploy Hop Dashboard with:

* **Netlify**
* **Vercel**
* **GitHub Pages**
* Or serve directly via **BunnyCDN Edge Storage**

Production build:

```bash
npm run build
```

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.
