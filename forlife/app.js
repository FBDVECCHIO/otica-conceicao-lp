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
});

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
    const recipeStatusText = hasPrescription ? 'Possuo receita atualizada' : 'Preciso atualizar minha receita';

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
        osNumber: ''
    };

    // 1. Gravar no Supabase (Tabela forlife_leads)
    if (supabaseClient) {
        try {
            // Tentar primeiro com a coluna store nativa
            let res = await supabaseClient.from('forlife_leads').insert([{
                name: name,
                phone: phone,
                email: email,
                city: city,
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
                    city: store ? `${city} (Loja: ${store})` : city,
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

    const messageText = 
`Olá, Ópticas Conceição! Acabei de gerar meu voucher exclusivo ForLife no site.\n\n` +
`🎫 *Código do Voucher:* ${voucherCode}\n` +
`👤 *Nome:* ${name}\n` +
`📍 *Cidade:* ${city}\n` +
`🏪 *Loja Escolhida:* ${store}\n` +
`📞 *WhatsApp:* ${phone}\n\n` +
`👓 *Combo:* Óculos Completo (Armação + Lentes Multifocais HD)\n` +
`💰 *Valor Combo Base:* R$ ${formatMoney(forlifeConfig.comboPrice)}\n\n` +
`⚡ *Tecnologia:*\n${addonsText}\n\n` +
`💵 *Total:* R$ ${formatMoney(totalPrice)} (em até ${forlifeConfig.installments}x de R$ ${formatMoney(totalPrice / forlifeConfig.installments)} sem juros)\n` +
`📋 *Situação da Receita:* ${recipeStatusText}\n\n` +
`Gostaria de garantir as condições do meu voucher e agendar meu atendimento!`;

    const whatsappBtn = document.getElementById('btn-whatsapp-voucher');
    if (whatsappBtn) {
        whatsappBtn.href = `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodeURIComponent(messageText)}`;
    }

    // 4. Exibir Tela de Sucesso
    document.getElementById('voucher-code-display').textContent = voucherCode;
    document.getElementById('voucher-user-name').textContent = name.split(' ')[0];
    
    document.getElementById('form-inputs-container').style.display = 'none';
    const successBox = document.getElementById('voucher-success-box');
    successBox.style.display = 'block';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
