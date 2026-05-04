# Plan: Facebook-like Friends UI (Option A)

## Goal
Implement a Facebook-like Friends UI using shadcn styling, with routes:
- /friends
- /friends/request
- /friends/suggest
- /friends/all

## Scope
- UI only (no API integration)
- Mock data for requests, suggestions, and all friends
- New Facebook-like header component

## Layout Analysis (from provided screenshot)
- Header: fixed top bar with logo + search, center nav icons, right actions
- Left sidebar: Friends navigation with active state
- Main content: two sections on /friends
  - Friend requests: 2-column card grid, large image, confirm/delete actions
  - People you may know: multi-column card grid, smaller image, mutuals, add/remove

## Work Breakdown
1) Define overall layout (PRIORITY)
   - FriendsLayout: header + left sidebar + main content
   - Fixed sidebar width, main content scroll

2) Build shared components
   - FriendsHeader (top bar)
   - FriendsSidebar (nav list with active state)
   - SectionHeader (title + "Xem tat ca")
   - FriendRequestCard (large image + confirm/delete)
   - FriendSuggestCard (small image + mutuals + add/remove)

2.1) Install missing shadcn/ui components (as needed)
   - Add any required base UI components via `npx shadcn@latest add ...`
   - Keep to base UI and npm; avoid custom styling overrides

3) Build /friends home layout (PRIORITY)
   - Two sections in main content matching screenshot layout
   - Use mock data for requests and suggestions

4) Build remaining routes
   - /friends/request: list of requests
   - /friends/suggest: list of suggestions
   - /friends/all: full friends list

5) Wire routing and navigation
   - Route mapping for sidebar items and section links
   - "Xem tat ca" links to full pages

## Deliverables
- Header component in `components/`
- Screen-specific partials in `views/*/partials/`
- Route setup for all friends pages
- Mock data module(s)

## Non-Goals
- Authentication
- Backend API integration
- Real-time data updates
