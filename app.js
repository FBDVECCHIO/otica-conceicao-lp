document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MÁSCARA E VALIDAÇÃO DE WHATSAPP
    // ==========================================
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    // ==========================================
    // 2. ENVIO DE FORMULÁRIO E GERADOR DE VOUCHER
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
            
            // Validações básicas adicionais
            if (name.length < 3) {
                alert('Por favor, insira seu nome completo.');
                return;
            }
            if (phone.length < 14) {
                alert('Por favor, insira um número de WhatsApp válido.');
                return;
            }
            
            // Simulação de carregamento
            const submitBtn = voucherForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Processando...';
            
            setTimeout(() => {
                // Gerar Código Aleatório
                const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
                const voucherCode = `FILA-${randomHex}`;
                
                // Atualizar dados na tela de sucesso
                document.getElementById('display-name').textContent = name.split(' ')[0];
                document.getElementById('voucher-code-text').textContent = voucherCode;
                
                // Configurar Link do WhatsApp Dinâmico
                const whatsappBtn = document.getElementById('whatsapp-share-btn');
                const storePhone = '5511999999999'; // Substituir pelo número real da óptica se necessário
                const message = encodeURIComponent(`Olá! Acabei de resgatar meu Voucher de Desconto Fila nas Ópticas Conceição.\nCódigo: ${voucherCode}\nNome: ${name}\nGostaria de agendar o meu exame de vista.`);
                whatsappBtn.href = `https://api.whatsapp.com/send?phone=${storePhone}&text=${message}`;
                
                // Transição de telas
                formBox.style.display = 'none';
                successBox.style.display = 'block';
                
                // Rolagem suave até a confirmação
                successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1200);
        });
    }

    // ==========================================
    // 3. GIRO DE FOTOS (Mini-Carrossel interno dos cards)
    // ==========================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const thumbs = card.querySelectorAll('.thumb-dot');
        const images = card.querySelectorAll('.card-gallery-img');
        
        thumbs.forEach(thumb => {
            const handlePhotoSwitch = () => {
                const targetIndex = thumb.getAttribute('data-index');
                
                // Remover active de todas as miniaturas do card específico
                thumbs.forEach(t => t.classList.remove('active'));
                // Adicionar active na miniatura clicada/hovered
                thumb.classList.add('active');
                
                // Ocultar todas as fotos do card específico e exibir a correta
                images.forEach(img => {
                    img.classList.remove('active');
                    if (img.getAttribute('data-index') === targetIndex) {
                        img.classList.add('active');
                    }
                });
            };

            // Ativa no clique ou no hover do mouse para facilitar o "giro"
            thumb.addEventListener('click', handlePhotoSwitch);
            thumb.addEventListener('mouseenter', handlePhotoSwitch);
        });
    });

    // ==========================================
    // 4. CARROSSEL GERAL DE PRODUTOS (Deslizamento)
    // ==========================================
    const track = document.getElementById('products-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');
    
    if (track && prevBtn && nextBtn) {
        let cards = Array.from(track.children);
        let currentIndex = 0;
        
        // Calcula dinamicamente quantos cards cabem na tela
        const getCardsPerPage = () => {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 992) return 2;
            return 3;
        };

        const updateCarousel = () => {
            const cardsPerPage = getCardsPerPage();
            const maxIndex = Math.max(0, cards.length - cardsPerPage);
            
            // Corrige se redimensionar tela e o index ficar fora do limite
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            // Largura do card + gap
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 24; // Definido no CSS (.products-track { gap: 24px })
            
            const offset = currentIndex * (cardWidth + gap);
            track.style.transform = `translateX(-${offset}px)`;
            
            // Habilita/Desabilita botões
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === maxIndex;
            
            // Atualizar os dots gerais do carrossel
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.remove('active');
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
            });
        };
        
        // Inicializar botões de bolinhas (dots)
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

        // Eventos dos botões
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
        
        // Suporte para redimensionamento de tela
        window.addEventListener('resize', () => {
            setupDots();
            updateCarousel();
        });
        
        // Execução Inicial
        setupDots();
        updateCarousel();
    }
});
