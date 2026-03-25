import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const yamlContent = fs.readFileSync(path.resolve(__dirname, './src/companies.yml'), 'utf-8');
const companyColors = {};
const regex = /id:\s*'?([^'\s]+)'?\s*color:\s*'?([^'\s]+)'?/g;
let match;
while ((match = regex.exec(yamlContent)) !== null) {
	companyColors[match[1]] = match[2];
}

const safelist = Object.keys(companyColors).map(id => `bg-${id}`);

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	safelist,
	theme: {
		extend: {
			colors: {
				primary: '#ACCEB6',
				secondary: '#B1C7C8',
				accent: '#52CCDA',
				background: '#151616',
				text: '#EAEFED',
				...companyColors
			}
		},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '3rem',
				xl: '2.5rem',
				'2xl': '2rem',
			},
			screens: {
				sm: '600px',
				md: '728px',
				lg: '984px',
				xl: '1200px',
				'2xl': '1500px',
			},
		}
	},
	plugins: [],
}
