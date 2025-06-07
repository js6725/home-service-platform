# Home Service Business Platform - Starter Kit

This repository contains the starter kit for the Home Service Business Platform, a comprehensive solution for home service businesses to own their leads, look professional, and grow without relying on middlemen marketplaces.

## Features (Phase 1 MVP)

- **Custom Landing Page Builder**: Create high-converting landing pages with local SEO optimization
- **Lead Management**: Capture, track, and manage leads efficiently
- **Business Profile Management**: Manage your business information and services
- **Customer Management**: Convert leads to customers and maintain customer relationships
- **Third-party Integrations**: Connect with Stripe, Twilio, and SendGrid

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage, Functions)
- **Authentication**: Magic link email and phone authentication
- **Hosting**: Vercel/Netlify
- **Additional Libraries**:
  - React Router for navigation
  - React Hook Form for form handling
  - SWR for data fetching
  - Lucide React for icons
  - Radix UI and Headless UI for accessible components

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account
- Vercel or Netlify account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/home-service-platform.git
   cd home-service-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the application.

## Project Structure

```
home-service-platform/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Common components (buttons, inputs, etc.)
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components (navbar, sidebar, etc.)
│   │   └── pages/        # Page-specific components
│   ├── context/          # React context providers
│   ├── data/             # Static data and constants
│   ├── features/         # Feature-specific components and logic
│   │   ├── auth/         # Authentication related components
│   │   ├── landing-pages/# Landing page builder components
│   │   ├── leads/        # Lead management components
│   │   └── settings/     # Settings components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   │   ├── api/          # API client functions
│   │   ├── supabase/     # Supabase client and helpers
│   │   └── validation/   # Form validation schemas
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── main.jsx          # Application entry point
│   └── routes.jsx        # Application routes
├── .env.local            # Environment variables (create this file)
├── index.html            # HTML entry point
├── package.json          # Project dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## Database Schema

The Supabase database includes the following tables:

1. **profiles** - User profiles and business information
2. **services** - Services offered by the business
3. **landing_pages** - Landing page templates and content
4. **leads** - Lead information and status
5. **customers** - Customer information
6. **appointments** - Customer appointments
7. **notifications** - System notifications

For detailed schema information, refer to the [database schema documentation](./docs/database-schema.md).

## API Endpoints

The application uses Supabase for most data operations. Custom API endpoints are implemented using Supabase Edge Functions.

For detailed API documentation, refer to the [API documentation](./docs/api-endpoints.md).

## Deployment

### Vercel Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add the environment variables in the Vercel project settings
4. Deploy

### Netlify Deployment

1. Push your code to a GitHub repository
2. Connect your repository to Netlify
3. Add the environment variables in the Netlify project settings
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/)
- [React Router](https://reactrouter.com/)
- [Lucide Icons](https://lucide.dev/)
- [Radix UI](https://www.radix-ui.com/)
- [Headless UI](https://headlessui.dev/)

