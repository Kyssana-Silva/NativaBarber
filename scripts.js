document.addEventListener('DOMContentLoaded', () => {
  const appointmentsList = [];
  const appointmentsContainer = document.getElementById('appointments');
  const openModalBtn = document.getElementById('openScheduleModalBtn');
  const scheduleModal = document.getElementById('scheduleModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const scheduleForm = document.getElementById('scheduleForm');
  const attendanceChartCanvas = document.getElementById('attendanceChart');
  const graphPeriod = document.getElementById('graph-period');
  let editingAppointmentIndex = -1; // Variável para armazenar o índice do agendamento que está sendo editado

  // Função para abrir o modal de agendamento
  openModalBtn.addEventListener('click', () => {
    scheduleModal.style.display = 'flex';
    editingAppointmentIndex = -1; // Garantir que não há agendamento sendo editado
  });

  // Função para fechar o modal de agendamento
  closeModalBtn.addEventListener('click', () => {
    scheduleModal.style.display = 'none';
    scheduleForm.reset();
    editingAppointmentIndex = -1; // Limpar índice ao fechar o modal
  });

  // Função para adicionar ou editar um agendamento
  scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const clientName = document.getElementById('clientName').value;
    const appointmentTime = document.getElementById('appointmentTime').value;
    const service = document.getElementById('service').value;
    const price = document.getElementById('price').value;

    // Verificar se estamos editando um agendamento existente ou adicionando um novo
    if (editingAppointmentIndex > -1) {
      // Editando um agendamento existente
      appointmentsList[editingAppointmentIndex] = { clientName, appointmentTime, service, price };
    } else {
      // Adicionando um novo agendamento
      appointmentsList.push({ clientName, appointmentTime, service, price });
    }

    // Atualizando a lista de agendamentos e o gráfico
    updateAppointments();
    updateAttendanceGraph();

    // Fechando o modal após salvar o agendamento
    scheduleModal.style.display = 'none';
    scheduleForm.reset();
    editingAppointmentIndex = -1; // Limpar índice após salvar
  });

  // Função para formatar data e hora
  function formatDateTime(dateTime) {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateTime).toLocaleString('pt-BR', options);
  }

  // Função para exibir os agendamentos
  function updateAppointments() {
    appointmentsContainer.innerHTML = '';
    appointmentsList.forEach((appointment, index) => {
      const appointmentItem = document.createElement('p');
      appointmentItem.innerHTML = `
        <strong>${formatDateTime(appointment.appointmentTime)}</strong><br>
        ${appointment.clientName}<br>
        <small>${appointment.service}</small>
        <span class="float-end">R$${appointment.price}</span>
        <button class="btn btn-warning btn-sm float-end me-2 editBtn" data-index="${index}">Editar</button>
        <button class="btn btn-danger btn-sm float-end deleteBtn" data-index="${index}">Remover</button>
      `;
      appointmentsContainer.appendChild(appointmentItem);
    });
  }

  // Função para configurar o gráfico de atendimentos
  function updateAttendanceGraph() {
    const ctx = attendanceChartCanvas.getContext('2d');

    // Agrupar os atendimentos por data (apenas a data, sem horário)
    const aggregatedData = appointmentsList.reduce((acc, appointment) => {
      const date = appointment.appointmentTime.split('T')[0]; // Extraindo apenas a data
      acc[date] = (acc[date] || 0) + 1; // Contando os atendimentos por data
      return acc;
    }, {});

    // Preparando os dados para o gráfico
    const labels = Object.keys(aggregatedData); // Datas
    const data = Object.values(aggregatedData); // Contagem de atendimentos por data

    // Atualizando ou criando o gráfico
    if (window.attendanceChart) {
      window.attendanceChart.data.labels = labels;
      window.attendanceChart.data.datasets[0].data = data;
      window.attendanceChart.update(); // Atualiza o gráfico com os novos dados
    } else {
      window.attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Atendimentos',
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 45
              }
            }
          }
        }
      });
    }
  }

  // Função para atualizar o período do gráfico com a data atual
  function updateGraphPeriod() {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 1);
    const startStr = startDate.toLocaleDateString();
    const endStr = today.toLocaleDateString();
    graphPeriod.innerHTML = `Período: ${startStr} - ${endStr}`;
  }

  // Evento de clicar em "Editar" - preenche o modal com os dados do agendamento
  appointmentsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('editBtn')) {
      const index = e.target.getAttribute('data-index');
      const appointment = appointmentsList[index];
      
      // Preenche o formulário com os dados do agendamento
      document.getElementById('clientName').value = appointment.clientName;
      document.getElementById('appointmentTime').value = appointment.appointmentTime;
      document.getElementById('service').value = appointment.service;
      document.getElementById('price').value = appointment.price;

      // Exibe o modal de agendamento
      scheduleModal.style.display = 'flex';
      editingAppointmentIndex = index; // Marca o agendamento como sendo editado
    }

    // Evento de clicar em "Remover" - remove o agendamento da lista
    if (e.target.classList.contains('deleteBtn')) {
      const index = e.target.getAttribute('data-index');
      appointmentsList.splice(index, 1); // Remove o agendamento da lista
      updateAppointments(); // Atualiza a lista de agendamentos
      updateAttendanceGraph(); // Atualiza o gráfico
    }
  });

  // Inicialização do gráfico e dados
  updateGraphPeriod();
  updateAttendanceGraph();
});
