const API_URL = 'http://localhost:3000';

console.log('📝 cadastro.js carregado - API URL:', API_URL);

// Função para mostrar mensagens
function mostrarMensagem(mensagem, tipo) {
    const divMensagem = document.getElementById('mensagem');
    divMensagem.textContent = mensagem;
    divMensagem.className = `mensagem ${tipo}`;
    divMensagem.style.display = 'block';
    
    // Rolagem suave para a mensagem
    divMensagem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
        divMensagem.style.display = 'none';
    }, 5000);
}

// Função para validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Função para validar CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Verificar se não é uma sequência repetida
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    return true;
}

// Event listener para o formulário
document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('📝 Iniciando processo de cadastro...');
    
    // Coletar dados do formulário
    const usuario = {
        nome: document.getElementById('nome').value.trim(),
        sobrenome: document.getElementById('sobrenome').value.trim(),
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value,
        rua: document.getElementById('rua').value.trim(),
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value,
        telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        isAdmin: false
    };
    
    console.log('📋 Dados coletados:', usuario);
    
    // Validações
    if (!usuario.nome || !usuario.sobrenome || !usuario.cpf || !usuario.email || !usuario.senha) {
        mostrarMensagem('❌ Por favor, preencha todos os campos obrigatórios!', 'erro');
        return;
    }
    
    if (!validarCPF(usuario.cpf)) {
        mostrarMensagem('❌ CPF inválido! Deve conter 11 dígitos numéricos.', 'erro');
        return;
    }
    
    if (!validarEmail(usuario.email)) {
        mostrarMensagem('❌ Email inválido! Digite um email válido.', 'erro');
        return;
    }
    
    if (usuario.senha.length < 6) {
        mostrarMensagem('❌ A senha deve ter pelo menos 6 caracteres!', 'erro');
        return;
    }
    
    if (usuario.cep.length !== 8) {
        mostrarMensagem('❌ CEP inválido! Deve conter 8 dígitos.', 'erro');
        return;
    }
    
    if (usuario.telefone.length < 10 || usuario.telefone.length > 11) {
        mostrarMensagem('❌ Telefone inválido! Deve conter 10 ou 11 dígitos.', 'erro');
        return;
    }
    
    // Desabilitar botão para evitar múltiplos cliques
    const btnSubmit = this.querySelector('button[type="submit"]');
    const btnOriginalText = btnSubmit.textContent;
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Cadastrando...';
    btnSubmit.classList.add('loading');
    
    try {
        console.log('🔍 Verificando se email já existe...');
        
        // Verificar se o email já existe
        const checkResponse = await fetch(`${API_URL}/usuarios?email=${usuario.email}`);
        
        if (!checkResponse.ok) {
            throw new Error(`Erro ao verificar email: ${checkResponse.status}`);
        }
        
        const usuariosExistentes = await checkResponse.json();
        console.log(`👥 Usuários com este email: ${usuariosExistentes.length}`);
        
        if (usuariosExistentes.length > 0) {
            mostrarMensagem('❌ Este email já está cadastrado! Tente fazer login.', 'erro');
            return;
        }
        
        console.log('🚀 Criando novo usuário...');
        
        // Fazer o POST para criar o usuário
        const createResponse = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuario)
        });
        
        console.log('📨 Status da criação:', createResponse.status);
        
        if (createResponse.ok) {
            const usuarioCriado = await createResponse.json();
            console.log('✅ USUÁRIO CRIADO COM SUCESSO:', usuarioCriado);
            
            mostrarMensagem('✅ Cadastro realizado com sucesso! Redirecionando...', 'sucesso');
            
            // Limpar formulário
            this.reset();
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            
        } else {
            const errorText = await createResponse.text();
            console.error('❌ Erro na criação:', errorText);
            throw new Error(`Erro ${createResponse.status} no servidor`);
        }
        
    } catch (error) {
        console.error('💥 ERRO COMPLETO NO CADASTRO:', error);
        
        if (error.message.includes('Failed to fetch')) {
            mostrarMensagem('❌ Erro de conexão! Verifique se o servidor está rodando na porta 3000.', 'erro');
        } else {
            mostrarMensagem(`❌ Erro: ${error.message}`, 'erro');
        }
    } finally {
        // Reabilitar botão
        btnSubmit.disabled = false;
        btnSubmit.textContent = btnOriginalText;
        btnSubmit.classList.remove('loading');
    }
});

// Adicionar máscaras e validações em tempo real
document.getElementById('cpf').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('cep').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

document.getElementById('telefone').addEventListener('input', function(e) {
    this.value = this.value.replace(/\D/g, '');
});

// Testar conexão com a API quando a página carregar
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🌐 Testando conexão com API...');
    
    try {
        const response = await fetch(`${API_URL}/usuarios`);
        console.log('🔌 Status da conexão:', response.status);
        
        if (response.ok) {
            const usuarios = await response.json();
            console.log(`✅ Conexão OK! ${usuarios.length} usuários no banco.`);
        } else {
            throw new Error(`Status ${response.status}`);
        }
    } catch (error) {
        console.error('❌ Falha na conexão:', error);
        mostrarMensagem('⚠️ Aviso: Não foi possível conectar ao servidor. O cadastro não funcionará.', 'erro');
    }
});