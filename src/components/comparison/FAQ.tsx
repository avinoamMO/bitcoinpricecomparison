"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqItems } from "@/data/faq";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-20 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <span className="font-semibold text-foreground pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <p className="px-5 pb-4 text-muted-foreground leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
