📄 Product Requirements Document (PRD) – Sui Dashboard


1. Overview

The Sui Dashboard is a web-based analytics platform that provides users with real-time insights into the Sui blockchain ecosystem. The dashboard aggregates data from Sui APIs, SuiNS, Walrus, and third-party APIs to deliver actionable analytics on accounts, coins, NFTs, domains, and security metrics.

Built with TypeScript (frontend + backend), the application will serve blockchain enthusiasts, developers, and investors who want an all-in-one dashboard to monitor their Sui activity and ecosystem health.


2. Goals & Objectives

Provide real-time account activity and portfolio analytics.

Show coin prices, holders, and market data.

Enable NFT tracking (collections, ownership, activity).

Integrate SuiNS domain resolution (name ↔ address).

Offer Walrus storage analytics (accounts, blobs).

Display security metrics & metadata for transparency.



3. Key Features

🔹 A. Dashboard (Main View)

High-level overview with widgets/cards:

Account Summary (balance, transactions, activity)

Coin Market Data (prices, pools, trending tokens)

NFT Snapshot (collections owned, activity)

SuiNS Domains (owned names, resolutions)

Walrus Storage Data (blob usage, account details)

Security & Metadata (warnings, suspicious activity)


🔹 B. Coins

Retrieve account coins (/account/coins)

Retrieve coin detail (symbol, decimals, supply)

Fetch multiple coin prices (market data aggregation)

Show coin holders (distribution + top holders)


🔹 C. NFTs

Retrieve collection NFT list

Retrieve NFT activity (transfers, sales, mints)

Retrieve account NFTs

Retrieve collection holders


🔹 D. Walrus (Decentralized Storage)

Account details (registered accounts, metadata)

Blobs (storage objects, linked data)

Blob activity (uploads, references, ownership)


🔹 E. SuiNS (Domains)

getName() / getAddress()

Name ↔ Address resolution

getOwnedNames()

All domains owned by an address

Query Active Pricing & Renewals

Domain purchase & renewal insights


🔹 F. Security & Metadata

Retrieve Sui metadata (latest blocks, validators)

Retrieve security-related data (alerts, API checks)



4. Data Sources (APIs)

Blockberry API → Accounts, coins, NFTs

Sui Scan API → Activity, coins, metadata

Nexa API → Trending coins

Walrus API → Storage analytics

SuiNS SDK → Domain resolution & pricing

Artemis Analytics → Stablecoin metrics



5. User Stories

As a Sui user, I want to see my account balance and activity so I can track my transactions.

As a coin investor, I want to view coin market data and holders so I can analyze token performance.

As an NFT collector, I want to see my NFTs and collection activity so I can monitor my portfolio.

As a domain owner, I want to resolve my SuiNS name and view pricing to manage my domains.

As a developer, I want to access Walrus blobs and metadata so I can manage decentralized storage.

As a security-focused user, I want to view alerts and metadata so I can avoid risky interactions.



6. Technical Stack

Frontend: React + TypeScript (UI components)

Backend: Node.js + TypeScript (API proxy, aggregation)

In-memory caching

APIs/SDKs: Sui Scan, Blockberry, Nexa, Walrus, SuiNS suiSDK

Hosting: Vercel / Netlify/ Railway / Render 



7. Timeline (8 Days Plan)
Day	Task
Day 1	Set up project (frontend + backend in TypeScript), configure APIs
Day 2	Implement Accounts + Coins APIs (UI + integration)
Day 3	Implement NFT APIs (collections, holders, activity)
Day 4	Implement Walrus APIs (accounts, blobs)
Day 5	Implement SuiNS SDK (domain resolution + pricing)
Day 6	Add Dashboard UI (widgets/cards for each module)
Day 7	Testing, bug fixes, polish UI, add security & metadata
Day 8	Final testing, documentation, deploy to production


8. Success Metrics

API data loads under 2 seconds.

Users can view at least:

1 account activity log

3 coins with price data

NFT collection data

1 SuiNS domain resolution

Dashboard is accessible & mobile responsive.

9. Risks & Mitigation

API downtime → Implement caching & fallback messages.

App Markdown

# SUI Dashboard: How It Works
The SUI Dashboard is a comprehensive web application built to provide insights and tools for interacting with the SUI blockchain ecosystem. Here's an overview of how the website works:

## Architecture Overview
The application is built using React with TypeScript and follows a modern component-based architecture. It uses Vite as the build tool and development server, providing fast hot module replacement during development.

## Key Components
### Core Structure
- Pages : Organized by feature areas (deepbook, ika, coins, nfts, etc.)
- Components : Reusable UI elements (cards, charts, tables, etc.)
- Hooks : Custom React hooks for data fetching and state management
- Contexts : Shared state accessible throughout the application
### Data Fetching
The application fetches data from various sources:

1. 1.
   API Endpoints : External APIs provide blockchain data
2. 2.
   GitHub Gists : Some configuration data is stored in gists
3. 3.
   Fallback Mocks : When API endpoints are unavailable, mock data is used
The useStatsData hook is a central piece that fetches statistics about SUI and related pools, handling loading states and errors appropriately.

### Feature Areas DeepBook Trading
The OrderBook component displays bid and ask depths for trading pairs, with cumulative depth calculations and color-coded visualizations.
 IKA Protocol Stats
Displays protocol statistics with formatted trading pairs and color-coded exchange information.
 NFTs and Collections
Browses and displays NFT collections with metadata and ownership information.
 SUI Network Information
Provides blockchain statistics, validator information, and network health metrics.

### UI Components
The application uses a combination of custom UI components and likely some UI framework components for:

- Cards and panels
- Charts and visualizations
- Navigation elements
- Tables and data displays
- Loading indicators
## User Flow
1. 1.
   Users navigate through different sections via the main navigation
2. 2.
   Each section loads relevant data through custom hooks
3. 3.
   Loading states are displayed while data is being fetched
4. 4.
   Data is presented in appropriate visualizations and tables
5. 5.
   Users can interact with the data through filters, selections, and other UI controls
## Error Handling
The application implements error handling at multiple levels:

- API fetch errors are caught and displayed to users
- Fallback data is used when primary sources are unavailable
- TypeScript type checking helps prevent runtime errors
## Development Workflow
The project uses:

- TypeScript for type safety
- Tailwind CSS for styling (based on the configuration files)
- Vite for fast development and building
- Component-based architecture for maintainability
This architecture allows the dashboard to provide a comprehensive view of the SUI ecosystem while maintaining good performance and user experience.

Data overload → Paginate lists (coins, NFTs).

Time constraints → Prioritize Coins, NFTs, Account Activity first.
