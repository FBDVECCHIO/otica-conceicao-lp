# Especificação de Design: Hub & Visualizador Inteligente Multi-LP (Ópticas Conceição)

**Data:** 2026-09-23  
**Status:** Implementado e Validado com Sucesso  
**Autor:** Antigravity AI & Engenharia Ópticas Conceição  
**Arquivo:** docs/superpowers/specs/2026-09-23-multi-lp-hub-design.md

## 1. Visão Geral
Plataforma centralizada e inteligente (LP Studio & Multi-Manager) em hub.html permitindo alternar instantaneamente entre várias Landing Pages via select, visualizar cada LP com emulador responsivo (Desktop 1440px, Laptop 1024px, Tablet 768px, Mobile 390px), gerenciar leads com métricas financeiras e exportação em PDF, gerenciar configurações CMS de preços, adicionais, lojas, vendedores e UTMs, além de monitorar tráfego e catalogar novas LPs.

## 2. Abordagem Escolhida
Plataforma proprietária integrada (custo zero de mensalidade, total privacidade LGPD, integração nativa com Supabase e controle total sobre regras de negócio).

## 3. Telas e Componentes
- Top bar com seletor de LP, badge de status, abertura externa e recarga.
- Aba 1: Visualizador Interativo com moldura de dispositivo e seleção de viewport.
- Aba 2: Gestão de Leads com 4 KPIs, filtros avançados, edição in-line e exportação PDF.
- Aba 3: Configurações CMS (Preços, Combo, Adicionais, Vendedores, Lojas e Gerador de UTMs).
- Aba 4: Tráfego & Inteligência (Campanhas, Cidades, Engajamento).
- Aba 5: Catálogo de LPs e Modal de Criação Dinâmica.
