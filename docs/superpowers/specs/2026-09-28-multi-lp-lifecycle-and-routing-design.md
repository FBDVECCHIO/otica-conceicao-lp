# Plano de Implementação: Ciclo de Vida Multi-LP, Roteamento Limpo e Configuração Dinâmica

## Visão Geral
Atender a todas as demandas do controlador e criador de Landing Pages (`https://lp.opticaconceicao.com.br/hub`):
1. **Correção do Modal de Criação/Edição:** Garantir funcionamento imediato dos botões Cancelar e Fechar (X).
2. **Roteamento Limpo (/slug):** Eliminar URLs poluídas com parâmetros (`/forlife?theme=194`), garantindo que o caminho após a barra seja exatamente o slug configurado (ex: `/forlife-194` ou `/promocao`) no `vercel.json` e no servidor de desenvolvimento local.
3. **Injeção Dinâmica de Preço e Parcelamento:** Fazer a LP acatar e renderizar dinamicamente o preço do combo, o número de parcelas sem juros, o valor por parcela e o texto do voucher no WhatsApp.
4. **Edição de LPs no Catálogo:** Adicionar botão e modal de edição para qualquer LP cadastrada, permitindo alterar nome, slug, campanha, status, preços, parcelas, orçamento e metas.
5. **Propagação Global Multi-LP:** Sincronizar qualquer LP nova ou editada com todos os módulos do Studio (CMS, Tráfego & Inteligência, Comparativo de Performance e Leads).

---

## User Review Required
> [!NOTE]
> Conforme instrução expressa do usuário ("Após o brainstorm, tire todas as sua dúvidas, e aprove o plano criado, execute tudo sem me perguntar nada, me entregue pronto, validado e testado, para testar o frontend use o /agent-browser"), o plano foi aprovado para execução contínua com validação ponta a ponta via `agent-browser`.

---

## Modificações Propostas por Componente

### 1. Servidor & Roteamento (Vercel & Local)
#### [MODIFY] [vercel.json](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/vercel.json)
- Adicionar rewrite limpo para capturar qualquer rota `/:slug` que não seja asset estático ou rota administrativa, encaminhando para `/forlife/index.html`.

#### [MODIFY] [serve.js](file:///C:/Users/fbdv1/.gemini/antigravity/brain/30fee95e-4af4-43ef-944d-d13e9437870f/scratch/serve.js)
- Implementar rewrite dinâmico para servir `/forlife/index.html` quando o caminho acessado for um slug de LP (ex: `/forlife-194`, `/promocao`), mantendo a URL no navegador.

---

### 2. Motor da Landing Page (Template & Reatividade)
#### [MODIFY] [forlife/app.js](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/forlife/app.js)
- Em `loadForlifeConfig()`:
  - Detectar o slug a partir de `window.location.pathname` (ou `?lp=` / `?theme=`).
  - Buscar as configurações específicas da LP no catálogo (`otica_conceicao_lps_catalog`) e CMS local (`otica_cms_config_<id>`).
  - Atualizar `forlifeConfig.comboPrice`, `forlifeConfig.installments` e valores de tecnologia adicionais.
  - Se o nome da LP for customizado, atualizar os títulos e banners da página.
  - Atualizar os elementos de tela via `updatePricingUI()`.
- No rastreamento de tráfego (`initTrafficTracker`):
  - Incluir `lp_id` no objeto `visitRecord` para permitir segmentação precisa por LP.
- Na geração de cupom / lead:
  - Incluir `lp_id` no payload do lead enviado ao Supabase e salvo no `localStorage`.
  - Atualizar o cálculo de parcelamento e mensagem do WhatsApp com o número exato de parcelas e preço base da LP.

---

### 3. Interface do LP Studio & Multi-Manager (Hub)
#### [MODIFY] [hub.html](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/hub.html)
- No modal `#modal-create-lp`:
  - Adicionar campo de parcelamento sem juros (`#new-lp-installments`) ao lado de `#new-lp-price`.
  - Garantir compatibilidade de classes e IDs nos botões de fechar (`.modal-close-btn`, `#btn-close-modal`) e cancelar (`.btn-cancel-modal`, `#btn-cancel-create-lp`).
  - Adicionar suporte visual a cabeçalho dinâmico (título "Criar Nova Landing Page" ou "Editar Landing Page").

#### [MODIFY] [assets/hub.css](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/assets/hub.css)
- Adicionar estilos para o botão de edição no card do catálogo (`.btn-card-edit`).
- Ajustes de layout para modal de edição e grids de formulário.

#### [MODIFY] [assets/hub.js](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/assets/hub.js)
- Em `Modal`:
  - Corrigir `bindModalEvents` para escutar cliques em múltiplos seletores de fechar/cancelar, fechar ao clicar no backdrop e fechar ao pressionar a tecla `Escape`.
  - Implementar `openEditLp(lpId)` preenchendo todos os campos do modal e alternando o formulário para modo `edit`.
  - Tratar submit do modal diferenciando criação (`Catalog.addLp`) e edição (`Catalog.updateLp`).
- Em `Catalog`:
  - No `renderCatalogGrid()`: inserir o botão **Editar** (`.btn-card-edit`) em cada card de LP.
  - No `addLp()`: salvar a URL limpa baseada no slug (`url = slug`), gravar o catálogo e inicializar as configurações no CMS (`otica_cms_config_<id>`) com preço e parcelas informados.
  - Criar `updateLp(lpId, updatedData)`: atualizar campos no catálogo, persistir no `localStorage`, atualizar o CMS correspondente, sincronizar a barra de campanha superior, atualizar o seletor de LPs e recarregar os comparativos.
  - Atualizar `removeLp(lpId)` e `setActiveLp(lpId)` para manter reatividade total.
- Em `CMS`:
  - Garantir que `loadCmsConfig` e `loadCampaignConfig` recarreguem perfeitamente para qualquer LP criada ou editada.
- Em `Performance`:
  - Garantir que `render()` processe todas as LPs em `State.catalog`.

---

## Plano de Verificação

### Testes Automatizados e Navegação com agent-browser
1. **Teste do Modal:**
   - Clicar em "Criar Nova Landing Page".
   - Clicar no botão "Cancelar" e verificar fechamento.
   - Abrir novamente e clicar no botão "X" (fechar) e verificar fechamento.
2. **Criação de LP com Preço & Parcelas Customizados:**
   - Criar uma LP chamada "ForLife Especial 194" com slug `forlife-194`, preço R$ 194,00 e 6 parcelas.
   - Verificar se o card aparece no Catálogo com slug `/forlife-194`, preço R$ 194,00 (6x).
3. **Edição da LP no Catálogo:**
   - Clicar no botão "Editar" do card criado.
   - Alterar preço para R$ 249,00 e parcelamento para 8x.
   - Salvar e validar atualização no card e na barra de campanha superior.
4. **Validação da Página Renderizada (Visualizador & Rota Direta):**
   - Abrir `http://localhost:3100/forlife-194` no navegador.
   - Verificar se exibe R$ 249,00 à vista e 8x de R$ 31,12 sem juros.
5. **Validação nos Menus Integrados:**
   - Verificar se a nova LP aparece no CMS com seus valores salvos.
   - Verificar se a nova LP aparece na Tabela Geral de Comparativo de Performance.
   - Capturar screenshots comprobatórios para o Walkthrough.
