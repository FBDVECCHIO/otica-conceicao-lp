// ==============================================================================
// LANDING PAGE VISÃO SIMPLES - MOTOR DINÂMICO & LEAD MANAGER
// ÓPTICAS CONCEIÇÃO - VERSÃO 2.1.0
// ==============================================================================

const SUPABASE_URL = "https://mngwfearwjkpisararbe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZ3dmZWFyd2prcGlzYXJhcmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTc5MzksImV4cCI6MjA5NjE3MzkzOX0.vk9Ol41NU2RI72-ZZKIcm7hzccYBjzPPptb6rZv_mKs";

let supabaseClient = null;
if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Erro ao inicializar Supabase:", e);
    }
}

// Configuração Padrão do Template Visão Simples (Campanha 194)
let vsConfig = {
    lpId: '194',
    name: 'Óculos Completo Visão Simples 194',
    comboPrice: 194.00,
    installments: 10,
    offerType: 'combo_completo', // 'combo_completo' | 'so_lentes'
    lensModality: 'lentes_prontas', // 'lentes_prontas' | 'visao_simples_surfacada' | 'multifocal'
    frameBrand: 'Coleção Conceição',
    lensBrand: 'Lentes Monofocais HD',
    addonAntirreflexo: 60.00,
    addonBluecut: 70.00,
    addonFotossensivel: 120.00,
    showTechSection: true,
    addonsActive: {
        antirreflexo: true,
        bluecut: true,
        fotossensivel: true
    }
};

// Estado dos adicionais selecionados
const selectedAddons = {
    antirreflexo: false,
    bluecut: false,
    fotossensivel: false
};

let prescriptionBase64 = "";

// ==============================================================================
// PROTOCOLO DE SAÍDA DO AR (LPS DESATIVADAS)
// ==============================================================================
async function checkLpOnlineStatus() {
    try {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '') || '194';
        const urlParams = new URLSearchParams(window.location.search);
        const themeId = urlParams.get('theme') || '';
        const lpId = urlParams.get('lp') || '';
        const slugId = urlParams.get('slug') || '';

        // 1. Checa catálogo local: se status da LP for 'Ativa', está 100% ONLINE
        const rawCat = localStorage.getItem('otica_conceicao_lps_catalog');
        if (rawCat) {
            const cat = JSON.parse(rawCat);
            const foundLp = cat[path] || cat['/' + path] || (themeId && (cat[themeId] || cat['/' + themeId])) || (lpId && (cat[lpId] || cat['/' + lpId])) || (slugId && (cat[slugId] || cat['/' + slugId]));
            if (foundLp) {
                if (foundLp.status === 'Pausada' || foundLp.status === 'Inativa' || foundLp.status === 'Desativada') {
                    return false;
                }
                if (foundLp.status === 'Ativa') {
                    return true;
                }
            }
        }

        // 2. Checa LocalStorage se desativada neste navegador
        const raw = localStorage.getItem('otica_deactivated_lps');
        if (raw) {
            const deact = JSON.parse(raw);
            const checkKeys = [path, '/' + path];
            if (themeId) checkKeys.push(themeId, '/' + themeId);
            if (lpId) checkKeys.push(lpId, '/' + lpId);
            if (slugId) checkKeys.push(slugId, '/' + slugId);

            for (const k of checkKeys) {
                if (Array.isArray(deact) && deact.includes(k)) return false;
                if (typeof deact === 'object' && deact !== null && deact[k]) return false;
            }
        }

        // 3. Checa Supabase se houver registro de offline para este slug
        if (supabaseClient && path && path !== 'visaosimples/index.html' && path !== 'visaosimples' && path !== '194') {
            const { data } = await supabaseClient
                .from('forlife_config')
                .select('id')
                .eq('id', `lp_offline_${path}`)
                .maybeSingle();

            if (data && data.id) {
                return false;
            }
        }
    } catch (e) {
        console.warn('Erro ao verificar status online da LP:', e);
    }
    return true;
}

function renderOfflineScreen() {
    document.body.innerHTML = `
        <div style="min-height: 100vh; background: #001A36; display: flex; align-items: center; justify-content: center; padding: 24px; font-family: 'Outfit', sans-serif; color: #FFFFFF; text-align: center;">
            <div style="max-width: 520px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); border-radius: 20px; padding: 40px 28px; backdrop-filter: blur(10px); box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); color: #EF4444; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <span style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.1); border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: #93C5FD; margin-bottom: 12px;">Campanha Encerrada</span>
                <h1 style="font-size: 24px; font-weight: 800; margin-bottom: 12px;">Esta Oferta Não Está Mais Disponível</h1>
                <p style="font-size: 14.5px; color: #94A3B8; line-height: 1.6; margin-bottom: 28px;">
                    A campanha promocional vinculada a este endereço foi desativada ou teve seu lote promocional encerrado. Conheça nossas ofertas em destaque ou fale diretamente com a nossa equipe especializada.
                </p>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a href="https://lp.opticaconceicao.com.br/forlife" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: #0066CC; color: #FFFFFF; padding: 14px 24px; border-radius: 12px; font-weight: 700; text-decoration: none; font-size: 15px; transition: background 0.2s;">
                        <i class="fas fa-arrow-right"></i> Ver Campanhas Ativas da Ótica
                    </a>
                    <a href="https://api.whatsapp.com/send?phone=5519978056552&text=Olá,%20gostaria%20de%20consultar%20ofertas%20ativas%20nas%20Ópticas%20Conceição" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(255,255,255,0.1); color: #FFFFFF; padding: 12px 24px; border-radius: 12px; font-weight: 600; text-decoration: none; font-size: 14px;">
                        <i class="fab fa-whatsapp" style="color: #22C55E;"></i> Falar com um Consultor no WhatsApp
                    </a>
                </div>
                <div style="margin-top: 28px; padding-top: 18px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 12px; color: #64748B;">
                    Ópticas Conceição &bull; Desde 1948 &bull; Campinas/SP
                </div>
            </div>
        </div>
    `;
}

// ==============================================================================
// INICIALIZAÇÃO
// ==============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    const isOnline = await checkLpOnlineStatus();
    if (!isOnline) {
        renderOfflineScreen();
        return;
    }
    initScarcityBadge();
    await loadConfigFromStorage();
    applyConfigToDOM();
    setupEventListeners();
    setupFAQ();
    updatePricingUI();
    initStores();
    initTrafficTracker();
});

// ==============================================================================
// CARREGAMENTO DA CONFIGURAÇÃO DINÂMICA (CMS / CATALOG / FALLBACK)
// ==============================================================================
async function loadConfigFromStorage() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const queryLp = urlParams.get('lp') || urlParams.get('slug') || urlParams.get('theme') || '';
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
        const slug = queryLp || path || '194';
        
        let catalog = {};
        try {
            const raw = localStorage.getItem('otica_conceicao_lps_catalog');
            if (raw) catalog = JSON.parse(raw);
        } catch (e) {}

        // Sincroniza em nuvem caso o visitante esteja em smartphone ou novo dispositivo
        if (supabaseClient) {
            try {
                let shouldFetchCloud = !catalog || Object.keys(catalog).length === 0;
                if (!shouldFetchCloud && !catalog[slug] && !catalog['/' + slug] && slug !== '194') {
                    shouldFetchCloud = true;
                }
                if (shouldFetchCloud) {
                    let cloudCat = null;
                    const { data: settingData } = await supabaseClient
                        .from('config_settings')
                        .select('value')
                        .eq('key', 'hub_catalog_snapshot')
                        .maybeSingle();

                    if (settingData && settingData.value) {
                        try { cloudCat = JSON.parse(settingData.value); } catch(e) {}
                    }
                    if (!cloudCat) {
                        const { data: cloudCatData } = await supabaseClient
                            .from('forlife_leads')
                            .select('prescription_file')
                            .eq('code', '__keep__')
                            .maybeSingle();

                        if (cloudCatData && cloudCatData.prescription_file) {
                            try { cloudCat = JSON.parse(cloudCatData.prescription_file); } catch(e) {}
                        }
                    }

                    if (cloudCat && typeof cloudCat === 'object') {
                        catalog = { ...catalog, ...cloudCat };
                        localStorage.setItem('otica_conceicao_lps_catalog', JSON.stringify(catalog));
                    }
                }
            } catch (cloudErr) {
                console.warn('[VisaoSimples] Fallback nuvem catálogo:', cloudErr);
            }
        }

        // Busca por correspondência exata ou parcial de slug/id
        let lpEntry = catalog[slug] || catalog['/' + slug] || null;
        if (!lpEntry) {
            for (const key in catalog) {
                const item = catalog[key];
                if (item && (item.slug === '/' + slug || item.slug === slug || item.id === slug || (item.url && item.url.includes(slug)))) {
                    lpEntry = item;
                    break;
                }
            }
        }

        // Se ainda não encontrou e for a campanha 194 padrão ou sem query
        if (!lpEntry && (slug === '194' || slug === 'forlife-194' || !queryLp)) {
            lpEntry = catalog['194'] || catalog['forlife-194'] || null;
        }
        
        if (lpEntry) {
            vsConfig.lpId = lpEntry.id || slug;
            vsConfig.name = lpEntry.name || vsConfig.name;
            vsConfig.comboPrice = parseFloat(lpEntry.price) || 194.00;
            vsConfig.installments = parseInt(lpEntry.installments, 10) || 10;
            if (lpEntry.offerType) vsConfig.offerType = lpEntry.offerType;
            if (lpEntry.lensModality) vsConfig.lensModality = lpEntry.lensModality;
            if (lpEntry.frameBrand) vsConfig.frameBrand = lpEntry.frameBrand;
            if (lpEntry.lensBrand) vsConfig.lensBrand = lpEntry.lensBrand;
            if (lpEntry.showTechSection !== undefined) vsConfig.showTechSection = lpEntry.showTechSection;
            if (lpEntry.addonsActive) vsConfig.addonsActive = { ...vsConfig.addonsActive, ...lpEntry.addonsActive };
        }

        // Tenta recuperar do CMS se configurado
        const cleanSlugKey = slug.replace(/^\/+/, '');
        const targetId = lpEntry ? lpEntry.id : slug;
        const storedCms = localStorage.getItem('otica_cms_config_' + targetId) || 
                          (lpEntry && lpEntry.slug ? localStorage.getItem('otica_cms_config_' + lpEntry.slug.replace(/^\/+/, '')) : null) ||
                          localStorage.getItem('otica_cms_config_' + cleanSlugKey) ||
                          localStorage.getItem('otica_cms_config_' + slug) ||
                          ((slug === '194' || slug === 'forlife-194' || !queryLp) ? localStorage.getItem('otica_cms_config_194') : null);
        if (storedCms) {
            const parsed = JSON.parse(storedCms);
            if (parsed.comboPrice) vsConfig.comboPrice = parseFloat(parsed.comboPrice);
            if (parsed.installments) vsConfig.installments = parseInt(parsed.installments, 10);
            if (parsed.antirreflexo !== undefined) vsConfig.addonAntirreflexo = parseFloat(parsed.antirreflexo);
            if (parsed.bluecut !== undefined) vsConfig.addonBluecut = parseFloat(parsed.bluecut);
            if (parsed.fotossensivel !== undefined) vsConfig.addonFotossensivel = parseFloat(parsed.fotossensivel);
            if (parsed.offerType) vsConfig.offerType = parsed.offerType;
            if (parsed.lensModality) vsConfig.lensModality = parsed.lensModality;
            if (parsed.frameBrand) vsConfig.frameBrand = parsed.frameBrand;
            if (parsed.lensBrand) vsConfig.lensBrand = parsed.lensBrand;
            if (parsed.showTechSection !== undefined) vsConfig.showTechSection = parsed.showTechSection;
            if (parsed.addonsActive) vsConfig.addonsActive = { ...vsConfig.addonsActive, ...parsed.addonsActive };
        }

        // Sobrescrita direta de parâmetros na URL (tem prioridade máxima)
        if (urlParams.get('price')) {
            const p = parseFloat(urlParams.get('price'));
            if (!isNaN(p)) vsConfig.comboPrice = p;
        }
        if (urlParams.get('installments')) {
            const inst = parseInt(urlParams.get('installments'), 10);
            if (!isNaN(inst)) vsConfig.installments = inst;
        }
    } catch (err) {
        console.warn("[VisãoSimples] Usando configuração padrão:", err);
    }
}

// ==============================================================================
// APLICAÇÃO VISUAL DA CONFIGURAÇÃO (HEADLINE, MARCAS, BADGES, ADICIONAIS)
// ==============================================================================
function applyConfigToDOM() {
    // 0. Exibição da Seção de Tecnologias
    const techSec = document.getElementById('tecnologias');
    if (techSec) {
        if (vsConfig.showTechSection === false) {
            techSec.style.display = 'none';
        } else {
            techSec.style.display = '';
        }
    }

    // 1. Modalidade da Lente
    const modalityBadge = document.getElementById('hero-modality-badge');
    if (modalityBadge) {
        if (vsConfig.lensModality === 'lentes_prontas') {
            modalityBadge.innerHTML = '<i class="fas fa-bolt"></i> Lentes Prontas (Estoque Express)';
        } else if (vsConfig.lensModality === 'visao_simples_surfacada') {
            modalityBadge.innerHTML = '<i class="fas fa-microscope"></i> Visão Simples Surfaçada Digital (Sob Medida)';
        } else if (vsConfig.lensModality === 'multifocal') {
            modalityBadge.innerHTML = '<i class="fas fa-layer-group"></i> Lentes Multifocais Digitais HD';
        }
    }

    // 2. Tipo de Oferta (Óculos Completo vs Só Lentes)
    const offerBadge = document.getElementById('combo-offer-type-badge');
    const heroTitle = document.getElementById('hero-title');
    const featFrame = document.getElementById('feat-frame-text');
    const featLens = document.getElementById('feat-lens-text');
    const comboTitle = document.getElementById('combo-card-title');
    const specFrameCard = document.getElementById('spec-frame-brand')?.closest('.brand-spec-card');

    if (vsConfig.offerType === 'so_lentes') {
        if (offerBadge) offerBadge.textContent = 'Apenas Lentes';
        if (heroTitle) heroTitle.innerHTML = `Lentes ${vsConfig.lensBrand || 'Visão Simples'}<br class="mobile-break"> Para Sua Armação`;
        if (featFrame) featFrame.textContent = 'Montagem e adaptação técnica na sua armação atual';
        if (featLens) featLens.textContent = `Lentes ${vsConfig.lensBrand || 'Visão Simples'} calibradas com precisão digital`;
        if (comboTitle) comboTitle.textContent = `Lentes ${vsConfig.lensBrand || 'Visão Simples'} + Sua Armação`;
        if (specFrameCard) {
            const frameVal = document.getElementById('spec-frame-brand');
            if (frameVal) frameVal.textContent = vsConfig.frameBrand || 'Sua Armação Atual';
        }
    } else {
        if (offerBadge) offerBadge.textContent = 'Óculos Completo';
        if (heroTitle) heroTitle.innerHTML = `Óculos Completo Visão Simples<br class="mobile-break"> + Armação ${vsConfig.frameBrand ? vsConfig.frameBrand : ''}`;
        if (featFrame) featFrame.textContent = `Armação de grau ${vsConfig.frameBrand || ''} inclusa à sua escolha`;
        if (featLens) featLens.textContent = `Lentes ${vsConfig.lensBrand || 'de Visão Simples'} calibradas para seu grau`;
        if (comboTitle) comboTitle.textContent = `Lentes ${vsConfig.lensBrand || 'Visão Simples'} + Armação ${vsConfig.frameBrand || ''}`;
        const frameVal = document.getElementById('spec-frame-brand');
        if (frameVal) frameVal.textContent = vsConfig.frameBrand || 'Coleção Conceição';
    }

    // 3. Marca das Lentes
    const lensVal = document.getElementById('spec-lens-brand');
    if (lensVal) lensVal.textContent = vsConfig.lensBrand || 'Lentes Monofocais HD';

    // 3.1 Propagação para todos os elementos com classes dinâmicas
    document.querySelectorAll('.dyn-frame-brand').forEach(el => {
        el.textContent = vsConfig.frameBrand || 'Coleção Conceição';
    });
    document.querySelectorAll('.dyn-lens-brand').forEach(el => {
        el.textContent = vsConfig.lensBrand || 'Lentes Monofocais HD';
    });

    // 4. Preços dos Adicionais no HTML
    const priceAntirreflexo = document.getElementById('price-val-antirreflexo');
    if (priceAntirreflexo) priceAntirreflexo.textContent = `+ R$ ${vsConfig.addonAntirreflexo.toFixed(2).replace('.', ',')}`;

    const priceBluecut = document.getElementById('price-val-bluecut');
    if (priceBluecut) priceBluecut.textContent = `+ R$ ${vsConfig.addonBluecut.toFixed(2).replace('.', ',')}`;

    const priceFotossensivel = document.getElementById('price-val-fotossensivel');
    if (priceFotossensivel) priceFotossensivel.textContent = `+ R$ ${vsConfig.addonFotossensivel.toFixed(2).replace('.', ',')}`;

    // 5. Controle de Tecnologias Ativas vs Desativadas (Cinza Baixo)
    const addons = ['antirreflexo', 'bluecut', 'fotossensivel'];
    addons.forEach(ad => {
        const card = document.getElementById(`card-addon-${ad}`);
        if (!card) return;

        const isEnabled = vsConfig.addonsActive ? (vsConfig.addonsActive[ad] !== false) : true;
        if (!isEnabled) {
            card.classList.add('is-disabled-gray');
            selectedAddons[ad] = false;

            // Insere pílula de indisponível se não houver
            if (!card.querySelector('.tech-disabled-pill')) {
                const badgeBox = card.querySelector('.tech-checkbox-badge');
                if (badgeBox) {
                    const pill = document.createElement('span');
                    pill.className = 'tech-disabled-pill';
                    pill.innerHTML = '<i class="fas fa-ban"></i> Indisponível';
                    badgeBox.parentNode.insertBefore(pill, badgeBox);
                }
            }
        } else {
            card.classList.remove('is-disabled-gray');
            const pill = card.querySelector('.tech-disabled-pill');
            if (pill) pill.remove();
        }
    });
}

// ==============================================================================
// ATUALIZAÇÃO REATIVA DE PREÇOS & RESUMO
// ==============================================================================
function updatePricingUI() {
    const basePrice = vsConfig.comboPrice;
    const installments = vsConfig.installments || 6;

    let totalAddons = 0;
    const activeAddonsList = [];

    if (selectedAddons.antirreflexo && (vsConfig.addonsActive?.antirreflexo !== false)) {
        totalAddons += vsConfig.addonAntirreflexo;
        activeAddonsList.push({ name: 'Tratamento Antirreflexo', price: vsConfig.addonAntirreflexo });
    }
    if (selectedAddons.bluecut && (vsConfig.addonsActive?.bluecut !== false)) {
        totalAddons += vsConfig.addonBluecut;
        activeAddonsList.push({ name: 'Filtro Azul (Bluecut)', price: vsConfig.addonBluecut });
    }
    if (selectedAddons.fotossensivel && (vsConfig.addonsActive?.fotossensivel !== false)) {
        totalAddons += vsConfig.addonFotossensivel;
        activeAddonsList.push({ name: 'Lentes Fotossensíveis', price: vsConfig.addonFotossensivel });
    }

    const totalPrice = basePrice + totalAddons;
    const installmentVal = (totalPrice / installments);

    const fmtMoney = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;

    // Atualiza Hero
    const elInstCount = document.getElementById('combo-inst-count');
    if (elInstCount) elInstCount.textContent = installments;

    const elInstVal = document.getElementById('combo-inst-val');
    if (elInstVal) elInstVal.textContent = fmtMoney(basePrice / installments);

    const elCashPrice = document.getElementById('combo-cash-price');
    if (elCashPrice) elCashPrice.textContent = fmtMoney(basePrice);

    // Atualiza Resumo no Banner do Cupom
    const elSummaryTitle = document.getElementById('summary-combo-title');
    if (elSummaryTitle) {
        elSummaryTitle.textContent = vsConfig.offerType === 'so_lentes' 
            ? `Lentes Visão Simples (${vsConfig.lensBrand || 'Monofocais'})`
            : `Óculos Completo (${vsConfig.frameBrand} + ${vsConfig.lensBrand})`;
    }

    const elSummaryComboPrice = document.getElementById('summary-combo-price');
    if (elSummaryComboPrice) elSummaryComboPrice.textContent = fmtMoney(basePrice);

    const elSummaryTotalPrice = document.getElementById('summary-total-price-val');
    if (elSummaryTotalPrice) elSummaryTotalPrice.textContent = fmtMoney(totalPrice);

    const elSummaryTotalInst = document.getElementById('summary-total-inst-val');
    if (elSummaryTotalInst) elSummaryTotalInst.textContent = `ou até ${installments}x de ${fmtMoney(installmentVal)} sem juros`;

    // Renderiza lista de adicionais no resumo
    const elAddonsContainer = document.getElementById('summary-addons-container');
    if (elAddonsContainer) {
        elAddonsContainer.innerHTML = '';
        if (activeAddonsList.length === 0) {
            elAddonsContainer.innerHTML = '<span style="font-size: 13px; color: rgba(255,255,255,0.6); font-style: italic;">Nenhuma tecnologia extra selecionada</span>';
        } else {
            activeAddonsList.forEach(item => {
                const line = document.createElement('div');
                line.className = 'summary-line';
                line.style.fontSize = '13.5px';
                line.style.color = '#93C5FD';
                line.innerHTML = `<span>+ ${item.name}</span><span>${fmtMoney(item.price)}</span>`;
                elAddonsContainer.appendChild(line);
            });
        }
    }

    // Atualiza Link do CTA do WhatsApp da Hero
    updateHeroWhatsappLink(basePrice, installments);

    // Atualiza todos os botões e elementos de cupom para o valor exato da LP ativa
    const formattedPrice = fmtMoney(basePrice);
    const voucherButtons = document.querySelectorAll('.btn-voucher-action, [data-track-element="CTA Seção Avaliações"], .voucher-cta-btn');
    voucherButtons.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-ticket-alt"></i> Quero Meu Cupom de ${formattedPrice}`;
    });
    const dynPriceElements = document.querySelectorAll('.dyn-voucher-price');
    dynPriceElements.forEach(el => {
        el.textContent = basePrice.toFixed(2).replace('.', ',');
    });
}

function updateHeroWhatsappLink(price, inst) {
    const btn = document.getElementById('btn-hero-whatsapp');
    if (!btn) return;

    const fmtPrice = `R$ ${price.toFixed(2).replace('.', ',')}`;
    const instVal = `R$ ${(price / inst).toFixed(2).replace('.', ',')}`;
    const phone = "5519978056552";

    const offerDesc = vsConfig.offerType === 'so_lentes'
        ? `Lentes ${vsConfig.lensBrand || 'Visão Simples'}`
        : `Armação ${vsConfig.frameBrand || 'Conceição'} + Lentes ${vsConfig.lensBrand || 'Visão Simples'}`;

    const text = encodeURIComponent(
        `Olá! Vim pela promoção do site das Ópticas Conceição e gostaria de garantir o combo *${offerDesc}* por ${fmtPrice} (ou ${inst}x de ${instVal} sem juros). Poderiam me atender?`
    );

    btn.href = `https://api.whatsapp.com/send?1=pt_BR&phone=${phone}&text=${text}`;
}

// ==============================================================================
// SELEÇÃO INTERATIVA DE TECNOLOGIAS ADICIONAIS
// ==============================================================================
function setupEventListeners() {
    ['antirreflexo', 'bluecut', 'fotossensivel'].forEach(addon => {
        const card = document.getElementById(`card-addon-${addon}`);
        if (!card) return;

        card.addEventListener('click', (e) => {
            // Se clicou no botão de abrir benefício, deixa o accordion agir
            if (e.target.closest('.tech-accordion-btn') || e.target.closest('.tech-accordion-content')) {
                return;
            }

            // Não seleciona se estiver desativado em cinza
            if (card.classList.contains('is-disabled-gray')) {
                return;
            }

            selectedAddons[addon] = !selectedAddons[addon];
            if (selectedAddons[addon]) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
            updatePricingUI();
        });
    });

    // Accordions das tecnologias
    document.querySelectorAll('.tech-accordion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const content = btn.nextElementSibling;
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', !expanded);
            if (content) {
                content.style.maxHeight = expanded ? null : `${content.scrollHeight}px`;
            }
        });
    });

    // Formulário do Voucher
    const form = document.getElementById('voucher-form');
    const submitBtn = document.getElementById('btn-submit-voucher');
    const inputName = document.getElementById('client-name');
    const inputPhone = document.getElementById('client-phone');

    function checkFormValidity() {
        if (!submitBtn || !inputName || !inputPhone) return;
        const valid = inputName.value.trim().length >= 3 && inputPhone.value.trim().length >= 10;
        submitBtn.disabled = !valid;
    }

    if (inputName) inputName.addEventListener('input', checkFormValidity);
    if (inputPhone) {
        inputPhone.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 6) {
                v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
            } else if (v.length > 2) {
                v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
            }
            e.target.value = v;
            checkFormValidity();
        });
    }

    // Receita Médica Checkboxes
    const radioHave = document.getElementById('recipe-option-have');
    const radioNeed = document.getElementById('recipe-option-need');
    const uploadArea = document.getElementById('prescription-upload-area');
    const fileInput = document.getElementById('prescription-file');

    if (radioHave) {
        radioHave.addEventListener('change', () => {
            if (radioHave.checked && uploadArea) uploadArea.style.display = 'block';
        });
    }
    if (radioNeed) {
        radioNeed.addEventListener('change', () => {
            if (radioNeed.checked && uploadArea) uploadArea.style.display = 'none';
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                prescriptionBase64 = reader.result;
                const preview = document.getElementById('prescription-preview-box');
                const label = document.getElementById('prescription-file-name');
                if (preview && label) {
                    label.textContent = file.name;
                    preview.style.display = 'flex';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Submissão do Cupom
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleVoucherSubmission();
        });
    }
}

// ==============================================================================
// GERAÇÃO E ENVIO DO VOUCHER DE DESCONTO
// ==============================================================================
async function handleVoucherSubmission() {
    const name = document.getElementById('client-name')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    const email = document.getElementById('client-email')?.value.trim() || '';
    const city = document.getElementById('client-city')?.value.trim() || 'Campinas';
    const store = document.getElementById('client-store')?.value || 'Não informada';
    const recipeStatus = document.querySelector('input[name="recipe_status"]:checked')?.value || 'nao_informado';

    const voucherCode = 'VS194-' + Math.floor(1000 + Math.random() * 9000);

    const basePrice = vsConfig.comboPrice;
    let total = basePrice;
    const addonsNames = [];

    if (selectedAddons.antirreflexo) { total += vsConfig.addonAntirreflexo; addonsNames.push('Antirreflexo'); }
    if (selectedAddons.bluecut) { total += vsConfig.addonBluecut; addonsNames.push('Bluecut (Filtro Azul)'); }
    if (selectedAddons.fotossensivel) { total += vsConfig.addonFotossensivel; addonsNames.push('Fotossensível'); }

    const lpTag = `[LP:${vsConfig.lpId || '194'}]`;
    const cityWithStore = store ? `${city} (Loja: ${store})` : city;
    const cityWithLp = `${cityWithStore} ${lpTag}`;

    const dbPayload = {
        name: name,
        phone: phone,
        email: email,
        city: cityWithLp,
        store: store || null,
        combo_price: vsConfig.comboPrice,
        addons: JSON.stringify(addonsNames),
        total_price: total,
        has_prescription: Boolean(recipeStatus && recipeStatus.toLowerCase().includes('atualizada')),
        prescription_file: '',
        code: voucherCode
    };

    const leadPayload = {
        ...dbPayload,
        client_name: name,
        client_phone: phone,
        client_email: email,
        client_city: city,
        store_choice: store,
        recipe_status: recipeStatus,
        lp_id: vsConfig.lpId || '194',
        combo_name: vsConfig.name,
        offer_type: vsConfig.offerType,
        lens_modality: vsConfig.lensModality,
        frame_brand: vsConfig.frameBrand,
        lens_brand: vsConfig.lensBrand,
        total_value: total,
        created_at: new Date().toISOString()
    };

    // Salva no Supabase se disponível
    if (supabaseClient) {
        try {
            await supabaseClient.from('forlife_leads').insert([dbPayload]);
        } catch (err) {
            console.warn("[VisãoSimples] Erro ao gravar lead no Supabase:", err);
        }
    }

    // Salva localmente como garantia
    try {
        const existing = JSON.parse(localStorage.getItem('forlife_leads') || '[]');
        existing.unshift(leadPayload);
        localStorage.setItem('forlife_leads', JSON.stringify(existing));
    } catch (e) {}

    // Exibe tela de sucesso
    const formCard = document.getElementById('form-inputs-container');
    const successCard = document.getElementById('voucher-success-box');
    const userName = document.getElementById('voucher-user-name');
    const codeDisplay = document.getElementById('voucher-code-display');
    const btnWhatsapp = document.getElementById('btn-whatsapp-voucher');

    if (userName) userName.textContent = name;
    if (codeDisplay) codeDisplay.textContent = voucherCode;

    // Monta mensagem do WhatsApp
    const fmtTotal = `R$ ${total.toFixed(2).replace('.', ',')}`;
    const instVal = `R$ ${(total / vsConfig.installments).toFixed(2).replace('.', ',')}`;
    const addonsStr = addonsNames.length > 0 ? ` + ${addonsNames.join(' + ')}` : '';

    const msg = encodeURIComponent(
        `Olá! Acabei de gerar meu Cupom Oficial *${voucherCode}* pelo site das Ópticas Conceição!\n\n` +
        `👤 *Nome:* ${name}\n` +
        `👓 *Oferta:* ${vsConfig.name}${addonsStr}\n` +
        `💰 *Valor Especial:* ${fmtTotal} (em até ${vsConfig.installments}x de ${instVal} sem juros)\n` +
        `📍 *Loja de Preferência:* ${store}\n\n` +
        `Gostaria de agendar meu atendimento e resgatar as condições especiais na loja!`
    );

    if (btnWhatsapp) {
        btnWhatsapp.href = `https://api.whatsapp.com/send?1=pt_BR&phone=5519978056552&text=${msg}`;
    }

    if (formCard) formCard.style.display = 'none';
    if (successCard) successCard.style.display = 'block';

    successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ==============================================================================
// FAQ ACORDION
// ==============================================================================
function setupFAQ() {
    document.querySelectorAll('.faq-item').forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });
}

function initScarcityBadge() {
    const el = document.querySelector('.scarcity-number');
    if (!el) return;
    const saved = sessionStorage.getItem('scarcity_count');
    if (saved) {
        el.textContent = saved;
    } else {
        const count = Math.floor(Math.random() * 5) + 12; // entre 12 e 16
        sessionStorage.setItem('scarcity_count', count);
        el.textContent = count;
    }
}

function initStores() {
    const select = document.getElementById('client-store');
    if (!select) return;

    const defaultStores = [
        "Loja 1: Rua Barão de Jaguara, 1102 - Centro, Campinas",
        "Loja 2: Av. Francisco Glicério, 1045 - Centro, Campinas",
        "Loja 3: Rua 13 de Maio, 450 - Centro, Campinas",
        "Loja 4: Shopping Iguatemi Campinas",
        "Loja 5: Parque D. Pedro Shopping"
    ];

    defaultStores.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        select.appendChild(opt);
    });
}

function initTrafficTracker() {
    try {
        const log = {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        const raw = localStorage.getItem('forlife_traffic_log') || '[]';
        const parsed = JSON.parse(raw);
        parsed.unshift(log);
        if (parsed.length > 100) parsed.pop();
        localStorage.setItem('forlife_traffic_log', JSON.stringify(parsed));
    } catch (e) {}
}
