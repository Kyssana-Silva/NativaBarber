// ==========================================
// PÁGINA DE REGISTRO
// ==========================================

// Função para salvar um novo usuário
function saveUser(username, email, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário registrado com sucesso!');
    window.location.href = 'index.html'; // Redireciona para a página de login após o registro
}

// Envio do formulário de registro
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault(); 

    const username = document.getElementById('register-login').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validação do campo de e-mail
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    // Validação da confirmação de senha
    if (password !== confirmPassword) {
        alert('As senhas não coincidem. Por favor, tente novamente.');
        return;
    }

    // Salva o usuário caso tudo esteja correto
    saveUser(username, email, password);
});

// ==========================================
// PÁGINA DE LOGIN
// ==========================================

// Função para verificar o login
function verifyLogin(username, password) {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = storedUsers.find(u => u.username === username && u.password === password);
    if (user) {
        alert('Login realizado com sucesso!');
        window.location.href = 'dashboard.html'; // Redireciona para a página do painel (dashboard)
    } else {
        alert('Usuário ou senha incorretos.');
    }
}

// envio do formulário de login (login.html)
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    const username = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    verifyLogin(username, password); // Chama a função para verificar as credenciais
});
