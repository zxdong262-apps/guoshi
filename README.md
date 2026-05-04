# Guoshi (国士)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[中文](README_CN.md) | English

A static website honoring China's national heroes (国士) - featuring portraits, famous quotes, and artistic style variations， for easy saving as images, printing, or PDF.

URL: [https://guoshi.pages.dev](https://guoshi.pages.dev)

## Features

- **National Heroes**: Featuring portraits and quotes from China's most influential figures
- **Multiple Art Styles**: Each portrait available in 6 styles:
  - Original
  - Black & White
  - Pixel Art
  - Sketch
  - Sepia
  - Vintage
- **Print Support**: Print any page or save as PDF
- **Save as Image**: Download portraits in any style
- **Responsive Design**: Works on desktop and mobile
- **Fast Loading**: Static site deployed on Cloudflare Workers

## National Heroes

### Politicians (政治家)
- 毛泽东 (Mao Zedong) - Founding father of PRC

### Scientists (科学家)
- 钱学森 (Qian Xuesen) - Father of Chinese Aerospace
- 袁隆平 (Yuan Longping) - Father of Hybrid Rice

## Development

### Prerequisites

- Node.js >= 18.0.0
- npm

### Setup

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Start development server
npm start
```

### Scripts

- `npm run build` - Build the static site to `public/` directory
- `npm start` - Start development server
- `npm test` - Run integration tests
- `npm run clean` - Remove build output

## Deployment

This site is deployed to Cloudflare Workers using GitHub Actions. The deployment workflow:

1. Push to `main` branch
2. GitHub Actions builds the site
3. Deploys to Cloudflare Workers

### Required Secrets

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Adding a New Person

1. Add person data to `src/data/persons.js`
2. Include: id, name, nameEn, lifeYears, title, description, quote, photoUrl
3. Run `npm run build` to generate images and pages
4. Submit a Pull Request

### Reporting Issues

If you find any issues, please open an issue on GitHub.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
