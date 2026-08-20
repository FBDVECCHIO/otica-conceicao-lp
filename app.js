document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // ESTADO DA SELEÇÃO DO COMBO (Aro + Lente)
    // ==========================================
    let comboState = {
        frame: null, // { id: X, name: 'FILA...', price: 299 }
        lens: null   // { id: X, name: 'Zeiss...', price: 0 }
    };

    // Mapeamento de Preços para cálculos
    const framePrices = {
        1: 299,
        2: 319,
        3: 299,
        4: 329,
        5: 289,
        6: 349
    };

    const lensPrices = {
        1: 0,
        2: 79,
        3: 149
    };

    // ==========================================
    // 1. MÁSCARA DE CELULAR (WHATSAPP)
    // ==========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // ==========================================
    // 2. SELEÇÃO DE ARO (PASSO 1)
    // ==========================================
    const frameButtons = document.querySelectorAll('.select-frame-btn');
    frameButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const frameId = btn.getAttribute('data-id');
            const frameName = btn.getAttribute('data-name');
            const framePrice = framePrices[frameId];
            
            // Remove seleção de todos os outros cards
            document.querySelectorAll('.product-card').forEach(card => card.classList.remove('selected'));
            frameButtons.forEach(b => {
                b.innerHTML = '<i class="far fa-circle check-icon"></i> Selecionar Armação';
                b.classList.add('btn-outline');
            });
            
            // Ativa seleção no card atual
            const currentCard = btn.closest('.product-card');
            currentCard.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-check-circle check-icon"></i> Armação Selecionada';
            btn.classList.remove('btn-outline');
            
            // Atualiza o estado
            comboState.frame = {
                id: frameId,
                name: frameName.split(' (')[0],
                price: framePrice
            };
            
            updateSummary();
            
            // Rolagem suave até a área das lentes após selecionar o aro
            setTimeout(() => {
                document.getElementById('lenses-banner-3').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // ==========================================
    // 3. SELEÇÃO DE LENTE (PASSO 2)
    // ==========================================
    const lensButtons = document.querySelectorAll('.select-lens-btn');
    lensButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lensId = btn.getAttribute('data-id');
            const lensName = btn.getAttribute('data-name');
            const lensPrice = lensPrices[lensId];
            
            // Remove seleção de todos os outros cards de lentes
            document.querySelectorAll('#lenses-banner-3 .offer-card').forEach(card => card.classList.remove('selected'));
            lensButtons.forEach(b => {
                b.innerHTML = '<i class="far fa-circle check-icon"></i> Selecionar Lente';
                b.classList.add('btn-outline');
            });
            
            // Ativa seleção no card atual
            const currentCard = btn.closest('.offer-card');
            currentCard.classList.add('selected');
            btn.innerHTML = '<i class="fas fa-check-circle check-icon"></i> Lente Selecionada';
            btn.classList.remove('btn-outline');
            
            // Atualiza o estado
            comboState.lens = {
                id: lensId,
                name: lensName.split(' (')[0],
                price: lensPrice
            };
            
            updateSummary();
            
            // Rolagem suave até o Resumo
            setTimeout(() => {
                document.getElementById('summary-banner-4').scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });
    });

    // ==========================================
    // 4. ATUALIZAR RESUMO DINÂMICO
    // ==========================================
    function updateSummary() {
        const frameVal = document.getElementById('summary-frame-val');
        const lensVal = document.getElementById('summary-lens-val');
        const priceVal = document.getElementById('summary-price-val');
        const warningAlert = document.getElementById('summary-warning-alert');
        const submitBtn = document.getElementById('submit-form-btn');
        
        let totalPrice = 0;
        
        // Atualizar visual do Aro no painel de resumo
        if (comboState.frame) {
            frameVal.textContent = comboState.frame.name + ` (R$ ${comboState.frame.price},00)`;
            frameVal.classList.add('active');
            totalPrice += comboState.frame.price;
        } else {
            frameVal.textContent = 'Nenhuma armação selecionada nas opções acima';
            frameVal.classList.remove('active');
        }
        
        // Atualizar visual da Lente no painel de resumo
        if (comboState.lens) {
            lensVal.textContent = comboState.lens.name + (comboState.lens.price > 0 ? ` (+ R$ ${comboState.lens.price},00)` : ' (Inclusa no Combo)');
            lensVal.classList.add('active');
            totalPrice += comboState.lens.price;
        } else {
            lensVal.textContent = 'Nenhuma lente selecionada nas opções acima';
            lensVal.classList.remove('active');
        }
        
        // Exibe o preço total calculado
        priceVal.textContent = `R$ ${totalPrice},00`;
        
        // Habilita formulário caso ambos estejam preenchidos
        if (comboState.frame && comboState.lens) {
            warningAlert.style.display = 'none';
            submitBtn.removeAttribute('disabled');
        } else {
            warningAlert.style.display = 'flex';
            submitBtn.setAttribute('disabled', 'true');
        }
    }

    // ==========================================
    // 5. ENVIO DE FORMULÁRIO E SALVAMENTO DE LEADS (LOCALSTORAGE)
    // ==========================================
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
            
            // Garantias extras de segurança
            if (name.length < 3) {
                alert('Por favor, insira seu nome completo.');
                return;
            }
            if (phone.length < 14) {
                alert('Por favor, insira um número de WhatsApp válido.');
                return;
            }
            if (city.length < 2) {
                alert('Por favor, insira o nome da sua cidade.');
                return;
            }
            if (!comboState.frame || !comboState.lens) {
                alert('Selecione primeiro uma armação e uma lente.');
                return;
            }
            
            const submitBtn = document.getElementById('submit-form-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando Combo...';
            
            setTimeout(() => {
                // Código exclusivo do Voucher
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                const voucherCode = `FILA-${randomHex}`;
                
                // Gravar lead no LocalStorage para o painel Admin
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
                
                // Atualizar dados na tela de sucesso
                document.getElementById('display-name').textContent = name.split(' ')[0];
                document.getElementById('voucher-code-text').textContent = voucherCode;
                
                // Configurar Link do WhatsApp com Resumo Completo das Escolhas
                const whatsappBtn = document.getElementById('whatsapp-share-btn');
                const storePhone = '5511999999999'; // Substituir pelo número da loja
                
                const totalCalculado = comboState.frame.price + comboState.lens.price;
                const messageText = `Olá Ópticas Conceição! Acabei de gerar meu cupom no site.\n\n` + 
                                    `🎫 *Código:* ${voucherCode}\n` +
                                    `👤 *Nome:* ${name}\n` +
                                    `📍 *Cidade:* ${city}\n` +
                                    `📞 *WhatsApp:* ${phone}\n\n` +
                                    `👓 *Aro Fila:* ${comboState.frame.name} (R$ ${comboState.frame.price},00)\n` +
                                    `👁️ *Lente:* ${comboState.lens.name} (Adicional: R$ ${comboState.lens.price},00)\n` +
                                    `💰 *Total Estimado:* R$ ${totalCalculado},00\n\n` +
                                    `Gostaria de confirmar e agendar meu atendimento!`;
                
                const messageEncoded = encodeURIComponent(messageText);
                whatsappBtn.href = `https://api.whatsapp.com/send?phone=${storePhone}&text=${messageEncoded}`;
                
                // Transição de telas
                formBox.style.display = 'none';
                successBox.style.display = 'block';
                
                // Scroll até o bilhete gerado
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1200);
        });
    }

    // ==========================================
    // 6. GIRO DE FOTOS (Carrossel Interno do Card)
    // ==========================================
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
    // 7. CARROSSEL GERAL DE PRODUTOS (Deslizamento)
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
});
