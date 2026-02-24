import './globals.css';

export const metadata = {
  title: 'Chud Investment Group | Student Liquidity Solutions',
  description: 'Providing liquidity to University of Michigan students through innovative derivative products.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
