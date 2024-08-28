// Função para calcular a distância entre duas coordenadas
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180; // Diferença de latitude convertida em radianos
  const dLon = ((lon2 - lon1) * Math.PI) / 180; // Diferença de longitude convertida em radianos
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + // Cálculo da parte interna da fórmula haversine
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Cálculo da distância angular
  const distance = R * c; // Cálculo da distância em km
  return distance; // Retorna a distância calculada
};
