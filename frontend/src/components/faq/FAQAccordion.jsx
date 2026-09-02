import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Accessible FAQ accordion. Pair with faqPageSchema(faqs) in <SEO>.
 * @param {Array}  faqs           [{ id, question, answer }]
 * @param {string} headingLevel   "h3" (default) — keeps hierarchy under a section H2
 * @param {number} defaultOpenId
 */
export default function FAQAccordion({ faqs = [], headingLevel: Heading = "h3", defaultOpenId = null, className }) {
  const [openId, setOpenId] = useState(defaultOpenId ?? faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  return (
    <div className={cn("divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white", className)}>
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        const panelId = `faq-panel-${faq.id}`;
        const buttonId = `faq-button-${faq.id}`;
        return (
          <div key={faq.id}>
            <Heading className="m-0 text-base font-semibold">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-brand-50/60",
                  isOpen && "bg-brand-50/60"
                )}
              >
                <span className={cn("text-[15px] font-semibold", isOpen ? "text-brand-900" : "text-slate-800")}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-brand-600 transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden="true"
                />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600"
            >
              {faq.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
