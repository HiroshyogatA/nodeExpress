console.log('📍 localizacao.js carregado - DH VEICULOS');

// Dados das lojas atualizados
const lojas = [
    {
        id: 1,
        cidade: "Suzano",
        bairro: "Centro",
        endereco: "Rua Jacomo Braghiroli, 23 - Centro",
        telefone: "(11) 3333-4444",
        email: "suzano@dhveiculos.com",
        horario: "Seg-Sex: 8h-20h | Sáb: 8h-18h"
    },
    {
        id: 2,
        cidade: "Mogi das Cruzes", 
        bairro: "Centro",
        endereco: "Rua Dr. Paulo Frontim, 249 - Centro",
        telefone: "(21) 2555-6666",
        email: "mogi@dhveiculos.com",
        horario: "Seg-Sex: 8h-20h | Sáb: 8h-18h"
    }
];

// Função para buscar lojas por cidade
function buscarLojas() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    
    const termo = input.value.toLowerCase().trim();
    
    if (termo === '') {
        carregarTodasLojas();
        return;
    }
    
    const lojasFiltradas = lojas.filter(loja => 
        loja.cidade.toLowerCase().includes(termo) ||
        loja.bairro.toLowerCase().includes(termo) ||
        loja.endereco.toLowerCase().includes(termo)
    );
    
    exibirLojas(lojasFiltradas);
}

// Carregar todas as lojas
function carregarTodasLojas() {
    exibirLojas(lojas);
}

// Exibir lojas no grid
function exibirLojas(lojasParaExibir) {
    const grid = document.querySelector('.locations-grid');
    if (!grid) return;
    
    if (lojasParaExibir.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>❌ Nenhuma loja encontrada</h3>
                <p>Tente buscar por outra cidade ou bairro.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = lojasParaExibir.map(loja => `
        <div class="location-card">
            <h3>${loja.cidade} - ${loja.bairro}</h3>
            <p>📍 ${loja.endereco}</p>
            <p>📞 ${loja.telefone}</p>
            <p>📧 ${loja.email}</p>
            <p>🕒 ${loja.horario}</p>
            <div class="location-actions">
                <button class="btn-secondary" onclick="selecionarLoja(${loja.id})">
                    📍 Selecionar Loja
                </button>
                <button class="btn-primary" onclick="abrirRota('${loja.endereco}, ${loja.cidade}')">
                    🗺️ Como Chegar
                </button>
            </div>
        </div>
    `).join('');
}

// Selecionar loja
function selecionarLoja(id) {
    const loja = lojas.find(l => l.id === id);
    if (loja) {
        alert(`🏪 Loja selecionada:\n\n${loja.cidade} - ${loja.bairro}\n${loja.endereco}\n\nTelefone: ${loja.telefone}\nEmail: ${loja.email}\n\nHorário: ${loja.horario}`);
        console.log('🏪 Loja selecionada:', loja);
        
        // Destacar a loja selecionada no grid
        const cards = document.querySelectorAll('.location-card');
        cards.forEach(card => card.classList.remove('selected'));
        cards[id-1]?.classList.add('selected');
    }
}

// Abrir rota no maps
function abrirRota(endereco) {
    const enderecoCodificado = encodeURIComponent(endereco);
    const urlMaps = `https://www.google.com/maps/search/?api=1&query=${enderecoCodificado}`;
    
    const confirmacao = confirm(`🗺️ Abrir rota para:\n${endereco}\n\nNo Google Maps?`);
    
    if (confirmacao) {
        window.open(urlMaps, '_blank');
        console.log('🗺️ Abrindo rota para:', endereco);
    }
}

// Função para simular mapa interativo
function inicializarMapa() {
    console.log('🗺️ Inicializando mapa DH VEICULOS...');
    
    const mapaPlaceholder = document.querySelector('.map-placeholder');
    if (mapaPlaceholder) {
        mapaPlaceholder.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3 style="margin-bottom: 1rem;">📍 Nossas Lojas - DH VEICULOS</h3>
                <div style="background: white; padding: 1.5rem; border-radius: 10px; margin: 1rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <div style="margin-bottom: 1rem;">
                        <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">🏪 Suzano - Centro</h4>
                        <p style="margin: 0.2rem 0; color: #555;">Rua Jacomo Braghiroli, 23</p>
                        <p style="margin: 0.2rem 0; color: #555;">(11) 3333-4444</p>
                    </div>
                    <div style="margin-bottom: 1rem; padding-top: 1rem; border-top: 1px solid #eee;">
                        <h4 style="color: #2c3e50; margin-bottom: 0.5rem;">🏪 Mogi das Cruzes - Centro</h4>
                        <p style="margin: 0.2rem 0; color: #555;">Rua Dr. Paulo Frontim, 249</p>
                        <p style="margin: 0.2rem 0; color: #555;">(21) 2555-6666</p>
                    </div>
                </div>
                <p style="margin: 1rem 0; color: #666;">
                    <strong>Como chegar:</strong><br>
                    Use Waze ou Google Maps e digite "DH VEICULOS"
                </p>
                <button class="btn-primary" onclick="abrirTodasLojasNoMaps()" style="margin: 0.5rem;">
                    🗺️ Ver Todas no Maps
                </button>
                <button class="btn-secondary" onclick="mostrarContatos()" style="margin: 0.5rem;">
                    📞 Contatos
                </button>
            </div>
        `;
    }
}

// Abrir todas as lojas no maps
function abrirTodasLojasNoMaps() {
    alert('🗺️ Em um sistema real, esta função abriria o Google Maps com todas as localizações das lojas DH VEICULOS.\n\nPor enquanto, use o aplicativo de mapas e busque por "DH VEICULOS".');
    console.log('🗺️ Abrindo todas as lojas no Google Maps...');
}

// Mostrar contatos
function mostrarContatos() {
    const contatos = `
📞 **Contatos DH VEICULOS**

🏪 **Suzano - Centro**
📍 Rua Jacomo Braghiroli, 23 - Centro
📞 (11) 3333-4444
📧 suzano@dhveiculos.com
🕒 Seg-Sex: 8h-20h | Sáb: 8h-18h

🏪 **Mogi das Cruzes - Centro**
📍 Rua Dr. Paulo Frontim, 249 - Centro  
📞 (21) 2555-6666
📧 mogi@dhveiculos.com
🕒 Seg-Sex: 8h-20h | Sáb: 8h-18h

💬 **Central de Atendimento:**
📞 0800-123-4567
📧 contato@dhveiculos.com
    `;
    
    alert(contatos);
    console.log('📞 Contatos exibidos');
}

// Adicionar campo de busca
function adicionarCampoBusca() {
    const locationsSection = document.querySelector('.locations-section');
    if (locationsSection && !document.getElementById('searchInput')) {
        const searchHTML = `
            <div class="search-container" style="max-width: 500px; margin: 0 auto 2rem auto;">
                <div class="search-box" style="display: flex; gap: 0.5rem;">
                    <input type="text" id="searchInput" placeholder="Buscar lojas por cidade, bairro ou endereço..." 
                           style="flex: 1; padding: 12px; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem;">
                    <button onclick="buscarLojas()" class="btn-secondary" style="white-space: nowrap;">
                        🔍 Buscar
                    </button>
                    <button onclick="carregarTodasLojas()" class="btn-secondary" style="white-space: nowrap;">
                        🔄 Todas
                    </button>
                </div>
                <p style="text-align: center; margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                    ${lojas.length} lojas disponíveis
                </p>
            </div>
        `;
        locationsSection.querySelector('.subtitle').insertAdjacentHTML('afterend', searchHTML);
        
        // Adicionar evento de input para busca em tempo real
        document.getElementById('searchInput').addEventListener('input', buscarLojas);
        
        // Adicionar evento Enter para busca
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarLojas();
            }
        });
    }
}

// Adicionar estilos para loja selecionada
function adicionarEstilos() {
    const style = document.createElement('style');
    style.textContent = `
        .location-card.selected {
            border-left: 4px solid #27ae60;
            background: linear-gradient(135deg, #f8fff8, #ffffff);
            transform: scale(1.02);
        }
        .location-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
            flex-wrap: wrap;
        }
        .location-actions button {
            flex: 1;
            min-width: 120px;
        }
        @media (max-width: 768px) {
            .location-actions {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página de localização DH VEICULOS carregada');
    console.log(`📍 ${lojas.length} lojas cadastradas`);
    
    carregarTodasLojas();
    inicializarMapa();
    adicionarCampoBusca();
    adicionarEstilos();
    
    // Log das lojas carregadas
    lojas.forEach(loja => {
        console.log(`🏪 ${loja.cidade} - ${loja.endereco}`);
    });
});

// Função para desenvolvimento - mostrar info no console
function mostrarInfoLojas() {
    console.group('🏪 Informações das Lojas DH VEICULOS');
    lojas.forEach(loja => {
        console.log(`
ID: ${loja.id}
Cidade: ${loja.cidade}
Endereço: ${loja.endereco}
Telefone: ${loja.telefone}
Email: ${loja.email}
Horário: ${loja.horario}
        `);
    });
    console.groupEnd();
}

// Chamar função de info (útil para desenvolvimento)
setTimeout(mostrarInfoLojas, 1000);