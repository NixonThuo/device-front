# Device Manager

A modern, responsive device registration and management platform built with Next.js and TypeScript.

## Features

- 🔐 Secure user authentication
- 📱 Device registration and management
- 📊 Clean, modern UI with mobile responsiveness
- 🎨 Tailwind CSS for styling
- ⚡ Built with Next.js 14 and TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd device-registration-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── LoginForm.tsx
│   │   ├── DeviceList.tsx
│   │   └── NewDeviceForm.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── ...
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hooks** - State management

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Integration

This frontend connects to a backend API for:
- User authentication (`/api/users/login`)
- Device management (`/api/devices`)

Make sure your backend API is running on `http://localhost:3000` or update the API endpoints in the components.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.