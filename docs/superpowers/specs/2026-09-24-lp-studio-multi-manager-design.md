# Especificação Técnica: LP Studio & Multi-Manager (Ópticas Conceição)

**Data:** 2026-09-24  
**Status:** Aprovado para Implementação  
**Autor:** Antigravity / Google DeepMind Pair Programming  
**Branch:** `main`  
**Escopo:** `hub.html`, `assets/hub.js`, `assets/hub.css`

---

## 1. Visão Geral & Objetivos

A plataforma **LP Studio & Multi-Manager** é a central unificada das Ópticas Conceição para operação, análise e conversão de todas as Landing Pages da rede (ForLife, Fila, Varilux, Zeiss e novas campanhas).

A plataforma atende a três frentes principais:
1. **Gestores de Tráfego & Mídia Paga:** Rastreabilidade por UTMs, plataformas de tráfego, termômetro de cliques, profundidade de scroll e comparativo de performance/ROI entre campanhas.
2. **Equipe de Digital Sales & Vendedores:** Gestão ativa de leads com contato WhatsApp em 1 clique, atribuição de vendedor, preenchimento de OS, registro de valor de venda final, cálculo automático de ticket médio e relatórios em PDF com quebra de página.
3. **Equipe de Criação & Produto:** Visualizador de Landing Pages com modo híbrido multi-telas (Desktop, Tablet e Smartphone simultâneos) e gaveta lateral de acesso rápido em qualquer tela.

---

## 2. Requisitos Funcionais Detalhados

### 2.1. Controle de Acesso & Autenticação
- **Tela de Bloqueio (Login Gate):** Overlay modal com logotipo institucional das Ópticas Conceição, campos de Usuário e Senha.
- **Credenciais Oficiais:** Usuário `admin` e Senha `conceicao1948`.
- **Persistência de Sessão:** Salva token de autenticação em `localStorage` (com opção "Lembrar de mim") ou `sessionStorage`.
- **Ações no Header:** Exibição do usuário ativo e botão de "Sair / Bloquear" no canto superior direito para encerramento de sessão imediato.
- **Bloqueio de Fundo:** Nenhum iframe ou dado da plataforma é renderizado ou acessível antes da autenticação.

### 2.2. Seletor de LPs & Cadastro Dinâmico de URLs e Campanhas
- **Seletor Global de LPs no Header:** Permite trocar a LP ativa instantaneamente em todas as abas.
- **LPs Nativas:**
  - `forlife`: ForLife Multifocal Di Capri (`/forlife`)
  - `fila`: Óculos Completo FILA (`/`)
  - `varilux`: Varilux Comfort Max (`/varilux`)
  - `zeiss`: Zeiss SmartLife Digital (`/zeiss`)
- **Modal de Cadastro de Nova LP & Campanha Única:**
  - Nome da Landing Page
  - Rota relativa ou URL externa completa (ex: `/nova-lp` ou `https://...`)
  - Nome da Campanha Única Vinculada
  - Investimento da Campanha (R$)
  - Meta de Leads
  - Status da LP (Ativa em Produção / Em Teste / Pausada)
- **Persistência:** Gravado em `forlife_custom_lps` no LocalStorage com sincronização com Supabase quando conectado.

### 2.3. Visualizador Interativo & Modo Híbrido
- **Modos de Visualização:**
  - **Individual:** Desktop (1440px), Laptop (1024px), Tablet (768px), Mobile (390px).
  - **Modo Híbrido Multi-Telas (Destaque):** Divide a área de visualização em:
    - **Lado Esquerdo:** Visualização Desktop em moldura ampla.
    - **Lado Direito:** Coluna empilhada com Tablet (768px) no topo e Smartphone (390px) abaixo, ambos em iframes totalmente interativos com scroll independente.
- **Gaveta Lateral de Prévia Rápida ("Quick Drawer"):**
  - Botão de atalho lateral fixo (`👁️ Prévia Rápida`) acessível em qualquer aba (como Leads e Comparativo).
  - Permite abrir uma gaveta deslizante com a LP ativa sem precisar sair da tela de gestão de leads ou configurações.

### 2.4. Dashboards de Tráfego & Inteligência de Campanhas
- **Rastreabilidade por Plataforma:** Meta Ads (Instagram/Facebook), TikTok Ads, Google Ads, Direto / Orgânico.
- **Parâmetros UTM:** UTM Source, Medium, Campaign, Content e Term.
- **Termômetro de Cliques:** Mapeamento de cliques nos elementos (`data-track-element`), gerando um ranking e termômetro visual dos botões e ofertas com mais tração.
- **Engajamento & Comportamento:** Profundidade de scroll (25%, 50%, 75%, 100%) e tempo médio de permanência (dwell time).

### 2.5. Nova Aba: Comparativo de Performance entre LPs
- **Aba dedicada no menu:** `Comparativo de Performance`.
- **Cards de Destaque:** LP Mais Eficiente (maior conversão %), Maior Faturamento, Maior Volume de Leads.
- **Tabela Comparativa Consolidada:**
  - LP & Rota
  - Campanha Vinculada
  - Visitantes Únicos
  - Leads Gerados
  - Taxa de Conversão (% Lead/Visita)
  - Vendas Concluídas
  - Taxa de Fechamento (% Venda/Lead)
  - Ticket Médio Real (R$)
  - Faturamento Total (R$)
  - Orçamento da Campanha (R$)
  - ROI / ROAS Estimado
- **Gráficos Comparativos Visuais:** Barras comparativas de conversão e receita entre as LPs ativas.

### 2.6. CRM de Leads para Digital Sales
- **Colunas da Tabela:**
  1. Checkbox para Seleção individual/múltipla (para exportação em PDF)
  2. Data de Chegada (DD/MM/AAAA)
  3. LP / Campanha de Origem
  4. Dados do Cliente (Nome, E-mail, Cidade)
  5. WhatsApp (Link direto 1-clique para abrir atendimento no WhatsApp com mensagem personalizada)
  6. Loja Escolhida / Destino
  7. Situação da Receita (Possuo receita, Preciso atualizar, A combinar)
  8. Valor da Campanha (Valor base do combo da LP)
  9. **OS (Ordem de Serviço):** Campo de texto inline editável e salvável
  10. **Vendedor Responsável:** Campo dropdown/texto inline editável
  11. **Valor da Venda Final (R$):** Campo monetário inline editável
  12. **Ações:** Botão "Salvar Linha", Botão "Excluir Lead"
- **Cards Métricos do CRM:**
  - Total de Leads Recebidos
  - Vendas Realizadas (leads com Valor de Venda Final preenchido)
  - **Ticket Médio Real:** Calculado como sum(Valores de Venda Final) / Quantidade de Vendas Realizadas
  - Faturamento Total da LP
- **Filtros Avançados:**
  - Período (Hoje, Últimos 7 dias, Este Mês, Todos)
  - LP / Campanha
  - Loja Escolhida
  - Status da Receita
  - Vendedor Responsável
  - Busca rápida por texto (Nome, Telefone, OS)
  - Botão de Atualização / Refresh
- **Relatórios em PDF:**
  - Exportar Selecionados em PDF
  - Exportar Todos os Filtrados em PDF
  - **Paginação & Quebra de Página:** Configurado via `jsPDF` e `autoTable` com cabeçalho em todas as páginas, numeração de páginas, margens seguras e quebra suave de linha.
