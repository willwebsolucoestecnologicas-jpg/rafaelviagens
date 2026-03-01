/* ==========================================================================
   ÍNDICE (TABLE OF CONTENTS)
   1. Configurações Globais
   2. Inicialização & Efeitos Globais (Preloader, Reveal, Cursor, Ripple)
   3. Lógica do Carrossel de Imagens
   4. Lógica da Calculadora de Orçamentos
   5. Lógica do Chatbot (Integração com IA)
   ========================================================================== */

/* =========================================
   1. CONFIGURAÇÕES GLOBAIS
========================================= */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzD7f4UYECNwnygNXH1kKQ9CxYrtpTNrm6G3rZdWp46f7oH2wY2UbWMVglSo9JRRxrLLg/exec';

// Memória da conversa para a IA não esquecer o contexto
let chatHistory = [];

/* =========================================
   2. INICIALIZAÇÃO E EFEITOS GLOBAIS
========================================= */
// 2.1 Preloader (Remove a tela de carregamento após a página abrir)
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        if(preloader) preloader.classList.add('fade-out');
    }, 1000); 
});

// 2.2 Efeito Parallax no Banner
const heroSection = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    if(heroSection) {
        let scrollPosition = window.pageYOffset;
        heroSection.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
    }
});

// 2.3 Scroll Reveal
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 }); 

document.querySelectorAll('.section-title, .card-expanded, .calculator-card, .house-info, .package-details').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});

// 2.4 Cursor Customizado
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

if (window.innerWidth > 768 && cursorDot && cursorOutline) {
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    document.querySelectorAll('a, button, input, .carousel-img').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hovered');
            cursorOutline.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hovered');
            cursorOutline.classList.remove('hovered');
        });
    });
}

// 2.5 Ripple Effect
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        const x = e.clientX;
        const y = e.clientY;
        const buttonTop = e.target.getBoundingClientRect().top;
        const buttonLeft = e.target.getBoundingClientRect().left;

        const xInside = x - buttonLeft;
        const yInside = y - buttonTop;

        const circle = document.createElement('span');
        circle.classList.add('ripple-effect');
        circle.style.top = yInside + 'px';
        circle.style.left = xInside + 'px';

        this.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    });
});


/* =========================================
   3. LÓGICA DO CARROSSEL DE IMAGENS
========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');

    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const images = carousel.querySelectorAll('.carousel-img');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        
        if(!track || images.length === 0) return;

        images.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => scrollToIndex(index));
            dotsContainer.appendChild(dot);
        });

        const dots = carousel.querySelectorAll('.dot');

        track.addEventListener('scroll', () => {
            const scrollPosition = track.scrollLeft;
            const imageWidth = images[0].clientWidth;
            const currentIndex = Math.round(scrollPosition / imageWidth);
            
            dots.forEach(dot => dot.classList.remove('active'));
            if(dots[currentIndex]) dots[currentIndex].classList.add('active');
        });

        function scrollToIndex(index) {
            const imageWidth = images[0].clientWidth;
            track.scrollTo({ left: index * imageWidth, behavior: 'smooth' });
        }

        if(prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -images[0].clientWidth, behavior: 'smooth' }));
        if(nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: images[0].clientWidth, behavior: 'smooth' }));
    });
});


/* =========================================
   4. LÓGICA DA CALCULADORA DE ORÇAMENTOS
========================================= */
function calcularOrcamento() {
    const inputAdultos = document.getElementById('calc-adultos');
    const inputDias = document.getElementById('calc-dias');
    const resultadoBox = document.getElementById('calc-resultado');

    const adultos = parseInt(inputAdultos.value);
    const dias = parseInt(inputDias.value);

    if (!adultos || adultos < 10) {
        alert("A reserva promocional exige no mínimo 10 adultos.");
        inputAdultos.value = 10; return;
    }
    if (adultos > 20) {
        alert("Nossas vans comportam no máximo 20 passageiros.");
        inputAdultos.value = 20; return;
    }
    if (!dias || dias < 1) {
        alert("Insira pelo menos 1 diária.");
        inputDias.value = 1; return;
    }

    let valorTrecho = 0;
    switch(adultos) {
        case 10: valorTrecho = 75; break; case 11: valorTrecho = 69; break;
        case 12: valorTrecho = 64; break; case 13: valorTrecho = 60; break;
        case 14: valorTrecho = 56; break; case 15: valorTrecho = 53; break;
        case 16: valorTrecho = 50; break; case 17: valorTrecho = 48; break; 
        case 18: valorTrecho = 46; break; case 19: valorTrecho = 44; break;
        case 20: valorTrecho = 43; break;
    }

    const valorTransporteIdaVolta = valorTrecho * 2; 
    const valorCasaDiaria = 60; 
    const totalCasaPessoa = valorCasaDiaria * dias;
    
    const totalPorPessoa = valorTransporteIdaVolta + totalCasaPessoa;
    const totalGrupo = totalPorPessoa * adultos;
    const valorSinal = 50 * adultos;

    const formatBRL = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    resultadoBox.style.display = 'block';
    resultadoBox.innerHTML = `
        <h4>Resumo Estimado</h4>
        <p><strong>Grupo:</strong> ${adultos} Adultos | <strong>Estadia:</strong> ${dias} Diárias</p>
        <p>🚐 <strong>Transporte (Ida e Volta / pessoa):</strong> ${formatBRL(valorTransporteIdaVolta)} <br>
        <small style="color: #666;">(Ida: ${formatBRL(valorTrecho)} + Volta: ${formatBRL(valorTrecho)})</small></p>
        <p>🏠 <strong>Casa (Total / pessoa):</strong> ${formatBRL(totalCasaPessoa)} <br>
        <small style="color: #666;">(${dias} diárias x ${formatBRL(valorCasaDiaria)})</small></p>
        <hr style="margin: 15px 0; border-color: #c3e6cb;">
        <p>👤 <strong>Total por Pessoa:</strong> ${formatBRL(totalPorPessoa)}</p>
        <p style="font-size: 1.2rem; color: var(--primary-blue);">🏆 <strong>Total do Grupo:</strong> ${formatBRL(totalGrupo)}</p>
        <div class="alerta-reserva">
            ⚠️ <strong>Sinal para garantir a reserva:</strong> ${formatBRL(valorSinal)} <br>
            <small>(Valor será abatido do total. Restante pago no destino).</small>
        </div>
    `;
}


/* =========================================
   5. LÓGICA DO CHATBOT (INTEGRAÇÃO IA)
========================================= */

// Função que abre e fecha a janela do chat
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const chatIcon = document.getElementById('chat-icon');
    
    if (chatBody.style.display === 'none' || chatBody.style.display === '') {
        chatBody.style.display = 'flex';
        chatIcon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    } else {
        chatBody.style.display = 'none';
        chatIcon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
}

// Aciona o envio de mensagem ao apertar "Enter" no teclado
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita que o formulário atualize a página
        sendMessage();
    }
}

// Injeta os balões de mensagem (verde/cinza) no HTML do chat
function addMessageToChat(sender, text) {
    const chatBox = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    const msgId = 'msg-' + Date.now();
    
    msgDiv.id = msgId;
    msgDiv.className = `msg ${sender}`;
    msgDiv.textContent = text;
    
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Desce a rolagem automaticamente
    
    return msgId;
}

// Processa o envio e a recepção de mensagens da IA com MEMÓRIA (Corrigido)
async function sendMessage() {
    const inputField = document.getElementById('chat-input');
    const message = inputField.value.trim();
    if (!message) return; // Se o campo estiver vazio, não faz nada

    // 1. Exibe a mensagem do usuário na tela
    addMessageToChat('user', message);
    inputField.value = '';

    // 2. Exibe a bolha "Digitando..."
    const loadingId = addMessageToChat('bot', 'Digitando...');

    try {
        // 3. Monta o pacote de dados com a mensagem nova + a memória antiga
        const payloadData = { 
            message: message, 
            history: chatHistory 
        };

        // 4. Faz a requisição para o Google Apps Script
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            // Usamos text/plain para não ativar o bloqueio de segurança (CORS) do navegador
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payloadData)
        });

        // 5. Recebe a resposta da IA
        const data = await response.text(); 
        
        // 6. Remove a bolha de "Digitando..."
        const loadingElement = document.getElementById(loadingId);
        if(loadingElement) loadingElement.remove();
        
        if(data) {
            // Exibe a resposta do Fael
            addMessageToChat('bot', data);
            
            // 7. ATUALIZA A MEMÓRIA (Guarda essa conversa)
            chatHistory.push({ role: 'user', text: message });
            chatHistory.push({ role: 'bot', text: data });
            
            // Mantém apenas as últimas 10 mensagens na memória para a requisição não ficar lenta
            if (chatHistory.length > 10) {
                chatHistory = chatHistory.slice(chatHistory.length - 10);
            }
            
        } else {
            addMessageToChat('bot', "Desculpe, a resposta veio vazia. Pode me chamar no WhatsApp?");
        }

    } catch (error) {
        console.error("Erro no ChatBot:", error);
        const loadingElement = document.getElementById(loadingId);
        if(loadingElement) loadingElement.remove();
        addMessageToChat('bot', 'Ops, tive uma falha de conexão. Por favor, clique no botão para falar conosco direto no WhatsApp!');
    }
}