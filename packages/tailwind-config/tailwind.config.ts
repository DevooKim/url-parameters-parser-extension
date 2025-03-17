import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      fontFamily: {
        Pretendard: ['Pretendard', 'sans-serif'],
      },
      spacing: {
        '120': '30rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
