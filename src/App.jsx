import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTOS = [
  {
    id: 1,
    nombre: "Anillo Espiral Ojo de Tigre",
    categoria: "Alambrismo",
    mineral: "Ojo de Tigre & Alambre Dorado",
    imagen: "/anillo-1.jpg",
    colorGema: "from-amber-700 via-amber-500 to-amber-900",
    glowColor: "rgba(217, 119, 6, 0.4)",
    descripcion: "Anillo ajustable tejido en espiral continua con gema central de ojo de tigre pulido.",
    cuidados: "Limpiar con paño seco. Evitar humedad para mantener el brillo del alambre.",
    tiempoElaboracion: "2 horas artesanales"
  },
  {
    id: 2,
    nombre: "Anillo Triple Amatista",
    categoria: "Alambrismo",
    mineral: "Cuentas Moradas & Alambre Dorado",
    imagen: "/anillo-2.jpg",
    colorGema: "from-purple-500 via-fuchsia-400 to-purple-800",
    glowColor: "rgba(168, 85, 247, 0.4)",
    descripcion: "Diseño elegante con espirales asimétricas y tres cuentas centrales incrustadas.",
    cuidados: "Ajustar suavemente a la medida del dedo.",
    tiempoElaboracion: "3 horas artesanales"
  },
  {
    id: 3,
    nombre: "Anillo Gema Esmeralda",
    categoria: "Alambrismo",
    mineral: "Gema Verde & Alambre Dorado",
    imagen: "/anillo-3.jpg",
    colorGema: "from-emerald-500 via-green-400 to-teal-800",
    glowColor: "rgba(16, 185, 129, 0.4)",
    descripcion: "Fino trabajo de alambrismo enmarcando una cuenta verde central.",
    cuidados: "Evitar el contacto con perfumes y químicos.",
    tiempoElaboracion: "2.5 horas artesanales"
  },
  {
    id: 4,
    nombre: "Anillo Nido Rubí",
    categoria: "Alambrismo",
    mineral: "Cristales Rojos & Alambre Dorado",
    imagen: "/anillo-4.jpg",
    colorGema: "from-rose-500 via-red-400 to-rose-900",
    glowColor: "rgba(225, 29, 72, 0.4)",
    descripcion: "Técnica de nido entrelazado con racimo de cristales facetados color rubí/fucsia.",
    cuidados: "Limpiar con paño suave para no rayar los cristales.",
    tiempoElaboracion: "4 horas de tejido"
  },
  {
    id: 5,
    nombre: "Dúo Pulseras Ágata y Dorado",
    categoria: "Piedras Naturales",
    mineral: "Ágata Rayada, Ónice & Cuentas Doradas",
    imagen: "/pulsera-1.jpg",
    colorGema: "from-slate-700 via-stone-500 to-neutral-900",
    glowColor: "rgba(87, 83, 78, 0.4)",
    descripcion: "Conjunto de dos pulseras, una de cuentas doradas continuas y otra con centro de ágata rayada.",
    cuidados: "Apto para uso diario, evitar tirones fuertes.",
    tiempoElaboracion: "2 horas de ensamblado"
  }
];

// Configuraciones de Animación
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [carrito, setCarrito] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tarjetasVolteadas, setTarjetasVolteadas] = useState({});
  
  // Control del visor 3D
  const [joya3DActual, setJoya3DActual] = useState(PRODUCTOS[0]);
  const [rotacionY, setRotacionY] = useState(25);
  const [rotacionX, setRotacionX] = useState(10);
  const [estaArrastrando, setEstaArrastrando] = useState(false);
  const [posicionInicial, setPosicionInicial] = useState({ x: 0, y: 0 });
  const [giroAutomatico, setGiroAutomatico] = useState(true);

  useEffect(() => {
    const prodActualizado = PRODUCTOS.find(p => p.id === joya3DActual.id);
    if (prodActualizado) setJoya3DActual(prodActualizado);
  }, []);

  useEffect(() => {
    if (!giroAutomatico) return;
    const interval = setInterval(() => {
      setRotacionY(prev => (prev + 0.9) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [giroAutomatico]);

  const handleMouseDown = (e) => {
    setGiroAutomatico(false);
    setEstaArrastrando(true);
    setPosicionInicial({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!estaArrastrando) return;
    const deltaX = e.clientX - posicionInicial.x;
    const deltaY = e.clientY - posicionInicial.y;
    setRotacionY(prev => prev + deltaX * 0.7);
    setRotacionX(prev => Math.max(-45, Math.min(45, prev - deltaY * 0.4)));
    setPosicionInicial({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setEstaArrastrando(false);

  const toggleFlip = (id) => {
    setTarjetasVolteadas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const agregarAlCarrito = (prod) => {
    setCarrito(prev => {
      const item = prev.find(p => p.id === prod.id);
      if (item) {
        return prev.map(p => p.id === prod.id ? { ...p, cantidad: p.cantidad + 1 } : p);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const enviarWhatsApp = () => {
    const texto = encodeURIComponent(
      `¡Hola Joyas De Filippi! ✨ Vi su web y me gustaría cotizar las siguientes joyas:\n\n` +
      carrito.map(item => `• ${item.nombre} (Cantidad: ${item.cantidad})`).join('\n') +
      `\n\n¿Me podrían dar los valores y disponibilidad para coordinar la entrega?`
    );
    window.open(`https://wa.me/56900000000?text=${texto}`, '_blank');
  };

  const filtrados = categoriaActiva === "Todos" 
    ? PRODUCTOS 
    : PRODUCTOS.filter(p => p.categoria === categoriaActiva);

  return (
    <div className="min-h-screen text-[#422650]">
      {/* Navegación */}
      <header className="sticky top-0 z-40 bg-[#F9F6FC]/90 backdrop-blur-md border-b border-[#EAE2F0]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full border-2 border-[#D4A373] flex items-center justify-center bg-white shadow-sm overflow-hidden shrink-0">
              <img 
                src="/logo.jpg" 
                alt="Logo Joyas De Filippi" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <span className="hidden text-lg text-[#8B5A96]">✦</span>
            </div>
            <div>
              <h1 className="font-serif-vintage text-2xl sm:text-3xl font-bold tracking-tight text-[#533263] leading-none">
                Joyas De Filippi
              </h1>
              <span className="text-[10px] tracking-[0.22em] text-[#B37F5A] uppercase block mt-0.5 font-medium">
                Joyas Artesanales
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-6 text-xs uppercase tracking-widest text-[#796B80]">
              <a href="#experiencia" className="hover:text-[#8B5A96] transition">Destacado</a>
              <a href="#obras" className="hover:text-[#8B5A96] transition">Catálogo</a>
              <a href="#tecnicas" className="hover:text-[#8B5A96] transition">Técnicas</a>
            </nav>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setModalAbierto(true)}
              className="relative px-4 py-2 rounded-full bg-[#EAE1F0] text-[#533263] text-xs font-semibold uppercase tracking-wider hover:bg-[#DCD0E8] transition flex items-center gap-2 border border-[#DCD0E8]"
            >
              <span>Cotizar</span>
              <AnimatePresence>
                {carrito.length > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="bg-[#8B5A96] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                  >
                    {carrito.reduce((a, c) => a + c.cantidad, 0)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </header>

      {/* PORTADA PRINCIPAL (HERO) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Fondo sutil */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2EAFA] to-[#F9F6FC] -z-20" />
        
        {/* Elemento de fondo borroso decorativo */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center -z-10"
        >
          <img src="/logo.jpg" alt="" className="w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] object-cover rounded-full blur-3xl opacity-60" />
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 text-center space-y-8 z-10 relative mt-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-[11px] tracking-[0.3em] uppercase text-[#B37F5A] font-bold block"
          >
            Orfebrería Exclusiva
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            className="font-serif-vintage text-6xl sm:text-7xl md:text-8xl text-[#422650] leading-[1.1]"
          >
            Joyas hechas<br/>con el <span className="italic text-[#8B5A96]">alma</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-sm md:text-base text-[#796B80] max-w-2xl mx-auto leading-relaxed"
          >
            Cada pieza es única, tejida a mano y diseñada para conectar con tu energía. Descubre nuestra colección de alambrismo, piedras naturales y cristales.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="pt-6"
          >
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#obras"
              className="inline-block px-10 py-4 rounded-full bg-[#533263] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#422650] transition shadow-xl"
            >
              Explorar Colección
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* SECCIÓN INTERACTIVA 3D */}
      <motion.section 
        id="experiencia" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="relative py-24 overflow-hidden bg-[#F9F6FC]"
      >
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EDE3F5] text-[#533263] text-xs uppercase tracking-wider font-semibold border border-[#DCD0E8]">
              ✦ El Arte del Alambrismo
            </span>
            <h2 className="font-serif-vintage text-4xl sm:text-5xl lg:text-6xl text-[#422650] leading-[1.1]">
              Simulación de nuestro <span className="italic text-[#B37F5A]">taller</span>.
            </h2>
            <p className="text-xs sm:text-sm text-[#796B80] leading-relaxed max-w-lg mx-auto lg:mx-0">
              Entiende la complejidad de nuestras creaciones. Arrastra la joya holográfica para rotarla y selecciona la piedra que deseas ver.
            </p>

            <div className="pt-2">
              <p className="text-[11px] uppercase tracking-widest text-[#796B80] mb-2 font-semibold">
                Selecciona para simular:
              </p>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {PRODUCTOS.slice(0, 3).map(p => (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={p.id}
                    onClick={() => setJoya3DActual(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs transition border ${
                      joya3DActual.id === p.id 
                        ? 'bg-[#533263] text-white border-[#533263] shadow' 
                        : 'bg-white text-[#533263] border-[#EAE2F0] hover:border-[#D4A373]'
                    }`}
                  >
                    {p.nombre}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* ESCENARIO DE GIRO 3D */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
              
              {/* Aura giratoria exterior */}
              <div 
                className="absolute inset-0 rounded-full border border-dashed border-[#D4A373] animate-spin" 
                style={{ animationDuration: '45s' }}
              />
              <div 
                className="absolute inset-4 rounded-full border border-[#DCD0E8] opacity-80 animate-spin" 
                style={{ animationDuration: '30s', animationDirection: 'reverse' }}
              />

              {/* Resplandor de la piedra */}
              <div 
                className="absolute w-52 h-52 rounded-full blur-2xl transition-all duration-700 opacity-60"
                style={{ backgroundColor: joya3DActual.glowColor || 'rgba(168, 85, 247, 0.4)' }}
              />

              {/* Lienzo 3D con Drag interactivo */}
              <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative w-64 h-64 cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
                style={{ perspective: 1000 }}
              >
                <div 
                  className="relative w-full h-full flex items-center justify-center preserve-3d"
                  style={{
                    transform: `rotateX(${rotacionX}deg) rotateY(${rotacionY}deg)`
                  }}
                >
                  {/* Filigrana floral en Z = 15px */}
                  <div 
                    className="absolute w-56 h-56 rounded-full border-2 border-[#D4A373] opacity-80 flex items-center justify-center"
                    style={{ transform: 'translateZ(15px)' }}
                  >
                    {[0, 60, 120, 180, 240, 300].map(deg => (
                      <span 
                        key={deg}
                        className="absolute text-xs" 
                        style={{ transform: `rotate(${deg}deg) translateY(-105px)` }}
                      >
                        🌿
                      </span>
                    ))}
                  </div>

                  {/* Aros de alambre tejidos en planos Z */}
                  <div 
                    className="absolute w-44 h-44 rounded-full border-[3px] border-[#C48A63]"
                    style={{ transform: 'translateZ(30px) rotate(45deg)' }}
                  />
                  <div 
                    className="absolute w-40 h-40 rounded-full border-2 border-dashed border-[#B37F5A]/60"
                    style={{ transform: 'translateZ(-20px) rotate(-30deg)' }}
                  />

                  {/* Gema 3D facetada interactiva */}
                  <div 
                    className={`relative w-28 h-36 bg-gradient-to-tr ${joya3DActual.colorGema} rounded-[45%_45%_55%_55%] shadow-2xl flex items-center justify-center overflow-hidden border border-white/60 transition-colors duration-1000`}
                    style={{ transform: 'translateZ(50px)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/30 pointer-events-none" />
                    <div className="w-1.5 h-24 bg-white/70 blur-[1px] rotate-12 transform -translate-x-2" />
                    <span className="text-white text-xl animate-pulse">✦</span>
                  </div>

                  {/* Corona inferior de alambre */}
                  <div 
                    className="absolute -bottom-2 text-[#C48A63] font-serif text-lg tracking-widest"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    ⚜ ❦ ⚜
                  </div>
                </div>
              </div>

              {/* Control flotante */}
              <div className="absolute -bottom-3 flex items-center gap-2 bg-white/95 px-4 py-1.5 rounded-full border border-[#EAE2F0] shadow-sm text-[11px] text-[#796B80]">
                <button 
                  onClick={() => setGiroAutomatico(!giroAutomatico)}
                  className="font-medium hover:text-[#8B5A96]"
                >
                  {giroAutomatico ? '⏸ Pausar' : '▶ Activar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* TÉCNICAS */}
      <motion.section 
        id="tecnicas" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="py-16 bg-white border-y border-[#EAE2F0]"
      >
        <div className="max-w-6xl mx-auto px-6">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B37F5A] font-bold">Oficio y Amor</span>
            <h3 className="font-serif-vintage text-3xl text-[#422650]">Técnicas y Materiales</h3>
            <div className="w-12 h-0.5 bg-[#D4A373] mx-auto mt-2" />
          </motion.div>

          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[
              { t: "Macramé", d: "Microhilo encerado brasilero", i: "🧶" },
              { t: "Alambrismo", d: "Filigrana en cobre y baño de oro", i: "🌀" },
              { t: "Piedras Naturales", d: "Minerales puros seleccionados", i: "💎" },
              { t: "Cristales", d: "Reflejo de luz y energía", i: "✨" },
              { t: "Acero", d: "Hipoalergénico y duradero", i: "🛡️" },
            ].map((item, i) => (
              <motion.div 
                key={i} 
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="p-5 rounded-xl bg-[#F6F4FA] border border-[#EAE2F0] hover:border-[#D4A373] transition hover:shadow-md cursor-default"
              >
                <div className="text-3xl mb-2">{item.i}</div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#422650]">{item.t}</h4>
                <p className="text-[11px] text-[#796B80] mt-1">{item.d}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CATÁLOGO */}
      <motion.section 
        id="obras" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="py-20 max-w-6xl mx-auto px-6"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B37F5A] font-bold">Colección de Autor</span>
            <h3 className="font-serif-vintage text-3xl sm:text-5xl text-[#422650]">Catálogo Oficial</h3>
            <p className="text-xs text-[#796B80] mt-1">
              Haz clic en el botón <strong>↻ Detalles</strong> para voltear la ficha técnica.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["Todos", "Alambrismo", "Macramé", "Piedras Naturales", "Cristales", "Acero"].map(cat => (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-4 py-2 rounded-full text-xs transition uppercase tracking-wider font-semibold ${
                  categoriaActiva === cat 
                    ? 'bg-[#533263] text-white shadow-md' 
                    : 'bg-[#EAE1F0] text-[#533263] hover:bg-[#DCD0E8]'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grid de Tarjetas 3D */}
        <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filtrados.map(prod => {
              const volteada = tarjetasVolteadas[prod.id];

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={prod.id} 
                  className="w-full h-[460px]" 
                  style={{ perspective: 1200 }}
                >
                  <div 
                    className="relative w-full h-full transition-transform duration-700 preserve-3d"
                    style={{ transform: volteada ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                  >
                    {/* FRENTE */}
                    <div className="absolute inset-0 bg-white rounded-2xl p-5 border border-[#EAE2F0] shadow-md flex flex-col justify-between backface-hidden">
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-[#B37F5A] bg-[#F6F4FA] px-3 py-1 rounded-full">
                            {prod.categoria}
                          </span>
                          <button 
                            onClick={() => toggleFlip(prod.id)}
                            className="px-3 py-1.5 rounded-full bg-[#EAE1F0] text-[#533263] text-xs hover:bg-[#DCD0E8] transition flex items-center gap-1 font-bold"
                          >
                            <span>↻ Info</span>
                          </button>
                        </div>

                        {/* CONTENEDOR FOTOGRAFÍA */}
                        <div className="h-52 relative flex items-center justify-center overflow-hidden rounded-xl bg-[#F9F6FC] mb-5 shadow-inner border border-[#EAE1F0]">
                          <img 
                            src={prod.imagen} 
                            alt={prod.nombre}
                            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700 ease-out"
                            onError={(e) => {
                              e.target.src = 'https://placehold.co/600x400/EAE1F0/533263?text=Sin\\nFoto';
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-serif-vintage text-2xl font-bold text-[#422650] leading-tight mb-1">{prod.nombre}</h4>
                        <p className="text-xs text-[#796B80] line-clamp-1">{prod.mineral}</p>

                        <div className="mt-4 pt-4 border-t border-[#F6F4FA] flex items-center justify-end">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => agregarAlCarrito(prod)}
                            className="px-6 py-2.5 rounded-full bg-[#533263] text-white text-xs uppercase tracking-wider font-bold hover:bg-[#422650] transition shadow-md"
                          >
                            + Cotizar
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* REVERSO (AL GIRAR 180 GRADOS) */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-[#422650] to-[#2C1C33] text-[#FAF4FC] rounded-2xl p-6 border border-[#533263] shadow-2xl flex flex-col justify-between backface-hidden"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      <div>
                        <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4">
                          <span className="text-[10px] tracking-widest uppercase text-[#D4A373] font-bold">
                            ✦ Ficha Técnica
                          </span>
                          <button 
                            onClick={() => toggleFlip(prod.id)}
                            className="text-white/80 hover:text-white text-xs font-bold bg-white/5 px-2 py-1 rounded"
                          >
                            ✕ Volver
                          </button>
                        </div>

                        <h4 className="font-serif-vintage text-xl font-bold text-white mb-4">{prod.nombre}</h4>
                        
                        <div className="space-y-4 text-xs text-[#EAE2F0]">
                          <div>
                            <span className="text-[#D4A373] text-[10px] uppercase tracking-wider block font-bold mb-1">Significado & Trabajo</span>
                            <p className="text-[11px] leading-relaxed opacity-90">{prod.descripcion}</p>
                          </div>
                          <div>
                            <span className="text-[#D4A373] text-[10px] uppercase tracking-wider block font-bold mb-1">Cuidados</span>
                            <p className="text-[11px] opacity-90">{prod.cuidados}</p>
                          </div>
                          <div>
                            <span className="text-[#D4A373] text-[10px] uppercase tracking-wider block font-bold mb-1">Taller</span>
                            <p className="text-[11px] opacity-90">{prod.tiempoElaboracion}</p>
                          </div>
                        </div>
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          agregarAlCarrito(prod);
                          toggleFlip(prod.id);
                        }}
                        className="w-full py-3.5 rounded-full bg-[#D4A373] text-[#2C1C33] font-extrabold text-xs uppercase tracking-widest hover:bg-[#C48A63] transition shadow-lg"
                      >
                        Añadir a mi cotización
                      </motion.button>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* FOOTER */}
      <footer className="bg-[#2C1C33] text-[#EAE2F0] py-16 border-t border-[#422650]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-2 border-[#D4A373] flex items-center justify-center bg-white shadow-xl overflow-hidden mb-2">
            <img 
              src="/logo.jpg" 
              alt="Logo Joyas De Filippi" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h4 className="font-serif-vintage text-3xl font-bold text-white">Joyas De Filippi</h4>
          <p className="text-xs text-[#DCD0E8] max-w-md mx-auto leading-relaxed">
            Macramé • Alambrismo • Piedras Naturales • Cristales • Acero.<br/>Hecho a mano con amor en Chile.
          </p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={enviarWhatsApp}
            className="px-8 py-3.5 mt-4 rounded-full bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#1EBE5D] transition shadow-lg"
          >
            Cotizar por WhatsApp
          </motion.button>
          <p className="text-[10px] text-[#796B80] pt-8">© {new Date().getFullYear()} Joyas De Filippi. Todos los derechos reservados.</p>
        </div>
      </footer>

      {/* MODAL / DRAWER DE LA BOLSA (COTIZACIÓN) */}
      <AnimatePresence>
        {modalAbierto && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalAbierto(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#F9F6FC] h-full p-6 flex flex-col justify-between border-l border-[#EAE2F0] shadow-2xl z-10"
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#EAE2F0]">
                  <h3 className="font-serif-vintage text-2xl font-bold text-[#422650]">Tu Cotización</h3>
                  <button onClick={() => setModalAbierto(false)} className="text-lg font-bold text-[#796B80] hover:text-[#422650] transition">✕</button>
                </div>

                {carrito.length === 0 ? (
                  <div className="py-20 text-center text-xs text-[#796B80]">
                    <p className="text-5xl mb-4 opacity-50">🧺</p>
                    <p>Aún no has agregado ninguna joya para cotizar.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#EAE2F0] max-h-[60vh] overflow-y-auto mt-4 pr-2">
                    {carrito.map(item => (
                      <div key={item.id} className="py-4 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-[#422650] text-sm">{item.nombre}</p>
                          <span className="text-[10px] text-[#796B80] block mt-0.5">Categoría: {item.categoria}</span>
                        </div>
                        <span className="font-bold text-[#533263] bg-[#EAE1F0] px-3 py-1.5 rounded-md">x{item.cantidad}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {carrito.length > 0 && (
                <div className="pt-6 border-t border-[#EAE2F0] space-y-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={enviarWhatsApp}
                    className="w-full py-4 rounded-full bg-[#25D366] text-white font-extrabold text-xs uppercase tracking-widest shadow-lg"
                  >
                    Enviar a WhatsApp
                  </motion.button>
                  <p className="text-[10px] text-center text-[#796B80] leading-relaxed px-4">
                    Se abrirá WhatsApp con el listado de tus joyas para que podamos darte los valores exactos.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
