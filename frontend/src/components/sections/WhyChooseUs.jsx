import { BadgeIndianRupee, CarFront, Headset, MapPinned, ShieldCheck, Timer } from "lucide-react";
import Container from "../ui/Container";
import LazyImage from "../ui/LazyImage";
import SectionHeading from "../ui/SectionHeading";

const FEATURES = [
  { icon: BadgeIndianRupee, title: "Fixed fares", text: "No meter, no surge, no return charge.", image: "https://images.pexels.com/photos/4386379/pexels-photo-4386379.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
  { icon: ShieldCheck, title: "Verified drivers", text: "Police-checked, 5+ years Expressway experience.", image: "https://images.pexels.com/photos/3760091/pexels-photo-3760091.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
  { icon: CarFront, title: "Young fleet", text: "Cars under 5 years, serviced monthly.", image: "https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
  { icon: Timer, title: "On-time pickup", text: "99.2% on-time. Drivers arrive 10 min early.", image: "https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
  { icon: MapPinned, title: "Live tracking", text: "Share GPS link with family or office.", image: "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
  { icon: Headset, title: "24×7 support", text: "Real humans on call/WhatsApp any hour.", image: "https://images.pexels.com/photos/3760069/pexels-photo-3760069.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=400&h=250" },
];

const IMAGE = "https://images.pexels.com/photos/36377043/pexels-photo-36377043.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1000&h=1200";

export default function WhyChooseUs() {
  return (
    <section className="bg-brand-950 py-16 text-white sm:py-20" aria-labelledby="why-title">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative">
          <LazyImage
            src={IMAGE}
            alt="Chauffeur loading luggage into a clean sedan"
            width={1000}
            height={1200}
            wrapperClassName="aspect-[5/6] rounded-3xl shadow-2xl"
          />
          <div className="absolute -bottom-5 left-5 right-5 rounded-2xl bg-white p-4 text-slate-900 shadow-xl sm:left-auto sm:right-[-1rem] sm:w-72">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Since 2014</p>
            <p className="mt-1 text-2xl font-extrabold text-brand-900">25,000+ safe trips</p>
            <p className="text-sm text-slate-600">on the Mumbai–Pune Expressway</p>
          </div>
        </div>

        <div>
          <SectionHeading
            id="why-title"
            eyebrow="Why choose us"
            title="Trusted by Pune and Mumbai travellers"
            align="left"
            light
            className="mb-8"
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text, image }) => (
              <li
                key={title}
                className="group overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10"
              >
                <div className="relative h-24 overflow-hidden">
                  <LazyImage
                    src={image}
                    alt={title}
                    width={400}
                    height={250}
                    wrapperClassName="h-24"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                  <span className="absolute bottom-2 left-3 flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500 text-white shadow-md">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-white">{title}</h3>
                  <p className="mt-0.5 text-xs text-brand-200">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
