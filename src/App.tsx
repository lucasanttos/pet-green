import React, { useState, useEffect, useRef } from 'react';
import { 
  Dog, 
  Cat, 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Instagram, 
  CheckCircle, 
  Upload, 
  Heart, 
  Stethoscope, 
  Scissors, 
  ShoppingBag,
  Code2,
  Minimize2
} from 'lucide-react';

/**
 * ==========================================
 * TIPOS E INTERFACES (TypeScript)
 * ==========================================
 */
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode; // Alterado para aceitar JSX (Listas) além de texto
  delay: number;
}

/**
 * ==========================================
 * COMPONENTES UTILITÁRIOS & UX
 * ==========================================
 */

// Hook e Componente para Animação de Scroll (Fade In + Translate Y)
const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dispara quando 15% do elemento estiver visível
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Anima apenas uma vez
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-16'
      }`}
    >
      {children}
    </div>
  );
};

// Componente de Card de Serviço
const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, delay }) => (
  <ScrollReveal delay={delay}>
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-b-4 border-green-500 hover:border-pink-500 group h-full flex flex-col">
      <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-pink-50 group-hover:text-pink-500 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      {/* Usando div em vez de p para permitir listas aninhadas */}
      <div className="text-gray-600 text-sm leading-relaxed flex-grow">
        {description}
      </div>
    </div>
  </ScrollReveal>
);

/**
 * ==========================================
 * APLICAÇÃO PRINCIPAL (Pet Green)
 * ==========================================
 */
function App() {
  // --- Estados ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estado do Popup do Desenvolvedor
  const [showDevPopup, setShowDevPopup] = useState(false);
  const [isDevPopupMinimized, setIsDevPopupMinimized] = useState(false);

  // Estados do Formulário
  const [formData, setFormData] = useState({
    name: '',
    petName: '',
    service: 'Consulta Veterinária',
    message: ''
  });
  const [hasFile, setHasFile] = useState(false); // Simula upload visual

  // --- Efeitos ---

  // Lógica da Navbar Dinâmica (Zoom Out / Blur)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lógica do Popup do Desenvolvedor (Aparece em 4s, Minimiza em 5s após aparecer)
  useEffect(() => {
    // Aparecer
    const showTimer = setTimeout(() => {
      setShowDevPopup(true);
    }, 4000);

    // Minimizar automaticamente após aparecer
    const minimizeTimer = setTimeout(() => {
      if (showDevPopup) setIsDevPopupMinimized(true);
    }, 9000); // 4000 (delay inicial) + 5000 (leitura)

    return () => {
      clearTimeout(showTimer);
      clearTimeout(minimizeTimer);
    };
  }, [showDevPopup]); // Dependência ajustada para garantir lógica

  // --- Handlers ---

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setHasFile(true);
    }
  };

  // Envio Inteligente para WhatsApp
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Base da mensagem
    let message = `Olá Pet Green! 🐾\n\nMe chamo *${formData.name}* e gostaria de agendar um serviço para meu pet *${formData.petName}*.\n\n🩺 Serviço: ${formData.service}\n💬 Mensagem: ${formData.message}`;

    // Lógica do arquivo (apenas texto informativo, pois WA API web não anexa arquivos direto)
    if (hasFile) {
      message += `\n\n📷 *Tenho uma foto de referência para enviar!* (Vou anexar aqui na conversa)`;
    }

    const phoneNumber = "5584996977221"; // Formato Internacional
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
  };

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-gray-800 bg-gray-50 selection:bg-pink-200 overflow-x-hidden">
      
      {/* ================= HEADER / NAVBAR DINÂMICA ================= */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent ${
          isScrolled 
            ? 'py-2 bg-white/90 backdrop-blur-md shadow-md border-green-100' 
            : 'py-5 bg-white shadow-none'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo com efeito de escala */}
          <div 
            className={`flex items-center gap-2 font-bold text-2xl tracking-tighter transition-transform duration-300 ${
              isScrolled ? 'scale-90 origin-left' : 'scale-100'
            }`}
          >
            <div className="bg-green-500 text-white p-2 rounded-lg">
              <Dog size={24} />
            </div>
            <span className="text-gray-800">Pet<span className="text-green-600">Green</span></span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 font-medium text-gray-600">
            {['Início', 'Serviços', 'Sobre', 'Contato'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className="hover:text-pink-500 transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* Botão Agendar (Desktop) */}
          <button 
            onClick={() => scrollToSection('contato')}
            className={`hidden md:flex items-center gap-2 px-5 py-2 rounded-full font-bold transition-all hover:scale-105 active:scale-95 ${
              isScrolled ? 'bg-pink-500 text-white text-sm' : 'bg-green-500 text-white'
            }`}
          >
            <Phone size={18} />
            Agendar
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-gray-700 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`md:hidden bg-white border-t transition-all duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="flex flex-col p-4 gap-4">
            {['Início', 'Serviços', 'Sobre', 'Contato'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))}
                className="text-left font-medium text-gray-700 hover:text-green-600"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section id="inicio" className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 relative overflow-hidden bg-gradient-to-b from-green-50 to-white">
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-20 right-[-50px] w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 left-[-50px] w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <div className="container mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
          {/* Texto Hero */}
          <div className="flex-1 text-center md:text-left z-10">
            <ScrollReveal>
              <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-700 text-sm font-bold mb-4 tracking-wide">
                CLÍNICA VETERINÁRIA & PET SHOP
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Amor e cuidado que seu pet <span className="text-pink-500">merece!</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Seu melhor amigo em boas mãos. Atendimento especializado, banho e tosa e os melhores produtos em Candelária.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => scrollToSection('contato')}
                  className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CalendarIcon /> Agendar Agora
                </button>
                <button 
                  onClick={() => scrollToSection('servicos')}
                  className="px-8 py-4 bg-white text-green-600 border-2 border-green-100 rounded-xl font-bold text-lg hover:border-green-500 transition-all"
                >
                  Ver Serviços
                </button>
              </div>
            </ScrollReveal>
          </div>

          {/* Imagem Hero (Placeholder Ilustrativo) */}
          <div className="flex-1 w-full max-w-lg relative z-10">
            <ScrollReveal delay={200}>
              <div className="relative">
                {/* Círculo de fundo */}
                <div className="absolute inset-0 bg-green-500 rounded-full opacity-10 transform translate-x-4 translate-y-4"></div>
                <img 
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop" 
                  alt="Cachorro feliz sendo abraçado" 
                  className="rounded-[2.5rem] shadow-2xl w-full h-auto object-cover aspect-[4/3] transform hover:-translate-y-2 transition-transform duration-500"
                />
                
                {/* Card Flutuante */}
                <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-8 bg-white p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="bg-pink-100 p-2 rounded-full text-pink-500">
                    <Heart fill="currentColor" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Avaliação</p>
                    <p className="font-bold text-gray-800">5.0 Estrelas</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================= SERVIÇOS ================= */}
      <section id="servicos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Nossos Serviços</h2>
              <div className="w-20 h-1.5 bg-pink-500 mx-auto rounded-full mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Oferecemos uma estrutura completa para a saúde e bem-estar do seu animalzinho.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon={<Stethoscope size={28} />}
              title="Clínica Veterinária"
              description={
                <div className="space-y-3">
                  <div className="bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                    <p className="text-red-600 font-bold text-[10px] uppercase tracking-wide">
                      Apenas com hora marcada
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {[
                      "Consulta",
                      "Exames laboratoriais",
                      "Ultrassonografia",
                      "Raio-x",
                      "Cirurgia",
                      "Imunização (Vacina Imp.)"
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-left text-sm">
                        <span className="text-green-500 font-bold leading-none">↘</span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              }
              delay={0}
            />
            <ServiceCard 
              icon={<Scissors size={28} />}
              title="Banho e Tosa"
              description="Estética animal com produtos hipoalergênicos e muito carinho para deixar seu pet lindo e cheiroso."
              delay={100}
            />
            <ServiceCard 
              icon={<ShoppingBag size={28} />}
              title="Pet Shop"
              description="Rações premium, brinquedos, acessórios, petiscos e medicamentos veterinários."
              delay={200}
            />
            <ServiceCard 
              icon={<Cat size={28} />}
              title="Day Care"
              description="Um espaço seguro e divertido para seu pet passar o dia gastando energia e socializando."
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ================= LOCALIZAÇÃO & SOBRE ================= */}
      <section id="sobre" className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-xl">
            {/* Mapa / Imagem */}
            <div className="md:w-1/2 relative bg-gray-200 min-h-[300px]">
              {/* Overlay com endereço */}
              <div className="absolute inset-0 flex items-center justify-center">
                 <img 
                    src="/local.jpeg" 
                    alt="Interior da clínica" 
                    className="w-full h-full object-cover opacity-80"
                  />
                 <div className="absolute bg-white/90 backdrop-blur p-6 rounded-xl shadow-lg max-w-xs text-center m-4">
                    <MapPin className="mx-auto text-pink-500 mb-2" size={32} />
                    <h3 className="font-bold text-gray-800 mb-1">Rua Jaguarari n°2800</h3>
                    <p className="text-gray-600 text-sm">Candelária, Natal - RN</p>
                    <span className="block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      Em frente a ABO
                    </span>
                 </div>
              </div>
            </div>

            {/* Conteúdo */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Sobre a Pet Green</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Localizada no coração de Candelária, a Pet Green nasceu do sonho de oferecer um atendimento veterinário humanizado e de excelência. Nossa equipe é treinada para tratar seu pet como parte da família.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-green-500" size={20} /> Ambientes climatizados
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-green-500" size={20} /> Equipamentos modernos
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="text-green-500" size={20} /> Estacionamento fácil
                  </li>
                </ul>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com/petgreennatal" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-pink-500 font-bold hover:underline"
                  >
                    <Instagram size={20} /> @petgreennatal
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTATO / AGENDAMENTO ================= */}
      <section id="contato" className="py-20 relative">
        <div className="container mx-auto px-4 max-w-3xl">
          <ScrollReveal>
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-10">
                <span className="text-green-600 font-bold uppercase tracking-wider text-sm">Agendamento Fácil</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">Agende pelo WhatsApp</h2>
                <p className="text-gray-500 mt-2">Preencha os dados e nós montaremos a mensagem para você.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Seu Nome</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      placeholder="João da Silva"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nome do Pet</label>
                    <input 
                      type="text" 
                      name="petName"
                      required
                      placeholder="Rex / Mel"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Serviço Desejado</label>
                  <select 
                    name="service"
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
                    onChange={handleInputChange}
                  >
                    <option>Consulta Veterinária</option>
                    <option>Banho e Tosa</option>
                    <option>Vacinação</option>
                    <option>Compra de Produtos</option>
                    <option>Outros</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mensagem ou Observação</label>
                  <textarea 
                    name="message"
                    rows={3}
                    placeholder="Gostaria de agendar para terça-feira..."
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all resize-none"
                    onChange={handleInputChange}
                  ></textarea>
                </div>

                {/* Input de Arquivo Customizado */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Foto de Referência (Opcional)</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors text-center cursor-pointer group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-green-600">
                      {hasFile ? (
                        <>
                          <CheckCircle className="text-green-500" size={32} />
                          <span className="font-medium text-green-600">Arquivo selecionado!</span>
                          <span className="text-xs">Clique para trocar</span>
                        </>
                      ) : (
                        <>
                          <Upload size={32} />
                          <span className="font-medium">Clique para enviar uma foto</span>
                          <span className="text-xs text-gray-400">JPG, PNG (Avisaremos no WhatsApp)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/30 hover:bg-green-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WA" className="w-6 h-6 filter brightness-0 invert" />
                  Enviar via WhatsApp
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Dog className="text-green-500" size={24} />
              <span className="text-xl font-bold">Pet<span className="text-green-500">Green</span></span>
            </div>
            <p className="text-gray-400 text-sm text-center md:text-right">
              &copy; {new Date().getFullYear()} Pet Green. Todos os direitos reservados.<br/>
              Rua Jaguarari n°2800, Candelária - Natal/RN
            </p>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
             <p className="text-xs text-gray-500 flex flex-col md:flex-row items-center justify-center gap-2">
               <span>Desenvolvido por</span>
               <a href="https://uicode-dev.netlify.app/" target="_blank" className="text-green-400 hover:text-white transition-colors font-bold flex items-center gap-1">
                 <Code2 size={14} /> UiCode.dev
               </a>
             </p>
          </div>
        </div>
      </footer>

      {/* ================= POPUP DO DESENVOLVEDOR (UiCode.dev) ================= */}
      {showDevPopup && (
        <div 
          className={`fixed bottom-4 right-4 z-[60] bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-500 ease-in-out ${
            isDevPopupMinimized ? 'w-14 h-14 rounded-full overflow-hidden p-0 cursor-pointer hover:scale-110' : 'w-80 p-5'
          }`}
        >
          {isDevPopupMinimized ? (
            // Estado Minimizado (Ícone)
            <button 
              onClick={() => setIsDevPopupMinimized(false)}
              className="w-full h-full flex items-center justify-center bg-gray-900 text-white"
              title="Maximizar Créditos"
            >
              <Code2 size={24} />
            </button>
          ) : (
            // Estado Maximizado (Card)
            <div className="relative animate-fadeIn">
              <button 
                onClick={() => setIsDevPopupMinimized(true)}
                className="absolute -top-1 -right-1 text-gray-400 hover:text-gray-600"
              >
                <Minimize2 size={16} />
              </button>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white p-2 rounded-lg">
                   <Code2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-800">UiCode.dev</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Desenvolvimento Web</p>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                Gostou deste site? Crie uma presença digital profissional para o seu negócio hoje mesmo.
              </p>
              
              <div className="flex gap-2">
                <a 
                  href="https://instagram.com/uicode.dev" 
                  target="_blank"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold py-2 px-3 rounded-md text-center hover:opacity-90 transition-opacity"
                >
                  Instagram
                </a>
                <a 
                  href="https://wa.me/5511916474626" 
                  target="_blank"
                  className="flex-1 bg-green-500 text-white text-xs font-bold py-2 px-3 rounded-md text-center hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

// Icone auxiliar
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

export default App;