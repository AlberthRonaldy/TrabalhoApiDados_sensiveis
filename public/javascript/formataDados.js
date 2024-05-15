function formatarDados() {
    var table = document.getElementById("table1");
    var rows = table.getElementsByTagName("tr");
    
    for (var i = 1; i < rows.length; i++) { // Começa do índice 1 para ignorar o cabeçalho
        var cells = rows[i].getElementsByTagName("td");
        
        for (var j = 0; j < cells.length; j++) {
            var columnName = table.getElementsByTagName("th")[j].innerText.trim();
            var texto = cells[j].innerText.trim();
            
            if (columnName === "RG") {
                if (texto.length >= 6) { // Verifica se o texto tem pelo menos 8 caracteres
                    var textoFormatado = texto.substring(0, 3) + "#".repeat(texto.length - 6) + texto.substring(texto.length - 3);
                    cells[j].textContent = textoFormatado;
                }
            } else if (columnName === "CEP") {
                if (texto.length >= 4) { // Verifica se o texto tem pelo menos 4 caracteres
                    var textoFormatado = texto.substring(0, 2) + "#".repeat(texto.length - 4) + texto.substring(texto.length - 2);
                    cells[j].textContent = textoFormatado;
                }
            } else if (columnName === "Telefone") {
                if (texto.length >= 6) { // Verifica se o texto tem pelo menos 8 caracteres
                    var primeiroParte = texto.substring(0, 4);
                    var ultimaParte = texto.substring(texto.length - 2);
                    var textoFormatado = primeiroParte + "#".repeat(texto.length - 6) + ultimaParte;
                    cells[j].textContent = textoFormatado;
                }
            } else if (columnName === "Filiação" || columnName === "Gênero") {
                cells[j].textContent = "#".repeat(texto.length);
            }
        }
    }
}
formatarDados();