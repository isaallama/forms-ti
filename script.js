document.addEventListener("DOMContentLoaded", function () {
  // Inicialização da assinatura digital
  const canvas = document.getElementById("signature-pad");
  const signaturePad = new SignaturePad(canvas, {
    backgroundColor: "rgba(255, 255, 255, 0)",
    penColor: "rgb(0, 0, 0)",
  });

  // Ajustar o tamanho do canvas para assinatura
  function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
    signaturePad.clear(); // Limpa a assinatura quando redimensiona
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Limpar assinatura
  document
    .getElementById("clear-signature")
    .addEventListener("click", function () {
      signaturePad.clear();
    });

  // Função para adicionar novo item de patrimônio
  function addPatrimonioItem() {
    const container = document.getElementById("patrimonios-container");
    const newItem = document.createElement("div");
    newItem.className = "patrimonio-item";
    newItem.style.display = "flex";
    newItem.style.alignItems = "center";
    newItem.style.gap = "16px";
    newItem.innerHTML = `
      <input type="text" class="patrimonio-input" placeholder="Número/Descrição do patrimônio" required>
      <div class="checkbox-inline" style="display: flex; gap: 8px;">
        <label>
          <input type="checkbox" name="equipamento" value="PC"> PC
        </label>
        <label>
          <input type="checkbox" name="equipamento" value="Notebook"> Notebook
        </label>
        <label>
          <input type="checkbox" name="equipamento" value="Monitor"> Monitor
        </label>
      </div>
      <button type="button" class="remove-btn">Remover</button>
    `;

    // Adiciona evento ao botão remover
    newItem.querySelector('.remove-btn').addEventListener('click', function() {
      newItem.remove();
      updateRemoveButtons();
    });

    container.appendChild(newItem);
    updateRemoveButtons();
  }

  // Atualizar estado dos botões de remover
  function updateRemoveButtons() {
    const items = document.querySelectorAll(".patrimonio-item");
    const buttons = document.querySelectorAll(".remove-btn");

    if (items.length === 1) {
      buttons[0].disabled = true;
    } else {
      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
  }

  // Evento para adicionar patrimônio
  document.getElementById("add-patrimonio").addEventListener("click", function () {
    addPatrimonioItem();
  });

  // Evento para o botão remover do primeiro item já existente
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      btn.closest('.patrimonio-item').remove();
      updateRemoveButtons();
    });
  });

  // Inicializa o estado dos botões de remover
  updateRemoveButtons();

  // Máscara para o campo de telefone
  const telefoneInput = document.getElementById("telefone");
  telefoneInput.addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 2) {
      value = "(" + value.substring(0, 2) + ") " + value.substring(2);
    }

    if (value.length > 9) {
      value = value.substring(0, 10) + "-" + value.substring(10);
    }

    e.target.value = value;
  });

  // Gerar PDF
  document.getElementById("gerar-pdf").addEventListener("click", function () {
    if (!validateForm()) {
      alert(
        "Por favor, preencha todos os campos obrigatórios e assine o documento.",
      );
      return;
    }

    generatePDF();
  });

  // Validar formulário
  function validateForm() {
    const form = document.getElementById("registroForm");
    const inputs = form.querySelectorAll("input[required], textarea[required]");
    let valid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        valid = false;
        input.classList.add("error");
      } else {
        input.classList.remove("error");
      }
    });

    if (signaturePad.isEmpty()) {
      valid = false;
      document.getElementById("signature-pad").classList.add("error");
    } else {
      document.getElementById("signature-pad").classList.remove("error");
    }

    return valid;
  }

  // Gerar PDF com os dados do formulário
  function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Configurações do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Protocolo de Entrega", 105, 20, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Dados do formulário
    const responsavel = document.getElementById("responsavel").value;
    const identificador = document.getElementById("identificador").value;
    const telefone = document.getElementById("telefone").value;

    // Adicionar dados ao PDF
    let yPos = 40;
    const lineHeight = 10;

    doc.setFont("helvetica", "bold");
    doc.text("Dados do Registro:", 20, yPos);
    yPos += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Responsável: ${responsavel}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Identificador: ${identificador}`, 20, yPos);
    yPos += lineHeight;

    doc.text(`Telefone: ${telefone}`, 20, yPos);
    yPos += lineHeight;

    // Lista de patrimônios
    const patrimonios = document.querySelectorAll(".patrimonio-item");
    patrimonios.forEach((item, index) => {
      const input = item.querySelector(".patrimonio-input");
      if (input.value.trim()) {
        const checkboxes = item.querySelectorAll(
          'input[type="checkbox"]:checked',
        );
        const equipamentosMarcados = Array.from(checkboxes).map(
          (cb) => cb.value,
        );
        let texto = `${index + 1}. ${input.value}`;
        if (equipamentosMarcados.length > 0) {
          texto += ` [${equipamentosMarcados.join(", ")}]`;
        }
        doc.text(texto, 20, yPos);
        yPos += lineHeight;
      }
    });

    // Adicionar assinatura
    doc.setFont("helvetica", "bold");
    doc.text("Assinatura do Responsável:", 20, yPos);
    yPos += lineHeight;

    // Converter assinatura para imagem
    const signatureData = signaturePad.toDataURL();
    doc.addImage(signatureData, "PNG", 20, yPos, 70, 30);

    // Adicionar data e hora de geração
    yPos = 280;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const now = new Date();
    doc.text(`Documento gerado em: ${now.toLocaleString()}`, 20, yPos);

    // Salvar o PDF
    doc.save("Protocolo_Entrega.pdf");
  }

  // Formatar data para o formato brasileiro
  function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  }
});