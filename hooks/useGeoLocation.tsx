import { getLocation } from "@/components/PrescriptionModalV2/helper";
import React, { useEffect, useState } from "react";

// Hook to get the current location of the user
export default function useGeoLocation() {
  const [error, setError] = useState<GeolocationPositionError>();
  const [location, setLocation] = useState<GeolocationPosition>();

  useEffect(() => {
    getLocation(
      (geoLocation) => {
        setLocation(geoLocation);
      },
      (geoError) => {
        setError(geoError);
      }
    );
  }, []);
  return { error, location };
}
