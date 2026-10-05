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

// ==========================================
// PRESETS VISUAIS DO BANNER 1 COMERCIAL
// ==========================================
const HERO_STYLES = {
    multifocal_senhora: {
        id: 'multifocal_senhora',
        name: 'Multifocal (Jovem Senhora)',
        image: '/assets/images/hero/Jovem_senhora.png',
        titlePrefix: 'Óculos Multifocal Completo por',
        quote: 'Mais qualidade de vida para todas as suas visões',
        badge1: { icon: 'fas fa-eye', text: 'Visão nítida em todas as distâncias' },
        badge2: { icon: 'fas fa-heart', text: 'Mais conforto no dia a dia' },
        badge3: { icon: 'fas fa-crosshairs', text: 'Tecnologia com alta precisão' },
        pill1: 'Armação inclusa',
        pill2: 'Lentes multifocais digitais',
        pill3: 'Sem adicionais obrigatórios'
    },
    visao_simples_jovens: {
        id: 'visao_simples_jovens',
        name: 'Visão Simples (Dois Jovens)',
        image: '/assets/images/hero/Casal_jovem.png',
        titlePrefix: 'Óculos Completo Visão Simples por',
        quote: 'Foco perfeito e estilo moderno para o seu dia a dia',
        badge1: { icon: 'fas fa-glasses', text: 'Nitidez total para longe e perto' },
        badge2: { icon: 'fas fa-feather-alt', text: 'Lentes leves e confortáveis' },
        badge3: { icon: 'fas fa-bolt', text: 'Montagem expressa com laboratório' },
        pill1: 'Armação inclusa',
        pill2: 'Lentes visão simples calibradas',
        pill3: 'Sem adicionais obrigatórios'
    },
    promo_dobro_casal: {
        id: 'promo_dobro_casal',
        name: 'Promoção em Dobro (Casal)',
        image: '/assets/images/hero/Casal.png',
        titlePrefix: 'Lentes em Dobro + 2 Armações por',
        quote: 'Economia inteligente e visão perfeita para os dois',
        badge1: { icon: 'fas fa-user-friends', text: '2 pares completos com preço único' },
        badge2: { icon: 'fas fa-sparkles', text: 'Mais de 150 modelos para escolher' },
        badge3: { icon: 'fas fa-shield-alt', text: 'Garantia total de adaptação' },
        pill1: '2 armações inclusas',
        pill2: '2 pares de lentes calibradas',
        pill3: 'Sem adicionais obrigatórios'
    }
};

// ==========================================
// FAQ E DEPOIMENTOS TEMÁTICOS POR CAMPANHA
// ==========================================
const CAMPAIGN_CONTENT = {
    multifocal_senhora: {
        faqTitle: 'Tira-Dúvidas Sobre o Combo Multifocal',
        faqSubtitle: 'Confira as respostas diretas para as dúvidas mais comuns sobre lentes multifocais e adaptação:',
        faqs: [
            {
                q: '1. O que está incluso no Combo por R$ {PRICE}?',
                a: 'O combo inclui uma armação de grau à sua escolha {FRAME_BRAND} no mostruário selecionado da loja + um par de Lentes {LENS_BRAND} de alta definição com amplo campo visual para perto, meia-distância e longe.'
            },
            {
                q: '2. Como funciona a adaptação com as Lentes Multifocais?',
                a: 'Nossas lentes multifocais digitais são produzidas com tecnologia de alta definição (HD) que reduz as distorções laterais, facilitando a transição entre perto, meia-distância e longe. Contamos com 100% de garantia de adaptação e suporte técnico da nossa equipe.'
            },
            {
                q: '3. E se eu não tiver a receita em mãos ou precisar atualizar?',
                a: 'Sem problemas! Basta selecionar a opção "Preciso atualizar minha receita" ao gerar o seu cupom. Nossa equipe indicará clínicas parceiras de confiança em Campinas para realizar seu exame de vista.'
            },
            {
                q: '4. Posso parcelar o valor do combo e das tecnologias adicionais?',
                a: 'Sim! Tanto o combo base de R$ {PRICE} quanto as tecnologias adicionais podem ser parcelados em até {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros em todos os cartões de crédito aceitos na loja.'
            },
            {
                q: '5. Como faço para escolher a minha armação?',
                a: 'Você pode visitar nossa loja física no Centro de Campinas para experimentar dezenas de modelos da {FRAME_BRAND}, ou solicitar consultoria personalizada via WhatsApp, onde nossos consultores enviam fotos e vídeos de modelos adequados ao seu rosto.'
            },
            {
                q: '6. Qual o prazo para confeccionar meus óculos multifocais?',
                a: 'Graças ao nosso laboratório óptico especializado em Campinas, os prazos variam de 3 a 7 dias úteis, com rigoroso controle de centragem pupilar computadorizada antes da entrega.'
            }
        ],
        reviews: [
            {
                text: '"Eu tinha muito receio de usar multifocal por causa de tontura, mas a adaptação com as Lentes {LENS_BRAND} das Ópticas Conceição foi imediata! Excelente atendimento e o preço do combo de R$ {PRICE} é imbatível."',
                author: 'Carlos M.',
                location: 'Centro, Campinas',
                initials: 'CM'
            },
            {
                text: '"Comprei o combo com o filtro azul Bluecut pois fico o dia todo no computador e leitura. Minhas dores de cabeça acabaram e a armação {FRAME_BRAND} é linda e muito confortável. Recomendo de olhos fechados!"',
                author: 'Maria Helena S.',
                location: 'Cambuí, Campinas',
                initials: 'MH'
            },
            {
                text: '"Minha família compra na Conceição há mais de 30 anos. Essa campanha superou todas as expectativas em qualidade técnica, agilidade e o parcelamento em {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros. Parabéns pelo carinho!"',
                author: 'Roberto F.',
                location: 'Taquaral, Campinas',
                initials: 'RF'
            }
        ]
    },
    visao_simples_jovens: {
        faqTitle: 'Tira-Dúvidas Sobre o Combo Visão Simples',
        faqSubtitle: 'Respostas diretas sobre lentes monofocais, armações modernas e montagem expressa:',
        faqs: [
            {
                q: '1. O que está incluso no Combo Visão Simples por R$ {PRICE}?',
                a: 'O combo acompanha uma armação completa {FRAME_BRAND} à sua escolha entre centenas de modelos selecionados + 1 par de Lentes {LENS_BRAND} calibradas para o seu grau de miopia, hipermetropia ou astigmatismo.'
            },
            {
                q: '2. As lentes já vêm com antirreflexo e proteção?',
                a: 'Sim! O combo já inclui tratamento antirreflexo de alta durabilidade e proteção contra raios UV, eliminando reflexos incômodos no celular, computador e luzes noturnas.'
            },
            {
                q: '3. Qual o prazo para meus óculos ficarem prontos?',
                a: 'Com nosso laboratório próprio de montagem computadorizada em Campinas, confeccionamos seus óculos em tempo recorde com precisão milimétrica.'
            },
            {
                q: '4. E se eu ainda não tiver a receita do oftalmologista?',
                a: 'Basta gerar seu cupom agora para travar o preço promocional de R$ {PRICE}. Ao falar com nossa equipe, auxiliamos no agendamento do exame com clínicas parceiras em Campinas.'
            },
            {
                q: '5. Como escolher o modelo ideal de armação?',
                a: 'Temos mais de 150 modelos leves da {FRAME_BRAND} (acetato nobre, metal fino, retangular, gatinho, redondos e esportivos) para você experimentar na loja ou receber consultoria com fotos pelo WhatsApp.'
            },
            {
                q: '6. Posso parcelar em quantas vezes no cartão?',
                a: 'Você pode parcelar o valor do combo de R$ {PRICE} em até {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros no cartão de crédito, sem qualquer acréscimo.'
            }
        ],
        reviews: [
            {
                text: '"Precisava de um óculos novo urgente para a faculdade e trabalho no computador. A montagem das lentes {LENS_BRAND} foi super rápida, o antirreflexo é perfeito e paguei apenas R$ {PRICE} no combo completo!"',
                author: 'Lucas F.',
                location: 'Barão Geraldo, Campinas',
                initials: 'LF'
            },
            {
                text: '"Achei a armação {FRAME_BRAND} que procurava há meses! Lentes super finas, leves e confortáveis, parceladas em {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros. Atendimento nota 10!"',
                author: 'Amanda C.',
                location: 'Cambuí, Campinas',
                initials: 'AC'
            },
            {
                text: '"Melhor custo-benefício de Campinas. Saí da loja enxergando tudo nítido e sem surpresas no caixa: exatamente R$ {PRICE} pelo óculos completo com armação e lentes!"',
                author: 'Gabriel S.',
                location: 'Centro, Campinas',
                initials: 'GS'
            }
        ]
    },
    promo_dobro_casal: {
        faqTitle: 'Tira-Dúvidas Sobre a Promoção em Dobro',
        faqSubtitle: 'Tudo o que você precisa saber sobre a campanha 2 Armações + 2 Pares de Lentes:',
        faqs: [
            {
                q: '1. O que está incluso na Promoção em Dobro por R$ {PRICE}?',
                a: 'A promoção contempla 2 armações completas {FRAME_BRAND} à sua escolha + 2 pares de lentes {LENS_BRAND} calibradas pelo valor único anunciado! São 2 óculos prontos para uso.'
            },
            {
                q: '2. Os 2 pares podem ser para receitas e pessoas diferentes?',
                a: 'SIM! Você e seu cônjuge, namorado(a), amigo(a) ou familiar podem fazer óculos com receitas médicas completamente distintas aproveitando a mesma promoção.'
            },
            {
                q: '3. Podemos escolher modelos de armações diferentes?',
                a: 'Com certeza! Cada um escolhe livremente seu modelo favorito da {FRAME_BRAND} entre mais de 150 armações masculinas, femininas e unissex disponíveis no mostruário.'
            },
            {
                q: '4. E se uma pessoa precisar de multifocal e a outra de visão simples?',
                a: 'Nossa equipe faz a combinação sob medida no sistema com desconto promocional máximo para os dois pares.'
            },
            {
                q: '5. Como funciona a garantia de adaptação para os dois óculos?',
                a: 'Ambos os pares possuem garantia total de adaptação e suporte pós-venda gratuito para ajustes, trocas de plaquetas e higienização em nossas lojas em Campinas.'
            },
            {
                q: '6. Em quantas vezes podemos parcelar?',
                a: 'O valor total de R$ {PRICE} pode ser dividido em até {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros no cartão de crédito, facilitando a compra para o casal ou família.'
            }
        ],
        reviews: [
            {
                text: '"Aproveitamos a promoção em dobro e fizemos os óculos dos dois por R$ {PRICE}! Economizamos muito e o atendimento na Barão de Jaguara foi nota mil."',
                author: 'Mariana & Tiago',
                location: 'Castelo, Campinas',
                initials: 'MT'
            },
            {
                text: '"Excelente oportunidade! Cada um escolheu seu estilo de armação {FRAME_BRAND} e as lentes {LENS_BRAND} ficaram perfeitas. Tradição e confiança que só uma ótica de 78 anos em Campinas tem."',
                author: 'Fernando & Juliana',
                location: 'Nova Campinas',
                initials: 'FJ'
            },
            {
                text: '"Fizemos nossos óculos com graus diferentes sem nenhuma complicação. O preço em {INSTALLMENTS}x de R$ {INSTALLMENT_VAL} sem juros ficou muito leve no orçamento. Valeu a pena demais!"',
                author: 'Patrícia & Rodrigo',
                location: 'Mansões Santo Antônio, Campinas',
                initials: 'PR'
            }
        ]
    }
};

// Receita médica em Base64 (opcional)
let prescriptionBase64 = "";

// ==========================================
// PROTOCOLO DE SAÍDA DO AR (LPS DESATIVADAS)
// ==========================================
async function checkLpOnlineStatus() {
    try {
        const path = window.location.pathname.replace(/^\/+|\/+$/g, '') || 'forlife';
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
        if (supabaseClient && path && path !== 'forlife/index.html' && path !== 'forlife') {
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

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    const isOnline = await checkLpOnlineStatus();
    if (!isOnline) {
        renderOfflineScreen();
        return;
    }
    initScarcityBadge();
    await loadForlifeConfig();
    applyBrandsToDOM();
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

        // Sincronizar localização precisa no Supabase
        const supabaseTrafficId = sessionStorage.getItem('forlife_supabase_traffic_id');
        if (supabaseClient && supabaseTrafficId && newLoc) {
            const currentDwell = getActiveDwellSeconds();
            const meta = JSON.stringify({
                dwell: currentDwell,
                scroll: currentMaxScrollDepth,
                action: (visit && visit.last_clicked_element) || null,
                neigh: newLoc.neighborhood || '',
                lat: newLoc.latitude || null,
                lon: newLoc.longitude || null,
                prec: newLoc.precision || 'gps'
            });
            supabaseClient.from('forlife_traffic').update({
                city: newLoc.city || (visit && visit.city),
                region: newLoc.region || (visit && visit.region),
                term: meta
            }).eq('id', parseInt(supabaseTrafficId, 10)).then(() => {}).catch(() => {});
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
        const currentDwell = getActiveDwellSeconds();
        if (visit) {
            visit.dwell_seconds = currentDwell;
            if (currentMaxScrollDepth > (visit.scroll_depth || 0)) {
                visit.scroll_depth = currentMaxScrollDepth;
            }
            localStorage.setItem('forlife_traffic_log', JSON.stringify(trafficLog));
        }

        // Sincronizar em Nuvem com o Supabase
        const supabaseTrafficId = sessionStorage.getItem('forlife_supabase_traffic_id');
        if (supabaseClient && supabaseTrafficId) {
            const meta = JSON.stringify({
                dwell: currentDwell,
                scroll: currentMaxScrollDepth,
                action: (visit && visit.last_clicked_element) || null,
                neigh: (visit && visit.neighborhood) || '',
                lat: (visit && visit.latitude) || null,
                lon: (visit && visit.longitude) || null,
                prec: (visit && visit.precision) || 'ip'
            });
            supabaseClient.from('forlife_traffic').update({ term: meta }).eq('id', parseInt(supabaseTrafficId, 10)).then(() => {}).catch(() => {});
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
        const currentLpId = (typeof detectActiveLandingPage === 'function' ? detectActiveLandingPage().slug : '') || forlifeConfig.lpId || 'forlife';

        const visitRecord = {
            id: visitId,
            lp_id: currentLpId,
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
                const initialMeta = JSON.stringify({
                    dwell: 0,
                    scroll: 0,
                    action: null,
                    neigh: loc.neighborhood || '',
                    lat: loc.latitude || null,
                    lon: loc.longitude || null,
                    prec: loc.precision || 'ip'
                });

                const { data, error } = await supabaseClient.from('forlife_traffic').insert([{
                    source: visitRecord.source,
                    medium: visitRecord.medium,
                    campaign: visitRecord.campaign,
                    utm_id: visitRecord.utm_id,
                    content: visitRecord.content,
                    term: initialMeta,
                    city: visitRecord.city,
                    region: visitRecord.region,
                    country: visitRecord.country,
                    device: visitRecord.device,
                    page_url: visitRecord.page_url,
                    converted: false
                }]).select('id');

                if (data && data.length > 0 && data[0].id) {
                    sessionStorage.setItem('forlife_supabase_traffic_id', data[0].id.toString());
                }
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

// Detecção dinâmica de Landing Page ativa a partir da rota ou parâmetros
function detectActiveLandingPage() {
    let slug = window.location.pathname.replace(/^\/+|\/+$/g, '');
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme') || urlParams.get('lp') || urlParams.get('slug');

    // Se o parâmetro theme/lp/slug for passado na URL, tem prioridade absoluta
    if (themeParam) {
        slug = themeParam.trim();
    } else if (!slug || slug === 'forlife' || slug === 'forlife/index.html' || slug === 'index.html') {
        slug = 'forlife';
    }

    let catalog = {};
    try {
        const stored = localStorage.getItem('otica_conceicao_lps_catalog');
        if (stored) catalog = JSON.parse(stored);
    } catch (e) {}

    const DEFAULT_CATALOG = {
        forlife: { id: 'forlife', name: 'ForLife Multifocal Di Capri', slug: '/forlife', price: 297.00, installments: 10, heroStyle: 'multifocal_senhora', lensModality: 'multifocal', frameBrand: 'Di Capri', lensBrand: 'Multifocal Di Capri HD' },
        'forlife-194': { id: 'forlife-194', name: 'ForLife Especial 194', slug: '/forlife-194', price: 194.00, installments: 6, heroStyle: 'visao_simples_jovens', lensModality: 'lentes_prontas', frameBrand: 'Coleção Conceição', lensBrand: 'Monofocais HD', heroTitle: 'Óculos Completo Visão Simples por', heroSupporting: 'Armação leve e resistente + Lentes com antirreflexo e proteção UV inclusos.' },
        '194': { id: '194', name: 'ForLife Especial 194', slug: '/194', price: 194.00, installments: 6, heroStyle: 'visao_simples_jovens', lensModality: 'lentes_prontas', frameBrand: 'Coleção Conceição', lensBrand: 'Monofocais HD', heroTitle: 'Óculos Completo Visão Simples por', heroSupporting: 'Armação leve e resistente + Lentes com antirreflexo e proteção UV inclusos.' },
        '294': { id: '294', name: 'ForLife Especial 294', slug: '/294', price: 294.00, installments: 10, heroStyle: 'multifocal_senhora', lensModality: 'multifocal', frameBrand: 'Di Capri', lensBrand: 'Multifocal Di Capri HD', heroTitle: 'Óculos Completo Multifocal por', heroSupporting: 'Armação Di Capri à sua escolha + Lentes multifocais digitais de alta definição inclusas.' },
        varilux: { id: 'varilux', name: 'Varilux Comfort Max', slug: '/varilux', price: 349.00, installments: 10, heroStyle: 'multifocal_senhora', lensModality: 'multifocal', frameBrand: 'Varilux Premium', lensBrand: 'Varilux Comfort Max HD' },
        zeiss: { id: 'zeiss', name: 'Zeiss SmartLife Digital', slug: '/zeiss', price: 420.00, installments: 12, heroStyle: 'multifocal_senhora', lensModality: 'multifocal', frameBrand: 'Zeiss Titanium', lensBrand: 'Zeiss SmartLife Digital' }
    };

    let matchedLp = null;
    const cleanSlug = slug.toLowerCase();

    for (const [id, lp] of Object.entries(catalog)) {
        const lpSlug = (lp.slug || '').replace(/^\/+|\/+$/g, '').toLowerCase();
        if (id.toLowerCase() === cleanSlug || lpSlug === cleanSlug) {
            matchedLp = lp;
            break;
        }
    }

    if (!matchedLp) {
        if (DEFAULT_CATALOG[cleanSlug]) {
            matchedLp = DEFAULT_CATALOG[cleanSlug];
        } else {
            const numMatch = cleanSlug.match(/(?:^|[-_])(\d{2,4})$/);
            if (numMatch) {
                const inferredPrice = parseFloat(numMatch[1]);
                matchedLp = {
                    id: cleanSlug,
                    name: `ForLife Especial ${numMatch[1]}`,
                    slug: '/' + cleanSlug,
                    price: inferredPrice,
                    installments: inferredPrice < 200 ? 6 : 10
                };
            }
        }
    }

    let cmsConfig = null;
    if (matchedLp) {
        try {
            const cleanLpSlug = (matchedLp.slug || '').replace(/^\/+|\/+$/g, '');
            const cmsStored = localStorage.getItem('otica_cms_config_' + matchedLp.id) ||
                              (cleanLpSlug ? localStorage.getItem('otica_cms_config_' + cleanLpSlug) : null) ||
                              (matchedLp.id === 'forlife-194' || matchedLp.id === '194' ? localStorage.getItem('otica_cms_config_194') : null);
            if (cmsStored) cmsConfig = JSON.parse(cmsStored);
        } catch (e) {}
    } else {
        try {
            const cmsStored = localStorage.getItem('otica_cms_config_' + cleanSlug) ||
                              (cleanSlug === '194' || cleanSlug === 'forlife-194' ? localStorage.getItem('otica_cms_config_194') : null);
            if (cmsStored) cmsConfig = JSON.parse(cmsStored);
        } catch (e) {}
    }

    return {
        slug: slug,
        lp: matchedLp,
        cmsConfig: cmsConfig
    };
}

// Sincronização em nuvem do catálogo e configurações para smartphones e novos visitantes
async function syncCloudCatalogAndConfig(slug) {
    if (!supabaseClient) return null;
    try {
        const cleanSlug = (slug || '').replace(/^\/+|\/+$/g, '').toLowerCase();
        
        // 1. Sincroniza catálogo em nuvem caso necessário (visitante em smartphone / novo browser)
        const stored = localStorage.getItem('otica_conceicao_lps_catalog');
        let shouldFetchCatalog = !stored;
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (!parsed[cleanSlug] && !parsed['/' + cleanSlug] && cleanSlug !== 'forlife') {
                    shouldFetchCatalog = true;
                }
            } catch (e) {
                shouldFetchCatalog = true;
            }
        }

        if (shouldFetchCatalog) {
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
                const { data } = await supabaseClient
                    .from('forlife_leads')
                    .select('prescription_file')
                    .eq('code', '__keep__')
                    .maybeSingle();

                if (data && data.prescription_file) {
                    try { cloudCat = JSON.parse(data.prescription_file); } catch(e) {}
                }
            }

            if (cloudCat && typeof cloudCat === 'object') {
                localStorage.setItem('otica_conceicao_lps_catalog', JSON.stringify(cloudCat));
            }
        }

        // 2. Busca configuração em tempo real no forlife_config
        const targetIds = ['lp_' + cleanSlug, cleanSlug];
        if (cleanSlug === 'forlife' || cleanSlug === '') targetIds.push('main_config');
        const { data: cfgData, error: cfgErr } = await supabaseClient
            .from('forlife_config')
            .select('*')
            .in('id', targetIds);

        if (!cfgErr && Array.isArray(cfgData) && cfgData.length > 0) {
            const matched = cfgData.find(c => c.id === 'lp_' + cleanSlug) ||
                            cfgData.find(c => c.id === cleanSlug) ||
                            cfgData.find(c => c.id === 'main_config');
            return matched;
        }
    } catch (err) {
        console.warn('[ForLife] Fallback sincronização nuvem:', err);
    }
    return null;
}

// Carregar configurações de preços e parâmetros dinâmicos da LP
async function loadForlifeConfig() {
    let loadedFromLocalLp = false;

    // Sincroniza catálogo da nuvem antes de detectar a LP ativa (garante que smartphones tenham acesso imediato)
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme') || urlParams.get('lp') || urlParams.get('slug') || '';
    const initialSlug = themeParam || (window.location.pathname || '').replace(/^\/+|\/+$/g, '') || 'forlife';
    const cloudCfg = await syncCloudCatalogAndConfig(initialSlug);

    // 1. Detectar LP ativa dinamicamente
    const activeLpInfo = detectActiveLandingPage();
    const lp = activeLpInfo.lp;
    const cms = activeLpInfo.cmsConfig;

    if (lp || cms || cloudCfg) {
        const urlPrice = urlParams.get('price') ? parseFloat(urlParams.get('price')) : null;
        const urlInstallments = urlParams.get('installments') ? parseInt(urlParams.get('installments'), 10) : null;
        
        let price = 297.00;
        if (urlPrice !== null) price = urlPrice;
        else if (cloudCfg && cloudCfg.combo_price) price = parseFloat(cloudCfg.combo_price);
        else if (cms && cms.comboPrice) price = parseFloat(cms.comboPrice);
        else if (lp && lp.price) price = parseFloat(lp.price);

        let installments = 10;
        if (urlInstallments !== null) installments = urlInstallments;
        else if (cloudCfg && cloudCfg.combo_installments) installments = parseInt(cloudCfg.combo_installments, 10);
        else if (cms && cms.installments) installments = parseInt(cms.installments, 10);
        else if (lp && lp.installments) installments = parseInt(lp.installments, 10);
        else if (price <= 200) installments = 6;

        if (price <= 200 && installments === 10) {
            installments = 6;
        }

        const antirreflexo = (cloudCfg && cloudCfg.addon_antirreflexo !== undefined) ? parseFloat(cloudCfg.addon_antirreflexo) : ((cms && cms.antirreflexo !== undefined) ? parseFloat(cms.antirreflexo) : 0.00);
        const bluecut = (cloudCfg && cloudCfg.addon_bluecut !== undefined) ? parseFloat(cloudCfg.addon_bluecut) : ((cms && cms.bluecut !== undefined) ? parseFloat(cms.bluecut) : 70.00);
        const fotossensivel = (cloudCfg && cloudCfg.addon_fotossensivel !== undefined) ? parseFloat(cloudCfg.addon_fotossensivel) : ((cms && cms.fotossensivel !== undefined) ? parseFloat(cms.fotossensivel) : 120.00);

        const showTechSection = (cms && cms.showTechSection !== undefined) ? cms.showTechSection : (lp && lp.showTechSection !== undefined ? lp.showTechSection : true);
        const addonsActive = (cms && cms.addonsActive) ? cms.addonsActive : ((lp && lp.addonsActive) ? lp.addonsActive : { antirreflexo: true, bluecut: true, fotossensivel: true });

        let heroStyle = urlParams.get('hero') || urlParams.get('heroStyle') || (cms && cms.heroStyle) || (lp && lp.heroStyle);
        if (!heroStyle || heroStyle === 'multifocal_senhora') {
            const checkStr = `${activeLpInfo.slug} ${(lp && lp.name) || ''} ${(cms && cms.lensModality) || ''} ${(lp && lp.lensModality) || ''} ${(lp && lp.template) || ''}`.toLowerCase();
            if (checkStr.includes('dobro') || checkStr.includes('casal') || checkStr.includes('494')) {
                heroStyle = 'promo_dobro_casal';
            } else if (checkStr.includes('194') || checkStr.includes('visaosimples') || checkStr.includes('miopia') || checkStr.includes('jovens') || checkStr.includes('prontas') || checkStr.includes('surfacada')) {
                heroStyle = 'visao_simples_jovens';
            } else if (!heroStyle) {
                heroStyle = 'multifocal_senhora';
            }
        }

        let heroTitle = urlParams.get('heroTitle') || (cms && cms.heroTitle) || (lp && lp.heroTitle) || '';
        let heroSupporting = urlParams.get('heroSupporting') || (cms && (cms.heroSupporting || cms.heroSupportingText)) || (lp && (lp.heroSupporting || lp.heroSupportingText)) || '';

        if (!heroTitle) {
            if (heroStyle === 'visao_simples_jovens') {
                heroTitle = 'Óculos Completo Visão Simples por';
            } else if (heroStyle === 'promo_dobro_casal') {
                heroTitle = 'Lentes em Dobro + 2 Armações por';
            } else {
                heroTitle = 'Óculos Completo Multifocal por';
            }
        }

        if (!heroSupporting) {
            if (heroStyle === 'visao_simples_jovens') {
                heroSupporting = 'Armação leve e resistente + Lentes com antirreflexo e proteção UV inclusos.';
            } else if (heroStyle === 'promo_dobro_casal') {
                heroSupporting = '2 Armações à escolha + 2 Pares de Lentes calibradas para você e seu acompanhante.';
            }
        }

        const frameBrand = (cms && cms.frameBrand) ? cms.frameBrand : ((lp && lp.frameBrand) ? lp.frameBrand : (heroStyle === 'visao_simples_jovens' ? 'Coleção Conceição' : 'Di Capri'));
        const lensBrand = (cms && cms.lensBrand) ? cms.lensBrand : ((lp && lp.lensBrand) ? lp.lensBrand : (heroStyle === 'visao_simples_jovens' ? 'Monofocais HD' : 'Multifocais Digitais'));
        const offerType = (cms && cms.offerType) ? cms.offerType : ((lp && lp.offerType) ? lp.offerType : 'combo_completo');
        const lensModality = (cms && cms.lensModality) ? cms.lensModality : ((lp && lp.lensModality) ? lp.lensModality : (heroStyle === 'visao_simples_jovens' ? 'lentes_prontas' : 'lentes_multifocais'));

        forlifeConfig = {
            comboPrice: price,
            installments: installments,
            addonAntirreflexo: antirreflexo,
            addonBluecut: bluecut,
            addonFotossensivel: fotossensivel,
            showTechSection: showTechSection,
            addonsActive: addonsActive,
            frameBrand: frameBrand,
            lensBrand: lensBrand,
            offerType: offerType,
            lensModality: lensModality,
            heroTitle: heroTitle,
            heroSupporting: heroSupporting,
            heroStyle: heroStyle,
            lpId: lp ? lp.id : activeLpInfo.slug,
            lpName: lp ? lp.name : ''
        };
        loadedFromLocalLp = true;
    }

    if (!loadedFromLocalLp && supabaseClient) {
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
                    addonFotossensivel: parseFloat(data.addon_fotossensivel) || 150.00,
                    showTechSection: true,
                    addonsActive: { antirreflexo: true, bluecut: true, fotossensivel: true },
                    frameBrand: 'Di Capri',
                    lensBrand: 'Multifocal Di Capri HD',
                    offerType: 'combo_completo',
                    lensModality: 'multifocal',
                    lpId: 'forlife',
                    lpName: 'ForLife Multifocal Di Capri'
                };
            }
        } catch (e) {
            console.warn("Usando fallback de configuração local:", e);
        }
    }

    if (!loadedFromLocalLp && !forlifeConfig.lpId) {
        const local = localStorage.getItem('forlife_config');
        if (local) {
            try {
                forlifeConfig = { ...forlifeConfig, ...JSON.parse(local) };
            } catch (e) {}
        }
    }

    if (lp && lp.name && lp.id !== 'forlife') {
        document.title = `${lp.name} | Ópticas Conceição`;
    }
}

// ==========================================
// PROPAGAÇÃO DINÂMICA DE MARCAS & OFERTAS
// ==========================================
// ==========================================
// BANNER 1 COMERCIAL: FOTOS DE MODELOS & CONVERSÃO
// ==========================================
function applyHeroCommercialConfig() {
    const styleKey = forlifeConfig.heroStyle || 'multifocal_senhora';
    const preset = HERO_STYLES[styleKey] || HERO_STYLES.multifocal_senhora;
    const frameBrand = forlifeConfig.frameBrand || 'Di Capri';
    const lensBrand = forlifeConfig.lensBrand || 'Multifocais Digitais';
    const offerType = forlifeConfig.offerType || 'combo_completo';

    // 1. Imagem do modelo de estúdio
    const modelImg = document.getElementById('hero-model-img');
    if (modelImg && preset.image) {
        modelImg.src = preset.image;
        modelImg.alt = `Modelo ${preset.name} - Ópticas Conceição`;
    }

    // 2. Citação manuscrita flutuante
    const quoteEl = document.getElementById('hero-quote-text');
    if (quoteEl && preset.quote) {
        quoteEl.textContent = preset.quote;
    }

    // 3. Badges flutuantes glassmorphism
    [1, 2, 3].forEach(idx => {
        const textEl = document.getElementById(`hero-glass-text-${idx}`);
        const iconEl = document.getElementById(`hero-glass-icon-${idx}`);
        const badgeData = preset[`badge${idx}`];
        if (textEl && badgeData) textEl.textContent = badgeData.text;
        if (iconEl && badgeData) iconEl.className = badgeData.icon;
    });

    // 4. Pílulas de diferenciais
    [1, 2, 3].forEach(idx => {
        const pillEl = document.getElementById(`hero-pill-${idx}`);
        if (pillEl) {
            const span = pillEl.querySelector('span');
            if (span && preset[`pill${idx}`]) {
                span.textContent = preset[`pill${idx}`];
            }
        }
    });

    // 5. Título Comercial Hero
    const heroTitle = document.getElementById('forlife-hero-title');
    if (heroTitle) {
        if (forlifeConfig.heroTitle && forlifeConfig.heroTitle.trim()) {
            heroTitle.innerHTML = forlifeConfig.heroTitle.trim();
        } else if (offerType === 'so_lentes') {
            heroTitle.innerHTML = `Lentes ${lensBrand}<br class="mobile-break"> Para Sua Armação por`;
        } else {
            heroTitle.innerHTML = `${preset.titlePrefix}`;
        }
    }

    // 5b. Frase de Apoio Explicativa do Hero (Banner 1)
    const heroSupporting = document.getElementById('forlife-hero-supporting');
    if (heroSupporting) {
        const supportingText = (forlifeConfig.heroSupporting || forlifeConfig.heroSupportingText || '').trim();
        if (supportingText) {
            heroSupporting.textContent = supportingText;
            heroSupporting.style.display = 'block';
        } else {
            heroSupporting.textContent = '';
            heroSupporting.style.display = 'none';
        }
    }

    // 6. Subtítulo com Marcas
    const heroSubtitle = document.getElementById('forlife-hero-subtitle');
    if (heroSubtitle) {
        if (offerType === 'so_lentes') {
            heroSubtitle.innerHTML = `Lentes <strong class="dyn-lens-brand">${lensBrand}</strong> com montagem precisa e rápida adaptação`;
        } else {
            heroSubtitle.innerHTML = `Com armação <strong id="forlife-frame-brand" class="dyn-frame-brand">${frameBrand}</strong> + Lentes <strong id="forlife-lens-brand" class="dyn-lens-brand">${lensBrand}</strong>`;
        }
    }

    // 7. Atualizar FAQ e Depoimentos temáticos de acordo com o estilo/campanha
    applyThematicFaqAndReviews(styleKey, forlifeConfig);
}

// ==========================================
// FAQ E DEPOIMENTOS DINÂMICOS POR CAMPANHA
// ==========================================
function applyThematicFaqAndReviews(styleKey, config) {
    const effectiveStyle = styleKey || (config && config.heroStyle) || 'multifocal_senhora';
    const content = CAMPAIGN_CONTENT[effectiveStyle] || CAMPAIGN_CONTENT.multifocal_senhora;
    if (!content) return;

    const priceNum = (config && config.comboPrice) ? parseFloat(config.comboPrice) : 297.00;
    const installmentsNum = (config && config.installments) ? parseInt(config.installments, 10) : 10;
    const installmentValNum = priceNum / (installmentsNum > 0 ? installmentsNum : 1);

    const formattedPrice = (typeof formatMoney === 'function' && config && config.comboPrice) 
        ? formatMoney(config.comboPrice) 
        : priceNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const formattedInstallmentVal = (typeof formatMoney === 'function')
        ? formatMoney(installmentValNum)
        : installmentValNum.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const frameBrand = (config && config.frameBrand) || 'Coleção Conceição';
    const lensBrand = (config && config.lensBrand) || (effectiveStyle === 'visao_simples_jovens' ? 'Monofocais HD' : 'Multifocais Digitais');

    function replacePlaceholders(str) {
        if (!str) return '';
        return str
            .replace(/\{PRICE\}/g, formattedPrice)
            .replace(/\{INSTALLMENTS\}/g, String(installmentsNum))
            .replace(/\{INSTALLMENT_VAL\}/g, formattedInstallmentVal)
            .replace(/\{FRAME_BRAND\}/g, frameBrand)
            .replace(/\{LENS_BRAND\}/g, lensBrand);
    }

    // 1. Atualizar FAQ
    const faqSection = document.getElementById('faq');
    if (faqSection) {
        const titleEl = faqSection.querySelector('.section-title');
        if (titleEl && content.faqTitle) {
            titleEl.textContent = content.faqTitle;
        }

        const subtitleEl = faqSection.querySelector('.section-subtitle');
        if (subtitleEl && content.faqSubtitle) {
            subtitleEl.textContent = content.faqSubtitle;
        }

        const faqList = faqSection.querySelector('.faq-list');
        if (faqList && Array.isArray(content.faqs) && content.faqs.length > 0) {
            let html = '';
            content.faqs.forEach(f => {
                const questionText = replacePlaceholders(f.q);
                const answerText = replacePlaceholders(f.a);
                html += `
                    <div class="faq-item">
                        <div class="faq-question">
                            <h4>${questionText}</h4>
                            <i class="fas fa-chevron-down faq-icon"></i>
                        </div>
                        <div class="faq-answer">
                            ${answerText}
                        </div>
                    </div>
                `;
            });
            faqList.innerHTML = html;
            if (typeof setupFAQ === 'function') {
                setupFAQ();
            }
        }
    }

    // 2. Atualizar Depoimentos / Avaliações
    const reviewsSection = document.getElementById('avaliacoes');
    if (reviewsSection) {
        const reviewsGrid = reviewsSection.querySelector('.reviews-grid');
        if (reviewsGrid && Array.isArray(content.reviews) && content.reviews.length > 0) {
            let rHtml = '';
            content.reviews.forEach(r => {
                const reviewText = replacePlaceholders(r.text);
                rHtml += `
                    <div class="review-card">
                        <div>
                            <div class="review-stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                            <p class="review-text">${reviewText}</p>
                        </div>
                        <div class="review-author">
                            <div class="author-avatar">${r.initials}</div>
                            <div class="author-info">
                                <h5>${r.author}</h5>
                                <span>${r.location}</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            reviewsGrid.innerHTML = rHtml;
        }
    }
}

// ==========================================
// PROPAGAÇÃO DINÂMICA DE MARCAS & OFERTAS
// ==========================================
function applyBrandsToDOM() {
    const frameBrand = forlifeConfig.frameBrand || 'Di Capri';
    const lensBrand = forlifeConfig.lensBrand || 'Multifocais Digitais';
    const offerType = forlifeConfig.offerType || 'combo_completo';

    // 0. Atualiza visual comercial do Banner 1
    applyHeroCommercialConfig();

    // 1. Elementos com classes dinâmicas
    document.querySelectorAll('.dyn-frame-brand').forEach(el => {
        el.textContent = frameBrand;
    });
    document.querySelectorAll('.dyn-lens-brand').forEach(el => {
        el.textContent = lensBrand;
    });

    // 2. Cards de Especificação Técnica no Hero
    const specFrame = document.getElementById('forlife-frame-brand');
    if (specFrame) specFrame.textContent = frameBrand;

    const specLens = document.getElementById('forlife-lens-brand');
    if (specLens) specLens.textContent = lensBrand;

    // 3. Títulos, Subtítulos e Tópicos do Combo
    const comboTitle = document.getElementById('forlife-combo-title');
    const offerBadge = document.getElementById('forlife-offer-badge');
    const featFrame = document.getElementById('forlife-feat-frame');
    const featLens = document.getElementById('forlife-feat-lens');

    if (offerType === 'so_lentes') {
        if (offerBadge) offerBadge.textContent = 'Apenas Lentes';
        if (comboTitle) comboTitle.textContent = `Lentes ${lensBrand} + Sua Armação`;
        if (featFrame) featFrame.textContent = 'Montagem e adaptação técnica na sua armação atual';
        if (featLens) featLens.textContent = `Lentes ${lensBrand} calibradas com precisão digital`;
    } else {
        if (offerBadge) offerBadge.textContent = 'Combo Especial';
        if (comboTitle) comboTitle.textContent = `Lentes ${lensBrand} + Armação ${frameBrand}`;
        if (featFrame) featFrame.textContent = `Armação de grau ${frameBrand} inclusa à sua escolha`;
        if (featLens) featLens.textContent = `Lentes ${lensBrand} calibradas para seu grau`;
    }

    // 4. Atualiza botão de WhatsApp do Banner 1
    const heroWhatsappBtn = document.getElementById('forlife-hero-whatsapp');
    if (heroWhatsappBtn) {
        const instVal = formatMoney(forlifeConfig.comboPrice / forlifeConfig.installments);
        const cashVal = formatMoney(forlifeConfig.comboPrice);
        const msg = encodeURIComponent(
            `Olá! Vim pela promoção do site das Ópticas Conceição e gostaria de garantir o *Combo ${lensBrand} + Armação ${frameBrand}* por R$ ${cashVal} (ou ${forlifeConfig.installments}x de R$ ${instVal} sem juros). Poderiam me atender?`
        );
        heroWhatsappBtn.href = `https://api.whatsapp.com/send?1=pt_BR&phone=5519978056552&text=${msg}`;
    }
}

function formatMoney(value) {
    return Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==========================================
// ATUALIZAÇÃO DA INTERFACE & CÁLCULOS
// ==========================================
function updatePricingUI() {
    const { comboPrice, installments, addonAntirreflexo, addonBluecut, addonFotossensivel, showTechSection, addonsActive } = forlifeConfig;

    // 0. Alternar visibilidade da seção inteira de tecnologias
    const techSection = document.getElementById('tecnologias');
    if (techSection) {
        if (showTechSection === false) {
            techSection.style.display = 'none';
        } else {
            techSection.style.display = '';
        }
    }

    // 1. Atualizar Banner 1 (Preço Gigante Ciano e Parcelamento)
    const intPart = Math.floor(comboPrice);
    const centsVal = (comboPrice % 1).toFixed(2);
    const centsPart = centsVal === '0.00' ? ',00' : (',' + centsVal.split('.')[1]);
    const heroPriceIntEl = document.getElementById('combo-cash-integer');
    const heroPriceCentsEl = document.getElementById('combo-cash-cents');
    if (heroPriceIntEl) heroPriceIntEl.textContent = intPart;
    if (heroPriceCentsEl) heroPriceCentsEl.textContent = centsPart;

    const heroInstTextEl = document.getElementById('hero-installment-text');
    const heroCashTextEl = document.getElementById('hero-cash-text');
    if (heroInstTextEl) heroInstTextEl.textContent = `${installments}x de R$ ${formatMoney(comboPrice / installments)}`;
    if (heroCashTextEl) heroCashTextEl.textContent = `R$ ${formatMoney(comboPrice)} à vista`;

    const comboCashEl = document.getElementById('combo-cash-price');
    const comboInstCountEl = document.getElementById('combo-inst-count');
    const comboInstValEl = document.getElementById('combo-inst-val');
    
    if (comboCashEl) comboCashEl.textContent = `R$ ${formatMoney(comboPrice)}`;
    if (comboInstCountEl) comboInstCountEl.textContent = installments;
    if (comboInstValEl) comboInstValEl.textContent = `R$ ${formatMoney(comboPrice / installments)}`;

    // Atualizar Botão WhatsApp Hero Banner 1
    const heroWhatsappBtn = document.getElementById('forlife-hero-whatsapp');
    if (heroWhatsappBtn) {
        const instVal = formatMoney(comboPrice / installments);
        const cashVal = formatMoney(comboPrice);
        const frameBrand = forlifeConfig.frameBrand || 'Di Capri';
        const lensBrand = forlifeConfig.lensBrand || 'Multifocais Digitais';
        const msg = encodeURIComponent(
            `Olá! Vim pela promoção do site das Ópticas Conceição e gostaria de garantir o *Combo ${lensBrand} + Armação ${frameBrand}* por R$ ${cashVal} (ou ${installments}x de R$ ${instVal} sem juros). Poderiam me atender?`
        );
        heroWhatsappBtn.href = `https://api.whatsapp.com/send?1=pt_BR&phone=5519978056552&text=${msg}`;
    }

    // Atualizar Barra Flutuante Mobile
    const mobileInstEl = document.getElementById('mobile-sticky-installments');
    const mobileCashEl = document.getElementById('mobile-sticky-cash-val');
    const mobileBtn = document.getElementById('mobile-sticky-whatsapp-btn');
    if (mobileInstEl) mobileInstEl.textContent = `${installments}x R$ ${formatMoney(comboPrice / installments)}`;
    if (mobileCashEl) mobileCashEl.textContent = `R$ ${formatMoney(comboPrice)}`;
    if (mobileBtn) {
        const instVal = formatMoney(comboPrice / installments);
        const cashVal = formatMoney(comboPrice);
        const frameBrand = forlifeConfig.frameBrand || 'Di Capri';
        const lensBrand = forlifeConfig.lensBrand || 'Multifocais Digitais';
        const msg = encodeURIComponent(
            `Olá! Vim pelo site das Ópticas Conceição e quero garantir o *Combo ${lensBrand} + Armação ${frameBrand}* por R$ ${cashVal} (${installments}x de R$ ${instVal} sem juros)!`
        );
        mobileBtn.href = `https://api.whatsapp.com/send?1=pt_BR&phone=5519978056552&text=${msg}`;
    }

    // 2. Atualizar Banner 3 (Cards de Tecnologia)
    const priceAntirreflexoEl = document.getElementById('price-val-antirreflexo');
    const priceBluecutEl = document.getElementById('price-val-bluecut');
    const priceFotoEl = document.getElementById('price-val-fotossensivel');

    if (priceAntirreflexoEl) priceAntirreflexoEl.textContent = `+ R$ ${formatMoney(addonAntirreflexo)}`;
    if (priceBluecutEl) priceBluecutEl.textContent = `+ R$ ${formatMoney(addonBluecut)}`;
    if (priceFotoEl) priceFotoEl.textContent = `+ R$ ${formatMoney(addonFotossensivel)}`;

    // Atualizar estado de ativação individual de cada tecnologia (cinza desativada)
    ['antirreflexo', 'bluecut', 'fotossensivel'].forEach(addon => {
        const card = document.getElementById(`card-addon-${addon}`);
        if (card) {
            const isActive = addonsActive ? (addonsActive[addon] !== false) : true;
            if (!isActive) {
                card.classList.add('is-disabled-gray');
                card.classList.remove('selected');
                selectedAddons[addon] = false;
                const checkIcon = card.querySelector('.tech-checkbox-badge i');
                if (checkIcon) checkIcon.style.opacity = '0';
            } else {
                card.classList.remove('is-disabled-gray');
            }
        }
    });

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
                <span>Nenhuma tecnologia adicional (Combo Especial)</span>
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

    // Atualiza todos os botões e elementos de cupom para o preço exato da LP ativa
    const formattedComboPrice = formatMoney(comboPrice);
    const voucherButtons = document.querySelectorAll('.btn-voucher-action, [data-track-element="CTA Seção Avaliações"], .voucher-cta-btn, #review-voucher-btn');
    voucherButtons.forEach(btn => {
        btn.innerHTML = `<i class="fas fa-ticket-alt"></i> Quero Meu Cupom de R$ ${formattedComboPrice}`;
    });
    const dynPriceSpans = document.querySelectorAll('.dyn-voucher-price, .dyn-combo-price');
    dynPriceSpans.forEach(el => {
        el.textContent = formattedComboPrice;
    });

    // Atualiza FAQ e depoimentos com o preço e parcelamento exatos da LP
    applyThematicFaqAndReviews(forlifeConfig.heroStyle, forlifeConfig);

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
            if (card.classList.contains('is-disabled-gray')) return;
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

    const submitBtn = document.getElementById('btn-submit-voucher');
    const isValid = name.length >= 3 && phone.length >= 10;

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
        if (q && !q._hasFaqClick) {
            q._hasFaqClick = true;
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
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gerando Cupom Oficial...';

    const name = document.getElementById('client-name').value.trim();
    const phone = document.getElementById('client-phone').value.trim();
    const email = document.getElementById('client-email')?.value.trim() || '';
    const city = document.getElementById('client-city')?.value.trim() || 'Campinas e Região';
    const store = document.getElementById('client-store')?.value.trim() || 'A combinar no WhatsApp';
    
    const hasPrescription = document.getElementById('recipe-option-have')?.checked;
    const needPrescription = document.getElementById('recipe-option-need')?.checked;
    const recipeStatusText = hasPrescription ? 'Possuo receita' : (needPrescription ? 'Preciso atualizar' : 'A combinar no WhatsApp');

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
        lp_id: forlifeConfig.lpId || 'forlife',
        lpId: forlifeConfig.lpId || 'forlife',
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
            const lpTag = `[LP:${forlifeConfig.lpId || 'forlife'}]`;
            const cityWithStore = store ? `${city} (Loja: ${store})` : city;
            const cityWithLp = `${cityWithStore} ${lpTag}`;
            const cityWithUtm = hasUtm ? `${cityWithLp} [${utmInfo}]` : cityWithLp;

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

    // Atualizar conversão no registro de tráfego do Supabase
    try {
        const supabaseTrafficId = sessionStorage.getItem('forlife_supabase_traffic_id');
        if (supabaseClient && supabaseTrafficId) {
            supabaseClient.from('forlife_traffic').update({
                converted: true,
                voucher_code: voucherCode
            }).eq('id', parseInt(supabaseTrafficId, 10)).then(() => {}).catch(() => {});
        }
    } catch (e) {}

    // 2. Gravar no LocalStorage
    const localLeads = JSON.parse(localStorage.getItem('forlife_leads')) || [];
    localLeads.push(leadData);
    localStorage.setItem('forlife_leads', JSON.stringify(localLeads));

    // 3. Montar Mensagem de WhatsApp
    const storePhone = '5519978056552';
    const addonsText = addonsArray.length > 0 
        ? addonsArray.map(a => `  • ${a.name} (+ R$ ${formatMoney(a.price)})`).join('\n')
        : '  • Combo Especial (Sem adicionais)';

    const utmNotice = hasUtm 
        ? `🎯 *Origem:* Anúncio ${utm.source.toUpperCase()}${utm.campaign ? ' (' + utm.campaign + ')' : ''}\n` 
        : '';

    const lpTitle = forlifeConfig.lpName || 'Multifocal Digital Di Capri + Armação';
    const messageText = 
`Olá, Ópticas Conceição! Acabei de gerar meu cupom exclusivo no site.\n\n` +
`🎫 *Código do Cupom:* ${voucherCode}\n` +
`⏰ *Cupom válido por 7 dias!*\n` +
`👤 *Nome:* ${name}\n` +
`📍 *Cidade:* ${city}\n` +
`🏪 *Loja Escolhida:* ${store}\n` +
`📞 *WhatsApp:* ${phone}\n\n` +
utmNotice +
`👓 *Combo:* ${lpTitle}\n` +
`💰 *Valor Combo Base:* R$ ${formatMoney(forlifeConfig.comboPrice)}\n\n` +
`⚡ *Tecnologia:*\n${addonsText}\n\n` +
`💵 *Total:* R$ ${formatMoney(totalPrice)} (em até ${forlifeConfig.installments}x de R$ ${formatMoney(totalPrice / forlifeConfig.installments)} sem juros)\n` +
`📋 *Situação da Receita:* ${recipeStatusText}\n\n` +
`Gostaria de garantir as condições do meu cupom e agendar meu atendimento!`;

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
                content_name: 'Combo ForLife - Cupom Resgatado',
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



// ==========================================
// CARROSSEL DE ARMAÇÕES VARIADAS FORLIFE
// "Você tem seu estilo, nós temos todos!"
// ==========================================
function initFramesCarousel() {
    const track = document.getElementById('frames-track');
    const btnPrev = document.getElementById('frames-btn-prev');
    const btnNext = document.getElementById('frames-btn-next');
    const dotsContainer = document.getElementById('frames-dots');
    const filterBtns = document.querySelectorAll('.frames-filter-btn');
    const cards = document.querySelectorAll('.frame-card');

    if (!track || !cards.length) return;

    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;
    let isDragging = false;
    let autoplayTimer = null;
    let activeFilter = 'all';

    // 1. Atualizar e Gerar Dots de Paginação
    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const visibleCards = Array.from(cards).filter(c => !c.classList.contains('is-filtered-out'));
        if (visibleCards.length <= 1) return;

        visibleCards.forEach((card, idx) => {
            const dot = document.createElement('span');
            dot.className = 'frame-dot' + (idx === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Ver modelo ' + (idx + 1));
            dot.addEventListener('click', () => {
                const targetLeft = card.offsetLeft - track.offsetLeft;
                track.scrollTo({ left: targetLeft, behavior: 'smooth' });
                highlightActiveDot(idx);
            });
            dotsContainer.appendChild(dot);
        });
    }

    function highlightActiveDot(index) {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.frame-dot');
        dots.forEach((d, i) => {
            if (i === index) d.classList.add('active');
            else d.classList.remove('active');
        });
    }

    function syncDotsOnScroll() {
        if (!dotsContainer) return;
        const visibleCards = Array.from(cards).filter(c => !c.classList.contains('is-filtered-out'));
        if (!visibleCards.length) return;

        const scrollCenter = track.scrollLeft + track.clientWidth / 2;
        let closestIdx = 0;
        let minDiff = Infinity;

        visibleCards.forEach((c, idx) => {
            const cardCenter = c.offsetLeft - track.offsetLeft + c.offsetWidth / 2;
            const diff = Math.abs(scrollCenter - cardCenter);
            if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
            }
        });

        highlightActiveDot(closestIdx);
    }

    // Evento de scroll com debounce / requestAnimationFrame
    let scrollTicking = false;
    track.addEventListener('scroll', () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                syncDotsOnScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });

    // 2. Navegação via Botões Anterior / Próximo (Desktop)
    function getScrollStep() {
        const visibleCards = Array.from(cards).filter(c => !c.classList.contains('is-filtered-out'));
        if (!visibleCards.length) return 360;
        return visibleCards[0].offsetWidth + 24;
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            pauseAutoplay();
            track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
            startAutoplay();
        });
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => {
            pauseAutoplay();
            track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
            startAutoplay();
        });
    }

    // 3. Filtros por Abas (Todos, Feminino, Masculino, Unissex)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter') || 'all';

            cards.forEach(card => {
                const cat = card.getAttribute('data-category');
                if (activeFilter === 'all' || cat === activeFilter) {
                    card.classList.remove('is-filtered-out');
                } else {
                    card.classList.add('is-filtered-out');
                }
            });

            track.scrollTo({ left: 0, behavior: 'smooth' });
            updateDots();
            syncDotsOnScroll();
        });
    });

    // 4. Drag to scroll com Mouse no Desktop
    track.addEventListener('mousedown', (e) => {
        isDown = true;
        isDragging = false;
        startX = e.pageX - track.offsetLeft;
        scrollLeftPos = track.scrollLeft;
        track.style.cursor = 'grabbing';
        pauseAutoplay();
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.style.cursor = 'default';
        startAutoplay();
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.style.cursor = 'default';
        setTimeout(() => { isDragging = false; }, 50);
        startAutoplay();
    });

    track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        if (Math.abs(walk) > 5) isDragging = true;
        track.scrollLeft = scrollLeftPos - walk;
    });

    // 5. Prevenir clique indevido nos links se o usuário estava arrastando
    track.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });

    // 6. Autoplay Suave
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            if (document.hidden) return;
            const maxScroll = track.scrollWidth - track.clientWidth;
            if (track.scrollLeft >= maxScroll - 15) {
                track.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
            }
        }, 4500);
    }

    function stopAutoplay() {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = null;
    }

    function pauseAutoplay() {
        stopAutoplay();
    }

    track.addEventListener('mouseenter', pauseAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
    track.addEventListener('touchstart', pauseAutoplay, { passive: true });
    track.addEventListener('touchend', startAutoplay, { passive: true });

    // 7. Micro-ação dos Botões "Escolher no Cupom"
    document.querySelectorAll('.btn-frame-choose').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const frameName = btn.getAttribute('data-frame') || '';
            if (frameName) {
                // Guarda preferência em localStorage e tenta preencher se houver campo
                try {
                    localStorage.setItem('otica_preferred_frame', frameName);
                } catch(err) {}
            }
        });
    });

    // Inicialização
    updateDots();
    startAutoplay();
}

// Executar após carregamento do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFramesCarousel);
} else {
    initFramesCarousel();
}
