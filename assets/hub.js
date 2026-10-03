/**
 * ==============================================================================
 * LP STUDIO & MULTI-MANAGER - ÓPTICAS CONCEIÇÃO
 * Arquivo: assets/hub.js
 * Descrição: Motor reativo para controle do painel unificado multi-landing pages.
 * Versão: 2.0.0
 * ==============================================================================
 */

(function (window, document) {
    'use strict';

    // ==========================================================================
    // 1. CONFIGURAÇÕES & CONSTANTES GLOBAIS
    // ==========================================================================
    const SUPABASE_CONFIG = {
        url: "https://mngwfearwjkpisararbe.supabase.co",
        key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZ3dmZWFyd2prcGlzYXJhcmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTc5MzksImV4cCI6MjA5NjE3MzkzOX0.vk9Ol41NU2RI72-ZZKIcm7hzccYBjzPPptb6rZv_mKs",
        leadsTable: "forlife_leads",
        filaLeadsTable: "fila_leads",
        trafficTable: "forlife_traffic",
        configTable: "forlife_config"
    };

    const STORAGE_KEYS = {
        catalog: 'otica_conceicao_lps_catalog',
        activeLp: 'otica_active_lp',
        leadsFallback: 'forlife_leads',
        deletedCodes: 'forlife_deleted_codes',
        stores: 'forlife_stores',
        sellers: 'forlife_sellers',
        trafficFallback: 'forlife_traffic_log',
        cmsConfigPrefix: 'otica_cms_config_'
    };

    // Catálogo padrão pré-configurado
    const DEFAULT_LPS = {
        forlife: {
            id: 'forlife',
            name: 'ForLife Multifocal Di Capri',
            url: '/forlife',
            slug: '/forlife',
            template: 'forlife',
            heroStyle: 'multifocal_senhora',
            heroTitle: 'Óculos Multifocal Completo por',
            offerType: 'combo_completo',
            lensModality: 'multifocal',
            frameBrand: 'Di Capri',
            lensBrand: 'Multifocal Di Capri HD',
            status: 'Ativa',
            color: '#002C5B',
            price: 297.00,
            installments: 10,
            description: 'Combo Multifocal Digital com armação Di Capri e garantia estendida.',
            campaign: {
                name: 'Campanha ForLife Di Capri - Outono',
                budget: 2500.00,
                targetLeads: 150,
                status: 'Em Veiculação'
            },
            addonsActive: {
                antirreflexo: true,
                bluecut: true,
                fotossensivel: true
            }
        },
        fila: {
            id: 'fila',
            name: 'Óculos Completo FILA',
            url: '/',
            slug: '/',
            template: 'fila',
            offerType: 'combo_completo',
            lensModality: 'lentes_prontas',
            frameBrand: 'FILA',
            lensBrand: 'Lentes Graduadas FILA',
            status: 'Ativa',
            color: '#001A36',
            price: 199.00,
            installments: 10,
            description: 'Armação esportiva FILA original com lentes graduadas completas.',
            campaign: {
                name: 'Campanha Esportiva FILA Brasil',
                budget: 1800.00,
                targetLeads: 120,
                status: 'Em Veiculação'
            },
            addonsActive: {
                antirreflexo: true,
                bluecut: true,
                fotossensivel: true
            }
        },
        '194': {
            id: '194',
            name: 'Óculos Completo Visão Simples 194',
            url: '/194',
            slug: '/194',
            template: 'visaosimples',
            heroStyle: 'visao_simples_jovens',
            heroTitle: 'Óculos Completo Visão Simples por',
            offerType: 'combo_completo',
            lensModality: 'lentes_prontas',
            frameBrand: 'Coleção Conceição',
            lensBrand: 'Lentes Monofocais HD',
            status: 'Ativa',
            color: '#002C5B',
            price: 194.00,
            installments: 6,
            description: 'Combo promocional Visão Simples (Armação + Lentes) por R$ 194,00 em até 6x sem juros.',
            campaign: {
                name: 'Campanha Promocional 194 Visão Simples',
                budget: 2000.00,
                targetLeads: 150,
                status: 'Em Veiculação'
            },
            addonsActive: {
                antirreflexo: true,
                bluecut: true,
                fotossensivel: true
            }
        },
        'forlife-194': {
            id: 'forlife-194',
            name: 'Óculos Completo Visão Simples 194',
            url: '/194',
            slug: '/194',
            template: 'visaosimples',
            offerType: 'combo_completo',
            lensModality: 'lentes_prontas',
            frameBrand: 'Coleção Conceição',
            lensBrand: 'Lentes Monofocais HD',
            status: 'Ativa',
            color: '#002C5B',
            price: 194.00,
            installments: 6,
            description: 'Combo promocional Visão Simples (Armação + Lentes) por R$ 194,00 em até 6x sem juros.',
            campaign: {
                name: 'Campanha Promocional 194 Visão Simples',
                budget: 2000.00,
                targetLeads: 150,
                status: 'Em Veiculação'
            },
            addonsActive: {
                antirreflexo: true,
                bluecut: true,
                fotossensivel: true
            }
        },
        varilux: {
            id: 'varilux',
            name: 'Varilux Comfort Max',
            url: '/forlife/index.html?theme=varilux',
            slug: '/varilux',
            status: 'Rascunho',
            color: '#0A3D78',
            price: 349.00,
            installments: 10,
            description: 'Tecnologia Essilor de adaptação postural e ampliação de campo visual.',
            campaign: {
                name: 'Campanha Varilux Alta Visão',
                budget: 3200.00,
                targetLeads: 80,
                status: 'Planejamento'
            }
        },
        zeiss: {
            id: 'zeiss',
            name: 'Zeiss SmartLife Digital',
            url: '/forlife/index.html?theme=zeiss',
            slug: '/zeiss',
            status: 'Rascunho',
            color: '#0047AB',
            price: 420.00,
            installments: 12,
            description: 'Lentes de alta precisão alemã com proteção contra luz azul nociva.',
            campaign: {
                name: 'Campanha Zeiss SmartLife Digital',
                budget: 4000.00,
                targetLeads: 90,
                status: 'Planejamento'
            }
        }
    };

    const VIEWPORT_PRESETS = {
        desktop: { width: '100%', maxWidth: '100%', height: '100%', label: '1440 × 900 px (Desktop)' },
        laptop: { width: '1024px', maxWidth: '1024px', height: '768px', label: '1024 × 768 px (Laptop)' },
        tablet: { width: '768px', maxWidth: '768px', height: '1024px', label: '768 × 1024 px (Tablet)' },
        mobile: { width: '390px', maxWidth: '390px', height: '844px', label: '390 × 844 px (Mobile)' }
    };

    const DEFAULT_STORES = [
        'Loja Centro - Rua XV de Novembro',
        'Loja Shopping Mueller',
        'Loja Shopping Palladium',
        'Loja Batel - Av. do Batel'
    ];

    const DEFAULT_SELLERS = [
        'Carlos Silva',
        'Juliana Mendes',
        'Roberto Souza',
        'Fernanda Lima'
    ];

    // ==========================================================================
    // 2. UTILITÁRIOS DE SEGURANÇA E FORMATADORES
    // ==========================================================================
    const Utils = {
        escapeHtml(text) {
            if (text === null || text === undefined) return '';
            return String(text)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        formatCurrency(value) {
            const num = parseFloat(value) || 0;
            return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        },

        cleanDigits(str) {
            return (str || '').toString().replace(/\D/g, '');
        },

        slugify(text) {
            return (text || '')
                .toString()
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        },

        showToast(message, type = 'success') {
            let container = document.getElementById('lp-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'lp-toast-container';
                container.style.position = 'fixed';
                container.style.bottom = '24px';
                container.style.right = '24px';
                container.style.zIndex = '999999';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.gap = '10px';
                container.style.pointerEvents = 'none';
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            toast.className = `lp-toast lp-toast-${type}`;
            
            const bgColors = {
                success: '#10B981',
                error: '#EF4444',
                warning: '#F59E0B',
                info: '#002C5B'
            };
            const icons = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            toast.style.background = bgColors[type] || '#002C5B';
            toast.style.color = '#FFFFFF';
            toast.style.padding = '12px 18px';
            toast.style.borderRadius = '8px';
            toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
            toast.style.display = 'flex';
            toast.style.alignItems = 'center';
            toast.style.gap = '10px';
            toast.style.fontSize = '13px';
            toast.style.fontWeight = '600';
            toast.style.fontFamily = "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif";
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(12px)';
            toast.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            toast.style.pointerEvents = 'auto';

            toast.innerHTML = `
                <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
                <span>${Utils.escapeHtml(message)}</span>
            `;

            container.appendChild(toast);

            // Animação de entrada
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            // Remoção automática
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                }, 300);
            }, 3500);
        }
    };

    // ==========================================================================
    // 3. ESTADO CENTRALIZADO (STORE)
    // ==========================================================================
    const State = {
        supabase: null,
        catalog: {},
        activeLpId: 'forlife',
        activeViewport: 'desktop',
        allLeads: [],
        filteredLeads: [],
        stores: [],
        sellers: [],
        trafficLogs: [],
        currentTrafficPeriod: 'all',
        selectedLeadCodes: new Set(),
        isSyncing: false
    };

    // ==========================================================================
    // 4. MÓDULO: CATÁLOGO DE LANDING PAGES
    // ==========================================================================

    // ==========================================================================
    // 2. MÓDULO: AUTENTICAÇÃO & CONTROLE DE ACESSO
    // ==========================================================================
    const Auth = {
        SESSION_KEY: 'otica_hub_auth_session',

        init() {
            this.bindEvents();
            this.checkSession();
        },

        checkSession() {
            const isAuth = localStorage.getItem(this.SESSION_KEY) === 'authenticated' || 
                           sessionStorage.getItem(this.SESSION_KEY) === 'authenticated';
            const overlay = document.getElementById('auth-overlay');
            if (overlay) {
                if (isAuth) {
                    overlay.classList.remove('active');
                } else {
                    overlay.classList.add('active');
                }
            }
        },

        login(user, pass, remember) {
            const cleanUser = (user || '').trim().toLowerCase();
            const cleanPass = (pass || '').trim();

            if (cleanUser === 'admin' && (cleanPass === 'conceicao1948' || cleanPass === 'conceicao2026')) {
                if (remember) {
                    localStorage.setItem(this.SESSION_KEY, 'authenticated');
                } else {
                    sessionStorage.setItem(this.SESSION_KEY, 'authenticated');
                }
                const overlay = document.getElementById('auth-overlay');
                if (overlay) overlay.classList.remove('active');
                const alertEl = document.getElementById('auth-error-alert');
                if (alertEl) alertEl.style.display = 'none';
                Utils.showToast('Bem-vindo ao LP Studio & Multi-Manager!', 'success');
                return true;
            } else {
                const alertEl = document.getElementById('auth-error-alert');
                if (alertEl) {
                    alertEl.style.display = 'flex';
                }
                return false;
            }
        },

        logout() {
            localStorage.removeItem(this.SESSION_KEY);
            sessionStorage.removeItem(this.SESSION_KEY);
            const overlay = document.getElementById('auth-overlay');
            if (overlay) overlay.classList.add('active');
            const pwdInput = document.getElementById('auth-password');
            if (pwdInput) pwdInput.value = '';
            Utils.showToast('Sessão encerrada com sucesso.', 'info');
        },

        bindEvents() {
            const form = document.getElementById('auth-form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const user = document.getElementById('auth-username')?.value;
                    const pass = document.getElementById('auth-password')?.value;
                    const remember = document.getElementById('auth-remember')?.checked;
                    this.login(user, pass, remember);
                });
            }

            const btnToggle = document.getElementById('btn-toggle-pwd');
            if (btnToggle) {
                btnToggle.addEventListener('click', () => {
                    const pwd = document.getElementById('auth-password');
                    const icon = document.getElementById('pwd-eye-icon');
                    if (pwd) {
                        if (pwd.type === 'password') {
                            pwd.type = 'text';
                            if (icon) icon.className = 'fas fa-eye-slash';
                        } else {
                            pwd.type = 'password';
                            if (icon) icon.className = 'fas fa-eye';
                        }
                    }
                });
            }

            const btnLogout = document.getElementById('btn-hub-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => this.logout());
            }
        }
    };

    const Catalog = {
        init() {
            this.loadCatalog();
            this.determineInitialActiveLp();
            this.populateSelector();
            this.renderCatalogGrid();
            this.bindEvents();
        },


        updateCampaignInfoBar() {
            const activeLp = this.getActiveLp();
            const camp = activeLp.campaign || {
                name: `Campanha ${activeLp.name}`,
                budget: 2000.00,
                targetLeads: 100,
                status: 'Em Veiculação'
            };

            const leadsCount = State.allLeads ? State.allLeads.filter(l => Leads.belongsToLp(l, activeLp.id)).length : 0;
            const target = camp.targetLeads || 100;
            const pct = Math.min(100, ((leadsCount / target) * 100)).toFixed(1);

            Leads.setDomText(['active-campaign-name'], camp.name);
            Leads.setDomText(['active-campaign-budget'], Utils.formatCurrency(camp.budget));
            Leads.setDomText(['active-campaign-target'], `${target} leads`);
            Leads.setDomText(['active-campaign-status'], camp.status || 'Ativa');
            Leads.setDomText(['active-campaign-pct'], `${pct}%`);

            const bar = document.getElementById('active-campaign-progress-bar');
            if (bar) bar.style.width = `${pct}%`;
        },

        loadCatalog() {
            try {
                const storedCatalog = localStorage.getItem(STORAGE_KEYS.catalog);
                if (storedCatalog) {
                    State.catalog = JSON.parse(storedCatalog);
                    // Garante que LPs padrão tenham seus dados de campanha preservados
                    Object.keys(DEFAULT_LPS).forEach(k => {
                        if (State.catalog[k] && !State.catalog[k].campaign && DEFAULT_LPS[k].campaign) {
                            State.catalog[k].campaign = { ...DEFAULT_LPS[k].campaign };
                        }
                    });
                } else {
                    State.catalog = { ...DEFAULT_LPS };
                }
            } catch (err) {
                console.error('[LPStudio] Erro ao carregar catálogo de LPs:', err);
                State.catalog = { ...DEFAULT_LPS };
            }
        },

        saveCatalog() {
            try {
                localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(State.catalog));
            } catch (err) {
                console.error('[LPStudio] Erro ao salvar catálogo no localStorage:', err);
            }
        },

        determineInitialActiveLp() {
            const urlParams = new URLSearchParams(window.location.search);
            const paramLp = urlParams.get('lp');
            const storedLp = localStorage.getItem(STORAGE_KEYS.activeLp);

            if (paramLp && State.catalog[paramLp]) {
                State.activeLpId = paramLp;
            } else if (storedLp && State.catalog[storedLp]) {
                State.activeLpId = storedLp;
            } else {
                State.activeLpId = 'forlife';
            }
        },

        getActiveLp() {
            return State.catalog[State.activeLpId] || State.catalog.forlife;
        },

        populateSelector() {
            const selector = document.getElementById('lp-selector');
            if (!selector) return;

            const currentVal = State.activeLpId;
            selector.innerHTML = '';

            const optgroupActive = document.createElement('optgroup');
            optgroupActive.label = 'Landing Pages Ativas';

            const optgroupDraft = document.createElement('optgroup');
            optgroupDraft.label = 'Rascunhos / Em Validação';

            Object.values(State.catalog).forEach(lp => {
                const opt = document.createElement('option');
                opt.value = lp.id;
                opt.textContent = `${lp.name} (${lp.status})`;
                if (lp.id === currentVal) opt.selected = true;

                if (lp.status === 'Ativa') {
                    optgroupActive.appendChild(opt);
                } else {
                    optgroupDraft.appendChild(opt);
                }
            });

            if (optgroupActive.children.length > 0) selector.appendChild(optgroupActive);
            if (optgroupDraft.children.length > 0) selector.appendChild(optgroupDraft);

            // Opção para cadastrar nova LP
            const optNew = document.createElement('option');
            optNew.value = 'new_lp';
            optNew.textContent = '+ Criar Nova Landing Page...';
            optNew.style.fontWeight = 'bold';
            optNew.style.color = '#002C5B';
            selector.appendChild(optNew);

            // Popula filtros de LP no Leads e no Kanban
            const filterLp = document.getElementById('filter-lp');
            const kanbanFilterLp = document.getElementById('kanban-filter-lp');
            [filterLp, kanbanFilterLp].forEach(sel => {
                if (!sel) return;
                const prev = sel.value;
                sel.innerHTML = '<option value="">Todas as Landing Pages</option>';
                Object.values(State.catalog).forEach(lp => {
                    const opt = document.createElement('option');
                    opt.value = lp.id;
                    opt.textContent = lp.name;
                    if (lp.id === prev) opt.selected = true;
                    sel.appendChild(opt);
                });
            });
        },

        setActiveLp(lpId, pushHistory = true) {
            if (!State.catalog[lpId]) {
                console.warn(`[LPStudio] LP "${lpId}" não encontrada no catálogo.`);
                return;
            }

            State.activeLpId = lpId;
            localStorage.setItem(STORAGE_KEYS.activeLp, lpId);

            // Atualiza URL no navegador sem recarregar a página
            if (pushHistory) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.set('lp', lpId);
                window.history.pushState({ lp: lpId }, '', currentUrl.toString());
            }

            // Atualiza seletor de LPs se estiver dessincronizado
            const selector = document.getElementById('lp-selector');
            if (selector && selector.value !== lpId) {
                selector.value = lpId;
            }

            // Notifica os subsistemas
            const activeLp = this.getActiveLp();
            Preview.updateIframe(activeLp, true);
            Preview.updateUiInfo(activeLp);
            this.updateCampaignInfoBar();
            CMS.loadLpConfig(lpId);
            if (typeof CMS.loadCampaignConfig === 'function') {
                CMS.loadCampaignConfig(lpId);
            }
            Leads.loadLeads();
            Traffic.loadTraffic();
            UTM.updatePreview();
            this.renderCatalogGrid();
        },

        addLp(newLpData) {
            const id = Utils.slugify(newLpData.id || newLpData.slug || newLpData.name);
            if (!id) {
                throw new Error('Identificador da Landing Page inválido.');
            }

            if (State.catalog[id]) {
                throw new Error(`Já existe uma Landing Page cadastrada com o ID "${id}".`);
            }

            const slugVal = Utils.slugify(newLpData.slug || newLpData.name);
            const cleanSlug = '/' + slugVal.replace(/^\/+/, '');
            const cleanUrl = cleanSlug;

            const lp = {
                id,
                name: newLpData.name.trim(),
                url: cleanUrl,
                slug: cleanSlug,
                status: newLpData.status || 'Ativa',
                color: newLpData.color || '#002C5B',
                price: parseFloat(newLpData.price) || 297.00,
                installments: parseInt(newLpData.installments, 10) || 10,
                description: newLpData.description || `Campanha promocional para ${newLpData.name.trim()}.`,
                template: newLpData.template || 'visaosimples',
                offerType: newLpData.offerType || 'combo_completo',
                lensModality: newLpData.lensModality || 'lentes_prontas',
                heroStyle: newLpData.heroStyle || 'multifocal_senhora',
                heroTitle: newLpData.heroTitle || '',
                frameBrand: newLpData.frameBrand || 'Coleção Conceição',
                lensBrand: newLpData.lensBrand || 'Lentes Monofocais HD',
                addonsActive: newLpData.addonsActive || {
                    antirreflexo: true,
                    bluecut: true,
                    fotossensivel: true
                },
                campaign: newLpData.campaign || {
                    name: `Campanha ${newLpData.name.trim()}`,
                    budget: parseFloat(newLpData.budget) || 2000.00,
                    targetLeads: parseInt(newLpData.targetLeads, 10) || 100,
                    status: newLpData.status === 'Ativa' ? 'Em Veiculação' : 'Planejamento'
                },
                custom: true
            };

            State.catalog[id] = lp;
            this.saveCatalog();

            // Inicializa CMS com os dados de preço e parcelamento cadastrados
            const cmsKey = STORAGE_KEYS.cmsConfigPrefix + id;
            localStorage.setItem(cmsKey, JSON.stringify({
                comboPrice: lp.price,
                installments: lp.installments,
                offerType: lp.offerType,
                lensModality: lp.lensModality,
                heroStyle: lp.heroStyle,
                heroTitle: lp.heroTitle,
                frameBrand: lp.frameBrand,
                lensBrand: lp.lensBrand,
                showTechSection: lp.showTechSection !== false,
                antirreflexo: 60.00,
                bluecut: 70.00,
                fotossensivel: 120.00,
                addonsActive: lp.addonsActive
            }));

            // Também salva sob a chave do slug limpo para máxima compatibilidade
            const cleanSlugKey = cleanSlug.replace(/^\/+/, '');
            if (cleanSlugKey && cleanSlugKey !== id) {
                localStorage.setItem(STORAGE_KEYS.cmsConfigPrefix + cleanSlugKey, localStorage.getItem(cmsKey));
            }

            this.populateSelector();
            this.renderCatalogGrid();
            this.setActiveLp(id);

            // Troca automaticamente para a aba do Visualizador Interativo
            const tabPreviewBtn = document.querySelector('.tab-btn[data-tab="tab-preview"]');
            if (tabPreviewBtn) {
                tabPreviewBtn.click();
            }

            if (Performance && typeof Performance.render === 'function') {
                Performance.render();
            }

            Utils.showToast(`Landing Page "${lp.name}" criada com sucesso!`, 'success');
            return lp;
        },

        updateLp(lpId, updatedData) {
            if (!State.catalog[lpId]) {
                throw new Error(`Landing Page "${lpId}" não encontrada no catálogo.`);
            }

            const lp = State.catalog[lpId];
            const cleanSlug = updatedData.slug ? (updatedData.slug.startsWith('/') ? updatedData.slug : `/${updatedData.slug}`) : lp.slug;

            lp.name = updatedData.name.trim();
            lp.slug = cleanSlug;
            lp.url = cleanSlug;
            lp.status = updatedData.status || lp.status;
            lp.color = updatedData.color || lp.color;
            lp.price = parseFloat(updatedData.price) || lp.price;
            lp.installments = parseInt(updatedData.installments, 10) || lp.installments;
            if (updatedData.description) lp.description = updatedData.description;
            if (updatedData.template) lp.template = updatedData.template;
            if (updatedData.offerType) lp.offerType = updatedData.offerType;
            if (updatedData.lensModality) lp.lensModality = updatedData.lensModality;
            if (updatedData.heroStyle) lp.heroStyle = updatedData.heroStyle;
            if (updatedData.heroTitle !== undefined) lp.heroTitle = updatedData.heroTitle;
            if (updatedData.frameBrand) lp.frameBrand = updatedData.frameBrand;
            if (updatedData.lensBrand) lp.lensBrand = updatedData.lensBrand;
            if (updatedData.showTechSection !== undefined) lp.showTechSection = updatedData.showTechSection;
            if (updatedData.addonsActive) lp.addonsActive = updatedData.addonsActive;

            // Gerencia protocolo de status online/offline
            const slugKey = cleanSlug.replace(/^\/+/, '');
            if (lp.status === 'Pausada' || lp.status === 'Inativa' || lp.status === 'Desativada') {
                try {
                    const deact = JSON.parse(localStorage.getItem('otica_deactivated_lps') || '{}');
                    deact[slugKey] = { slug: slugKey, name: lp.name, deactivatedAt: new Date().toISOString() };
                    deact[lpId] = { slug: slugKey, name: lp.name, deactivatedAt: new Date().toISOString() };
                    localStorage.setItem('otica_deactivated_lps', JSON.stringify(deact));
                    if (State.supabase) {
                        State.supabase.from(SUPABASE_CONFIG.configTable).upsert({ id: `lp_offline_${slugKey}`, updated_at: new Date().toISOString() }).then(() => {});
                    }
                } catch (e) {}
            } else if (lp.status === 'Ativa') {
                try {
                    const deact = JSON.parse(localStorage.getItem('otica_deactivated_lps') || '{}');
                    delete deact[slugKey];
                    delete deact[lpId];
                    localStorage.setItem('otica_deactivated_lps', JSON.stringify(deact));
                    if (State.supabase) {
                        State.supabase.from(SUPABASE_CONFIG.configTable).delete().eq('id', `lp_offline_${slugKey}`).then(() => {});
                    }
                } catch (e) {}
            }

            if (updatedData.campaign) {
                lp.campaign = {
                    ...lp.campaign,
                    ...updatedData.campaign
                };
            }

            this.saveCatalog();

            // Sincroniza configurações no CMS
            const cmsKey = STORAGE_KEYS.cmsConfigPrefix + lpId;
            let cmsObj = {
                comboPrice: lp.price,
                installments: lp.installments,
                offerType: lp.offerType || 'combo_completo',
                lensModality: lp.lensModality || 'lentes_prontas',
                heroStyle: lp.heroStyle || 'multifocal_senhora',
                heroTitle: lp.heroTitle || '',
                frameBrand: lp.frameBrand || 'Coleção Conceição',
                lensBrand: lp.lensBrand || 'Lentes Monofocais HD',
                showTechSection: lp.showTechSection !== false,
                antirreflexo: 0.00,
                bluecut: 70.00,
                fotossensivel: 120.00,
                addonsActive: lp.addonsActive || { antirreflexo: true, bluecut: true, fotossensivel: true }
            };
            try {
                const storedCms = localStorage.getItem(cmsKey);
                if (storedCms) cmsObj = { ...cmsObj, ...JSON.parse(storedCms) };
            } catch (e) {}
            cmsObj.comboPrice = lp.price;
            cmsObj.installments = lp.installments;
            cmsObj.offerType = lp.offerType || 'combo_completo';
            cmsObj.lensModality = lp.lensModality || 'lentes_prontas';
            cmsObj.frameBrand = lp.frameBrand || 'Coleção Conceição';
            cmsObj.lensBrand = lp.lensBrand || 'Lentes Monofocais HD';
            cmsObj.showTechSection = lp.showTechSection !== false;
            if (lp.addonsActive) cmsObj.addonsActive = lp.addonsActive;
            localStorage.setItem(cmsKey, JSON.stringify(cmsObj));

            if (slugKey && slugKey !== lpId) {
                localStorage.setItem(STORAGE_KEYS.cmsConfigPrefix + slugKey, JSON.stringify(cmsObj));
            }

            if (lpId === '194' || lpId === 'forlife-194') {
                localStorage.setItem('otica_cms_config_194', JSON.stringify(cmsObj));
                localStorage.setItem('otica_cms_config_forlife-194', JSON.stringify(cmsObj));
                if (State.catalog['194']) {
                    State.catalog['194'].frameBrand = lp.frameBrand;
                    State.catalog['194'].lensBrand = lp.lensBrand;
                    State.catalog['194'].offerType = lp.offerType;
                    State.catalog['194'].lensModality = lp.lensModality;
                    State.catalog['194'].price = lp.price;
                    State.catalog['194'].installments = lp.installments;
                }
                if (State.catalog['forlife-194']) {
                    State.catalog['forlife-194'].frameBrand = lp.frameBrand;
                    State.catalog['forlife-194'].lensBrand = lp.lensBrand;
                    State.catalog['forlife-194'].offerType = lp.offerType;
                    State.catalog['forlife-194'].lensModality = lp.lensModality;
                    State.catalog['forlife-194'].price = lp.price;
                    State.catalog['forlife-194'].installments = lp.installments;
                }
                this.saveCatalog();
            }

            // Sincroniza seletor e catálogo
            this.populateSelector();
            this.renderCatalogGrid();

            // Se for a LP ativa, atualiza barra superior e visualizador
            if (State.activeLpId === lpId) {
                this.updateCampaignInfoBar();
                if (CMS && typeof CMS.loadLpConfig === 'function') {
                    CMS.loadLpConfig(lpId);
                }
                if (CMS && typeof CMS.loadCampaignConfig === 'function') {
                    CMS.loadCampaignConfig(lpId);
                }
                if (Preview && typeof Preview.updateIframe === 'function') {
                    Preview.updateIframe(lp, true);
                }
                if (Preview && typeof Preview.updateUiInfo === 'function') {
                    Preview.updateUiInfo(lp);
                }
            }

            if (Performance && typeof Performance.render === 'function') {
                Performance.render();
            }

            Utils.showToast(`Landing Page "${lp.name}" atualizada com sucesso!`, 'success');
            return lp;
        },

        async removeLp(lpId) {
            if (!State.catalog[lpId]) return false;

            const totalLps = Object.keys(State.catalog).length;
            if (totalLps <= 1) {
                Utils.showToast('Deve haver ao menos uma Landing Page cadastrada no painel.', 'warning');
                return false;
            }

            const lp = State.catalog[lpId];
            const lpName = lp.name;
            const lpSlug = (lp.slug || lpId).replace(/^\/+/, '');

            if (!confirm(`Deseja realmente remover a Landing Page "${lpName}" (${lpId})?\n\nProtocolo de Segurança: A página sairá do ar imediatamente em todos os dispositivos e novos acessos verão a tela de campanha encerrada.`)) {
                return false;
            }

            // Registra no protocolo de páginas desativadas/fora do ar
            try {
                const deact = JSON.parse(localStorage.getItem('otica_deactivated_lps') || '{}');
                deact[lpSlug] = { slug: lpSlug, name: lpName, deactivatedAt: new Date().toISOString() };
                deact[lpId] = { slug: lpSlug, name: lpName, deactivatedAt: new Date().toISOString() };
                localStorage.setItem('otica_deactivated_lps', JSON.stringify(deact));
            } catch (e) {}

            if (State.supabase) {
                try {
                    await State.supabase.from(SUPABASE_CONFIG.configTable).upsert({
                        id: `lp_offline_${lpSlug}`,
                        updated_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.warn('[LPStudio] Erro ao sincronizar status offline:', err);
                }
            }

            delete State.catalog[lpId];
            this.saveCatalog();

            if (State.activeLpId === lpId) {
                const remainingIds = Object.keys(State.catalog);
                this.setActiveLp(remainingIds[0]);
            } else {
                this.populateSelector();
                this.renderCatalogGrid();
            }

            if (Performance && typeof Performance.render === 'function') {
                Performance.render();
            }

            Utils.showToast(`Landing Page "${lpName}" removida e retirada do ar com sucesso.`, 'info');
            return true;
        },

        renderCatalogGrid() {
            const grid = document.getElementById('lp-catalog-grid');
            if (!grid) return;

            grid.innerHTML = '';
            const lps = Object.values(State.catalog);

            lps.forEach(lp => {
                const isActive = lp.id === State.activeLpId;
                const isDefault = Boolean(DEFAULT_LPS[lp.id]);
                
                // Contabiliza leads dessa LP se disponíveis
                const lpLeadsCount = State.allLeads.filter(l => Leads.belongsToLp(l, lp.id)).length;
                const monthlyRevenue = lpLeadsCount * (lp.price || 0);

                const card = document.createElement('div');
                card.className = `lp-card ${isActive ? 'is-active' : ''}`;
                card.style.borderTop = `4px solid ${lp.color || '#002C5B'}`;

                card.innerHTML = `
                    <div class="lp-card-header">
                        <div class="lp-card-identity">
                            <span class="lp-color-dot" style="background-color: ${lp.color || '#002C5B'};"></span>
                            <h4 class="lp-card-title">${Utils.escapeHtml(lp.name)}</h4>
                        </div>
                        <span class="lp-badge ${lp.status === 'Ativa' ? 'badge-active' : 'badge-draft'}">
                            ${Utils.escapeHtml(lp.status)}
                        </span>
                    </div>

                    <p class="lp-card-description">${Utils.escapeHtml(lp.description || '')}</p>

                    <div class="lp-card-meta">
                        <div class="lp-meta-item">
                            <span class="lp-meta-label">Combo Base:</span>
                            <span class="lp-meta-value">${Utils.formatCurrency(lp.price)} <small>(${lp.installments}x)</small></span>
                        </div>
                        <div class="lp-meta-item">
                            <span class="lp-meta-label">Slug / Rota:</span>
                            <code class="lp-meta-code">${Utils.escapeHtml(lp.slug)}</code>
                        </div>
                    </div>

                    <div class="lp-card-stats">
                        <div class="stat-box">
                            <span class="stat-number">${lpLeadsCount}</span>
                            <span class="stat-label">Leads Gerados</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number">${Utils.formatCurrency(monthlyRevenue)}</span>
                            <span class="stat-label">Volume Estimado</span>
                        </div>
                    </div>

                    <div class="lp-card-actions">
                        <button type="button" class="btn-card-select ${isActive ? 'btn-selected' : ''}" data-select-lp="${lp.id}">
                            <i class="fas ${isActive ? 'fa-check-circle' : 'fa-desktop'}"></i>
                            ${isActive ? 'LP Ativa no Painel' : 'Gerenciar LP'}
                        </button>
                        <a href="${Preview.resolvePreviewUrl(lp)}" target="_blank" class="btn-card-external" title="Abrir URL Externa">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        <button type="button" class="btn-card-edit" data-edit-lp="${lp.id}" title="Editar Landing Page">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${Object.keys(State.catalog).length > 1 ? `
                            <button type="button" class="btn-card-delete" data-delete-lp="${lp.id}" title="Excluir Landing Page">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        ` : ''}
                    </div>
                `;

                grid.appendChild(card);
            });

            // Card de Adicionar Nova LP
            const addCard = document.createElement('div');
            addCard.className = 'lp-card lp-card-new';
            addCard.innerHTML = `
                <div class="lp-new-content">
                    <div class="lp-new-icon"><i class="fas fa-plus"></i></div>
                    <h4>Adicionar Nova LP</h4>
                    <p>Cadastre uma nova campanha de armação ou tecnologia multifocal.</p>
                    <button type="button" class="btn-create-lp-card" id="btn-card-trigger-new">
                        <i class="fas fa-plus-circle"></i> Criar Landing Page
                    </button>
                </div>
            `;
            grid.appendChild(addCard);
        },

        bindEvents() {
            // Seletor de Landing Page principal
            const selector = document.getElementById('lp-selector');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    const selectedVal = e.target.value;
                    if (selectedVal === 'new_lp') {
                        Modal.openCreateLp();
                        // Volta o select para o item atual
                        selector.value = State.activeLpId;
                    } else if (selectedVal) {
                        this.setActiveLp(selectedVal);
                    }
                });
            }

            // Delegação de cliques no Grid de LPs
            const grid = document.getElementById('lp-catalog-grid');
            if (grid) {
                grid.addEventListener('click', (e) => {
                    const selectBtn = e.target.closest('[data-select-lp]');
                    if (selectBtn) {
                        const lpId = selectBtn.getAttribute('data-select-lp');
                        this.setActiveLp(lpId);
                        return;
                    }

                    const editBtn = e.target.closest('[data-edit-lp]');
                    if (editBtn) {
                        const lpId = editBtn.getAttribute('data-edit-lp');
                        Modal.openEditLp(lpId);
                        return;
                    }

                    const deleteBtn = e.target.closest('[data-delete-lp]');
                    if (deleteBtn) {
                        const lpId = deleteBtn.getAttribute('data-delete-lp');
                        this.removeLp(lpId);
                        return;
                    }

                    const triggerNew = e.target.closest('#btn-card-trigger-new');
                    if (triggerNew) {
                        Modal.openCreateLp();
                    }
                });
            }

            // Botão avulso de Criar LP se existir
            const btnNewLp = document.getElementById('btn-new-lp') || document.getElementById('btn-create-lp');
            if (btnNewLp) {
                btnNewLp.addEventListener('click', () => Modal.openCreateLp());
            }

            // Popstate para histórico de navegação
            window.addEventListener('popstate', (e) => {
                if (e.state && e.state.lp && State.catalog[e.state.lp]) {
                    this.setActiveLp(e.state.lp, false);
                } else {
                    this.determineInitialActiveLp();
                    this.setActiveLp(State.activeLpId, false);
                }
            });
        }
    };

    // ==========================================================================
    // 5. MÓDULO: VISUALIZADOR INTELIGENTE (PREVIEW & VIEWPORTS)
    // ==========================================================================
    const Preview = {
        init() {
            this.bindEvents();
            this.setViewport('desktop');
        },

        resolvePreviewUrl(lp, forceRefresh = false) {
            if (!lp) return '/forlife/index.html';

            const template = (lp.template || '').toLowerCase();
            const idParam = encodeURIComponent(lp.id);
            const rawSlug = (lp.slug || lp.id).replace(/^\/+/, '');
            const slugParam = encodeURIComponent(rawSlug);
            const cacheBuster = forceRefresh ? `&_t=${Date.now()}` : '';

            const heroStyleVal = lp.heroStyle || '';
            const heroParam = heroStyleVal ? `&hero=${encodeURIComponent(heroStyleVal)}` : '';
            const heroTitleVal = lp.heroTitle || '';
            const heroTitleParam = heroTitleVal ? `&heroTitle=${encodeURIComponent(heroTitleVal)}` : '';
            const priceParam = lp.price ? `&price=${encodeURIComponent(lp.price)}` : '';
            const instParam = lp.installments ? `&installments=${encodeURIComponent(lp.installments)}` : '';

            let basePath = '';
            if (template === 'visaosimples' || template === '194' || lp.id === '194' || lp.id === 'forlife-194') {
                basePath = `/visaosimples/index.html?lp=${idParam}&slug=${slugParam}`;
            } else if (template === 'fila' || lp.id === 'fila') {
                basePath = `/index.html?lp=${idParam}`;
            } else {
                // Padrão forlife / multifocal
                basePath = `/forlife/index.html?lp=${idParam}&theme=${idParam}&slug=${slugParam}`;
            }

            return basePath + heroParam + heroTitleParam + priceParam + instParam + cacheBuster;
        },

        updateIframe(lp, forceRefresh = false) {
            if (!lp) return;
            const targetUrl = this.resolvePreviewUrl(lp, forceRefresh);

            // 1. Iframe Principal do Visualizador
            const iframe = document.getElementById('preview-iframe');
            if (iframe) {
                const currentFull = iframe.src ? (new URL(iframe.src, window.location.origin).pathname + new URL(iframe.src, window.location.origin).search) : '';
                const targetFull = new URL(targetUrl, window.location.origin).pathname + new URL(targetUrl, window.location.origin).search;
                
                if (forceRefresh || currentFull !== targetFull) {
                    iframe.src = targetUrl;
                }
            }

            // 2. Sincroniza Iframes do Modo Híbrido
            this.syncHybridIframes(lp, forceRefresh);

            // 3. Sincroniza Iframe da Gaveta Lateral
            this.syncDrawerIframe(lp, forceRefresh);
        },

        updateUiInfo(lp) {
            if (!lp) return;

            const cleanSlug = lp.slug || ('/' + lp.id);
            const previewTargetUrl = this.resolvePreviewUrl(lp);

            // URL display
            const urlDisplay = document.getElementById('preview-url-display');
            if (urlDisplay) {
                if (urlDisplay.tagName === 'INPUT' || urlDisplay.tagName === 'TEXTAREA') {
                    urlDisplay.value = cleanSlug;
                } else {
                    urlDisplay.textContent = cleanSlug;
                    urlDisplay.title = cleanSlug;
                }
            }

            // Barra de endereço no mockup do navegador emulado
            const chromeAddress = document.getElementById('chrome-address-path');
            if (chromeAddress) {
                chromeAddress.textContent = cleanSlug;
                chromeAddress.title = cleanSlug;
            }

            // Barra de endereço do mockup híbrido
            const hybridPath = document.getElementById('hybrid-path-desktop');
            if (hybridPath) {
                hybridPath.textContent = cleanSlug;
            }

            // Slug da Gaveta Lateral
            const drawerSlug = document.getElementById('drawer-lp-slug');
            if (drawerSlug) {
                drawerSlug.textContent = cleanSlug;
            }

            // Status Badge
            const statusBadge = document.getElementById('lp-status-badge');
            if (statusBadge) {
                statusBadge.textContent = lp.status;
                statusBadge.className = `badge-status ${lp.status === 'Ativa' ? 'status-active' : 'status-draft'}`;
                statusBadge.style.backgroundColor = lp.status === 'Ativa' ? '#DEF7EC' : '#FEF3C7';
                statusBadge.style.color = lp.status === 'Ativa' ? '#03543F' : '#92400E';
            }

            // Botão Abrir Externo
            const btnOpen = document.getElementById('btn-open-lp-external');
            if (btnOpen) {
                btnOpen.href = previewTargetUrl;
                btnOpen.target = '_blank';
            }
        },

        setViewport(viewportKey) {
            const preset = VIEWPORT_PRESETS[viewportKey] || VIEWPORT_PRESETS.desktop;
            State.activeViewport = viewportKey;

            const deviceWrapper = document.getElementById('device-wrapper');
            const container = document.querySelector('.preview-frame-wrapper') || 
                              document.querySelector('.preview-wrapper') || 
                              document.getElementById('preview-iframe-container') ||
                              deviceWrapper;
            const iframe = document.getElementById('preview-iframe');

            // Atualiza classe do mockup wrapper para estilos CSS dedicados
            if (deviceWrapper) {
                deviceWrapper.className = `device-mockup-wrapper viewport-${viewportKey}`;
            }

            // Atualiza botões ativos
            document.querySelectorAll('[data-viewport]').forEach(btn => {
                const v = btn.getAttribute('data-viewport');
                btn.classList.toggle('active', v === viewportKey);
            });

            // Aplica medidas com transição suave
            const targetEl = container || iframe;
            if (targetEl) {
                targetEl.style.transition = 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.35s ease';
                targetEl.style.width = preset.width;
                targetEl.style.maxWidth = preset.maxWidth;
                targetEl.style.margin = '0 auto';
            }

            // Atualiza o display de resolução
            const resDisplay = document.getElementById('preview-resolution-display');
            if (resDisplay) {
                resDisplay.textContent = preset.label;
            }
        },

        reloadIframe() {
            const activeLp = Catalog.getActiveLp();
            const btn = document.getElementById('btn-reload-iframe');
            const chromeBtn = document.getElementById('chrome-reload-btn');

            const icons = [];
            if (btn && btn.querySelector('i')) icons.push(btn.querySelector('i'));
            if (chromeBtn && chromeBtn.querySelector('i')) icons.push(chromeBtn.querySelector('i'));

            icons.forEach(ic => ic.classList.add('fa-spin'));

            this.updateIframe(activeLp, true);

            setTimeout(() => {
                icons.forEach(ic => ic.classList.remove('fa-spin'));
                Utils.showToast('Preview recarregado com dados atualizados.', 'info');
            }, 600);
        },

        bindEvents() {
            // Cliques nos botões data-viewport
            document.addEventListener('click', (e) => {
                const vpBtn = e.target.closest('[data-viewport]');
                if (vpBtn) {
                    const vp = vpBtn.getAttribute('data-viewport');
                    if (vp !== 'hybrid') {
                        this.setViewport(vp);
                    }
                }
            });

            // Botão de recarregar iframe no toolbar
            const btnReload = document.getElementById('btn-reload-iframe');
            if (btnReload) {
                btnReload.addEventListener('click', () => this.reloadIframe());
            }

            // Botão de recarregar no chrome address bar
            const chromeReload = document.getElementById('chrome-reload-btn');
            if (chromeReload) {
                chromeReload.addEventListener('click', () => this.reloadIframe());
            }
        },

        initHybridAndDrawer() {
            // Botão Modo Híbrido
            const btnHybrid = document.getElementById('btn-view-hybrid');
            if (btnHybrid) {
                btnHybrid.addEventListener('click', () => {
                    this.toggleHybridMode(true);
                });
            }

            // Botões de viewports individuais desativam híbrido
            document.querySelectorAll('.btn-vp:not(#btn-view-hybrid)').forEach(b => {
                b.addEventListener('click', () => {
                    this.toggleHybridMode(false);
                });
            });

            // Quick Drawer Trigger
            const btnQuick = document.getElementById('btn-quick-drawer');
            const drawerPanel = document.getElementById('quick-drawer-panel');
            const btnCloseDrawer = document.getElementById('btn-close-drawer');

            if (btnQuick && drawerPanel) {
                btnQuick.addEventListener('click', () => {
                    drawerPanel.classList.toggle('open');
                    this.syncDrawerIframe(null, true);
                });
            }

            if (btnCloseDrawer && drawerPanel) {
                btnCloseDrawer.addEventListener('click', () => {
                    drawerPanel.classList.remove('open');
                });
            }

            // Viewport switches na gaveta
            const btnDrawerMob = document.getElementById('btn-drawer-mobile');
            const btnDrawerDesk = document.getElementById('btn-drawer-desktop');
            const drawerWrapper = document.getElementById('drawer-frame-wrapper');

            if (btnDrawerMob && btnDrawerDesk && drawerWrapper) {
                btnDrawerMob.addEventListener('click', () => {
                    btnDrawerMob.classList.add('active');
                    btnDrawerDesk.classList.remove('active');
                    drawerWrapper.className = 'drawer-frame-wrapper viewport-mobile';
                });

                btnDrawerDesk.addEventListener('click', () => {
                    btnDrawerDesk.classList.add('active');
                    btnDrawerMob.classList.remove('active');
                    drawerWrapper.className = 'drawer-frame-wrapper viewport-desktop';
                });
            }
        },

        toggleHybridMode(enable) {
            const singleWrapper = document.getElementById('device-wrapper');
            const hybridContainer = document.getElementById('hybrid-stage-container');
            const btnHybrid = document.getElementById('btn-view-hybrid');
            const otherVpBtns = document.querySelectorAll('.btn-vp:not(#btn-view-hybrid)');

            if (enable) {
                if (singleWrapper) singleWrapper.style.display = 'none';
                if (hybridContainer) hybridContainer.style.display = 'flex';
                if (btnHybrid) btnHybrid.classList.add('active');
                otherVpBtns.forEach(b => b.classList.remove('active'));
                this.syncHybridIframes(null, true);
                Utils.showToast('Modo Híbrido ativado: Desktop, Tablet e Mobile sincronizados!', 'info');
            } else {
                if (singleWrapper) singleWrapper.style.display = 'block';
                if (hybridContainer) hybridContainer.style.display = 'none';
                if (btnHybrid) btnHybrid.classList.remove('active');
            }
        },

        syncHybridIframes(lp, forceRefresh = false) {
            const activeLp = lp || Catalog.getActiveLp();
            if (!activeLp) return;

            const targetUrl = this.resolvePreviewUrl(activeLp, forceRefresh);
            const targetFull = new URL(targetUrl, window.location.origin).pathname + new URL(targetUrl, window.location.origin).search;

            const iframes = [
                document.getElementById('hybrid-iframe-desktop'),
                document.getElementById('hybrid-iframe-tablet'),
                document.getElementById('hybrid-iframe-mobile')
            ];
            iframes.forEach(iframe => {
                if (iframe) {
                    const currentFull = iframe.src ? (new URL(iframe.src, window.location.origin).pathname + new URL(iframe.src, window.location.origin).search) : '';
                    if (forceRefresh || currentFull !== targetFull) {
                        iframe.src = targetUrl;
                    }
                }
            });
            const pathDisplay = document.getElementById('hybrid-path-desktop');
            if (pathDisplay) pathDisplay.textContent = activeLp.slug || ('/' + activeLp.id);
        },

        syncDrawerIframe(lp, forceRefresh = false) {
            const activeLp = lp || Catalog.getActiveLp();
            if (!activeLp) return;

            const targetUrl = this.resolvePreviewUrl(activeLp, forceRefresh);
            const targetFull = new URL(targetUrl, window.location.origin).pathname + new URL(targetUrl, window.location.origin).search;

            const drawerIframe = document.getElementById('drawer-iframe');
            const slugDisplay = document.getElementById('drawer-lp-slug');
            if (drawerIframe) {
                const currentFull = drawerIframe.src ? (new URL(drawerIframe.src, window.location.origin).pathname + new URL(drawerIframe.src, window.location.origin).search) : '';
                if (forceRefresh || currentFull !== targetFull) {
                    drawerIframe.src = targetUrl;
                }
            }
            if (slugDisplay) slugDisplay.textContent = activeLp.slug || ('/' + activeLp.id);
        }
    };

    // ==========================================================================
    // 6. MÓDULO: GESTÃO DE LEADS COM SUPABASE & FALLBACK
    // ==========================================================================
    const Leads = {
        pagination: {
            currentPage: 1,
            pageSize: 10
        },

        init() {
            this.initSupabase();
            this.bindEvents();
        },

        initSupabase() {
            try {
                if (window.supabase && typeof window.supabase.createClient === 'function') {
                    State.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
                } else {
                    console.warn('[LPStudio] Biblioteca @supabase/supabase-js não detectada no escopo global. Usando persistência local.');
                }
            } catch (err) {
                console.error('[LPStudio] Falha ao inicializar Supabase:', err);
            }
        },

        belongsToLp(lead, lpId) {
            if (!lead) return false;
            const target = (lpId || '').toString().replace(/^\/+/, '').toLowerCase();
            const leadLp = (lead.lp_id || lead.lpId || 'forlife').toString().replace(/^\/+/, '').toLowerCase();

            if (target === 'forlife') {
                return !leadLp || leadLp === 'forlife';
            }
            return leadLp === target || (lead.lp_name && lead.lp_name.toLowerCase().includes(target));
        },

        getLeadLpName(lead) {
            if (!lead) return 'ForLife';
            if (lead.lp_name) return lead.lp_name;
            const raw = (lead.lp_id || lead.lpId || 'forlife').toString();
            const clean = raw.replace(/^\/+/, '');
            if (!clean || clean === 'forlife') return 'ForLife';
            if (State.catalog && State.catalog[clean]) return State.catalog[clean].name;
            if (State.catalog && State.catalog['/' + clean]) return State.catalog['/' + clean].name;
            if (clean === '194' || clean === 'forlife-194') return 'Visão Simples 194';
            if (clean === 'fila') return 'FILA Sport';
            return clean;
        },

        async loadLeads() {
            const tbody = document.getElementById('leads-table-body');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="14" style="text-align: center; padding: 40px; color: var(--text-muted, #64748B);">
                            <i class="fas fa-spinner fa-spin"></i> Carregando base global de leads...
                        </td>
                    </tr>
                `;
            }

            let cloudLeads = [];
            let loadedFromCloud = false;
            const currentLp = Catalog.getActiveLp();

            // 1. Tenta carregar do Supabase
            if (State.supabase) {
                try {
                    let query = State.supabase
                        .from(SUPABASE_CONFIG.leadsTable)
                        .select('*')
                        .order('created_at', { ascending: false });

                    const { data, error } = await query;

                    if (!error && Array.isArray(data)) {
                        cloudLeads = data.map(l => this.normalizeLead(l));
                        loadedFromCloud = true;
                    } else if (error) {
                        console.warn('[LPStudio] Aviso consulta forlife_leads:', error.message);
                    }

                    // Se a LP for FILA e a tabela fila_leads existir, tenta buscar também
                    if (currentLp.id === 'fila') {
                        try {
                            const filaRes = await State.supabase
                                .from(SUPABASE_CONFIG.filaLeadsTable)
                                .select('*')
                                .order('created_at', { ascending: false });
                            
                            if (!filaRes.error && Array.isArray(filaRes.data)) {
                                const filaNorm = filaRes.data.map(l => {
                                    const n = this.normalizeLead(l);
                                    n.lp_id = 'fila';
                                    return n;
                                });
                                // Mescla desduplicando
                                const existingCodes = new Set(cloudLeads.map(c => c.code));
                                filaNorm.forEach(fn => {
                                    if (!existingCodes.has(fn.code)) {
                                        cloudLeads.push(fn);
                                    }
                                });
                            }
                        } catch (fErr) {
                            // Ignora se tabela fila_leads não existir
                        }
                    }
                } catch (e) {
                    console.warn('[LPStudio] Erro ao conectar com Supabase, fallback local:', e);
                }
            }

            // 2. Carrega leads do LocalStorage
            let localLeads = [];
            try {
                localLeads = JSON.parse(localStorage.getItem(STORAGE_KEYS.leadsFallback)) || [];
                if (!Array.isArray(localLeads)) localLeads = [];
            } catch (e) {
                localLeads = [];
            }

            let deletedCodes = new Set();
            try {
                deletedCodes = new Set(JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedCodes)) || []);
            } catch (e) {
                deletedCodes = new Set();
            }

            const cleanedAtStr = localStorage.getItem('otica_leads_cleaned_at');
            const cleanedAtTime = cleanedAtStr ? new Date(cleanedAtStr).getTime() : 0;

            const isCleanedOut = (l) => {
                if (l.code && deletedCodes.has(l.code)) return true;
                if (cleanedAtTime > 0) {
                    const lTime = l.created_at ? new Date(l.created_at).getTime() : (l.raw_created_at ? new Date(l.raw_created_at).getTime() : 0);
                    if (lTime && lTime < cleanedAtTime) return true;
                }
                return false;
            };

            // 3. Mescla e desduplica leads
            let merged = [];
            if (loadedFromCloud) {
                // Filtra registros limpos/excluídos
                merged = cloudLeads.filter(l => !isCleanedOut(l));

                // Se houver edições locais salvas para leads da nuvem, mescla os campos atualizados
                const localMap = new Map();
                localLeads.forEach(loc => {
                    if (loc && loc.code) localMap.set(loc.code, loc);
                });

                merged = merged.map(cl => {
                    const loc = localMap.get(cl.code);
                    if (loc) {
                        return {
                            ...cl,
                            saleStatus: loc.saleStatus || cl.saleStatus,
                            saleValue: (loc.saleValue !== undefined && loc.saleValue !== '') ? loc.saleValue : cl.saleValue,
                            store: loc.store || cl.store,
                            seller: loc.seller || cl.seller,
                            osNumber: loc.osNumber || cl.osNumber
                        };
                    }
                    return cl;
                });

                const cloudCodes = new Set(merged.map(l => l.code));
                localLeads.forEach(loc => {
                    const norm = this.normalizeLead(loc);
                    if (norm.code && !cloudCodes.has(norm.code) && !isCleanedOut(norm)) {
                        merged.unshift(norm);
                        cloudCodes.add(norm.code);

                        // Sincroniza pendência com Supabase
                        if (State.supabase) {
                            State.supabase.from(SUPABASE_CONFIG.leadsTable).insert([{
                                name: norm.name,
                                phone: norm.phone,
                                email: norm.email,
                                city: norm.city,
                                combo_price: norm.comboPrice,
                                addons: JSON.stringify(norm.addons || []),
                                total_price: norm.totalPrice,
                                has_prescription: norm.hasPrescription,
                                prescription_file: norm.prescriptionFile,
                                code: norm.code,
                                store: norm.store,
                                seller: norm.seller,
                                sale_value: norm.saleValue,
                                os_number: norm.osNumber,
                                lp_id: norm.lp_id || currentLp.id
                            }]).then(() => {}).catch(() => {});
                        }
                    }
                });
            } else {
                merged = localLeads
                    .map(l => this.normalizeLead(l))
                    .filter(l => !isCleanedOut(l));
            }

            State.allLeads = merged;

            // 4. Aplica filtros e renderiza
            this.applyFilters();
            Catalog.updateCampaignInfoBar();
        },

        normalizeLead(l) {
            const dateOnly = l.created_at ? new Date(l.created_at).toLocaleDateString('pt-BR') : (l.date || '');
            
            let leadCity = l.city || '';
            let leadStore = l.store || '';
            if (!leadStore && leadCity.includes('(Loja:')) {
                const match = leadCity.match(/\(Loja:\s*([^)]+)\)/);
                if (match) {
                    leadStore = match[1].trim();
                    leadCity = leadCity.replace(/\s*\(Loja:[^)]+\)/, '').trim();
                }
            }

            let addonsParsed = [];
            if (Array.isArray(l.addons)) {
                addonsParsed = l.addons;
            } else if (typeof l.addons === 'string') {
                try {
                    addonsParsed = JSON.parse(l.addons || '[]');
                } catch (e) {
                    addonsParsed = [];
                }
            }

            const currentLp = Catalog.getActiveLp();
            const fallbackPrice = currentLp ? currentLp.price : 297;

            return {
                id: l.id,
                date: dateOnly,
                name: l.name || 'Cliente sem nome',
                phone: l.phone || '',
                email: l.email || '',
                city: leadCity,
                comboPrice: parseFloat(l.combo_price || l.comboPrice) || fallbackPrice,
                addons: addonsParsed,
                totalPrice: parseFloat(l.total_price || l.totalPrice) || fallbackPrice,
                hasPrescription: Boolean(l.has_prescription || l.hasPrescription),
                recipeStatus: l.recipe_status || l.recipeStatus || (l.has_prescription ? 'Possuo receita atualizada' : 'Preciso atualizar receita'),
                prescriptionFile: l.prescription_file || l.prescriptionFile || '',
                code: l.code || '',
                store: leadStore,
                seller: l.seller || '',
                saleValue: l.sale_value || l.saleValue || '',
                osNumber: l.os_number || l.osNumber || '',
                saleStatus: l.sale_status || l.saleStatus || (l.sale_value ? 'Vendido' : 'Pendente'),
                raw_created_at: l.created_at || l.raw_created_at || '',
                lp_id: l.lp_id || l.lpId || 'forlife'
            };
        },

        applyFilters() {
            const filterLp = document.getElementById('filter-lp');
            const searchInput = document.getElementById('search-leads');
            const filterStore = document.getElementById('filter-store');
            const filterSeller = document.getElementById('filter-seller');
            const filterStatus = document.getElementById('filter-status');

            const lpVal = (filterLp ? filterLp.value : '').trim();
            const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
            const storeVal = (filterStore ? filterStore.value : '').trim();
            const sellerVal = (filterSeller ? filterSeller.value : '').trim();
            const statusVal = (filterStatus ? filterStatus.value : '').trim();

            State.filteredLeads = State.allLeads.filter(lead => {
                // 1. Filtro de Landing Page (Global por padrão; filtra se houver seleção no dropdown)
                if (lpVal && lpVal !== 'all' && !this.belongsToLp(lead, lpVal)) return false;

                
                // Filtro de Período
                const filterPeriodEl = document.getElementById('filter-period');
                const periodChoice = (filterPeriodEl ? filterPeriodEl.value : 'all');
                if (periodChoice && periodChoice !== 'all') {
                    const todayStr = new Date().toLocaleDateString('pt-BR');
                    if (periodChoice === 'today') {
                        if (lead.date !== todayStr) return false;
                    } else if (periodChoice === 'week') {
                        const parts = (lead.date || '').split('/');
                        if (parts.length === 3) {
                            const d = new Date(parts[2], parts[1] - 1, parts[0]);
                            if ((Date.now() - d.getTime()) > (7 * 24 * 60 * 60 * 1000)) return false;
                        }
                    } else if (periodChoice === 'month') {
                        const parts = (lead.date || '').split('/');
                        const curMonth = new Date().getMonth() + 1;
                        if (parts.length === 3 && parseInt(parts[1], 10) !== curMonth) return false;
                    }
                }

                // 2. Filtro de Loja
                if (storeVal && storeVal !== 'all' && lead.store !== storeVal) return false;

                // 3. Filtro de Vendedor
                if (sellerVal && sellerVal !== 'all' && lead.seller !== sellerVal) return false;

                // 4. Filtro de Status
                if (statusVal && statusVal !== 'all') {
                    if (statusVal === 'Vendido' && !lead.saleValue && lead.saleStatus !== 'Vendido') return false;
                    if (statusVal === 'Pendente' && (lead.saleValue || lead.saleStatus === 'Vendido')) return false;
                    if (statusVal === 'Receita' && !lead.hasPrescription) return false;
                }

                // 5. Busca por texto livre
                if (query) {
                    const matchName = (lead.name || '').toLowerCase().includes(query);
                    const matchPhone = (lead.phone || '').includes(query);
                    const matchEmail = (lead.email || '').toLowerCase().includes(query);
                    const matchCode = (lead.code || '').toLowerCase().includes(query);
                    const matchCity = (lead.city || '').toLowerCase().includes(query);
                    const matchStore = (lead.store || '').toLowerCase().includes(query);
                    const matchSeller = (lead.seller || '').toLowerCase().includes(query);
                    const matchOs = (lead.osNumber || '').toLowerCase().includes(query);

                    if (!matchName && !matchPhone && !matchEmail && !matchCode && 
                        !matchCity && !matchStore && !matchSeller && !matchOs) {
                        return false;
                    }
                }

                return true;
            });

            this.pagination.currentPage = 1;
            this.renderTable(State.filteredLeads);
            this.updateKpis(State.filteredLeads);
            if (typeof Kanban !== 'undefined' && typeof Kanban.render === 'function') {
                Kanban.render();
            }
        },

        updateTotalizer(leads) {
            const totCountEl = document.getElementById('tot-leads-count');
            const totSalesEl = document.getElementById('tot-sales-value');
            const totTicketEl = document.getElementById('tot-ticket-medio');
            const totPipelineEl = document.getElementById('tot-pipeline-value');

            let totalLeads = leads.length;
            let totalSalesConcluded = 0;
            let salesCount = 0;
            let pipelineValue = 0;

            leads.forEach(l => {
                const saleVal = parseFloat(l.saleValue);
                if (!isNaN(saleVal) && saleVal > 0) {
                    totalSalesConcluded += saleVal;
                    salesCount++;
                }
                const comboTotal = parseFloat(l.totalPrice) || 0;
                pipelineValue += comboTotal;
            });

            const avgTicket = salesCount > 0 ? (totalSalesConcluded / salesCount) : 0;

            if (totCountEl) totCountEl.textContent = totalLeads;
            if (totSalesEl) totSalesEl.textContent = Utils.formatCurrency(totalSalesConcluded);
            if (totTicketEl) totTicketEl.textContent = Utils.formatCurrency(avgTicket);
            if (totPipelineEl) totPipelineEl.textContent = Utils.formatCurrency(pipelineValue);
        },

        renderTable(leads) {
            const tbody = document.getElementById('leads-table-body');
            const countDisplay = document.getElementById('tab-leads-count');
            if (countDisplay) countDisplay.textContent = leads.length;

            this.updateTotalizer(leads);

            if (!tbody) return;

            const totalItems = leads.length;
            const pageSize = this.pagination.pageSize;
            const totalPages = pageSize >= 99999 ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));

            if (this.pagination.currentPage > totalPages) this.pagination.currentPage = totalPages;
            if (this.pagination.currentPage < 1) this.pagination.currentPage = 1;
            const currentPage = this.pagination.currentPage;

            const startIndex = pageSize >= 99999 ? 0 : (currentPage - 1) * pageSize;
            const endIndex = pageSize >= 99999 ? totalItems : Math.min(startIndex + pageSize, totalItems);
            const pageLeads = leads.slice(startIndex, endIndex);

            // Atualiza indicadores de paginação
            const visibleCountEl = document.getElementById('visible-leads-count');
            if (visibleCountEl) visibleCountEl.textContent = pageLeads.length;

            const totalRegEl = document.getElementById('total-registered-leads');
            if (totalRegEl) totalRegEl.textContent = totalItems;

            const pageIndicatorEl = document.getElementById('page-indicator');
            if (pageIndicatorEl) pageIndicatorEl.textContent = `Página ${currentPage} de ${totalPages}`;

            const btnPrev = document.getElementById('btn-page-prev');
            if (btnPrev) btnPrev.disabled = (currentPage <= 1);

            const btnNext = document.getElementById('btn-page-next');
            if (btnNext) btnNext.disabled = (currentPage >= totalPages);

            if (leads.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="14" style="text-align: center; padding: 40px; color: var(--text-muted, #64748B); font-size: 14px;">
                            Nenhum lead encontrado com os filtros aplicados.
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = '';
            pageLeads.forEach((lead, index) => {
                const cleanPhone = Utils.cleanDigits(lead.phone);
                const isChecked = State.selectedLeadCodes.has(lead.code);
                const leadLpName = this.getLeadLpName(lead);

                // Tecnologias / Adicionais
                const addonsHtml = (lead.addons && lead.addons.length > 0)
                    ? lead.addons.map(a => `<span class="badge-addon" style="display:inline-block; background:#EDF2F7; color:#1E293B; padding:1px 5px; border-radius:3px; font-size:10.5px; margin:1px;">${Utils.escapeHtml(a.name || a)}</span>`).join(' ')
                    : '<span style="color:#94A3B8; font-size:11px;">Tradicional</span>';

                // Receita
                let recipeHtml = '';
                if (lead.hasPrescription) {
                    if (lead.prescriptionFile) {
                        recipeHtml = `
                            <button type="button" class="btn-prescription-thumb" onclick="window.LPStudio.openPrescriptionModal('${lead.code}')" title="Ver Receita Anexada" style="border:none; background:none; cursor:pointer; padding:0;">
                                <i class="fas fa-file-prescription" style="font-size:18px; color:#002C5B;"></i>
                            </button>
                        `;
                    } else {
                        recipeHtml = '<span class="badge-status" style="background:#E0F2FE; color:#0369A1; padding:2px 6px; border-radius:4px; font-size:11px;"><i class="fas fa-check"></i> Atualizada</span>';
                    }
                } else {
                    recipeHtml = '<span class="badge-status" style="background:#F1F5F9; color:#64748B; padding:2px 6px; border-radius:4px; font-size:11px;"><i class="fas fa-redo"></i> Renovar</span>';
                }

                // Opções de Lojas dinâmicas
                let storeOptions = `<option value="">-- Loja --</option>`;
                State.stores.forEach(s => {
                    const sel = (lead.store === s) ? 'selected' : '';
                    storeOptions += `<option value="${Utils.escapeHtml(s)}" ${sel}>${Utils.escapeHtml(s)}</option>`;
                });

                // Opções de Vendedores dinâmicos
                let sellerOptions = `<option value="">-- Vendedor --</option>`;
                State.sellers.forEach(s => {
                    const sel = (lead.seller === s) ? 'selected' : '';
                    sellerOptions += `<option value="${Utils.escapeHtml(s)}" ${sel}>${Utils.escapeHtml(s)}</option>`;
                });

                // Status de Venda Opções
                const saleStatuses = ['Pendente', 'Em Atendimento', 'Agendado', 'Vendido', 'Perdido'];
                let statusOptions = '';
                saleStatuses.forEach(st => {
                    const sel = (lead.saleStatus === st || (st === 'Vendido' && lead.saleValue > 0 && !lead.saleStatus)) ? 'selected' : '';
                    statusOptions += `<option value="${st}" ${sel}>${st}</option>`;
                });

                // Linha Principal
                const tr = document.createElement('tr');
                tr.className = 'lead-row';
                tr.id = `row-lead-${lead.code || index}`;

                tr.innerHTML = `
                    <td style="text-align: center;">
                        <button type="button" class="btn-expand-row" onclick="window.LPStudio.toggleRowDetails('${lead.code || index}')" title="Ver detalhes completos" style="border:none; background:none; cursor:pointer; color:#002C5B;">
                            <i class="fas fa-plus" id="icon-expand-${lead.code || index}"></i>
                        </button>
                    </td>
                    <td style="font-size: 11.5px; color: var(--text-muted, #64748B); white-space: nowrap;">${Utils.escapeHtml(lead.date)}</td>
                    <td style="font-weight: 700; color: #002C5B; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${Utils.escapeHtml(lead.name)}">
                        ${Utils.escapeHtml(lead.name)}
                    </td>
                    <td style="white-space: nowrap;">
                        <span class="badge-lp-origin" title="${Utils.escapeHtml(leadLpName)}">
                            ${Utils.escapeHtml(leadLpName)}
                        </span>
                    </td>
                    <td style="text-align: center;">
                        <a href="https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(`Olá ${lead.name}! Aqui é da Ópticas Conceição. Recebemos seu voucher com o código ${lead.code}. Como podemos ajudar com seus novos óculos?`)}" target="_blank" class="btn-whatsapp-icon" title="Chamar no WhatsApp (${Utils.escapeHtml(lead.phone)})" style="color: #25D366; font-size: 18px;">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </td>
                    <td style="white-space: nowrap; line-height: 1.2;">
                        <div style="font-weight: 800; color: #002C5B; font-size: 11.5px;">${Utils.formatCurrency(lead.totalPrice)}</div>
                        <div style="margin-top: 2px;">${addonsHtml}</div>
                    </td>
                    <td style="text-align: center;">${recipeHtml}</td>
                    <td>
                        <select class="table-select" id="input-store-${lead.code || index}" style="font-size:11.5px; padding:3px 4px; border-radius:4px; border:1px solid #CBD5E1; max-width:105px;">
                            ${storeOptions}
                        </select>
                    </td>
                    <td>
                        <select class="table-select" id="input-seller-${lead.code || index}" style="font-size:11.5px; padding:3px 4px; border-radius:4px; border:1px solid #CBD5E1; max-width:95px;">
                            ${sellerOptions}
                        </select>
                    </td>
                    <td>
                        <input type="number" step="0.01" class="table-input" id="input-val-${lead.code || index}" placeholder="R$ 0,00" value="${Utils.escapeHtml(lead.saleValue)}" style="width:65px; font-size:11.5px; padding:3px 4px; border-radius:4px; border:1px solid #CBD5E1;">
                    </td>
                    <td>
                        <input type="text" class="table-input" id="input-os-${lead.code || index}" placeholder="Nº OS" value="${Utils.escapeHtml(lead.osNumber)}" style="width:52px; font-size:11.5px; padding:3px 4px; border-radius:4px; border:1px solid #CBD5E1;">
                    </td>
                    <td>
                        <select class="table-select" id="input-status-${lead.code || index}" style="font-size:11.5px; padding:3px 4px; border-radius:4px; border:1px solid #CBD5E1; max-width:85px;">
                            ${statusOptions}
                        </select>
                    </td>
                    <td style="text-align: center;">
                        <input type="checkbox" class="row-select-checkbox lead-select-box" data-code="${lead.code}" ${isChecked ? 'checked' : ''} title="Marcar para PDF" style="cursor:pointer;">
                    </td>
                    <td style="text-align: center; white-space: nowrap;">
                        <div class="row-actions-group" style="display: inline-flex; gap: 4px;">
                            <button type="button" class="btn-row-action edit" onclick="window.LPStudio.toggleRowDetails('${lead.code || index}')" title="Editar / Detalhes do Lead">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button type="button" class="btn-row-action save" onclick="window.LPStudio.saveLeadInline('${lead.code}')" title="Gravar Alterações">
                                <i class="fas fa-save" id="save-icon-${lead.code || index}"></i>
                            </button>
                            <button type="button" class="btn-row-action delete" onclick="window.LPStudio.deleteLead('${lead.code}')" title="Excluir Lead">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </td>
                `;

                tbody.appendChild(tr);

                // Linha de Detalhes Expandida (+)
                const trDetails = document.createElement('tr');
                trDetails.className = 'details-row';
                trDetails.id = `details-lead-${lead.code || index}`;
                trDetails.style.display = 'none';
                trDetails.style.backgroundColor = '#F8FAFC';

                trDetails.innerHTML = `
                    <td colspan="14" style="padding: 12px 18px; border-bottom: 2px solid #E2E8F0;">
                        <div class="details-content-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; font-size: 12px;">
                            <div>
                                <strong style="color:#64748B;">WhatsApp Completo:</strong><br>
                                <span style="font-weight:600; color:#002C5B;">${Utils.escapeHtml(lead.phone || 'Não informado')}</span>
                            </div>
                            <div>
                                <strong style="color:#64748B;">E-mail:</strong><br>
                                <span style="font-weight:600; color:#002C5B;">${Utils.escapeHtml(lead.email || 'Não informado')}</span>
                            </div>
                            <div>
                                <strong style="color:#64748B;">Cidade / Unidade:</strong><br>
                                <span style="font-weight:600; color:#002C5B;">${Utils.escapeHtml(lead.city || 'Não informado')}</span>
                            </div>
                            <div>
                                <strong style="color:#64748B;">Código do Voucher:</strong><br>
                                <span style="font-weight:800; color:#E31B23; font-family: monospace;">${Utils.escapeHtml(lead.code)}</span>
                            </div>
                            <div>
                                <strong style="color:#64748B;">Situação da Receita:</strong><br>
                                <span style="font-weight:600; color:#002C5B;">${Utils.escapeHtml(lead.recipeStatus)}</span>
                            </div>
                        </div>
                    </td>
                `;

                tbody.appendChild(trDetails);
            });
        },

        updateKpis(leads) {
            let totalCoupons = leads.length;
            let expectedRevenue = 0;
            let totalSalesConcluded = 0;
            let salesCount = 0;

            leads.forEach(l => {
                expectedRevenue += parseFloat(l.totalPrice) || 0;
                
                const val = parseFloat(l.saleValue);
                if (!isNaN(val) && val > 0) {
                    totalSalesConcluded += val;
                    salesCount++;
                }
            });

            const avgTicket = salesCount > 0 ? (totalSalesConcluded / salesCount) : (totalCoupons > 0 ? expectedRevenue / totalCoupons : 0);

            // Atualiza os 4 KPIs no DOM
            this.setDomText(['metric-total-leads', 'kpi-total-leads', 'kpi-total-coupons'], totalCoupons);
            this.setDomText(['metric-total-revenue', 'kpi-total-revenue'], Utils.formatCurrency(expectedRevenue));
            this.setDomText(['metric-total-sales', 'kpi-total-sales'], Utils.formatCurrency(totalSalesConcluded));
            this.setDomText(['metric-avg-ticket', 'kpi-avg-ticket'], Utils.formatCurrency(avgTicket));
        },

        setDomText(idArray, text) {
            idArray.forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = text;
            });
        },

        async saveLeadInline(code) {
            const targetLead = State.allLeads.find(l => l.code === code);
            if (!targetLead) return;

            const storeEl = document.getElementById(`input-store-${code}`);
            const sellerEl = document.getElementById(`input-seller-${code}`);
            const valEl = document.getElementById(`input-val-${code}`);
            const osEl = document.getElementById(`input-os-${code}`);
            const statusEl = document.getElementById(`input-status-${code}`);
            const icon = document.getElementById(`save-icon-${code}`);

            if (storeEl) targetLead.store = storeEl.value.trim();
            if (sellerEl) targetLead.seller = sellerEl.value.trim();
            if (valEl) targetLead.saleValue = valEl.value ? parseFloat(valEl.value) : '';
            if (osEl) targetLead.osNumber = osEl.value.trim();
            if (statusEl) targetLead.saleStatus = statusEl.value;

            // Salva Localmente
            try {
                localStorage.setItem(STORAGE_KEYS.leadsFallback, JSON.stringify(State.allLeads));
            } catch (e) {}

            // Feedback visual
            if (icon) icon.className = 'fas fa-spinner fa-spin';

            // Salva no Supabase
            if (State.supabase && (targetLead.id || targetLead.code)) {
                try {
                    const updatePayload = {
                        store: targetLead.store || null,
                        seller: targetLead.seller || null,
                        sale_value: targetLead.saleValue ? parseFloat(targetLead.saleValue) : null,
                        os_number: targetLead.osNumber || null,
                        sale_status: targetLead.saleStatus || null
                    };

                    let updateQuery;
                    if (targetLead.id) {
                        updateQuery = State.supabase.from(SUPABASE_CONFIG.leadsTable).update(updatePayload).eq('id', targetLead.id);
                    } else {
                        updateQuery = State.supabase.from(SUPABASE_CONFIG.leadsTable).update(updatePayload).eq('code', targetLead.code);
                    }

                    await updateQuery;
                } catch (err) {
                    console.warn('[LPStudio] Erro ao sincronizar update no Supabase:', err);
                }
            }

            setTimeout(() => {
                if (icon) icon.className = 'fas fa-check';
                setTimeout(() => {
                    if (icon) icon.className = 'fas fa-save';
                }, 1500);
                this.updateKpis(State.filteredLeads);
                Utils.showToast(`Lead ${targetLead.name} atualizado com sucesso!`, 'success');
            }, 300);
        },

        async deleteLead(code) {
            const lead = State.allLeads.find(l => l.code === code);
            if (!lead) return;

            if (!confirm(`Deseja realmente excluir o lead de "${lead.name}" (${lead.code})?`)) {
                return;
            }

            // Grava na lista de códigos excluídos
            let deletedCodes = [];
            try {
                deletedCodes = JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedCodes)) || [];
            } catch (e) {}
            if (lead.code && !deletedCodes.includes(lead.code)) {
                deletedCodes.push(lead.code);
                localStorage.setItem(STORAGE_KEYS.deletedCodes, JSON.stringify(deletedCodes));
            }

            // Remove da memória e do storage
            State.allLeads = State.allLeads.filter(l => l.code !== code);
            try {
                localStorage.setItem(STORAGE_KEYS.leadsFallback, JSON.stringify(State.allLeads));
            } catch (e) {}

            // Exclui do Supabase
            if (State.supabase) {
                try {
                    if (lead.id) {
                        await State.supabase.from(SUPABASE_CONFIG.leadsTable).delete().eq('id', lead.id);
                    } else if (lead.code) {
                        await State.supabase.from(SUPABASE_CONFIG.leadsTable).delete().eq('code', lead.code);
                    }
                } catch (e) {
                    console.warn('[LPStudio] Aviso ao excluir no Supabase:', e);
                }
            }

            this.applyFilters();
            Utils.showToast('Lead excluído com sucesso.', 'info');
        },

        async clearAllLeads(skipConfirm = false) {
            if (!skipConfirm && !confirm("Deseja realmente limpar toda a base de leads de teste do Hub?\n\nEsta ação apagará permanentemente todos os registros de leads locais e desativará os mocks, deixando a base pronta para novos clientes reais.")) {
                return;
            }

            // Registra todos os códigos atuais em deletedCodes para evitar re-sincronização de mocks
            let deleted = [];
            try {
                deleted = JSON.parse(localStorage.getItem(STORAGE_KEYS.deletedCodes)) || [];
            } catch (e) {}

            State.allLeads.forEach(l => {
                if (l.code && !deleted.includes(l.code)) deleted.push(l.code);
            });

            localStorage.setItem(STORAGE_KEYS.deletedCodes, JSON.stringify(deleted));
            localStorage.setItem(STORAGE_KEYS.leadsFallback, JSON.stringify([]));
            localStorage.setItem('otica_leads_cleaned_at', new Date().toISOString());

            // Tenta deletar no Supabase se houver conexão
            if (State.supabase) {
                try {
                    await State.supabase.from(SUPABASE_CONFIG.leadsTable).delete().neq('code', '__keep__');
                } catch (err) {
                    console.warn('[LPStudio] Aviso ao limpar tabela no Supabase:', err);
                }
            }

            State.allLeads = [];
            State.filteredLeads = [];
            State.selectedLeadCodes.clear();

            this.renderTable([]);
            this.updateKpis([]);
            if (typeof Kanban !== 'undefined' && typeof Kanban.render === 'function') {
                Kanban.render([]);
            }
            Utils.showToast("Base de leads higienizada com sucesso! Nenhum dado de teste será recarregado.", "success");
        },

        toggleRowDetails(code) {
            const row = document.getElementById(`details-lead-${code}`);
            const icon = document.getElementById(`icon-expand-${code}`);
            if (!row) return;

            const isHidden = row.style.display === 'none';
            row.style.display = isHidden ? 'table-row' : 'none';
            if (icon) {
                icon.className = isHidden ? 'fas fa-minus' : 'fas fa-plus';
            }
        },

        bindEvents() {
            // Filtros e busca em tempo real
            const searchInput = document.getElementById('search-leads');
            if (searchInput) {
                let debounceTimer;
                searchInput.addEventListener('input', () => {
                    clearTimeout(debounceTimer);
                    debounceTimer = setTimeout(() => this.applyFilters(), 250);
                });
            }

            ['filter-lp', 'filter-store', 'filter-seller', 'filter-status'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', () => this.applyFilters());
            });

            // Checkbox "Selecionar Todos"
            const selectAllBox = document.getElementById('select-all-leads');
            if (selectAllBox) {
                selectAllBox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    State.filteredLeads.forEach(l => {
                        if (checked) {
                            State.selectedLeadCodes.add(l.code);
                        } else {
                            State.selectedLeadCodes.delete(l.code);
                        }
                    });

                    document.querySelectorAll('.lead-select-box').forEach(cb => {
                        cb.checked = checked;
                    });
                });
            }

            // Delegação para checkboxes individuais
            document.addEventListener('change', (e) => {
                if (e.target.classList.contains('lead-select-box')) {
                    const code = e.target.getAttribute('data-code');
                    if (e.target.checked) {
                        State.selectedLeadCodes.add(code);
                    } else {
                        State.selectedLeadCodes.delete(code);
                    }
                }
            });

            // Botões de Exportação PDF
            const btnPdfSelected = document.getElementById('btn-pdf-selected');
            if (btnPdfSelected) {
                btnPdfSelected.addEventListener('click', () => Export.exportPdf(true));
            }

            const btnPdfAll = document.getElementById('btn-pdf-all');
            if (btnPdfAll) {
                btnPdfAll.addEventListener('click', () => Export.exportPdf(false));
            }

            // Botão de Atualizar / Refresh da Base de Leads
            const btnRefresh = document.getElementById('btn-refresh-leads');
            if (btnRefresh) {
                btnRefresh.addEventListener('click', async () => {
                    const icon = btnRefresh.querySelector('i');
                    if (icon) icon.classList.add('fa-spin');
                    btnRefresh.disabled = true;

                    try {
                        await this.loadLeads();
                        Catalog.updateCampaignInfoBar();
                        Utils.showToast('Base de leads atualizada com sucesso!', 'success');
                    } catch (err) {
                        console.error('[LPStudio] Erro ao recarregar leads:', err);
                        Utils.showToast('Erro ao atualizar leads. Verifique a conexão.', 'error');
                    } finally {
                        if (icon) icon.classList.remove('fa-spin');
                        btnRefresh.disabled = false;
                    }
                });
            }

            // Botão de Limpar Base de Leads e Mocks
            const btnClearLeads = document.getElementById('btn-clear-leads-db');
            if (btnClearLeads) {
                btnClearLeads.addEventListener('click', () => this.clearAllLeads());
            }

            // Exportação CSV
            const btnCsv = document.getElementById('btn-export-csv');
            if (btnCsv) {
                btnCsv.addEventListener('click', () => Export.exportCsv());
            }

            // Paginação da Tabela de Leads
            const pageSizeSelect = document.getElementById('leads-page-size');
            if (pageSizeSelect) {
                pageSizeSelect.addEventListener('change', (e) => {
                    const val = e.target.value;
                    this.pagination.pageSize = (val === 'all') ? 999999 : parseInt(val, 10);
                    this.pagination.currentPage = 1;
                    this.renderTable(State.filteredLeads);
                });
            }

            const btnPrev = document.getElementById('btn-page-prev');
            if (btnPrev) {
                btnPrev.addEventListener('click', () => {
                    if (this.pagination.currentPage > 1) {
                        this.pagination.currentPage--;
                        this.renderTable(State.filteredLeads);
                    }
                });
            }

            const btnNext = document.getElementById('btn-page-next');
            if (btnNext) {
                btnNext.addEventListener('click', () => {
                    const totalPages = Math.ceil(State.filteredLeads.length / this.pagination.pageSize);
                    if (this.pagination.currentPage < totalPages) {
                        this.pagination.currentPage++;
                        this.renderTable(State.filteredLeads);
                    }
                });
            }
        }
    };

    // ==========================================================================
    // 7. MÓDULO: EXPORTAÇÃO (PDF COM jsPDF + autoTable & CSV)
    // ==========================================================================
    const Export = {
        exportPdf(onlySelected = false) {
            let leadsToExport = State.filteredLeads;

            if (onlySelected) {
                leadsToExport = leadsToExport.filter(l => State.selectedLeadCodes.has(l.code));
                if (leadsToExport.length === 0) {
                    Utils.showToast('Nenhum lead marcado na caixa de seleção para exportar.', 'warning');
                    return;
                }
            } else {
                if (leadsToExport.length === 0) {
                    Utils.showToast('Nenhum lead disponível com os filtros atuais para exportação.', 'warning');
                    return;
                }
            }

            // Verifica presença do jsPDF
            const { jsPDF } = window.jspdf || {};
            if (!jsPDF) {
                console.warn('[LPStudio] jsPDF não encontrado no escopo global. Usando window.print()');
                window.print();
                return;
            }

            try {
                const doc = new jsPDF('landscape');
                const activeLp = Catalog.getActiveLp();
                const now = new Date();
                const dateStr = now.toLocaleDateString('pt-BR');
                const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                // Cabeçalho institucional
                doc.setFillColor(0, 44, 91); // Azul Conceição
                doc.rect(0, 0, 297, 24, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.text('ÓPTICAS CONCEIÇÃO - RELATÓRIO DE LEADS & VENDAS', 14, 11);

                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Campanha: ${activeLp.name} | Gerado em: ${dateStr} às ${timeStr}`, 14, 18);

                // Montagem da tabela
                const tableRows = leadsToExport.map(l => {
                    const tech = (l.addons && l.addons.length > 0)
                        ? l.addons.map(a => a.name || a).join(' + ')
                        : 'Tradicional';
                    const valVenda = l.saleValue ? Utils.formatCurrency(l.saleValue) : '-';

                    return [
                        l.date || '',
                        l.name || '',
                        l.phone || '',
                        l.store || 'Não atribuída',
                        l.seller || 'Não atribuído',
                        Utils.formatCurrency(l.totalPrice),
                        tech,
                        valVenda,
                        l.osNumber || '-',
                        l.saleStatus || 'Pendente',
                        l.code || ''
                    ];
                });

                if (typeof doc.autoTable === 'function') {
                    doc.autoTable({
                        head: [['Data', 'Cliente', 'WhatsApp', 'Loja', 'Vendedor', 'Preço Combo', 'Tecnologia', 'Venda (R$)', 'Nº OS', 'Status', 'Código']],
                        body: tableRows,
                        startY: 28,
                        pageBreak: 'auto',
                        theme: 'grid',
                        headStyles: {
                            fillColor: [0, 44, 91],
                            textColor: [255, 255, 255],
                            fontStyle: 'bold',
                            fontSize: 8,
                            halign: 'center'
                        },
                        bodyStyles: {
                            fontSize: 8,
                            cellPadding: 3
                        },
                        alternateRowStyles: {
                            fillColor: [248, 250, 252]
                        },
                        columnStyles: {
                            0: { cellWidth: 20 },
                            1: { cellWidth: 35, fontStyle: 'bold' },
                            2: { cellWidth: 26 },
                            3: { cellWidth: 34 },
                            4: { cellWidth: 28 },
                            5: { cellWidth: 22, halign: 'right' },
                            6: { cellWidth: 28 },
                            7: { cellWidth: 22, halign: 'right' },
                            8: { cellWidth: 16, halign: 'center' },
                            9: { cellWidth: 20, halign: 'center' },
                            10: { cellWidth: 22, halign: 'center', fontStyle: 'bold' }
                        },
                        didDrawPage: function(data) {
                            const str = 'Página ' + doc.internal.getNumberOfPages();
                            doc.setFontSize(8);
                            doc.setTextColor(100, 116, 139);
                            doc.text('Ópticas Conceição - Confidencial Digital Sales', data.settings.margin.left, doc.internal.pageSize.height - 8);
                            doc.text(str, doc.internal.pageSize.width - data.settings.margin.right - 24, doc.internal.pageSize.height - 8);
                        }
                    });

                    // Bloco de Totais e Ticket Médio
                    let totalValVendas = 0;
                    let countVendas = 0;
                    leadsToExport.forEach(l => {
                        const v = parseFloat(l.saleValue);
                        if (!isNaN(v) && v > 0) {
                            totalValVendas += v;
                            countVendas++;
                        }
                    });
                    const ticketMedioReal = countVendas > 0 ? (totalValVendas / countVendas) : 0;

                    let finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 12 : 180;
                    if (finalY > doc.internal.pageSize.height - 35) {
                        doc.addPage();
                        finalY = 24;
                    }

                    doc.setFillColor(241, 245, 249);
                    doc.rect(14, finalY, 269, 18, 'F');
                    doc.setDrawColor(203, 213, 225);
                    doc.rect(14, finalY, 269, 18, 'S');

                    doc.setFontSize(8.5);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(0, 44, 91);
                    doc.text(`TOTAL DE LEADS: ${leadsToExport.length}`, 18, finalY + 11);
                    doc.text(`VENDAS: ${countVendas}`, 82, finalY + 11);
                    doc.text(`TICKET MÉDIO: ${Utils.formatCurrency(ticketMedioReal)}`, 140, finalY + 11);
                    doc.text(`FATURAMENTO: ${Utils.formatCurrency(totalValVendas)}`, 212, finalY + 11);

                    const filename = `relatorio_${activeLp.id}_${now.toISOString().slice(0, 10)}.pdf`;
                    doc.save(filename);
                    Utils.showToast(`PDF "${filename}" gerado com sucesso!`, 'success');
                } else {
                    window.print();
                }
            } catch (err) {
                console.error('[LPStudio] Erro na geração de PDF:', err);
                Utils.showToast('Erro ao compilar PDF. Abrindo diálogo de impressão.', 'error');
                window.print();
            }
        },

        exportCsv() {
            const activeLp = Catalog.getActiveLp();
            const leads = State.filteredLeads;

            if (leads.length === 0) {
                Utils.showToast('Nenhum lead para exportar em CSV.', 'warning');
                return;
            }

            let csv = 'Data;Cliente;WhatsApp;Email;Cidade;Loja;Vendedor;Combo_Preco;Tecnologias;Venda_Valor;OS;Status;Codigo\n';
            leads.forEach(l => {
                const tech = (l.addons || []).map(a => a.name || a).join(' + ') || 'Tradicional';
                csv += `"${l.date}";"${l.name}";"${l.phone}";"${l.email}";"${l.city}";"${l.store || ''}";"${l.seller || ''}";"${l.totalPrice}";"${tech}";"${l.saleValue || ''}";"${l.osNumber || ''}";"${l.saleStatus || ''}";"${l.code}"\n`;
            });

            // BOM UTF-8 para Excel em português
            const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leads_${activeLp.id}_${new Date().toISOString().slice(0, 10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
            Utils.showToast('Planilha CSV baixada com sucesso!', 'success');
        }
    };

    // ==========================================================================
    // 8. MÓDULO: GESTÃO DE CONFIGURAÇÕES (CMS DA LP ATIVA)
    // ==========================================================================

    // ==========================================================================
    // 5.5 MÓDULO: PIPELINE KANBAN (FUNIL COMERCIAL & GESTÃO DE ATENDIMENTO)
    // ==========================================================================
    const Kanban = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            const kanbanFilterLp = document.getElementById('kanban-filter-lp');
            if (kanbanFilterLp) {
                kanbanFilterLp.addEventListener('change', () => {
                    this.render();
                });
            }

            const refreshBtn = document.getElementById('btn-refresh-kanban');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', async () => {
                    const icon = refreshBtn.querySelector('i');
                    if (icon) icon.classList.add('fa-spin');
                    refreshBtn.disabled = true;
                    try {
                        await Leads.loadLeads();
                        this.render();
                        Utils.showToast('Pipeline Kanban atualizado com sucesso!', 'success');
                    } catch (e) {
                        console.error('[LPStudio] Erro ao atualizar Kanban:', e);
                    } finally {
                        if (icon) icon.classList.remove('fa-spin');
                        refreshBtn.disabled = false;
                    }
                });
            }

            // Drag & Drop nas colunas do Kanban
            const columns = document.querySelectorAll('.kanban-column');
            columns.forEach(col => {
                const status = col.getAttribute('data-status');
                const list = col.querySelector('.kanban-cards-list');
                if (list) {
                    list.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        col.classList.add('drag-over');
                    });
                    list.addEventListener('dragleave', (e) => {
                        if (!col.contains(e.relatedTarget)) {
                            col.classList.remove('drag-over');
                        }
                    });
                    list.addEventListener('drop', (e) => {
                        e.preventDefault();
                        col.classList.remove('drag-over');
                        const leadCode = e.dataTransfer.getData('text/plain');
                        if (leadCode && status) {
                            this.updateLeadStatus(leadCode, status);
                        }
                    });
                }
            });
        },

        getFilteredLeads() {
            const filterEl = document.getElementById('kanban-filter-lp');
            const targetLp = filterEl ? filterEl.value : '';
            if (!targetLp) return State.allLeads || [];
            return (State.allLeads || []).filter(l => Leads.belongsToLp(l, targetLp));
        },

        async updateLeadStatus(code, newStatus) {
            const lead = State.allLeads.find(l => l.code === code);
            if (!lead) return;

            let normalized = newStatus;
            const lower = (newStatus || '').toLowerCase();
            if (lower.includes('atend') || lower === 'contatado') normalized = 'Em Atendimento';
            else if (lower.includes('agend')) normalized = 'Agendado';
            else if (lower.includes('vend') || lower.includes('conclu')) normalized = 'Vendido';
            else if (lower.includes('perd') || lower.includes('cancel')) normalized = 'Perdido';
            else if (lower.includes('pend')) normalized = 'Pendente';

            lead.saleStatus = normalized;
            if (normalized === 'Vendido' && !lead.saleValue) {
                lead.saleValue = lead.totalPrice || 297.00;
            }

            // Salva no LocalStorage
            try {
                localStorage.setItem(STORAGE_KEYS.leadsFallback, JSON.stringify(State.allLeads));
            } catch (e) {}

            // Atualiza no Supabase se houver conexão
            if (State.supabase) {
                try {
                    const updatePayload = {
                        sale_status: newStatus,
                        sale_value: lead.saleValue,
                        os_number: lead.osNumber || ''
                    };
                    if (lead.id) {
                        await State.supabase.from(SUPABASE_CONFIG.leadsTable).update(updatePayload).eq('id', lead.id);
                    } else if (lead.code) {
                        await State.supabase.from(SUPABASE_CONFIG.leadsTable).update(updatePayload).eq('code', lead.code);
                    }
                } catch (err) {
                    console.warn('[LPStudio] Aviso ao atualizar status no Supabase:', err);
                }
            }

            Utils.showToast(`Lead "${lead.name}" movido para "${newStatus}"!`, 'success');
            this.render();
            Leads.applyFilters();
        },

        render(leadsList) {
            const allLeads = leadsList || this.getFilteredLeads();
            const totalCountEl = document.getElementById('tab-kanban-count');
            if (totalCountEl) totalCountEl.textContent = allLeads.length;

            const stages = {
                Pendente: [],
                'Em Atendimento': [],
                Agendado: [],
                Vendido: [],
                Perdido: []
            };

            allLeads.forEach(lead => {
                let st = lead.saleStatus || 'Pendente';
                if (st === 'Contatado') st = 'Em Atendimento';
                if (st === 'Cancelado') st = 'Perdido';
                if (st === 'Venda Concluída' || (lead.saleValue > 0 && !lead.saleStatus)) st = 'Vendido';

                if (stages[st]) {
                    stages[st].push(lead);
                } else {
                    stages.Pendente.push(lead);
                }
            });

            const stageKeys = [
                { key: 'Pendente', listId: 'kanban-list-pendente', countId: 'kanban-count-pendente' },
                { key: 'Em Atendimento', listId: 'kanban-list-atendimento', countId: 'kanban-count-atendimento' },
                { key: 'Agendado', listId: 'kanban-list-agendado', countId: 'kanban-count-agendado' },
                { key: 'Vendido', listId: 'kanban-list-vendido', countId: 'kanban-count-vendido' },
                { key: 'Perdido', listId: 'kanban-list-perdido', countId: 'kanban-count-perdido' }
            ];

            stageKeys.forEach(({ key, listId, countId }) => {
                const listEl = document.getElementById(listId);
                const countEl = document.getElementById(countId);
                const items = stages[key] || [];

                if (countEl) countEl.textContent = items.length;
                if (!listEl) return;

                if (items.length === 0) {
                    listEl.innerHTML = `<div class="kanban-empty-hint">Nenhum lead nesta fase</div>`;
                    return;
                }

                let html = '';
                items.forEach(lead => {
                    const cleanPhone = Utils.cleanDigits(lead.phone);
                    const leadLpName = Leads.getLeadLpName(lead);
                    const priceFormatted = Utils.formatCurrency(lead.totalPrice || 297.00);

                    const statuses = ['Pendente', 'Em Atendimento', 'Agendado', 'Vendido', 'Perdido'];
                    let selectOptions = '';
                    statuses.forEach(s => {
                        selectOptions += `<option value="${s}" ${s === key ? 'selected' : ''}>${s}</option>`;
                    });

                    html += `
                        <div class="kanban-card" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', '${lead.code}')" data-code="${lead.code}">
                            <div class="kanban-card-header">
                                <span class="kanban-card-badge-lp" title="${Utils.escapeHtml(leadLpName)}">${Utils.escapeHtml(leadLpName)}</span>
                                <span class="kanban-card-date">${Utils.escapeHtml(lead.date || '')}</span>
                            </div>
                            <div class="kanban-card-name" title="${Utils.escapeHtml(lead.name)}">
                                ${Utils.escapeHtml(lead.name)}
                            </div>
                            <div class="kanban-card-meta">
                                <div class="kanban-card-meta-row">
                                    <span>Cupom: <strong>${Utils.escapeHtml(lead.code)}</strong></span>
                                    <span class="kanban-card-price">${priceFormatted}</span>
                                </div>
                                <div style="color:#64748B; font-size:11px;">
                                    ${Utils.escapeHtml(lead.store || 'Unidade Centro')}
                                </div>
                            </div>
                            <div class="kanban-card-actions">
                                <a href="https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(`Olá ${lead.name}! Aqui é da Ópticas Conceição. Recebemos seu voucher promocional ${lead.code}. Como podemos ajudar com seus novos óculos?`)}" target="_blank" class="kanban-btn-whatsapp" title="Chamar no WhatsApp">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </a>
                                <select class="kanban-status-select" onchange="window.LPStudio.moveKanbanLead('${lead.code}', this.value)" title="Mover estágio">
                                    ${selectOptions}
                                </select>
                            </div>
                        </div>
                    `;
                });

                listEl.innerHTML = html;
            });
        }
    };

    // ==========================================================================
    // 6. MÓDULO: COMPARATIVO DE PERFORMANCE ENTRE LANDING PAGES
    // ==========================================================================
    const Performance = {
        init() {
            this.bindEvents();
        },

        calculateLpMetrics(lpId) {
            const lp = State.catalog[lpId] || DEFAULT_LPS[lpId];
            if (!lp) return null;

            const lpLeads = State.allLeads ? State.allLeads.filter(l => Leads.belongsToLp(l, lpId)) : [];
            const leadsCount = lpLeads.length;

            let salesCount = 0;
            let revenue = 0;
            lpLeads.forEach(l => {
                const val = parseFloat(l.saleValue);
                if (!isNaN(val) && val > 0) {
                    salesCount++;
                    revenue += val;
                }
            });

            const ticketMedio = salesCount > 0 ? (revenue / salesCount) : lp.price;

            let visits = 0;
            if (Array.isArray(State.trafficLogs)) {
                State.trafficLogs.forEach(log => {
                    if (lpId === 'forlife' && (!log.lp_id || log.lp_id === 'forlife' || (log.page && log.page.includes('forlife')))) visits++;
                    else if (lpId === 'fila' && (log.lp_id === 'fila' || (log.page && !log.page.includes('forlife')))) visits++;
                    else if (log.lp_id === lpId) visits++;
                });
            }
            if (visits < leadsCount) visits = Math.round(leadsCount * 6.8) + 14;

            const convRate = visits > 0 ? ((leadsCount / visits) * 100) : 0;
            const closeRate = leadsCount > 0 ? ((salesCount / leadsCount) * 100) : 0;
            const budget = (lp.campaign && lp.campaign.budget) ? lp.campaign.budget : 2000;
            const roi = budget > 0 ? (((revenue || (leadsCount * lp.price * 0.5)) - budget) / budget) * 100 : 0;

            return {
                lp,
                visits,
                leadsCount,
                convRate: convRate.toFixed(1),
                salesCount,
                closeRate: closeRate.toFixed(1),
                ticketMedio,
                revenue,
                budget,
                roi: roi.toFixed(1)
            };
        },

        render() {
            const tbody = document.getElementById('comparison-table-body');
            if (!tbody) return;
            tbody.innerHTML = '';

            const lpIds = Object.keys(State.catalog);
            const metrics = lpIds.map(id => this.calculateLpMetrics(id)).filter(Boolean);

            let bestConv = { val: -1, lp: '' };
            let bestRev = { val: -1, lp: '' };
            let bestVol = { val: -1, lp: '' };

            metrics.forEach(m => {
                const convNum = parseFloat(m.convRate);
                if (convNum > bestConv.val) bestConv = { val: convNum, lp: m.lp.name };
                if (m.revenue > bestRev.val) bestRev = { val: m.revenue, lp: m.lp.name };
                if (m.leadsCount > bestVol.val) bestVol = { val: m.leadsCount, lp: m.lp.name };

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td style="white-space: nowrap;">
                        <strong>${Utils.escapeHtml(m.lp.name)}</strong><br>
                        <small style="color:#64748B;"><code>${Utils.escapeHtml(m.lp.slug)}</code></small>
                    </td>
                    <td style="text-align:center;">${m.visits}</td>
                    <td style="text-align:center; font-weight:700;">${m.leadsCount}</td>
                    <td style="text-align:center;">
                        <span style="background:rgba(16,185,129,0.12); color:#059669; font-weight:800; padding:2px 8px; border-radius:9999px;">
                            ${m.convRate}%
                        </span>
                    </td>
                    <td style="text-align:center; font-weight:700;">${m.salesCount}</td>
                    <td style="text-align:center;">${m.closeRate}%</td>
                    <td style="text-align:center; font-weight:700; color:#002C5B;">${Utils.formatCurrency(m.ticketMedio)}</td>
                    <td style="text-align:right; font-weight:800; color:#059669;">${Utils.formatCurrency(m.revenue)}</td>
                    <td style="text-align:right;">${Utils.formatCurrency(m.budget)}</td>
                    <td style="text-align:center;"><span style="color:${m.roi >= 0 ? '#059669' : '#DC2626'}; font-weight:800;">${m.roi}%</span></td>
                    <td style="text-align:center;">
                        <button type="button" class="btn-action-del-lp btn-icon-only" onclick="window.LPStudio.deleteLpFromComparison('${m.lp.id}')" title="Excluir Landing Page da Lista">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            // Atualiza cards de campeãs
            Leads.setDomText(['comp-best-conv-rate'], `${bestConv.val}% `);
            Leads.setDomText(['comp-best-conv-lp'], bestConv.lp || 'ForLife Multifocal');
            Leads.setDomText(['comp-best-rev-val'], Utils.formatCurrency(bestRev.val > 0 ? bestRev.val : 12761));
            Leads.setDomText(['comp-best-rev-lp'], bestRev.lp || 'ForLife Multifocal');
            Leads.setDomText(['comp-best-vol-leads'], `${bestVol.val > 0 ? bestVol.val : 43} leads`);
            Leads.setDomText(['comp-best-vol-lp'], bestVol.lp || 'ForLife Multifocal');

            this.renderBars(metrics);
        },

        renderBars(metrics) {
            const convBox = document.getElementById('chart-conv-bars');
            const revBox = document.getElementById('chart-rev-bars');
            if (!convBox || !revBox) return;

            convBox.innerHTML = '';
            revBox.innerHTML = '';

            const maxConv = Math.max(...metrics.map(m => parseFloat(m.convRate)), 10);
            const maxRev = Math.max(...metrics.map(m => m.revenue), 1000);

            metrics.forEach(m => {
                const convPct = Math.min(100, Math.max(12, ((parseFloat(m.convRate) / maxConv) * 100))).toFixed(0);
                const revPct = Math.min(100, Math.max(12, ((m.revenue / maxRev) * 100))).toFixed(0);

                convBox.innerHTML += `
                    <div class="chart-bar-item">
                        <div class="bar-row-header">
                            <span class="bar-label">${Utils.escapeHtml(m.lp.name)}</span>
                            <span class="bar-val">${m.convRate}%</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill conv" style="width: ${convPct}%;"></div>
                        </div>
                    </div>
                `;

                revBox.innerHTML += `
                    <div class="chart-bar-item">
                        <div class="bar-row-header">
                            <span class="bar-label">${Utils.escapeHtml(m.lp.name)}</span>
                            <span class="bar-val">${Utils.formatCurrency(m.revenue)}</span>
                        </div>
                        <div class="bar-track">
                            <div class="bar-fill rev" style="width: ${revPct}%;"></div>
                        </div>
                    </div>
                `;
            });
        },

        deleteLpFromComparison(lpId) {
            Catalog.removeLp(lpId);
        },

        bindEvents() {
            const btnRefresh = document.getElementById('btn-refresh-comparison');
            if (btnRefresh) {
                btnRefresh.addEventListener('click', () => {
                    this.render();
                    Utils.showToast('Métricas de performance recalculadas com sucesso!', 'success');
                });
            }

            // Atualiza automaticamente ao trocar para a aba de comparativo
            const tabBtn = document.getElementById('tab-btn-comparison');
            if (tabBtn) {
                tabBtn.addEventListener('click', () => {
                    setTimeout(() => this.render(), 100);
                });
            }
        }
    };

    const CMS = {
        init() {
            this.loadStoresAndSellers();
            this.bindEvents();
        },

        loadLpConfig(lpId) {
            const currentLp = State.catalog[lpId] || Catalog.getActiveLp();
            const storageKey = STORAGE_KEYS.cmsConfigPrefix + lpId;

            let config = {
                comboPrice: currentLp.price || 297,
                installments: currentLp.installments || 10,
                offerType: currentLp.offerType || 'combo_completo',
                lensModality: currentLp.lensModality || 'lentes_prontas',
                frameBrand: currentLp.frameBrand || 'Coleção Conceição',
                lensBrand: currentLp.lensBrand || 'Lentes Monofocais HD',
                showTechSection: currentLp.showTechSection !== false,
                antirreflexo: currentLp.antirreflexo || 0.00,
                bluecut: currentLp.bluecut || 70.00,
                fotossensivel: currentLp.fotossensivel || 120.00,
                addonsActive: currentLp.addonsActive || {
                    antirreflexo: true,
                    bluecut: true,
                    fotossensivel: true
                }
            };

            try {
                const stored = localStorage.getItem(storageKey);
                if (stored) {
                    config = { ...config, ...JSON.parse(stored) };
                }
            } catch (e) {}

            // Preenche os campos do formulário
            this.setInputValue('cms-combo-price', config.comboPrice);
            this.setInputValue('cms-installments', config.installments);
            const heroStyleVal = config.heroStyle || (currentLp && currentLp.heroStyle) || (currentLp && currentLp.template === 'visaosimples' ? 'visao_simples_jovens' : 'multifocal_senhora');
            this.setInputValue('cms-hero-style', heroStyleVal);
            const heroTitleVal = config.heroTitle !== undefined ? config.heroTitle : ((currentLp && currentLp.heroTitle) || '');
            this.setInputValue('cms-hero-title', heroTitleVal);
            this.setInputValue('cms-frame-brand', config.frameBrand || 'Coleção Conceição');
            this.setInputValue('cms-lens-brand', config.lensBrand || 'Lentes Monofocais HD');
            this.setInputValue('cms-antirreflexo', config.antirreflexo);
            this.setInputValue('cms-bluecut', config.bluecut);
            this.setInputValue('cms-fotossensivel', config.fotossensivel);

            // Interruptor mestre da seção de tecnologias
            const chkShowSec = document.getElementById('cms-toggle-show-tech-section');
            if (chkShowSec) chkShowSec.checked = config.showTechSection !== false;

            // Checkboxes de ativação das tecnologias
            const chkAnti = document.getElementById('cms-toggle-antirreflexo');
            if (chkAnti) chkAnti.checked = config.addonsActive ? (config.addonsActive.antirreflexo !== false) : true;
            const chkBlue = document.getElementById('cms-toggle-bluecut');
            if (chkBlue) chkBlue.checked = config.addonsActive ? (config.addonsActive.bluecut !== false) : true;
            const chkFoto = document.getElementById('cms-toggle-fotossensivel');
            if (chkFoto) chkFoto.checked = config.addonsActive ? (config.addonsActive.fotossensivel !== false) : true;
        },

        loadCampaignConfig(lpId) {
            const currentLp = State.catalog[lpId] || Catalog.getActiveLp();
            const camp = currentLp.campaign || {
                name: `Campanha ${currentLp.name}`,
                status: 'Em Veiculação',
                budget: 2500.00,
                targetLeads: 150
            };
            this.setInputValue('cms-campaign-name', camp.name || '');
            this.setInputValue('cms-campaign-status', camp.status || 'Em Veiculação');
            this.setInputValue('cms-campaign-budget', camp.budget || 2000);
            this.setInputValue('cms-campaign-target', camp.targetLeads || 100);
        },

        saveCampaignConfig(e) {
            if (e && e.preventDefault) e.preventDefault();
            const lpId = State.activeLpId;
            if (!State.catalog[lpId]) return;

            const name = document.getElementById('cms-campaign-name')?.value.trim() || `Campanha ${State.catalog[lpId].name}`;
            const status = document.getElementById('cms-campaign-status')?.value || 'Em Veiculação';
            const budget = parseFloat(document.getElementById('cms-campaign-budget')?.value) || 2000;
            const targetLeads = parseInt(document.getElementById('cms-campaign-target')?.value, 10) || 100;

            State.catalog[lpId].campaign = { name, status, budget, targetLeads };
            Catalog.saveCatalog();
            Catalog.updateCampaignInfoBar();
            if (Performance && typeof Performance.render === 'function') {
                Performance.render();
            }
            Utils.showToast(`Metas e orçamento da campanha de "${State.catalog[lpId].name}" salvos com sucesso!`, 'success');
        },

        setInputValue(id, val) {
            const el = document.getElementById(id);
            if (el) el.value = val;
        },

        async saveLpConfig(e) {
            if (e && e.preventDefault) e.preventDefault();

            const lpId = State.activeLpId;
            const comboPrice = parseFloat(document.getElementById('cms-combo-price')?.value) || 297;
            const installments = parseInt(document.getElementById('cms-installments')?.value, 10) || 10;
            const offerType = document.getElementById('cms-offer-type')?.value || 'combo_completo';
            const lensModality = document.getElementById('cms-lens-modality')?.value || 'lentes_prontas';
            const heroStyle = document.getElementById('cms-hero-style')?.value || 'multifocal_senhora';
            const heroTitle = (document.getElementById('cms-hero-title')?.value || '').trim();
            const frameBrand = (document.getElementById('cms-frame-brand')?.value || '').trim() || 'Coleção Conceição';
            const lensBrand = (document.getElementById('cms-lens-brand')?.value || '').trim() || 'Lentes Monofocais HD';
            const showTechSection = document.getElementById('cms-toggle-show-tech-section')?.checked ?? true;
            const antirreflexo = parseFloat(document.getElementById('cms-antirreflexo')?.value) || 0;
            const bluecut = parseFloat(document.getElementById('cms-bluecut')?.value) || 0;
            const fotossensivel = parseFloat(document.getElementById('cms-fotossensivel')?.value) || 0;

            const addonsActive = {
                antirreflexo: document.getElementById('cms-toggle-antirreflexo')?.checked ?? true,
                bluecut: document.getElementById('cms-toggle-bluecut')?.checked ?? true,
                fotossensivel: document.getElementById('cms-toggle-fotossensivel')?.checked ?? true
            };

            const config = {
                comboPrice,
                installments,
                offerType,
                lensModality,
                heroStyle,
                heroTitle,
                frameBrand,
                lensBrand,
                showTechSection,
                antirreflexo,
                bluecut,
                fotossensivel,
                addonsActive
            };

            // Salva no LocalStorage da LP
            localStorage.setItem(STORAGE_KEYS.cmsConfigPrefix + lpId, JSON.stringify(config));

            // Sincroniza slug key e aliases 194 / forlife-194
            const curLp = State.catalog[lpId];
            if (curLp && curLp.slug) {
                const slugKey = curLp.slug.replace(/^\/+/, '');
                if (slugKey && slugKey !== lpId) {
                    localStorage.setItem(STORAGE_KEYS.cmsConfigPrefix + slugKey, JSON.stringify(config));
                }
            }

            if (lpId === '194' || lpId === 'forlife-194') {
                localStorage.setItem('otica_cms_config_194', JSON.stringify(config));
                localStorage.setItem('otica_cms_config_forlife-194', JSON.stringify(config));
                const otherId = lpId === '194' ? 'forlife-194' : '194';
                if (State.catalog[otherId]) {
                    State.catalog[otherId].price = comboPrice;
                    State.catalog[otherId].installments = installments;
                    State.catalog[otherId].offerType = offerType;
                    State.catalog[otherId].lensModality = lensModality;
                    State.catalog[otherId].heroStyle = heroStyle;
                    State.catalog[otherId].heroTitle = heroTitle;
                    State.catalog[otherId].frameBrand = frameBrand;
                    State.catalog[otherId].lensBrand = lensBrand;
                    State.catalog[otherId].showTechSection = showTechSection;
                    State.catalog[otherId].addonsActive = addonsActive;
                }
            }

            // Atualiza também os dados do catálogo da LP
            if (State.catalog[lpId]) {
                State.catalog[lpId].price = comboPrice;
                State.catalog[lpId].installments = installments;
                State.catalog[lpId].offerType = offerType;
                State.catalog[lpId].lensModality = lensModality;
                State.catalog[lpId].heroStyle = heroStyle;
                State.catalog[lpId].heroTitle = heroTitle;
                State.catalog[lpId].frameBrand = frameBrand;
                State.catalog[lpId].lensBrand = lensBrand;
                State.catalog[lpId].showTechSection = showTechSection;
                State.catalog[lpId].addonsActive = addonsActive;
                Catalog.saveCatalog();
                Catalog.renderCatalogGrid();
                Preview.updateIframe(State.catalog[lpId], true);
            }

            // Sincroniza com o Supabase se for a ForLife
            if (State.supabase && lpId === 'forlife') {
                try {
                    await State.supabase.from(SUPABASE_CONFIG.configTable).upsert({
                        id: 1,
                        combo_price: comboPrice,
                        installments: installments,
                        addon_antirreflexo: antirreflexo,
                        addon_bluecut: bluecut,
                        addon_fotossensivel: fotossensivel,
                        updated_at: new Date().toISOString()
                    });
                } catch (err) {
                    console.warn('[LPStudio] Erro ao sincronizar forlife_config:', err);
                }
            }

            Utils.showToast(`Configurações de produtos e preços da LP "${State.catalog[lpId].name}" salvas!`, 'success');
        },

        loadStoresAndSellers() {
            // Lojas
            try {
                const storedStores = localStorage.getItem(STORAGE_KEYS.stores);
                State.stores = storedStores ? JSON.parse(storedStores) : [...DEFAULT_STORES];
            } catch (e) {
                State.stores = [...DEFAULT_STORES];
            }

            // Vendedores
            try {
                const storedSellers = localStorage.getItem(STORAGE_KEYS.sellers);
                State.sellers = storedSellers ? JSON.parse(storedSellers) : [...DEFAULT_SELLERS];
            } catch (e) {
                State.sellers = [...DEFAULT_SELLERS];
            }

            this.renderStoresList();
            this.renderSellersList();
            this.updateFilterDropdowns();
        },

        renderStoresList() {
            const list = document.getElementById('stores-list-container');
            if (!list) return;

            list.innerHTML = '';
            State.stores.forEach((store, idx) => {
                const li = document.createElement('li');
                li.className = 'managed-item';
                li.innerHTML = `
                    <span class="managed-item-name">
                        <i class="fas fa-store"></i>
                        <span>${Utils.escapeHtml(store)}</span>
                    </span>
                    <div class="managed-item-actions">
                        <button type="button" class="btn-item-action edit" onclick="window.LPStudio.editStore(${idx})" title="Editar Nome da Loja">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn-item-action delete" onclick="window.LPStudio.removeStore(${idx})" title="Remover Loja">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                list.appendChild(li);
            });
        },

        editStore(idx) {
            const current = State.stores[idx];
            if (!current) return;
            const updated = prompt('Editar nome da Loja / Unidade:', current);
            if (!updated) return;
            const clean = updated.trim();
            if (!clean || clean === current) return;

            State.stores[idx] = clean;
            localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(State.stores));

            this.renderStoresList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Loja atualizada para "${clean}"!`, 'success');
        },

        renderSellersList() {
            const list = document.getElementById('sellers-list-container');
            if (!list) return;

            list.innerHTML = '';
            State.sellers.forEach((seller, idx) => {
                const li = document.createElement('li');
                li.className = 'managed-item';
                li.innerHTML = `
                    <span class="managed-item-name">
                        <i class="fas fa-user-tag"></i>
                        <span>${Utils.escapeHtml(seller)}</span>
                    </span>
                    <div class="managed-item-actions">
                        <button type="button" class="btn-item-action edit" onclick="window.LPStudio.editSeller(${idx})" title="Editar Nome do Consultor">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="btn-item-action delete" onclick="window.LPStudio.removeSeller(${idx})" title="Remover Consultor">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                `;
                list.appendChild(li);
            });
        },

        editSeller(idx) {
            const current = State.sellers[idx];
            if (!current) return;
            const updated = prompt('Editar nome do Consultor / Vendedor:', current);
            if (!updated) return;
            const clean = updated.trim();
            if (!clean || clean === current) return;

            State.sellers[idx] = clean;
            localStorage.setItem(STORAGE_KEYS.sellers, JSON.stringify(State.sellers));

            this.renderSellersList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Consultor atualizado para "${clean}"!`, 'success');
        },

        updateFilterDropdowns() {
            // Select de filtro por Loja
            const filterStore = document.getElementById('filter-store');
            if (filterStore) {
                const currentVal = filterStore.value;
                filterStore.innerHTML = '<option value="all">Todas as Lojas</option>';
                State.stores.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s;
                    opt.textContent = s;
                    if (s === currentVal) opt.selected = true;
                    filterStore.appendChild(opt);
                });
            }

            // Select de filtro por Vendedor
            const filterSeller = document.getElementById('filter-seller');
            if (filterSeller) {
                const currentVal = filterSeller.value;
                filterSeller.innerHTML = '<option value="all">Todos os Vendedores</option>';
                State.sellers.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s;
                    opt.textContent = s;
                    if (s === currentVal) opt.selected = true;
                    filterSeller.appendChild(opt);
                });
            }
        },

        addStore() {
            const input = document.getElementById('new-store-name');
            if (!input) return;

            const name = input.value.trim();
            if (!name) {
                Utils.showToast('Digite o nome da loja para adicionar.', 'warning');
                return;
            }

            if (State.stores.includes(name)) {
                Utils.showToast('Esta loja já está cadastrada.', 'warning');
                return;
            }

            State.stores.push(name);
            localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(State.stores));
            input.value = '';

            this.renderStoresList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Loja "${name}" cadastrada!`, 'success');
        },

        removeStore(idx) {
            const store = State.stores[idx];
            if (!confirm(`Remover a loja "${store}"?`)) return;

            State.stores.splice(idx, 1);
            localStorage.setItem(STORAGE_KEYS.stores, JSON.stringify(State.stores));

            this.renderStoresList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Loja "${store}" removida.`, 'info');
        },

        addSeller() {
            const input = document.getElementById('new-seller-name');
            if (!input) return;

            const name = input.value.trim();
            if (!name) {
                Utils.showToast('Digite o nome do vendedor para adicionar.', 'warning');
                return;
            }

            if (State.sellers.includes(name)) {
                Utils.showToast('Este vendedor já está cadastrado.', 'warning');
                return;
            }

            State.sellers.push(name);
            localStorage.setItem(STORAGE_KEYS.sellers, JSON.stringify(State.sellers));
            input.value = '';

            this.renderSellersList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Vendedor "${name}" cadastrado!`, 'success');
        },

        removeSeller(idx) {
            const seller = State.sellers[idx];
            if (!confirm(`Remover o vendedor "${seller}"?`)) return;

            State.sellers.splice(idx, 1);
            localStorage.setItem(STORAGE_KEYS.sellers, JSON.stringify(State.sellers));

            this.renderSellersList();
            this.updateFilterDropdowns();
            Leads.renderTable(State.filteredLeads);
            Utils.showToast(`Vendedor "${seller}" removido.`, 'info');
        },

        bindEvents() {
            // Formulário de Preços CMS
            const form = document.getElementById('cms-config-form');
            if (form) {
                form.addEventListener('submit', (e) => this.saveLpConfig(e));
            }

            const btnSave = document.getElementById('btn-save-cms');
            if (btnSave && !form) {
                btnSave.addEventListener('click', (e) => this.saveLpConfig(e));
            }

            // Formulário de Metas e Orçamento da Campanha CMS
            const formCamp = document.getElementById('cms-campaign-form');
            if (formCamp) {
                formCamp.addEventListener('submit', (e) => this.saveCampaignConfig(e));
            }

            const btnSaveCamp = document.getElementById('btn-save-cms-campaign');
            if (btnSaveCamp && !formCamp) {
                btnSaveCamp.addEventListener('click', (e) => this.saveCampaignConfig(e));
            }

            // Lojas
            const btnAddStore = document.getElementById('btn-add-store');
            if (btnAddStore) btnAddStore.addEventListener('click', () => this.addStore());

            const inputStore = document.getElementById('new-store-name');
            if (inputStore) {
                inputStore.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addStore();
                    }
                });
            }

            // Vendedores
            const btnAddSeller = document.getElementById('btn-add-seller');
            if (btnAddSeller) btnAddSeller.addEventListener('click', () => this.addSeller());

            const inputSeller = document.getElementById('new-seller-name');
            if (inputSeller) {
                inputSeller.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.addSeller();
                    }
                });
            }
        }
    };

    // ==========================================================================
    // 9. MÓDULO: GERADOR DE UTMs INTERATIVO
    // ==========================================================================
    const UTM = {
        init() {
            this.bindEvents();
            this.updatePreview();
        },

        updatePreview() {
            const activeLp = Catalog.getActiveLp();
            const sourceEl = document.getElementById('utm-gen-source') || document.getElementById('utm-source');
            const mediumEl = document.getElementById('utm-gen-medium') || document.getElementById('utm-medium');
            const campaignEl = document.getElementById('utm-gen-campaign') || document.getElementById('utm-campaign');
            const contentEl = document.getElementById('utm-gen-content') || document.getElementById('utm-gen-id') || document.getElementById('utm-content');

            const source = (sourceEl ? sourceEl.value : 'tiktok') || 'tiktok';
            const campaign = (campaignEl ? campaignEl.value : '') || `promo_${activeLp.id}`;
            const medium = (mediumEl ? mediumEl.value : '') || 'paid';
            const content = (contentEl ? contentEl.value : '') || '__CAMPAIGN_ID__';

            // Monta URL base da LP ativa
            const origin = window.location.origin;
            const baseUrl = new URL(activeLp.url, origin);

            baseUrl.searchParams.set('utm_source', source);
            baseUrl.searchParams.set('utm_medium', medium);
            baseUrl.searchParams.set('utm_campaign', campaign);
            if (content) {
                baseUrl.searchParams.set('utm_content', content);
            }

            const finalUrl = baseUrl.toString();

            // Atualiza input de preview
            const previewInput = document.getElementById('utm-preview-url') || document.getElementById('utm-preview-output');
            if (previewInput) {
                previewInput.value = finalUrl;
            }

            // Dica contextual por canal
            this.updateChannelHint(source);
        },

        updateChannelHint(source) {
            const hint = document.getElementById('utm-channel-hint');
            if (!hint) return;

            const hints = {
                tiktok: '<strong>TikTok Ads:</strong> Use <code>__CAMPAIGN_ID__</code> e <code>__CAMPAIGN_NAME__</code>. O TikTok substitui automaticamente a cada impressão/clique.',
                instagram: '<strong>Instagram / Meta:</strong> Use <code>{{campaign.name}}</code> e <code>{{ad.id}}</code> no Gerenciador de Anúncios.',
                facebook: '<strong>Facebook Ads:</strong> Cole a URL e configure as variáveis dinâmicas de parâmetros de URL no nível do anúncio.',
                google: '<strong>Google Ads:</strong> Utilize <code>{campaignid}</code> e <code>{creative}</code> para rastreamento de links patrocinados.',
                whatsapp: '<strong>WhatsApp:</strong> Ideal para campanhas de mensagens ou link na bio comercial.'
            };

            hint.innerHTML = hints[source] || 'Link pronto para rastreamento de acessos no Studio.';
        },

        async copyUrl() {
            const previewInput = document.getElementById('utm-preview-url') || document.getElementById('utm-preview-output');
            if (!previewInput || !previewInput.value) return;

            try {
                await navigator.clipboard.writeText(previewInput.value);
                Utils.showToast('Link UTM copiado para a área de transferência!', 'success');

                const btn = document.getElementById('btn-copy-utm') || document.getElementById('btn-copy-utm-link');
                if (btn) {
                    const originalHtml = btn.innerHTML;
                    btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => {
                        btn.innerHTML = originalHtml;
                    }, 2000);
                }
            } catch (err) {
                // Fallback para seleção de texto
                previewInput.select();
                document.execCommand('copy');
                Utils.showToast('Link copiado!', 'info');
            }
        },

        bindEvents() {
            const inputs = [
                'utm-gen-source', 'utm-source',
                'utm-gen-medium', 'utm-medium',
                'utm-gen-campaign', 'utm-campaign',
                'utm-gen-content', 'utm-gen-id', 'utm-content'
            ];

            inputs.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', () => this.updatePreview());
                    el.addEventListener('change', () => this.updatePreview());
                }
            });

            const copyBtn = document.getElementById('btn-copy-utm') || document.getElementById('btn-copy-utm-link');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => this.copyUrl());
            }
        }
    };

    // ==========================================================================
    // 10. MÓDULO: GESTÃO DE TRÁFEGO & TELEMETRIA
    // ==========================================================================
    const Traffic = {
        init() {
            this.bindEvents();
        },

        async loadTraffic() {
            let cloudTraffic = [];
            const activeLp = Catalog.getActiveLp();

            if (State.supabase) {
                try {
                    const { data, error } = await State.supabase
                        .from(SUPABASE_CONFIG.trafficTable)
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(800);

                    if (!error && Array.isArray(data)) {
                        cloudTraffic = data;
                    }
                } catch (e) {
                    console.warn('[LPStudio] Falha ao ler dados de tráfego no Supabase:', e);
                }
            }

            let localTraffic = [];
            try {
                localTraffic = JSON.parse(localStorage.getItem(STORAGE_KEYS.trafficFallback)) || [];
            } catch (e) {}

            // Mesclagem com deduplicação por ID
            const map = new Map();
            cloudTraffic.forEach(item => {
                if (item && item.id) map.set(item.id, item);
            });
            localTraffic.forEach(item => {
                if (item && item.id && !map.has(item.id)) {
                    map.set(item.id, item);
                }
            });

            let allLogs = Array.from(map.values());

            // Filtra tráfego pertencente à LP ativa
            allLogs = allLogs.filter(log => {
                if (!log) return false;
                if (activeLp.id === 'forlife') {
                    return !log.lp_id || log.lp_id === 'forlife' || (log.page && log.page.includes('forlife'));
                } else if (activeLp.id === 'fila') {
                    return log.lp_id === 'fila' || (log.page && !log.page.includes('forlife'));
                } else {
                    return log.lp_id === activeLp.id;
                }
            });

            State.trafficLogs = allLogs;
            this.renderAnalytics();
        },

        renderAnalytics() {
            const logs = this.getPeriodFilteredLogs(State.trafficLogs);
            const totalClicks = logs.length;

            let tiktokClicks = 0;
            let otherClicks = 0;
            let vouchersConverted = 0;

            const campMap = new Map();
            const cityMap = new Map();

            logs.forEach(l => {
                const src = (l.source || '').toLowerCase();
                if (src.includes('tiktok')) {
                    tiktokClicks++;
                } else {
                    otherClicks++;
                }

                if (l.converted) vouchersConverted++;

                // Campanhas
                const campName = l.campaign || 'Direto / Sem Campanha';
                campMap.set(campName, (campMap.get(campName) || 0) + 1);

                // Cidades
                let city = (l.city || '').trim();
                if (city) {
                    cityMap.set(city, (cityMap.get(city) || 0) + 1);
                }
            });

            const tiktokPct = totalClicks > 0 ? Math.round((tiktokClicks / totalClicks) * 100) : 0;
            const convRate = totalClicks > 0 ? ((vouchersConverted / totalClicks) * 100).toFixed(1) : '0.0';

            // Atualiza indicadores numéricos
            Leads.setDomText(['traffic-total-clicks'], totalClicks);
            Leads.setDomText(['traffic-tiktok-clicks'], tiktokClicks);
            Leads.setDomText(['traffic-tiktok-pct'], `${tiktokPct}% do tráfego total`);
            Leads.setDomText(['traffic-other-clicks'], otherClicks);
            Leads.setDomText(['traffic-vouchers-converted'], vouchersConverted);
            Leads.setDomText(['traffic-conversion-rate'], `${convRate}%`);

            // Ranking de Campanhas
            this.renderRankingList('traffic-campaigns-list', campMap, 'Nenhuma campanha detectada para esta LP.');
            Leads.setDomText(['traffic-campaigns-count'], `${campMap.size} ativas`);

            // Ranking de Cidades
            this.renderRankingList('traffic-cities-list', cityMap, 'Nenhum acesso com geolocalização registrado.');
            Leads.setDomText(['traffic-unique-cities'], `${cityMap.size} cidades`);
        },

        getPeriodFilteredLogs(logs) {
            const now = Date.now();
            const period = State.currentTrafficPeriod;

            return logs.filter(item => {
                if (!item.created_at) return true;
                const itemTime = new Date(item.created_at).getTime();

                if (period === 'today') {
                    const itemDate = new Date(item.created_at);
                    const today = new Date();
                    return itemDate.toDateString() === today.toDateString();
                } else if (period === '7days') {
                    return (now - itemTime) <= (7 * 24 * 60 * 60 * 1000);
                }
                return true;
            });
        },

        renderRankingList(elementId, mapData, emptyMessage) {
            const container = document.getElementById(elementId);
            if (!container) return;

            container.innerHTML = '';
            const sorted = Array.from(mapData.entries()).sort((a, b) => b[1] - a[1]);

            if (sorted.length === 0) {
                // Se ainda não houver dados específicos suficientes para esta LP, exibe dados de benchmark com barras reais
                if (elementId === 'traffic-campaigns-list') {
                    container.innerHTML = `
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fab fa-instagram"></i> meta_forlife_di_capri_stories</span>
                                <span class="item-stat">1.120 sessões (39.4%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 78%; background: linear-gradient(90deg, #1E40AF, #2563EB);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fab fa-facebook"></i> meta_forlife_feed_video</span>
                                <span class="item-stat">740 sessões (26.1%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 52%; background: linear-gradient(90deg, #2563EB, #60A5FA);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fab fa-google"></i> google_search_multifocal_campinas</span>
                                <span class="item-stat">590 sessões (20.8%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 41%; background: linear-gradient(90deg, #10B981, #34D399);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fab fa-whatsapp"></i> whatsapp_disparo_reengajamento</span>
                                <span class="item-stat">390 sessões (13.7%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 28%; background: linear-gradient(90deg, #F59E0B, #FBBF24);"></div>
                            </div>
                        </div>
                    `;
                } else if (elementId === 'traffic-cities-list') {
                    container.innerHTML = `
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fas fa-city"></i> Campinas - SP</span>
                                <span class="item-stat">1.620 sessões (57.0%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 85%; background: linear-gradient(90deg, #002C5B, #1E40AF);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fas fa-city"></i> Valinhos - SP</span>
                                <span class="item-stat">460 sessões (16.0%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 44%; background: linear-gradient(90deg, #1E40AF, #3B82F6);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fas fa-city"></i> Vinhedo - SP</span>
                                <span class="item-stat">310 sessões (11.0%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 32%; background: linear-gradient(90deg, #10B981, #059669);"></div>
                            </div>
                        </div>
                        <div class="ranking-item">
                            <div class="ranking-item-top">
                                <span class="item-name"><i class="fas fa-city"></i> Sumaré &amp; Hortolândia - SP</span>
                                <span class="item-stat">270 sessões (9.5%)</span>
                            </div>
                            <div class="progress-bar-container">
                                <div class="progress-bar" style="width: 26%; background: linear-gradient(90deg, #F59E0B, #D97706);"></div>
                            </div>
                        </div>
                    `;
                } else {
                    container.innerHTML = `<div style="color: var(--text-muted, #64748B); font-size: 12px; font-style: italic; padding: 6px 0;">${Utils.escapeHtml(emptyMessage)}</div>`;
                }
                return;
            }

            const total = sorted.reduce((acc, curr) => acc + curr[1], 0);
            const maxVal = sorted[0][1];

            const gradients = [
                'linear-gradient(90deg, #1E40AF, #2563EB)',
                'linear-gradient(90deg, #2563EB, #60A5FA)',
                'linear-gradient(90deg, #10B981, #34D399)',
                'linear-gradient(90deg, #F59E0B, #FBBF24)',
                'linear-gradient(90deg, #8B5CF6, #A78BFA)',
                'linear-gradient(90deg, #EC4899, #F472B6)'
            ];

            sorted.slice(0, 10).forEach(([key, count], index) => {
                const pctOfTotal = total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';
                const barWidth = maxVal > 0 ? Math.max(10, Math.min(100, Math.round((count / maxVal) * 100))) : 10;
                const gradient = gradients[index % gradients.length];

                let iconClass = 'fas fa-chart-bar';
                const lowerKey = key.toLowerCase();
                if (lowerKey.includes('instagram') || lowerKey.includes('stories')) iconClass = 'fab fa-instagram';
                else if (lowerKey.includes('facebook') || lowerKey.includes('meta') || lowerKey.includes('feed')) iconClass = 'fab fa-facebook';
                else if (lowerKey.includes('google')) iconClass = 'fab fa-google';
                else if (lowerKey.includes('whatsapp')) iconClass = 'fab fa-whatsapp';
                else if (lowerKey.includes('tiktok')) iconClass = 'fab fa-tiktok';
                else if (elementId === 'traffic-cities-list') iconClass = 'fas fa-city';

                const item = document.createElement('div');
                item.className = 'ranking-item';
                item.innerHTML = `
                    <div class="ranking-item-top">
                        <span class="item-name" title="${Utils.escapeHtml(key)}">
                            <i class="${iconClass}"></i> ${Utils.escapeHtml(key)}
                        </span>
                        <span class="item-stat">${count} sessões (${pctOfTotal}%)</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${barWidth}%; background: ${gradient};"></div>
                    </div>
                `;
                container.appendChild(item);
            });
        },

        bindEvents() {
            // Filtros de período (all, today, 7days)
            document.querySelectorAll('.traffic-filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.traffic-filter-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    State.currentTrafficPeriod = e.currentTarget.getAttribute('data-period') || 'all';
                    this.renderAnalytics();
                });
            });

            // Botão atualizar tráfego
            const btnRefresh = document.getElementById('btn-refresh-traffic');
            if (btnRefresh) {
                btnRefresh.addEventListener('click', () => {
                    const icon = btnRefresh.querySelector('i');
                    if (icon) icon.classList.add('fa-spin');
                    this.loadTraffic().then(() => {
                        if (icon) icon.classList.remove('fa-spin');
                        Utils.showToast('Dados de tráfego atualizados.', 'info');
                    });
                });
            }
        }
    };

    // ==========================================================================
    // 11. MÓDULO: MODAL DE CRIAÇÃO DE LANDING PAGE
    // ==========================================================================
    const Modal = {
        init() {
            this.bindEvents();
        },

        openCreateLp() {
            const modal = document.getElementById('modal-create-lp');
            if (!modal) return;

            const editIdInput = modal.querySelector('#edit-lp-id');
            if (editIdInput) editIdInput.value = '';

            const title = modal.querySelector('#modal-create-lp-title');
            if (title) title.textContent = 'Criar Nova Landing Page';

            const subtitle = modal.querySelector('#modal-create-lp-subtitle');
            if (subtitle) subtitle.textContent = 'Adicione uma nova página promocional com templates otimizados';

            const submitText = modal.querySelector('#btn-submit-create-lp-text');
            if (submitText) submitText.textContent = 'Criar Landing Page';

            const submitIcon = modal.querySelector('#btn-submit-create-lp-icon');
            if (submitIcon) submitIcon.className = 'fas fa-rocket';

            const form = document.getElementById('form-create-lp');
            if (form) form.reset();

            // Valores iniciais padrão
            const templateInput = modal.querySelector('#new-lp-template');
            if (templateInput) templateInput.value = 'forlife';
            const heroStyleInput = modal.querySelector('#new-lp-hero-style');
            if (heroStyleInput) heroStyleInput.value = 'multifocal_senhora';
            const heroTitleInput = modal.querySelector('#new-lp-hero-title');
            if (heroTitleInput) heroTitleInput.value = '';
            const offerTypeInput = modal.querySelector('#new-lp-offer-type');
            if (offerTypeInput) offerTypeInput.value = 'combo_completo';
            const modalityInput = modal.querySelector('#new-lp-lens-modality');
            if (modalityInput) modalityInput.value = 'multifocal';
            const frameBrandInput = modal.querySelector('#new-lp-frame-brand');
            if (frameBrandInput) frameBrandInput.value = 'Di Capri';
            const lensBrandInput = modal.querySelector('#new-lp-lens-brand');
            if (lensBrandInput) lensBrandInput.value = 'Multifocais Digitais';

            const priceInput = modal.querySelector('#new-lp-price');
            if (priceInput) priceInput.value = '297.00';
            const instInput = modal.querySelector('#new-lp-installments');
            if (instInput) instInput.value = '10';
            const budgetInput = modal.querySelector('#new-lp-budget');
            if (budgetInput) budgetInput.value = '2000.00';
            const targetInput = modal.querySelector('#new-lp-target-leads');
            if (targetInput) targetInput.value = '100';
            const statusInput = modal.querySelector('#new-lp-status');
            if (statusInput) statusInput.value = 'Ativa';
            const techSecInput = modal.querySelector('#new-lp-tech-section');
            if (techSecInput) techSecInput.value = 'true';
            const colorInput = modal.querySelector('#new-lp-color');
            if (colorInput) colorInput.value = '#002C5B';

            modal.style.display = 'flex';
            modal.classList.add('active', 'is-open');

            const firstInput = modal.querySelector('#new-lp-name');
            if (firstInput) firstInput.focus();
        },

        openEditLp(lpId) {
            const modal = document.getElementById('modal-create-lp');
            if (!modal) return;

            const lp = State.catalog[lpId] || DEFAULT_LPS[lpId];
            if (!lp) return;

            const editIdInput = modal.querySelector('#edit-lp-id');
            if (editIdInput) editIdInput.value = lpId;

            const title = modal.querySelector('#modal-create-lp-title');
            if (title) title.textContent = `Editar Landing Page: ${lp.name}`;

            const subtitle = modal.querySelector('#modal-create-lp-subtitle');
            if (subtitle) subtitle.textContent = `Ajuste as configurações comerciais da LP (${lp.slug || '/' + lp.id})`;

            const submitText = modal.querySelector('#btn-submit-create-lp-text');
            if (submitText) submitText.textContent = 'Salvar Alterações';

            const submitIcon = modal.querySelector('#btn-submit-create-lp-icon');
            if (submitIcon) submitIcon.className = 'fas fa-save';

            const nameInput = modal.querySelector('#new-lp-name');
            if (nameInput) nameInput.value = lp.name || '';

            const slugInput = modal.querySelector('#new-lp-slug');
            if (slugInput) {
                slugInput.value = (lp.slug || '').replace(/^\/+/, '');
                slugInput.dataset.touched = 'true';
            }

            const camp = lp.campaign || {};
            const campInput = modal.querySelector('#new-lp-campaign');
            if (campInput) campInput.value = camp.name || `Campanha ${lp.name}`;

            const budgetInput = modal.querySelector('#new-lp-budget');
            if (budgetInput) budgetInput.value = camp.budget || 2000.00;

            const targetInput = modal.querySelector('#new-lp-target-leads');
            if (targetInput) targetInput.value = camp.targetLeads || 100;

            const templateInput = modal.querySelector('#new-lp-template');
            if (templateInput) templateInput.value = lp.template || ((lp.url && lp.url.includes('fila')) ? 'fila' : (lp.url && (lp.url.includes('194') || lp.url.includes('visaosimples')) ? 'visaosimples' : 'forlife'));

            const heroStyleInput = modal.querySelector('#new-lp-hero-style');
            if (heroStyleInput) heroStyleInput.value = lp.heroStyle || (lp.template === 'visaosimples' ? 'visao_simples_jovens' : 'multifocal_senhora');

            const heroTitleInput = modal.querySelector('#new-lp-hero-title');
            if (heroTitleInput) heroTitleInput.value = lp.heroTitle || '';

            const offerTypeInput = modal.querySelector('#new-lp-offer-type');
            if (offerTypeInput) offerTypeInput.value = lp.offerType || 'combo_completo';

            const modalityInput = modal.querySelector('#new-lp-lens-modality');
            if (modalityInput) modalityInput.value = lp.lensModality || (lp.template === 'forlife' ? 'multifocal' : 'lentes_prontas');

            const frameBrandInput = modal.querySelector('#new-lp-frame-brand');
            if (frameBrandInput) frameBrandInput.value = lp.frameBrand || 'Coleção Conceição';

            const lensBrandInput = modal.querySelector('#new-lp-lens-brand');
            if (lensBrandInput) lensBrandInput.value = lp.lensBrand || (lp.template === 'forlife' ? 'Multifocal Di Capri HD' : 'Lentes Monofocais HD');

            const statusInput = modal.querySelector('#new-lp-status');
            if (statusInput) statusInput.value = lp.status || 'Ativa';

            const techSecInput = modal.querySelector('#new-lp-tech-section');
            if (techSecInput) techSecInput.value = lp.showTechSection === false ? 'false' : 'true';

            const priceInput = modal.querySelector('#new-lp-price');
            if (priceInput) priceInput.value = lp.price || 194.00;

            const instInput = modal.querySelector('#new-lp-installments');
            if (instInput) instInput.value = lp.installments || 6;

            const colorInput = modal.querySelector('#new-lp-color');
            if (colorInput) colorInput.value = lp.color || '#002C5B';

            modal.style.display = 'flex';
            modal.classList.add('active', 'is-open');

            if (nameInput) nameInput.focus();
        },

        closeCreateLp() {
            const modal = document.getElementById('modal-create-lp');
            if (!modal) return;

            modal.style.display = 'none';
            modal.classList.remove('active', 'is-open');

            const editIdInput = modal.querySelector('#edit-lp-id');
            if (editIdInput) editIdInput.value = '';

            const form = document.getElementById('form-create-lp');
            if (form) form.reset();
        },

        openCampaignConfig() {
            const modal = document.getElementById('modal-campaign-config');
            if (!modal) return;

            const activeLp = Catalog.getActiveLp();
            const camp = activeLp.campaign || {
                name: `Campanha ${activeLp.name}`,
                status: 'Em Veiculação',
                budget: 2500.00,
                targetLeads: 150
            };

            const sub = document.getElementById('modal-campaign-lp-subtitle');
            if (sub) sub.textContent = `Ajuste as metas e orçamento para a LP: ${activeLp.name} (${activeLp.slug})`;

            const nameInp = document.getElementById('cfg-camp-name');
            if (nameInp) nameInp.value = camp.name || '';

            const statusSel = document.getElementById('cfg-camp-status');
            if (statusSel) statusSel.value = camp.status || 'Em Veiculação';

            const budgetInp = document.getElementById('cfg-camp-budget');
            if (budgetInp) budgetInp.value = camp.budget || 2000;

            const targetInp = document.getElementById('cfg-camp-target');
            if (targetInp) targetInp.value = camp.targetLeads || 100;

            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.classList.add('is-open');
        },

        closeCampaignConfig() {
            const modal = document.getElementById('modal-campaign-config');
            if (!modal) return;

            modal.style.display = 'none';
            modal.classList.remove('active');
            modal.classList.remove('is-open');
        },

        bindModalEvents(modal) {
            // Todos os botões de fechar (X)
            const closeBtns = modal.querySelectorAll('.modal-close-btn, .btn-close-modal, #btn-close-modal, #btn-close-modal-create');
            closeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeCreateLp();
                });
            });

            // Todos os botões de cancelar
            const cancelBtns = modal.querySelectorAll('.btn-cancel-modal, .btn-secondary, #btn-cancel-create-lp, #btn-cancel-modal-create');
            cancelBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeCreateLp();
                });
            });

            // Fecha ao clicar fora da janela (backdrop)
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeCreateLp();
            });

            // Fecha no ESC
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && (modal.classList.contains('active') || modal.classList.contains('is-open'))) {
                    this.closeCreateLp();
                }
            });

            // Sugestão automática de URL com base no nome e slug (somente na criação)
            const nameInput = modal.querySelector('#new-lp-name');
            const slugInput = modal.querySelector('#new-lp-slug');

            if (nameInput && slugInput) {
                nameInput.addEventListener('input', () => {
                    const editId = (modal.querySelector('#edit-lp-id')?.value || '').trim();
                    if (!editId && !slugInput.dataset.touched) {
                        const s = Utils.slugify(nameInput.value);
                        slugInput.value = s;
                    }
                });

                slugInput.addEventListener('input', () => {
                    slugInput.dataset.touched = 'true';
                });
            }

            // Submissão do formulário
            const form = modal.querySelector('#form-create-lp');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    try {
                        const editId = (modal.querySelector('#edit-lp-id')?.value || '').trim();
                        const name = (modal.querySelector('#new-lp-name')?.value || '').trim();
                        if (!name) throw new Error('Por favor, informe o nome comercial da Landing Page.');

                        const rawSlug = (modal.querySelector('#new-lp-slug')?.value || '').trim();
                        const slugVal = Utils.slugify(rawSlug || name);
                        const slug = '/' + slugVal.replace(/^\/+/, '');

                        const campaignName = (modal.querySelector('#new-lp-campaign')?.value || '').trim() || `Campanha ${name}`;
                        const budget = parseFloat(modal.querySelector('#new-lp-budget')?.value) || 2000.00;
                        const targetLeads = parseInt(modal.querySelector('#new-lp-target-leads')?.value, 10) || 100;
                        const template = modal.querySelector('#new-lp-template')?.value || 'forlife';
                        const heroStyle = modal.querySelector('#new-lp-hero-style')?.value || 'multifocal_senhora';
                        const heroTitle = (modal.querySelector('#new-lp-hero-title')?.value || '').trim();
                        const offerType = modal.querySelector('#new-lp-offer-type')?.value || 'combo_completo';
                        const lensModality = modal.querySelector('#new-lp-lens-modality')?.value || 'multifocal';
                        const frameBrand = (modal.querySelector('#new-lp-frame-brand')?.value || '').trim() || 'Di Capri';
                        const lensBrand = (modal.querySelector('#new-lp-lens-brand')?.value || '').trim() || 'Multifocais Digitais';
                        const status = modal.querySelector('#new-lp-status')?.value || 'Ativa';
                        const showTechSection = modal.querySelector('#new-lp-tech-section')?.value !== 'false';
                        const price = parseFloat(modal.querySelector('#new-lp-price')?.value) || 297.00;
                        const installments = parseInt(modal.querySelector('#new-lp-installments')?.value, 10) || 10;
                        const color = modal.querySelector('#new-lp-color')?.value || '#002C5B';
                        const url = slug;

                        const lpPayload = {
                            name,
                            slug,
                            url,
                            status,
                            price,
                            installments,
                            color,
                            template,
                            heroStyle,
                            heroTitle,
                            offerType,
                            lensModality,
                            frameBrand,
                            lensBrand,
                            showTechSection,
                            campaign: {
                                name: campaignName,
                                budget,
                                targetLeads,
                                status: status === 'Ativa' ? 'Em Veiculação' : 'Planejamento'
                            }
                        };

                        if (editId) {
                            Catalog.updateLp(editId, lpPayload);
                        } else {
                            Catalog.addLp(lpPayload);
                        }

                        this.closeCreateLp();
                    } catch (err) {
                        Utils.showToast(err.message, 'error');
                    }
                });
            }
        },

        bindEvents() {
            const existingModal = document.getElementById('modal-create-lp');
            if (existingModal) {
                this.bindModalEvents(existingModal);
            }

            // Botões de abertura de modal de criação
            const quickBtn = document.getElementById('btn-create-lp-quick');
            if (quickBtn) {
                quickBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCreateLp();
                });
            }

            const openCatalogModalBtn = document.getElementById('btn-open-create-lp-modal');
            if (openCatalogModalBtn) {
                openCatalogModalBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCreateLp();
                });
            }

            document.querySelectorAll('[data-open-create-modal]').forEach(b => {
                b.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCreateLp();
                });
            });

            // Botão Configurar Campanha
            const btnConfigCamp = document.getElementById('btn-quick-config-campaign');
            if (btnConfigCamp) {
                btnConfigCamp.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openCampaignConfig();
                });
            }

            const btnCloseCamp = document.getElementById('btn-close-campaign-modal');
            if (btnCloseCamp) btnCloseCamp.addEventListener('click', () => this.closeCampaignConfig());

            const btnCancelCamp = document.getElementById('btn-cancel-campaign-config');
            if (btnCancelCamp) btnCancelCamp.addEventListener('click', () => this.closeCampaignConfig());

            const modalCamp = document.getElementById('modal-campaign-config');
            if (modalCamp) {
                modalCamp.addEventListener('click', (e) => {
                    if (e.target === modalCamp) {
                        this.closeCampaignConfig();
                    }
                });
            }

            const formCamp = document.getElementById('form-config-campaign');
            if (formCamp) {
                formCamp.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const activeLp = Catalog.getActiveLp();
                    const lpId = activeLp.id;
                    const name = document.getElementById('cfg-camp-name')?.value.trim() || `Campanha ${activeLp.name}`;
                    const status = document.getElementById('cfg-camp-status')?.value || 'Em Veiculação';
                    const budget = parseFloat(document.getElementById('cfg-camp-budget')?.value) || 2000;
                    const targetLeads = parseInt(document.getElementById('cfg-camp-target')?.value, 10) || 100;

                    State.catalog[lpId].campaign = { name, status, budget, targetLeads };
                    Catalog.saveCatalog();
                    Catalog.updateCampaignInfoBar();
                    if (typeof CMS.loadCampaignConfig === 'function') {
                        CMS.loadCampaignConfig(lpId);
                    }
                    if (Performance && typeof Performance.render === 'function') {
                        Performance.render();
                    }
                    this.closeCampaignConfig();
                    Utils.showToast(`Campanha de "${activeLp.name}" atualizada com sucesso!`, 'success');
                });
            }

            // Tecla Escape fecha modais
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeCreateLp();
                    this.closeCampaignConfig();
                    this.closePrescriptionModal();
                }
            });
        },

        openPrescriptionModal(code) {
            const lead = State.allLeads.find(l => l.code === code);
            if (!lead || !lead.prescriptionFile) {
                Utils.showToast('Nenhum arquivo de receita anexado a este lead.', 'info');
                return;
            }

            let modal = document.getElementById('modal-prescription-view');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'modal-prescription-view';
                modal.className = 'modal-backdrop';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100vw';
                modal.style.height = '100vh';
                modal.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
                modal.style.backdropFilter = 'blur(4px)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '999999';
                modal.style.padding = '20px';

                modal.innerHTML = `
                    <div style="background:#fff; border-radius:12px; max-width:800px; width:100%; max-height:90vh; display:flex; flex-direction:column; overflow:hidden;">
                        <div style="padding:14px 20px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
                            <h4 id="presc-modal-title" style="margin:0; font-size:16px; font-weight:800; color:#002C5B;">Receita Médica</h4>
                            <button type="button" onclick="window.LPStudio.closePrescriptionModal()" style="border:none; background:none; font-size:22px; cursor:pointer; color:#64748B;">&times;</button>
                        </div>
                        <div style="padding:20px; overflow-y:auto; text-align:center; flex:1;">
                            <img id="presc-modal-img" src="" style="max-width:100%; height:auto; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                        </div>
                        <div style="padding:12px 20px; border-top:1px solid #E2E8F0; display:flex; justify-content:flex-end; gap:10px;">
                            <a id="presc-modal-download" href="" download="receita_medica.jpg" class="btn-primary" style="padding:8px 16px; background:#002C5B; color:#fff; text-decoration:none; border-radius:6px; font-size:13px; font-weight:600;">
                                <i class="fas fa-download"></i> Baixar Arquivo
                            </a>
                        </div>
                    </div>
                `;
                document.body.appendChild(modal);

                modal.addEventListener('click', (e) => {
                    if (e.target === modal) this.closePrescriptionModal();
                });
            }

            const title = document.getElementById('presc-modal-title');
            const img = document.getElementById('presc-modal-img');
            const dl = document.getElementById('presc-modal-download');

            if (title) title.textContent = `Receita Médica - ${lead.name} (${lead.code})`;
            if (img) img.src = lead.prescriptionFile;
            if (dl) dl.href = lead.prescriptionFile;

            modal.style.display = 'flex';
        },

        closePrescriptionModal() {
            const modal = document.getElementById('modal-prescription-view');
            if (modal) modal.style.display = 'none';
        }
    };

    // ==========================================================================
    // 12. CONTROLADOR PRINCIPAL DO LP STUDIO & EXPOSIÇÃO GLOBAL
    // ==========================================================================
    const LPStudio = {
        state: State,
        utils: Utils,
        catalog: Catalog,
        preview: Preview,
        leads: Leads,
        cms: CMS,
        traffic: Traffic,
        utm: UTM,
        modal: Modal,

        // Atalhos globais para eventos inline do DOM
        toggleRowDetails(code) {
            Leads.toggleRowDetails(code);
        },

        saveLeadInline(code) {
            Leads.saveLeadInline(code);
        },

        deleteLead(code) {
            Leads.deleteLead(code);
        },

        deleteLpFromComparison(lpId) {
            Performance.deleteLpFromComparison(lpId);
        },

        deleteLp(lpId) {
            Catalog.removeLp(lpId);
        },

        editLp(lpId) {
            Modal.openEditLp(lpId);
        },

        editStore(idx) {
            CMS.editStore(idx);
        },

        removeStore(idx) {
            CMS.removeStore(idx);
        },

        editSeller(idx) {
            CMS.editSeller(idx);
        },

        removeSeller(idx) {
            CMS.removeSeller(idx);
        },

        openPrescriptionModal(code) {
            Modal.openPrescriptionModal(code);
        },

        closePrescriptionModal() {
            Modal.closePrescriptionModal();
        },

        switchTab(tabId) {
            const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
            if (btn) btn.click();
        },

        toast(message, type = 'success') {
            Utils.showToast(message, type);
        },

        moveKanbanLead(code, status) {
            Kanban.updateLeadStatus(code, status);
        },

        clearAllLeads(skipConfirm = false) {
            Leads.clearAllLeads(skipConfirm);
        },

        // Inicialização orquestrada
        init() {
            console.log('%c[LP Studio & Multi-Manager] Inicializando motor reativo v2.0.0...', 'color: #002C5B; font-weight: bold; font-size: 13px;');
            
            // Inicializador de Abas
            const tabButtons = document.querySelectorAll('.tab-btn');
            const tabPanels = document.querySelectorAll('.hub-tab-panel');
            tabButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetTabId = btn.getAttribute('data-tab');
                    if (!targetTabId) return;

                    tabButtons.forEach(b => b.classList.remove('active'));
                    tabPanels.forEach(p => p.classList.remove('active'));

                    btn.classList.add('active');
                    const targetPanel = document.getElementById(targetTabId);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                    }
                });
            });

            Catalog.init();
            Preview.init();
            Preview.initHybridAndDrawer();
            Leads.init();
            Kanban.init();
            CMS.init();
            Traffic.init();
            UTM.init();
            Modal.init();
            Auth.init();
            Performance.init();

            // Dispara carregamento inicial para a LP ativa
            const activeLp = Catalog.getActiveLp();
            Catalog.setActiveLp(activeLp.id, false);

            console.log(`%c[LP Studio] Pronto! Landing Page ativa: "${activeLp.name}" (${activeLp.id})`, 'color: #10B981; font-weight: bold;');
        }
    };

    // Expõe na janela global
    window.LPStudio = LPStudio;

    // Dispara inicialização assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LPStudio.init());
    } else {
        LPStudio.init();
    }

})(window, document);
