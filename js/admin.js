const API_URL = 'http://localhost:3000';
let usuarios = [];

// Elementos do DOM
const modal = document.getElementById('userModal');
const closeBtn = document.querySelector('.close');
const userForm = document.getElementById('userForm');
const btnSalvar = document.getElementById('btnSalvar');
const btnEditar = document.getElementById('btnEditar');
const btnExcluir = document.getElementById('btnExcluir');

console.log('👨‍💼 admin.js carregado');

// Carregar todos os usuários
async function carregarUsuarios() {
    try {
        console.log('📥 Carregando usuários...');
        const response = await fetch(`${API_URL}/usuarios`);
        
        if (!response.ok) {
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        
        usuarios = await response.json();
        console.log(`✅ ${usuarios.length} usuários carregados`);
        exibirUsuarios(usuarios);
        
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        alert('Erro ao carregar usuários. Verifique se o servidor está rodando.');
    }
}

// Exibir usuários na tabela
function exibirUsuarios(usuariosLista) {
    const tbody = document.getElementById('usersTableBody');
    
    if (usuariosLista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: #666;">
                    Nenhum usuário cadastrado
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = usuariosLista.map(usuario => `
        <tr>
            <td><strong>${usuario.id}</strong></td>
            <td>${usuario.nome} ${usuario.sobrenome}</td>
            <td>${usuario.email}</td>
            <td>${formatarCPF(usuario.cpf)}</td>
            <td>${usuario.cidade}/${usuario.estado}</td>
            <td>${usuario.isAdmin ? '✅ Sim' : '❌ Não'}</td>
            <td class="action-buttons">
                <button class="btn-secondary" onclick="visualizarUsuario('${usuario.id}')">
                    👁️ Visualizar
                </button>
                <button class="btn-primary" onclick="editarUsuario('${usuario.id}')">
                    ✏️ Editar
                </button>
                <button class="btn-danger" onclick="excluirUsuario('${usuario.id}')">
                    🗑️ Excluir
                </button>
            </td>
        </tr>
    `).join('');
}

// Formatar CPF para exibição
function formatarCPF(cpf) {
    if (!cpf) return '';
    cpf = cpf.toString().replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Buscar usuário por ID
function buscarUsuario() {
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput.value.trim();
    
    if (!searchValue) {
        alert('Por favor, digite um ID para buscar!');
        return;
    }
    
    console.log(`🔍 Buscando usuário ID: ${searchValue}`);
    const usuario = usuarios.find(u => u.id.toString() === searchValue);
    
    if (usuario) {
        exibirUsuarios([usuario]);
        mostrarMensagem(`✅ Usuário ${searchValue} encontrado!`, 'sucesso');
    } else {
        alert(`❌ Usuário com ID ${searchValue} não encontrado!`);
        carregarUsuarios();
    }
}

// Visualizar usuário (somente leitura)
function visualizarUsuario(id) {
    console.log(`👀 Visualizando usuário ID: ${id}`);
    const usuario = usuarios.find(u => u.id.toString() === id);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    document.getElementById('modalTitle').textContent = `Visualizando: ${usuario.nome} ${usuario.sobrenome}`;
    preencherFormulario(usuario);
    desabilitarEdicao();
    
    btnSalvar.style.display = 'none';
    btnEditar.style.display = 'inline-block';
    btnExcluir.style.display = 'inline-block';
    
    modal.style.display = 'block';
}

// Editar usuário (modo edição)
function editarUsuario(id) {
    console.log(`✏️ Editando usuário ID: ${id}`);
    const usuario = usuarios.find(u => u.id.toString() === id);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    document.getElementById('modalTitle').textContent = `Editando: ${usuario.nome} ${usuario.sobrenome}`;
    preencherFormulario(usuario);
    habilitarEdicao();
    
    btnSalvar.style.display = 'inline-block';
    btnEditar.style.display = 'none';
    btnExcluir.style.display = 'inline-block';
    
    modal.style.display = 'block';
}

// Preencher formulário com dados do usuário
function preencherFormulario(usuario) {
    document.getElementById('editId').value = usuario.id;
    document.getElementById('editNome').value = usuario.nome || '';
    document.getElementById('editSobrenome').value = usuario.sobrenome || '';
    document.getElementById('editCpf').value = usuario.cpf || '';
    document.getElementById('editEmail').value = usuario.email || '';
    document.getElementById('editRua').value = usuario.rua || '';
    document.getElementById('editCep').value = usuario.cep || '';
    document.getElementById('editCidade').value = usuario.cidade || '';
    document.getElementById('editEstado').value = usuario.estado || '';
    document.getElementById('editTelefone').value = usuario.telefone || '';
}

// Habilitar/Desabilitar edição
function habilitarEdicao() {
    const inputs = userForm.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type !== 'hidden') {
            input.disabled = false;
        }
    });
    console.log('✏️ Modo edição habilitado');
}

function desabilitarEdicao() {
    const inputs = userForm.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.type !== 'hidden') {
            input.disabled = true;
        }
    });
    console.log('👁️ Modo visualização habilitado');
}

// Validar dados do formulário
function validarFormulario(dados) {
    if (!dados.nome || !dados.sobrenome) {
        alert('Nome e sobrenome são obrigatórios!');
        return false;
    }
    
    if (!dados.email || !dados.email.includes('@')) {
        alert('Email inválido!');
        return false;
    }
    
    if (!dados.cpf || dados.cpf.length !== 11) {
        alert('CPF deve conter 11 dígitos!');
        return false;
    }
    
    return true;
}

// Salvar alterações do usuário
async function salvarUsuario() {
    const id = document.getElementById('editId').value;
    const usuarioAtualizado = {
        nome: document.getElementById('editNome').value.trim(),
        sobrenome: document.getElementById('editSobrenome').value.trim(),
        cpf: document.getElementById('editCpf').value.replace(/\D/g, ''),
        email: document.getElementById('editEmail').value.trim(),
        rua: document.getElementById('editRua').value.trim(),
        cep: document.getElementById('editCep').value.replace(/\D/g, ''),
        cidade: document.getElementById('editCidade').value.trim(),
        estado: document.getElementById('editEstado').value,
        telefone: document.getElementById('editTelefone').value.replace(/\D/g, '')
    };
    
    console.log(`💾 Salvando alterações do usuário ${id}:`, usuarioAtualizado);
    
    // Validações
    if (!validarFormulario(usuarioAtualizado)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarioAtualizado),
        });
        
        if (response.ok) {
            const usuarioSalvo = await response.json();
            console.log('✅ Usuário atualizado:', usuarioSalvo);
            mostrarMensagem('✅ Usuário atualizado com sucesso!', 'sucesso');
            modal.style.display = 'none';
            carregarUsuarios();
        } else {
            throw new Error(`Erro ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar usuário:', error);
        mostrarMensagem('❌ Erro ao atualizar usuário. Tente novamente.', 'erro');
    }
}

// Excluir usuário
async function excluirUsuario(id) {
    const usuario = usuarios.find(u => u.id.toString() === id);
    
    if (!usuario) {
        alert('Usuário não encontrado!');
        return;
    }
    
    const confirmacao = confirm(`⚠️ Tem certeza que deseja excluir o usuário "${usuario.nome} ${usuario.sobrenome}"?\n\nEsta ação não pode ser desfeita!`);
    
    if (!confirmacao) {
        console.log('❌ Exclusão cancelada pelo usuário');
        return;
    }
    
    console.log(`🗑️ Excluindo usuário ID: ${id}`);
    
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
        });
        
        if (response.ok) {
            console.log('✅ Usuário excluído com sucesso');
            mostrarMensagem('✅ Usuário excluído com sucesso!', 'sucesso');
            carregarUsuarios();
        } else {
            throw new Error(`Erro ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Erro ao excluir usuário:', error);
        mostrarMensagem('❌ Erro ao excluir usuário. Tente novamente.', 'erro');
    }
}

// Event Listeners
btnSalvar.addEventListener('click', salvarUsuario);

btnEditar.addEventListener('click', () => {
    const id = document.getElementById('editId').value;
    editarUsuario(id);
});

btnExcluir.addEventListener('click', async () => {
    const id = document.getElementById('editId').value;
    await excluirUsuario(id);
    modal.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    console.log('❌ Modal fechado');
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        console.log('❌ Modal fechado (clique externo)');
    }
});

// Função auxiliar para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    // Criar elemento de mensagem temporário
    const mensagemDiv = document.createElement('div');
    mensagemDiv.textContent = mensagem;
    mensagemDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    if (tipo === 'sucesso') {
        mensagemDiv.style.background = '#27ae60';
    } else {
        mensagemDiv.style.background = '#e74c3c';
    }
    
    document.body.appendChild(mensagemDiv);
    
    setTimeout(() => {
        mensagemDiv.remove();
    }, 3000);
}

// Adicionar estilos para animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .action-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .action-buttons button {
        padding: 6px 12px;
        font-size: 0.8rem;
    }
    
    @media (max-width: 768px) {
        .action-buttons {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(style);

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Página admin carregada');
    carregarUsuarios();
});