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
            url: '/forlife/index.html',
            slug: '/forlife',
            status: 'Ativa',
            color: '#002C5B',
            price: 297.00,
            installments: 10,
            description: 'Combo Multifocal Digital com armação Di Capri e garantia estendida.'
        },
        fila: {
            id: 'fila',
            name: 'Óculos Completo FILA',
            url: '/index.html',
            slug: '/',
            status: 'Ativa',
            color: '#001A36',
            price: 199.00,
            installments: 10,
            description: 'Armação esportiva FILA original com lentes graduadas completas.'
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
            description: 'Tecnologia Essilor de adaptação postural e ampliação de campo visual.'
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
            description: 'Lentes de alta precisão alemã com proteção contra luz azul nociva.'
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
    const Catalog = {
        init() {
            this.loadCatalog();
            this.determineInitialActiveLp();
            this.populateSelector();
            this.renderCatalogGrid();
            this.bindEvents();
        },

        loadCatalog() {
            try {
                const storedCatalog = localStorage.getItem(STORAGE_KEYS.catalog);
                const customLps = storedCatalog ? JSON.parse(storedCatalog) : {};
                
                // Mescla os padrões com os customizados
                State.catalog = {
                    ...DEFAULT_LPS,
                    ...customLps
                };
            } catch (err) {
                console.error('[LPStudio] Erro ao carregar catálogo de LPs:', err);
                State.catalog = { ...DEFAULT_LPS };
            }
        },

        saveCatalog() {
            try {
                // Filtra as customizadas para persistir
                const customLps = {};
                Object.keys(State.catalog).forEach(key => {
                    if (!DEFAULT_LPS[key] || State.catalog[key].custom) {
                        customLps[key] = State.catalog[key];
                    }
                });
                localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(customLps));
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
            Preview.updateIframe(activeLp);
            Preview.updateUiInfo(activeLp);
            CMS.loadLpConfig(lpId);
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

            const lp = {
                id,
                name: newLpData.name.trim(),
                url: newLpData.url.trim(),
                slug: newLpData.slug ? (newLpData.slug.startsWith('/') ? newLpData.slug : `/${newLpData.slug}`) : `/${id}`,
                status: newLpData.status || 'Ativa',
                color: newLpData.color || '#002C5B',
                price: parseFloat(newLpData.price) || 297.00,
                installments: parseInt(newLpData.installments, 10) || 10,
                description: newLpData.description || 'Nova landing page cadastrada no Studio.',
                custom: true
            };

            State.catalog[id] = lp;
            this.saveCatalog();
            this.populateSelector();
            this.renderCatalogGrid();
            this.setActiveLp(id);

            Utils.showToast(`Landing Page "${lp.name}" criada com sucesso!`, 'success');
            return lp;
        },

        removeLp(lpId) {
            if (DEFAULT_LPS[lpId]) {
                Utils.showToast('Landing pages padrão do sistema não podem ser excluídas.', 'warning');
                return false;
            }

            if (!State.catalog[lpId]) return false;

            const lpName = State.catalog[lpId].name;
            if (!confirm(`Deseja realmente remover a Landing Page "${lpName}" do catálogo?`)) {
                return false;
            }

            delete State.catalog[lpId];
            this.saveCatalog();

            if (State.activeLpId === lpId) {
                this.setActiveLp('forlife');
            } else {
                this.populateSelector();
                this.renderCatalogGrid();
            }

            Utils.showToast(`Landing Page "${lpName}" removida.`, 'info');
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
                        <a href="${lp.url}" target="_blank" class="btn-card-external" title="Abrir URL Externa">
                            <i class="fas fa-external-link-alt"></i>
                        </a>
                        ${!isDefault ? `
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

        updateIframe(lp) {
            const iframe = document.getElementById('preview-iframe');
            if (!iframe || !lp) return;

            // Evita recarregar se o src já for exatamente o mesmo
            const targetUrl = new URL(lp.url, window.location.origin).href;
            if (iframe.src !== targetUrl) {
                iframe.src = lp.url;
            }
        },

        updateUiInfo(lp) {
            if (!lp) return;

            // URL display
            const urlDisplay = document.getElementById('preview-url-display');
            if (urlDisplay) {
                const fullUrl = new URL(lp.url, window.location.origin).href;
                if (urlDisplay.tagName === 'INPUT' || urlDisplay.tagName === 'TEXTAREA') {
                    urlDisplay.value = fullUrl;
                } else {
                    urlDisplay.textContent = fullUrl;
                    urlDisplay.title = fullUrl;
                }
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
                btnOpen.href = lp.url;
                btnOpen.target = '_blank';
            }
        },

        setViewport(viewportKey) {
            const preset = VIEWPORT_PRESETS[viewportKey] || VIEWPORT_PRESETS.desktop;
            State.activeViewport = viewportKey;

            const container = document.querySelector('.preview-frame-wrapper') || 
                              document.querySelector('.preview-wrapper') || 
                              document.getElementById('preview-iframe-container');
            const iframe = document.getElementById('preview-iframe');

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
            const iframe = document.getElementById('preview-iframe');
            const btn = document.getElementById('btn-reload-iframe');

            if (!iframe) return;

            let icon = null;
            if (btn) {
                icon = btn.querySelector('i');
                if (icon) icon.classList.add('fa-spin');
            }

            try {
                iframe.contentWindow.location.reload();
            } catch (e) {
                // Fallback para cross-origin
                const currentSrc = iframe.src;
                iframe.src = '';
                iframe.src = currentSrc;
            }

            setTimeout(() => {
                if (icon) icon.classList.remove('fa-spin');
                Utils.showToast('Preview recarregado.', 'info');
            }, 600);
        },

        bindEvents() {
            // Cliques nos botões data-viewport
            document.addEventListener('click', (e) => {
                const vpBtn = e.target.closest('[data-viewport]');
                if (vpBtn) {
                    const vp = vpBtn.getAttribute('data-viewport');
                    this.setViewport(vp);
                }
            });

            // Botão de recarregar iframe
            const btnReload = document.getElementById('btn-reload-iframe');
            if (btnReload) {
                btnReload.addEventListener('click', () => this.reloadIframe());
            }
        }
    };

    // ==========================================================================
    // 6. MÓDULO: GESTÃO DE LEADS COM SUPABASE & FALLBACK
    // ==========================================================================
    const Leads = {
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

            const leadLp = lead.lp_id || lead.lpId;

            if (lpId === 'forlife') {
                return !leadLp || leadLp === 'forlife';
            } else if (lpId === 'fila') {
                return leadLp === 'fila';
            } else {
                return leadLp === lpId;
            }
        },

        async loadLeads() {
            const tbody = document.getElementById('leads-table-body');
            if (tbody) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="13" style="text-align: center; padding: 40px; color: var(--text-muted, #64748B);">
                            <i class="fas fa-spinner fa-spin"></i> Carregando leads da campanha...
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

            // 3. Mescla e desduplica leads
            let merged = [];
            if (loadedFromCloud) {
                merged = cloudLeads.filter(l => !l.code || !deletedCodes.has(l.code));

                const cloudCodes = new Set(merged.map(l => l.code));
                localLeads.forEach(loc => {
                    const norm = this.normalizeLead(loc);
                    if (norm.code && !cloudCodes.has(norm.code) && !deletedCodes.has(norm.code)) {
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
                    .filter(l => !l.code || !deletedCodes.has(l.code));
            }

            State.allLeads = merged;

            // 4. Aplica filtros e renderiza
            this.applyFilters();
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
                lp_id: l.lp_id || l.lpId || 'forlife'
            };
        },

        applyFilters() {
            const activeLpId = State.activeLpId;
            const searchInput = document.getElementById('search-leads');
            const filterStore = document.getElementById('filter-store');
            const filterSeller = document.getElementById('filter-seller');
            const filterStatus = document.getElementById('filter-status');

            const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
            const storeVal = (filterStore ? filterStore.value : '').trim();
            const sellerVal = (filterSeller ? filterSeller.value : '').trim();
            const statusVal = (filterStatus ? filterStatus.value : '').trim();

            State.filteredLeads = State.allLeads.filter(lead => {
                // 1. Filtro de LP Ativa
                if (!this.belongsToLp(lead, activeLpId)) return false;

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

            this.renderTable(State.filteredLeads);
            this.updateKpis(State.filteredLeads);
        },

        renderTable(leads) {
            const tbody = document.getElementById('leads-table-body');
            const countDisplay = document.getElementById('tab-leads-count');
            if (countDisplay) countDisplay.textContent = leads.length;

            if (!tbody) return;

            if (leads.length === 0) {
                const lp = Catalog.getActiveLp();
                tbody.innerHTML = `
                    <tr>
                        <td colspan="13" style="text-align: center; padding: 40px; color: var(--text-muted, #64748B); font-size: 14px;">
                            Nenhum lead encontrado para a campanha <strong>${Utils.escapeHtml(lp.name)}</strong> com os filtros aplicados.
                        </td>
                    </tr>
                `;
                return;
            }

            tbody.innerHTML = '';
            leads.forEach((lead, index) => {
                const cleanPhone = Utils.cleanDigits(lead.phone);
                const isChecked = State.selectedLeadCodes.has(lead.code);

                // Tecnologias / Adicionais
                const addonsHtml = (lead.addons && lead.addons.length > 0)
                    ? lead.addons.map(a => `<span class="badge-addon" style="display:inline-block; background:#EDF2F7; color:#1E293B; padding:2px 6px; border-radius:4px; font-size:11px; margin:1px;">${Utils.escapeHtml(a.name || a)}</span>`).join(' ')
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
                const saleStatuses = ['Pendente', 'Em Atendimento', 'Vendido', 'Perdido'];
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
                    <td style="font-size: 12px; color: var(--text-muted, #64748B); white-space: nowrap;">${Utils.escapeHtml(lead.date)}</td>
                    <td style="font-weight: 700; color: #002C5B; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${Utils.escapeHtml(lead.name)}">
                        ${Utils.escapeHtml(lead.name)}
                    </td>
                    <td style="text-align: center;">
                        <a href="https://api.whatsapp.com/send?phone=55${cleanPhone}&text=${encodeURIComponent(`Olá ${lead.name}! Aqui é da Ópticas Conceição. Recebemos seu voucher com o código ${lead.code}. Como podemos ajudar com seus novos óculos?`)}" target="_blank" class="btn-whatsapp-icon" title="Chamar no WhatsApp (${Utils.escapeHtml(lead.phone)})" style="color: #25D366; font-size: 18px;">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                    </td>
                    <td style="font-weight: 800; color: #002C5B; white-space: nowrap;">${Utils.formatCurrency(lead.totalPrice)}</td>
                    <td>${addonsHtml}</td>
                    <td style="text-align: center;">${recipeHtml}</td>
                    <td>
                        <select class="table-select" id="input-store-${lead.code || index}" style="font-size:12px; padding:4px; border-radius:4px; border:1px solid #CBD5E1; max-width:130px;">
                            ${storeOptions}
                        </select>
                    </td>
                    <td>
                        <select class="table-select" id="input-seller-${lead.code || index}" style="font-size:12px; padding:4px; border-radius:4px; border:1px solid #CBD5E1; max-width:110px;">
                            ${sellerOptions}
                        </select>
                    </td>
                    <td>
                        <input type="number" step="0.01" class="table-input" id="input-val-${lead.code || index}" placeholder="R$ 0,00" value="${Utils.escapeHtml(lead.saleValue)}" style="width:75px; font-size:12px; padding:4px; border-radius:4px; border:1px solid #CBD5E1;">
                    </td>
                    <td>
                        <input type="text" class="table-input" id="input-os-${lead.code || index}" placeholder="Nº OS" value="${Utils.escapeHtml(lead.osNumber)}" style="width:65px; font-size:12px; padding:4px; border-radius:4px; border:1px solid #CBD5E1;">
                    </td>
                    <td>
                        <select class="table-select" id="input-status-${lead.code || index}" style="font-size:12px; padding:4px; border-radius:4px; border:1px solid #CBD5E1; max-width:95px;">
                            ${statusOptions}
                        </select>
                    </td>
                    <td style="text-align: center;">
                        <input type="checkbox" class="row-select-checkbox lead-select-box" data-code="${lead.code}" ${isChecked ? 'checked' : ''} title="Marcar para PDF" style="cursor:pointer;">
                    </td>
                    <td style="text-align: center; white-space: nowrap;">
                        <div class="row-actions-group" style="display: inline-flex; gap: 4px;">
                            <button type="button" class="btn-row-action save" onclick="window.LPStudio.saveLeadInline('${lead.code}')" title="Gravar Alterações" style="border:none; background:#002C5B; color:#fff; border-radius:4px; width:26px; height:26px; cursor:pointer;">
                                <i class="fas fa-save" id="save-icon-${lead.code || index}"></i>
                            </button>
                            <button type="button" class="btn-row-action delete" onclick="window.LPStudio.deleteLead('${lead.code}')" title="Excluir Lead" style="border:none; background:#EF4444; color:#fff; border-radius:4px; width:26px; height:26px; cursor:pointer;">
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

            ['filter-store', 'filter-seller', 'filter-status'].forEach(id => {
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

            // Exportação CSV
            const btnCsv = document.getElementById('btn-export-csv');
            if (btnCsv) {
                btnCsv.addEventListener('click', () => Export.exportCsv());
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
                        }
                    });

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
                antirreflexo: 0.00,
                bluecut: 70.00,
                fotossensivel: 120.00
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
            this.setInputValue('cms-antirreflexo', config.antirreflexo);
            this.setInputValue('cms-bluecut', config.bluecut);
            this.setInputValue('cms-fotossensivel', config.fotossensivel);
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
            const antirreflexo = parseFloat(document.getElementById('cms-antirreflexo')?.value) || 0;
            const bluecut = parseFloat(document.getElementById('cms-bluecut')?.value) || 0;
            const fotossensivel = parseFloat(document.getElementById('cms-fotossensivel')?.value) || 0;

            const config = {
                comboPrice,
                installments,
                antirreflexo,
                bluecut,
                fotossensivel
            };

            // Salva no LocalStorage da LP
            localStorage.setItem(STORAGE_KEYS.cmsConfigPrefix + lpId, JSON.stringify(config));

            // Atualiza também os dados do catálogo da LP
            if (State.catalog[lpId]) {
                State.catalog[lpId].price = comboPrice;
                State.catalog[lpId].installments = installments;
                Catalog.saveCatalog();
                Catalog.renderCatalogGrid();
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

            Utils.showToast(`Configurações de preços da LP "${State.catalog[lpId].name}" salvas!`, 'success');
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
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '8px 12px';
                li.style.borderBottom = '1px solid #E2E8F0';

                li.innerHTML = `
                    <span style="font-size: 13px; font-weight: 600; color: #002C5B;">
                        <i class="fas fa-store" style="margin-right: 6px; color: #64748B;"></i>
                        ${Utils.escapeHtml(store)}
                    </span>
                    <button type="button" class="btn-remove-item" onclick="window.LPStudio.removeStore(${idx})" title="Remover Loja" style="border:none; background:none; color:#EF4444; cursor:pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                list.appendChild(li);
            });
        },

        renderSellersList() {
            const list = document.getElementById('sellers-list-container');
            if (!list) return;

            list.innerHTML = '';
            State.sellers.forEach((seller, idx) => {
                const li = document.createElement('li');
                li.className = 'managed-item';
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '8px 12px';
                li.style.borderBottom = '1px solid #E2E8F0';

                li.innerHTML = `
                    <span style="font-size: 13px; font-weight: 600; color: #002C5B;">
                        <i class="fas fa-user-tag" style="margin-right: 6px; color: #64748B;"></i>
                        ${Utils.escapeHtml(seller)}
                    </span>
                    <button type="button" class="btn-remove-item" onclick="window.LPStudio.removeSeller(${idx})" title="Remover Vendedor" style="border:none; background:none; color:#EF4444; cursor:pointer;">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                list.appendChild(li);
            });
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
            Leads.setDomText(['traffic-conversion-rate'], `Taxa de Conversão: ${convRate}%`);

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
                container.innerHTML = `<li style="color: var(--text-muted, #64748B); font-size: 12px; font-style: italic; padding: 6px 0;">${Utils.escapeHtml(emptyMessage)}</li>`;
                return;
            }

            sorted.slice(0, 10).forEach(([key, count]) => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.justifyContent = 'space-between';
                li.style.alignItems = 'center';
                li.style.padding = '6px 0';
                li.style.fontSize = '12px';
                li.style.borderBottom = '1px solid #F1F5F9';

                li.innerHTML = `
                    <span style="font-weight: 600; color: #002C5B; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;" title="${Utils.escapeHtml(key)}">
                        ${Utils.escapeHtml(key)}
                    </span>
                    <span style="font-weight: 700; color: #002C5B; background: #E2E8F0; padding: 2px 8px; border-radius: 12px; font-size: 11px;">
                        ${count} cliques
                    </span>
                `;
                container.appendChild(li);
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
            if (!modal) {
                // Se o modal não existe no DOM, cria dinamicamente
                this.injectCreateLpModal();
                return;
            }

            modal.style.display = 'flex';
            modal.classList.add('active');
            modal.classList.add('is-open');

            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        },

        closeCreateLp() {
            const modal = document.getElementById('modal-create-lp');
            if (!modal) return;

            modal.style.display = 'none';
            modal.classList.remove('active');
            modal.classList.remove('is-open');

            const form = document.getElementById('form-create-lp');
            if (form) form.reset();
        },

        injectCreateLpModal() {
            const modal = document.createElement('div');
            modal.id = 'modal-create-lp';
            modal.className = 'modal-backdrop';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.backgroundColor = 'rgba(0, 26, 54, 0.6)';
            modal.style.backdropFilter = 'blur(4px)';
            modal.style.display = 'flex';
            modal.style.alignItems = 'center';
            modal.style.justifyContent = 'center';
            modal.style.zIndex = '99999';
            modal.style.padding = '16px';

            modal.innerHTML = `
                <div class="modal-card" style="background:#FFFFFF; border-radius:16px; width:100%; max-width:540px; box-shadow:0 20px 40px rgba(0,0,0,0.25); overflow:hidden; border-top:6px solid #002C5B; font-family:'Outfit',sans-serif;">
                    <div style="padding: 20px 24px; border-bottom: 1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <h3 style="margin:0; font-size:18px; font-weight:800; color:#002C5B;">Nova Landing Page</h3>
                            <p style="margin:2px 0 0; font-size:12px; color:#64748B;">Cadastre e ative uma nova página para o catálogo multi-LP.</p>
                        </div>
                        <button type="button" class="btn-close-modal" id="btn-close-modal-create" style="border:none; background:none; font-size:20px; color:#94A3B8; cursor:pointer;">&times;</button>
                    </div>

                    <form id="form-create-lp" style="padding: 20px 24px;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
                            <div style="grid-column: 1 / -1;">
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Nome da Campanha / Produto *</label>
                                <input type="text" id="new-lp-name" class="cfg-input" placeholder="ex: Kodak City Multifocal Digital" required style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">ID / Slug *</label>
                                <input type="text" id="new-lp-slug" class="cfg-input" placeholder="ex: kodak" required style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Status Inicial</label>
                                <select id="new-lp-status" class="cfg-input" style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                                    <option value="Ativa">Ativa</option>
                                    <option value="Rascunho" selected>Rascunho</option>
                                </select>
                            </div>

                            <div style="grid-column: 1 / -1;">
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Caminho da URL / Destino *</label>
                                <input type="text" id="new-lp-url" class="cfg-input" placeholder="/forlife/index.html?theme=kodak" required style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Preço Combo (R$)</label>
                                <input type="number" step="0.01" id="new-lp-price" class="cfg-input" value="297.00" required style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                            </div>

                            <div>
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Parcelas Sem Juros</label>
                                <input type="number" min="1" max="24" id="new-lp-installments" class="cfg-input" value="10" required style="width:100%; padding:9px 12px; border:1px solid #CBD5E1; border-radius:8px; font-size:13px; box-sizing:border-box;">
                            </div>

                            <div style="grid-column: 1 / -1;">
                                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:6px; color:#002C5B;">Cor de Destaque da Marca</label>
                                <div style="display:flex; align-items:center; gap:10px;">
                                    <input type="color" id="new-lp-color" value="#002C5B" style="width:40px; height:38px; border:none; border-radius:6px; cursor:pointer;">
                                    <span style="font-size:12px; color:#64748B;">Selecione a paleta primária da Landing Page.</span>
                                </div>
                            </div>
                        </div>

                        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #E2E8F0; padding-top:16px;">
                            <button type="button" class="btn-secondary" id="btn-cancel-modal-create" style="padding:9px 16px; border:1px solid #CBD5E1; background:#F8FAFC; color:#64748B; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer;">Cancelar</button>
                            <button type="submit" class="btn-primary" style="padding:9px 20px; border:none; background:#002C5B; color:#FFFFFF; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer;">Cadastrar e Abrir LP</button>
                        </div>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);
            this.bindModalEvents(modal);
            this.openCreateLp();
        },

        bindModalEvents(modal) {
            const closeBtn = modal.querySelector('#btn-close-modal-create');
            const cancelBtn = modal.querySelector('#btn-cancel-modal-create');

            if (closeBtn) closeBtn.addEventListener('click', () => this.closeCreateLp());
            if (cancelBtn) cancelBtn.addEventListener('click', () => this.closeCreateLp());

            // Fecha ao clicar fora da janela
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeCreateLp();
            });

            // Sugestão automática de URL com base no nome e slug
            const nameInput = modal.querySelector('#new-lp-name');
            const slugInput = modal.querySelector('#new-lp-slug');
            const urlInput = modal.querySelector('#new-lp-url');

            if (nameInput && slugInput && urlInput) {
                nameInput.addEventListener('input', () => {
                    if (!slugInput.dataset.touched) {
                        const s = Utils.slugify(nameInput.value);
                        slugInput.value = s;
                        if (!urlInput.dataset.touched) {
                            urlInput.value = `/forlife/index.html?theme=${s}`;
                        }
                    }
                });

                slugInput.addEventListener('input', () => {
                    slugInput.dataset.touched = 'true';
                    if (!urlInput.dataset.touched) {
                        const s = Utils.slugify(slugInput.value);
                        urlInput.value = `/forlife/index.html?theme=${s}`;
                    }
                });

                urlInput.addEventListener('input', () => {
                    urlInput.dataset.touched = 'true';
                });
            }

            // Submissão do formulário
            const form = modal.querySelector('#form-create-lp');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    try {
                        const name = (modal.querySelector('#new-lp-name')?.value || '').trim();
                        if (!name) throw new Error('Por favor, informe o nome comercial da Landing Page.');

                        const rawSlug = (modal.querySelector('#new-lp-slug')?.value || '').trim();
                        const slugVal = Utils.slugify(rawSlug || name);
                        const slug = '/' + slugVal.replace(/^\//, '');

                        const template = modal.querySelector('#new-lp-template')?.value || 'forlife';
                        const url = modal.querySelector('#new-lp-url')?.value || (template === 'fila' ? `/?theme=${slugVal}` : `/forlife/index.html?theme=${slugVal}`);
                        const status = modal.querySelector('#new-lp-status')?.value || 'Ativa';
                        const price = parseFloat(modal.querySelector('#new-lp-price')?.value) || 297.00;
                        const installments = parseInt(modal.querySelector('#new-lp-installments')?.value, 10) || 10;
                        const color = modal.querySelector('#new-lp-color')?.value || '#002C5B';

                        Catalog.addLp({
                            name,
                            slug,
                            url,
                            status,
                            price,
                            installments,
                            color
                        });

                        this.closeCreateLp();
                        Utils.showToast(`Landing Page "${name}" criada com sucesso!`, 'success');
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

            // Tecla Escape fecha modais
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeCreateLp();
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

        removeStore(idx) {
            CMS.removeStore(idx);
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
            Leads.init();
            CMS.init();
            Traffic.init();
            UTM.init();
            Modal.init();

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
