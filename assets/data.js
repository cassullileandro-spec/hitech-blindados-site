/* ============================================================
   Hi-Tech Blindados — Dataset do protótipo
   Dados e fotos REAIS extraídos de hitechblindados.com.br
   (fotos hospedadas no WordPress da própria Hi-Tech)
   ============================================================ */

const CARROS = [
  {
    id: 'porsche-cayenne',
    marca: 'Porsche', modelo: 'Cayenne',
    versao: '4.0 V8 Gasolina S Coupé AWD Tiptronic S',
    ano: 2024, anoModelo: 2024, km: 12000, preco: 834000,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Cinza', portas: 4, potencia: '474 cv', finalPlaca: 4,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Cayenne_24_1.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Cayenne_24_1-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Cayenne_24_1-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Cayenne_24_1.jpeg 1600w",
    resumo: 'Blindado NIII-A, teto solar panorâmico translúcido, garantia de 10 anos contra delaminação, único dono, 474 cv, apenas 12 mil km.',
    opcionais: ['Teto solar panorâmico', 'Bancos em couro', 'Controle de estabilidade', 'Direção elétrica', 'Câmbio automático', 'Faróis de LED', 'Sensor de estacionamento', 'Câmera de ré', 'Comando de áudio no volante', 'Ar-condicionado digital', 'Rodas de liga leve', 'Start/Stop']
  },
  {
    id: 'cayenne-coupe-hibrid',
    marca: 'Porsche', modelo: 'Cayenne Coupé',
    versao: 'S E-Hybrid Coupé AWD Tiptronic S',
    ano: 2024, anoModelo: 2024, km: 7000, preco: 898999,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Híbrido',
    cor: 'Preto', portas: 4, potencia: '519 cv', finalPlaca: 8,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2025/03/PHOTO-2025-04-29-20-10-46.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2025/03/PHOTO-2025-04-29-20-10-46.jpg 640w",
    resumo: 'Cayenne Coupé S E-Hybrid blindado NIII-A. Motorização híbrida plug-in, acabamento esportivo e o mais alto nível de discrição em blindagem.',
    opcionais: ['Motor híbrido plug-in', 'Teto solar panorâmico', 'Bancos esportivos', 'Sport Chrono', 'Faróis Matrix LED', 'Câmera 360°', 'Head-up display', 'Som Bose']
  },
  {
    id: 'mercedes-e300',
    marca: 'Mercedes-Benz', modelo: 'E 300',
    versao: '2.0 MHEV Exclusive 9G-Tronic',
    ano: 2025, anoModelo: 2025, km: 2900, preco: 680000,
    carroceria: 'Sedan', cambio: 'Automático', combustivel: 'Híbrido',
    cor: 'Preto', portas: 4, potencia: '258 cv', finalPlaca: 3,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/M_1.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/M_1-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/M_1-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/M_1.jpeg 1600w",
    resumo: 'E 300 Exclusive praticamente 0 km, blindagem NIII-A integrada de fábrica pela Hi-Tech, tecnologia mild-hybrid e conforto de topo.',
    opcionais: ['Bancos com memória', 'Ambient light 64 cores', 'Teto solar', 'Piloto automático adaptativo', 'Som Burmester', 'Câmera 360°', 'Faróis Digital Light']
  },
  {
    id: 'lexus-nx-350h',
    marca: 'Lexus', modelo: 'NX 350h',
    versao: '2.5 16V VVT-i Hybrid Dynamic CVT AWD',
    ano: 2026, anoModelo: 2026, km: 0, preco: 494900,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Híbrido',
    cor: 'Branco', portas: 4, potencia: '245 cv', finalPlaca: 0,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-06-09-21-27-385.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-06-09-21-27-385.jpg 1600w",
    resumo: 'Lexus NX 350h 0 km com blindagem NIII-A. Híbrido eficiente, acabamento premium e a garantia Lexus somada ao sistema Hi-Tech.',
    opcionais: ['Tração integral AWD', 'Bancos ventilados', 'Teto solar', 'Head-up display', 'Som Mark Levinson', 'Assistente de faixa', 'Câmera 360°']
  },
  {
    id: 'bmw-x1-msport',
    marca: 'BMW', modelo: 'X1',
    versao: 'sDrive20i M Sport 2.0 Turbo ActiveFlex',
    ano: 2024, anoModelo: 2024, km: 21900, preco: 374900,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Preto', portas: 4, potencia: '204 cv', finalPlaca: 1,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2025/09/PHOTO-2025-09-11-19-53-381.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2025/09/PHOTO-2025-09-11-19-53-381.jpg 640w",
    resumo: 'X1 M Sport blindado NIII-A, pacote esportivo completo, baixa quilometragem e visual imponente.',
    opcionais: ['Pacote M Sport', 'Teto solar', 'Bancos esportivos', 'Faróis LED adaptativos', 'Painel digital', 'Câmera de ré', 'Rodas 19"']
  },
  {
    id: 'commander-overland',
    marca: 'Jeep', modelo: 'Commander',
    versao: 'Hurricane Turbo Gasolina Overland AT9',
    ano: 2025, anoModelo: 2025, km: 17000, preco: 290000,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Preto', portas: 4, potencia: '272 cv', finalPlaca: 5,
    blindado: true, nivel: 'NIII-A', destaque: true,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-05-30-11-42-283.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-05-30-11-42-283-768x512.jpg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-05-30-11-42-283-1024x682.jpg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/PHOTO-2026-05-30-11-42-283.jpg 1600w",
    resumo: 'Commander Overland Hurricane blindado NIII-A. SUV de 7 lugares, motor turbo e o topo de linha da Jeep.',
    opcionais: ['7 lugares', 'Teto solar duplo', 'Bancos em couro ventilados', 'Som Harman Kardon', 'Câmera 360°', 'Piloto adaptativo', 'Rodas 20"']
  },
  {
    id: 'honda-hrv-touring',
    marca: 'Honda', modelo: 'HR-V',
    versao: '1.5 Turbo Touring CVT',
    ano: 2026, anoModelo: 2026, km: 0, preco: 286800,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Prata', portas: 4, potencia: '177 cv', finalPlaca: 0,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-04-02-12-05-00.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-04-02-12-05-00-768x512.jpg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-04-02-12-05-00-1024x682.jpg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-04-02-12-05-00.jpg 1600w",
    resumo: 'HR-V Touring 0 km com blindagem NIII-A. O SUV mais desejado da categoria, agora blindado pela Hi-Tech.',
    opcionais: ['Motor turbo', 'Teto solar', 'Sensing (ADAS)', 'Bancos em couro', 'Câmera de ré', 'Faróis LED']
  },
  {
    id: 'range-evoque',
    marca: 'Land Rover', modelo: 'Range Rover Evoque',
    versao: '2.0 P250 SE Dynamic AWD',
    ano: 2023, anoModelo: 2023, km: 32000, preco: 278800,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Branco', portas: 4, potencia: '249 cv', finalPlaca: 2,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Evoque.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Evoque-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Evoque-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Evoque.jpeg 1600w",
    resumo: 'Evoque blindado NIII-A, design icônico britânico, tração integral e acabamento sofisticado.',
    opcionais: ['Tração integral', 'Teto panorâmico', 'Bancos em couro', 'Meridian Sound', 'Câmera 360°', 'Faróis Matrix LED']
  },
  {
    id: 'vw-tcross-highline',
    marca: 'Volkswagen', modelo: 'T-Cross',
    versao: '1.4 250 TSI Highline DSG',
    ano: 2026, anoModelo: 2026, km: 0, preco: 254999,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Cinza', portas: 4, potencia: '150 cv', finalPlaca: 0,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2025/08/PHOTO-2025-10-07-17-59-29.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2025/08/PHOTO-2025-10-07-17-59-29-768x512.jpg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2025/08/PHOTO-2025-10-07-17-59-29-1024x682.jpg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2025/08/PHOTO-2025-10-07-17-59-29.jpg 1600w",
    resumo: 'T-Cross Highline 0 km blindado NIII-A. O SUV compacto mais vendido, pronto para entrega imediata.',
    opcionais: ['Painel digital', 'Bancos em couro', 'Sensor de estacionamento', 'Câmera de ré', 'Faróis LED', 'Start/Stop']
  },
  {
    id: 'corolla-cross-xre',
    marca: 'Toyota', modelo: 'Corolla Cross',
    versao: '2.0 XRE Direct Shift CVT',
    ano: 2025, anoModelo: 2025, km: 4370, preco: 219999,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Prata', portas: 4, potencia: '177 cv', finalPlaca: 7,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Corolla_1.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Corolla_1-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Corolla_1-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/Corolla_1.jpeg 1600w",
    resumo: 'Corolla Cross XRE blindado NIII-A, baixíssima quilometragem. O SUV médio mais confiável do Brasil.',
    opcionais: ['Toyota Safety Sense', 'Teto solar', 'Bancos em couro', 'Câmera de ré', 'Faróis LED', 'Multimídia com Android Auto/CarPlay']
  },
  {
    id: 'bmw-320i',
    marca: 'BMW', modelo: '320i',
    versao: '2.0 GP ActiveFlex Automático',
    ano: 2020, anoModelo: 2020, km: 21000, preco: 234999,
    carroceria: 'Sedan', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Branco', portas: 4, potencia: '184 cv', finalPlaca: 6,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/320.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/320-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/320-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/320.jpeg 1600w",
    resumo: 'BMW 320i blindado NIII-A, o sedã esportivo referência, com baixa quilometragem e revisões em dia.',
    opcionais: ['Teto solar', 'Bancos esportivos', 'Faróis LED', 'Painel digital', 'Câmera de ré', 'Rodas 18"']
  },
  {
    id: 'corolla-grs',
    marca: 'Toyota', modelo: 'Corolla',
    versao: '2.0 GR-S Direct Shift CVT',
    ano: 2023, anoModelo: 2023, km: 34000, preco: 187999,
    carroceria: 'Sedan', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Preto', portas: 4, potencia: '177 cv', finalPlaca: 9,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-02-11-20-10-532.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/05/PHOTO-2026-02-11-20-10-532.jpg 640w",
    resumo: 'Corolla GR-S blindado NIII-A, versão esportiva de topo, com pacote visual exclusivo.',
    opcionais: ['Pacote GR-S', 'Bancos esportivos', 'Toyota Safety Sense', 'Faróis LED', 'Câmera de ré', 'Rodas exclusivas']
  },
  {
    id: 'jeep-compass',
    marca: 'Jeep', modelo: 'Compass',
    versao: '2.0 TD350 Turbo Diesel Longitude AT9',
    ano: 2022, anoModelo: 2022, km: 63000, preco: 177800,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Diesel',
    cor: 'Prata', portas: 4, potencia: '170 cv', finalPlaca: 2,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/JEEP.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/JEEP-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/JEEP-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/JEEP.jpeg 1600w",
    resumo: 'Compass Longitude Diesel 4x4 blindado NIII-A. Robustez, tração integral e economia de rodagem.',
    opcionais: ['Tração 4x4', 'Diesel turbo', 'Bancos em couro', 'Câmera de ré', 'Faróis LED', 'Multimídia 10"']
  },
  {
    id: 'vw-tiguan',
    marca: 'Volkswagen', modelo: 'Tiguan Allspace',
    versao: '2.0 350 TSI R-Line 4Motion DSG',
    ano: 2021, anoModelo: 2021, km: 59800, preco: 169800,
    carroceria: 'SUV', cambio: 'Automático', combustivel: 'Gasolina',
    cor: 'Cinza', portas: 4, potencia: '220 cv', finalPlaca: 1,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-768x576.jpg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-1024x768.jpg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao.jpg 1536w",
    resumo: 'Tiguan Allspace R-Line 4Motion, 7 lugares, blindado NIII-A. Em preparação — reserve já o seu.',
    opcionais: ['7 lugares', 'Tração 4Motion', 'Pacote R-Line', 'Teto panorâmico', 'Painel digital', 'Câmera 360°']
  },
  {
    id: 'fiat-toro',
    marca: 'Fiat', modelo: 'Toro',
    versao: '1.3 Turbo 270 Flex Volcano AT6',
    ano: 2023, anoModelo: 2023, km: 36000, preco: 164999,
    carroceria: 'Picape', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Cinza', portas: 4, potencia: '185 cv', finalPlaca: 6,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-1.jpg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-1-768x576.jpg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-1-1024x768.jpg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/07/Em-preparacao-1.jpg 1536w",
    resumo: 'Fiat Toro Volcano turbo blindada NIII-A. A picape mais desejada, em preparação na Hi-Tech.',
    opcionais: ['Motor turbo', 'Bancos em couro', 'Multimídia 10"', 'Câmera de ré', 'Faróis LED', 'Rodas de liga leve']
  },
  {
    id: 'chevrolet-s10',
    marca: 'Chevrolet', modelo: 'S10',
    versao: '2.5 LTZ 4x2 CD 16V Flex Automático',
    ano: 2018, anoModelo: 2018, km: 77597, preco: 150000,
    carroceria: 'Picape', cambio: 'Automático', combustivel: 'Flex',
    cor: 'Branco', portas: 4, potencia: '206 cv', finalPlaca: 3,
    blindado: true, nivel: 'NIII-A', destaque: false,
    img: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/S10_1.jpeg",
    imgSrcset: "https://www.hitechblindados.com.br/wp-content/uploads/2026/06/S10_1-768x512.jpeg 768w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/S10_1-1024x682.jpeg 1024w, https://www.hitechblindados.com.br/wp-content/uploads/2026/06/S10_1.jpeg 1600w",
    resumo: 'S10 LTZ blindada NIII-A, picape de trabalho e família com estrutura reforçada e ótimo custo-benefício.',
    opcionais: ['Cabine dupla', 'Bancos em couro', 'Multimídia MyLink', 'Câmera de ré', 'Controle de tração', 'Rodas 18"']
  }
];

/* Marcas para o filtro (com contagem calculada em runtime) */
const MARCAS = [...new Set(CARROS.map(c => c.marca))].sort();
const CARROCERIAS = [...new Set(CARROS.map(c => c.carroceria))].sort();
const COMBUSTIVEIS = [...new Set(CARROS.map(c => c.combustivel))].sort();
