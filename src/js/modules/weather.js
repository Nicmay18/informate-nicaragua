/**
 * Módulo de Clima - Nicaragua Informate
 * Maneja la visualización del clima de Managua
 */

export class WeatherManager {
  constructor() {
    this.el = null;
    this.interval = null;
  }

  init() {
    this.el = document.getElementById('clima');
    this.cargarClima();
    
    // Actualizar cada 10 minutos
    setInterval(() => this.cargarClima(), 10 * 60 * 1000);
  }

  async cargarClima() {
    if (!this.el) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=12.1364&longitude=-86.2514&current_weather=true',
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) throw new Error('Weather API error');
      
      const data = await response.json();
      const temp = Math.round(data.current_weather.temperature);
      
      const iconos = {
        0: '☀️',   // Despejado
        1: '🌤️',   // Principalmente despejado
        2: '⛅',   // Parcialmente nublado
        3: '☁️',   // Nublado
        45: '🌫️', // Neblina
        51: '🌦️', // Llovizna
        61: '🌧️', // Lluvia
        95: '⛈️'  // Tormenta
      };
      
      const icono = iconos[data.current_weather.weathercode] || '🌡️';
      this.el.innerHTML = `${icono} Managua: <strong>${temp}°C</strong>`;
    } catch (e) {
      this.el.innerHTML = '🌡️ Managua: <strong>28°C</strong>';
    }
  }
}
