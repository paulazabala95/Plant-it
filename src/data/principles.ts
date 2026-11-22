// The principles Plant It's educational guidance rests on, each with the evidence behind it.
// Full references in SOURCES.md ("Principles"). Text only: no money maths here.

export interface Evidence {
  /** What the study found, in plain words, with its own caveats. */
  finding: string
  /** Short citation. */
  source: string
  url: string
}

export interface Principle {
  id: string
  title: string
  /** One plain sentence. */
  idea: string
  /** Where Plant It applies it. */
  inPlantIt: string
  evidence: Evidence[]
}

export const PRINCIPLES: Principle[] = [
  {
    id: 'invest-more',
    title: 'Invest more, behave like you',
    idea: "Women don't invest worse. They invest less. The fix is investing more, not copying how men invest.",
    inPlantIt:
      'Your twin is a typical man in your country. When you invest your usual way, with low costs and little trading, you can end ahead of him.',
    evidence: [
      {
        finding:
          'Men traded 45% more than women, and earned net risk-adjusted returns about 1.4 percentage points a year lower (US brokerage accounts, 1991 to 1997).',
        source: 'Barber & Odean (2001), Boys Will Be Boys, Quarterly Journal of Economics 116(1)',
        url: 'https://faculty.haas.berkeley.edu/odean/papers/gender/gender.html',
      },
      {
        finding:
          'Single women in the EU are 3.8 percentage points less likely than comparable single men to hold risky financial assets, with the same income, education and job.',
        source: 'Darvas & Ruer (2025), Bruegel Working Paper 26/2025',
        url: 'https://www.bruegel.org/working-paper/gender-wealth-inequality-european-union-distributional-perspective',
      },
    ],
  },
  {
    id: 'buffer',
    title: 'Buffer first',
    idea: "Keep some savings within easy reach before you invest, so a surprise doesn't force you to sell.",
    inPlantIt: 'In the Investing scenario, 10% of what you save stays in a savings account.',
    evidence: [
      {
        finding:
          "Investors with at least $2,000 in emergency savings reported 21% higher financial well-being than those with none. It's a survey of 12,400 Vanguard investors, so it shows a link, not cause and effect.",
        source: 'Vanguard (2025), Emergency savings, financial well-being and financial stress',
        url: 'https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/emergency-savings-may-hold-key-financial-well-being',
      },
      {
        finding:
          'In nearly half of the EU countries studied, women are less likely than men to be financially resilient, even though their everyday money habits are as good or better.',
        source: 'Eurosystem financial literacy network (2026), gender differences',
        url: 'https://www.ecb.europa.eu/press/pubbydate/2026/html/ecb.fln_gender_differences.en.html',
      },
    ],
  },
  {
    id: 'time',
    title: 'Match your money to its time',
    idea: 'Money you need within a few years stays safe. Money for decades from now can be invested.',
    inPlantIt:
      'Your retirement garden is invested for decades. Short-term goals, like a deposit or a baby buffer, belong in a savings account.',
    evidence: [
      {
        finding:
          'Since 1900, shares have beaten bonds, bills and inflation in every country with a continuous history, with real returns of about 6.6% a year against 1.6% for bonds (1900 to 2025). They also had deep falls along the way, which is why short-term money stays out.',
        source: 'UBS Global Investment Returns Yearbook 2026 (Dimson, Marsh & Staunton)',
        url: 'https://www.ubs.com/global/en/investment-bank/insights-and-data/articles/global-investment-returns-yearbook-2026.html',
      },
    ],
  },
  {
    id: 'start-early',
    title: 'Start early',
    idea: 'Growth earns growth. The earlier money is planted, the longer it compounds.',
    inPlantIt:
      'The "I wait before I start" slider shows what waiting costs, worked out month by month by the Plant It engine.',
    evidence: [
      {
        finding:
          'Plant It compounds every month, using the sourced returns listed under "Where do these numbers come from?".',
        source: 'Plant It engine and SOURCES.md',
        url: 'https://github.com/paulazabala95/Plant-it/blob/claude/plant-it-app-asuemi/SOURCES.md',
      },
    ],
  },
  {
    id: 'low-costs',
    title: 'Keep costs low',
    idea: 'Fees come out every year, so small differences grow large over decades.',
    inPlantIt:
      'Index funds and ETFs are modelled with their real 2024 costs, and active funds with theirs.',
    evidence: [
      {
        finding:
          'Before costs, the average actively managed euro earns the market return, so after costs it must earn less than the average passive euro.',
        source:
          'Sharpe (1991), The Arithmetic of Active Management, Financial Analysts Journal 47(1)',
        url: 'https://web.stanford.edu/~wfsharpe/art/art.htm',
      },
      {
        finding:
          'In 2024, equity ETFs cost about 0.21% a year against 1.28% for actively managed equity funds in the EU.',
        source: 'ESMA (2025), Costs and Performance of EU Retail Investment Products, MR-CP.14',
        url: 'https://www.esma.europa.eu/sites/default/files/2026-03/ESMA50-1949966494-4065_Market_Report_-_Costs_and_Performance_of_EU_Retail_Investment_Products.pdf',
      },
    ],
  },
  {
    id: 'spread',
    title: 'Spread widely',
    idea: "A broad fund holds thousands of companies, so you don't need to pick the winners.",
    inPlantIt:
      'Single stocks grow as sunflowers: a few shoot up, most wilt. They are never part of the Investing scenario.',
    evidence: [
      {
        finding:
          'Most US stocks since 1926 returned less over their lifetime than one-month Treasury bills. The best-performing 4% of companies explain the whole net gain of the stock market.',
        source:
          'Bessembinder (2018), Do Stocks Outperform Treasury Bills?, Journal of Financial Economics 129(3)',
        url: 'https://wpcarey.asu.edu/department-finance/faculty-research/do-stocks-outperform-treasury-bills',
      },
    ],
  },
  {
    id: 'trade-less',
    title: 'Trade less',
    idea: 'Buying and selling often costs money and usually lowers returns.',
    inPlantIt: "Your twin's garden carries the cost of overtrading on single stocks and crypto.",
    evidence: [
      {
        finding:
          'The US households that traded most earned 11.4% a year while the market returned 17.9% (66,465 households, 1991 to 1996).',
        source:
          'Barber & Odean (2000), Trading Is Hazardous to Your Wealth, Journal of Finance 55(2)',
        url: 'https://faculty.haas.berkeley.edu/odean/papers/returns/returns.html',
      },
    ],
  },
  {
    id: 'automate',
    title: 'Make it automatic',
    idea: 'A plan that runs on payday beats willpower.',
    inPlantIt: 'Your checklist asks you to set up a monthly plan and a yearly check-up.',
    evidence: [
      {
        finding:
          'When a company enrolled new staff automatically into its pension plan, far more of them saved, and most kept the default amount and investments.',
        source:
          'Madrian & Shea (2001), The Power of Suggestion, Quarterly Journal of Economics 116(4)',
        url: 'https://www.nber.org/papers/w7682',
      },
      {
        finding:
          'Employees who committed future pay rises to saving raised their saving rate from 3.5% to 13.6% after four raises. A US Department of Labor review rates the causal evidence as low.',
        source:
          'Thaler & Benartzi (2004), Save More Tomorrow, Journal of Political Economy 112(S1)',
        url: 'https://www.anderson.ucla.edu/faculty/shlomo.benartzi/savemore.htm',
      },
    ],
  },
  {
    id: 'education',
    title: 'Education, not advice',
    idea: 'Plant It explains how money grows. It never tells you which product to buy.',
    inPlantIt:
      'No products or providers are recommended. Personal recommendations about specific investments are regulated investment advice in the EU.',
    evidence: [
      {
        finding:
          'Under MiFID II, investment advice means personal recommendations about specific financial instruments. General information and education fall outside it.',
        source: 'ESMA (2023), supervisory briefing on the definition of advice',
        url: 'https://www.esma.europa.eu/press-news/esma-news/esma-updates-its-guidance-definition-advice-supervisory-briefing',
      },
    ],
  },
]
