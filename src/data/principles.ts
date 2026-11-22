// The principles Plant It's educational guidance rests on, each with the evidence behind it.
// Two groups: why the gap exists (feminist economics) and how to grow your money (finance research).
// Full references in SOURCES.md ("Principles"). Text only: no money maths here.

export type EvidenceKind = 'Book' | 'Study' | 'Report' | 'Data'

export interface Evidence {
  kind: EvidenceKind
  /** Author(s) and year, e.g. "Goldin (2021)". */
  who: string
  /** Title and where it was published. */
  title: string
  /** What it found or argues, in plain words, with its own caveats. */
  finding: string
  url: string
}

export type PrincipleGroup = 'why' | 'how'

export interface Principle {
  id: string
  group: PrincipleGroup
  title: string
  /** One plain sentence. */
  idea: string
  /** Where Plant It applies it. */
  inPlantIt: string
  evidence: Evidence[]
}

export const PRINCIPLE_GROUPS: { id: PrincipleGroup; title: string; intro: string }[] = [
  {
    id: 'why',
    title: 'Why the gap exists',
    intro: 'Feminist economics: the gap is built into how work, care and money are counted.',
  },
  {
    id: 'how',
    title: 'How to grow your money',
    intro: 'What the research says works, for anyone who invests.',
  },
]

export const PRINCIPLES: Principle[] = [
  // Why the gap exists
  {
    id: 'care-is-work',
    group: 'why',
    title: 'Care is work, too',
    idea: "Raising children and caring for family is work that keeps the economy going, but it isn't paid or counted.",
    inPlantIt:
      'The baby, part-time and career-break cards show what unpaid care costs your garden. The copy is reason-neutral: time out is never a failure.',
    evidence: [
      {
        kind: 'Book',
        who: 'Waring (1988)',
        title: 'If Women Counted',
        finding:
          "The founding text of feminist economics: national accounts leave unpaid household work out of what counts as production, so women's work goes unseen in GDP.",
        url: 'https://en.wikipedia.org/wiki/If_Women_Counted',
      },
      {
        kind: 'Book',
        who: 'Folbre (2001)',
        title: 'The Invisible Heart: Economics and Family Values',
        finding:
          'Care for children, the old and the sick has been undervalued because women provided it at low or no cost, which helps explain why women earn less.',
        url: 'https://thenewpress.org/books/the-invisible-heart/',
      },
    ],
  },
  {
    id: 'how-work-is-built',
    group: 'why',
    title: 'The gap comes from how work is built',
    idea: 'Most of the pay gap opens after the first child, in jobs that reward long and unpredictable hours.',
    inPlantIt:
      "The motherhood penalty and fewer promotions are counted as the system, not your choices. Your twin's pay doesn't change when a baby arrives.",
    evidence: [
      {
        kind: 'Book',
        who: 'Goldin (2021)',
        title: 'Career and Family, Princeton University Press',
        finding:
          'By the 2023 Nobel laureate in economics: pay for identical work explains only a small part of the gap. Most comes from "greedy work", jobs that pay off for whoever can be on call, while mothers are on call at home.',
        url: 'https://press.princeton.edu/ideas/claudia-goldin-on-career-and-family',
      },
      {
        kind: 'Study',
        who: 'Kleven et al. (2019)',
        title: 'Child Penalties Across Countries, AEA Papers and Proceedings',
        finding:
          "Women's earnings drop sharply after the first child and stay lower for years, in every country studied. Men's barely move.",
        url: 'https://www.aeaweb.org/articles?id=10.1257/pandp.20191078',
      },
    ],
  },
  {
    id: 'wealth-not-pay',
    group: 'why',
    title: 'Count wealth, not just pay',
    idea: 'Small gaps in pay become big gaps in wealth, because wealth compounds for decades.',
    inPlantIt:
      'Your garden shows what your savings become at retirement, not your salary, so you see the gap where it ends up.',
    evidence: [
      {
        kind: 'Book',
        who: 'Chang (2010)',
        title: 'Shortchanged: Why Women Have Less Wealth, Oxford University Press',
        finding:
          'The gender wealth gap is far larger than the pay gap. Men ride a "wealth escalator" of benefits and assets while women carry a "debt anchor" (US data).',
        url: 'https://blogs.lse.ac.uk/lsereviewofbooks/2012/06/11/book-review-shortchanged-why-women-have-less-wealth-and-what-can-be-done-about-it',
      },
      {
        kind: 'Data',
        who: 'Eurostat (2026)',
        title: "Women's pension 25% lower than men's in 2024",
        finding:
          'Women over 65 in the EU received 24.5% less pension income than men in 2024, more than double the 11.1% pay gap.',
        url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20260225-1',
      },
    ],
  },
  {
    id: 'count-women',
    group: 'why',
    title: "What isn't measured isn't fixed",
    idea: 'Data often treats men as the default, so gaps that affect women stay hidden.',
    inPlantIt:
      'Every number has a source and says whether it is for your country or an EU average. Your twin separates what the system costs you from your own choices.',
    evidence: [
      {
        kind: 'Book',
        who: 'Criado Perez (2019)',
        title: 'Invisible Women: Data Bias in a World Designed for Men',
        finding:
          'From unpaid care to taxes, data that treats men as the default builds bias into systems. Closing the data gap is a first step, not the whole fix.',
        url: 'https://www.imf.org/en/publications/fandd/issues/2020/12/book-review-of-invisible-women-by-caroline-criado-perez',
      },
    ],
  },
  {
    id: 'fix-the-system',
    group: 'why',
    title: 'Fix the system, not the woman',
    idea: "You don't need more confidence. You need fair pay, shared care and good information.",
    inPlantIt:
      'Plant It never tells you to be more confident or to invest like a man. It shows how much of the gap is the system, and what a fair world would add.',
    evidence: [
      {
        kind: 'Book',
        who: 'Orgad & Gill (2022)',
        title: 'Confidence Culture, Duke University Press',
        finding:
          'Messages telling women to be more confident make them responsible for fixing themselves, and leave structural causes untouched.',
        url: 'https://www.dukeupress.edu/confidence-culture',
      },
    ],
  },

  // How to grow your money
  {
    id: 'invest-more',
    group: 'how',
    title: 'Invest more, behave like you',
    idea: "Women don't invest worse. They invest less. The fix is investing more, not copying how men invest.",
    inPlantIt:
      'Your twin is a typical man in your country. When you invest your usual way, with low costs and little trading, you can end ahead of him.',
    evidence: [
      {
        kind: 'Study',
        who: 'Barber & Odean (2001)',
        title: 'Boys Will Be Boys, Quarterly Journal of Economics 116(1)',
        finding:
          'Men traded 45% more than women and earned net risk-adjusted returns about 1.4 percentage points a year lower (US brokerage accounts, 1991 to 1997).',
        url: 'https://faculty.haas.berkeley.edu/odean/papers/gender/gender.html',
      },
      {
        kind: 'Study',
        who: 'Darvas & Ruer (2025)',
        title: 'Bruegel Working Paper 26/2025',
        finding:
          'Single women in the EU are 3.8 percentage points less likely than comparable single men to hold risky financial assets, with the same income, education and job.',
        url: 'https://www.bruegel.org/working-paper/gender-wealth-inequality-european-union-distributional-perspective',
      },
    ],
  },
  {
    id: 'learn-investing',
    group: 'how',
    title: 'Learn investing, not budgeting',
    idea: "Women already manage everyday money well. The gap is in knowing how investing works, and that's learnable.",
    inPlantIt:
      'Plant It explains how investing grows money instead of lecturing you about spending.',
    evidence: [
      {
        kind: 'Study',
        who: 'Eurosystem (2026)',
        title: 'Financial literacy network: gender differences',
        finding:
          "Across 20 EU countries there's almost no gender gap in everyday money habits, but a clear gap in investment knowledge (16% versus 5% for everyday decisions).",
        url: 'https://www.ecb.europa.eu/press/pubbydate/2026/html/ecb.fln_gender_differences.en.html',
      },
      {
        kind: 'Study',
        who: 'Lusardi & Mitchell (2008)',
        title:
          'Planning and Financial Literacy: How Do Women Fare?, American Economic Review 98(2)',
        finding:
          'Older US women scored lower on financial literacy, and those with less knowledge were less likely to plan for retirement.',
        url: 'https://www.nber.org/papers/w13750',
      },
    ],
  },
  {
    id: 'buffer',
    group: 'how',
    title: 'Buffer first',
    idea: "Keep some savings within easy reach before you invest, so a surprise doesn't force you to sell.",
    inPlantIt: 'In the Investing scenario, 10% of what you save stays in a savings account.',
    evidence: [
      {
        kind: 'Study',
        who: 'Vanguard (2025)',
        title: 'Emergency savings, financial well-being and financial stress',
        finding:
          "Investors with at least $2,000 in emergency savings reported 21% higher financial well-being than those with none. It's a survey of 12,400 Vanguard investors, so it shows a link, not cause and effect.",
        url: 'https://corporate.vanguard.com/content/corporatesite/us/en/corp/articles/emergency-savings-may-hold-key-financial-well-being',
      },
    ],
  },
  {
    id: 'give-it-a-job',
    group: 'how',
    title: 'Give your money a job',
    idea: 'Money set aside for something specific is easier to keep, and to keep apart from your retirement.',
    inPlantIt:
      '"Plan for something" lets you put money aside for a home, a baby or time off, separately from your garden.',
    evidence: [
      {
        kind: 'Book',
        who: 'Zelizer (1994)',
        title: 'The Social Meaning of Money, Princeton University Press',
        finding:
          'People don\'t treat money as one pot: they earmark it for purposes and relationships, from "pin money" to household budgets.',
        url: 'https://press.princeton.edu/isbn/9780691176031',
      },
    ],
  },
  {
    id: 'time',
    group: 'how',
    title: 'Match your money to its time',
    idea: 'Money you need within a few years stays safe. Money for decades from now can be invested.',
    inPlantIt:
      'Your retirement garden is invested for decades. Short-term goals, like a deposit or a baby buffer, stay in a savings account.',
    evidence: [
      {
        kind: 'Data',
        who: 'Dimson, Marsh & Staunton (2026)',
        title: 'UBS Global Investment Returns Yearbook 2026',
        finding:
          'Since 1900, shares have beaten bonds, bills and inflation in every country with a continuous history: about 6.6% a year after inflation, against 1.6% for bonds. They also had deep falls along the way, which is why short-term money stays out.',
        url: 'https://www.ubs.com/global/en/investment-bank/insights-and-data/articles/global-investment-returns-yearbook-2026.html',
      },
    ],
  },
  {
    id: 'start-early',
    group: 'how',
    title: 'Start early',
    idea: 'Growth earns growth. The earlier money is planted, the longer it compounds.',
    inPlantIt:
      'The "I wait before I start" slider shows what waiting costs, worked out month by month.',
    evidence: [
      {
        kind: 'Data',
        who: 'Plant It',
        title: 'Engine and sources',
        finding:
          'Plant It compounds every month, using the sourced returns listed under "Where do these numbers come from?".',
        url: 'https://github.com/paulazabala95/Plant-it/blob/claude/plant-it-app-asuemi/SOURCES.md',
      },
    ],
  },
  {
    id: 'low-costs',
    group: 'how',
    title: 'Keep costs low',
    idea: 'Fees come out every year, so small differences grow large over decades.',
    inPlantIt:
      'Index funds and ETFs are modelled with their real 2024 costs, and active funds with theirs.',
    evidence: [
      {
        kind: 'Study',
        who: 'Sharpe (1991)',
        title: 'The Arithmetic of Active Management, Financial Analysts Journal 47(1)',
        finding:
          'Before costs, the average actively managed euro earns the market return, so after costs it must earn less than the average passive euro.',
        url: 'https://web.stanford.edu/~wfsharpe/art/art.htm',
      },
      {
        kind: 'Report',
        who: 'ESMA (2025)',
        title: 'Costs and Performance of EU Retail Investment Products',
        finding:
          'In 2024, equity ETFs cost about 0.21% a year, against 1.28% for actively managed equity funds.',
        url: 'https://www.esma.europa.eu/sites/default/files/2026-03/ESMA50-1949966494-4065_Market_Report_-_Costs_and_Performance_of_EU_Retail_Investment_Products.pdf',
      },
    ],
  },
  {
    id: 'spread',
    group: 'how',
    title: 'Spread widely',
    idea: "A broad fund holds thousands of companies, so you don't need to pick the winners.",
    inPlantIt:
      'Single stocks grow as sunflowers: a few shoot up, most wilt. They are never part of the Investing scenario.',
    evidence: [
      {
        kind: 'Study',
        who: 'Bessembinder (2018)',
        title: 'Do Stocks Outperform Treasury Bills?, Journal of Financial Economics 129(3)',
        finding:
          'Most US stocks since 1926 returned less over their lifetime than one-month Treasury bills. The best 4% of companies explain the whole net gain of the stock market.',
        url: 'https://wpcarey.asu.edu/department-finance/faculty-research/do-stocks-outperform-treasury-bills',
      },
    ],
  },
  {
    id: 'trade-less',
    group: 'how',
    title: 'Trade less',
    idea: 'Buying and selling often costs money and usually lowers returns.',
    inPlantIt: "Your twin's garden carries the cost of overtrading on single stocks and crypto.",
    evidence: [
      {
        kind: 'Study',
        who: 'Barber & Odean (2000)',
        title: 'Trading Is Hazardous to Your Wealth, Journal of Finance 55(2)',
        finding:
          'The US households that traded most earned 11.4% a year while the market returned 17.9% (66,465 households, 1991 to 1996).',
        url: 'https://faculty.haas.berkeley.edu/odean/papers/returns/returns.html',
      },
    ],
  },
  {
    id: 'automate',
    group: 'how',
    title: 'Make it automatic',
    idea: 'A plan that runs on payday beats willpower.',
    inPlantIt: 'Your checklist asks you to set up a monthly plan and a yearly check-up.',
    evidence: [
      {
        kind: 'Study',
        who: 'Madrian & Shea (2001)',
        title: 'The Power of Suggestion, Quarterly Journal of Economics 116(4)',
        finding:
          'When a company enrolled new staff into its pension plan automatically, far more of them saved, and most kept the default amount and investments.',
        url: 'https://www.nber.org/papers/w7682',
      },
      {
        kind: 'Study',
        who: 'Thaler & Benartzi (2004)',
        title: 'Save More Tomorrow, Journal of Political Economy 112(S1)',
        finding:
          'Employees who committed future pay rises to saving raised their saving rate from 3.5% to 13.6% after four raises. A US Department of Labor review rates the causal evidence as low.',
        url: 'https://www.chicagobooth.edu/review/save-more-tomorrow',
      },
    ],
  },
  {
    id: 'education',
    group: 'how',
    title: 'Education, not advice',
    idea: 'Plant It explains how money grows. It never tells you which product to buy.',
    inPlantIt:
      'No products or providers are recommended. Personal recommendations about specific investments are regulated investment advice in the EU.',
    evidence: [
      {
        kind: 'Report',
        who: 'ESMA (2023)',
        title: 'Supervisory briefing on the definition of advice',
        finding:
          'Under MiFID II, investment advice means personal recommendations about specific financial instruments. General information and education fall outside it.',
        url: 'https://www.esma.europa.eu/press-news/esma-news/esma-updates-its-guidance-definition-advice-supervisory-briefing',
      },
    ],
  },
]
