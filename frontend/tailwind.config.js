/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'avatar-color': "url('/img/avatar/color_atlas.gif')",
        'avatar-eyes': "url('/img/avatar/eyes_atlas.gif')",
        'avatar-mouth': "url('/img/avatar/mouth_atlas.gif')",
        'arrow': "url('/img/avatar/arrow.gif')",
      }
    },
  },
  plugins: [
    // eslint-disable-next-line no-undef
    require('daisyui'),
  ],
}