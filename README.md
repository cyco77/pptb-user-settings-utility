# User Settings Utility

<p align="center">
  <img src="https://raw.githubusercontent.com/cyco77/pptb-user-security-utility/HEAD/icon/user-team-security_small.png" alt="User Settings Utility Logo" width="314" height="150">
</p>

<p align="center">
  A Power Platform Toolbox (PPTB) plugin for viewing and updating Dynamics 365 / Dataverse user settings. This tool provides an intuitive interface to manage user settings across multiple users simultaneously.
</p>

## Screenshots

### Dark Theme

![User Settings Utility - Dark Theme](https://raw.githubusercontent.com/cyco77/pptb-user-security-utility/HEAD/screenshots/main_dark.png)

## Features

### Core Capabilities

- 👥 **User Browser** - View all active system users in your Dataverse environment
- ⚙️ **User Settings Management** - View and edit detailed user settings
- 🔄 **Bulk Updates** - Update settings for multiple users at once
- 🔍 **Advanced Filtering** - Filter users by name, email, or business unit
- 📊 **Sortable Data Grid** - Sort users by any column with multi-select support
- 💾 **Save Changes** - Track and save pending changes with visual feedback
- 🎨 **Theme Support** - Automatic light/dark theme switching based on PPTB settings

### Editable User Settings

The tool supports viewing and editing various user settings including:

- **Localization**: UI Language, Help Language, Currency, Timezone, Format (locale)
- **Navigation**: Default Homepage Area, Subarea, and Dashboard
- **Display**: Paging Limit, Calendar Type, Default Calendar View, Week Numbers
- **Regional Settings**: Date/Time formats, Number formats, Currency formats
- **Email & Sync**: Email filtering, Sync intervals, Contact sync settings
- **Advanced**: Various personalization and feature toggles

### Technical Stack

- ✅ React 18 with TypeScript
- ✅ Fluent UI React Components for consistent Microsoft design
- ✅ Vite for fast development and optimized builds
- ✅ Power Platform Toolbox API integration
- ✅ Dataverse API for querying and updating user settings

## Structure

```
pptb-user-settings-utility/
├── src/
│   ├── components/
│   │   ├── Filter.tsx                 # Business unit and text filtering
│   │   ├── Overview.tsx               # Main container component
│   │   ├── SystemuserDetails.tsx      # User details and settings editor
│   │   ├── SystemuserGrid.tsx         # Data grid for system users
│   │   └── usersettings/              # User settings components
│   │       ├── FieldInfoTooltip.tsx   # Tooltip for field info
│   │       ├── FieldRenderers.tsx     # Field rendering utilities
│   │       ├── SettingsSection.tsx    # Settings section component
│   │       ├── UsersettingsTab.tsx    # Main settings tab
│   │       └── ...                    # Additional utilities
│   ├── hooks/
│   │   └── useToolboxAPI.ts           # PPTB API hooks
│   ├── mappers/
│   │   ├── businessunitMapper.ts      # Business unit data mapping
│   │   ├── formatMapper.ts            # Format/locale data mapping
│   │   ├── languageMapper.ts          # Language data mapping
│   │   ├── sitemapMapper.ts           # Sitemap data mapping
│   │   ├── systemuserMapper.ts        # System user data mapping
│   │   ├── timezoneMapper.ts          # Timezone data mapping
│   │   └── usersettingsMapper.ts      # User settings data mapping
│   ├── services/
│   │   └── dataverseService.ts        # Dataverse API queries
│   ├── types/
│   │   ├── businessunit.ts            # Business unit type definitions
│   │   ├── currency.ts                # Currency type definitions
│   │   ├── dashboard.ts               # Dashboard type definitions
│   │   ├── format.ts                  # Format type definitions
│   │   ├── language.ts                # Language type definitions
│   │   ├── pendingChanges.ts          # Pending changes type definitions
│   │   ├── sitemap.ts                 # Sitemap type definitions
│   │   ├── systemuser.ts              # System user type definitions
│   │   ├── timezone.ts                # Timezone type definitions
│   │   └── usersettings.ts            # User settings type definitions
│   ├── App.tsx                        # Main application component
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Global styling
├── dist/                              # Build output
├── icon/                              # Tool icons
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

### Prerequisites

- Node.js >= 24.0.0
- npm or yarn
- Power Platform Toolbox installed

### Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd pptb-user-settings-utility
```

2. Install dependencies:

```bash
pnpm install
```

## Development

### Development Server

Start development server with HMR:

```bash
pnpm dev
```

The tool will be available at \`http://localhost:5173\`

### Watch Mode

Build the tool in watch mode for continuous updates:

```bash
pnpm watch
```

### Production Build

Build the optimized production version:

```bash
pnpm build
```

The output will be in the \`dist/\` directory.

### Preview Build

Preview the production build locally:

```bash
pnpm preview
```

## Usage

### In Power Platform Toolbox

1. Build the tool:

```bash
   pnpm build
```

2. Dependencies are locked in `pnpm-lock.yaml`; no separate shrinkwrap-generation step is needed.

3. Install in Power Platform Toolbox using the PPTB interface

4. Connect to a Dataverse environment

5. Launch the tool to view and manage user settings

### User Interface

#### Filter Section

- **Business Unit Dropdown**: Filter users by their business unit
- **Search Box**: Real-time search across user name, email, and business unit

#### User Grid

- Click column headers to sort
- Use checkboxes to select one or multiple users
- Columns: Full Name, Email, Business Unit, System User ID

#### Settings Panel

- View and edit settings for selected user(s)
- When multiple users are selected:
  - Fields with matching values show the common value
  - Fields with different values show "No change" placeholder
- Pending changes are tracked and displayed
- Click "Save" to apply changes to all selected users

## API Usage

The tool uses the Power Platform Toolbox and Dataverse APIs:

### Connection Management

```typescript
// Get current connection
const connection = await window.toolboxAPI.getConnection();
```

### Data Queries

```typescript
// Query system users
const users = await window.dataverseAPI.queryData(
  "systemusers?$select=systemuserid,fullname,internalemailaddress"
);

// Query user settings
const settings = await window.dataverseAPI.queryData(
  \`usersettingscollection?$filter=systemuserid eq '\${userId}'\`
);
```

### Notifications

```typescript
// Show notification
await window.toolboxAPI.utils.showNotification({
  title: "Success",
  body: "Settings updated successfully",
  type: "success",
  duration: 3000,
});
```

## Development and Releases

- Create feature branches from `dev` and open pull requests back to `dev`.
- Add a Changeset to every feature pull request with `pnpm changeset`, then commit the generated file in `.changeset/`.
- Open a release pull request from `dev` to `main` when changes are ready.
- After that pull request is merged, GitHub Actions creates or updates a `Version Packages` pull request on `main`.
- Review and merge the version pull request. GitHub Actions then builds the package, publishes it to npm, and creates a GitHub Release with downloadable archives.

Changeset release types follow SemVer: `patch` for fixes, `minor` for backwards-compatible features, and `major` for breaking changes.

### Repository Setup

- Create a GitHub Actions secret named `CHANGESETS_GITHUB_TOKEN` with **Contents: read and write** and **Pull requests: read and write** for this repository. A GitHub App token can be used instead.
- In repository settings under **Actions > General**, allow GitHub Actions to create and approve pull requests.
- On npm, configure GitHub Actions trusted publishing for `@cyco77/pptb-usersettings-utiliy` using owner `cyco77`, repository `pptb-user-settings-utility`, and workflow `release.yml`. Allow direct `npm publish` for this publisher.
- The project uses pnpm 11.0.0 for installs and releases. Packages are published to npm through GitHub Actions trusted publishing. No npm write token is needed.
- Local development and Changesets commands require Node.js 24 or newer.
- Protect `dev` and `main` with required pull requests and CI checks. Keep `main` as the production branch.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

Lars Hildebrandt
