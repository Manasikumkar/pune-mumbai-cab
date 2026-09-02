import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, CheckCircle2, MessageCircle, Phone, RotateCcw } from "lucide-react";
import { getVehicles, submitBooking } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { site, telLink, whatsappLink } from "../../config/site";
import { cn } from "../../utils/cn";
import { formatDate, todayISO } from "../../utils/formatters";
import {
  compose,
  isEmail,
  isIndianMobile,
  isNotPastDate,
  isOnOrAfter,
  isPositiveInt,
  maxLength,
  minLength,
  normalizeMobile,
  required,
} from "../../utils/validators";
import Button from "../ui/Button";

const TRIP_TYPES = [
  { value: "one-way", label: "One Way" },
  { value: "round-trip", label: "Round Trip" },
];

const baseDefaults = {
  name: "",
  mobile: "",
  email: "",
  pickup: "",
  drop: "",
  travelDate: "",
  travelTime: "",
  returnDate: "",
  tripType: "one-way",
  vehicle: "",
  passengers: 2,
  message: "",
  website: "", // honeypot
};

const inputClass = (hasError) =>
  cn(
    "block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm transition placeholder:text-slate-400",
    "focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
    hasError ? "border-red-400 bg-red-50/40" : "border-slate-300 hover:border-slate-400"
  );

function Field({ label, htmlFor, error, required: isRequired, hint, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {isRequired && (
          <span className="text-accent-600" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error.message}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Reusable booking / enquiry form.
 * Used on the Contact page (full) and inside the global "Book Your Cab" modal (compact).
 *
 * @param {object}   defaultValues  Pre-fill (e.g. { pickup: "Pune", drop: "Mumbai", vehicle: "suv" })
 * @param {boolean}  compact        Tighter layout for modals
 * @param {string}   source         Analytics tag sent with the payload
 * @param {Function} onSuccess      Called with the API result
 */
export default function BookingForm({ defaultValues = {}, compact = false, source = "contact-page", onSuccess }) {
  const { data: vehicles, loading: vehiclesLoading, error: vehiclesError } = useAsyncData(() => getVehicles(), []);
  const [submission, setSubmission] = useState({ state: "idle", result: null, error: null });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
    defaultValues: { ...baseDefaults, ...defaultValues },
  });

  const tripType = watch("tripType");
  const travelDate = watch("travelDate");
  const isSubmitting = submission.state === "submitting";

  const onSubmit = async (values) => {
    if (values.website) return; // bot filled the honeypot — silently ignore
    setSubmission({ state: "submitting", result: null, error: null });
    try {
      const payload = {
        name: values.name.trim(),
        mobile: normalizeMobile(values.mobile),
        email: values.email.trim() || null,
        pickup: values.pickup.trim(),
        drop: values.drop.trim(),
        travelDate: values.travelDate,
        travelTime: values.travelTime,
        tripType: values.tripType,
        returnDate: values.tripType === "round-trip" ? values.returnDate : null,
        vehicle: values.vehicle,
        passengers: Number(values.passengers),
        message: values.message.trim() || null,
        source,
      };
      const result = await submitBooking(payload);
      setSubmission({ state: "success", result, error: null });
      onSuccess?.(result);
    } catch (error) {
      setSubmission({ state: "error", result: null, error });
    }
  };

  const startOver = () => {
    reset({ ...baseDefaults, ...defaultValues });
    setSubmission({ state: "idle", result: null, error: null });
  };

  /* ---------------------------------------------------------------- */
  /* Success state                                                     */
  /* ---------------------------------------------------------------- */
  if (submission.state === "success") {
    const r = submission.result;
    const vehicleName = vehicles?.find((v) => v.slug === r.vehicle)?.name || r.vehicle;
    const summary = `Booking ref ${r.reference}: ${r.pickup} → ${r.drop} on ${formatDate(r.travelDate)} at ${r.travelTime}, ${vehicleName}, ${r.passengers} pax (${r.tripType}).`;
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" aria-hidden="true" />
        <h3 className="mt-3 text-xl font-bold text-slate-900">Booking request received!</h3>
        <p className="mt-2 text-sm text-slate-600">
          Thanks, <span className="font-semibold">{r.name}</span>. Your reference is{" "}
          <span className="font-mono font-bold text-brand-800">{r.reference}</span>. We'll confirm your cab and
          driver details on <span className="font-semibold">{r.mobile}</span> within 15 minutes.
        </p>
        <dl className="mx-auto mt-5 grid max-w-md grid-cols-2 gap-x-4 gap-y-2 rounded-xl bg-white p-4 text-left text-sm shadow-sm">
          <dt className="text-slate-500">Route</dt>
          <dd className="font-semibold text-slate-900">
            {r.pickup} → {r.drop}
          </dd>
          <dt className="text-slate-500">Date & time</dt>
          <dd className="font-semibold text-slate-900">
            {formatDate(r.travelDate)}, {r.travelTime}
          </dd>
          <dt className="text-slate-500">Cab</dt>
          <dd className="font-semibold text-slate-900">{vehicleName}</dd>
          <dt className="text-slate-500">Trip</dt>
          <dd className="font-semibold capitalize text-slate-900">
            {r.tripType.replace("-", " ")} · {r.passengers} pax
          </dd>
        </dl>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button variant="whatsapp" href={whatsappLink(summary)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Send details on WhatsApp
          </Button>
          <Button variant="outline" onClick={startOver}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" /> Book another cab
          </Button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /* Form                                                              */
  /* ---------------------------------------------------------------- */
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn(compact ? "space-y-4" : "space-y-5")}>
      {submission.state === "error" && (
        <div role="alert" className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
          <div>
            <p className="font-semibold">We couldn't submit your booking.</p>
            <p className="mt-0.5">
              {submission.error?.message || "Please try again."} You can also{" "}
              <a href={telLink} className="font-semibold underline">
                call {site.phoneDisplay}
              </a>{" "}
              or{" "}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                WhatsApp us
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {/* Honeypot — hidden from humans */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${source}-website`}>Website</label>
        <input id={`${source}-website`} type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className={cn("grid gap-4", compact ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
        <Field label="Full name" htmlFor={`${source}-name`} error={errors.name} required>
          <input
            id={`${source}-name`}
            type="text"
            autoComplete="name"
            placeholder="e.g. Rohan Deshmukh"
            className={inputClass(errors.name)}
            aria-invalid={!!errors.name}
            {...register("name", {
              validate: compose(required("Full name"), minLength(2, "Full name"), maxLength(80, "Full name")),
            })}
          />
        </Field>

        <Field label="Mobile number" htmlFor={`${source}-mobile`} error={errors.mobile} required>
          <input
            id={`${source}-mobile`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="98765 43210"
            className={inputClass(errors.mobile)}
            aria-invalid={!!errors.mobile}
            {...register("mobile", { validate: isIndianMobile })}
          />
        </Field>

        <Field
          label="Email"
          htmlFor={`${source}-email`}
          error={errors.email}
          hint="Optional — for your booking confirmation & GST invoice"
          className="sm:col-span-2"
        >
          <input
            id={`${source}-email`}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass(errors.email)}
            aria-invalid={!!errors.email}
            {...register("email", { validate: isEmail })}
          />
        </Field>

        <Field label="Pickup location" htmlFor={`${source}-pickup`} error={errors.pickup} required>
          <input
            id={`${source}-pickup`}
            type="text"
            autoComplete="off"
            placeholder="e.g. Hinjewadi Phase 1, Pune"
            className={inputClass(errors.pickup)}
            aria-invalid={!!errors.pickup}
            {...register("pickup", { validate: compose(required("Pickup location"), minLength(3, "Pickup location")) })}
          />
        </Field>

        <Field label="Drop location" htmlFor={`${source}-drop`} error={errors.drop} required>
          <input
            id={`${source}-drop`}
            type="text"
            autoComplete="off"
            placeholder="e.g. Mumbai Airport T2"
            className={inputClass(errors.drop)}
            aria-invalid={!!errors.drop}
            {...register("drop", { validate: compose(required("Drop location"), minLength(3, "Drop location")) })}
          />
        </Field>

        <Field label="Travel date" htmlFor={`${source}-date`} error={errors.travelDate} required>
          <input
            id={`${source}-date`}
            type="date"
            min={todayISO()}
            className={inputClass(errors.travelDate)}
            aria-invalid={!!errors.travelDate}
            {...register("travelDate", { validate: isNotPastDate })}
          />
        </Field>

        <Field label="Pickup time" htmlFor={`${source}-time`} error={errors.travelTime} required>
          <input
            id={`${source}-time`}
            type="time"
            className={inputClass(errors.travelTime)}
            aria-invalid={!!errors.travelTime}
            {...register("travelTime", { validate: required("Pickup time") })}
          />
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-1.5 block text-sm font-semibold text-slate-700">
            Trip type
            <span className="text-accent-600" aria-hidden="true">
              {" "}
              *
            </span>
          </legend>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
            {TRIP_TYPES.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "cursor-pointer rounded-lg py-2 text-center text-sm font-semibold transition",
                  tripType === option.value ? "bg-white text-brand-800 shadow-sm" : "text-slate-600 hover:text-slate-900"
                )}
              >
                <input
                  type="radio"
                  value={option.value}
                  className="sr-only"
                  {...register("tripType", { validate: required("Trip type") })}
                />
                {option.label}
              </label>
            ))}
          </div>
          {errors.tripType && (
            <p role="alert" className="mt-1.5 text-xs font-medium text-red-600">
              {errors.tripType.message}
            </p>
          )}
        </fieldset>

        {tripType === "round-trip" && (
          <Field
            label="Return date"
            htmlFor={`${source}-return`}
            error={errors.returnDate}
            required
            className="sm:col-span-2 animate-fade-in"
          >
            <input
              id={`${source}-return`}
              type="date"
              min={travelDate || todayISO()}
              className={inputClass(errors.returnDate)}
              aria-invalid={!!errors.returnDate}
              {...register("returnDate", {
                validate: (value, form) =>
                  form.tripType !== "round-trip"
                    ? true
                    : compose(required("Return date"), isOnOrAfter(form.travelDate))(value),
              })}
            />
          </Field>
        )}

        <Field
          label="Vehicle"
          htmlFor={`${source}-vehicle`}
          error={errors.vehicle}
          required
          hint={vehiclesError ? "Couldn't load vehicles — you can still submit and we'll call you." : undefined}
        >
          <select
            id={`${source}-vehicle`}
            className={inputClass(errors.vehicle)}
            aria-invalid={!!errors.vehicle}
            disabled={vehiclesLoading}
            {...register("vehicle", { validate: vehiclesError ? () => true : required("Vehicle") })}
          >
            <option value="">{vehiclesLoading ? "Loading cabs…" : "Select a cab"}</option>
            {vehicles?.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.name} · {v.seatingCapacity} seats · from ₹{v.price.toLocaleString("en-IN")}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Passengers" htmlFor={`${source}-passengers`} error={errors.passengers} required>
          <input
            id={`${source}-passengers`}
            type="number"
            min={1}
            max={7}
            inputMode="numeric"
            className={inputClass(errors.passengers)}
            aria-invalid={!!errors.passengers}
            {...register("passengers", {
              validate: {
                range: isPositiveInt("Passengers", { min: 1, max: 7 }),
                fitsVehicle: (value) => {
                  const chosen = vehicles?.find((v) => v.slug === getValues("vehicle"));
                  if (chosen && Number(value) > chosen.seatingCapacity) {
                    return `${chosen.name} seats up to ${chosen.seatingCapacity}. Pick a bigger cab or reduce passengers.`;
                  }
                  return true;
                },
              },
            })}
          />
        </Field>

        <Field
          label="Message"
          htmlFor={`${source}-message`}
          error={errors.message}
          hint="Flight number, extra luggage, child seat, GSTIN…"
          className="sm:col-span-2"
        >
          <textarea
            id={`${source}-message`}
            rows={compact ? 2 : 3}
            placeholder="Anything we should know?"
            className={cn(inputClass(errors.message), "resize-y")}
            aria-invalid={!!errors.message}
            {...register("message", { validate: maxLength(500, "Message") })}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          By submitting you agree to be contacted on call/WhatsApp about this booking. No spam, ever.
        </p>
        <Button type="submit" size="lg" loading={isSubmitting} className="sm:min-w-[200px]">
          {isSubmitting ? "Sending request…" : "Book Your Cab"}
        </Button>
      </div>

      {!compact && (
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>Prefer to talk?</span>
          <a href={telLink} className="inline-flex items-center gap-1.5 font-semibold text-brand-800 hover:underline">
            <Phone className="h-4 w-4" aria-hidden="true" /> {site.phoneDisplay}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-green-700 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
          </a>
        </p>
      )}
    </form>
  );
}
