// ==========================================
// PÁGINA DE REGISTRO
// ==========================================

// Função para salvar um novo usuário 
function saveUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = { username, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Usuário registrado com sucesso!');
    window.location.href = 'index.html'; // Redireciona para a página de login após o registro
}

// envio do formulário de registro (registro.html)
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o envio padrão do formulário
    const username = document.getElementById('register-login').value;
    const password = document.getElementById('register-password').value;
    saveUser(username, password); // Chama a função de salvar usuário
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
