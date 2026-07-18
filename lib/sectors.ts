export type Sector = {
  slug: string;
  title: string;
  tagline: string;
  heroImage: string;
  featuredImage: string;
  shortDesc: string;
  longDesc: string;
  benefits: string[];
  riskManagement: string[];
  expectedReturns: string;
  whyChoose: string[];
  cta: string;
};

export const sectors: Sector[] = [
  {
    slug: 'agriculture',
    title: 'Agriculture Investment',
    tagline: 'Sustainable Growth Through Smart Agriculture',
    heroImage: 'https://images.pexels.com/photos/2933243/pexels-photo-2933243.jpeg?auto=compress&cs=tinysrgb&w=1920',
    featuredImage: 'https://images.pexels.com/photos/4407311/pexels-photo-4407311.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc: 'AI-driven agricultural investments designed for sustainable food production and long-term growth.',
    longDesc:
      'Agriculture has always been a cornerstone of human civilization — and today, it represents one of the most resilient investment opportunities available. At NovaYield, we apply artificial intelligence to identify high-yield agricultural projects across the globe, from precision farming operations in North America to sustainable agribusiness ventures in emerging markets. Our AI engine analyzes weather patterns, commodity prices, supply chain logistics, and regional regulations to select projects with the highest probability of consistent returns. By investing in agriculture through NovaYield, you are not only building wealth — you are contributing to global food security and sustainable farming practices that will feed generations to come.',
    benefits: [
      'Stable, harvest-backed returns uncorrelated with traditional equity markets',
      'Exposure to global food demand growth as populations expand',
      'Inflation-resistant asset class with tangible underlying value',
      'Diversification across crops, regions, and farming methods',
      'Positive environmental and social impact through sustainable practices',
    ],
    riskManagement: [
      'AI-driven crop selection based on climate, soil, and market data',
      'Geographic diversification to mitigate regional weather risk',
      'Crop insurance and forward contracts to lock in prices',
      'Continuous monitoring of supply chain and logistics factors',
      'Quarterly portfolio rebalancing based on performance analytics',
    ],
    expectedReturns:
      'Investors in our agriculture sector typically see daily returns of 2-8% based on the selected plan, with total ROI ranging from 60% to 240% over a 30-day investment cycle. Returns are credited daily and can be withdrawn or reinvested at any time.',
    whyChoose: [
      'NovaYield partners with established farming cooperatives and agribusiness operators worldwide',
      'Our AI engine has analyzed over 50,000 agricultural data points to optimize project selection',
      'Every project undergoes rigorous due diligence before being offered to investors',
      'Transparent, real-time tracking of your investment performance through our dashboard',
    ],
    cta: 'Start Investing in Agriculture',
  },
  {
    slug: 'real-estate',
    title: 'Real Estate Investment',
    tagline: 'Build Lasting Wealth with Premium Real Estate',
    heroImage: 'https://images.pexels.com/photos/302769/pexels-photo-302769.jpeg?auto=compress&cs=tinysrgb&w=1920',
    featuredImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc: 'Premium residential and commercial property investment opportunities across global markets.',
    longDesc:
      'Real estate has long been one of the most reliable wealth-building vehicles available to investors. NovaYield brings this time-tested asset class into the AI era by using machine learning to identify undervalued properties, emerging neighborhoods, and high-yield commercial opportunities across 25+ countries. Our platform provides fractional access to premium real estate projects that were once reserved for institutional investors — from luxury residential developments in major metropolitan areas to commercial properties in high-growth emerging markets. Every property in our portfolio is selected by AI, vetted by experienced real estate professionals, and managed for maximum rental yield and capital appreciation.',
    benefits: [
      'Passive income through rental yields and property appreciation',
      'Tangible, inflation-resistant asset with intrinsic value',
      'Access to institutional-grade properties with fractional investment',
      'Diversification across residential, commercial, and mixed-use developments',
      'Hedge against stock market volatility and currency fluctuations',
    ],
    riskManagement: [
      'AI-powered property valuation using 200+ data points per asset',
      'Strict loan-to-value ratios and conservative leverage policies',
      'Geographic and asset-class diversification across global markets',
      'Comprehensive insurance coverage on every property in the portfolio',
      'Regular market revaluation with automatic exit strategies for underperforming assets',
    ],
    expectedReturns:
      'Real estate investments through NovaYield typically generate daily returns of 2-8% depending on the plan selected, with total ROI between 60% and 240% over a 30-day cycle. Returns combine rental yield and capital appreciation, credited daily to your wallet.',
    whyChoose: [
      'Access premium properties in New York, London, Dubai, Singapore, and emerging markets',
      'AI identifies opportunities before they reach traditional real estate channels',
      'Fractional investment means you can start with as little as $100',
      'Full transparency — track every property in your portfolio through our dashboard',
    ],
    cta: 'Start Investing in Real Estate',
  },
  {
    slug: 'oil-gas',
    title: 'Oil & Gas Investment',
    tagline: 'Powering Portfolios with Energy Investments',
    heroImage: 'https://images.pexels.com/photos/247763/pexels-photo-247763.jpeg?auto=compress&cs=tinysrgb&w=1920',
    featuredImage: 'https://images.pexels.com/photos/247762/pexels-photo-247762.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc: 'High-performing energy investments backed by AI market intelligence and global infrastructure.',
    longDesc:
      'The energy sector remains one of the most profitable investment landscapes in the world, and NovaYield gives you AI-optimized access to it. Our artificial intelligence engine continuously analyzes geopolitical events, supply and demand dynamics, OPEC decisions, and infrastructure developments to identify the highest-yield oil and gas opportunities — from upstream exploration projects to midstream pipeline infrastructure and downstream refining operations. We partner with established energy operators across North America, the Middle East, and emerging African energy markets to provide investors with exposure to this high-yield sector while managing risk through AI-driven portfolio diversification.',
    benefits: [
      'High yield potential in both rising and stable energy markets',
      'Exposure to global energy demand that powers the world economy',
      'Diversification across upstream, midstream, and downstream operations',
      'AI-optimized entry and exit timing based on market intelligence',
      'Hedge against inflation through commodity-backed returns',
    ],
    riskManagement: [
      'AI monitoring of geopolitical risks and supply-demand shifts',
      'Diversification across extraction, transport, and refining operations',
      'Hedging strategies using futures contracts to lock in margins',
      'Strict exposure limits per project and per geographic region',
      'Real-time alerts and automatic rebalancing on market-moving events',
    ],
    expectedReturns:
      'Oil & gas investments through NovaYield typically deliver daily returns of 2-8% based on the selected plan, with total ROI of 60% to 240% over a 30-day cycle. Energy sector returns are often higher during periods of price volatility, which our AI engine is designed to capitalize on.',
    whyChoose: [
      'Partnerships with established energy operators across three continents',
      'AI engine processes 10,000+ data points daily to time entries and exits',
      'Access to projects traditionally reserved for institutional investors',
      'Transparent performance tracking with daily profit crediting',
    ],
    cta: 'Start Investing in Oil & Gas',
  },
  {
    slug: 'gold-mining',
    title: 'Gold Mining Investment',
    tagline: 'Unlock the Wealth of Tomorrow Through Precious Metals',
    heroImage: 'https://images.pexels.com/photos/4704414/pexels-photo-4704414.jpeg?auto=compress&cs=tinysrgb&w=1920',
    featuredImage: 'https://www.goldmarket.fr/wp-content/uploads/2025/08/thumbnail-148.jpeg.webp',
    shortDesc: 'Invest in precious metals through AI-powered portfolio diversification and mining operations.',
    longDesc:
      'Gold has been a store of value for over 5,000 years — and in an era of economic uncertainty, it remains one of the most trusted hedges against inflation and market volatility. NovaYield applies artificial intelligence to identify the most promising gold mining operations, from established producers in North America and Australia to emerging mining districts in West Africa and South America. Our AI engine analyzes geological survey data, production costs, political stability, and gold price forecasts to select mining investments with the highest probability of strong returns. By investing in gold mining through NovaYield, you gain exposure to both the appreciation of gold prices and the operational leverage of mining companies.',
    benefits: [
      'Time-tested hedge against inflation and currency devaluation',
      'Tangible asset with intrinsic value recognized worldwide',
      'Exposure to both gold price appreciation and mining operational leverage',
      'Diversification across established and emerging mining districts',
      'Safe-haven asset that performs well during economic uncertainty',
    ],
    riskManagement: [
      'AI analysis of geological, operational, and political risk factors',
      'Diversification across mining companies and geographic regions',
      'Continuous monitoring of gold prices and automatic position adjustment',
      'Partnerships only with established, licensed mining operators',
      'Environmental and regulatory compliance verification on every project',
    ],
    expectedReturns:
      'Gold mining investments through NovaYield typically generate daily returns of 2-8% based on the selected plan, with total ROI between 60% and 240% over a 30-day cycle. Returns are driven by both gold price movements and mining operational efficiency.',
    whyChoose: [
      'Access to gold mining projects across four continents',
      'AI engine analyzes geological data to identify high-yield operations',
      'Combine the stability of gold with the leverage of mining operations',
      'Daily profit crediting with full withdrawal flexibility',
    ],
    cta: 'Start Investing in Gold Mining',
  },
  {
    slug: 'precious-stones',
    title: 'Precious Stones Investment',
    tagline: 'Rare Assets. Exceptional Returns.',
    heroImage: 'https://i.pinimg.com/1200x/10/52/69/105269a13728dc51c0acfed7d8619b8e.jpg',
    featuredImage: 'https://i.pinimg.com/736x/65/50/f8/6550f8590466f17dd9e21f847af4f5f7.jpg',
    shortDesc: 'Strategic investments in valuable gemstones and rare mining projects worldwide.',
    longDesc:
      'Precious stones — diamonds, emeralds, rubies, and sapphires — represent one of the most exclusive and least-correlated asset classes available to investors. NovaYield opens this rarefied world to everyday investors through AI-optimized gemstone investment portfolios. Our AI engine evaluates gemstone quality, rarity, market demand, and certified valuation data to build portfolios of investment-grade stones and mining projects. Each investment is backed by certified, insured gemstone assets held in secure vaults, providing a tangible store of value that has historically appreciated independent of stock and bond markets.',
    benefits: [
      'Highly portable, tangible asset with universal value recognition',
      'Low correlation with traditional financial markets',
      'Rarity-driven appreciation potential for investment-grade stones',
      'Diversification across diamond, emerald, ruby, and sapphire markets',
      'Certified, insured assets held in professional secure storage',
    ],
    riskManagement: [
      'Every gemstone certified by GIA, IGI, or equivalent independent labs',
      'AI valuation models cross-referenced with auction house price databases',
      'Full insurance coverage on all stones held in portfolio',
      'Diversification across gemstone types, sizes, and origins',
      'Secure vault storage with audited chain of custody',
    ],
    expectedReturns:
      'Precious stones investments through NovaYield typically generate daily returns of 2-8% based on the selected plan, with total ROI between 60% and 240% over a 30-day cycle. Returns reflect both gemstone market appreciation and portfolio optimization by our AI engine.',
    whyChoose: [
      'Access to investment-grade gemstones typically reserved for ultra-high-net-worth investors',
      'AI engine identifies undervalued stones before market repricing',
      'Every stone is certified, insured, and held in professional vaults',
      'Start with as little as $100 — fractional access to a rare asset class',
    ],
    cta: 'Start Investing in Precious Stones',
  },
  {
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence Investment',
    tagline: 'Investing in the Technology That Powers NovaYield',
    heroImage: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1920',
    featuredImage: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg?auto=compress&cs=tinysrgb&w=1200',
    shortDesc: 'Innovative AI technologies transforming investment decisions and portfolio management.',
    longDesc:
      'Artificial intelligence is not just the engine behind NovaYield — it is also one of the most compelling investment opportunities of our generation. NovaYield provides investors with AI-optimized exposure to the companies and technologies driving the AI revolution, from machine learning infrastructure and semiconductor manufacturers to enterprise AI software and autonomous systems. Our AI engine evaluates thousands of AI-focused companies, identifying those with the strongest fundamentals, most defensible technology, and greatest growth potential. By investing in AI through NovaYield, you are both benefiting from AI and investing in the sector that is reshaping every industry on earth.',
    benefits: [
      'Exposure to the fastest-growing technology sector in history',
      'AI-optimized selection of the strongest AI companies and technologies',
      'Diversification across hardware, software, and applied AI companies',
      'Access to private AI startups alongside established public companies',
      'Benefit from the same technology that powers your investment platform',
    ],
    riskManagement: [
      'AI-driven fundamental analysis of every company in the portfolio',
      'Diversification across AI subsectors and market capitalizations',
      'Strict exposure limits on early-stage and pre-revenue companies',
      'Continuous monitoring of competitive landscape and technology shifts',
      'Automatic position adjustment based on valuation and momentum signals',
    ],
    expectedReturns:
      'AI sector investments through NovaYield typically generate daily returns of 2-8% based on the selected plan, with total ROI between 60% and 240% over a 30-day cycle. The AI sector historically offers some of the highest growth potential in technology investing.',
    whyChoose: [
      'Invest in the same technology that powers NovaYield\'s investment engine',
      'AI identifies the strongest AI companies before the broader market does',
      'Mix of established public companies and high-growth private AI startups',
      'Daily profit crediting with full transparency and withdrawal flexibility',
    ],
    cta: 'Start Investing in AI',
  },
];

export function getSector(slug: string): Sector | undefined {
  return sectors.find((s) => s.slug === slug);
}
