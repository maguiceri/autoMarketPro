(() => {
  const WHATSAPP = '5491158057874';

  // Marcas y modelos por tipo de vehículo. Para agregar o quitar opciones, editar estas listas.
  const CATALOG = {
    Auto: {
      'Alfa Romeo': ['Giulia', 'Giulietta', 'Mito', 'Stelvio', 'Tonale'],
      Audi: ['A1', 'A3', 'A4', 'A5', 'A6', 'Q2', 'Q3', 'Q5', 'Q7', 'Q8'],
      BAIC: ['X25', 'X35', 'X55', 'BJ30'],
      BMW: ['Serie 1', 'Serie 2', 'Serie 3', 'Serie 4', 'Serie 5', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6'],
      BYD: ['Dolphin Mini', 'Song Pro', 'Yuan Pro'],
      Chery: ['QQ', 'Arrizo 5', 'Tiggo 2', 'Tiggo 3', 'Tiggo 4', 'Tiggo 5', 'Tiggo 7', 'Tiggo 8'],
      Chevrolet: ['Agile', 'Aveo', 'Captiva', 'Celta', 'Classic', 'Cobalt', 'Corsa', 'Cruze', 'Equinox', 'Joy', 'Meriva', 'Onix', 'Prisma', 'Sonic', 'Spin', 'Tracker', 'Trailblazer', 'Vectra', 'Zafira'],
      Citroën: ['Basalt', 'Berlingo', 'C3', 'C3 Aircross', 'C3 Picasso', 'C4', 'C4 Cactus', 'C4 Lounge', 'C4 Picasso', 'C5 Aircross', 'C-Elysée', 'Xsara Picasso'],
      DS: ['DS3', 'DS4', 'DS7'],
      Fiat: ['500', '600', 'Argo', 'Bravo', 'Cronos', 'Fastback', 'Grand Siena', 'Idea', 'Linea', 'Mobi', 'Palio', 'Pulse', 'Punto', 'Siena', 'Uno'],
      Ford: ['Bronco', 'Bronco Sport', 'EcoSport', 'Everest', 'Fiesta', 'Focus', 'Ka', 'Kuga', 'Mondeo', 'Mustang', 'Territory'],
      Haval: ['H2', 'H6', 'Jolion'],
      Honda: ['Accord', 'City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'WR-V', 'ZR-V'],
      Hyundai: ['Creta', 'Grand i10', 'HB20', 'i10', 'i30', 'Kona', 'Santa Fe', 'Tucson', 'Veloster'],
      Jeep: ['Cherokee', 'Commander', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler'],
      Kia: ['Carnival', 'Cerato', 'Picanto', 'Rio', 'Seltos', 'Sorento', 'Soul', 'Sportage'],
      'Land Rover': ['Defender', 'Discovery', 'Evoque', 'Range Rover'],
      'Mercedes-Benz': ['Clase A', 'Clase B', 'Clase C', 'Clase E', 'CLA', 'GLA', 'GLB', 'GLC', 'GLE'],
      Mini: ['Cooper', 'Countryman'],
      Mitsubishi: ['ASX', 'Eclipse Cross', 'Lancer', 'Montero', 'Outlander'],
      Nissan: ['Kicks', 'March', 'Murano', 'Note', 'Sentra', 'Tiida', 'Versa', 'X-Trail'],
      Peugeot: ['2008', '206', '207', '208', '3008', '301', '307', '308', '408', '5008', 'Partner'],
      Renault: ['Arkana', 'Boreal', 'Captur', 'Clio', 'Duster', 'Fluence', 'Kangoo', 'Kardian', 'Koleos', 'Kwid', 'Logan', 'Mégane', 'Sandero', 'Stepway', 'Symbol'],
      Subaru: ['Forester', 'Impreza', 'Outback', 'XV'],
      Suzuki: ['Baleno', 'Grand Vitara', 'Jimny', 'Swift', 'Vitara'],
      Toyota: ['Camry', 'C-HR', 'Corolla', 'Corolla Cross', 'Etios', 'Prius', 'RAV4', 'SW4', 'Yaris', 'Yaris Cross'],
      Volkswagen: ['Bora', 'Fox', 'Gol', 'Gol Trend', 'Golf', 'Nivus', 'Passat', 'Polo', 'Suran', 'T-Cross', 'Taos', 'Tiguan', 'Up!', 'Vento', 'Virtus', 'Voyage'],
      Volvo: ['S60', 'XC40', 'XC60', 'XC90'],
    },
    Camioneta: {
      Chevrolet: ['Montana', 'S10', 'Silverado'],
      Citroën: ['Berlingo', 'Jumper', 'Jumpy'],
      Fiat: ['Ducato', 'Fiorino', 'Strada', 'Titano', 'Toro'],
      Ford: ['F-150', 'Maverick', 'Ranger', 'Transit'],
      Foton: ['Tunland'],
      'Great Wall': ['Poer', 'Wingle'],
      Hyundai: ['H1', 'Staria'],
      Isuzu: ['D-Max'],
      Iveco: ['Daily'],
      JAC: ['T6', 'T8'],
      Jeep: ['Gladiator'],
      'Mercedes-Benz': ['Sprinter', 'Vito'],
      Mitsubishi: ['L200'],
      Nissan: ['Frontier', 'NP300'],
      Peugeot: ['Boxer', 'Expert', 'Landtrek', 'Partner'],
      Ram: ['1500', '2500', 'Dakota', 'Rampage'],
      Renault: ['Alaskan', 'Kangoo', 'Master', 'Oroch'],
      Toyota: ['Hiace', 'Hilux', 'SW4', 'Tundra'],
      Volkswagen: ['Amarok', 'Saveiro'],
    },
    Camión: {
      Agrale: ['8700', '10000', '14000'],
      DAF: ['CF', 'XF'],
      Fiat: ['Ducato'],
      Ford: ['Cargo', 'F-4000', 'F-14000'],
      Foton: ['Aumark', 'Auman'],
      Hino: ['Serie 300', 'Serie 500'],
      Hyundai: ['HD65', 'HD78', 'Mighty'],
      Isuzu: ['NPR', 'NQR'],
      Iveco: ['Cursor', 'Daily', 'Eurocargo', 'Stralis', 'S-Way', 'Tector'],
      JAC: ['1040', '1063'],
      Kia: ['K2500'],
      MAN: ['TGS', 'TGX'],
      'Mercedes-Benz': ['Accelo', 'Actros', 'Arocs', 'Atego', 'Axor'],
      'Renault Trucks': ['Serie C', 'Serie D', 'Serie K', 'Serie T'],
      Scania: ['Serie G', 'Serie P', 'Serie R', 'Serie S'],
      Volkswagen: ['Constellation', 'Delivery', 'Worker'],
      Volvo: ['FH', 'FM', 'FMX', 'VM'],
    },
  };

  const PLACES = [
    'Buenos Aires Capital (CABA)', 'Buenos Aires', 'Mar del Plata', 'Santa Fe', 'Rosario', 'Córdoba', 'Mendoza', 'Neuquén',
    'Catamarca', 'Chaco', 'Chubut', 'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Misiones',
    'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán',
  ];

  const OTHER_BRAND = 'Otra marca';
  const OTHER_MODEL = 'Otro modelo';

  const dialog = document.getElementById('solicitar');
  if (!dialog || !dialog.showModal) return;
  const form = dialog.querySelector('form');
  const { marca, modelo, lugar } = form.elements;
  const error = dialog.querySelector('.req-error');

  function fill(select, placeholder, options) {
    select.replaceChildren(new Option(placeholder, '', true, true), ...options.map((o) => new Option(o, o)));
    select.options[0].disabled = true;
  }

  function fillBrands() {
    fill(marca, 'Elegí la marca', [...Object.keys(CATALOG[form.elements.tipo.value]), OTHER_BRAND]);
    fill(modelo, 'Elegí primero la marca', []);
    modelo.disabled = true;
  }

  function fillModels() {
    const models = CATALOG[form.elements.tipo.value][marca.value] || [];
    fill(modelo, 'Elegí el modelo', [...models, OTHER_MODEL]);
    modelo.disabled = false;
  }

  fillBrands();
  fill(lugar, 'Elegí el lugar', PLACES);

  form.addEventListener('change', (e) => {
    if (e.target.name === 'tipo') fillBrands();
    if (e.target === marca) fillModels();
    error.hidden = true;
  });

  // Cualquier botón "Solicitar revisión" abre el formulario
  document.addEventListener('click', (e) => {
    if (e.target.closest('a[href="#solicitar"]')) {
      e.preventDefault();
      dialog.showModal();
    } else if (e.target.closest('.req-close') || e.target === dialog) {
      dialog.close();
    }
  });

  // Al enviar se arma el mensaje y se abre el chat de WhatsApp con la consulta escrita
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!marca.value || !modelo.value || !lugar.value) {
      error.hidden = false;
      (!marca.value ? marca : !modelo.value ? modelo : lugar).focus();
      return;
    }
    const vehiculo = marca.value === OTHER_BRAND ? 'Otra marca (a confirmar)' : `${marca.value} ${modelo.value === OTHER_MODEL ? '(otro modelo)' : modelo.value}`;
    const text = [
      'Hola AutoMarketPro, quiero solicitar una verificación.',
      '',
      `Vehículo a verificar: ${form.elements.tipo.value}`,
      `Marca y modelo: ${vehiculo}`,
      `Lugar de verificación: ${lugar.value}`,
    ].join('\n');
    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
    if (!window.open(url, '_blank', 'noopener')) location.href = url;
    dialog.close();
  });
})();
