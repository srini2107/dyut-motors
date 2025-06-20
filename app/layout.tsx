import type { Metadata } from "next";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from "./component/Header";
import Footer from "./component/Footer";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // Adjust the path based on your file structure
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "dyut motors",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Header />
            {children}
            <ToastContainer position="top-right" autoClose={3000} />
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
