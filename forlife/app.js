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

// Estado dos adicionais selecionados pelo cliente
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
    await loadForlifeConfig();
    setupEventListeners();
    updatePricingUI();
});

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

// Formatar moeda brasileira
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

    // 2. Atualizar Banner 3 (Cards de Adicionais)
    const priceAntirreflexoEl = document.getElementById('price-val-antirreflexo');
    const priceBluecutEl = document.getElementById('price-val-bluecut');
    const priceFotoEl = document.getElementById('price-val-fotossensivel');

    if (priceAntirreflexoEl) priceAntirreflexoEl.textContent = `+ R$ ${formatMoney(addonAntirreflexo)}`;
    if (priceBluecutEl) priceBluecutEl.textContent = `+ R$ ${formatMoney(addonBluecut)}`;
    if (priceFotoEl) priceFotoEl.textContent = `+ R$ ${formatMoney(addonFotossensivel)}`;

    // 3. Atualizar Banner 4 (Resumo do Pedido)
    const summaryComboPriceEl = document.getElementById('summary-combo-price');
    if (summaryComboPriceEl) summaryComboPriceEl.textContent = `R$ ${formatMoney(comboPrice)}`;

    const addonsListContainer = document.getElementById('summary-addons-container');
    let totalAddons = 0;
    let addonsHtml = '';

    if (selectedAddons.antirreflexo) {
        totalAddons += addonAntirreflexo;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="color:#10B981; margin-right:6px;"></i> Antirreflexo</span>
                <span>+ R$ ${formatMoney(addonAntirreflexo)}</span>
            </div>`;
    }
    if (selectedAddons.bluecut) {
        totalAddons += addonBluecut;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="color:#10B981; margin-right:6px;"></i> Filtro Luz Azul (Bluecut)</span>
                <span>+ R$ ${formatMoney(addonBluecut)}</span>
            </div>`;
    }
    if (selectedAddons.fotossensivel) {
        totalAddons += addonFotossensivel;
        addonsHtml += `
            <div class="summary-line">
                <span><i class="fas fa-check" style="color:#10B981; margin-right:6px;"></i> Lentes Fotossensíveis</span>
                <span>+ R$ ${formatMoney(addonFotossensivel)}</span>
            </div>`;
    }

    if (!addonsHtml) {
        addonsHtml = `
            <div class="summary-line" style="opacity: 0.7; font-style: italic;">
                <span>Nenhum adicional selecionado</span>
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
    // 1. Toggle nos cards de tecnologia (Banner 3)
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

    // 2. Máscara de Telefone / WhatsApp
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

    // 3. Inputs de texto e validação
    ['client-name', 'client-email', 'client-city'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', validateForm);
    });

    // 4. Checkbox obrigatório de receita médica
    const prescriptionCheck = document.getElementById('prescription-checkbox');
    if (prescriptionCheck) {
        prescriptionCheck.addEventListener('change', validateForm);
    }

    // 5. Upload opcional de receita médica
    const fileInput = document.getElementById('prescription-file');
    const previewBox = document.getElementById('prescription-preview-box');
    const fileNameEl = document.getElementById('prescription-file-name');

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (previewBox && fileNameEl) {
                    fileNameEl.textContent = file.name;
                    previewBox.style.display = 'flex';
                }

                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            const canvas = document.createElement('canvas');
                            const ctx = canvas.getContext('2d');
                            let width = img.width;
                            let height = img.height;
                            const maxSize = 800;

                            if (width > height) {
                                if (width > maxSize) {
                                    height *= maxSize / width;
                                    width = maxSize;
                                }
                            } else {
                                if (height > maxSize) {
                                    width *= maxSize / height;
                                    height = maxSize;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(img, 0, 0, width, height);
                            prescriptionBase64 = canvas.toDataURL('image/jpeg', 0.8);
                        };
                    };
                    reader.readAsDataURL(file);
                } else {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        prescriptionBase64 = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                prescriptionBase64 = "";
                if (previewBox) previewBox.style.display = 'none';
            }
        });
    }

    // 6. Submissão do Formulário de Voucher
    const voucherForm = document.getElementById('voucher-form');
    if (voucherForm) {
        voucherForm.addEventListener('submit', handleVoucherSubmit);
    }
}

// Validar se o formulário está apto para submissão
function validateForm() {
    const name = document.getElementById('client-name')?.value.trim() || '';
    const phone = (document.getElementById('client-phone')?.value || '').replace(/\D/g, '');
    const city = document.getElementById('client-city')?.value.trim() || '';
    const email = document.getElementById('client-email')?.value.trim() || '';
    const hasPrescription = document.getElementById('prescription-checkbox')?.checked || false;
    const submitBtn = document.getElementById('btn-submit-voucher');

    const isValid = name.length >= 3 && phone.length >= 10 && city.length >= 2 && email.includes('@') && hasPrescription;

    if (submitBtn) {
        submitBtn.disabled = !isValid;
    }
    return isValid;
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

    // Calcular resumo dos adicionais
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

    const leadData = {
        date: new Date().toLocaleString('pt-BR'),
        name: name,
        phone: phone,
        email: email,
        city: city,
        comboPrice: forlifeConfig.comboPrice,
        addons: addonsArray,
        totalPrice: totalPrice,
        hasPrescription: true,
        prescriptionFile: prescriptionBase64,
        code: voucherCode
    };

    // 1. Gravar no Supabase (Tabela forlife_leads)
    let savedOnCloud = false;
    if (supabaseClient) {
        try {
            const { error } = await supabaseClient.from('forlife_leads').insert([{
                name: name,
                phone: phone,
                email: email,
                city: city,
                combo_price: forlifeConfig.comboPrice,
                addons: JSON.stringify(addonsArray),
                total_price: totalPrice,
                has_prescription: true,
                prescription_file: prescriptionBase64,
                code: voucherCode
            }]);
            if (!error) savedOnCloud = true;
        } catch (err) {
            console.warn("Erro ao salvar no Supabase, mantendo cópia local:", err);
        }
    }

    // 2. Gravar no LocalStorage (fallback / backup)
    const localLeads = JSON.parse(localStorage.getItem('forlife_leads')) || [];
    localLeads.push(leadData);
    localStorage.setItem('forlife_leads', JSON.stringify(localLeads));

    // 3. Montar Mensagem de WhatsApp
    const storePhone = '5519992868439';
    const addonsText = addonsArray.length > 0 
        ? addonsArray.map(a => `  • ${a.name} (+ R$ ${formatMoney(a.price)})`).join('\n')
        : '  • Nenhum adicional';

    const messageText = 
`Olá, Ópticas Conceição! Acabei de gerar meu voucher exclusivo ForLife no site.\n\n` +
`🎫 *Código do Voucher:* ${voucherCode}\n` +
`👤 *Nome:* ${name}\n` +
`📍 *Cidade:* ${city}\n` +
`📞 *WhatsApp:* ${phone}\n\n` +
`👓 *Combo:* Óculos Completo (Armação + Lentes Multifocais HD)\n` +
`💰 *Valor Combo Base:* R$ ${formatMoney(forlifeConfig.comboPrice)}\n\n` +
`⚡ *Tecnologias Adicionais Selecionadas:*\n${addonsText}\n\n` +
`💵 *Total:* R$ ${formatMoney(totalPrice)} (em até ${forlifeConfig.installments}x de R$ ${formatMoney(totalPrice / forlifeConfig.installments)} sem juros)\n` +
`📋 *Receita Médica:* Declaro que possuo receita oftalmológica atualizada.\n\n` +
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
