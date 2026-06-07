"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="divide-y divide-neutral-300">
      {items.map((item, index) => (
        <div key={index} className="border-b border-neutral-300 last:border-b-0">
          <button
            onClick={() => toggle(index)}
            className="w-full flex justify-between items-center py-5 bg-transparent border-none cursor-pointer text-left"
            aria-expanded={openIndex === index}
          >
            <span className="text-[17px] font-semibold pr-4">{item.question}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`text-neutral-500 flex-shrink-0 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div
            className="overflow-hidden transition-all duration-300"
            style={{
              maxHeight: openIndex === index ? "500px" : "0",
            }}
          >
            <div className="pb-5 text-neutral-700 text-[15px] leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
