/**
 * Módulo de Indicadores Económicos - Nicaragua Informate
 * Maneja la visualización del dólar y combustibles
 */

export class IndicadoresManager {
  constructor(firebaseDB) {
    this.db = firebaseDB;
    this.defaults = {
      dolar: '36.62',
      regular: '47.84',
      super: '49.03',
      diesel: '43.21'
    };
  }

  init() {
    this.actualizar();
    // Actualizar cada 5 minutos
    setInterval(() => this.actualizar(), 5 * 60 * 1000);

    // Botón de actualización manual
    const btn = document.getElementById('refreshIndicadoresBtn');
    if (btn) {
      btn.addEventListener('click', () => this.actualizar());
    }
  }

  async actualizar() {
    const hora = new Date().toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
    
    let dolar = null;
    let fuelValues = null;

    try {
      dolar = await this.obtenerTasaDolar();
      const config = await this.getIndicadoresConfig();
      
      if (config?.gasolina) {
        fuelValues = {
          regular: config.gasolina.regular ?? this.defaults.regular,
          super: config.gasolina.super ?? this.defaults.super,
          diesel: config.gasolina.diesel ?? this.defaults.diesel
        };
      }
    } catch (e) {
      // Usar valores guardados o defaults
      const saved = JSON.parse(localStorage.getItem('indicadoresEconomicos') || 'null');
      dolar = saved?.dolar || this.defaults.dolar;
      fuelValues = saved?.regular ? saved : this.defaults;
    }

    this.actualizarUI(dolar || this.defaults.dolar, fuelValues || this.defaults, hora);
  }

  async obtenerTasaDolar() {
    const sources = [
      'https://api.exchangerate-api.com/v4/latest/USD',
      'https://open.er-api.com/v6/latest/USD',
      'https://api.frankfurter.app/latest?from=USD&to=NIO'
    ];

    for (const url of sources) {
      try {
        const resp = await fetch(url, { cache: 'no-store', mode: 'cors' });
        if (!resp.ok) continue;
        const data = await resp.json();
        if (data?.rates?.NIO) return Number(data.rates.NIO).toFixed(4);
        const key = Object.keys(data?.rates || {}).find(k => k.toUpperCase() === 'NIO');
        if (key) return Number(data.rates[key]).toFixed(4);
      } catch (e) {
        continue;
      }
    }
    return null;
  }

  async getIndicadoresConfig() {
    if (!this.db) return null;
    
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      const ref = doc(this.db, 'config', 'indicadores');
      const snapshot = await getDoc(ref);
      return snapshot.exists() ? snapshot.data() : null;
    } catch (e) {
      return null;
    }
  }

  actualizarUI(dolar, fuelValues, hora) {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('ind-dolar', `C$ ${dolar}`);
    setText('ind-regular', `C$ ${fuelValues.regular || this.defaults.regular}`);
    setText('ind-super', `C$ ${fuelValues.super || this.defaults.super}`);
    setText('ind-diesel', `C$ ${fuelValues.diesel || this.defaults.diesel}`);
    setText('ind-last-updated', hora);

    localStorage.setItem('indicadoresEconomicos', JSON.stringify({
      dolar,
      ...fuelValues,
      updated: hora
    }));
  }
}
