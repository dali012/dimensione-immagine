import React from "react";
import { PageTransition } from "../components/Layout/PageTransition";
import { Link } from "react-router-dom";
import { CheckCircle2, ShoppingCart } from "lucide-react";

export const ThankYou: React.FC = () => {
  return (
    <PageTransition>
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center">
        <section className="container mx-auto px-6 py-12 max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="mx-auto w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
              <CheckCircle2 size={36} className="text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">
              Grazie per la tua richiesta
            </h1>
            <p className="text-gray-600 mb-6">
              Abbiamo ricevuto la tua richiesta B2B. Il nostro team ti
              risponderà il prima possibile.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              <a
                href="https://shop.dimensioneimmagineabbigliamento.it"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#b89b5e] text-white rounded-lg font-medium shadow"
              >
                <ShoppingCart size={16} />
                Vai allo shop
              </a>
              <Link
                to="/"
                className="text-sm text-brand-text-secondary underline"
              >
                Torna alla home
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ThankYou;
