import type { Config } from 'tailwindcss';

export default {
  theme: {
    extend: {
      fontFamily: {
        Pretendard: ['Pretendard', 'sans-serif'],
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
