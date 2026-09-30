# Carrossel de Armações na LP ForLife Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Adicionar vitrine em carrossel interativo de armações variadas abaixo do Banner 1 na LP ForLife (/forlife), com títulos obrigatórios e excelente usabilidade desktop e mobile.

**Architecture:** Seção semântica HTML (#armacoes) + CSS moderno com scroll-snap e flexbox + JS reativo para filtros de tabs, controles de carrossel (setas/dots/touch) e CTA integrado.

**Tech Stack:** HTML5, CSS3, JavaScript Vanilla, SVG/PNG assets de alta resolução, FontAwesome icons.

**Spec:** docs/superpowers/specs/2026-09-30-carrossel-armacoes-forlife-design.md

## Global Constraints
- Exact Title: "Você tem seu estilo, nós temos todos!"
- Exact Subtitle: "São mais de 150 modelos a sua disposição, variando entre modelos e cores!"
- Target File: forlife/index.html, forlife/style.css, forlife/app.js
- Position: Immediately after #combo and before #tecnologias
- Responsive Viewports: Desktop (1440x900) e Mobile (390x844)

---

### Task 1: Gerar e Organizar Assets Visuais das Armações
**Files:**
- Create: assets/images/armacoes/*.png (8 modelos de armações de alta resolução limpas e estilizadas)

### Task 2: Implementar Estrutura HTML Semântica na LP ForLife
**Files:**
- Modify: forlife/index.html (inserir section #armacoes com cabeçalho, tabs de filtro, track de carrossel, 8 cards completos e controles de navegação)

### Task 3: Estilização CSS Responsiva para Desktop e Mobile
**Files:**
- Modify: forlife/style.css (layout do carrossel, cards, badges, paleta de cores, botões de seta, dots, scroll-snap horizontal e media queries)

### Task 4: Lógica JavaScript Interativa do Carrossel e Filtros
**Files:**
- Modify: forlife/app.js (função initFramesCarousel: navegação anterior/próximo, touch swipe, sincronização de dots, filtro por abas e CTA integrado)

### Task 5: Validação Visual com agent-browser e Deploy em Produção
**Files:**
- Run: agent-browser desktop e mobile
- Commit e Push para origin/main
- Teste em https://lp.opticaconceicao.com.br/forlife
