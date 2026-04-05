# Visual Studio Code Setup Guide for Starfleet Disaster Response Dashboard

## 🚀 **Prerequisites**

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **Visual Studio Code** (latest version)
3. **Git** (for version control)

## 📋 **Step-by-Step Setup Instructions**

### **1. Install VS Code Extensions**

Open VS Code and install these essential extensions:

```bash
# Open VS Code command palette (Ctrl+Shift+P) and search for these extensions:

# 1. ESLint - for code linting
# 2. Prettier - for code formatting
# 3. TypeScript Importer - for auto-importing modules
# 4. Tailwind CSS IntelliSense - for Tailwind CSS support
# 5. ES7+ React/Redux/React-Native snippets - for React snippets
# 6. GitLens - for Git integration
# 7. Path Intellisense - for file path autocompletion
```

### **2. Clone and Open the Project**

```bash
# Clone the repository (if not already done)
git clone <your-repository-url>

# Navigate to the project directory
cd my-project

# Open the project in VS Code
code .
```

### **3. Install Dependencies**

Open the VS Code terminal (**Ctrl+`** or **View > Terminal**) and run:

```bash
# Install all project dependencies
npm install
```

### **4. Run the Development Server**

In the VS Code terminal:

```bash
# Start the development server
npm run dev
```

You should see output similar to:
```
> Ready on http://localhost:3000
> Socket.IO server running at ws://localhost:3000/api/socketio
```

### **5. Open the Application**

1. Open your web browser
2. Navigate to `http://localhost:3000`
3. You should see the Starfleet Disaster Response homepage

## 🔧 **VS Code Configuration**

### **Recommended VS Code Settings**

Create a `.vscode/settings.json` file in your project root:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": true,
    "comments": true,
    "other": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html"
  },
  "emmet.triggerExpansionOnTab": true
}
```

### **Recommended VS Code Extensions**

Create a `.vscode/extensions.json` file:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "eamodio.gitlens",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-json"
  ]
}
```

## 🎯 **Project Structure Overview**

```
my-project/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard page
│   │   │   ├── page-simple.tsx   # Simple dashboard version
│   │   │   └── page-original.tsx # Original dashboard version
│   │   ├── analytics/           # Analytics page
│   │   ├── blockchain/           # Blockchain page
│   │   ├── chatbot/             # Chatbot page
│   │   ├── crowdsource/         # Crowdsource page
│   │   ├── iot/                 # IoT page
│   │   ├── notifications/       # Notifications page
│   │   └── offline/             # Offline page
│   ├── components/
│   │   ├── ui/                  # Shadcn UI components
│   │   ├── dashboard/           # Dashboard-specific components
│   │   ├── quick-actions/       # Quick actions panel
│   │   ├── settings/            # Settings panel
│   │   ├── risk-heatmap/        # Risk heatmap component
│   │   ├── analytics/           # Analytics components
│   │   ├── blockchain/          # Blockchain components
│   │   └── offline/             # Offline components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility libraries
│   └── app/
│       ├── api/                 # API routes
│       └── layout.tsx           # Root layout
├── prisma/
│   └── schema.prisma            # Database schema
├── public/                      # Static assets
├── components.json              # Shadcn UI config
├── tailwind.config.ts           # Tailwind CSS config
├── tsconfig.json               # TypeScript config
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## 🚨 **Troubleshooting Common Issues**

### **1. Port Already in Use**

If you get an error that port 3000 is already in use:

```bash
# Find the process using port 3000
lsof -ti:3000

# Kill the process
kill -9 <process-id>

# Or use this command to kill all processes on port 3000
npx kill-port 3000
```

### **2. TypeScript Errors**

If you encounter TypeScript errors:

```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

### **3. ESLint Errors**

```bash
# Run ESLint to check for issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### **4. Build Issues**

```bash
# Clean build
npm run build

# If build fails, try:
npm run clean
npm run build
```

## 🎮 **Development Workflow**

### **1. Making Changes**

1. Make your changes to the source files in the `src/` directory
2. The development server will automatically hot-reload your changes
3. Check the browser console for any errors

### **2. Running Tests**

```bash
# Run linting
npm run lint

# Build the project
npm run build

# Start production server (after build)
npm start
```

### **3. Debugging**

1. **Browser DevTools**: Use F12 to open browser developer tools
2. **VS Code Debugger**: Set breakpoints in VS Code using F9
3. **Console Logs**: Check browser console and VS Code terminal for logs

### **4. Git Workflow**

```bash
# Check git status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your descriptive commit message"

# Push changes
git push origin main
```

## 🌟 **Key Features to Explore**

### **1. Dashboard Pages**
- **Homepage** (`/`) - Main landing page with live disaster map
- **Dashboard** (`/dashboard`) - Role-based emergency management dashboard
- **Analytics** (`/analytics`) - Data analytics and reporting
- **Blockchain** (`/blockchain`) - Blockchain-based fund management
- **Chatbot** (`/chatbot`) - AI-powered assistance
- **IoT** (`/iot`) - IoT device monitoring
- **Notifications** (`/notifications`) - Emergency notifications
- **Crowdsource** (`/crowdsource`) - Community reporting
- **Offline** (`/offline`) - Offline capabilities

### **2. User Roles**
- **Government** - Full emergency management access
- **NGO** - Relief operations and volunteer management
- **Public** - Personal safety and community updates

### **3. Key Components**
- **Quick Actions Panel** - Emergency services and quick access
- **Risk Heatmap** - AI-powered risk visualization
- **Settings Panel** - User preferences and configuration
- **Role-Based Dashboard** - Dynamic content based on user role

## 📞 **Getting Help**

### **Resources**
1. **Next.js Documentation**: https://nextjs.org/docs
2. **Tailwind CSS Documentation**: https://tailwindcss.com/docs
3. **Shadcn UI Documentation**: https://ui.shadcn.com
4. **TypeScript Documentation**: https://www.typescriptlang.org/docs

### **Debug Commands**

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check project scripts
npm run

# List all installed packages
npm list

# Check for outdated packages
npm outdated
```

## 🎉 **Success!**

You're now ready to develop the Starfleet Disaster Response Dashboard in Visual Studio Code! 

**Next Steps:**
1. Explore the different pages and features
2. Try switching between user roles in the dashboard
3. Experiment with the various components and settings
4. Check out the real-time features and alerts

Happy coding! 🚀