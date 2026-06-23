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
  "nav.login": {
    es: 'Iniciar sesión',
    en: 'Log in'
  },
  "nav.signup": {
    es: 'Registrarse',
    en: 'Sign up'
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

  "signup.title": {
    es: 'Creá tu cuenta',
    en: 'Create your account'
  },
  "signup.description": {
    es: 'Completá tu perfil para empezar a operar en AvalDAO. Podés cambiar tus datos y roles en cualquier momento desde tu perfil.',
    en: 'Complete your profile to start operating on AvalDAO. You can update your details and roles at any time from your profile.'
  },

  // Signup form fields
  "signup.form.account-type": { es: 'Tipo de cuenta', en: 'Account type' },
  "signup.form.personal.firstName": { es: 'Nombre', en: 'First name' },
  "signup.form.personal.firstName.placeholder": { es: 'Juan', en: 'John' },
  "signup.form.personal.lastName": { es: 'Apellido', en: 'Last name' },
  "signup.form.personal.lastName.placeholder": { es: 'Pérez', en: 'Smith' },
  "signup.form.business.companyName": { es: 'Razón Social', en: 'Company name' },
  "signup.form.business.companyName.placeholder": { es: 'Empresa S.A.', en: 'Acme Corp.' },
  "signup.form.business.cuit": { es: 'CUIT', en: 'Tax ID' },
  "signup.form.business.cuit.placeholder": { es: '20-12345678-9', en: '12-3456789-0' },
  "signup.form.email": { es: 'Email', en: 'Email' },
  "signup.form.wallet": { es: 'Wallet conectada', en: 'Connected wallet' },
  "signup.form.wallet.placeholder": { es: 'Conectá tu wallet para ver la dirección', en: 'Connect your wallet to see the address' },
  "signup.form.location": { es: 'Ubicación', en: 'Location' },
  "signup.form.location.country": { es: 'País', en: 'Country' },
  "signup.form.location.country.placeholder": { es: 'Seleccioná tu país', en: 'Select your country' },
  "signup.form.location.city": { es: 'Localidad', en: 'City' },
  "signup.form.location.city.placeholder": { es: 'Ciudad, Provincia…', en: 'City, State…' },
  "signup.form.roles": { es: 'Roles en la plataforma', en: 'Platform roles' },
  "signup.form.roles.hint": { es: 'Podés seleccionar más de uno. Siempre podés cambiarlos más adelante.', en: 'You can select more than one. You can always change them later.' },
  "signup.form.legal": { es: 'Aceptación legal', en: 'Legal acceptance' },
  "signup.form.legal.tyc.pre": { es: 'Acepto los', en: 'I accept the' },
  "signup.form.legal.tyc.link": { es: 'Términos y Condiciones (v1.0)', en: 'Terms and Conditions (v1.0)' },
  "signup.form.legal.privacy.pre": { es: 'Acepto la', en: 'I accept the' },
  "signup.form.legal.privacy.label": { es: 'Política de Privacidad', en: 'Privacy Policy' },
  "signup.form.legal.age.pre": { es: 'Confirmo tener', en: 'I confirm I am' },
  "signup.form.legal.age.label": { es: '18 años o más', en: '18 years or older' },
  "signup.form.submit": { es: 'Crear cuenta', en: 'Create account' },
  "signup.form.success": { es: '¡Cuenta creada exitosamente!', en: 'Account created successfully!' },
  "signup.success-modal.title": {
    es: "Revisa tu correo electrónico",
    en: "Check your email"
  },

  "signup.success-modal.description": {
    es: "Gracias por registrarte. Te enviamos un correo electrónico para verificar tu cuenta. Sigue las instrucciones del mensaje para completar el registro.",
    en: "Thank you for signing up. We have sent you an email to verify your account. Please follow the instructions in the email to complete your registration."
  },
  "signup.form.error.required-fields": { es: 'Por favor completá todos los campos requeridos', en: 'Please complete all required fields' },
  "signup.form.error.unexpected": { es: 'Ocurrió un error inesperado', en: 'An unexpected error occurred' },

  // TyC content
  "signup.tyc.title": { es: 'Términos y Condiciones de AvalDAO (v1.0)', en: 'AvalDAO Terms and Conditions (v1.0)' },
  "signup.tyc.intro": { es: 'Estos son los términos y condiciones provisorios de la plataforma AvalDAO. El contenido definitivo estará disponible próximamente.', en: 'These are the provisional terms and conditions of the AvalDAO platform. The final content will be available soon.' },
  "signup.tyc.s1.title": { es: '1. Uso de la plataforma', en: '1. Use of the platform' },
  "signup.tyc.s1.body": { es: 'Al registrarte aceptás utilizar AvalDAO exclusivamente para los fines permitidos por la plataforma, en cumplimiento de la normativa vigente en tu jurisdicción.', en: 'By registering you agree to use AvalDAO exclusively for the purposes permitted by the platform, in compliance with the regulations in force in your jurisdiction.' },
  "signup.tyc.s2.title": { es: '2. Fondo de garantías', en: '2. Guarantee fund' },
  "signup.tyc.s2.body": { es: 'La participación en el fondo de garantías implica entender los riesgos asociados a operaciones de crédito descentralizadas. AvalDAO no garantiza retornos ni resultados específicos.', en: 'Participation in the guarantee fund implies understanding the risks associated with decentralized credit operations. AvalDAO does not guarantee returns or specific results.' },
  "signup.tyc.s3.title": { es: '3. Roles y responsabilidades', en: '3. Roles and responsibilities' },
  "signup.tyc.s3.body": { es: 'Cada rol dentro de la plataforma (Solicitante, Avalado, Comerciante) conlleva obligaciones específicas que serán detalladas en la documentación oficial.', en: 'Each role within the platform (Applicant, Endorsed, Merchant) entails specific obligations that will be detailed in the official documentation.' },
  "signup.tyc.s4.title": { es: '4. Datos personales', en: '4. Personal data' },
  "signup.tyc.s4.body": { es: 'El tratamiento de tus datos se rige por la Política de Privacidad de AvalDAO, disponible por separado.', en: 'The processing of your data is governed by the AvalDAO Privacy Policy, available separately.' },
  "signup.tyc.s5.title": { es: '5. Jurisdicción', en: '5. Jurisdiction' },
  "signup.tyc.s5.body": { es: 'Las disputas se resolverán bajo la legislación de la República Argentina, salvo acuerdo expreso en contrario.', en: 'Disputes will be resolved under the laws of the Argentine Republic, unless expressly agreed otherwise.' },
  "signup.tyc.draft": { es: 'Versión 1.0 — Borrador provisional sujeto a cambios.', en: 'Version 1.0 — Provisional draft subject to changes.' },
  "signup.tyc.dialog.title": { es: 'Términos y Condiciones', en: 'Terms and Conditions' },
  "signup.tyc.dialog.decline": { es: 'Rechazar', en: 'Decline' },
  "signup.tyc.dialog.accept": { es: 'Aceptar y Continuar', en: 'Accept & Continue' },

  // Sign modal
  "signup.sign.badge": { es: 'Verificación de identidad', en: 'Identity verification' },
  "signup.sign.idle.title": { es: 'Firmá el mensaje', en: 'Sign the message' },
  "signup.sign.idle.description": { es: 'Para completar el registro necesitamos verificar que sos el dueño de esta wallet. No tiene ningún costo.', en: 'To complete registration we need to verify you own this wallet. This is free, no gas cost.' },
  "signup.sign.waiting.title": { es: 'Esperando firma...', en: 'Waiting for signature...' },
  "signup.sign.waiting.description": { es: 'Revisá tu wallet y firmá el mensaje para continuar.', en: 'Check your wallet and sign the message to continue.' },
  "signup.sign.waiting.button": { es: 'Esperando tu wallet…', en: 'Waiting for your wallet…' },
  "signup.sign.success.title": { es: 'Firma exitosa', en: 'Signature successful' },
  "signup.sign.success.description": { es: 'Tu identidad fue verificada. Procesando registro...', en: 'Your identity was verified. Processing registration...' },
  "signup.sign.error.title": { es: 'Firma rechazada', en: 'Signature rejected' },
  "signup.sign.error.description": { es: 'Rechazaste la firma en tu wallet. Podés intentarlo de nuevo.', en: 'You rejected the signature in your wallet. You can try again.' },
  "signup.sign.button": { es: 'Firmar mensaje', en: 'Sign message' },
  "signup.sign.retry.button": { es: 'Reintentar firma', en: 'Retry signature' },
  "signup.sign.info.wallet": { es: 'Wallet', en: 'Wallet' },
  "signup.sign.info.message": { es: 'Mensaje', en: 'Message' },
  "signup.sign.info.cost": { es: 'Costo', en: 'Cost' },
  "signup.sign.info.cost.value": { es: 'Gratis — sin gas', en: 'Free — no gas' },
  "signup.form.validation.accountType": { es: 'Seleccioná un tipo de cuenta', en: 'Select an account type' },
  "signup.form.validation.firstName": { es: 'El nombre es requerido', en: 'First name is required' },
  "signup.form.validation.lastName": { es: 'El apellido es requerido', en: 'Last name is required' },
  "signup.form.validation.companyName": { es: 'La razón social es requerida', en: 'Company name is required' },
  "signup.form.validation.cuit": { es: 'El CUIT es requerido', en: 'Tax ID is required' },
  "signup.form.validation.email.required": { es: 'El email es requerido', en: 'Email is required' },
  "signup.form.validation.email.invalid": { es: 'Ingresá un email válido', en: 'Enter a valid email' },
  "signup.form.validation.country": { es: 'Seleccioná un país', en: 'Select a country' },
  "signup.form.validation.location": { es: 'Ingresá tu localidad', en: 'Enter your city' },
  "signup.form.validation.roles": { es: 'Seleccioná al menos un rol', en: 'Select at least one role' },
  "signup.form.validation.tyc": { es: 'Debés aceptar los Términos y Condiciones', en: 'You must accept the Terms and Conditions' },
  "signup.form.validation.privacy": { es: 'Debés aceptar la Política de Privacidad', en: 'You must accept the Privacy Policy' },
  "signup.form.validation.age": { es: 'Debés confirmar que tenés 18 años o más', en: 'You must confirm you are 18 or older' },

  // Platform roles (signup role selector)
  "signup.role.applicant.name": { es: 'Solicitante', en: 'Applicant' },
  "signup.role.applicant.description": { es: 'Presenta al beneficiario y solicita la garantía. Carga la información del beneficiario y activa la evaluación inicial del crédito.', en: 'Presents the beneficiary and requests the guarantee. Submits the beneficiary\'s information and starts the initial credit review.' },
  "signup.role.endorsed.name": { es: 'Avalado', en: 'Endorsed' },
  "signup.role.endorsed.description": { es: 'Accede al bien o servicio y paga las cuotas, construyendo historial y reputación dentro de la plataforma.', en: 'Accesses goods or services and pays installments, building history and reputation on the platform.' },
  "signup.role.merchant.name": { es: 'Comerciante', en: 'Merchant' },
  "signup.role.merchant.description": { es: 'Acepta la garantía aprobada y habilita el financiamiento en cuotas. Confirma la venta bajo las condiciones acordadas.', en: 'Accepts the approved guarantee and enables installment financing. Confirms the sale under the agreed terms.' },
  "signup.role.investor.name": { es: 'Inversor', en: 'Investor' },
  "signup.role.investor.description": { es: 'Aporta capital al fondo de garantías y obtiene rendimientos por respaldar operaciones de crédito dentro de la plataforma.', en: 'Provides capital to the guarantee fund and earns returns by backing credit operations on the platform.' },

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

  "aliados.eyebrow": {
    es: 'Con el apoyo de',
    en: 'Supported by'
  },
  "aliados.title": {
    es: 'Aliados',
    en: 'Partners'
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
  "aval.details.status": {
    es: 'Estado',
    en: 'Status'
  },
  "aval.details.cuota-status.pending": {
    es: 'Pendiente',
    en: 'Pending'
  },
  "aval.details.cuota-status.ready-to-unlock": {
    es: 'Lista para desbloquear',
    en: 'Ready to Unlock'
  },
  "aval.details.cuota-status.cancelled": {
    es: 'Garantía Cancelada',
    en: 'Guarantee Cancelled'
  },
  "aval.details.cuota-status.executed": {
    es: 'Garantía Ejecutada',
    en: 'Guarantee Executed'
  },
  "aval.details.unlock-cuota.title": {
    es: 'Cuota lista para desbloquear',
    en: 'Tranche Ready to Unlock'
  },
  "aval.details.unlock-cuota.description": {
    es: 'Podés iniciar el desbloqueo de la próxima cuota.',
    en: 'You can initiate the unlock of the next tranche.'
  },
  "aval.details.unlock-cuota.button": {
    es: 'Desbloquear cuota',
    en: 'Unlock Tranche'
  },
  "aval.details.unlock-cuota.hint": {
    es: 'Al confirmar esta transacción, los fondos de la cuota serán liberados de vuelta al fondo de garantías y la cuota dejará de ser reclamable. Ejecutá esta acción con discreción y asegurate de que el pago al comerciante ya haya sido realizado.',
    en: 'By confirming this transaction, the tranche funds will be released back to the guarantee fund and the tranche will no longer be claimable. Execute this action with discretion and make sure the payment to the merchant has already been made.'
  },
  "aval.details.unlockable-tranches": {
    es: 'Cuotas Desbloqueables',
    en: 'Unlockable Tranches'
  },
  "aval.details.no-unlockable-tranches": {
    es: 'No hay cuotas listas para desbloquear.',
    en: 'No tranches ready to unlock.'
  },
  "aval.details.no-onchain-data": {
    es: 'Sin datos on-chain disponibles.',
    en: 'No on-chain data available.'
  },
  "aval.details.claims": {
    es: 'Reclamos',
    en: 'Claims'
  },
  "aval.details.claim-number": {
    es: 'Reclamo #',
    en: 'Claim #'
  },
  "aval.details.creation-date": {
    es: 'Fecha de creación',
    en: 'Creation Date'
  },
  "aval.details.claim-status.active": {
    es: 'Vigente',
    en: 'Active'
  },
  "aval.details.claim-status.closed": {
    es: 'Cerrado',
    en: 'Closed'
  },
  "aval.details.no-claims": {
    es: 'Sin reclamos. En caso de que se encuentren, los visualizarás aquí.',
    en: 'No claims. If any are found, you will see them here.'
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

  // Auth Modal
  "auth.modal.title": {
    es: 'Verificar Identidad',
    en: 'Verify Identity'
  },
  "auth.modal.verify-identity": {
    es: 'Verificar Identidad',
    en: 'Verify Identity'
  },
  "auth.modal.step.connect-wallet": {
    es: 'Conectar Wallet',
    en: 'Connect Wallet'
  },
  "auth.modal.step.sign-message": {
    es: 'Firmar Mensaje',
    en: 'Sign Message'
  },
  "auth.modal.step.verified": {
    es: 'Verificado',
    en: 'Verified'
  },
  "auth.modal.connect.title": {
    es: 'Conecta tu Wallet',
    en: 'Connect Your Wallet'
  },
  "auth.modal.connect.description": {
    es: 'Para comenzar, conecta tu wallet preferida. Esto nos permite identificar tu dirección de Ethereum de forma segura.',
    en: 'To get started, connect your preferred wallet. This allows us to securely identify your Ethereum address.'
  },
  "auth.modal.connect.button": {
    es: 'Conectar Wallet',
    en: 'Connect Wallet'
  },
  "auth.modal.connected.title": {
    es: 'Wallet Conectada',
    en: 'Wallet Connected'
  },
  "auth.modal.connected.description": {
    es: '¡Perfecto! Ahora necesitamos que firmes un mensaje para verificar que eres el propietario de esta wallet.',
    en: 'Perfect! Now we need you to sign a message to verify that you own this wallet.'
  },
  "auth.modal.connected.sign-button": {
    es: 'Firmar Mensaje',
    en: 'Sign Message'
  },
  "auth.modal.connected.signing-button": {
    es: 'Preparando...',
    en: 'Preparing...'
  },
  "auth.modal.connected.change-wallet": {
    es: 'Usar Otra Wallet',
    en: 'Use Another Wallet'
  },
  "auth.modal.signing.title": {
    es: 'Verificando Identidad',
    en: 'Verifying Identity'
  },
  "auth.modal.signing.description": {
    es: 'Por favor, confirma la firma del mensaje en tu wallet. Esto demuestra que eres el propietario legítimo.',
    en: 'Please confirm the message signature in your wallet. This proves you are the legitimate owner.'
  },
  "auth.modal.signing.no-gas.title": {
    es: 'No se requiere gas',
    en: 'No gas required'
  },
  "auth.modal.signing.no-gas.description": {
    es: 'Firmar un mensaje es gratis y no consume ETH',
    en: 'Signing a message is free and does not consume ETH'
  },
  "auth.modal.verified.title": {
    es: '¡Identidad Verificada!',
    en: 'Identity Verified!'
  },
  "auth.modal.verified.description": {
    es: 'Tu identidad ha sido verificada exitosamente. Ya puedes acceder a todas las funciones.',
    en: 'Your identity has been successfully verified. You can now access all features.'
  },
  "auth.modal.verified.redirecting": {
    es: 'Redirigiendo...',
    en: 'Redirecting...'
  },
  "auth.modal.footer.title": {
    es: 'Tu seguridad es importante',
    en: 'Your security is important'
  },
  "auth.modal.footer.description": {
    es: 'Solo verificamos tu propiedad de la wallet. No podemos realizar transacciones sin tu autorización.',
    en: 'We only verify your wallet ownership. We cannot perform transactions without your authorization.'
  },

  "account-type.personal.name": {
    es: 'Cuenta Individual',
    en: 'Individual Account'
  },
  "account-type.business.name": {
    es: 'Cuenta Comercial',
    en: 'Business Account'
  },

  "account-type.personal.description": {
    es: 'Para personas que desean solicitar avales para uso personal o como representantes de un negocio.',
    en: 'For individuals who want to request guarantees for personal use or as representatives of a business.'
  },
  "account-type.business.description": {
    es: 'Para empresas que buscan solicitar avales para sus operaciones comerciales o respaldar a sus clientes.',
    en: 'For businesses seeking to request guarantees for their commercial operations or to back their customers.'
  },
  "signup.create-account": {
    es: 'Crea tu cuenta',
    en: 'Create your account'
  },
  "signup.form.askConnection.title": {
    es: 'Conectá tu wallet',
    en: 'Connect your wallet'
  },
  "signup.form.askConnection.description": {
    es: 'Algunas funcionalidades de AvalDAO requieren una wallet conectada. Si bien no es obligatorio ahora, sugerimos hacerlo para tener la mejor experiencia posible en la plataforma.',
    en: 'Some features of AvalDAO require a connected wallet. While it is not mandatory now, we suggest doing it for the best possible experience on the platform.'
  },
  "signup.form.askConnection.connect": {
    es: 'Conectar ahora',
    en: 'Connect now'
  },
  "signup.form.askConnection.cancel": {
    es: 'Conectar más tarde',
    en: 'Connect later'
  },
  "email.activation.subject": {
    es: 'Activa tu cuenta',
    en: 'Activate your account'
  },
  "email.activation.body": {
    es: "Por favor, haz clic en el siguiente enlace para activar tu cuenta:",
    en: "Please click the following link to activate your account:"
  },

  "login.title": {
    es: 'Iniciar sesión',
    en: 'Log in'
  },
  "login.description": {
    es: 'Bienvenido de nuevo. Por favor, ingresa tus credenciales para acceder a tu cuenta.',
    en: 'Welcome back. Please enter your credentials to access your account.'
  },
  "login.email": {
    es: 'Email',
    en: 'Email'
  },
  "login.password": {
    es: 'Contraseña',
    en: 'Password'
  },
  "login.or": {
    es: 'o',
    en: 'or'
  },
  "login.email.placeholder": {
    es: 'juanperez@gmail.com',
    en: 'johndoe@gmail.com'
  },
  "login.password.placeholder": {
    es: 'Contraseña',
    en: 'Password'
  },
  "login.submit": {
    es: 'Iniciar sesión',
    en: 'Log in'
  },
  "login.submit.wallet": {
    es: 'Iniciar sesión con Wallet',
    en: 'Log in with Wallet'
  },
  "login.forgot-password": {
    es: '¿Olvidaste tu contraseña?',
    en: 'Forgot your password?'
  },
  "login.error.invalid-credentials": {
    es: 'Credenciales inválidas. Por favor, intenta de nuevo.',
    en: 'Invalid credentials. Please try again.'
  },
  "login.no-account": {
    es: '¿No tenés una cuenta?',
    en: "Don't have an account?"
  },
  "login.signup-link": {
    es: 'Registrate',
    en: 'Sign up'
  },
  "signup.have-account": {
    es: '¿Ya tenés una cuenta?',
    en: 'Already have an account?'
  },
  "signup.login-link": {
    es: 'Iniciá sesión',
    en: 'Log in'
  },
  "login.error.missing_fields": {
    es: 'Por favor, completa todos los campos.',
    en: 'Please fill in all fields.'
  },
  "login.error.generic": {
    es: 'Ocurrió un error. Por favor, intenta de nuevo.',
    en: 'An error occurred. Please try again.'
  },
  "login.error.recaptcha": {
    es: 'Verificación de seguridad fallida. Por favor, intenta de nuevo.',
    en: 'Security verification failed. Please try again.'
  },
  "login.error.user-not-found-wallet": {
    es: 'No se encontró un usuario asociado a esta wallet. Por favor, regístrate primero.',
    en: 'No user found associated with this wallet. Please register first.'
  },
  "sidebar.dashboard": {
    es: 'Inicio',
    en: 'Dashboard'
  },
  "sidebar.users": {
    es: 'Usuarios',
    en: 'Users'
  },
  "sidebar.avales": {
    es: 'Avales',
    en: 'Guarantees'
  },
  "avals.title": {
    es: 'Avales',
    en: 'Guarantees'
  },
  "avals.description": {
    es: 'Gestión de avales en la plataforma',
    en: 'Manage guarantees on the platform'
  },
  "avals.new-aval": {
    es: 'Nuevo Aval',
    en: 'New Aval'
  },
  "avals.new.title": {
    es: 'Nuevo Aval',
    en: 'New Aval'
  },
  "avals.new.description": {
    es: 'Completá el formulario para solicitar un nuevo aval',
    en: 'Fill in the form to request a new guarantee'
  },
  "avals.new.info.evaluation": {
    es: 'Tu solicitud será evaluada por un miembro con rol Avaldao en la plataforma antes de ser procesada.',
    en: 'Your request will be reviewed by a member with the Avaldao role on the platform before being processed.'
  },
  "avals.new.info.addresses": {
    es: 'Asegurate de que las addresses de todos los participantes sean correctas, ya que deberán firmar el aval.',
    en: 'Make sure all participant addresses are correct, as they will need to sign the guarantee.'
  },
  "avals.new.info.vigente": {
    es: 'El aval no se considera Vigente hasta que todos los participantes hayan registrado su firma y los fondos de garantía estén asignados en el smart contract.',
    en: 'The guarantee is not considered Active until all participants have registered their signatures and the guarantee funds are assigned in the smart contract.'
  },
  "avals.new.breadcrumb": {
    es: 'Nuevo',
    en: 'New'
  },
  "aval.details.duration": {
    es: 'Duración',
    en: 'Duration'
  },
  "aval.details.days": {
    es: 'días',
    en: 'days'
  },
  "aval.network": {
    es: 'Red',
    en: 'Network'
  },
  "aval.loading.error": {
    es: 'Error al Cargar Aval',
    en: 'Error Loading Aval'
  },
  "aval.loading.error-description": {
    es: 'No se pudo cargar la información del aval. Por favor, intenta recargar la página o vuelve más tarde.',
    en: 'Could not load the aval information. Please try refreshing the page or come back later.'
  },
  "aval.error.badge": {
    es: 'Error del sistema',
    en: 'System error'
  },

  // Aval status badge texts
  "aval.status.requested": { es: "Solicitado", en: "Requested" },
  "aval.status.rejected": { es: "Rechazado", en: "Rejected" },
  "aval.status.accepted": { es: "Aceptado", en: "Accepted" },
  "aval.status.active": { es: "Vigente", en: "Active" },
  "aval.status.finalized": { es: "Finalizado", en: "Finalized" },
  "aval.status.unknown": { es: "Desconocido", en: "Unknown" },

  // Aval not-found badge
  "aval-not-found.badge": { es: "ID Inválido", en: "Invalid ID" },

  // Aval address label
  "aval.address": { es: "Dirección", en: "Address" },

  // Aval actions panel
  "aval.actions.pending-review.title": { es: "Aval pendiente de revisión", en: "Aval pending review" },
  "aval.actions.pending-review.description": { es: "Revisá los detalles y decidí si aceptar o rechazar este aval.", en: "Review the details and decide whether to accept or reject this aval." },
  "aval.actions.accept": { es: "Aceptar aval", en: "Accept aval" },
  "aval.actions.reject": { es: "Rechazar", en: "Reject" },
  "aval.actions.reject.reason.placeholder": { es: "Motivo del rechazo…", en: "Reason for rejection…" },
  "aval.actions.reject.confirm": { es: "Confirmar rechazo", en: "Confirm rejection" },
  "aval.actions.cancel": { es: "Cancelar", en: "Cancel" },
  "aval.actions.evaluation.title": { es: "Aval en evaluación", en: "Aval under review" },
  "aval.actions.evaluation.description": { es: "El equipo de AvalDAO está revisando este aval. Serás notificado cuando haya cambios.", en: "The AvalDAO team is reviewing this aval. You will be notified when there are changes." },
  "aval.actions.rejected.title": { es: "Aval rechazado", en: "Aval rejected" },
  "aval.actions.rejected.reason": { es: "Motivo: {{reason}}", en: "Reason: {{reason}}" },
  "aval.sign.badge": { es: "Firma del aval", en: "Aval signature" },
  "aval.sign.idle.title": { es: "Firmá los datos del aval", en: "Sign the aval data" },
  "aval.sign.idle.description": { es: "Tu firma confirma que estás de acuerdo con los términos del aval. No tiene ningún costo en gas.", en: "Your signature confirms you agree with the aval terms. There is no gas cost." },

  "aval.actions.signatures.title": { es: "Firmas recolectadas", en: "Collected signatures" },
  "aval.actions.signatures.description": { es: "El aval ya está desplegado en la blockchain. Para que pueda iniciarse, todos los participantes deben firmarlo.", en: "The aval is already deployed on the blockchain. For it to start, all participants must sign it." },
  "aval.actions.sign-as": { es: "Firmar como {{role}}", en: "Sign as {{role}}" },
  "aval.actions.already-signed": { es: "Ya registraste tu firma como {{role}}.", en: "You already registered your signature as {{role}}." },
  "aval.actions.all-signed.description": { es: "Todas las firmas están registradas. Podés enviarlas al contrato para iniciar el aval.", en: "All signatures are registered. You can submit them to the contract to start the aval." },
  "aval.actions.start-aval": { es: "Iniciar aval en blockchain", en: "Start aval on blockchain" },
  "aval.actions.waiting-avaldao": { es: "Todas las firmas recolectadas. Esperando que AvalDAO inicie el aval.", en: "All signatures collected. Waiting for AvalDAO to start the aval." },
  "aval.actions.active.title": { es: "Aval activo en blockchain", en: "Aval active on blockchain" },
  "aval.actions.active.description": { es: "El aval está vigente y registrado en el contrato inteligente.", en: "The aval is active and registered in the smart contract." },
  "aval.actions.finalized.title": { es: "Aval finalizado", en: "Aval finalized" },
  "aval.actions.finalized.description": { es: "Este aval ha concluido exitosamente.", en: "This aval has concluded successfully." },
  "aval.actions.reject.validation": { es: "Por favor ingresá un motivo de rechazo.", en: "Please enter a reason for rejection." },
  "aval.actions.reject.success": { es: "Aval rechazado.", en: "Aval rejected." },
  "aval.actions.sign.success": { es: "Firma registrada exitosamente", en: "Signature registered successfully" },
  "aval.actions.sign.error": { es: "Error al firmar: {{error}}", en: "Error signing: {{error}}" },
  "aval.actions.wrong-network": { es: "Por favor cambiá a la red correcta. Chain ID requerido: {{chainId}}", en: "Please switch to the correct network. Required Chain ID: {{chainId}}" },
  "aval.actions.aval-address-not-found": { es: "Dirección del aval no encontrada para {{id}}", en: "Aval address not found for {{id}}" },
  "aval.actions.contract-not-found": { es: "Contrato del aval no encontrado", en: "Aval contract not found" },
  "aval.actions.incomplete-signatures": { es: "Firmas incompletas", en: "Incomplete signatures" },
  "aval.actions.unknown-error": { es: "Error desconocido", en: "Unknown error" },
  "aval.actions.reject-aval-error": { es: "Error al rechazar el aval", en: "Error rejecting the aval" },

  // Platform status dashboard
  "dashboard.platform.network": { es: "Red", en: "Network" },
  "dashboard.platform.refresh": { es: "Actualizar", en: "Refresh" },
  "dashboard.platform.cached": { es: "Caché", en: "Cached" },
  "dashboard.platform.live": { es: "En vivo", en: "Live" },
  "dashboard.platform.error": { es: "Error al cargar datos", en: "Error loading data" },
  "dashboard.platform.contract": { es: "Contrato Avaldao", en: "Avaldao Contract" },
  "dashboard.platform.fund-balance": { es: "Fondos Disponibles", en: "Available Funds" },
  "dashboard.platform.vigentes": { es: "Vigentes", en: "Active" },
  "dashboard.platform.finalizados": { es: "Finalizados", en: "Finalized" },
  "dashboard.platform.unlockable": { es: "Desbloqueables", en: "Unlockable" },
  "dashboard.platform.avales": { es: "avales", en: "avales" },
  "dashboard.platform.cuotas": { es: "cuotas", en: "tranches" },
  "dashboard.platform.cuota-singular": { es: "cuota disponible", en: "tranche available" },
  "dashboard.platform.cuotas-plural": { es: "cuotas disponibles", en: "tranches available" },
  "dashboard.platform.ready-to-unlock": { es: "para desbloquear", en: "to unlock" },
  "dashboard.platform.unlock-description": { es: "Existen cuotas cuyo período de desbloqueo ha vencido.", en: "There are tranches whose unlock period has expired." },
  "dashboard.platform.unlock-solicitante-hint": { es: "El desbloqueo automático no está disponible. Cada solicitante debe ingresar al aval correspondiente y desbloquear las cuotas manualmente.", en: "Automatic unlock is not available. Each solicitante must open the corresponding aval and unlock the tranches manually." },
  "dashboard.platform.unlock-btn": { es: "Desbloquear", en: "Unlock" },
  "dashboard.platform.unlock-manual-hint": { es: "Desbloqueando cuotas del aval como solicitante.", en: "Unlocking tranches for this aval as solicitante." },
  "dashboard.platform.unlock-hint": { es: "Desbloqueando cuotas disponibles en todos los avales vigentes.", en: "Unlocking available tranches across all active avales." },
  "dashboard.platform.avales-onchain": { es: "Avales On-Chain", en: "On-Chain Avales" },
  "dashboard.platform.no-vigentes": { es: "No hay avales vigentes.", en: "No active avales." },
  "dashboard.platform.no-finalizados": { es: "No hay avales finalizados.", en: "No finalized avales." },
  "dashboard.platform.col-address": { es: "Dirección", en: "Address" },
  "dashboard.platform.col-solicitante": { es: "Solicitante", en: "Solicitante" },
  "dashboard.platform.col-status": { es: "Estado", en: "Status" },
  "dashboard.platform.col-end-date": { es: "Fecha de Fin", en: "End Date" },
  "dashboard.platform.col-monto": { es: "Monto (USD)", en: "Amount (USD)" },
  "dashboard.platform.col-cuotas": { es: "Cuotas", en: "Tranches" },
  "dashboard.platform.col-proyecto": { es: "Proyecto", en: "Project" },
  "dashboard.platform.col-unlockable-cuotas": { es: "Desbloqueables", en: "Unlockable" },
  "dashboard.platform.col-reclamos": { es: "Reclamos", en: "Claims" },
  "dashboard.platform.filter-all": { es: "Todos", en: "All" },
  "dashboard.platform.status-aceptado": { es: "Aceptado", en: "Accepted" },
  "dashboard.platform.status-vigente": { es: "Vigente", en: "Active" },
  "dashboard.platform.status-finalizado": { es: "Finalizado", en: "Finalized" },
  "dashboard.platform.recent-activity": { es: "Últimos Movimientos", en: "Recent Activity" },
  "dashboard.platform.under-construction": { es: "En construcción", en: "Under construction" },
  "dashboard.platform.coming-soon": { es: "Próximamente disponible", en: "Coming soon" },
  "dashboard.platform.transfers-loading": { es: "Cargando movimientos…", en: "Loading transfers…" },
  "dashboard.platform.transfers-empty": { es: "No hay transferencias DOC recientes.", en: "No recent DOC transfers." },
  "dashboard.platform.transfers-error": { es: "Error al cargar movimientos.", en: "Error loading transfers." },
  "dashboard.platform.transfer-in": { es: "Entrada", en: "In" },
  "dashboard.platform.transfer-out": { es: "Salida", en: "Out" },
  "dashboard.platform.col-direction": { es: "Tipo", en: "Type" },
  "dashboard.platform.col-amount-doc": { es: "Monto (DOC)", en: "Amount (DOC)" },
  "dashboard.platform.col-counterpart": { es: "Contraparte", en: "Counterpart" },
  "dashboard.platform.col-tx": { es: "Tx", en: "Tx" },
  "dashboard.platform.col-block": { es: "Bloque", en: "Block" },
  "aval.unlockable-cuotas-tooltip": {
    es: "Estas cuotas están listas para ser desbloqueadas. Al hacerlo, los fondos se liberarán de vuelta al fondo de garantías y dejarán de estar reclamables.",
    en: "These tranches are ready to be unlocked. By doing so, the funds will be released back to the guarantee fund and will no longer be claimable."
  },

  // Transaction tracker
  "tx.step-badge": { es: "Paso {{step}} de 2", en: "Step {{step}} of 2" },
  "tx.info.network": { es: "Red", en: "Network" },
  "tx.info.account": { es: "Cuenta", en: "Account" },
  "tx.info.balance": { es: "Balance", en: "Balance" },
  "tx.info.tx-cost": { es: "Costo transacción", en: "Transaction cost" },
  "tx.info.contract": { es: "Contrato", en: "Contract" },
  "tx.info.tx-hash": { es: "Hash Tx", en: "Tx hash" },
  "tx.info.block": { es: "Bloque", en: "Block" },
  "tx.status.awaiting-signature": { es: "Esperando firma…", en: "Awaiting signature…" },
  "tx.status.pending-onchain": { es: "Pendiente en la red…", en: "Pending on-chain…" },
  "tx.action.cancel": { es: "Cancelar", en: "Cancel" },
  "tx.action.copied": { es: "Copiado", en: "Copied" },
  "tx.action.copy-reason": { es: "Copiar motivo", en: "Copy reason" },
  "tx.action.close": { es: "Cerrar", en: "Close" },
  "tx.error.expired": { es: "La solicitud de firma expiró", en: "Signing request timed out" },
  "tx.error.rejected": { es: "Transacción rechazada por el usuario", en: "Transaction rejected by user" },
  "tx.error.reverted": { es: "La transacción fue revertida en la red", en: "Transaction was reverted on-chain" },
  "tx.success.confirmed": { es: "Transacción confirmada exitosamente", en: "Transaction confirmed successfully" },
  "tx.footer.secure": { es: "Transacción blockchain segura", en: "Secure blockchain transaction" },
  "tx.copy.waiting_approval.title": { es: "Esperando aprobación", en: "Waiting for approval" },
  "tx.copy.waiting_approval.description": { es: "Revisá tu wallet y aprobá la transacción para continuar.", en: "Check your wallet and approve the transaction to proceed." },
  "tx.copy.sent.title": { es: "Transacción enviada", en: "Transaction sent" },
  "tx.copy.sent.description": { es: "Tu transacción fue transmitida a la red.", en: "Your transaction has been broadcast to the network." },
  "tx.copy.rejected.title": { es: "Transacción rechazada", en: "Transaction rejected" },
  "tx.copy.rejected.description": { es: "Rechazaste la transacción en tu wallet.", en: "You rejected the transaction in your wallet." },
  "tx.copy.expired.title": { es: "Solicitud expirada", en: "Request expired" },
  "tx.copy.expired.description": { es: "La solicitud de firma expiró. Podés intentarlo de nuevo.", en: "The signing request timed out. You can try again." },
  "tx.copy.waiting_confirmation.title": { es: "Esperando confirmación", en: "Waiting for confirmation" },
  "tx.copy.waiting_confirmation.description": { es: "Tu transacción está siendo procesada por la red.", en: "Your transaction is being processed by the network." },
  "tx.copy.confirmed.title": { es: "Transacción confirmada", en: "Transaction confirmed" },
  "tx.copy.confirmed.description": { es: "La transacción fue incluida en un bloque.", en: "The transaction has been included in a block." },
  "tx.copy.reverted.title": { es: "Transacción revertida", en: "Transaction reverted" },
  "tx.copy.reverted.description": { es: "La transacción falló en la red. No se movieron fondos.", en: "The transaction failed on-chain. No funds were moved." },
  "tx.copy.error.title": { es: "Error en transacción", en: "Transaction error" },
  "tx.copy.error.description": { es: "Ocurrió un error durante la transacción. Intentá de nuevo.", en: "An error occurred during the transaction. Please try again." },

  // Aval form (new aval)
  "aval.form.project": { es: "Proyecto", en: "Project" },
  "aval.form.objective": { es: "Objetivo", en: "Objective" },
  "aval.form.acquisition": { es: "Adquisición", en: "Acquisition" },
  "aval.form.beneficiaries": { es: "Beneficiarios", en: "Beneficiaries" },
  "aval.form.amount": { es: "Monto (USD)", en: "Amount (USD)" },
  "aval.form.installments": { es: "Cuotas", en: "Installments" },
  "aval.form.start-date": { es: "Fecha inicio", en: "Start date" },
  "aval.form.duration-days": { es: "Duración (días)", en: "Duration (days)" },
  "aval.form.applicant": { es: "Solicitante", en: "Applicant" },
  "aval.form.avaldao": { es: "AvalDAO", en: "AvalDAO" },
  "aval.form.merchant": { es: "Comerciante", en: "Merchant" },
  "aval.form.endorsed": { es: "Avalado", en: "Endorsed" },
  "aval.form.validation.invalid-address": { es: "Por favor ingresá un address válido", en: "Please enter a valid address" },
  "aval.form.user-not-found": { es: "No encontramos ningún usuario con esa dirección. Esto puede estar bien, pero deberá registrarse para poder participar del aval.", en: "We couldn't find any user with that address. This may be fine, but they will need to register to participate in the aval." },
  "aval.form.loading": { es: "Cargando...", en: "Loading..." },
  "aval.form.cancel": { es: "Cancelar", en: "Cancel" },
  "aval.form.submit": { es: "Crear Aval", en: "Create Aval" },
  "aval.form.submit.loading": { es: "Creando...", en: "Creating..." },
  "aval.form.success": { es: "Aval creado correctamente", en: "Aval created successfully" },
  "aval.form.error": { es: "Error al crear el aval. Por favor intenta nuevamente.", en: "Error creating the aval. Please try again." },

  // 404 page
  "not-found.badge": { es: "Página no encontrada", en: "Page not found" },
  "not-found.title": { es: "Esta página no existe", en: "This page doesn't exist" },
  "not-found.description": { es: "La URL que ingresaste no corresponde a ninguna página de AvalDAO. Puede que haya sido eliminada, movida, o que haya un error en el enlace.", en: "The URL you entered doesn't match any page on AvalDAO. It may have been removed, moved, or the link might be incorrect." },
  "not-found.go-home": { es: "Volver al inicio", en: "Back to home" },

  // Forgot password page
  "forgot-password.title": { es: "¿Olvidaste tu contraseña?", en: "Forgot your password?" },
  "forgot-password.description": { es: "Ingresá tu email y te enviaremos las instrucciones para recuperar tu contraseña.", en: "Enter your email and we'll send you instructions to recover your password." },
  "forgot-password.email.label": { es: "Email", en: "Email" },
  "forgot-password.email.placeholder": { es: "juanperez@gmail.com", en: "johndoe@gmail.com" },
  "forgot-password.submit": { es: "Enviar instrucciones", en: "Send instructions" },
  "forgot-password.back-to-login": { es: "Volver al inicio de sesión", en: "Back to log in" },
  "forgot-password.success.title": { es: "¡Email enviado!", en: "Email sent!" },
  "forgot-password.success.description": { es: "Si tu email está registrado y tiene acceso por contraseña, recibirás un link para recuperarla. Revisá tu bandeja de entrada y también la carpeta de spam. El link es válido por 10 minutos.", en: "If your email is registered and has password access, you'll receive a link to reset it. Check your inbox and also your spam folder. The link is valid for 10 minutes." },
  "forgot-password.error.cannot-process": { es: "Tu solicitud no pudo ser procesada. Por favor, contactá al administrador.", en: "Your request could not be processed. Please contact the administrator." },
  "forgot-password.error.generic": { es: "Ocurrió un error. Por favor, intenta de nuevo.", en: "An error occurred. Please try again." },

  // Reset password page
  "reset-password.title": { es: "Restablecer contraseña", en: "Reset password" },
  "reset-password.description": { es: "Ingresá tu nueva contraseña.", en: "Enter your new password." },
  "reset-password.password.label": { es: "Nueva contraseña", en: "New password" },
  "reset-password.password.placeholder": { es: "Nueva contraseña", en: "New password" },
  "reset-password.confirm-password.label": { es: "Confirmar contraseña", en: "Confirm password" },
  "reset-password.confirm-password.placeholder": { es: "Repetir contraseña", en: "Repeat password" },
  "reset-password.submit": { es: "Actualizar contraseña", en: "Update password" },
  "reset-password.back-to-login": { es: "Volver al inicio de sesión", en: "Back to log in" },
  "reset-password.error.passwords-mismatch": { es: "Las contraseñas no coinciden.", en: "Passwords do not match." },
  "reset-password.error.invalid-token": { es: "El link de recuperación es inválido o ha expirado.", en: "The reset link is invalid or has expired." },
  "reset-password.error.generic": { es: "Ocurrió un error. Por favor, intenta de nuevo.", en: "An error occurred. Please try again." },
  "reset-password.success.title": { es: "¡Contraseña actualizada!", en: "Password updated!" },
  "reset-password.success.description": { es: "Tu contraseña ha sido actualizada exitosamente. Ya podés iniciar sesión con tu nueva contraseña.", en: "Your password has been updated successfully. You can now log in with your new password." },

  // Password reset email
  "email.password-reset.subject": { es: "Recuperá tu contraseña", en: "Reset your password" },
  "email.password-reset.body": { es: "Hacé clic en el siguiente enlace para restablecer tu contraseña:", en: "Click the following link to reset your password:" },

  // Connect wallet banner
  "wallet.banner.close": { es: "Cerrar", en: "Close" },
  "wallet.banner.title.idle": { es: "Vinculá tu billetera", en: "Link your wallet" },
  "wallet.banner.title.done": { es: "Billetera vinculada", en: "Wallet linked" },
  "wallet.banner.description.idle": { es: "Para participar en avales necesitás vincular una billetera. No tiene costo, solo tenés que firmar un mensaje.", en: "To participate in avales you need to link a wallet. It's free, you just need to sign a message." },
  "wallet.banner.description.done": { es: "Tu billetera fue asociada exitosamente a tu cuenta.", en: "Your wallet was successfully linked to your account." },
  "wallet.banner.step.idle": { es: "Conectar billetera", en: "Connect wallet" },
  "wallet.banner.step.connecting": { es: "Conectando...", en: "Connecting..." },
  "wallet.banner.step.signing": { es: "Firmá el mensaje en tu billetera...", en: "Sign the message in your wallet..." },
  "wallet.banner.step.saving": { es: "Guardando...", en: "Saving..." },
  "wallet.banner.step.done": { es: "¡Billetera vinculada!", en: "Wallet linked!" },
  "wallet.banner.step.error": { es: "Reintentar", en: "Try again" },
  "wallet.banner.error.connect": { es: "No se pudo conectar la billetera", en: "Could not connect wallet" },
  "wallet.banner.error.save": { es: "Error al guardar la billetera", en: "Error saving wallet" },
  "wallet.banner.error.generic": { es: "Ocurrió un error", en: "An error occurred" },

  "user.profile": { es: "Perfil de Usuario", en: "User Profile" },
  "profile.avatar.upload-text": { es: "Subir Avatar", en: "Upload Avatar" },
  "profile.avatar.change-text": { es: "Cambiar Avatar", en: "Change Avatar" },
  "profile.avatar.alt": { es: "Avatar", en: "Avatar" },

  "profile.fields.name": { es: "Nombre", en: "Name" },
  "profile.fields.email": { es: "Correo electrónico", en: "Email" },
  "profile.fields.website": { es: "Sitio web", en: "Website" },
  "profile.save": { es: "Guardar cambios", en: "Save changes"}
}
