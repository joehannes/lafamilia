import React, { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { generateWhatsAppMessage } from "../utils/whatsapp";
import { useBrand } from "../contexts/BrandContext";
import { PricingOption } from "../services/toursService";
import MarkdownRenderer from "./ui/MarkdownRenderer";

interface TourCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  pricingOptions?: PricingOption[];
  excursionName: string;
  detailsPath: string;
  enabled?: boolean;
  showPrice?: boolean;
  showDetailsLink?: boolean;
}

const buildPaymentHref = (baseLink: string, amount: number | null): string => {
  const trimmedLink = String(baseLink ?? "").trim();

  if (!trimmedLink || !amount) {
    return "";
  }

  const normalizedBase = trimmedLink
    .replace(/\/$/, "")
    .replace(/\/\d+(?:\.\d+)?$/, "");
  return `${normalizedBase}/${amount}`;
};

const TourCard: React.FC<TourCardProps> = ({
  image,
  title,
  description,
  price,
  pricingOptions = [],
  excursionName,
  detailsPath,
  enabled = true,
  showPrice = true,
  showDetailsLink = true,
}) => {
  const intl = useIntl();
  const { brandSettings } = useBrand();
  const resolvedPricingOptions =
    pricingOptions.length > 0
      ? pricingOptions
      : [
          {
            tier: intl.locale === "es" ? "Personas" : "People",
            price,
            amount: null,
          },
        ];
  const [selectedDate, setSelectedDate] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    resolvedPricingOptions.reduce<Record<string, number>>(
      (accumulator, option, index) => {
        accumulator[option.tier] = index === 0 ? 1 : 0;
        return accumulator;
      },
      {},
    ),
  );

  const totalAmount = useMemo(
    () =>
      resolvedPricingOptions.reduce((sum, option) => {
        const quantity = quantities[option.tier] ?? 0;
        return sum + (option.amount ?? 0) * quantity;
      }, 0),
    [quantities, resolvedPricingOptions],
  );

  const selectedQuantitySummary = resolvedPricingOptions
    .filter((option) => (quantities[option.tier] ?? 0) > 0)
    .map((option) => `${option.tier}: ${quantities[option.tier]}`)
    .join(", ");

  const paypalHref = useMemo(
    () => buildPaymentHref(brandSettings.paypalMeLink, totalAmount || null),
    [brandSettings.paypalMeLink, totalAmount],
  );
  const verifoneHref = useMemo(
    () => buildPaymentHref(brandSettings.verifoneLink, totalAmount || null),
    [brandSettings.verifoneLink, totalAmount],
  );

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat(intl.locale === "es" ? "es-DO" : "en-US", {
        dateStyle: "full",
      }).format(new Date(`${selectedDate}T00:00:00`))
    : "";

  const handleQuantityChange = (tier: string, nextValue: string) => {
    const parsedValue = Math.max(0, Number(nextValue) || 0);
    setQuantities((current) => ({ ...current, [tier]: parsedValue }));
  };

  const handleBookNow = () => {
    let message = "";
    message += `Hello, I want to book ${excursionName}\n`;
    message += `Participants: ${selectedQuantitySummary || "N/A"}\n`;
    message += `Preferred date: ${formattedSelectedDate || "Not specified"}\n`;
    message += `Price: ${totalAmount > 0 ? totalAmount : price} USD`;
    message += `\n`;
    message += `Hola, deseo reservar el ${excursionName}\n`;
    message += `Participantes: ${selectedQuantitySummary || "N/A"}\n`;
    message += `Fecha preferida: ${formattedSelectedDate || "No especificada"}\n`;
    message += `Precio: ${totalAmount > 0 ? totalAmount : price} USD`;

    const whatsappUrl = generateWhatsAppMessage(
      brandSettings.phoneNumber,
      message,
    );

    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <article className="flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(24,50,74,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:shadow-[0_30px_90px_rgba(24,50,74,0.16)]">
      <div className="relative">
        <Link
          to={detailsPath}
          className="block overflow-hidden"
          aria-label={title}
        >
          <img
            src={image}
            alt={title}
            className="h-56 w-full object-cover transition duration-500 hover:scale-105"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/30 to-transparent" />
      </div>

      <div className="relative z-10 space-y-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          {showDetailsLink && (
            <Link
              to={detailsPath}
              className="whitespace-nowrap text-sm font-semibold text-rose-600 hover:text-rose-700"
            >
              <FormattedMessage
                id="details.view"
                defaultMessage="View details"
              />
            </Link>
          )}
        </div>
        <MarkdownRenderer content={description} />

        {showPrice && (
          <div className="flex flex-wrap gap-2">
            {resolvedPricingOptions.map((option) => (
              <span
                key={`${title}-${option.tier}`}
                className="rounded-full border border-white/80 bg-white/70 px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm"
              >
                {option.tier}: {option.price}
              </span>
            ))}
          </div>
        )}

        {enabled && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {resolvedPricingOptions.map((option) => (
                <label
                  key={option.tier}
                  className="space-y-2 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-sm"
                >
                  <span className="block text-sm font-semibold text-slate-700">
                    {option.tier}
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={quantities[option.tier] ?? 0}
                    onChange={(event) =>
                      handleQuantityChange(option.tier, event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-slate-700 outline-none focus:border-rose-400"
                  />
                </label>
              ))}
            </div>

            <label className="block space-y-2 text-left">
              <span className="text-sm font-medium text-slate-700">
                <FormattedMessage
                  id="tours.dateLabel"
                  defaultMessage="Select your preferred date"
                />
              </span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
              />
            </label>

            <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(240,231,235,0.85),rgba(255,255,255,0.82))] px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
              <FormattedMessage
                id="payment.total"
                defaultMessage="Payment total"
              />
              : {totalAmount > 0 ? `$${totalAmount}` : price}
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBookNow}
                className="tropical-button w-full"
              >
                <FormattedMessage id="tours.bookNow" />
              </button>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {paypalHref && (
                  <a
                    href={paypalHref}
                    target="_blank"
                    rel="noreferrer"
                    className="tropical-button-outline w-full text-center"
                  >
                    <FormattedMessage
                      id="payment.paypal"
                      defaultMessage="Pay with PayPal"
                    />
                  </a>
                )}
                {verifoneHref && (
                  <a
                    href={verifoneHref}
                    target="_blank"
                    rel="noreferrer"
                    className="tropical-button-outline w-full text-center"
                  >
                    <FormattedMessage
                      id="payment.verifone"
                      defaultMessage="Pay with Verifone"
                    />
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </article>
  );
};

export default TourCard;
