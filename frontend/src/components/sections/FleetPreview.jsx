import { ArrowRight } from "lucide-react";
import { getVehicles } from "../../services/api";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBookingModal } from "../../context/BookingModalContext";
import Button from "../ui/Button";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import { CardSkeleton, ErrorState } from "../ui/Skeleton";
import VehicleCard from "../fleet/VehicleCard";

export default function FleetPreview({ bookingDefaults = {} }) {
  const { data: vehicles, loading, error, refetch } = useAsyncData(() => getVehicles(), []);
  const { openBooking } = useBookingModal();

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="fleet-title">
      <Container>
        <SectionHeading
          id="fleet-title"
          eyebrow="Our fleet"
          title="Choose your cab"
          description="Clean AC cars, verified drivers, fixed fares with tolls included."
        />

        {error && <ErrorState message="Couldn't load the fleet." onRetry={refetch} />}

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {loading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          {vehicles?.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onBook={(v) => openBooking({ ...bookingDefaults, vehicle: v.slug })}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="lg" to="/fleet">
            Compare all vehicles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </section>
  );
}
