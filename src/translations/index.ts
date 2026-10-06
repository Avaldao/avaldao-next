export interface Translations {
  [key: string]: {
    es: string;
    en: string;
  };
}

export type { Language } from './locales';

export const translations: Translations = {
  'meta.home.title': {
    es: 'AvalDAO - SGR Descentralizada',
    en: 'AvalDAO - Decentralized Guarantee Society'
  },
  'meta.home.description': {
    es: 'Accedé a garantías onchain para crédito comercial con AvalDAO, una SGR descentralizada para personas y microempresas.',
    en: 'Access onchain guarantees for commercial credit with AvalDAO, a decentralized mutual guarantee society for individuals and micro-businesses.'
  },
  'meta.home.og-description': {
    es: 'SGR descentralizada con garantías onchain para ampliar el acceso al financiamiento.',
    en: 'Decentralized guarantee society with onchain guarantees to expand access to financing.'
  },
  'meta.invest.title': {
    es: 'Invertir',
    en: 'Invest'
  },
  'meta.invest.description': {
    es: 'La funcionalidad de inversión en AvalDAO está en desarrollo. Estamos actualizando los smart contracts para soportarla.',
    en: 'The investment feature in AvalDAO is in development. We are updating the smart contracts to support it.'
  },
  'a11y.skip-to-content': {
    es: 'Saltar al contenido principal',
    en: 'Skip to main content'
  },
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
  "nav.how": {
    es: 'Cómo funciona',
    en: 'How it works'
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
  "nav.menu.open": {
    es: 'Abrir menú',
    en: 'Open menu'
  },
  "nav.menu.close": {
    es: 'Cerrar menú',
    en: 'Close menu'
  },
  "nav.login": {
    es: 'Iniciar sesión',
    en: 'Log in'
  },
  "nav.signup": {
    es: 'Registrarse',
    en: 'Sign up'
  },

  // ── Landing: hero ──
  "hero.eyebrow": {
    es: 'Sociedad de Garantía Recíproca descentralizada',
    en: 'Decentralized Reciprocal Guarantee Society'
  },
  "hero.title": {
    es: 'Garantías para comprar en cuotas, respaldadas por un fondo verificable en blockchain',
    en: 'Guarantees for installment purchases, backed by a fund you can verify on the blockchain'
  },
  "hero.description": {
    es: 'AvalDAO avala a personas y microempresas sin historial crediticio para que los comercios puedan venderles en cuotas. Si una cuota no se paga, el comercio cobra desde el fondo de garantía.',
    en: 'AvalDAO backs individuals and microbusinesses without a credit history so merchants can sell to them in installments. If an installment goes unpaid, the merchant gets paid from the guarantee fund.'
  },
  "hero.cta.request": {
    es: 'Solicitar un aval',
    en: 'Request a guarantee'
  },
  "hero.cta.merchant": {
    es: 'Soy comercio',
    en: 'I am a merchant'
  },
  "hero.cta.how": {
    es: 'Ver cómo funciona',
    en: 'See how it works'
  },
  "hero.fund.label": {
    es: 'Fondo de garantía disponible',
    en: 'Available guarantee fund'
  },
  "hero.fund.live": {
    es: 'En vivo',
    en: 'Live'
  },
  "hero.fund.verify": {
    es: 'Verificalo en el explorador',
    en: 'Verify it on the explorer'
  },

  // ── Landing: qué es ──
  "about.eyebrow": {
    es: 'Qué es AvalDAO',
    en: 'What is AvalDAO'
  },
  "about.title": {
    es: 'Crédito para quien no tiene historial, sin riesgo de impago para quien vende',
    en: 'Credit for people without a history, with no default risk for the seller'
  },
  "about.problem.title": {
    es: 'El problema',
    en: 'The problem'
  },
  "about.problem.description": {
    es: 'Muchas personas y microempresas no pueden comprar en cuotas porque no tienen historial bancario. Y los comercios no les venden a crédito porque no tienen cómo cubrirse si no pagan.',
    en: 'Many individuals and microbusinesses can\'t buy in installments because they have no banking history. And merchants won\'t sell to them on credit because they have no way to cover themselves if they don\'t pay.'
  },
  "about.solution.title": {
    es: 'La solución',
    en: 'The solution'
  },
  "about.solution.description": {
    es: 'AvalDAO emite un aval que respalda cada cuota con dinero real del fondo de garantía. Ese dinero queda reservado en un smart contract mientras el aval está vigente, así el comercio sabe que va a cobrar.',
    en: 'AvalDAO issues a guarantee that backs each installment with real money from the guarantee fund. That money stays reserved in a smart contract while the guarantee is active, so the merchant knows they will get paid.'
  },
  "about.pillar.reserved.title": {
    es: 'Fondos reservados por aval',
    en: 'Funds reserved per guarantee'
  },
  "about.pillar.reserved.description": {
    es: 'Al firmarse el aval, el monto total se transfiere del fondo al contrato de ese aval. No es una promesa: es dinero apartado.',
    en: 'When the guarantee is signed, the full amount moves from the fund to that guarantee\'s contract. It\'s not a promise: it\'s money set aside.'
  },
  "about.pillar.rules.title": {
    es: 'Reglas en smart contracts',
    en: 'Rules in smart contracts'
  },
  "about.pillar.rules.description": {
    es: 'Las cuotas, sus fechas y quién puede reclamar o liberar fondos quedan escritos en el contrato y firmados por todas las partes.',
    en: 'Installments, their dates, and who can claim or release funds are written into the contract and signed by every party.'
  },
  "about.pillar.verifiable.title": {
    es: 'Todo verificable onchain',
    en: 'Everything verifiable onchain'
  },
  "about.pillar.verifiable.description": {
    es: 'El saldo del fondo y el estado de cada aval son públicos en la red Rootstock. Cualquiera puede auditarlos.',
    en: 'The fund balance and the status of every guarantee are public on the Rootstock network. Anyone can audit them.'
  },

  // ── Landing: cómo funciona ──
  "how.eyebrow": {
    es: 'Cómo funciona',
    en: 'How it works'
  },
  "how.title": {
    es: 'De la solicitud al cobro garantizado, en 5 pasos',
    en: 'From request to guaranteed payment, in 5 steps'
  },
  "how.description": {
    es: 'Cada aval reúne a cuatro participantes: AvalDAO, el solicitante, el avalado y el comercio. Así es su recorrido.',
    en: 'Every guarantee brings together four participants: AvalDAO, the applicant, the guaranteed party, and the merchant. This is how it works.'
  },
  "how.step1.role": {
    es: 'Solicitante',
    en: 'Applicant'
  },
  "how.step1.title": {
    es: 'Solicitud',
    en: 'Request'
  },
  "how.step1.description": {
    es: 'El solicitante presenta al avalado, la compra que quiere financiar y el plan de cuotas.',
    en: 'The applicant presents the guaranteed party, the purchase to finance, and the installment plan.'
  },
  "how.step2.role": {
    es: 'AvalDAO',
    en: 'AvalDAO'
  },
  "how.step2.title": {
    es: 'Evaluación',
    en: 'Review'
  },
  "how.step2.description": {
    es: 'AvalDAO revisa el caso y, si lo acepta, crea el contrato del aval en blockchain.',
    en: 'AvalDAO reviews the case and, if accepted, creates the guarantee\'s contract on the blockchain.'
  },
  "how.step3.role": {
    es: 'Todos',
    en: 'Everyone'
  },
  "how.step3.title": {
    es: 'Firma y reserva de fondos',
    en: 'Signing and funds reserved'
  },
  "how.step3.description": {
    es: 'Los cuatro participantes firman los términos. En ese momento el monto total queda reservado en el contrato del aval y el aval pasa a estar vigente.',
    en: 'All four participants sign the terms. At that moment the full amount is reserved in the guarantee\'s contract and the guarantee becomes active.'
  },
  "how.step4.role": {
    es: 'Avalado',
    en: 'Guaranteed party'
  },
  "how.step4.title": {
    es: 'Pago de cuotas',
    en: 'Paying installments'
  },
  "how.step4.description": {
    es: 'El avalado recibe el bien o servicio y paga sus cuotas al comercio. Cada cuota cumplida se libera y su dinero vuelve al fondo para respaldar a otra persona.',
    en: 'The guaranteed party receives the good or service and pays the merchant. Each installment paid is released and its money returns to the fund to back someone else.'
  },
  "how.step5.role": {
    es: 'Comercio',
    en: 'Merchant'
  },
  "how.step5.title": {
    es: 'Si una cuota no se paga',
    en: 'If an installment goes unpaid'
  },
  "how.step5.description": {
    es: 'Pasado el vencimiento, el comercio abre un reclamo y recibe el pago de esa cuota desde los fondos reservados del aval.',
    en: 'After the due date, the merchant opens a claim and receives that installment\'s payment from the guarantee\'s reserved funds.'
  },
  "how.cuota.title": {
    es: 'La vida de una cuota',
    en: 'The life of an installment'
  },
  "how.cuota.description": {
    es: 'Cada cuota tiene dos fechas clave que definen cuándo puede reclamar el comercio y cuándo se da por pagada.',
    en: 'Each installment has two key dates that define when the merchant can claim and when it is considered paid.'
  },
  "how.cuota.reserved": {
    es: 'Fondos reservados',
    en: 'Funds reserved'
  },
  "how.cuota.reserved.description": {
    es: 'El dinero de la cuota está apartado en el contrato del aval.',
    en: 'The installment\'s money is set aside in the guarantee\'s contract.'
  },
  "how.cuota.due": {
    es: 'Fecha de vencimiento',
    en: 'Due date'
  },
  "how.cuota.due.description": {
    es: 'Desde acá, si el avalado no pagó, el comercio puede abrir un reclamo.',
    en: 'From here on, if the guaranteed party hasn\'t paid, the merchant can open a claim.'
  },
  "how.cuota.unlock": {
    es: 'Fecha de desbloqueo',
    en: 'Release date'
  },
  "how.cuota.unlock.description": {
    es: 'Si no hubo reclamo, la cuota se considera pagada y su dinero vuelve al fondo.',
    en: 'If there was no claim, the installment is considered paid and its money returns to the fund.'
  },
  "how.cuota.claim-window": {
    es: 'Ventana de reclamo',
    en: 'Claim window'
  },

  // ── Landing: transparencia ──
  "dashboard.eyebrow": {
    es: 'Transparencia en vivo',
    en: 'Live transparency'
  },
  "dashboard.title": {
    es: 'No te pedimos que confíes: verificalo',
    en: 'Don\'t take our word for it: verify it'
  },
  "dashboard.description": {
    es: 'El fondo de garantía y cada aval viven en contratos públicos de Rootstock. Estos números salen directamente de la blockchain.',
    en: 'The guarantee fund and every guarantee live in public Rootstock contracts. These figures come straight from the blockchain.'
  },
  "dashboard.metrics.vigentes": {
    es: 'Avales vigentes',
    en: 'Active guarantees'
  },
  "dashboard.metrics.finalizados": {
    es: 'Avales finalizados',
    en: 'Completed guarantees'
  },
  "dashboard.metrics.cuotas": {
    es: 'Cuotas respaldadas',
    en: 'Installments backed'
  },
  "dashboard.metrics.monto": {
    es: 'Monto total avalado (USD)',
    en: 'Total amount guaranteed (USD)'
  },
  "dashboard.metrics.updated": {
    es: 'Datos onchain actualizados el',
    en: 'Onchain data updated on'
  },
  "dashboard.guarantee-fund.title": {
    es: 'Fondo de Garantía',
    en: 'Guarantee Fund'
  },
  "dashboard.guarantee-fund.clarification": {
    es: '* Expresado en DOC, stablecoin equivalente al dólar',
    en: '* Expressed in DOC, a dollar-pegged stablecoin'
  },
  "dashboard.guarantee-fund.see-contract": {
    es: 'Ver contrato AvalDAO en el explorador',
    en: 'See the AvalDAO contract on the explorer'
  },

  // ── Landing: audiencias ──
  "audiences.eyebrow": {
    es: '¿Quién sos?',
    en: 'Who are you?'
  },
  "audiences.title": {
    es: 'Un lugar para cada participante',
    en: 'A place for every participant'
  },
  "audiences.description": {
    es: 'AvalDAO funciona porque cada parte gana algo concreto. Encontrá la tuya.',
    en: 'AvalDAO works because every party gains something concrete. Find yours.'
  },
  "audiences.gain": {
    es: 'Qué ganás',
    en: 'What you gain'
  },
  "audiences.do": {
    es: 'Qué hacés',
    en: 'What you do'
  },
  "audiences.merchant.title": {
    es: 'Comercio',
    en: 'Merchant'
  },
  "audiences.merchant.gain": {
    es: 'Vendé en cuotas a clientes nuevos sin asumir el riesgo de impago.',
    en: 'Sell in installments to new customers without taking on default risk.'
  },
  "audiences.merchant.do": {
    es: 'Firmás el aval y, si una cuota vencida no se paga, abrís un reclamo para cobrarla desde el fondo.',
    en: 'You sign the guarantee and, if an overdue installment isn\'t paid, you open a claim to collect it from the fund.'
  },
  "audiences.merchant.cta": {
    es: 'Crear cuenta de comercio',
    en: 'Create a merchant account'
  },
  "audiences.applicant.title": {
    es: 'Solicitante u organización',
    en: 'Applicant or organization'
  },
  "audiences.applicant.gain": {
    es: 'Acompañá a emprendedores de tu red y conseguiles acceso a crédito.',
    en: 'Support entrepreneurs in your network and get them access to credit.'
  },
  "audiences.applicant.do": {
    es: 'Presentás el caso, seguís el aval y liberás cada cuota cuando el avalado la paga.',
    en: 'You present the case, follow the guarantee, and release each installment once it is paid.'
  },
  "audiences.applicant.cta": {
    es: 'Solicitar un aval',
    en: 'Request a guarantee'
  },
  "audiences.guaranteed.title": {
    es: 'Avalado',
    en: 'Guaranteed party'
  },
  "audiences.guaranteed.gain": {
    es: 'Accedé a crédito sin historial bancario y construí tu reputación pagando a tiempo.',
    en: 'Access credit without a banking history and build your reputation by paying on time.'
  },
  "audiences.guaranteed.do": {
    es: 'Firmás el aval y pagás tus cuotas al comercio según el plan acordado.',
    en: 'You sign the guarantee and pay the merchant according to the agreed plan.'
  },
  "audiences.guaranteed.cta": {
    es: 'Crear mi cuenta',
    en: 'Create my account'
  },
  "audiences.contributor.title": {
    es: 'Aportante al fondo',
    en: 'Fund contributor'
  },
  "audiences.contributor.gain": {
    es: 'Tu aporte respalda varias garantías y vuelve al fondo cada vez que se paga una cuota.',
    en: 'Your contribution backs several guarantees and returns to the fund every time an installment is paid.'
  },
  "audiences.contributor.do": {
    es: 'Hoy los aportes son voluntarios y sin retorno económico. La inversión con rendimiento está en desarrollo.',
    en: 'Today contributions are voluntary and have no financial return. Investing with yield is in development.'
  },
  "audiences.contributor.cta": {
    es: 'Inversión: próximamente',
    en: 'Investing: coming soon'
  },

  // ── Landing: preguntas frecuentes ──
  "faq.eyebrow": {
    es: 'Preguntas frecuentes',
    en: 'Frequently asked questions'
  },
  "faq.title": {
    es: 'Lo que necesitás saber antes de empezar',
    en: 'What you need to know before you start'
  },
  "faq.description": {
    es: 'Las dudas más comunes sobre cómo funcionan los avales, el fondo y la tecnología detrás de AvalDAO.',
    en: 'The most common questions about how guarantees, the fund, and the technology behind AvalDAO work.'
  },
  "faq.item1.question": {
    es: '¿Qué es un aval de AvalDAO?',
    en: 'What is an AvalDAO guarantee?'
  },
  "faq.item1.answer": {
    es: 'Es una garantía que respalda una compra en cuotas. El monto total se reserva en un smart contract y, si una cuota no se paga, el comercio la cobra desde esos fondos.',
    en: 'It\'s a guarantee that backs an installment purchase. The full amount is reserved in a smart contract and, if an installment isn\'t paid, the merchant collects it from those funds.'
  },
  "faq.item2.question": {
    es: '¿Quién puede solicitar un aval?',
    en: 'Who can request a guarantee?'
  },
  "faq.item2.answer": {
    es: 'Lo inicia un solicitante, como una organización, tutor o referente, que presenta al avalado y la compra a financiar. AvalDAO evalúa el caso y decide si lo acepta.',
    en: 'It\'s started by an applicant, such as an organization, tutor, or sponsor, who presents the guaranteed party and the purchase to finance. AvalDAO reviews the case and decides whether to accept it.'
  },
  "faq.item3.question": {
    es: '¿Necesito una wallet o saber de cripto?',
    en: 'Do I need a wallet or crypto knowledge?'
  },
  "faq.item3.answer": {
    es: 'Para participar de un aval necesitás una dirección de wallet, porque es la forma en que firmás los términos y quedás registrado en el contrato. No hace falta tener experiencia previa: podés crear tu cuenta y conectar tu wallet desde la plataforma.',
    en: 'To take part in a guarantee you need a wallet address, since that\'s how you sign the terms and get registered in the contract. No prior experience is required: you can create your account and connect your wallet from the platform.'
  },
  "faq.item4.question": {
    es: '¿Qué pasa si el avalado no puede pagar una cuota?',
    en: 'What happens if the guaranteed party can\'t pay an installment?'
  },
  "faq.item4.answer": {
    es: 'Una vez pasada la fecha de vencimiento, el comercio abre un reclamo y recibe el pago de esa cuota desde los fondos reservados en el contrato del aval.',
    en: 'Once the due date has passed, the merchant opens a claim and receives that installment\'s payment from the funds reserved in the guarantee\'s contract.'
  },
  "faq.item5.question": {
    es: '¿En qué moneda se respaldan los avales?',
    en: 'What currency backs the guarantees?'
  },
  "faq.item5.answer": {
    es: 'En DOC (Dollar on Chain), una stablecoin equivalente al dólar de la red Rootstock. Los montos de los avales se expresan en dólares.',
    en: 'In DOC (Dollar on Chain), a dollar-pegged stablecoin on the Rootstock network. Guarantee amounts are expressed in US dollars.'
  },
  "faq.item6.question": {
    es: '¿Qué pasa con los fondos cuando se pagan todas las cuotas?',
    en: 'What happens to the funds once every installment is paid?'
  },
  "faq.item6.answer": {
    es: 'Cada cuota cumplida se libera y su dinero vuelve al fondo de garantía, donde queda disponible para respaldar nuevos avales. Cuando no quedan cuotas pendientes, el aval pasa a estado finalizado.',
    en: 'Each installment paid is released and its money returns to the guarantee fund, where it becomes available to back new guarantees. When no installments remain, the guarantee is marked as completed.'
  },
  "faq.item7.question": {
    es: '¿Cómo sé que mi aval es real y está respaldado?',
    en: 'How do I know my guarantee is real and backed?'
  },
  "faq.item7.answer": {
    es: 'Cada aval tiene su propio contrato en Rootstock y sus términos quedan firmados por las cuatro partes. Podés consultar en el explorador el contrato, sus cuotas y los fondos reservados.',
    en: 'Every guarantee has its own contract on Rootstock and its terms are signed by all four parties. You can check the contract, its installments, and the reserved funds on the explorer.'
  },

  // ── Landing: roadmap ──
  "timeline.eyebrow": {
    es: 'Evolución del proyecto',
    en: 'Project evolution'
  },
  "timeline.title": {
    es: 'Roadmap del fondo de garantía',
    en: 'Guarantee fund roadmap'
  },
  "timeline.description": {
    es: 'Hoy el fondo se sostiene con aportes voluntarios. El próximo salto es habilitar la participación de inversores con contratos inteligentes y rendimiento transparente.',
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
    es: 'Quienes aportan capital lo hacen por voluntad propia para fortalecer la cobertura de garantías, sin retorno económico directo.',
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
    es: 'Estamos diseñando contratos para administrar aportes, reglas de riesgo y distribución de resultados de manera automatizada y auditable.',
    en: 'We are designing contracts to manage contributions, risk rules, and result distribution in an automated and auditable way.'
  },
  "timeline.phase.future": {
    es: 'Visión futura',
    en: 'Future vision'
  },
  "timeline.future.title": {
    es: 'Inversores con rendimiento',
    en: 'Yield for investors'
  },
  "timeline.future.description": {
    es: 'La meta es que los inversores participen del fondo y obtengan un rendimiento sostenible, alineado al desempeño real de las garantías.',
    en: 'The goal is for investors to participate in the fund and earn sustainable yield aligned with the real performance of guarantees.'
  },

  // ── Landing: CTA final ──
  "final-cta.title": {
    es: '¿Listo para dar el primer paso?',
    en: 'Ready to take the first step?'
  },
  "final-cta.description": {
    es: 'Creá tu cuenta, conectá tu wallet y empezá a solicitar o recibir avales respaldados por el fondo de garantía.',
    en: 'Create your account, connect your wallet, and start requesting or receiving guarantees backed by the guarantee fund.'
  },
  "final-cta.signup": {
    es: 'Crear cuenta',
    en: 'Create account'
  },
  "final-cta.request": {
    es: 'Solicitar un aval',
    en: 'Request a guarantee'
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
  "signup.form.wallet.connect": { es: 'Conectar wallet', en: 'Connect wallet' },
  "signup.form.wallet.helper": { es: 'También podés crear tu cuenta sin wallet y asociarla más adelante.', en: 'You can also create your account without a wallet and link it later.' },
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
  "signup.form.error.address-registered": { es: 'Esta dirección de wallet ya está registrada. Probá con otra wallet.', en: 'This wallet address is already registered. Try another wallet.' },
  "signup.form.wallet.try-another": { es: 'Probar con otra wallet', en: 'Try another wallet' },

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
  "aval.actions.missing-info-cid": { es: "Este aval todavía no tiene su información publicada en IPFS (infoCid).", en: "This aval does not have its information published on IPFS yet (infoCid)." },
  "aval.actions.missing-info-cid.title": { es: "Información del aval no publicada", en: "Aval information not published" },
  "aval.actions.missing-info-cid.description": { es: "No se pudo publicar el JSON del aval en IPFS, así que no hay términos comprometidos por la firma. Hasta resolverlo, el aval no puede aceptarse ni firmarse.", en: "The aval JSON could not be published to IPFS, so there are no terms committed by the signature. Until this is fixed, the aval cannot be accepted or signed." },
  "aval.actions.repin": { es: "Reintentar publicación en IPFS", en: "Retry IPFS publication" },
  "aval.actions.repin.success": { es: "Información del aval publicada en IPFS.", en: "Aval information published to IPFS." },
  "aval.actions.repin.error": { es: "No se pudo publicar la información en IPFS.", en: "Could not publish the information to IPFS." },

  // Términos y condiciones mostrados al firmar
  "sign.terms.label": { es: "Términos que estás firmando", en: "Terms you are signing" },
  "sign.terms.cid": { es: "CID del documento (infoCid)", en: "Document CID (infoCid)" },
  "sign.terms.accept": { es: "Leí y acepto estos términos y condiciones.", en: "I have read and accept these terms and conditions." },
  "aval.sign.terms.not-committed": { es: "Atención: este aval fue creado antes de que los términos se incluyeran en el documento de IPFS. El texto que ves se generó localmente y no está comprometido por el infoCid que vas a firmar.", en: "Warning: this aval was created before terms were included in the IPFS document. The text shown was generated locally and is not committed by the infoCid you are about to sign." },

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
  "profile.save": { es: "Guardar cambios", en: "Save changes" },

  "challenge.message.body": {
    "es": "Firma este mensaje para verificar tu billetera en AvalDAO.\n\nEsta firma no genera costos ni transacciones.\n\nNonce: {{nonce}}\nExpira: {{expiry}}",
    "en": "Sign this message to verify your wallet on AvalDAO.\n\nThis signature does not create a transaction or incur gas fees.\n\nNonce: {{nonce}}\nExpires: {{expiry}}"
  }
}
