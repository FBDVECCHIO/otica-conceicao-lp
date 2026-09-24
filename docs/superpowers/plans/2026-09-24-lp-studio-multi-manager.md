# LP Studio & Multi-Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement access control, hybrid multi-device preview, custom LP URL & campaign management, comparative performance tab, and Digital Sales CRM with inline editing and paginated PDF reports.

**Architecture:** Frontend vanilla SPA modularized into Auth, Catalog, Preview (Hybrid + Quick Drawer), Traffic/Heatmap, Performance Comparison, Leads CRM, and Export modules within `hub.html`, `assets/hub.js`, and `assets/hub.css`, backed by LocalStorage and Supabase.

**Tech Stack:** HTML5, CSS3 (CSS Grid/Flexbox), Vanilla JS (ES6+), Supabase JS v2, jsPDF + autoTable.

**Spec:** docs/superpowers/specs/2026-09-24-lp-studio-multi-manager-design.md

## Global Constraints
- Authentication credentials: `admin` / `conceicao1948`
- Codebase files: `hub.html`, `assets/hub.js`, `assets/hub.css`
- No backend runtime required: fully client-side architecture with Supabase client and LocalStorage persistence
- PDF reports must use jsPDF + autoTable with proper page breaks and pagination

---

### Task 1: Access Control & Authentication Gate

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.css`
- Modify: `assets/hub.js`

**Interfaces:**
- Produces: `Auth.init()`, `Auth.login(user, pass, remember)`, `Auth.logout()`, `Auth.isAuthenticated()`

- [ ] **Step 1: Add Login Modal Markup and Header Logout in `hub.html`**
Add `#auth-overlay` modal with login form (username, password, remember me, submit button, error alert) and `#btn-hub-logout` in header.

- [ ] **Step 2: Add Auth CSS in `assets/hub.css`**
Add overlay styles, backdrop-blur, card design, error animations, and user badge in header.

- [ ] **Step 3: Implement Auth Module in `assets/hub.js`**
Check token on load, intercept unauthorized state, validate `admin` / `conceicao1948`, manage session, and handle logout.

- [ ] **Step 4: Verify Syntax & Unit Check**
Run syntax verification to ensure no errors.

---

### Task 2: Dynamic LP Selector & Campaign Management

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.css`
- Modify: `assets/hub.js`

**Interfaces:**
- Consumes: `Auth.isAuthenticated()`
- Produces: `Catalog.getLpList()`, `Catalog.saveCustomLp(lpData)`, `Catalog.getActiveCampaign()`

- [ ] **Step 1: Add Custom LP & Campaign Registration Modal in `hub.html`**
Add form for custom URL, LP name, Campaign Name, Budget (R$), and Target Leads.

- [ ] **Step 2: Add Campaign Info Bar in `hub.html` and `assets/hub.css`**
Show active campaign name, budget, leads target, and status badge under the header.

- [ ] **Step 3: Implement Custom LP Persistence in `assets/hub.js`**
Save to `forlife_custom_lps` in LocalStorage and dynamically populate `#lp-selector`.

- [ ] **Step 4: Verify Syntax**
Run syntax verification.

---

### Task 3: Hybrid Multi-Device Preview & Quick Drawer

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.css`
- Modify: `assets/hub.js`

**Interfaces:**
- Produces: `Preview.setHybridMode(enabled)`, `Preview.openQuickDrawer()`, `Preview.closeQuickDrawer()`

- [ ] **Step 1: Add Hybrid Mode Toolbar Button & Stage in `hub.html`**
Add `#btn-view-hybrid` and `#hybrid-stage-container` with Desktop frame (left) and Tablet + Mobile frames (right).

- [ ] **Step 2: Add Quick Drawer Floating Trigger & Drawer Panel in `hub.html`**
Add `#quick-drawer-trigger` and `#quick-drawer-panel` accessible from all tabs.

- [ ] **Step 3: Style Hybrid Layout & Quick Drawer in `assets/hub.css`**
Split-screen grid, responsive iframe scaling, and smooth slide-in drawer.

- [ ] **Step 4: Wire Preview Logic in `assets/hub.js`**
Synchronize URL across all iframes and handle drawer toggles.

- [ ] **Step 5: Verify Syntax**
Run syntax verification.

---

### Task 4: Comparative Performance Tab Across LPs

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.css`
- Modify: `assets/hub.js`

**Interfaces:**
- Produces: `Performance.renderComparison()`

- [ ] **Step 1: Add Navigation Tab & Section Markup in `hub.html`**
Add tab button `Comparativo de Performance` and panel `#tab-comparison` with summary cards and comparison table.

- [ ] **Step 2: Add Comparative Visual Bar Charts in `hub.html` and `assets/hub.css`**
CSS-based horizontal comparison bars for Conversion Rate (%) and Total Revenue (R$).

- [ ] **Step 3: Implement Performance Aggregator in `assets/hub.js`**
Calculate metrics (Visits, Leads, Sales, Ticket Médio, ROI) per LP and render dynamic table.

- [ ] **Step 4: Verify Syntax**
Run syntax verification.

---

### Task 5: Digital Sales CRM (OS, Vendedor, Valor Final, Ticket Médio & WhatsApp 1-Clique)

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.css`
- Modify: `assets/hub.js`

**Interfaces:**
- Produces: `CRM.saveLeadRow(leadCode, os, seller, saleValue)`, `CRM.calculateTicketMedio()`, `CRM.filterLeads()`

- [ ] **Step 1: Expand Table Header and Row Template in `hub.html` & `assets/hub.js`**
Add editable fields for OS, Vendedor, Valor Venda Final, direct WhatsApp button, and Save button.

- [ ] **Step 2: Implement Real-Time Ticket Médio & Sales Calculation in `assets/hub.js`**
Calculate Ticket Médio = sum(Venda Final) / count(Vendas) and update metric cards in real time.

- [ ] **Step 3: Add Period & Seller Filters and Refresh Button in `hub.html` & `assets/hub.js`**
Filter leads by Today, 7 Days, Month, All, Seller, Store, and LP.

- [ ] **Step 4: Style Table Inputs & Action Buttons in `assets/hub.css`**
Clean styling for inline inputs and instant green flash feedback on save.

- [ ] **Step 5: Verify Syntax**
Run syntax verification.

---

### Task 6: Paginated PDF Reports with jsPDF & autoTable

**Files:**
- Modify: `assets/hub.js`

**Interfaces:**
- Produces: `Export.exportPdf(onlySelected)`

- [ ] **Step 1: Configure jsPDF Landscape & autoTable with Page Breaks**
Format professional layout with institutional header, page breaks (`pageBreak: 'auto'`), repeated headers, and footer page numbering.

- [ ] **Step 2: Add Summary Section at Bottom of PDF**
Include Total Leads, Vendas Fechadas, Ticket Médio Real, and Faturamento Total in the report.

- [ ] **Step 3: Verify Syntax**
Run syntax verification.

---

### Task 7: End-to-End Visual & Functional Validation with `agent-browser`

**Files:**
- Test all features on running local server

- [ ] **Step 1: Start Server and Launch `agent-browser`**
- [ ] **Step 2: Verify Login Gate and Perform Login**
- [ ] **Step 3: Verify Hybrid Multi-Device Preview**
- [ ] **Step 4: Verify Quick Drawer in Leads Tab**
- [ ] **Step 5: Verify Lead Inline Editing, Ticket Médio Recalculation and WhatsApp link**
- [ ] **Step 6: Verify Performance Comparison Tab**
- [ ] **Step 7: Capture Evidence Screenshots**
- [ ] **Step 8: Git Commit & Push to `origin/main`**
