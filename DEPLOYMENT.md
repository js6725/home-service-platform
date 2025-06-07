# Deployment Guide - Home Service Platform

## Prerequisites
- [x] GitHub repository created: https://github.com/js6725/home-service-platform
- [ ] Supabase project created with credentials
- [ ] Vercel project connected to GitHub

## Phase 1: Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Create new project:
   - Name: `home-service-db`
   - Password: `q*-h45#-ijkl-13@40-^&345h`
   - Region: East US (North Virginia)

### 2. Get Credentials
After project creation, get these from Settings → API:
- Project URL: `https://[project-id].supabase.co`
- Anon Key: `eyJ...` (long string)

### 3. Apply Database Schema
Run the SQL from `supabase/schema.sql` in the SQL Editor

## Phase 2: Vercel Deployment

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Import project: `js6725/home-service-platform`
4. Project name: `home-service-project`

### 2. Environment Variables
Add these in Vercel project settings:
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Deploy
- Vercel will automatically deploy on push to master
- Domain will be: `home-service-project.vercel.app`

## Phase 3: Testing
1. Test authentication flow
2. Verify database connections
3. Check responsive design
4. Test all navigation routes

## Next Development Phases
1. **Phase 2**: Implement authentication and user profiles
2. **Phase 3**: Build landing page builder
3. **Phase 4**: Develop lead management system
4. **Phase 5**: Add customer management and integrations
5. **Phase 6**: Final testing and optimization

