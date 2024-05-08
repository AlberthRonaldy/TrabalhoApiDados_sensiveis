function base64Encoder(input) {
  const tabelaBase64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let stringEncoded = "";
  let stringInBits = "";

  // Validando o tipo da minha entrada - DEVE SER STRING
  if (typeof input !== "number" && typeof input !== "string") {
    throw new Error(
      "Tipo de entrada não suportado. Apenas números e strings são permitidos."
    );
  }
  const string = typeof input === "number" ? String(input) : input;

  // Transformando string para binario
  for (let i = 0; i < string.length; i++) {
    stringInBits += string.charCodeAt(i).toString(2).padStart(8, "0");
  }

  while (stringInBits.length != 0) {
    // Separando meu binario em sextetos
    bin = stringInBits.slice(0, 6);

    // Caso meu binario nao complete um sexteto, sera completado por zeros
    zeroLength = 6 - bin.length;
    if (bin.length < 6) for (let i = 0; i < zeroLength; i++) bin += 0;
    // Transformando meu sexto em decimal
    binToDecimal = parseInt(parseInt(bin, 2).toString(10));

    // Retornado o caracter corresponde na posicao do decimal gerado
    decimalToString = tabelaBase64[binToDecimal];

    // Montando minha string Codificada
    stringEncoded += decimalToString;

    // Removendo os 6 bits tratados, para continuar o tratamento
    stringInBits = stringInBits.slice(6);
  }

  // Minha string codificada, sempre deve ser um multiplo de 4
  const paddingLength = 4 - (stringEncoded.length % 4);
  if (paddingLength !== 4) {
    stringEncoded += "=".repeat(paddingLength);
  }
  return stringEncoded;
}

function base64Decoder(input) {
  const tabelaBase64 =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  let decodedString = "";

  // Removendo os pads inseridos na codificacao
  stringDecoded = input.replaceAll("=", "");

  // Buscando o charcode de cada caracter na tabela64
  stringToDecimal = stringDecoded
    .split("")
    .map((ele) => tabelaBase64.indexOf(ele));

  // Transformando meu decimal em binario
  decimalToSextetos = stringToDecimal.map((ele) =>
    parseInt(ele, 10).toString(2)
  );

  // Adicionando zeros a esquerda do meu binario para garantir que cada um tenha 6 bits
  decimalToSextetos = decimalToSextetos.map((ele) => ele.padStart(6, "0"));

  // concatenando esse sextetos gerados
  let binaryToString = decimalToSextetos.join("");

  while (binaryToString.length >= 8) {
    // Selecionando os bytes
    const byte = binaryToString.substring(0, 8);

    // Transformar os bytes em decimais
    const charCode = parseInt(byte, 2);

    // Buscar o caracter correspondente ao charCode na tabela ASCII
    decodedString += String.fromCharCode(charCode);

    // Removendo o primeiro Byte da nossa binaryToString (Concatenacao de bytes)
    binaryToString = binaryToString.substring(8);
  }

  return decodedString;
}

export { base64Decoder, base64Encoder };
