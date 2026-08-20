document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. BANCO DE DADOS LOCAL (localStorage)
    // ==========================================
    
    // Dados de Armações Padrão
    const defaultFrames = [
        { id: 1, name: "FILA Active Navy", ref: "F8142-N50", oldPrice: 589, newPrice: 299, badge: "MAIS PROCURADO", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "", filter1: "hue-rotate(180deg)", filter2: "" },
        { id: 2, name: "FILA Sport Red", ref: "F8145-R52", oldPrice: 629, newPrice: 319, badge: "ESPORTIVO", image0: "assets/images/frame_red_side.png", image1: "assets/images/frame_navy_front.png", image2: "assets/images/hero_fila.png", filter0: "", filter1: "hue-rotate(140deg)", filter2: "hue-rotate(140deg)" },
        { id: 3, name: "FILA Classic Black", ref: "F8140-B53", oldPrice: 599, newPrice: 299, badge: "CLÁSSICO", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "grayscale(1) brightness(0.2)", filter1: "grayscale(1) brightness(0.2)", filter2: "grayscale(1) contrast(1.1)" },
        { id: 4, name: "FILA Bold Orange", ref: "F8148-O51", oldPrice: 649, newPrice: 329, badge: "FLEXÍVEL", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "hue-rotate(30deg) saturate(1.5)", filter1: "hue-rotate(30deg) saturate(1.5)", filter2: "hue-rotate(30deg)" },
        { id: 5, name: "FILA Volt Green", ref: "F8150-G50", oldPrice: 579, newPrice: 289, badge: "LEVE", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "hue-rotate(85deg) saturate(1.3)", filter1: "hue-rotate(85deg) saturate(1.3)", filter2: "hue-rotate(85deg)" },
        { id: 6, name: "FILA Crystal White", ref: "F8139-C52", oldPrice: 689, newPrice: 349, badge: "TENDÊNCIA", image0: "assets/images/frame_navy_front.png", image1: "assets/images/frame_red_side.png", image2: "assets/images/hero_fila.png", filter0: "invert(0.9) brightness(1.2) contrast(0.8)", filter1: "invert(0.9) brightness(1.2) contrast(0.8)", filter2: "sepia(0.2) brightness(1.1)" }
    ];

    // Dados de Lentes Padrão
    const defaultLenses = [
        { id: 1, name: "Lente Zeiss Single Vision", desc: "Antirreflexo e nitidez excepcional. Excelente custo-benefício para quem busca conforto diário nas atividades gerais.", priceLabel: "Inclusa no Combo", price: 0, highlight: false },
        { id: 2, name: "Lentes Blue Cut (Filtro Azul)", desc: "Desenvolvida para proteger a sua visão contra a luz azul de telas (celular e notebook), aliviando o cansaço dos olhos.", priceLabel: "+ R$ 79,00 adicional", price: 79, highlight: true },
        { id: 3, name: "Essilor Crizal Sapphire", desc: "Camada premium antirreflexo que protege contra arranhões, reflexo, poeira e raios UV nocivos.", priceLabel: "+ R$ 149,00 adicional", price: 149, highlight: false }
    ];

    // Inicialização segura no localStorage
    if (!localStorage.getItem('campanha_frames')) {
        localStorage.setItem('campanha_frames', JSON.stringify(defaultFrames));
    }
    if (!localStorage.getItem('campanha_lenses')) {
        localStorage.setItem('campanha_lenses', JSON.stringify(defaultLenses));
    }

    // Carregar dados ativos para a renderização
    const framesData = JSON.parse(localStorage.getItem('campanha_frames'));
    const lensesData = JSON.parse(localStorage.getItem('campanha_lenses'));

    // ==========================================
    // ESTADO DA SELEÇÃO DO COMBO
    // ==========================================
    let comboState = {
        frame: null, // { id: X, name: 'FILA...', price: Y }
        lens: null   // { id: X, name: 'Zeiss...', price: Y }
    };

    // ==========================================
    // 2. RENDERIZAÇÃO DINÂMICA
    // ==========================================
    renderFrames(framesData);
    renderLenses(lensesData);

    // Renderizar Armações (Banner 2)
    function renderFrames(frames) {
        const track = document.getElementById('products-track');
        if (!track) return;
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

    // Renderizar Lentes (Banner 3)
    function renderLenses(lenses) {
        const grid = document.getElementById('lenses-grid');
        if (!grid) return;
        grid.innerHTML = '';
        
        lenses.forEach(l => {
            const card = document.createElement('div');
            card.className = `offer-card ${l.highlight ? 'highlight' : ''}`;
            card.id = `card-lens-${l.id}`;
            
            // Escolhe um ícone genérico baseado na lente
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
    // 3. LOGICA DE INTERAÇÕES E CLIQUE (APÓS RENDERS)
    // ==========================================
    
    // Ação do Botão Selecionar Aro
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

    // Ação do Botão Selecionar Lente
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

    // Atualizar Resumo Dinâmico
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

    // Envio do formulário de resgate de voucher
    const voucherForm = document.getElementById('resgate-form');
    const formBox = document.getElementById('form-box');
    const successBox = document.getElementById('success-box');
    
    if (voucherForm && formBox && successBox) {
        voucherForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const email = document.getElementById('email').value.trim();
            const city = document.getElementById('city').value.trim();
            
            if (name.length < 3 || phone.length < 14 || city.length < 2 || !comboState.frame || !comboState.lens) {
                alert('Por favor, preencha todos os campos e selecione os itens.');
                return;
            }
            
            const submitBtn = document.getElementById('submit-form-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando Combo...';
            
            setTimeout(() => {
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                const voucherCode = `FILA-${randomHex}`;
                
                const leadData = {
                    date: new Date().toLocaleString('pt-BR'),
                    name: name,
                    phone: phone,
                    email: email,
                    city: city,
                    frame: comboState.frame.name,
                    lens: comboState.lens.name,
                    price: comboState.frame.price + comboState.lens.price,
                    code: voucherCode
                };
                
                let leads = JSON.parse(localStorage.getItem('leads_conceicao')) || [];
                leads.push(leadData);
                localStorage.setItem('leads_conceicao', JSON.stringify(leads));
                
                document.getElementById('display-name').textContent = name.split(' ')[0];
                document.getElementById('voucher-code-text').textContent = voucherCode;
                
                const whatsappBtn = document.getElementById('whatsapp-share-btn');
                const storePhone = '5511999999999';
                
                const totalCalculado = comboState.frame.price + comboState.lens.price;
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
    // 4. CARROSSEL GERAL DE PRODUTOS (DESLIZAMENTO)
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
    const headerSection = document.getElementById('header-main');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            // Mostra o botão ao rolar mais de 450px (após o primeiro banner)
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
