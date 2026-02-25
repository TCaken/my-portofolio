/**
 * Experiments / "What I'm building" – things that live here or will move to their own site.
 * Use external: true + href for ones that have "moved out".
 */
export const experiments = [
  {
    id: 'cpf-tax-calculator',
    title: 'Singapore CPF & Tax Calculator',
    description: 'Estimate CPF and income tax from basic salary, bonus, rent, and trade/other income. 2025 rules.',
    href: '/experiments/cpf-tax-calculator',
    external: false,
    status: 'here',
  },
  {
    id: 'indonesia-tax-calculator',
    title: 'Indonesia Tax Calculator (PPh 21)',
    description: 'Estimate Pajak Penghasilan from salary and other income. PTKP and progressive rates (IDR).',
    href: '/experiments/indonesia-tax-calculator',
    external: false,
    status: 'here',
  },
  {
    id: 'projectile-calculator',
    title: 'Parabolic (Projectile) Motion',
    description: 'Interactive cannon: set initial x, height, velocity and angle. See range, max height, time, and trajectory behind grid.',
    href: '/experiments/projectile-calculator',
    external: false,
    status: 'here',
  },
  {
    id: 'placeholder-1',
    title: 'Coming soon',
    description: 'Small tools and experiments. Some stay here, some move out when they grow.',
    href: null,
    external: false,
    status: 'here',
  },
  // Example when you have one that moved out:
  // {
  //   id: 'my-tool',
  //   title: 'My Cool Tool',
  //   description: 'Does something useful.',
  //   href: 'https://mytool.example.com',
  //   external: true,
  //   status: 'moved',
  // },
]
