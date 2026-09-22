// ==========================================
// CONFIGURAÇÃO SUPABASE & ESTADO FORLIFE
// ==========================================
const SUPABASE_URL = "https://mngwfearwjkpisararbe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZ3dmZWFyd2prcGlzYXJhcmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTc5MzksImV4cCI6MjA5NjE3MzkzOX0.vk9Ol41NU2RI72-ZZKIcm7hzccYBjzPPptb6rZv_mKs";

const isSupabaseConfigured = () => {
    return SUPABASE_URL && SUPABASE_URL !== "SUA_SUPABASE_URL_AQUI" && 
           SUPABASE_KEY && SUPABASE_KEY !== "SUA_SUPABASE_KEY_AQUI";
};

let supabaseClient = null;
if (isSupabaseConfigured()) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Erro ao inicializar cliente do Supabase:", e);
    }
}

// Configuração padrão da campanha ForLife
let forlifeConfig = {
    comboPrice: 297.00,
    installments: 10,
    addonAntirreflexo: 100.00,
    addonBluecut: 100.00,
    addonFotossensivel: 150.00
};

// Estado dos adicionais de tecnologia
const selectedAddons = {
    antirreflexo: false,
    bluecut: false,
    fotossensivel: false
};

// Receita médica em Base64 (opcional)
let prescriptionBase64 = "";

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initScarcityBadge();
    await loadForlifeConfig();
    setupEventListeners();
    setupFAQ();
    setupScrollTop();
    updatePricingUI();
    initTrafficTracker();
    initDwellTimeTracker();
    initScrollDepthTracker();
    initHeatmapTracker();
});

// ==========================================
// RASTREAMENTO DE TRÁFEGO, UTMS & GEOLOCALIZAÇÃO
// ==========================================
function getActiveUtm() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const source = urlParams.get('utm_source');
        const medium = urlParams.get('utm_medium');
        const campaign = urlParams.get('utm_campaign');
        const utmId = urlParams.get('utm_id');
        const content = urlParams.get('utm_content');
        const term = urlParams.get('utm_term');

        // Se houver parâmetros UTM na URL, atualiza a sessão
        if (source || campaign || utmId || medium) {
            const utmData = {
                source: (source || '').toLowerCase().trim(),
                medium: (medium || '').toLowerCase().trim(),
                campaign: (campaign || '').trim(),
                utm_id: (utmId || '').trim(),
                content: (content || '').trim(),
                term: (term || '').trim()
            };
            sessionStorage.setItem('forlife_utm', JSON.stringify(utmData));
            return utmData;
        }

        // Recuperar da sessão se o usuário navegou na mesma aba
        const saved = sessionStorage.getItem('forlife_utm');
        if (saved) {
            return JSON.parse(saved);
        }

        // Inferência por referrer se veio de redes sociais
        let inferredSource = 'Direto / Orgânico';
        let inferredMedium = 'direct';
        const ref = (document.referrer || '').toLowerCase();
        if (ref.includes('tiktok')) { inferredSource = 'tiktok'; inferredMedium = 'social'; }
        else if (ref.includes('instagram')) { inferredSource = 'instagram'; inferredMedium = 'social'; }
        else if (ref.includes('facebook') || ref.includes('fb.')) { inferredSource = 'facebook'; inferredMedium = 'social'; }
        else if (ref.includes('google')) { inferredSource = 'google'; inferredMedium = 'search'; }
        else if (ref.includes('whatsapp')) { inferredSource = 'whatsapp'; inferredMedium = 'messaging'; }

        return {
            source: inferredSource,
            medium: inferredMedium,
            campaign: 'Geral',
            utm_id: '',
            content: '',
            term: ''
        };
    } catch (e) {
        return { source: 'Direto / Orgânico', medium: 'direct', campaign: 'Geral', utm_id: '', content: '', term: '' };
    }
}

async function reverseGeocodeCoords(lat, lon) {
    try {
        const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=pt`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
            const data = await res.json();
            const neighborhood = data.locality || data.suburb || (data.localityInfo && data.localityInfo.administrative && data.localityInfo.administrative[3] ? data.localityInfo.administrative[3].name : '');
            const city = data.city || (data.localityInfo && data.localityInfo.administrative && data.localityInfo.administrative[2] ? data.localityInfo.administrative[2].name : 'Campinas');
            const state = data.principalSubdivisionCode ? data.principalSubdivisionCode.replace('BR-', '') : (data.principalSubdivision || 'SP');
            return {
                city: city,
                region: state,
                country: data.countryCode || 'BR',
                neighborhood: neighborhood,
                latitude: parseFloat(lat.toFixed(5)),
                longitude: parseFloat(lon.toFixed(5)),
                precision: 'gps'
            };
        }
    } catch (e) {}
    return null;
}

function updateVisitRecordLocation(newLoc) {
    try {
        const visitId = sessionStorage.getItem('forlife_current_visit_id');
        const trafficLog = JSON.parse(localStorage.getItem('forlife_traffic_log')) || [];
        const visit = visitId ? trafficLog.find(v => v.id === visitId) : trafficLog[0];
        if (visit && newLoc) {
            visit.city = newLoc.city || visit.city;
            visit.region = newLoc.region || visit.region;
            visit.neighborhood = newLoc.neighborhood || visit.neighborhood;
            visit.latitude = newLoc.latitude || visit.latitude;
            visit.longitude = newLoc.longitude || visit.longitude;
            visit.precision = newLoc.precision || visit.precision;
            localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));
        }
    } catch (e) {}
}

function tryAcquireGpsLocation() {
    if (!navigator.geolocation) return;
    try {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                const preciseLoc = await reverseGeocodeCoords(lat, lon);
                if (preciseLoc) {
                    sessionStorage.setItem('forlife_visitor_location', JSON.stringify(preciseLoc));
                    updateVisitRecordLocation(preciseLoc);
                }
            },
            () => {},
            { enableHighAccuracy: true, timeout: 6000, maximumAge: 120000 }
        );
    } catch (e) {}
}

async function detectVisitorLocation() {
    const cached = sessionStorage.getItem('forlife_visitor_location');
    if (cached) {
        try { return JSON.parse(cached); } catch (e) {}
    }

    try {
        const res = await fetch('https://freeipapi.com/api/json', { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
            const data = await res.json();
            const loc = {
                city: data.cityName || 'Campinas e Região',
                region: data.regionName || 'SP',
                country: data.countryCode || 'BR',
                neighborhood: '',
                latitude: data.latitude || null,
                longitude: data.longitude || null,
                precision: 'ip'
            };
            sessionStorage.setItem('forlife_visitor_location', JSON.stringify(loc));
            return loc;
        }
    } catch (e) {}

    try {
        const res2 = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
        if (res2.ok) {
            const data2 = await res2.json();
            const loc2 = {
                city: data2.city || 'Campinas e Região',
                region: data2.region_code || data2.region || 'SP',
                country: data2.country_code || 'BR',
                neighborhood: '',
                latitude: data2.latitude || null,
                longitude: data2.longitude || null,
                precision: 'ip'
            };
            sessionStorage.setItem('forlife_visitor_location', JSON.stringify(loc2));
            return loc2;
        }
    } catch (e) {}

    const defaultLoc = { city: 'Campinas e Região', region: 'SP', country: 'BR', neighborhood: '', latitude: null, longitude: null, precision: 'default' };
    sessionStorage.setItem('forlife_visitor_location', JSON.stringify(defaultLoc));
    return defaultLoc;
}

// Estado e Telemetria de Engajamento
let dwellStartTime = Date.now();
let accumulatedDwellTimeMs = 0;
let isDwellTabActive = true;
let currentMaxScrollDepth = 0;

function getActiveDwellSeconds() {
    let elapsed = accumulatedDwellTimeMs;
    if (isDwellTabActive) {
        elapsed += (Date.now() - dwellStartTime);
    }
    return Math.max(1, Math.floor(elapsed / 1000));
}

function syncDwellAndScrollToStorage() {
    try {
        const visitId = sessionStorage.getItem('forlife_current_visit_id');
        const trafficLog = JSON.parse(localStorage.getItem('forlife_traffic_log')) || [];
        const visit = visitId ? trafficLog.find(v => v.id === visitId) : trafficLog[0];
        if (visit) {
            visit.dwell_seconds = getActiveDwellSeconds();
            if (currentMaxScrollDepth > (visit.scroll_depth || 0)) {
                visit.scroll_depth = currentMaxScrollDepth;
            }
            localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));
        }
    } catch (e) {}
}

function initDwellTimeTracker() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (isDwellTabActive) {
                accumulatedDwellTimeMs += (Date.now() - dwellStartTime);
                isDwellTabActive = false;
            }
        } else {
            if (!isDwellTabActive) {
                dwellStartTime = Date.now();
                isDwellTabActive = true;
            }
        }
        syncDwellAndScrollToStorage();
    });

    window.addEventListener('beforeunload', syncDwellAndScrollToStorage);
    window.addEventListener('pagehide', syncDwellAndScrollToStorage);
    setInterval(syncDwellAndScrollToStorage, 4000);
}

function initScrollDepthTracker() {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                try {
                    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                    if (scrollHeight > 50) {
                        const pct = Math.round((window.scrollY / scrollHeight) * 100);
                        let milestone = 0;
                        if (pct >= 85) milestone = 100;
                        else if (pct >= 65) milestone = 75;
                        else if (pct >= 40) milestone = 50;
                        else if (pct >= 15) milestone = 25;

                        if (milestone > currentMaxScrollDepth) {
                            currentMaxScrollDepth = milestone;
                            syncDwellAndScrollToStorage();
                        }
                    }
                } catch (e) {}
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function trackElementClick(elementLabel) {
    if (!elementLabel) return;
    try {
        const visitId = sessionStorage.getItem('forlife_current_visit_id');
        const trafficLog = JSON.parse(localStorage.getItem('forlife_traffic_log')) || [];
        const visit = visitId ? trafficLog.find(v => v.id === visitId) : trafficLog[0];
        if (visit) {
            if (!Array.isArray(visit.clicked_elements)) visit.clicked_elements = [];
            visit.clicked_elements.push({
                element: elementLabel,
                second: getActiveDwellSeconds()
            });
            visit.last_clicked_element = elementLabel;
            visit.clicks_count = (visit.clicks_count || 0) + 1;
            visit.dwell_seconds = getActiveDwellSeconds();
            if (currentMaxScrollDepth > (visit.scroll_depth || 0)) {
                visit.scroll_depth = currentMaxScrollDepth;
            }
            localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));
        }

        // Contador Global de Heatmap
        const heatmap = JSON.parse(localStorage.getItem('forlife_heatmap_counts')) || {};
        heatmap[elementLabel] = (heatmap[elementLabel] || 0) + 1;
        localStorage.setItem('forlife_heatmap_counts', JSON.stringify(heatmap));
    } catch (e) {}
}

function initHeatmapTracker() {
    document.addEventListener('click', (e) => {
        try {
            // 1. Elementos com atributo específico
            const explicit = e.target.closest('[data-track-element]');
            if (explicit) {
                const label = explicit.getAttribute('data-track-element');
                trackElementClick(label);
                if (label.includes('CTA') || label.includes('Loja') || label.includes('Voucher')) {
                    tryAcquireGpsLocation();
                }
                return;
            }

            // 2. Botões CTA da página
            const ctaBtn = e.target.closest('.btn-voucher-action, .btn-submit-voucher, a[href="#voucher"]');
            if (ctaBtn) {
                const text = ctaBtn.textContent.trim().replace(/\s+/g, ' ').substring(0, 30);
                trackElementClick(`CTA: ${text || 'Gerar Voucher'}`);
                tryAcquireGpsLocation();
                return;
            }

            // 3. Abas e botões de Tecnologia
            const techBtn = e.target.closest('.tech-accordion-btn, .tech-card, .technology-card');
            if (techBtn) {
                const h3 = techBtn.querySelector('h3, h4, span') || techBtn;
                const text = h3.textContent.trim().substring(0, 30);
                trackElementClick(`Tecnologia: ${text || 'Lente'}`);
                return;
            }

            // 4. WhatsApp
            const whatsBtn = e.target.closest('.btn-whatsapp-share, a[href*="whatsapp"], a[href*="wa.me"]');
            if (whatsBtn) {
                trackElementClick('WhatsApp: Contato / Resgate');
                return;
            }

            // 5. Comparadores / Sliders
            const slider = e.target.closest('.comparison-slider, .slider-handle, .image-compare-wrapper');
            if (slider) {
                trackElementClick('Interativo: Comparador de Lentes');
                return;
            }

            // 6. FAQ
            const faq = e.target.closest('.faq-item, .faq-question');
            if (faq) {
                const qText = faq.textContent.trim().substring(0, 35);
                trackElementClick(`FAQ: ${qText}`);
                return;
            }

            // 7. Seletor de Loja
            const store = e.target.closest('#selected-store, .store-card, .store-option');
            if (store) {
                trackElementClick('Lojas: Seleção de Unidade');
                tryAcquireGpsLocation();
                return;
            }
        } catch (err) {}
    }, true);
}

async function initTrafficTracker() {
    try {
        const now = Date.now();
        const lastTrack = sessionStorage.getItem('forlife_last_track_time');
        // Evita duplicar cliques da mesma aba em menos de 5 minutos
        if (lastTrack && (now - parseInt(lastTrack, 10)) < 300000) {
            return;
        }

        const utm = getActiveUtm();
        const loc = await detectVisitorLocation();
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const device = isMobile ? 'Mobile' : 'Desktop';
        const visitId = 'vis_' + Math.random().toString(36).substring(2, 9);

        const visitRecord = {
            id: visitId,
            created_at: new Date().toISOString(),
            source: utm.source,
            medium: utm.medium,
            campaign: utm.campaign,
            utm_id: utm.utm_id,
            content: utm.content,
            term: utm.term,
            city: loc.city,
            neighborhood: loc.neighborhood || '',
            region: loc.region,
            country: loc.country,
            latitude: loc.latitude || null,
            longitude: loc.longitude || null,
            precision: loc.precision || 'ip',
            device: device,
            page_url: window.location.href,
            converted: false,
            voucher_code: null,
            dwell_seconds: 0,
            scroll_depth: 0,
            clicks_count: 0,
            last_clicked_element: null,
            clicked_elements: []
        };

        sessionStorage.setItem('forlife_current_visit_id', visitId);
        sessionStorage.setItem('forlife_last_track_time', now.toString());

        // 1. Gravação no Supabase (se a tabela forlife_traffic existir)
        if (supabaseClient) {
            try {
                await supabaseClient.from('forlife_traffic').insert([{
                    source: visitRecord.source,
                    medium: visitRecord.medium,
                    campaign: visitRecord.campaign,
                    utm_id: visitRecord.utm_id,
                    content: visitRecord.content,
                    term: visitRecord.term,
                    city: visitRecord.city,
                    region: visitRecord.region,
                    country: visitRecord.country,
                    device: visitRecord.device,
                    page_url: visitRecord.page_url,
                    converted: false
                }]);
            } catch (e) {
                console.warn("Tabela forlife_traffic no Supabase:", e);
            }
        }

        // 2. Gravação no log compartilhado de tráfego (sempre disponível para o Admin)
        try {
            const trafficLog = JSON.parse(localStorage.getItem('forlife_traffic_log')) || [];
            trafficLog.unshift(visitRecord);
            if (trafficLog.length > 500) trafficLog.length = 500;
            localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));
        } catch (e) {}

    } catch (err) {
        console.warn("Erro ao rastrear tráfego:", err);
    }
}

function markVisitConverted(voucherCode) {
    try {
        const visitId = sessionStorage.getItem('forlife_current_visit_id');
        const trafficLog = JSON.parse(localStorage.getItem('forlife_traffic_log')) || [];
        const visit = visitId ? trafficLog.find(v => v.id === visitId) : trafficLog[0];
        if (visit) {
            visit.converted = true;
            visit.voucher_code = voucherCode;
            visit.dwell_seconds = getActiveDwellSeconds();
            if (currentMaxScrollDepth > (visit.scroll_depth || 0)) {
                visit.scroll_depth = currentMaxScrollDepth;
            }
        } else if (trafficLog.length > 0) {
            trafficLog[0].converted = true;
            trafficLog[0].voucher_code = voucherCode;
        }
        localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));

        if (supabaseClient && voucherCode) {
            supabaseClient.from('forlife_traffic')
                .update({ converted: true, voucher_code: voucherCode })
                .eq('voucher_code', voucherCode)
                .catch(() => {});
        }
    } catch (e) {}
}

// Métrica aleatória de vouchers disponíveis (1 a 30)
function initScarcityBadge() {
    let stored = sessionStorage.getItem('forlife_vouchers_count');
    if (!stored) {
        // Gera número consistente entre 11 e 24
        stored = Math.floor(Math.random() * 20) + 7;
        sessionStorage.setItem('forlife_vouchers_count', stored);
    }
    document.querySelectorAll('.scarcity-number').forEach(el => {
        el.textContent = stored;
    });
}

// Carregar configurações de preços (Supabase ou LocalStorage)
async function loadForlifeConfig() {
    let loadedFromCloud = false;

    if (supabaseClient) {
        try {
            const { data, error } = await supabaseClient
                .from('forlife_config')
                .select('*')
                .eq('id', 'main_config')
                .single();

            if (!error && data) {
                forlifeConfig = {
                    comboPrice: parseFloat(data.combo_price) || 297.00,
                    installments: parseInt(data.combo_installments) || 10,
                    addonAntirreflexo: parseFloat(data.addon_antirreflexo) || 100.00,
                    addonBluecut: parseFloat(data.addon_bluecut) || 100.00,
                    addonFotossensivel: parseFloat(data.addon_fotossensivel) || 150.00
                };
                loadedFromCloud = true;
            }
        } catch (e) {
            console.warn("Usando fallback de configuração local:", e);
        }
    }

    if (!loadedFromCloud) {
        const local = localStorage.getItem('forlife_config');
        if (local) {
            try {
                forlifeConfig = JSON.parse(local);
            } catch (e) {}
        }
    }
}

function formatMoney(value) {
    return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==========================================
// ATUALIZAÇÃO DA INTERFACE & CÁLCULOS
// ==========================================
function updatePricingUI() {
    const { comboPrice, installments, addonAntirreflexo, addonBluecut, addonFotossensivel } = forlifeConfig;

    // 1. Atualizar Banner 2 (Combo)
    const comboCashEl = document.getElementById('combo-cash-price');
    const comboInstCountEl = document.getElementById('combo-inst-count');
    const comboInstValEl = document.getElementById('combo-inst-val');
    
    if (comboCashEl) comboCashEl.textContent = `R$ ${formatMoney(comboPrice)}`;
    if (comboInstCountEl) comboInstCountEl.textContent = installments;
    if (comboInstValEl) comboInstValEl.textContent = `R$ ${formatMoney(comboPrice / installments)}`;

    // 2. Atualizar Banner 3 (Cards de Tecnologia)
    const priceAntirreflexoEl = document.getElementById('price-val-antirreflexo');
    const priceBluecutEl = document.getElementById('price-val-bluecut');
    const priceFotoEl = document.getElementById('price-val-fotossensivel');

    if (priceAntirreflexoEl) priceAntirreflexoEl.textContent = `+ R$ ${formatMoney(addonAntirreflexo)}`;
    if (priceBluecutEl) priceBluecutEl.textContent = `+ R$ ${formatMoney(addonBluecut)}`;
    if (priceFotoEl) priceFotoEl.textContent = `+ R$ ${formatMoney(addonFotossensivel)}`;

    // 3. Atualizar Banner 4 (Resumo)
    const summaryComboPriceEl = document.getElementById('summary-combo-price');
    if (summaryComboPriceEl) summaryComboPriceEl.textContent = `R$ ${formatMoney(comboPrice)}`;

    const addonsListContainer = document.getElementById('summary-addons-container');
    let totalAddons = 0;
    let addonsHtml = '';

    if (selectedAddons.antirreflexo) {
        totalAddons += addonAntirreflexo;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="margin-right:6px;"></i> Antirreflexo</span>
                <span>+ R$ ${formatMoney(addonAntirreflexo)}</span>
            </div>`;
    }
    if (selectedAddons.bluecut) {
        totalAddons += addonBluecut;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="margin-right:6px;"></i> Filtro Luz Azul (Bluecut)</span>
                <span>+ R$ ${formatMoney(addonBluecut)}</span>
            </div>`;
    }
    if (selectedAddons.fotossensivel) {
        totalAddons += addonFotossensivel;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="margin-right:6px;"></i> Lentes Fotossensíveis</span>
                <span>+ R$ ${formatMoney(addonFotossensivel)}</span>
            </div>`;
    }

    if (!addonsHtml) {
        addonsHtml = `
            <div class="summary-line" style="opacity: 0.75; font-style: italic;">
                <span>Nenhuma tecnologia adicional (Combo Tradicional)</span>
                <span>R$ 0,00</span>
            </div>`;
    }

    if (addonsListContainer) addonsListContainer.innerHTML = addonsHtml;

    // Total Geral
    const totalPrice = comboPrice + totalAddons;
    const instVal = totalPrice / installments;

    const summaryTotalEl = document.getElementById('summary-total-price-val');
    const summaryInstEl = document.getElementById('summary-total-inst-val');
    
    if (summaryTotalEl) summaryTotalEl.textContent = `R$ ${formatMoney(totalPrice)}`;
    if (summaryInstEl) summaryInstEl.textContent = `ou até ${installments}x de R$ ${formatMoney(instVal)} sem juros`;

    validateForm();
}

// ==========================================
// LISTENERS DE INTERAÇÃO & FORMULÁRIO
// ==========================================
function setupEventListeners() {
    // 1. Botões de "Gerar meu Voucher" direto (Combo Tradicional, ignora adicionais)
    document.querySelectorAll('.btn-trigger-traditional').forEach(btn => {
        btn.addEventListener('click', () => {
            // Desmarcar todos os adicionais
            selectedAddons.antirreflexo = false;
            selectedAddons.bluecut = false;
            selectedAddons.fotossensivel = false;

            document.querySelectorAll('.tech-card').forEach(c => {
                c.classList.remove('selected');
                const checkIcon = c.querySelector('.tech-checkbox-badge i');
                if (checkIcon) checkIcon.style.opacity = '0';
            });

            updatePricingUI();
        });
    });

    // 2. Toggle nos cards de tecnologia (Banner 3)
    const techCards = document.querySelectorAll('.tech-card');
    techCards.forEach(card => {
        card.addEventListener('click', () => {
            const key = card.getAttribute('data-addon');
            if (key in selectedAddons) {
                selectedAddons[key] = !selectedAddons[key];
                card.classList.toggle('selected', selectedAddons[key]);
                
                const checkIcon = card.querySelector('.tech-checkbox-badge i');
                if (checkIcon) {
                    checkIcon.style.opacity = selectedAddons[key] ? '1' : '0';
                }
                updatePricingUI();
            }
        });
    });

    // 2.1 Accordion Spring nos cards de tecnologia ("Conhecer o benefício")
    document.querySelectorAll('.tech-accordion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede de marcar/desmarcar o card ao clicar no accordion
            const accordion = btn.closest('.tech-accordion');
            if (accordion) {
                const isOpen = accordion.classList.contains('open');
                accordion.classList.toggle('open', !isOpen);
                btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
            }
        });
    });

    document.querySelectorAll('.tech-accordion').forEach(acc => {
        acc.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede clique no corpo do texto de desmarcar card
        });
    });

    // 3. Seleção de Situação da Receita Médica (Radio Cards)
    const radioHave = document.getElementById('recipe-option-have');
    const radioNeed = document.getElementById('recipe-option-need');
    const cardHave = document.getElementById('card-recipe-have');
    const cardNeed = document.getElementById('card-recipe-need');
    const uploadArea = document.getElementById('prescription-upload-area');

    function handleRecipeChange() {
        if (radioHave.checked) {
            cardHave.classList.add('active');
            cardNeed.classList.remove('active');
            uploadArea.style.display = 'block';
        } else if (radioNeed.checked) {
            cardNeed.classList.add('active');
            cardHave.classList.remove('active');
            uploadArea.style.display = 'none';
            prescriptionBase64 = "";
            const previewBox = document.getElementById('prescription-preview-box');
            if (previewBox) previewBox.style.display = 'none';
        }
        validateForm();
    }

    if (radioHave) radioHave.addEventListener('change', handleRecipeChange);
    if (radioNeed) radioNeed.addEventListener('change', handleRecipeChange);

    // Função assíncrona para processar e comprimir arquivo da receita
    function processPrescriptionFile(file) {
        return new Promise((resolve) => {
            if (!file) { resolve(""); return; }
            const reader = new FileReader();
            reader.onload = (event) => {
                if (file.type.startsWith('image/')) {
                    const img = new Image();
                    img.onload = () => {
                        try {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            let width = img.width;
                            let height = img.height;
                            const maxSize = 1200;

                            if (width > height) {
                                if (width > maxSize) {
                                    height = Math.round(height * (maxSize / width));
                                    width = maxSize;
                                }
                            } else {
                                if (height > maxSize) {
                                    width = Math.round(width * (maxSize / height));
                                    height = maxSize;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            resolve(canvas.toDataURL('image/jpeg', 0.82));
                        } catch (err) {
                            resolve(event.target.result);
                        }
                    };
                    img.onerror = () => resolve(event.target.result);
                    img.src = event.target.result;
                } else {
                    resolve(event.target.result);
                }
            };
            reader.onerror = () => resolve("");
            reader.readAsDataURL(file);
        });
    }

    // 4. Upload de Foto / Arquivo da Receita Médica
    const fileInput = document.getElementById('prescription-file');
    const previewBox = document.getElementById('prescription-preview-box');
    const fileNameEl = document.getElementById('prescription-file-name');

    if (fileInput) {
        fileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (previewBox && fileNameEl) {
                    fileNameEl.textContent = file.name;
                    previewBox.style.display = 'flex';
                }
                prescriptionBase64 = await processPrescriptionFile(file);
            } else {
                prescriptionBase64 = "";
                if (previewBox) previewBox.style.display = 'none';
            }
        });
    }

    // 5. Máscara de Telefone / WhatsApp
    const phoneInput = document.getElementById('client-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 11) val = val.substring(0, 11);
            
            if (val.length > 6) {
                e.target.value = `(${val.substring(0, 2)}) ${val.substring(2, 7)}-${val.substring(7)}`;
            } else if (val.length > 2) {
                e.target.value = `(${val.substring(0, 2)}) ${val.substring(2)}`;
            } else {
                e.target.value = val;
            }
            validateForm();
        });
    }

    // 6. Inputs e Validação
    ['client-name', 'client-email', 'client-city'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validateForm);
    });

    const storeSelect = document.getElementById('client-store');
    if (storeSelect) {
        storeSelect.addEventListener('change', validateForm);
    }

    populateStoresDropdown();

    // 7. Submissão do Formulário de Voucher
    const voucherForm = document.getElementById('voucher-form');
    if (voucherForm) {
        voucherForm.addEventListener('submit', handleVoucherSubmit);
    }
}

// Preencher dropdown de lojas com lojas cadastradas no ADM
function populateStoresDropdown() {
    const select = document.getElementById('client-store');
    if (!select) return;

    let stores = [
        "Ótica Conceição - Matriz: Rua Dr. Mascarenhas, 246 - Botafogo",
        "Ótica Conceição I: Rua Barão de Jaguara, 1084 - Centro",
        "Ótica Conceição II: Rua Barão de Jaguara, 1109 - Centro"
    ];

    const stored = localStorage.getItem('forlife_stores');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
                stores = parsed;
            }
        } catch (e) {}
    }

    select.innerHTML = '<option value="" disabled selected>Selecione a loja onde quer ir...</option>';
    stores.forEach(st => {
        const opt = document.createElement('option');
        opt.value = st;
        opt.textContent = st;
        select.appendChild(opt);
    });
}

// Validar formulário
function validateForm() {
    const name = document.getElementById('client-name')?.value.trim() || '';
    const phone = (document.getElementById('client-phone')?.value || '').replace(/\D/g, '');
    const city = document.getElementById('client-city')?.value.trim() || '';
    const email = document.getElementById('client-email')?.value.trim() || '';
    const store = document.getElementById('client-store')?.value.trim() || '';
    
    const radioHave = document.getElementById('recipe-option-have')?.checked;
    const radioNeed = document.getElementById('recipe-option-need')?.checked;
    const hasRecipeChoice = radioHave || radioNeed;

    const submitBtn = document.getElementById('btn-submit-voucher');
    const isValid = name.length >= 3 && phone.length >= 10 && city.length >= 2 && email.includes('@') && hasRecipeChoice && store.length > 0;

    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
    return isValid;
}

// ==========================================
// FAQ ACCORDION
// ==========================================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const q = item.querySelector('.faq-question');
        if (q) {
            q.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });
}

// ==========================================
// BOTÃO VOLTAR AO TOPO
// ==========================================
function setupScrollTop() {
    const btn = document.getElementById('scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 350) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================
// GERAÇÃO E PERSISTÊNCIA DO VOUCHER
// ==========================================
async function handleVoucherSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById('btn-submit-voucher');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Voucher Oficial...';

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email').value.trim();
    const city = document.getElementById('client-city').value.trim();
    const store = document.getElementById('client-store')?.value.trim() || '';
    
    const hasPrescription = document.getElementById('recipe-option-have').checked;
    const recipeStatusText = hasPrescription ? 'Possuo receita' : 'Preciso atualizar';

    // Garantir que a imagem da receita esteja processada caso o envio seja rápido
    const fileInputEl = document.getElementById('prescription-file');
    if (hasPrescription && !prescriptionBase64 && fileInputEl && fileInputEl.files && fileInputEl.files[0]) {
        try {
            prescriptionBase64 = await processPrescriptionFile(fileInputEl.files[0]);
        } catch(e) {
            console.warn("Aviso ao processar arquivo da receita:", e);
        }
    }

    // Resumo dos adicionais
    const addonsArray = [];
    let totalAddons = 0;

    if (selectedAddons.antirreflexo) {
        addonsArray.push({ name: 'Antirreflexo', price: forlifeConfig.addonAntirreflexo });
        totalAddons += forlifeConfig.addonAntirreflexo;
    }
    if (selectedAddons.bluecut) {
        addonsArray.push({ name: 'Filtro Luz Azul (Bluecut)', price: forlifeConfig.addonBluecut });
        totalAddons += forlifeConfig.addonBluecut;
    }
    if (selectedAddons.fotossensivel) {
        addonsArray.push({ name: 'Lentes Fotossensíveis', price: forlifeConfig.addonFotossensivel });
        totalAddons += forlifeConfig.addonFotossensivel;
    }

    const totalPrice = forlifeConfig.comboPrice + totalAddons;
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const voucherCode = `FORLIFE-${randomHex}`;

    // Apenas data (DD/MM/AAAA) sem a hora, conforme solicitado
    const todayFormatted = new Date().toLocaleDateString('pt-BR');

    // Rastreabilidade de Origem (UTM TikTok, Meta, etc.)
    const utm = getActiveUtm();
    markVisitConverted(voucherCode);
    const hasUtm = utm.source && utm.source !== 'Direto / Orgânico';
    const utmInfo = hasUtm ? `${utm.source}${utm.campaign ? ' / ' + utm.campaign : ''}` : '';

    const visitorLoc = (() => {
        try { return JSON.parse(sessionStorage.getItem('forlife_visitor_location') || '{}'); } catch(e) { return {}; }
    })();

    const leadData = {
        date: todayFormatted,
        name: name,
        phone: phone,
        email: email,
        city: city,
        store: store,
        comboPrice: forlifeConfig.comboPrice,
        addons: addonsArray,
        totalPrice: totalPrice,
        hasPrescription: hasPrescription,
        recipeStatus: recipeStatusText,
        prescriptionFile: prescriptionBase64,
        code: voucherCode,
        seller: '',
        saleValue: '',
        osNumber: '',
        utmSource: utm.source || 'Direto',
        utmCampaign: utm.campaign || 'Geral',
        utmMedium: utm.medium || '',
        dwellSeconds: getActiveDwellSeconds(),
        scrollDepth: currentMaxScrollDepth,
        neighborhood: visitorLoc.neighborhood || '',
        latitude: visitorLoc.latitude || null,
        longitude: visitorLoc.longitude || null
    };

    // 1. Gravar no Supabase (Tabela forlife_leads)
    if (supabaseClient) {
        try {
            const cityWithStore = store ? `${city} (Loja: ${store})` : city;
            const cityWithUtm = hasUtm ? `${cityWithStore} [${utmInfo}]` : cityWithStore;

            // Tentar primeiro com a coluna store nativa
            let res = await supabaseClient.from('forlife_leads').insert([{
                name: name,
                phone: phone,
                email: email,
                city: cityWithUtm,
                store: store,
                combo_price: forlifeConfig.comboPrice,
                addons: JSON.stringify(addonsArray),
                total_price: totalPrice,
                has_prescription: hasPrescription,
                prescription_file: prescriptionBase64 || '',
                code: voucherCode
            }]);

            // Se falhou porque a coluna 'store' não existe no banco, salvar com fallback seguro embutido na cidade
            if (res.error && (res.error.code === 'PGRST204' || (res.error.message && res.error.message.includes('store')))) {
                console.warn("Coluna 'store' não detectada no Supabase. Usando armazenamento compatível embutido...");
                res = await supabaseClient.from('forlife_leads').insert([{
                    name: name,
                    phone: phone,
                    email: email,
                    city: cityWithUtm,
                    combo_price: forlifeConfig.comboPrice,
                    addons: JSON.stringify(addonsArray),
                    total_price: totalPrice,
                    has_prescription: hasPrescription,
                    prescription_file: prescriptionBase64 || '',
                    code: voucherCode
                }]);
            }

            if (res.error) {
                console.error("Erro ao salvar lead no Supabase:", res.error);
            } else {
                console.log("Lead salvo com sucesso no Supabase!");
            }
        } catch (err) {
            console.warn("Erro ao salvar no Supabase, mantendo cópia local:", err);
        }
    }

    // 2. Gravar no LocalStorage
    const localLeads = JSON.parse(localStorage.getItem('forlife_leads')) || [];
    localLeads.push(leadData);
    localStorage.setItem('forlife_leads', JSON.stringify(localLeads));

    // 3. Montar Mensagem de WhatsApp
    const storePhone = '5519978056552';
    const addonsText = addonsArray.length > 0 
        ? addonsArray.map(a => `  • ${a.name} (+ R$ ${formatMoney(a.price)})`).join('\n')
        : '  • Combo Tradicional (Sem adicionais)';

    const utmNotice = hasUtm 
        ? `🎯 *Origem:* Anúncio ${utm.source.toUpperCase()}${utm.campaign ? ' (' + utm.campaign + ')' : ''}\n` 
        : '';

    const messageText = 
`Olá, Ópticas Conceição! Acabei de gerar meu voucher exclusivo ForLife no site.\n\n` +
`🎫 *Código do Voucher:* ${voucherCode}\n` +
`👤 *Nome:* ${name}\n` +
`📍 *Cidade:* ${city}\n` +
`🏪 *Loja Escolhida:* ${store}\n` +
`📞 *WhatsApp:* ${phone}\n\n` +
utmNotice +
`👓 *Combo:* Óculos Completo (Armação + Lentes Multifocais HD)\n` +
`💰 *Valor Combo Base:* R$ ${formatMoney(forlifeConfig.comboPrice)}\n\n` +
`⚡ *Tecnologia:*\n${addonsText}\n\n` +
`💵 *Total:* R$ ${formatMoney(totalPrice)} (em até ${forlifeConfig.installments}x de R$ ${formatMoney(totalPrice / forlifeConfig.installments)} sem juros)\n` +
`📋 *Situação da Receita:* ${recipeStatusText}\n\n` +
`Gostaria de garantir as condições do meu voucher e agendar meu atendimento!`;

    const whatsappBtn = document.getElementById('btn-whatsapp-voucher');
    if (whatsappBtn) {
        whatsappBtn.href = `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodeURIComponent(messageText)}`;
        whatsappBtn.onclick = () => {
            if (typeof fbq === 'function') {
                try {
                    fbq('track', 'Contact', { content_name: 'WhatsApp Atendimento ForLife' });
                } catch (e) {}
            }
        };
    }

    // 4. Disparar Eventos Lead e CompleteRegistration no Meta Pixel com Correspondência Avançada
    if (typeof fbq === 'function') {
        try {
            const cleanPhone = (phone || '').replace(/\D/g, '');
            const phoneFormatted = cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone;
            const nameParts = (name || '').trim().split(/\s+/);
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';

            // Correspondência Avançada de Dados (Advanced Matching) para potencializar anúncios no Facebook
            fbq('init', '2904508746602007', {
                fn: firstName.toLowerCase(),
                ln: lastName.toLowerCase(),
                ph: phoneFormatted,
                ct: (city || '').toLowerCase()
            });

            fbq('track', 'Lead', {
                content_name: 'Combo ForLife',
                currency: 'BRL',
                value: totalPrice
            });
            fbq('track', 'CompleteRegistration', {
                content_name: 'Combo ForLife - Voucher Resgatado',
                currency: 'BRL',
                value: totalPrice,
                status: true
            });
        } catch (e) {
            console.warn('Erro ao registrar eventos fbq no Meta Pixel:', e);
        }
    }

    // 5. Exibir Tela de Sucesso
    document.getElementById('voucher-code-display').textContent = voucherCode;
    document.getElementById('voucher-user-name').textContent = name.split(' ')[0];
    
    document.getElementById('form-inputs-container').style.display = 'none';
    const successBox = document.getElementById('voucher-success-box');
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Verificação de URL para teste de eventos do Meta Pixel (ex: ?complete_registration=1 ou #voucher-success)
try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('complete_registration') || window.location.hash === '#voucher-success') {
        if (typeof fbq === 'function') {
            fbq('track', 'CompleteRegistration', {
                content_name: 'Combo ForLife - Teste Inscrição',
                status: true
            });
        }
    }
} catch (e) {}

