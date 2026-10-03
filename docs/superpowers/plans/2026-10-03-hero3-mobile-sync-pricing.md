# Hero 3.0, Mobile Sync, Coupon Pricing & Layout Optimization Implementation Plan

**Goal:** Subir a estrutura de texto principal do Hero em 2cm (~75px) no desktop; posicionar o botão do WhatsApp com o indicativo de escassez de cupons logo abaixo desta estrutura; diminuir a altura do banner do Hero em 4 a 5cm (~160px) para que a imagem macro ocupe a vertical com presença máxima e base alinhada; sincronizar em nuvem (Supabase) todas as criações e atualizações de LPs para que smartphones e dispositivos externos carreguem a mesma oferta e catálogo em tempo real; e uniformizar todos os botões de cupom e menções de preço para que nunca divirjam do valor anunciado em cada LP.

**Architecture:**
1. **Hero Layout & Typography (Hero 3.0):**
   - Transpor o bloco `.hero-cta-wrapper` (botão WhatsApp verde esmeralda + escassez de cupons + link de cupom) da coluna da modelo (`.hero-model-col`) para a coluna de conteúdo (`.hero-content-col`), imediatamente abaixo de `#forlife-hero-subtitle`.
   - No desktop, aplicar `margin-top: -145px` na `.hero-content-col` (elevação de 2cm / ~75px em relação aos -70px anteriores). No mobile (`<= 992px`), manter `margin-top: 0` alinhado ao centro.
   - Reduzir a altura vertical do banner em 4 a 5cm: zerar o padding de `.hero-commercial-section`, remover o `padding-bottom: 24px` do grid e o `margin-top: 36px` da trust bar, definir alinhamento inferior (`align-items: flex-end`) no grid comercial.
   - A imagem macro da modelo fica livre de botões abaixo, ocupando a vertical da seção de ponta a ponta com base flush e efeito cinematográfico.

2. **Sincronização em Nuvem para Smartphones (Cloud Sync):**
   - No Hub Studio (`assets/hub.js`): em `Catalog.saveCatalog()` e `CMS.saveLpConfig()`, persistir o catálogo global de LPs no Supabase (na tabela `forlife_leads` com registro protegido `code: '__keep__'` e `name: '__LP_CATALOG_SYNC__'`, utilizando a coluna `prescription_file` para armazenar o snapshot JSON do catálogo).
   - Também persistir cada LP individual na tabela `forlife_config` com `id: 'lp_' + lpId` para salvar preços, parcelamento e adicionais.
   - Nas Landing Pages (`forlife/app.js` e `visaosimples/app.js`): no carregamento inicial (`loadForlifeConfig()` / `loadVsConfig()`), caso o catálogo local esteja vazio (cenário padrão de novos visitantes ou smartphones) ou desatualizado, realizar fetch automático do Supabase (`code=eq.__keep__` e `forlife_config?id=in.(...)`), hidratando o `localStorage` do dispositivo móvel e aplicando todas as variáveis da LP (`heroTitle`, `heroSupporting`, `frameBrand`, `lensBrand`, `heroStyle`, `comboPrice`, `installments`, etc.).

3. **Uniformização Dinâmica de Preços dos Cupons:**
   - Em `forlife/index.html` e `forlife.html`, substituir o valor estático `R$ 297,00` no botão de cupom da seção de avaliações (`#review-voucher-btn` / `.btn-voucher-action`) por injeção dinâmica.
   - Em `visaosimples/index.html`, substituir `R$ 194,00` pelo elemento dinâmico.
   - Em `forlife/app.js` e `visaosimples/app.js`, em `updateComboPrices()` / `updatePrices()`, varrer todos os botões de ação de cupom (`.btn-voucher-action`, `[data-track-element="CTA Seção Avaliações"]`, `.voucher-cta-btn`) e atualizar o texto para `Quero Meu Cupom de R$ ${formatMoney(comboPrice)}`.

4. **Garantia de Espelhamento e Integridade:**
   - `forlife.html` na raiz deve ser idêntico byte a byte a `forlife/index.html`. Validação obrigatória com `fc.exe /b`.

---

## Proposed Changes

### Landing Pages (`forlife/index.html`, `forlife.html`, `forlife/style.css`, `forlife/app.js`)

#### [MODIFY] [forlife/index.html](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/forlife/index.html) e [forlife.html](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/forlife.html)
- Mover `.hero-cta-wrapper` para dentro de `.hero-content-col` abaixo de `#forlife-hero-subtitle`.
- Deixar `.hero-model-col` dedicado exclusivamente à foto macro.
- Dinamizar texto de preço no botão de cupom das avaliações.

#### [MODIFY] [forlife/style.css](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/forlife/style.css)
- Aplicar `margin-top: -145px` em `.hero-content-col` no desktop.
- Estilizar `.hero-cta-wrapper` dentro de `.hero-content-col`.
- Reduzir altura vertical do banner em 4 a 5cm (zerar padding superior/inferior, `align-items: flex-end`, reduzir margem da trust bar).
- Preservar responsividade mobile (`@media (max-width: 992px)`).

#### [MODIFY] [forlife/app.js](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/forlife/app.js)
- Em `loadForlifeConfig()`, implementar fetch automático do catálogo em nuvem (`forlife_leads?code=eq.__keep__` e `forlife_config`) para smartphones e dispositivos externos.
- Em `updateComboPrices()`, atualizar dinamicamente o texto de todos os botões de cupom da página para o preço exato da LP ativa.

---

### Visão Simples (`visaosimples/index.html`, `visaosimples/app.js`)

#### [MODIFY] [visaosimples/index.html](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/visaosimples/index.html)
- Dinamizar texto de preço no botão de cupom das avaliações.

#### [MODIFY] [visaosimples/app.js](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/visaosimples/app.js)
- Em `loadVsConfig()`, sincronizar catálogo do Supabase quando não estiver presente no dispositivo móvel.
- Em `updatePrices()`, atualizar dinamicamente os botões de cupom.

---

### Hub Studio (`assets/hub.js`)

#### [MODIFY] [assets/hub.js](file:///C:/Users/fbdv1/.gemini/antigravity/scratch/otica-conceicao-lp/assets/hub.js)
- Em `Catalog.saveCatalog()`, persistir snapshot global do catálogo no Supabase (`forlife_leads` com `code: '__keep__'`).
- Em `CMS.saveLpConfig()`, salvar configurações específicas da LP em `forlife_config` com `id: 'lp_' + lpId`.
- Filtrar lead especial `__keep__` para que não polua o Kanban ou a tabela de leads.

---

## Verification Plan

### Testes com `agent-browser`:
1. **Desktop Hero (1440x900):**
   - Verificar elevação de 2cm do bloco de texto.
   - Verificar botão do WhatsApp e escassez posicionados sob o texto.
   - Verificar foto macro encostando na base sem interrupção e banner reduzido em 4 a 5cm.
2. **Mobile Viewport (390x844):**
   - Verificar layout centralizado e harmonioso no smartphone.
   - Simular visita externa sem LocalStorage para comprovar sincronização do catálogo e CMS pelo Supabase.
3. **Auditoria de Preços de Cupom:**
   - Verificar que todos os botões de cupom em LPs de R$ 297, R$ 194, R$ 294 etc. mostram o valor correto sem divergências.
4. **Espelhamento:**
   - Executar `fc.exe /b forlife.html forlife\index.html`.
5. **Deploy & Produção:**
   - Commit, push e teste na produção oficial `https://lp.opticaconceicao.com.br`.
