import { getSetting, getSettings, setSetting } from "./settings";
import type { Locale } from "./i18n";

/**
 * Localised content blocks.
 *
 * Every long-form marketing block lives in the `Setting` table so the admin
 * dashboard can edit it, with an English original and an optional German
 * translation that falls back to English.
 */

export type Localized = { en: string; de: string };

export function pick(value: Localized | null | undefined, locale: Locale): string {
  if (!value) return "";
  return (locale === "de" && value.de ? value.de : value.en) || "";
}

export type Credential = {
  name: string;
  issuer: string;
  reference?: string;
  note?: string;
};

export type StatItem = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: Localized;
};

export type WhyItem = { title: Localized; desc: Localized };
export type StepItem = { title: Localized; desc: Localized };

/* -------------------------------------------------------------------------- */
/* Defaults — written by prisma/seed.ts, editable in the dashboard             */
/* -------------------------------------------------------------------------- */

export const DEFAULT_SETTINGS = {
  site: {
    name: "Meridian Global Exports",
    domain: "",
    description:
      "Pakistan-based bulk export supplier serving wholesalers, importers, distributors and retailers in the United Kingdom and Germany.",
    defaultCurrency: "GBP",
  },

  company: {
    name: "Meridian Global Exports",
    tagline: {
      en: "Bulk export sourcing · United Kingdom & Germany",
      de: "Großhandels-Beschaffung · Großbritannien & Deutschland",
    } as Localized,
    address: "",
    phone: "",
    whatsapp: "",
    email: "sales@meridian.example",
    hours: { en: "", de: "" } as Localized,
    linkedin: "",
    x: "",
    instagram: "",
    facebook: "",
  },

  hero: {
    title: {
      en: "Your Trusted Partner for Bulk Exports to the UK & Germany",
      de: "Ihr zuverlässiger Partner für Großexporte nach Großbritannien & Deutschland",
    } as Localized,
    subtitle: {
      en: "Reliable sourcing, competitive wholesale pricing, and international supply solutions for businesses worldwide.",
      de: "Zuverlässige Beschaffung, wettbewerbsfähige Großhandelspreise und internationale Lieferlösungen für Unternehmen weltweit.",
    } as Localized,
    image: "/images/hero-logistics.jpg",
    note: {
      en: "Serving importers, wholesalers, distributors and retailers",
      de: "Für Importeure, Großhändler, Distributoren und Einzelhändler",
    } as Localized,
  },

  overview: {
    title: {
      en: "Sourcing in Pakistan, supplying businesses in the UK & Germany",
      de: "Beschaffung in Pakistan, Lieferung nach Großbritannien & Deutschland",
    } as Localized,
    p1: {
      en: "Meridian Global Exports is a Pakistan-based export company built around one objective: giving professional buyers a dependable source for bulk goods. We coordinate sourcing with manufacturers and growers, check specifications before dispatch and prepare the export documents your order requires.",
      de: "Meridian Global Exports ist ein pakistanisches Exportunternehmen mit einem klaren Ziel: professionellen Einkäufern eine zuverlässige Quelle für Waren in großen Mengen zu bieten. Wir koordinieren die Beschaffung mit Herstellern und Erzeugern, prüfen die Spezifikationen vor dem Versand und bereiten die für Ihren Auftrag erforderlichen Exportunterlagen vor.",
    } as Localized,
    p2: {
      en: "Whether you are placing a first container or replenishing stock every month, you deal with one point of contact, a written quotation and a documented process from inquiry to shipment.",
      de: "Ob Erstbestellung eines kompletten Containers oder monatliche Nachlieferung: Sie haben einen festen Ansprechpartner, ein schriftliches Angebot und einen dokumentierten Ablauf von der Anfrage bis zum Versand.",
    } as Localized,
    image: "/images/overview-warehouse.jpg",
    points: [
      { en: "Product sourcing and supplier coordination", de: "Produktbeschaffung und Lieferantenkoordination" },
      { en: "Specification and quality checks before dispatch", de: "Prüfung von Spezifikation und Qualität vor dem Versand" },
      { en: "Export documentation prepared to order requirements", de: "Exportdokumente gemäß den Anforderungen Ihres Auftrags" },
      { en: "Flexible packing, labelling and private label options", de: "Flexible Verpackung, Kennzeichnung und Private-Label-Optionen" },
      { en: "Sea, air and courier shipment coordination", de: "Koordination von See-, Luft- und Kuriertransporten" },
      { en: "Clear written quotations in GBP or EUR", de: "Klare schriftliche Angebote in GBP oder EUR" },
    ] as Localized[],
    qualityImage: "/images/quality-inspection.jpg",
    qualityTitle: {
      en: "Quality assurance built into the order process",
      de: "Qualitätssicherung als fester Bestandteil des Auftragsprozesses",
    } as Localized,
    qualityBody: {
      en: "Specifications are agreed in writing before production or packing. Samples can be approved before dispatch, packing is checked against the order, and inspection — in-house or by an independent party — can be arranged when your purchase requires it.",
      de: "Die Spezifikationen werden vor Fertigung oder Verpackung schriftlich vereinbart. Muster können vor dem Versand freigegeben werden, die Verpackung wird gegen den Auftrag geprüft und eine Inspektion – intern oder durch eine unabhängige Stelle – kann gemäß Ihren Einkaufsanforderungen veranlasst werden.",
    } as Localized,
  },

  whyChoose: {
    title: { en: "Why buyers choose us", de: "Warum Einkäufer uns wählen" } as Localized,
    subtitle: {
      en: "Practical capabilities that make bulk purchasing predictable.",
      de: "Praktische Fähigkeiten, die den Einkauf in großen Mengen berechenbar machen.",
    } as Localized,
    items: [
      {
        title: { en: "Competitive bulk pricing", de: "Wettbewerbsfähige Großhandelspreise" },
        desc: {
          en: "Wholesale pricing is quoted per order against your volume, specification and destination — negotiated directly, with no platform fees.",
          de: "Großhandelspreise werden pro Auftrag auf Basis von Menge, Spezifikation und Zielmarkt kalkuliert – direkt verhandelt, ohne Plattformgebühren.",
        },
      },
      {
        title: { en: "Quality control & inspection", de: "Qualitätskontrolle & Inspektion" },
        desc: {
          en: "Specifications are confirmed before production, and inspection options — including independent pre-shipment inspection — can be agreed per order.",
          de: "Die Spezifikationen werden vor der Produktion bestätigt; Inspektionsoptionen – einschließlich unabhängiger Versandvor-Inspektion – können pro Auftrag vereinbart werden.",
        },
      },
      {
        title: { en: "Reliable export documentation", de: "Zuverlässige Exportdokumente" },
        desc: {
          en: "Commercial invoice, packing list, origin and shipping documents are prepared to your order's requirements and shared before dispatch.",
          de: "Handelsrechnung, Packliste, Ursprungs- und Versanddokumente werden gemäß den Anforderungen Ihres Auftrags erstellt und vor dem Versand bereitgestellt.",
        },
      },
      {
        title: { en: "Flexible packaging & customisation", de: "Flexible Verpackung & Anpassung" },
        desc: {
          en: "Export cartons, retail packs, labelling and private-label options are arranged to match your market and channel.",
          de: "Exportkartons, Einzelhandelsverpackungen, Kennzeichnung und Private-Label-Optionen werden auf Ihren Markt und Ihre Kanäle abgestimmt.",
        },
      },
      {
        title: { en: "International shipping coordination", de: "Koordination des internationalen Transports" },
        desc: {
          en: "We coordinate with freight forwarders across sea, air and courier services and keep you updated on shipment status.",
          de: "Wir arbeiten mit Frachtspediteuren für See-, Luft- und Kuriertransporte zusammen und halten Sie über den Sendungsstatus auf dem Laufenden.",
        },
      },
      {
        title: { en: "Responsive communication", de: "Zügige Kommunikation" },
        desc: {
          en: "One point of contact handles your inquiry, quotation, production updates and documents — in clear business English.",
          de: "Ein Ansprechpartner betreut Ihre Anfrage, Ihr Angebot, Produktionsupdates und Dokumente – in klarem Business-Englisch.",
        },
      },
      {
        title: { en: "Long-term wholesale partnerships", de: "Langfristige Großhandelspartnerschaften" },
        desc: {
          en: "Consistent specifications, repeat-order pricing and documented processes are set up for ongoing supply, not one-off deals.",
          de: "Konsistente Spezifikationen, Nachbestellungspreise und dokumentierte Abläufe sind auf dauerhafte Belieferung ausgelegt – nicht auf Einmalgeschäfte.",
        },
      },
    ] as WhyItem[],
  },

  howItWorks: {
    title: { en: "How bulk ordering works", de: "So funktioniert die Großbestellung" } as Localized,
    subtitle: {
      en: "Six steps from first look to shipment documents.",
      de: "Sechs Schritte vom ersten Blick bis zu den Versanddokumenten.",
    } as Localized,
    steps: [
      {
        title: { en: "Browse products", de: "Produkte durchsuchen" },
        desc: { en: "Review specifications, packaging options and MOQs in the catalogue.", de: "Prüfen Sie Spezifikationen, Verpackungsoptionen und Mindestbestellmengen im Katalog." },
      },
      {
        title: { en: "Submit a bulk inquiry", de: "Großanfrage senden" },
        desc: { en: "Add one or several products to a single inquiry with your quantities and destination.", de: "Fügen Sie ein oder mehrere Produkte mit Mengen und Zielort zu einer Anfrage hinzu." },
      },
      {
        title: { en: "Receive a quotation", de: "Angebot erhalten" },
        desc: { en: "We respond with pricing, packing, lead time and commercial terms in writing.", de: "Sie erhalten Preis, Verpackung, Lieferzeit und Konditionen schriftlich." },
      },
      {
        title: { en: "Confirm specifications & terms", de: "Spezifikationen & Konditionen bestätigen" },
        desc: { en: "Samples, specification, Incoterms and payment terms are agreed before any commitment.", de: "Muster, Spezifikation, Incoterms und Zahlungsbedingungen werden vor jeder Bindung vereinbart." },
      },
      {
        title: { en: "Production or sourcing", de: "Produktion oder Beschaffung" },
        desc: { en: "Your order is produced or prepared, with updates at agreed milestones.", de: "Ihr Auftrag wird produziert oder vorbereitet, mit Updates zu vereinbarten Meilensteinen." },
      },
      {
        title: { en: "Shipping & documentation", de: "Versand & Dokumente" },
        desc: { en: "We coordinate the shipment and hand over the export documents for your clearance.", de: "Wir koordinieren den Transport und übergeben die Exportunterlagen für Ihren Zollabwicklung." },
      },
    ] as StepItem[],
  },

  /** Business figures the company can verify. Empty by default — the site
   *  never invents experience numbers or credentials. */
  stats: { items: [] as StatItem[] },

  /** Verifiable certifications / company documentation, listed only when the
   *  administrator has entered them. */
  credentials: { items: [] as Credential[] },

  pages: {
    uk: {
      heroTitle: {
        en: "Bulk supply for United Kingdom importers, wholesalers & retailers",
        de: "Großlieferungen für Importeure, Großhändler & Einzelhändler im Vereinigten Königreich",
      } as Localized,
      heroBody: {
        en: "We supply UK-registered businesses with export-ready goods, written GBP quotations and the documentation needed for UK import — from first samples to recurring container orders.",
        de: "Wir beliefern im Vereinigten Königreich registrierte Unternehmen mit exportfertigen Waren, schriftlichen Angeboten in GBP und den für den britischen Import erforderlichen Dokumenten – von ersten Mustern bis zu wiederkehrenden Containeraufträgen.",
      } as Localized,
      servingTitle: { en: "Who we serve", de: "Wen wir beliefern" } as Localized,
      servingBody: {
        en: "Importers consolidating mixed loads, national wholesalers, distributors serving regional retail, independent retailers and e-commerce brands buying own-label or unbranded stock in volume. Orders are quoted per shipment so your buying team can compare landed options on the same basis.",
        de: "Importeure mit gemischten Ladungen, nationale Großhändler, Distributoren für den regionalen Handel, unabhängige Einzelhändler und E-Commerce-Marken, die Eigen- oder Unmarkenware in großen Mengen einkaufen. Angebote erfolgen pro Sendung, damit Ihr Einkaufsteam eingeladene Optionen auf derselben Basis vergleichen kann.",
      } as Localized,
      howTitle: { en: "How we work with UK buyers", de: "So arbeiten wir mit britischen Einkäufern" } as Localized,
      howPoints: [
        { en: "Quotations in GBP with packing, MOQ and lead time stated on the same document.", de: "Angebote in GBP mit Verpackung, Mindestbestellmenge und Lieferzeit auf demselben Dokument." },
        { en: "Delivery addresses across the UK, including postcode-verified routing details.", de: "Lieferadressen im gesamten Vereinigten Königreich, inklusive postcodeprüfter Routendetails." },
        { en: "Documents supplied for customs clearance: invoice, packing list and origin documents.", de: "Für die Zollabwicklung bereitgestellte Dokumente: Rechnung, Packliste und Ursprungsnachweise." },
        { en: "Incoterms agreed per quotation — EXW, FOB, CFR, CIF or DAP.", de: "Incoterms werden pro Angebot vereinbart – EXW, FOB, CFR, CIF oder DAP." },
        { en: "Samples by courier before you commit to a container.", de: "Muster per Kurier, bevor Sie sich für einen Container entscheiden." },
      ] as Localized[],
      importTitle: { en: "UK import requirements — what to expect", de: "Britische Importanforderungen – was Sie erwarten müssen" } as Localized,
      importBody: {
        en: "Importing into the UK normally requires a GB EORI number, a customs import declaration (usually filed by a customs broker) and payment of import VAT at the standard rate — postponement is available to VAT-registered importers. Preferential duty rates may apply to Pakistani origin when valid origin documentation is provided, subject to the product's rules of origin. Product-specific marking, safety and labelling duties (including UKCA/CE arrangements) vary by category.",
        de: "Der Import ins Vereinigte Königreich erfordert in der Regel eine GB-EORI-Nummer, eine Zollanmeldung (in der Regel über einen Zollagenten) und die Zahlung der Einfuhrumsatzsteuer zum Standardsatz – für umsatzsteuerpflichtige Importeure ist die Stundung möglich. Präferenzzollsätze können für pakistanischen Ursprung gelten, sofern gültige Ursprungsnachweise vorliegen, vorbehaltlich der Ursprungsregeln des Produkts. Produktbezogene Kennzeichnungs-, Sicherheits- und Etikettierungsanforderungen (inklusive UKCA/CE-Regelungen) variieren je nach Kategorie.",
      } as Localized,
      importNote: {
        en: "Importer obligations — customs clearance, duties, VAT and compliance at destination — remain with the buying company unless a written quotation states otherwise.",
        de: "Die Pflichten des Importeurs – Zollabwicklung, Zölle, Umsatzsteuer und Konformität am Zielort – verbleiben beim einkaufenden Unternehmen, sofern ein schriftliches Angebot nichts anderes vorsieht.",
      } as Localized,
      logisticsTitle: { en: "Shipping into the UK", de: "Transport nach Großbritannien" } as Localized,
      logisticsBody: {
        en: "Sea freight FCL and LCL into Felixstowe, Southampton and London Gateway, air freight into Heathrow and Manchester, plus courier services for samples and urgent replenishment. Routing is chosen per order against your volume, timeline and target cost.",
        de: "Seefracht FCL und LCL nach Felixstowe, Southampton und London Gateway, Luftfracht nach Heathrow und Manchester sowie Kurierdienste für Muster und dringende Nachlieferungen. Die Route wird pro Auftrag nach Menge, Zeitplan und Zielkosten gewählt.",
      } as Localized,
    },
    de: {
      heroTitle: {
        en: "Bulk supply for German importers, wholesalers & retailers",
        de: "Großlieferungen für Importeure, Großhändler & Einzelhändler in Deutschland",
      } as Localized,
      heroBody: {
        en: "We supply German and EU-registered businesses with export-ready goods, written EUR quotations and organised documentation for EU import — from first samples to recurring container orders.",
        de: "Wir beliefern in Deutschland und der EU registrierte Unternehmen mit exportfertigen Waren, schriftlichen Angeboten in EUR und organisierten Dokumenten für den EU-Import – von ersten Mustern bis zu wiederkehrenden Containeraufträgen.",
      } as Localized,
      servingTitle: { en: "Who we serve", de: "Wen wir beliefern" } as Localized,
      servingBody: {
        en: "Wholesalers, chain retailers and buying groups, distributors, specialist retail and online sellers purchasing in volume. Own-label and unbranded programmes are offered with labelling and packaging to your brief.",
        de: "Großhändler, Filialisten und Einkaufsgenossenschaften, Distributoren, Fachhandel sowie Online-Händler, die Ware in größeren Mengen beziehen. Werks- und Eigenmarken-Lösungen werden inklusive Etikettierung und Verpackung nach Ihren Vorgaben angeboten.",
      } as Localized,
      howTitle: { en: "How we work with German buyers", de: "So arbeiten wir mit deutschen Einkäufern" } as Localized,
      howPoints: [
        { en: "Quotations in EUR with packing, MOQ and lead time on the same document.", de: "Angebote in EUR mit Verpackung, Mindestbestellmenge und Lieferzeit auf demselben Dokument." },
        { en: "Delivery addresses throughout Germany with PLZ-verified routing details.", de: "Lieferadressen in ganz Deutschland mit plz-geprüften Routendetails." },
        { en: "Documents supplied for EU customs clearance: invoice, packing list and origin documents.", de: "Für die EU-Zollabwicklung bereitgestellte Dokumente: Rechnung, Packliste und Ursprungsnachweise." },
        { en: "Incoterms agreed per quotation — EXW, FOB, CFR, CIF or DAP.", de: "Incoterms werden pro Angebot vereinbart – EXW, FOB, CFR, CIF oder DAP." },
        { en: "German-language correspondence available on request.", de: "Korrespondenz auf Deutsch auf Anfrage verfügbar." },
      ] as Localized[],
      importTitle: { en: "EU import requirements — what to expect", de: "EU-Importanforderungen – was Sie erwarten müssen" } as Localized,
      importBody: {
        en: "Importing into the EU normally requires an EORI number, a customs import declaration (usually filed by a customs broker) and payment of import VAT at 19% in Germany — deferment is available to taxable persons under the reverse-charge/Art. 23 mechanism. Preferential duty rates may apply to Pakistani origin under the EU's generalised scheme when valid origin documentation is provided, subject to the product's rules of origin. Regulated products require CE marking, and consumer products placed on the EU market must meet the General Product Safety Regulation, including an EU responsible person where applicable.",
        de: "Der Import in die EU erfordert in der Regel eine EORI-Nummer, eine Zollanmeldung (in der Regel über einen Zollagenten) und die Zahlung der Einfuhrumsatzsteuer in Höhe von 19 % in Deutschland – für Steuerpflichtige ist die Stundung nach Art. 23 UStG möglich. Präferenzzollsätze können für pakistanischen Ursprung im Rahmen des EU-Allgemeinen Zollpräferenzsystems gelten, sofern gültige Ursprungsnachweise vorliegen, vorbehaltlich der Ursprungsregeln des Produkts. Für regulierte Produkte ist eine CE-Kennzeichnung erforderlich, und Verbraucherprodukte auf dem EU-Markt müssen die Verordnung über die allgemeine Produktsicherheit einhalten, einschließlich einer in der EU ansässigen verantwortlichen Person, sofern anwendbar.",
      } as Localized,
      importNote: {
        en: "Importer obligations — customs clearance, duties, VAT, packaging registration and compliance at destination — remain with the buying company unless a written quotation states otherwise.",
        de: "Die Pflichten des Importeurs – Zollabwicklung, Zölle, Umsatzsteuer, Verpackungsregistrierung und Konformität am Zielort – verbleiben beim einkaufenden Unternehmen, sofern ein schriftliches Angebot nichts anderes vorsieht.",
      } as Localized,
      logisticsTitle: { en: "Shipping into Germany", de: "Transport nach Deutschland" } as Localized,
      logisticsBody: {
        en: "Sea freight FCL and LCL into Hamburg and Bremerhaven, air freight into Frankfurt and Munich, plus road and courier options for samples and urgent replenishment. Routing is chosen per order against your volume, timeline and target cost.",
        de: "Seefracht FCL und LCL nach Hamburg und Bremerhaven, Luftfracht nach Frankfurt und München sowie Straßen- und Kurieroptionen für Muster und dringende Nachlieferungen. Die Route wird pro Auftrag nach Menge, Zeitplan und Zielkosten gewählt.",
      } as Localized,
    },
  },

  about: {
    title: {
      en: "A structured export partner for professional buyers",
      de: "Ein strukturierter Exportpartner für professionelle Einkäufer",
    } as Localized,
    intro: {
      en: "Meridian Global Exports is a Pakistan-based export company that helps businesses in the United Kingdom, Germany and other markets buy products in bulk — with clear specifications, documented checks and organised shipment coordination.",
      de: "Meridian Global Exports ist ein pakistanisches Exportunternehmen, das Unternehmen im Vereinigten Königreich, in Deutschland und anderen Märkten dabei hilft, Produkte in großen Mengen einzukaufen – mit klaren Spezifikationen, dokumentierten Prüfungen und organisierter Versandkoordination.",
    } as Localized,
    mission: {
      en: "Make bulk buying from Pakistan simple, transparent and repeatable for professional buyers.",
      de: "Den Einkauf in großen Mengen aus Pakistan für professionelle Einkäufer einfach, transparent und wiederholbar zu machen.",
    } as Localized,
    vision: {
      en: "Long-term supply relationships in which buyers reorder with confidence, because specification, quality and communication never drift.",
      de: "Langfristige Lieferbeziehungen, in denen Einkäufer zuversichtlich nachbestellen, weil Spezifikation, Qualität und Kommunikation nie ins Rutschen geraten.",
    } as Localized,
    sourcingTitle: { en: "Product sourcing capabilities", de: "Fähigkeiten zur Produktbeschaffung" } as Localized,
    sourcingBody: {
      en: "Our sourcing covers Pakistan's core export sectors — agricultural produce and food ingredients, textiles and readymade garments, leather goods, sports goods and instruments — coordinated through manufacturers, processors and growers matched to your specification, volume and target price.",
      de: "Unsere Beschaffung umfasst die Kernexportsektoren Pakistans – landwirtschaftliche Erzeugnisse und Lebensmittelzutaten, Textilien und Konfektionsartikel, Lederwaren, Sportartikel und Instrumente – koordiniert über Hersteller, Verarbeiter und Erzeuger, die auf Ihre Spezifikation, Menge und Ihr Zielpreis abgestimmt sind.",
    } as Localized,
    qualityTitle: { en: "Quality assurance process", de: "Prozess der Qualitätssicherung" } as Localized,
    qualityBody: {
      en: "Every order follows the same sequence: written specification, sample approval where required, in-process checks during production or packing, pre-shipment inspection when agreed, packing verification against the order, and document review before dispatch. Independent third-party inspection can be arranged at your cost when your purchase requires it.",
      de: "Jeder Auftrag folgt derselben Reihenfolge: schriftliche Spezifikation, Musterfreigabe bei Bedarf, Kontrollen während der Fertigung oder Verpackung, Versandvor-Inspection nach Vereinbarung, Prüfung der Verpackung gegen den Auftrag und Dokumentenprüfung vor dem Versand. Eine unabhängige Inspektion durch Dritte kann auf Ihre Kosten veranlasst werden, wenn Ihr Einkauf dies erfordert.",
    } as Localized,
    logisticsTitle: { en: "Export & logistics capabilities", de: "Export- & Logistikfähigkeiten" } as Localized,
    logisticsBody: {
      en: "We prepare export documentation, coordinate with freight forwarders and carriers, and arrange sea (FCL/LCL), air and courier movements from Pakistani ports and airports. Shipment plans are agreed per order — nothing is assumed about clearance, duties or delivery terms until it is written into your quotation.",
      de: "Wir bereiten Exportdokumente vor, koordinieren mit Frachtspediteuren und Beförtern und organisieren See- (FCL/LCL), Luft- und Kuriertransporte von pakistanischen Häfen und Flughäfen aus. Transportpläne werden pro Auftrag vereinbart – nichts wird über Zollabwicklung, Zölle oder Lieferbedingungen angenommen, bevor es nicht in Ihrem Angebot steht.",
    } as Localized,
    image: "/images/about-team.jpg",
    credentialsTitle: {
      en: "Company documentation & certifications",
      de: "Firmendokumentation & Zertifikate",
    } as Localized,
    credentialsNote: {
      en: "Registration, tax and product documentation is shared with qualified buyers during onboarding. Certificates are published here only when the company has verified them for listing.",
      de: "Registrierungs-, Steuer- und Produktdokumente werden qualifizierten Einkäufern während des Onboardings bereitgestellt. Zertifikate werden nur hier veröffentlicht, wenn das Unternehmen sie zur Listung geprüft hat.",
    } as Localized,
  },

  contact: {
    intro: {
      en: "Tell us what you need, in what volume, and where it should arrive. We respond to business inquiries in writing — usually within one business day.",
      de: "Sagen Sie uns, was Sie benötigen, in welcher Menge und wohin die Ware gelangen soll. Wir antworten auf Geschäftsanfragen schriftlich – in der Regel innerhalb eines Werktags.",
    } as Localized,
    callbackNote: {
      en: "Prefer a call? Request a callback and include the best time and your timezone.",
      de: "Lieber telefonisch? Fordern Sie einen Rückruf an und nennen Sie die beste Zeit und Ihre Zeitzone.",
    } as Localized,
  },

  footer: {
    blurb: {
      en: "Pakistan-based bulk export sourcing for importers, wholesalers, distributors and retailers in the United Kingdom, Germany and worldwide.",
      de: "Pakistanische Großhandels-Beschaffung für Importeure, Großhändler, Distributoren und Einzelhändler im Vereinigten Königreich, in Deutschland und weltweit.",
    } as Localized,
  },

  legal: {
    privacy: {
      title: { en: "Privacy policy", de: "Datenschutzerklärung" } as Localized,
      body: {
        en: `1. Who we are\nMeridian Global Exports is a Pakistan-based export company supplying goods in bulk to business buyers. For privacy questions, use the contact form on this website.\n\n2. What we collect\nWhen you submit an inquiry, quotation request, sample request or contact form we collect the business information you enter: company name, contact person, business e-mail, phone (optional), country, delivery city/postcode, product interests, quantities, packaging and customization notes, and any documents you upload.\n\n3. Why we process it\nWe use this data to answer your inquiry, prepare and negotiate quotations, arrange samples, fulfil orders you confirm, and keep a record of business correspondence. The legal basis is the steps taken at your request prior to entering a contract and our legitimate interest in responding to business inquiries.\n\n4. Who receives it\nYour data is stored in our business systems. It is shared only with service providers involved in your order — freight forwarders, customs brokers, inspection or production partners — and only where necessary. We do not sell personal data.\n\n5. Retention\nInquiry records are retained for as long as needed for business and record-keeping purposes, then deleted or anonymised.\n\n6. Your rights\nDepending on your location (including the UK GDPR and the EU GDPR), you may request access, correction, deletion, restriction or portability of your data, and you may object to processing. Use the contact form to exercise these rights.\n\n7. Uploads and cookies\nDocuments you upload are stored privately and accessible only to our staff. This site uses essential cookies for session, language, market and cookie-preference storage; no advertising or tracking cookies are set without your consent.`,
        de: `1. Verantwortlicher\nMeridian Global Exports ist ein pakistanisches Exportunternehmen, das Waren in großen Mengen an Geschäftskunden liefert. Für Datenschutzfragen nutzen Sie das Kontaktformular auf dieser Website.\n\n2. Welche Daten wir erheben\nWenn Sie eine Anfrage, ein Angebot, eine Musteranfrage oder das Kontaktformular absenden, erheben wir die von Ihnen eingegebenen Geschäftsdaten: Firmenname, Ansprechpartner, geschäftliche E-Mail-Telefon (optional), Lieferort/PLZ, Produktinteressen, Mengen, Verpackungs- und Anpassungsnotizen sowie hochgeladene Dokumente.\n\n3. Zweck der Verarbeitung\nWir verwenden diese Daten, um Ihre Anfrage zu beantworten, Angebote vorzubereiten und zu verhandeln, Muster zu veranlassen, bestätigte Aufträge zu erfüllen und Geschäftskorrespondenz zu dokumentieren. Rechtsgrundlage sind die auf Ihre Anfrage vor Vertragsschluss getroffenen Schritte und unser berechtigtes Interesse an der Beantwortung von Geschäftsanfragen.\n\n4. Empfänger\nIhre Daten werden in unseren Geschäftssystemen gespeichert und nur an Dienstleister weitergegeben, die an Ihrem Auftrag beteiligt sind – Frachspediteure, Zollagenten, Inspektions- oder Produktionspartner – soweit dies erforderlich ist. Wir verkaufen keine personenbezogenen Daten.\n\n5. Speicherdauer\nAnfragen werden so lange aufbewahrt, wie es für Geschäfts- und Aufbewahrungszwecke erforderlich ist, und danach gelöscht oder anonymisiert.\n\n6. Ihre Rechte\nJe nach Standort (einschließlich UK-DSGVO und EU-DSGVO) können Sie Auskunft, Berichtigung, Löschung, Einschränkung oder Übertragbarkeit Ihrer Daten verlangen und der Verarbeitung widersprechen. Setzen Sie dazu das Kontaktformular ein.\n\n7. Uploads und Cookies\nHochgeladene Dokumente werden privat gespeichert und sind nur für unser Personal zugänglich. Diese Website verwendet essenzielle Cookies für Sitzung, Sprache, Markt und Cookie-Einstellungen; Werbe- oder Tracking-Cookies werden ohne Ihre Zustimmung nicht gesetzt.`,
      } as Localized,
    },
    terms: {
      title: { en: "Terms & conditions", de: "Allgemeine Geschäftsbedingungen" } as Localized,
      body: {
        en: `1. Scope\nThese terms govern quotations and supply agreements between Meridian Global Exports ("the seller") and business buyers ("the buyer"). Where a signed contract states otherwise, that contract prevails.\n\n2. Quotations\nAll pricing is B2B and quote-based. Prices shown on this website, if any, are indicative only. A binding price, specification, packing, lead time and validity period are those stated in a written quotation.\n\n3. Minimum order quantities\nEach product states its MOQ or packing basis. Mixed-load and consolidated orders are subject to agreement.\n\n4. Samples\nSamples can be requested per product. Sample cost, courier charges and lead time are confirmed before dispatch.\n\n5. Specifications & approval\nThe specification agreed in writing (including approved samples where taken) defines the order. Buyer changes after confirmation may affect price and lead time.\n\n6. Delivery terms\nDelivery terms are agreed per quotation using Incoterms® 2020 (e.g. EXW, FOB, CFR, CIF, DAP). Unless the quotation states otherwise, customs clearance, import duties, VAT/taxes and product compliance obligations at destination are the buyer's responsibility.\n\n7. Lead times\nLead times are estimates confirmed per order and start after specification, payment and (where applicable) sample approval.\n\n8. Inspection & claims\nInspection arrangements are agreed per order. Claims must be notified promptly with photographic and documentary evidence; claims for concealed damage or shortage are considered within a reasonable period after arrival.\n\n9. Payment\nPayment terms, currencies and instruments are stated in the quotation and confirmed before production.\n\n10. Force majeure\nNeither party is liable for delays caused by events beyond reasonable control, including transport disruption, port congestion, government action and natural events.\n\n11. Governing framework\nThe governing law and dispute forum are stated in the individual contract of sale.`,
        de: `1. Geltungsbereich\nDiese Bedingungen gelten für Angebote und Lieferverträge zwischen Meridian Global Exports ("Verkäufer") und Geschäftskäufern ("Käufer"). Falls ein unterzeichneter Vertrag etwas anderes vorsieht, hat dieser Vorrang.\n\n2. Angebote\nAlle Preise sind B2B- und angebotsbasiert. Auf dieser Website gezeigte Preise, sofern vorhanden, sind nur Richtwerte. Verbindlicher Preis, Spezifikation, Verpackung, Lieferzeit und Gültigkeit ergeben sich aus einem schriftlichen Angebot.\n\n3. Mindestbestellmengen\nJedes Produkt nennt seine Mindestbestellmenge oder Verpackungsbasis. Gemischte und gebündelte Sendungen bedürfen der Vereinbarung.\n\n4. Muster\nMuster können pro Produkt angefordert werden. Musterkosten, Kurierkosten und Lieferzeit werden vor dem Versand bestätigt.\n\n5. Spezifikation & Freigabe\nDie schriftlich vereinbarte Spezifikation (einschließlich freigegebener Muster) definiert den Auftrag. Änderungen nach Bestätigung können Preis und Lieferzeit beeinflussen.\n\n6. Lieferbedingungen\nLieferbedingungen werden pro Angebot gemäß Incoterms® 2020 vereinbart (z. B. EXW, FOB, CFR, CIF, DAP). Sofern das Angebot nichts anderes vorsieht, sind Zollabwicklung, Einfuhrzölle, Umsatzsteuer/Abgaben und Produktkonformität am Zielort Pflichten des Käufers.\n\n7. Lieferzeiten\nLieferzeiten sind Schätzwerte, die pro Auftrag bestätigt werden, und beginnen nach Spezifikation, Zahlung und – falls zutreffend – Musterfreigabe.\n\n8. Inspektion & Reklamationen\nInspektionsregelungen werden pro Auftrag vereinbart. Reklamationen sind umgehend mit fotografischem und dokumentarischem Beleg mitzuteilen; verborgene Schäden oder Mängel werden innerhalb einer angemessenen Zeit nach Ankunft geprüft.\n\n9. Zahlung\nZahlungsbedingungen, Währungen und Zahlungsinstrumente ergeben sich aus dem Angebot und werden vor Produktion bestätigt.\n\n10. Höhere Gewalt\nKeine Partei haftet für Verzögerungen durch Umstände außerhalb des zumutbaren Einflusses, einschließlich Transportstörungen, Hafenüberlastung, behördliches Handeln und Naturereignisse.\n\n11. Rechtsrahmen\nAnwendbares Recht und Gerichtsstand ergeben sich aus dem jeweiligen Kaufvertrag.`,
      } as Localized,
    },
    cookies: {
      title: { en: "Cookie policy", de: "Cookie-Richtlinie" } as Localized,
      body: {
        en: `This site sets only functional cookies:\n\n• mge_session — keeps an administrator signed in (admin areas only, 7 days, httpOnly).\n• mge_locale, mge_market, mge_currency — remember your language, market and display currency.\n• mge_cookie_consent — records your cookie choice.\n\nNo advertising, social-media or analytics cookies are placed. If an analytics provider is configured later, consent will be requested before any such cookie is set. You can change your choice at any time via "Cookie settings" in the footer.`,
        de: `Diese Website setzt ausschließlich funktionale Cookies:\n\n• mge_session – hält einen Administrator angemeldet (nur Admin-Bereiche, 7 Tage, httpOnly).\n• mge_locale, mge_market, mge_currency – speichern Sprache, Markt und Anzeigewährung.\n• mge_cookie_consent – speichert Ihre Cookie-Auswahl.\n\nEs werden keine Werbe-, Social-Media- oder Analyse-Cookies gesetzt. Wird später ein Analyse-Anbieter eingebunden, wird vorab Ihre Zustimmung angefordert. Sie können Ihre Auswahl jederzeit über „Cookie-Einstellungen" im Fußbereich ändern.`,
      } as Localized,
    },
  },
};

export type SettingsBundle = typeof DEFAULT_SETTINGS;

/* -------------------------------------------------------------------------- */
/* Readers                                                                     */
/* -------------------------------------------------------------------------- */

export async function getCompany() {
  return getSettings(DEFAULT_SETTINGS.company);
}

export async function getHero() {
  return getSettings(DEFAULT_SETTINGS.hero);
}

export function contentUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith("/") ? path : `/${path}`;
}
