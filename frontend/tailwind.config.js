/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.tsx",
        "./src/**/*.ts",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    main: 'var(--color-bg-main)',
                    card: 'var(--color-bg-card)',
                },
                text: {
                    primary: 'var(--color-text-primary)',
                    secondary: 'var(--color-text-secondary)',
                    muted: 'var(--color-text-muted)',
                },
                brand: {
                    primary: 'var(--color-brand-primary)',
                    secondary: 'var(--color-brand-secondary)',
                    accent: 'var(--color-brand-accent)',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
