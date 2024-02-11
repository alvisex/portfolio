/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '5rem',
				xl: '5rem',
				'2xl': '8rem',
			},
			screens: {
				sm: '600px',
				md: '728px',
				lg: '984px',
				xl: '1200px',
				'2xl': '1496px',
			},
		}
	},
	plugins: [require('flowbite/plugin')],
}
