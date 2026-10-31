import { readFileSync } from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";
import { DEFAULT_SETTINGS } from "../src/lib/content";
import { hashPassword } from "../src/lib/password";

/* -------------------------------------------------------------------------- */
/* .env loader (tsx does not load .env automatically)                          */
/* -------------------------------------------------------------------------- */
function loadEnv(): void {
  try {
    const raw = readFileSync(path.join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    /* no .env — rely on process env */
  }
}
loadEnv();

/* -------------------------------------------------------------------------- */
/* Seed data                                                                   */
/* -------------------------------------------------------------------------- */

const categories = [
  {
    name: "Food & Agro",
    slug: "food-agro",
    description: "Rice, spices, fruit pulps and agricultural commodities in bulk.",
    sortOrder: 1,
  },
  {
    name: "Textiles & Apparel",
    slug: "textiles-apparel",
    description: "Knitted fabrics and readymade garments for wholesale programmes.",
    sortOrder: 2,
  },
  {
    name: "Leather Goods",
    slug: "leather-goods",
    description: "Leather gloves and accessories produced for export markets.",
    sortOrder: 3,
  },
  {
    name: "Sports Goods",
    slug: "sports-goods",
    description: "Match and training sports equipment manufactured for bulk supply.",
    sortOrder: 4,
  },
  {
    name: "Medical & Surgical",
    slug: "medical-surgical",
    description: "Stainless steel examination and surgical instruments.",
    sortOrder: 5,
  },
  {
    name: "Minerals & Stone",
    slug: "minerals-stone",
    description: "Marble and granite tiles and slabs for project and retail supply.",
    sortOrder: 6,
  },
];

type SeedProduct = {
  name: string;
  slug: string;
  sku: string;
  categorySlug: string;
  shortDesc: string;
  description: string;
  moq: string;
  leadTime: string;
  packaging: string;
  customization: string;
  materials: string;
  dimensions: string;
  featured?: boolean;
  sortOrder: number;
  pricePublished?: boolean;
  priceAmount?: number;
  priceUnit?: string;
  priceCurrency?: string;
  searchKeywords?: string;
  options: Array<{ name: string; values: string }>;
  specifications: Array<{ label: string; value: string }>;
  images: string[];
};

const products: SeedProduct[] = [
  {
    name: "Premium Basmati Rice 1121",
    slug: "premium-basmati-rice-1121",
    sku: "RIC-BAS-1121",
    categorySlug: "food-agro",
    shortDesc:
      "Aged 1121 basmati with extra-long grain, uniform colour and the aroma professional buyers expect from Pakistani basmati.",
    description:
      "Sourced from contracted growers in the Punjab basmati belt, milled to order and colour-sorted before packing. Grain length, moisture, broken percentage and ageing are specified in writing before shipment, and samples are available ahead of a bulk commitment.\n\nSuitable for retail packs, foodservice packs and private-label programmes. Milling, sorting and packing can be scheduled against your delivery plan, with export documentation prepared for the destination market.",
    moq: "5 metric tonnes",
    leadTime: "15–25 days after order confirmation",
    packaging:
      "5 kg / 10 kg / 25 kg / 50 kg PP or jute export bags; retail pouches (1 kg, 2 kg, 5 kg) and export cartons on request.",
    customization:
      "Private-label bags and pouches, printed branding, barcodes, multilingual labelling, mixed grades in one shipment.",
    materials: "100% Pakistani basmati rice (1121 variety)",
    dimensions: "Raw grain length approx. 8.3–8.5 mm",
    featured: true,
    sortOrder: 1,
    pricePublished: true,
    priceAmount: 940,
    priceUnit: "metric tonne",
    priceCurrency: "GBP",
    searchKeywords: "rice basmati food grain 1121 pakistan export",
    options: [
      { name: "Processing", values: "Steam, Sella (parboiled), Golden" },
      { name: "Ageing", values: "Fresh crop, 12-month aged" },
      { name: "Packing", values: "50 kg jute, 25 kg PP, 1 kg retail pouch" },
    ],
    specifications: [
      { label: "Variety", value: "1121 Basmati" },
      { label: "Origin", value: "Pakistan (Punjab)" },
      { label: "Moisture", value: "Max 12.5% — confirmed per contract" },
      { label: "Broken / damaged", value: "Grade-dependent — confirmed per contract" },
      { label: "Sorting", value: "Double polished and colour sorted" },
      { label: "Inspection", value: "Pre-shipment inspection available on request" },
    ],
    images: ["prod-basmati-rice-1.jpg", "prod-basmati-rice-2.jpg"],
  },
  {
    name: "Mango Pulp & Puree",
    slug: "mango-pulp-puree",
    sku: "FRU-MGP-001",
    categorySlug: "food-agro",
    shortDesc:
      "Single-strength mango pulp and puree from Sindhri mangoes for food manufacturers, bottlers and distributors.",
    description:
      "Prepared from ripe, graded fruit and packed to the format agreed for your order — aseptic bag-in-drum, tins or glass — with Brix, acidity and pack size specified before production.\n\nUsed by juice and nectar plants, dairy and ice-cream producers, bakeries and private-label distributors. Batch documentation and product specification sheets are supplied with the shipment.",
    moq: "1 × 20′ container (min. 10 MT or equivalent pack format)",
    leadTime: "20–30 days during season; off-season subject to raw material",
    packaging:
      "Aseptic bag-in-drum (220 kg), tins (850 g / 3 kg) or glass jars, packed into export cartons on pallets.",
    customization:
      "Private-label cartons and drums, label artwork support, Brix and pack-size variations to specification.",
    materials: "Mango pulp from Pakistani Sindhri mangoes",
    dimensions: "Pack options as listed under packaging",
    sortOrder: 2,
    pricePublished: false,
    searchKeywords: "mango pulp puree fruit food aseptic pakistan",
    options: [
      { name: "Format", values: "Aseptic drum, Tin, Glass" },
      { name: "Brix", values: "Single strength (approx. 15°), concentrated on request" },
    ],
    specifications: [
      { label: "Fruit content", value: "100% mango pulp (single strength)" },
      { label: "Origin", value: "Pakistan" },
      { label: "Colour & flavour", value: "Natural, characteristic of the fruit" },
      { label: "Documentation", value: "Specification sheet and batch details per shipment" },
      { label: "Storage", value: "Store cool and dry; per pack instructions" },
    ],
    images: ["prod-mango-pulp-1.jpg", "prod-mango-pulp-2.jpg"],
  },
  {
    name: "Whole & Ground Spices",
    slug: "whole-ground-spices",
    sku: "SPC-WG-001",
    categorySlug: "food-agro",
    shortDesc:
      "Cumin, coriander, chilli, turmeric and fenugreek — whole or ground, cleaned and packed for wholesale and retail programmes.",
    description:
      "Spices are cleaned, graded and, where required, ground to the mesh size specified for your order. Steam sterilisation, EU-recognised treatment documentation and pesticide-residue testing can be arranged through laboratories at the buyer's instruction.\n\nSupplied in bulk sacks for industrial users or in retail jars and pouches under private label.",
    moq: "1 metric tonne per SKU",
    leadTime: "15–25 days after order confirmation",
    packaging:
      "10 kg / 25 kg laminated or PP inner bags inside export cartons; retail glass or PET jars on request.",
    customization:
      "Retail jars, private-label artwork, custom mesh size, mixed pallets of several spices.",
    materials: "Whole or ground agricultural spices (variety per SKU)",
    dimensions: "Whole or ground to specified mesh",
    sortOrder: 3,
    searchKeywords: "spices cumin coriander chilli turmeric food",
    options: [
      { name: "Form", values: "Whole, Crushed, Ground" },
      { name: "Varieties", values: "Cumin, Coriander, Chilli, Turmeric, Fenugreek" },
    ],
    specifications: [
      { label: "Form", value: "Whole or ground to specification" },
      { label: "Origin", value: "Pakistan" },
      { label: "Cleaning", value: "Destoned and double cleaned" },
      { label: "Testing", value: "Residue testing available at buyer instruction" },
      { label: "Labelling", value: "Lot and batch marking per shipment" },
    ],
    images: ["prod-spices-1.jpg", "prod-spices-2.jpg"],
  },
  {
    name: "Cotton Knitted Fabric (Single Jersey)",
    slug: "cotton-knitted-fabric-jersey",
    sku: "TXT-CJ-001",
    categorySlug: "textiles-apparel",
    shortDesc:
      "100% cotton single jersey in 120–220 GSM for garment programmes, supplied in rolls with dyeing and print options.",
    description:
      "Knitted from carded or combed cotton yarn and finished to the hand-feel your programme requires. Rolls are inspected for shade, GSM and width before dispatch, with shade bands approved ahead of bulk dyeing.\n\nDyeing (reactive and vat), enzyme wash, printing and body-uk or bulk orders can be coordinated together with lab dips and strike-offs for approval.",
    moq: "1,000 kg per shade (subject to construction)",
    leadTime: "25–35 days after lab dip approval",
    packaging:
      "Rolled on tubes, poly-wrapped and packed into export bales or cartons; roll labels with lot details.",
    customization:
      "Reactive/vatre dyeing, prints and stripes, enzyme softener finish, custom roll lengths and labelling.",
    materials: "100% cotton (carded or combed yarn)",
    dimensions: "Width approx. 160–180 cm; 120–220 GSM options",
    featured: true,
    sortOrder: 4,
    searchKeywords: "fabric cotton jersey knit textile gsm dyeing",
    options: [
      { name: "GSM", values: "120, 140, 160, 180, 220" },
      { name: "Yarn", values: "Carded, Combed" },
      { name: "Finish", values: "Raw, Enzyme washed, Pigment dyed" },
    ],
    specifications: [
      { label: "Composition", value: "100% cotton" },
      { label: "Construction", value: "Single jersey knit" },
      { label: "Weight", value: "120–220 GSM (per construction)" },
      { label: "Width", value: "Approx. 160–180 cm open width" },
      { label: "Inspection", value: "Roll-wise shade, GSM and width check" },
    ],
    images: ["prod-cotton-fabric-1.jpg", "prod-cotton-fabric-2.jpg"],
  },
  {
    name: "Readymade Cotton T-Shirts (Blank)",
    slug: "readymade-cotton-tshirts",
    sku: "TXT-RT-001",
    categorySlug: "textiles-apparel",
    shortDesc:
      "Heavyweight combed-cotton blank t-shirts for promotion, retail and print programmes — sizes S to 3XL in mixed colours.",
    description:
      "Cut and sewn from 100% combed cotton single jersey with taped neck and double-needle hem stitching. Body and size measurements are confirmed against your size chart before bulk cutting.\n\nSuitable for screen printing, embroidery and dye-to-order programmes, supplied with poly-bags and carton markings to your specification.",
    moq: "500 pieces per colour and size combination",
    leadTime: "25–35 days after size-chart approval",
    packaging:
      "Individually poly-bagged shirts packed in export cartons with mixed-size carton options.",
    customization:
      "Body colours, neck taping, woven labels, printed care labels, hang tags, barcode stickers, poly-bag branding.",
    materials: "100% combed cotton single jersey",
    dimensions: "Sizes S–3XL per supplied size chart",
    featured: true,
    sortOrder: 5,
    searchKeywords: "tshirt t-shirt cotton blank apparel garment print",
    options: [
      { name: "Weight", values: "160 GSM, 180 GSM, 220 GSM" },
      { name: "Size mix", values: "S–XL, XS–3XL, custom mixed cartons" },
      { name: "Finish", values: "Undyed (natural), Pigment dyed, Reactive dyed" },
    ],
    specifications: [
      { label: "Fabric", value: "100% combed cotton jersey" },
      { label: "Construction", value: "Crew neck, taped shoulder, double-needle hem" },
      { label: "Colours", value: "Stock colours or dyed to shade" },
      { label: "Sampling", value: "Pre-production sample before bulk cutting" },
      { label: "Inspection", value: "AQL inspection available on request" },
    ],
    images: ["prod-tshirts-1.jpg", "prod-tshirts-2.jpg"],
  },
  {
    name: "Leather Work Gloves",
    slug: "leather-work-gloves",
    sku: "LTH-WG-001",
    categorySlug: "leather-goods",
    shortDesc:
      "Cowhide and pigskin work gloves with reinforced palms for industrial, hardware and DIY distribution channels.",
    description:
      "Cut from chrome-tanned cowhide or pigskin with Kevlar or cotton thread stitching options, available in split or full-grain grades. Sizes, linings and cuff styles are selected per market.\n\nSuitable for hardware chains, safety distributors and private-label programmes, packed in pairs with printed labels and barcodes.",
    moq: "1,000 pairs per size and style",
    leadTime: "30–40 days after sample approval",
    packaging:
      "Pairs in printed polybags, 12 pairs per export carton; inner assortments by size on request.",
    customization:
      "Printed labels, heat-transfer branding, cuff style, size assortment, barcode and carton markings.",
    materials: "Chrome-tanned cowhide / pigskin leather",
    dimensions: "Sizes 7–13; cuff styles: rubber, knitted, safety",
    featured: false,
    sortOrder: 6,
    searchKeywords: "gloves leather work safety industrial",
    options: [
      { name: "Leather", values: "Cowhide split, Cowhide grain, Pigskin" },
      { name: "Cuff", values: "Safety cuff, Knitted wrist, Rubberized" },
      { name: "Lining", values: "Unlined, Fleece, Canvas" },
    ],
    specifications: [
      { label: "Material", value: "Genuine leather (grade per order)" },
      { label: "Stitching", value: "Cotton or aramid thread options" },
      { label: "Sizes", value: "7–13 and size assortments" },
      { label: "Testing", value: "Conformity testing arranged per destination requirement" },
      { label: "Branding", value: "Label and print options available" },
    ],
    images: ["prod-leather-gloves-1.jpg", "prod-leather-gloves-2.jpg"],
  },
  {
    name: "Hand-Stitched Footballs",
    slug: "hand-stitched-footballs",
    sku: "SPT-FB-001",
    categorySlug: "sports-goods",
    shortDesc:
      "Hand-stitched and machine-stitched footballs in TPU, PVC and rubber for wholesale, clubs and promotional programmes.",
    description:
      "Panels are cut, printed and assembled with hand or machine stitching, with bladder, wind and rebound checked per batch. Match, training and promotional grades are available with your club or brand artwork printed on request.\n\nPacked deflated in bales or retail-ready cartons according to your channel.",
    moq: "1,000 pcs per design and size",
    leadTime: "25–35 days after artwork approval",
    packaging:
      "Deflated and poly-bagged in bulk bales, or printed retail boxes / cartons on request.",
    customization:
      "Full-colour panel printing, brand logo, size mix, retail packaging, special valve branding.",
    materials: "TPU / PVC / rubber panels with butyl or latex bladder",
    dimensions: "Sizes 3, 4 and 5 (standard circumference 68–72 cm for size 5)",
    featured: true,
    sortOrder: 7,
    searchKeywords: "football soccer ball sports match training",
    options: [
      { name: "Grade", values: "Match, Training, Promotional" },
      { name: "Panel material", values: "TPU, PVC, Rubber" },
      { name: "Stitching", values: "Hand stitched, Machine stitched, Thermal bonded" },
    ],
    specifications: [
      { label: "Sizes", value: "3, 4, 5" },
      { label: "Bladder", value: "Butyl or latex" },
      { label: "Assembly", value: "Hand-stitched / machine-stitched per grade" },
      { label: "Quality check", value: "Weight, circumference, rebound and pressure per batch" },
      { label: "Artwork", value: "Printed to buyer artwork after approval" },
    ],
    images: ["prod-football-1.jpg", "prod-football-2.jpg"],
  },
  {
    name: "Surgical & Examination Instruments",
    slug: "surgical-examination-instruments",
    sku: "SUR-SI-001",
    categorySlug: "medical-surgical",
    shortDesc:
      "Stainless steel forceps, scissors, retractors and clamps for distributors and institutional supply.",
    description:
      "Instruments are produced in stainless steel with satin or mirror finish, sorted and checked for jaw alignment, joint action and tip condition before packing.\n\nCatalogue lines and custom OEM sets can be supplied with individual, pouch or tray packing, including branded instrument cases and batch labelling to your requirements.",
    moq: "500 pcs per pattern (assorted lines accepted)",
    leadTime: "30–45 days after sample approval",
    packaging:
      "Individual PE sleeves, sterile-ready pouches (non-sterile supply unless agreed) or instrument cases and trays.",
    customization:
      "OEM patterns, brand etching, custom sets, pouch and tray packaging, case branding.",
    materials: "Surgical-grade stainless steel",
    dimensions: "Standard catalogue lengths per pattern; custom sizes on request",
    sortOrder: 8,
    searchKeywords: "surgical instruments medical stainless steel forceps scissors",
    options: [
      { name: "Finish", values: "Satin, Mirror" },
      { name: "Packing", values: "Individual sleeve, Pouch, Tray, Case" },
      { name: "Product groups", values: "Forceps, Scissors, Retractors, Clamps, Speculums" },
    ],
    specifications: [
      { label: "Material", value: "Stainless steel (grade per pattern)" },
      { label: "Finish", value: "Satin or mirror" },
      { label: "Quality check", value: "Alignment, joint action and finish per piece" },
      { label: "Marking", value: "Lot and brand etching available" },
      { label: "Sterility", value: "Supplied non-sterile unless agreed otherwise" },
    ],
    images: ["prod-surgical-1.jpg", "prod-surgical-2.jpg"],
  },
  {
    name: "Marble & Granite Tiles",
    slug: "marble-granite-tiles",
    sku: "MIN-MTG-001",
    categorySlug: "minerals-stone",
    shortDesc:
      "Honed and polished marble and granite tiles in standard and project sizes for retail and contract supply.",
    description:
      "Slabs are cut, calibrated and finished to the surface treatment your project requires, with shade and veining ranges selected from block photography before production.\n\nSupplied in export crates with bundle labelling, tile dimensions and finish details printed on the crate and packing list.",
    moq: "1 × 20′ container (approx. 300–400 m² depending on thickness)",
    leadTime: "25–40 days after shade approval",
    packaging:
      "Wooden export crates with foam separators and corner protection; bundle and crate marking per shipment.",
    customization:
      "Cut-to-size, edge finishes, custom dimensions, branded crate marking.",
    materials: "Marble and granite (variety per selection)",
    dimensions: "600×600 mm, 600×1200 mm, 300×300 mm; 16–20 mm thickness",
    sortOrder: 9,
    searchKeywords: "marble granite tiles stone flooring project",
    options: [
      { name: "Finish", values: "Polished, Honed, Leathered" },
      { name: "Thickness", values: "16 mm, 18 mm, 20 mm" },
      { name: "Formats", values: "300×300, 600×600, 600×1200, cut-to-size" },
    ],
    specifications: [
      { label: "Material", value: "Natural marble / granite" },
      { label: "Formats", value: "Standard and project sizes" },
      { label: "Tolerance", value: "Calibrated thickness per order" },
      { label: "Crating", value: "Export-grade crates with protection" },
      { label: "Selection", value: "Block and shade selection available before production" },
    ],
    images: ["prod-marble-1.jpg", "prod-marble-2.jpg"],
  },
];

/* -------------------------------------------------------------------------- */
/* Runner                                                                      */
/* -------------------------------------------------------------------------- */

async function seedSettings(): Promise<void> {
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db.setting.upsert({
      where: { key },
      update: {},
      create: { key, value: JSON.stringify(value) },
    });
  }
  console.log(`Settings seeded (${Object.keys(DEFAULT_SETTINGS).length} keys, existing values kept)`);
}

async function seedAdmin(): Promise<void> {
  const email = (process.env.ADMIN_EMAIL || "admin@meridian.example").toLowerCase().trim();
  const existing = await db.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin ${email} already exists — password unchanged.`);
    return;
  }
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  await db.adminUser.create({
    data: {
      email,
      name: process.env.ADMIN_NAME || "Administrator",
      passwordHash: await hashPassword(password),
      role: "admin",
    },
  });
  console.log(`Admin created: ${email} (password from .env ADMIN_PASSWORD)`);
}

async function seedCategories(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const category of categories) {
    const row = await db.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description, sortOrder: category.sortOrder },
      create: category,
    });
    map.set(category.slug, row.id);
  }
  console.log(`Categories seeded: ${map.size}`);
  return map;
}

async function copyImage(filename: string): Promise<string | null> {
  const { promises: fs } = await import("node:fs");
  const source = path.join(process.cwd(), "public", "images", filename);
  const storedName = `seed-${filename}`;
  const target = path.join(process.cwd(), "data", "uploads", "products", storedName);
  try {
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.copyFile(source, target);
    return `products/${storedName}`;
  } catch {
    console.warn(`  ! image not found: public/images/${filename} (add it later in the dashboard)`);
    return null;
  }
}

async function seedProducts(categoryIds: Map<string, string>): Promise<void> {
  let created = 0;
  for (const product of products) {
    const categoryId = categoryIds.get(product.categorySlug);
    if (!categoryId) continue;

    const data = {
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      categoryId,
      shortDesc: product.shortDesc,
      description: product.description,
      moq: product.moq,
      leadTime: product.leadTime,
      packaging: product.packaging,
      customization: product.customization,
      materials: product.materials,
      dimensions: product.dimensions,
      featured: product.featured ?? false,
      status: "active",
      sortOrder: product.sortOrder,
      pricePublished: product.pricePublished ?? false,
      priceAmount: product.priceAmount ?? null,
      priceUnit: product.priceUnit ?? null,
      priceCurrency: product.priceCurrency ?? "GBP",
      searchKeywords: product.searchKeywords ?? null,
    };

    const row = await db.product.upsert({
      where: { slug: product.slug },
      update: data,
      create: { ...data, categoryId },
    });
    created += 1;

    // Specifications / options — create only when missing (idempotent).
    if ((await db.productSpec.count({ where: { productId: row.id } })) === 0) {
      await db.productSpec.createMany({
        data: product.specifications.map((spec, index) => ({
          productId: row.id,
          label: spec.label,
          value: spec.value,
          sortOrder: index,
        })),
      });
    }
    if ((await db.productOption.count({ where: { productId: row.id } })) === 0) {
      await db.productOption.createMany({
        data: product.options.map((option, index) => ({
          productId: row.id,
          name: option.name,
          values: option.values,
          sortOrder: index,
        })),
      });
    }

    // Images — copy into the uploads directory and register them.
    for (let index = 0; index < product.images.length; index++) {
      const filename = product.images[index];
      const storedPath = await copyImage(filename);
      if (!storedPath) continue;
      const exists = await db.productImage.findFirst({
        where: { productId: row.id, path: storedPath },
      });
      if (!exists) {
        await db.productImage.create({
          data: {
            productId: row.id,
            path: storedPath,
            alt: `${product.name} — photo ${index + 1}`,
            sortOrder: index,
          },
        });
      }
    }
  }
  console.log(`Products seeded: ${created}`);
}

async function main(): Promise<void> {
  console.log("Seeding database…");
  await seedSettings();
  await seedAdmin();
  const categoryIds = await seedCategories();
  await seedProducts(categoryIds);
  const [productCount, inquiryCount] = await Promise.all([
    db.product.count(),
    db.inquiry.count(),
  ]);
  console.log(`Done — ${productCount} products, ${inquiryCount} inquiries in database.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
