# Multi-Template Product Lines & Lens Configurations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar o template especializado de Visão Simples (Miopia/Astigmatismo) para a campanha 194 e futuras LPs, com suporte a Óculos Completo vs Só Lentes, modalidades de lentes, marcas e tecnologias adicionais ativas/cinzas.

**Architecture:** Criação do módulo `visaosimples/` (HTML, CSS, JS), expansão do Hub Studio (`hub.html`, `assets/hub.js`) para suportar novos metadados e configuração de rewrites no `vercel.json`.

**Tech Stack:** Vanilla JS (ES6+), HTML5, CSS3 moderno (Apple Design System), Vercel Routing, Supabase JS v2.

**Spec:** docs/superpowers/specs/2026-09-28-multi-template-product-lines-design.md

## Global Constraints
- Nenhuma quebra de rotas existentes (/hub, /admin, /, /forlife).
- Clean URLs sem extensões (.html).
- Cards de tecnologia desativados devem ter classe `.is-disabled-gray`, opacidade reduzida, badge informativo e clique bloqueado.
- Preço padrão da campanha 194: R$ 194,00 em 6x de R$ 32,33 sem juros.

---

### Task 1: Criar Template Especializado Visão Simples (`visaosimples/index.html`, `style.css`, `app.js`)

**Files:**
- Create: `visaosimples/index.html`
- Create: `visaosimples/style.css`
- Create: `visaosimples/app.js`

**Interfaces:**
- Consumes: Configuração do CMS via `localStorage` ou padrões da campanha 194.
- Produces: Página responsiva de alta conversão para Visão Simples (Miopia/Astigmatismo/Leitura) com suporte a marcas e tecnologias ativas/cinzas.

- [ ] **Step 1: Criar `visaosimples/style.css` com suporte a classes `.is-disabled-gray` e layout moderno**
- [ ] **Step 2: Criar `visaosimples/index.html` com copywriting focado em Visão Simples, marcas e FAQ específico**
- [ ] **Step 3: Criar `visaosimples/app.js` com cálculo reativo, injeção de marcas, bloqueio de tecnologias inativas e integração WhatsApp**
- [ ] **Step 4: Commit dos arquivos do template Visão Simples**

---

### Task 2: Expandir o Hub Studio e CMS com Controles de Produto, Modalidades, Marcas e Tecnologias

**Files:**
- Modify: `hub.html`
- Modify: `assets/hub.js`
- Modify: `assets/hub.css`

**Interfaces:**
- Consumes: Estado das LPs no catálogo e CMS.
- Produces: Novos campos no modal de criação/edição e na aba CMS para definir `offerType`, `lensModality`, `frameBrand`, `lensBrand` e toggles de tecnologias extras.

- [ ] **Step 1: Adicionar novos campos no modal `#modal-create-lp` e na aba CMS em `hub.html`**
- [ ] **Step 2: Atualizar `assets/hub.js` para persistir e carregar os novos campos no catálogo e no CMS**
- [ ] **Step 3: Adicionar a LP `194` apontando para o template `visaosimples` no catálogo padrão de `assets/hub.js`**
- [ ] **Step 4: Commit das melhorias no Hub Studio**

---

### Task 3: Configurar Roteamento Dinâmico no `vercel.json` para o Template Visão Simples

**Files:**
- Modify: `vercel.json`

**Interfaces:**
- Consumes: Rotas `/194`, `/visaosimples`, `/forlife`, `/hub`.
- Produces: Roteamento transparente sem 404 para os templates certos.

- [ ] **Step 1: Configurar rewrites para `/194` apontar para `/visaosimples`**
- [ ] **Step 2: Preservar `/visaosimples/:path*` para assets e scripts**
- [ ] **Step 3: Commit das regras de roteamento**

---

### Task 4: Validação Visual de Ponta a Ponta com `agent-browser` e Deploy

**Files:**
- Teste: `visaosimples/index.html` na porta 3100 e na produção
- Teste: `hub.html` na porta 3100 e na produção

- [ ] **Step 1: Validar `/194` localmente com agent-browser (verificar copy de visão simples, R$ 194 em 6x, tecnologias e marcas)**
- [ ] **Step 2: Validar o Hub `/hub` localmente com agent-browser (edição de marcas e modalidades)**
- [ ] **Step 3: Executar deploy no GitHub/Vercel via git push**
- [ ] **Step 4: Validar produção ao vivo em `https://lp.opticaconceicao.com.br/194` com agent-browser e capturar screenshot**
