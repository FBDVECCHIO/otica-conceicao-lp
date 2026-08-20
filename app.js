// ==========================================
// CONFIGURAÇÃO DO SUPABASE (Opcional)
// Substitua pelos dados do seu projeto Supabase para ativar o banco em nuvem
// ==========================================
const SUPABASE_URL = "https://mngwfearwjkpisararbe.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZ3dmZWFyd2prcGlzYXJhcmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1OTc5MzksImV4cCI6MjA5NjE3MzkzOX0.vk9Ol41NU2RI72-ZZKIcm7hzccYBjzPPptb6rZv_mKs";

const isSupabaseConfigured = () => {
    return SUPABASE_URL && SUPABASE_URL !== "SUA_SUPABASE_URL_AQUI" && 
           SUPABASE_KEY && SUPABASE_KEY !== "SUA_SUPABASE_KEY_AQUI";
};

// Instância global do Supabase (se configurado)
let supabaseClient = null;
if (isSupabaseConfigured()) {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.error("Erro ao inicializar cliente do Supabase:", e);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    
    // ==========================================
    // 1. BANCO DE DADOS LOCAL (localStorage - FALLBACK)
    // ==========================================
    const defaultFrames = [
        { id: 1, name: "FILA Active Navy", ref: "F8142-N50", oldPrice: 589, newPrice: 299, badge: "MAIS PROCURADO", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "", filter1: "hue-rotate(180deg)", filter2: "" },
        { id: 2, name: "FILA Sport Red", ref: "F8145-R52", oldPrice: 629, newPrice: 319, badge: "ESPORTIVO", image0: "assets/images/frame_red_side.png", image1: "assets/images/frame_navy_front.png", image2: "assets/images/hero_fila.png", filter0: "", filter1: "hue-rotate(140deg)", filter2: "hue-rotate(140deg)" },
        { id: 3, name: "FILA Classic Black", ref: "F8140-B53", oldPrice: 599, newPrice: 299, badge: "CLÁSSICO", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "grayscale(1) brightness(0.2)", filter1: "grayscale(1) brightness(0.2)", filter2: "grayscale(1) contrast(1.1)" },
        { id: 4, name: "FILA Bold Orange", ref: "F8148-O51", oldPrice: 649, newPrice: 329, badge: "FLEXÍVEL", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "hue-rotate(30deg) saturate(1.5)", filter1: "hue-rotate(30deg) saturate(1.5)", filter2: "hue-rotate(30deg)" },
        { id: 5, name: "FILA Volt Green", ref: "F8150-G50", oldPrice: 579, newPrice: 289, badge: "LEVE", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "hue-rotate(85deg) saturate(1.3)", filter1: "hue-rotate(85deg) saturate(1.3)", filter2: "hue-rotate(85deg)" },
        { id: 6, name: "FILA Crystal White", ref: "F8139-C52", oldPrice: 689, newPrice: 349, badge: "TENDÊNCIA", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "invert(0.9) brightness(1.2) contrast(0.8)", filter1: "invert(0.9) brightness(1.2) contrast(0.8)", filter2: "sepia(0.2) brightness(1.1)" }
    ];

    const defaultLenses = [
        { id: 1, name: "Lente Zeiss Single Vision", desc: "Antirreflexo e nitidez excepcional. Excelente custo-benefício para quem busca conforto diário nas atividades gerais.", priceLabel: "Inclusa no Combo", price: 0, highlight: false },
        { id: 2, name: "Lentes Blue Cut (Filtro Azul)", desc: "Desenvolvida para proteger a sua visão contra a luz azul de telas (celular e notebook), aliviando o cansaço dos olhos.", priceLabel: "+ R$ 79,00 adicional", price: 79, highlight: true },
        { id: 3, name: "Essilor Crizal Sapphire", desc: "Camada premium antirreflexo que protege contra arranhões, reflexo, poeira e raios UV nocivos.", priceLabel: "+ R$ 149,00 adicional", price: 149, highlight: false }
    ];

    const getLocalFrames = () => {
        if (!localStorage.getItem('campanha_frames')) {
            localStorage.setItem('campanha_frames', JSON.stringify(defaultFrames));
        }
        return JSON.parse(localStorage.getItem('campanha_frames'));
    };

    const getLocalLenses = () => {
        if (!localStorage.getItem('campanha_lenses')) {
            localStorage.setItem('campanha_lenses', JSON.stringify(defaultLenses));
        }
        return JSON.parse(localStorage.getItem('campanha_lenses'));
    };

    // ==========================================
    // CARREGAR DADOS DOS PRODUTOS E LENTES
    // ==========================================
    let framesData = [];
    let lensesData = [];

    if (supabaseClient) {
        try {
            // Tenta buscar as armações do Supabase (Tabela fila_frames)
            const { data: fData, error: fErr } = await supabaseClient.from('fila_frames').select('*').order('id', { ascending: true });
            if (!fErr && fData && fData.length > 0) {
                framesData = fData.map(f => ({
                    id: f.id,
                    name: f.name,
                    ref: f.ref,
                    badge: f.badge,
                    oldPrice: f.old_price,
                    newPrice: f.new_price,
                    image0: f.image0,
                    image1: f.image1,
                    image2: f.image2,
                    filter0: f.filter0 || "",
                    filter1: f.filter1 || "",
                    filter2: f.filter2 || ""
                }));
            } else {
                console.warn("Vitrine Supabase vazia ou com erro, usando dados locais:", fErr);
                framesData = getLocalFrames();
            }

            // Tenta buscar as lentes do Supabase (Tabela fila_lenses)
            const { data: lData, error: lErr } = await supabaseClient.from('fila_lenses').select('*').order('id', { ascending: true });
            if (!lErr && lData && lData.length > 0) {
                lensesData = lData.map(l => ({
                    id: l.id,
                    name: l.name,
                    desc: l.desc,
                    priceLabel: l.price_label,
                    price: l.price,
                    highlight: l.highlight
                }));
            } else {
                lensesData = getLocalLenses();
            }
        } catch (e) {
            console.error("Falha de conexão com o Supabase. Utilizando LocalStorage como plano B:", e);
            framesData = getLocalFrames();
            lensesData = getLocalLenses();
        }
    } else {
        framesData = getLocalFrames();
        lensesData = getLocalLenses();
    }

    // Estado da Seleção
    let comboState = {
        frame: null,
        lens: null
    };

    renderFrames(framesData);
    renderLenses(lensesData);

    // ==========================================
    // 2. COMPORTAMENTO DOS COMPONENTES (Renders)
    // ==========================================
    function renderFrames(frames) {
        const track = document.getElementById('products-track');
        if (!track || !frames) return;
        track.innerHTML = '';
        
        frames.forEach(f => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.id = `card-product-${f.id}`;
            
            card.innerHTML = `
                ${f.badge ? `<span class="product-badge">${f.badge}</span>` : ''}
                <div class="card-gallery">
                    <img src="${f.image0}" alt="${f.name} Frente" class="card-gallery-img active" data-index="0" style="filter: ${f.filter0 || 'none'};">
                    <img src="${f.image1}" alt="${f.name} Lado" class="card-gallery-img" data-index="1" style="filter: ${f.filter1 || 'none'};">
                    <img src="${f.image2}" alt="${f.name} Rosto" class="card-gallery-img" data-index="2" style="filter: ${f.filter2 || 'none'};">
                </div>
                <div class="gallery-thumbs">
                    <div class="thumb-dot active" data-index="0">
                        <img src="${f.image0}" alt="Frente" style="filter: ${f.filter0 || 'none'};">
                    </div>
                    <div class="thumb-dot" data-index="1">
                        <img src="${f.image1}" alt="Lado" style="filter: ${f.filter1 || 'none'};">
                    </div>
                    <div class="thumb-dot" data-index="2">
                        <img src="${f.image2}" alt="Modelo" style="filter: ${f.filter2 || 'none'};">
                    </div>
                </div>
                <div class="product-info">
                    <h4>${f.name}</h4>
                    <p class="product-ref">REF: ${f.ref}</p>
                    <div class="product-price-box">
                        <span class="price-old">R$ ${f.oldPrice},00</span>
                        <span class="price-new">R$ ${f.newPrice},00</span>
                    </div>
                    <button class="btn btn-outline select-frame-btn" data-name="${f.name} (R$ ${f.newPrice},00)" data-price="${f.newPrice}" data-id="${f.id}">
                        <i class="far fa-circle check-icon"></i> Selecionar Armação
                    </button>
                </div>
            `;
            track.appendChild(card);
        });
    }

    function renderLenses(lenses) {
        const grid = document.getElementById('lenses-grid');
        if (!grid || !lenses) return;
        grid.innerHTML = '';
        
        lenses.forEach(l => {
            const card = document.createElement('div');
            card.className = `offer-card ${l.highlight ? 'highlight' : ''}`;
            card.id = `card-lens-${l.id}`;
            
            let icon = 'fa-eye';
            if (l.name.toLowerCase().includes('azul') || l.name.toLowerCase().includes('blue')) {
                icon = 'fa-desktop';
            } else if (l.name.toLowerCase().includes('crizal') || l.name.toLowerCase().includes('sapphire')) {
                icon = 'fa-shield-alt';
            }
            
            card.innerHTML = `
                <div class="offer-icon"><i class="fas ${icon}"></i></div>
                <h3>${l.name}</h3>
                <p>${l.desc}</p>
                <div class="offer-price">${l.priceLabel}</div>
                <button class="btn btn-outline select-lens-btn" data-name="${l.name}" data-price="${l.price}" data-id="${l.id}">
                    <i class="far fa-circle check-icon"></i> Selecionar Lente
                </button>
            `;
            grid.appendChild(card);
        });
    }

    // ==========================================
    // 3. LISTENERS DE SELEÇÃO E AÇÕES
    // ==========================================
    const frameButtons = document.querySelectorAll('.select-frame-btn');
    frameButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const frameId = btn.getAttribute('data-id');
            const frameName = btn.getAttribute('data-name');
            const framePrice = parseFloat(btn.getAttribute('data-price'));
            
            document.querySelectorAll('.product-card').forEach(card => card.classList.remove('selected'));
            frameButtons.forEach(b => {
                b.innerHTML = '<i class="far fa-circle check-icon"></i> Selecionar Armação';
                b.classList.add('btn-outline');
            });
            
            const currentCard = btn.closest('.product-card');
            currentCard.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-check-circle check-icon"></i> Armação Selecionada';
            btn.classList.remove('btn-outline');
            
            comboState.frame = {
                id: frameId,
                name: frameName.split(' (')[0],
                price: framePrice
            };
            
            updateSummary();
            
            setTimeout(() => {
                document.getElementById('lenses-banner-3').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    const lensButtons = document.querySelectorAll('.select-lens-btn');
    lensButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lensId = btn.getAttribute('data-id');
            const lensName = btn.getAttribute('data-name');
            const lensPrice = parseFloat(btn.getAttribute('data-price'));
            
            document.querySelectorAll('#lenses-banner-3 .offer-card').forEach(card => card.classList.remove('selected'));
            lensButtons.forEach(b => {
                b.innerHTML = '<i class="far fa-circle check-icon"></i> Selecionar Lente';
                b.classList.add('btn-outline');
            });
            
            const currentCard = btn.closest('.offer-card');
            currentCard.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-check-circle check-icon"></i> Lente Selecionada';
            btn.classList.remove('btn-outline');
            
            comboState.lens = {
                id: lensId,
                name: lensName,
                price: lensPrice
            };
            
            updateSummary();
            
            setTimeout(() => {
                document.getElementById('summary-banner-4').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    function updateSummary() {
        const frameVal = document.getElementById('summary-frame-val');
        const lensVal = document.getElementById('summary-lens-val');
        const priceVal = document.getElementById('summary-price-val');
        const warningAlert = document.getElementById('summary-warning-alert');
        const submitBtn = document.getElementById('submit-form-btn');
        
        let totalPrice = 0;
        
        if (comboState.frame) {
            frameVal.textContent = comboState.frame.name + ` (R$ ${comboState.frame.price},00)`;
            frameVal.classList.add('active');
            totalPrice += comboState.frame.price;
        } else {
            frameVal.textContent = 'Nenhuma armação selecionada nas opções acima';
            frameVal.classList.remove('active');
        }
        
        if (comboState.lens) {
            lensVal.textContent = comboState.lens.name + (comboState.lens.price > 0 ? ` (+ R$ ${comboState.lens.price},00)` : ' (Inclusa no Combo)');
            lensVal.classList.add('active');
            totalPrice += comboState.lens.price;
        } else {
            lensVal.textContent = 'Nenhuma lente selecionada nas opções acima';
            lensVal.classList.remove('active');
        }
        
        priceVal.textContent = `R$ ${totalPrice},00`;
        
        if (comboState.frame && comboState.lens) {
            warningAlert.style.display = 'none';
            submitBtn.removeAttribute('disabled');
        } else {
            warningAlert.style.display = 'flex';
            submitBtn.setAttribute('disabled', 'true');
        }
    }

    // Envio do formulário de resgate
    const voucherForm = document.getElementById('resgate-form');
    const formBox = document.getElementById('form-box');
    const successBox = document.getElementById('success-box');
    
    if (voucherForm && formBox && successBox) {
        voucherForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const city = document.getElementById('city').value.trim();
            
            const cleanPhone = phone.replace(/\D/g, '');
            if (name.length < 3 || cleanPhone.length < 10 || cleanPhone.length > 11 || city.length < 2 || !comboState.frame || !comboState.lens) {
                alert('Por favor, preencha todos os campos corretamente (o telefone deve ter de 10 a 11 dígitos com DDD) e garanta que escolheu o aro e a lente.');
                return;
            }
            
            const submitBtn = document.getElementById('submit-form-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando Combo...';
            
            setTimeout(async () => {
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                const voucherCode = `FILA-${randomHex}`;
                const totalCalculado = comboState.frame.price + comboState.lens.price;
                
                const leadData = {
                    date: new Date().toLocaleString('pt-BR'),
                    name: name,
                    phone: phone, 
                    email: email,
                    city: city,
                    frame: comboState.frame.name,
                    lens: comboState.lens.name,
                    price: totalCalculado,
                    code: voucherCode
                };
                
                // Gravar lead no Supabase (Tabela fila_leads)
                let savedOnCloud = false;
                if (supabaseClient) {
                    try {
                        const { error } = await supabaseClient.from('fila_leads').insert([{
                            name: name,
                            phone: phone,
                            email: email,
                            city: city,
                            frame: comboState.frame.name,
                            lens: comboState.lens.name,
                            price: totalCalculado,
                            code: voucherCode
                        }]);
                        if (!error) {
                            savedOnCloud = true;
                        } else {
                            console.error("Falha no banco Supabase:", error);
                        }
                    } catch (err) {
                        console.error("Erro crítico ao gravar no Supabase:", err);
                    }
                }
                
                if (!savedOnCloud) {
                    let leads = JSON.parse(localStorage.getItem('leads_conceicao')) || [];
                    leads.push(leadData);
                    localStorage.setItem('leads_conceicao', JSON.stringify(leads));
                }
                
                // Transição da Tela
                document.getElementById('display-name').textContent = name.split(' ')[0];
                document.getElementById('voucher-code-text').textContent = voucherCode;
                
                const whatsappBtn = document.getElementById('whatsapp-share-btn');
                const storePhone = '5511999999999';
                
                const messageText = `Olá Ópticas Conceição! Acabei de gerar meu cupom no site.\n\n` + 
                                    `🎫 *Código:* ${voucherCode}\n` +
                                    `👤 *Nome:* ${name}\n` +
                                    `📍 *Cidade:* ${city}\n` +
                                    `📞 *WhatsApp:* ${phone}\n\n` +
                                    `👓 *Aro Fila:* ${comboState.frame.name} (R$ ${comboState.frame.price},00)\n` +
                                    `👁️ *Lente:* ${comboState.lens.name} (Adicional: R$ ${comboState.lens.price},00)\n` +
                                    `💰 *Total Estimado:* R$ ${totalCalculado},00\n\n` +
                                    `Gostaria de agendar o meu atendimento!`;
                
                whatsappBtn.href = `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodeURIComponent(messageText)}`;
                
                formBox.style.display = 'none';
                successBox.style.display = 'block';
                
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1200);
        });
    }

    // Máscara dinâmica para telefone
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, ''); 
            if (val.length > 11) val = val.substring(0, 11);
            
            let formatted = '';
            if (val.length > 0) {
                formatted = '(' + val.substring(0, 2);
                if (val.length > 2) {
                    formatted += ') ' + val.substring(2, 7);
                    if (val.length > 7) {
                        formatted += '-' + val.substring(7, 11);
                    }
                }
            }
            e.target.value = formatted;
        });
    }

    // Giro de Fotos (interno do card)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const thumbs = card.querySelectorAll('.thumb-dot');
        const images = card.querySelectorAll('.card-gallery-img');
        
        thumbs.forEach(thumb => {
            const handlePhotoSwitch = () => {
                const targetIndex = thumb.getAttribute('data-index');
                thumbs.forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
                images.forEach(img => {
                    img.classList.remove('active');
                    if (img.getAttribute('data-index') === targetIndex) {
                        img.classList.add('active');
                    }
                });
            };
            thumb.addEventListener('click', handlePhotoSwitch);
            thumb.addEventListener('mouseenter', handlePhotoSwitch);
        });
    });

    // ==========================================
    // 4. CARROSSEL GERAL DE PRODUTOS
    // ==========================================
    const track = document.getElementById('products-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (track && prevBtn && nextBtn) {
        let cards = Array.from(track.children);
        let currentIndex = 0;
        
        const getCardsPerPage = () => {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        };

        const updateCarousel = () => {
            const cardsPerPage = getCardsPerPage();
            const maxIndex = Math.max(0, cards.length - cardsPerPage);
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 24; 
            
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === maxIndex;
            
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
            });
        };
        
        const setupDots = () => {
            dotsContainer.innerHTML = '';
            const cardsPerPage = getCardsPerPage();
            const pages = Math.max(0, cards.length - cardsPerPage + 1);
            
            for (let i = 0; i < pages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateCarousel();
                });
                dotsContainer.appendChild(dot);
            }
        };

        nextBtn.addEventListener('click', () => {
            const cardsPerPage = getCardsPerPage();
            if (currentIndex < cards.length - cardsPerPage) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        window.addEventListener('resize', () => {
            setupDots();
            updateCarousel();
        });
        
        setupDots();
        updateCarousel();
    }

    // ==========================================
    // 5. BOTÃO VOLTAR AO TOPO (SCROLL MONITOR)
    // ==========================================
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 450) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
