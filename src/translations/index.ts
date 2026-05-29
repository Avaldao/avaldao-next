export interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export type Language = 'es' | 'en';


export const translations: Translations = {
  'nav.home': {
    es: 'Inicio',
    en: 'Home'
  },
  "nav.users": {
    es: 'Usuarios',
    en: 'Users'
  },
  "nav.avales": {
    es: 'Avales',
    en: 'Avals'
  },
  "nav.about": {
    es: 'Qué es',
    en: 'About'
  },
  "nav.dashboard": {
    es: 'Dashboard',
    en: 'Dashboard'
  },
  "nav.invest": {
    es: 'Invertir',
    en: 'Invest'
  },
  "nav.request-aval": {
    es: 'Solicitar Aval',
    en: 'Request Aval'
  },

  "slide1.title": {
    es: 'Confiamos en vos',
    en: 'We trust you'
  },
  "slide1.description": {
    es: 'En dos clicks tenés la garantía que necesitás para tu crédito.',
    en: 'In two clicks you have the guarantee you need for your credit.'
  },
  "slide1.btn": {
    es: 'Comenzar',
    en: 'Start'
  },
  "slide2.title": {
    es: 'Garantías rápidas y seguras',
    en: 'Fast and secure guarantees'
  },
  "slide2.description": {
    es: 'AvalDAO utiliza la revolucionaria tecnología de blockchain para otorgar garantías crediticias de forma ágil, seguras y transparentes.',
    en: 'AvalDAO uses revolutionary blockchain technology to provide credit guarantees quickly, securely, and transparently.'
  },
  "slide2.btn": {
    es: 'Conocer más',
    en: 'Learn more'
  },
  "slide3.title": {
    es: 'Sumate a la comunidad AvalDAO',
    en: 'Join the AvalDAO community'
  },
  "slide3.description": {
    es: 'Únete a un nuevo tipo de empresa, más abierta y transparente, donde el control lo tienen quienes la usan y contribuyen.',
    en: 'Join a new type of company, more open and transparent, where control is in the hands of those who use and contribute.'
  },
  "slide3.btn": {
    es: 'Sumate',
    en: 'Join'
  },
  "about.avaldao.title": {
    es: '¿Qué es AvalDAO?',
    en: 'What is AvalDAO?'
  },
  "about.avaldao.eyebrow": {
    es: 'Sobre AvalDAO',
    en: 'About AvalDAO'
  },
  "about.avaldao.description": {
    es: 'AvalDAO es la primera Sociedad de Garantía Recíproca (SGR) descentralizada. Una solución WEB3 que otorga garantías a los individuos y microempresas no bancarizadas o sin historial crediticio, para que puedan acceder a créditos comerciales convenientes.',
    en: 'AvalDAO is the first decentralized Reciprocal Guarantee Society (SGR). A WEB3 solution that provides guarantees to unbanked individuals and microenterprises or those without credit history, so they can access convenient commercial credits.'
  },
  "about.avaldao.know-more": {
    es: 'Conocer Más',
    en: 'Learn More'
  },
  "features.security.title": {
    es: 'Seguridad',
    en: 'Security'
  },
  "features.security.description": {
    es: 'Las personas y empresas avaladas cuentan con una reputación inmutable, creada por terceras partes de confianza',
    en: 'Endorsed people and companies have an immutable reputation, created by trusted third parties'
  },
  "features.autonomy.title": {
    es: 'Autonomía',
    en: 'Autonomy'
  },
  "features.autonomy.description": {
    es: 'Las garantías son contratos autónomos que se ejecutarán sin intermediación a favor de quien otorgó el crédito',
    en: 'Guarantees are autonomous contracts that will execute without intermediation in favor of the credit grantor'
  },
  "features.transparency.title": {
    es: 'Transparencia',
    en: 'Transparency'
  },
  "features.transparency.description": {
    es: 'Toda la economía de la organización está a la vista, con información y estadísticas publicadas en tiempo real',
    en: 'The entire economy of the organization is in plain sight, with information and statistics published in real time'
  },
  "services.investor.title": {
    es: 'Quiero invertir',
    en: 'I want to invest'
  },
  "services.investor.description": {
    es: '¿Quieres que tus inversiones operen rentabilidad al mismo tiempo que ayudas a otras personas a cumplir sus sueños?',
    en: 'Do you want your investments to operate profitability while helping other people fulfill their dreams?'
  },
  "services.applicant.title": {
    es: 'Quiero un aval',
    en: 'I want a guarantee'
  },
  "services.applicant.description": {
    es: '¿Tienes un comercio y quieres ampliar tus clientes? ¿Tienes un emprendimiento y necesitas una aval para obtener un crédito comercial?',
    en: 'Do you have a business and want to expand your customers? Do you have a venture and need a guarantee to get a commercial credit?'
  },
  "how.eyebrow": {
    es: 'Como funciona',
    en: 'How it works'
  },
  "how.title": {
    es: 'De la solicitud al respaldo automatico del fondo',
    en: 'From the request to the fund\'s automatic backing'
  },
  "how.description": {
    es: 'AvalDAO conecta a solicitantes, beneficiarios y comercios con un proceso claro para aprobar garantias y cubrir incumplimientos sin friccion.',
    en: 'AvalDAO connects applicants, beneficiaries, and merchants through a clear process to approve guarantees and cover missed payments without friction.'
  },
  "how.step1.role": {
    es: 'Solicitante',
    en: 'Applicant'
  },
  "how.step1.title": {
    es: 'Presenta al beneficiario y solicita la garantia',
    en: 'Presents the beneficiary and requests the guarantee'
  },
  "how.step1.description": {
    es: 'El solicitante carga la informacion del beneficiario, explica el destino del credito y activa la evaluacion inicial.',
    en: 'The applicant submits the beneficiary\'s information, explains the credit purpose, and starts the initial review.'
  },
  "how.step2.role": {
    es: 'AvalDAO',
    en: 'AvalDAO'
  },
  "how.step2.title": {
    es: 'Evalua y aprueba o rechaza la garantia',
    en: 'Evaluates and approves or rejects the guarantee'
  },
  "how.step2.description": {
    es: 'AvalDAO revisa identidad, reputacion y condiciones de riesgo para decidir si el fondo puede respaldar la operacion.',
    en: 'AvalDAO reviews identity, reputation, and risk conditions to decide whether the fund can back the operation.'
  },
  "how.step3.role": {
    es: 'Comerciante',
    en: 'Merchant'
  },
  "how.step3.title": {
    es: 'Acepta la garantia y otorga el credito en cuotas',
    en: 'Accepts the guarantee and grants installment credit'
  },
  "how.step3.description": {
    es: 'Con la garantia aprobada, el comerciante confirma la venta y habilita el financiamiento con condiciones acordadas.',
    en: 'With the guarantee approved, the merchant confirms the sale and enables financing under the agreed terms.'
  },
  "how.step4.role": {
    es: 'Beneficiario',
    en: 'Beneficiary'
  },
  "how.step4.title": {
    es: 'Accede al bien o servicio y paga las cuotas',
    en: 'Accesses the good or service and pays the installments'
  },
  "how.step4.description": {
    es: 'El beneficiario recibe el bien o servicio y cumple el plan de pagos mientras construye historial y reputacion.',
    en: 'The beneficiary receives the good or service and follows the payment plan while building history and reputation.'
  },
  "how.step5.role": {
    es: 'Fondo de garantias',
    en: 'Guarantee fund'
  },
  "how.step5.title": {
    es: 'Ante incumplimiento, el comerciante ejecuta la garantia',
    en: 'If there is a default, the merchant executes the guarantee'
  },
  "how.step5.description": {
    es: 'Si una cuota no se paga, el comerciante cobra desde el fondo de garantias y la cobertura se ejecuta automaticamente.',
    en: 'If an installment is not paid, the merchant collects from the guarantee fund and the coverage is executed automatically.'
  },
  "faq.eyebrow": {
    es: 'Preguntas frecuentes',
    en: 'Frequently asked questions'
  },
  "faq.title": {
    es: 'Respuestas claras para una garantia onchain',
    en: 'Clear answers for an onchain guarantee'
  },
  "faq.description": {
    es: 'Estas son las dudas mas comunes sobre el funcionamiento del fondo, los roles y la seguridad de las garantias dentro de AvalDAO.',
    en: 'These are the most common questions about how the fund, the roles, and guarantee security work inside AvalDAO.'
  },
  "faq.item1.question": {
    es: '¿Que es una garantia reciproca?',
    en: 'What is a reciprocal guarantee?'
  },
  "faq.item1.answer": {
    es: 'Es un respaldo emitido por AvalDAO para que una persona o microemprendimiento pueda acceder a credito comercial con mejores condiciones. El fondo cubre al comerciante si ocurre un incumplimiento previsto.',
    en: 'It is a backing issued by AvalDAO so a person or microbusiness can access commercial credit under better terms. The fund covers the merchant if an expected default occurs.'
  },
  "faq.item2.question": {
    es: '¿Quien puede solicitar una garantia?',
    en: 'Who can request a guarantee?'
  },
  "faq.item2.answer": {
    es: 'La solicitud la inicia un solicitante, como un tutor o referente, presentando al beneficiario o avalado. AvalDAO revisa el caso y define si la garantia puede ser aprobada.',
    en: 'The process starts with an applicant, such as a tutor or sponsor, presenting the beneficiary. AvalDAO reviews the case and decides whether the guarantee can be approved.'
  },
  "faq.item3.question": {
    es: '¿Que pasa si el beneficiario no puede pagar una cuota?',
    en: 'What happens if the beneficiary cannot pay an installment?'
  },
  "faq.item3.answer": {
    es: 'El comerciante puede ejecutar la garantia y recibir el pago desde el fondo de garantias segun las reglas aprobadas para esa operacion. Luego AvalDAO gestiona la recuperacion correspondiente.',
    en: 'The merchant can execute the guarantee and receive payment from the guarantee fund according to the rules approved for that operation. AvalDAO then manages the corresponding recovery process.'
  },
  "faq.item4.question": {
    es: '¿Como se financia el fondo de garantias?',
    en: 'How is the guarantee fund financed?'
  },
  "faq.item4.answer": {
    es: 'El fondo se sostiene con aportes de capital, herramientas de inversion y la administracion transparente de recursos onchain para mantener cobertura y solvencia.',
    en: 'The fund is sustained through capital contributions, investment tools, and transparent onchain resource management to maintain coverage and solvency.'
  },
  "faq.item5.question": {
    es: '¿Como se que mi garantia es valida y segura?',
    en: 'How do I know my guarantee is valid and secure?'
  },
  "faq.item5.answer": {
    es: 'Cada garantia queda registrada con reglas verificables y trazabilidad en blockchain. Eso permite auditar aprobaciones, condiciones y ejecuciones sin depender de procesos opacos.',
    en: 'Each guarantee is recorded with verifiable rules and blockchain traceability. That makes approvals, terms, and executions auditable without relying on opaque processes.'
  },
  "timeline.eyebrow": {
    es: 'Evolucion del proyecto',
    en: 'Project evolution'
  },
  "timeline.title": {
    es: 'Roadmap del fondo de garantias',
    en: 'Guarantee fund roadmap'
  },
  "timeline.description": {
    es: 'Hoy el fondo se sostiene con aportes voluntarios. El proximo salto es habilitar participacion de inversores con contratos inteligentes y rendimiento transparente.',
    en: 'Today the fund is sustained by voluntary contributions. The next leap is enabling investor participation with smart contracts and transparent yield.'
  },
  "timeline.phase.current": {
    es: 'Estado actual',
    en: 'Current state'
  },
  "timeline.current.title": {
    es: 'Fondo por donaciones',
    en: 'Donation-based fund'
  },
  "timeline.current.description": {
    es: 'Las personas que aportan capital lo hacen por voluntad propia para fortalecer la cobertura de garantias, sin retorno economico directo.',
    en: 'People who contribute capital do so voluntarily to strengthen guarantee coverage, without direct financial return.'
  },
  "timeline.phase.next": {
    es: 'Siguiente etapa',
    en: 'Next stage'
  },
  "timeline.next.title": {
    es: 'Nuevos smart contracts',
    en: 'New smart contracts'
  },
  "timeline.next.description": {
    es: 'Estamos disenando contratos para administrar aportes, reglas de riesgo y distribucion de resultados de manera automatizada y auditable.',
    en: 'We are designing contracts to manage contributions, risk rules, and result distribution in an automated and auditable way.'
  },
  "timeline.phase.future": {
    es: 'Vision futura',
    en: 'Future vision'
  },
  "timeline.future.title": {
    es: 'Inversores con rendimiento',
    en: 'Yield for investors'
  },
  "timeline.future.description": {
    es: 'La meta es que inversores participen del fondo y obtengan rendimiento sostenible, alineado al desempeno real de las garantias.',
    en: 'The goal is for investors to participate in the fund and earn sustainable yield aligned with the real performance of guarantees.'
  },
  "actors.investors.title": {
    es: 'Inversores',
    en: 'Investors'
  },
  "actors.investors.description": {
    es: 'Contribuye capital cripto al Fondo de Garantía para brindar crecimiento social y sostenibilidad económica.',
    en: 'Contribute crypto capital to the Guarantee Fund to provide social growth and economic sustainability.'
  },
  "actors.smes.title": {
    es: 'Pymes',
    en: 'SMEs'
  },
  "actors.smes.description": {
    es: 'Construyen su reputación en su identidad digital a través de credenciales otorgadas por emisores que acreditan aspectos como responsabilidad, conocimiento y productividad, entre otros.',
    en: 'Build their reputation on their digital identity through credentials granted by issuers that accredit aspects such as responsibility, knowledge, and productivity, among others.'
  },
  "actors.shops.title": {
    es: 'Comercios',
    en: 'Shops'
  },
  "actors.shops.description": {
    es: 'Ofrecen sus bienes y servicios con condiciones de crédito especiales a los clientes con garantías de AvalDAO.',
    en: 'Offer their goods and services with special credit conditions to customers with guarantees from AvalDAO.'
  },

  "we-trust": {
    es: 'Confiamos en vos',
    en: 'We trust you'
  },

  "dashboard.title": {
    es: 'Dashboard',
    en: 'Dashboard'
  },
  "dashboard.description": {
    es: 'AvalDAO es transparente. Puedes conocer el estado de su economía interna en tiempo real.',
    en: 'AvalDAO is transparent. You can know the state of its internal economy in real time.'
  },
  "dashboard.guarantee-fund.title": {
    es: 'Fondo de Garantía',
    en: 'Guarantee Fund'
  },
  "dashboard.guarantee-fund.clarification": {
    es: '* Expresado en stablecoins equivalentes al dólar',
    en: '* Value expressed in dollar-pegged stablecoins'
  },
  "dashboard.guarantee-fund.see-contract": {
    es: 'Ver contrato AvalDAO',
    en: 'See AvalDAO contract'
  },

  "footer.description": {
    es: 'La primera Sociedad de Garantía Recíproca descentralizada',
    en: 'The first decentralized Reciprocal Guarantee Society'
  },
  "footer.rights-reserved": {
    es: 'Todos los derechos reservados.',
    en: 'All rights reserved.'
  },

  "aval-not-found.title": {
    es: 'Aval No Encontrado',
    en: 'Aval Not Found'
  },
  "aval-not-found.description": {
    es: 'El aval con ID {id} no existe o no pudo ser cargado.',
    en: 'The aval with ID {id} does not exist or could not be loaded.'
  },
  "aval.details.objective": {
    es: 'Objetivo del Proyecto',
    en: 'Project Objective'
  },
  "aval.details.acquisition": {
    es: 'Adquisición Planeada',
    en: 'Planned Acquisition'
  },
  "aval.details.beneficiaries": {
    es: 'Beneficiarios',
    en: 'Beneficiaries'
  },
  "aval.details.schedule": {
    es: 'Cuotas',
    en: 'Schedule'
  },
  "aval.details.start-date": {
    es: 'Fecha de Inicio',
    en: 'Start Date'
  },
  "aval.details.end-date": {
    es: 'Fecha de Fin',
    en: 'End Date'
  },
  "aval.details.duration-tranche": {
    es: 'Duración cuota',
    en: 'Tranche Duration'
  },
  "aval.details.unlock": {
    es: 'Desbloqueo',
    en: 'Unlock'
  },
  "aval.details.tranches-amount": {
    es: 'Cantidad de Cuotas',
    en: 'Tranches Amount'
  },
  "aval.details.amount": {
    es: 'Monto',
    en: 'Amount'
  },
  "aval.details.tranche-number": {
    es: 'Cuota #',
    en: 'Tranche #'
  },
  "aval.details.maturity-date": {
    es: 'Vencimiento',
    en: 'Maturity Date'
  },
  "aval.details.unlock-date": {
    es: 'Desbloqueo',
    en: 'Unlock Date'
  },
  "aval.details.tranche": {
    es: 'Cuota',
    en: 'Tranche'
  },

  "aval.details.financial-info": {
    es: 'Información Financiera',
    en: 'Financial Information'
  },

  "aval.details.participants": {
    es: 'Participantes',
    en: 'Participants'
  },
  "aval.details.applicant": {
    es: 'Solicitante',
    en: 'Applicant'
  },
  "aval.details.avalado": {
    es: 'Beneficiario',
    en: 'Beneficiary'
  },
  "aval.details.merchant": {
    es: 'Comerciante',
    en: 'Merchant'
  },
  "aval.details.avaldao": {
    es: 'AvalDAO',
    en: 'AvalDAO'
  },
}

