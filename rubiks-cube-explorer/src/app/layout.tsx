import type { Metadata } from 'next';
import './globals.css';
import ClientBody from './ClientBody';

export const metadata: Metadata = {
  title: "Rubik's Cube Explorer",
  description: "An interactive presentation to help you understand the basics of Rubik's Cube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClientBody>{children}</ClientBody>
    </html>
  );
}
