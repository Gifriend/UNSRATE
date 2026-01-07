# Unsrate

A modern swipe-based rating application built with SvelteKit, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Explore Profiles** - Swipe through user profiles with smooth animations
- 💬 **Chat** - Connect with matched users
- 👤 **User Profiles** - View detailed profile information
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide icons
- ⚡ **Fast** - Powered by Vite and Bun
- another features coming soon

## Tech Stack

- **Framework**: SvelteKit 2
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide Svelte
- **Build Tool**: Vite 7
- **Package Manager**: Bun
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.0 or higher)

### Installation

1. Clone the repository:
```sh
git clone <your-repo-url>
cd unsrate
```

2. Install dependencies:
```sh
bun install
```

### Development

Start the development server:

```sh
bun run dev

# or start the server and open the app in a new browser tab
bun run dev --open
```

The app will be available at `http://localhost:5173`

### Building for Production

To create a production version of your app:

```sh
bun run build
```

You can preview the production build with `bun run preview`.

### Other Commands

```sh
# Type checking
bun run check

# Linting
bun run lint

# Format code
bun run format

# Run tests
bun run test
```

## Project Structure

```
unsrate/
├── src/
│   ├── lib/
│   │   ├── components/     # Reusable Svelte components
│   │   ├── data/          # Mock data and dummy profiles
│   │   ├── services/      # API client services
│   │   └── types/         # TypeScript type definitions
│   └── routes/
│       ├── explore/       # Profile exploration page
│       ├── chat/          # Chat interface
│       ├── login/         # Authentication page
│       └── user/[id]/     # User profile pages
├── static/                # Static assets
└── ...config files
```


> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
