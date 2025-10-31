const API_URL = 'http://localhost:3000';

// Carregar veículos na página inicial
async function carregarVeiculos() {
    try {
        console.log('🚗 Carregando veículos...');
        const response = await fetch(`${API_URL}/veiculos`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        const veiculos = await response.json();
        console.log(`✅ ${veiculos.length} veículos carregados`);
        
        const grid = document.getElementById('vehiclesGrid');
        
        if (veiculos.length === 0) {
            grid.innerHTML = '<p class="no-vehicles">Nenhum veículo disponível no momento.</p>';
            return;
        }
        
        grid.innerHTML = veiculos.map(veiculo => `
            <div class="vehicle-card">
                <div class="vehicle-image" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                    ${veiculo.marca} ${veiculo.modelo}
                </div>
                <div class="vehicle-info">
                    <h3>${veiculo.marca} ${veiculo.modelo}</h3>
                    <p><strong>Ano:</strong> ${veiculo.ano}</p>
                    <p><strong>Categoria:</strong> ${veiculo.categoria}</p>
                    <p><strong>Status:</strong> ${veiculo.disponivel ? '✅ Disponível' : '❌ Indisponível'}</p>
                    <div class="vehicle-price">${veiculo.preco}/dia</div>
                    <button class="btn-primary" onclick="alugarVeiculo(${veiculo.id})" ${!veiculo.disponivel ? 'disabled' : ''}>
                        ${veiculo.disponivel ? 'Alugar Agora' : 'Indisponível'}
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('❌ Erro ao carregar veículos:', error);
        const grid = document.getElementById('vehiclesGrid');
        grid.innerHTML = `
            <div class="error-message">
                <p>❌ Erro ao carregar veículos. Verifique se o servidor está rodando.</p>
                <button onclick="carregarVeiculos()" class="btn-secondary">Tentar Novamente</button>
            </div>
        `;
    }
}

// Função para alugar veículo
function alugarVeiculo(veiculoId) {
    alert(`🚗 Veículo ${veiculoId} selecionado para aluguel!\n\nEm um sistema real, aqui seria o fluxo de reserva.`);
}

// Testar conexão com a API
async function testarConexao() {
    try {
        const response = await fetch(`${API_URL}/veiculos`);
        if (response.ok) {
            console.log('✅ Conexão com API estabelecida');
        } else {
            throw new Error('API não respondeu corretamente');
        }
    } catch (error) {
        console.error('❌ Erro na conexão com API:', error);
    }
}

// Inicializar página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página inicial carregada');
    testarConexao();
    carregarVeiculos();
});