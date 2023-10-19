import { TypographyENUM } from "@/types/coreTypes";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Icons } from "@lk/ui-library";
import { getLocationApiErrorMessage, loadScriptWithCallback } from "./helper";

const Relative = styled.div`
  position: relative;
`;

const Wrapper = styled.div`
  border: 1px solid #cecedf;
  border-radius: 12px;
  height: 56px;
  padding: 6px 8px;
  display: flex;
  color: #000000;
  background-color: #ffffff;
  align-items: center;
`;

const Input = styled.input`
  font-family: ${TypographyENUM.lkSansRegular};
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  padding: 4px 0;
  width: 100%;
  display: block;
  border: none;
  color: #424242;
  border: none;
  outline: none;
  user-select: initial;
  &::before,
  &::after {
    user-select: initial;
  }
`;

const Img = styled.img`
  color: #000000;
  height: 23px;
`;

const ErrorContainer = styled.span`
  color: #e34934;
  font-size: 10px;
  font-family: ${TypographyENUM.lkSansRegular};
`;

export default function GoogleAutoComplete({
  setSelectedAddress,
  setIsGetCurrentLocation,
  isGetCurrentLocation,
}: any) {
  let timeOutId: any = "";
  const [autoComplete, setAutoComplete] = useState<any>(null);
  const [isDropdownClick, setIsDropdownClick] = useState(false);
  const [isGpsIconClicked, setIsGpsIconClicked] = useState(false);
  const [locationErrorMessage, setlocationErrorMessage] = useState("");
  const [locationProcessing, setLocationProcessing] = useState(false);
  const [latLng, setLatLng] = useState({
    lat: "",
    lng: "",
  });
  const [locationAddress, setLocationAddress] = useState<any>(null);
  const [onChangeAddress, setOnChangeAddress] = useState("");

  const ref = useRef<any>(null);

  const initPlacesService = () => {
    if (window.google && window.google.maps) {
      let autoCompleteTemp = new window.google.maps.places.Autocomplete(
        ref.current,
        {
          types: ["geocode", "establishment"],
        }
      );
      autoCompleteTemp.setTypes(["geocode"]);
      autoCompleteTemp.setFields([
        "address_components",
        "formatted_address",
        "geometry",
      ]); // , 'geometry' used for lat lng
      autoCompleteTemp.setComponentRestrictions({ country: ["in"] });
      //   autoCompleteTemp.addListener("place_changed", () =>
      //     //   fillInAddress(autoCompleteTemp)
      //     console.log(autoCompleteTemp)
      //   );
      setAutoComplete(autoCompleteTemp);
    }
  };

  useEffect(() => {
    return () => {
      if (timeOutId) {
        clearTimeout(timeOutId);
      }
    };
  }, []);

  const getLocation = () => {
    setlocationErrorMessage("");
    if ("geolocation" in window.navigator) {
      setLocationProcessing(true);
      window.navigator.geolocation.getCurrentPosition(
        (position) => locationSuccess(position),
        (error) => locationError(error)
      );
    }
  };

  const locationSuccess = (position: any) => {
    let lat = position.coords.latitude;
    let lng = position.coords.longitude;
    if (lat !== latLng.lat || lng !== latLng.lng) {
      const geocoder = new window.google.maps.Geocoder();
      const location = { lat, lng };
      /* eslint new-parens: 0 */
      geocoder.geocode({ location }, (results: any[], status: string) => {
        if (status === "OK") {
          if (results[0]) {
            setLatLng({
              lat: lat,
              lng: lng,
            });
            setLocationAddress(results[0]);
            setOnChangeAddress(results[0].formatted_address);
            setSelectedAddress(results[0].formatted_address);
            autoComplete.set("place", locationAddress);
          }
        } else {
          console.log("Geocoder failed due to: " + status);
        }
        setLocationProcessing(false);
      });
    } else {
      autoComplete.set("place", locationAddress);
      setLocationProcessing(false);
    }
  };

  const locationError = (error: any) => {
    setLocationProcessing(false);
    setlocationErrorMessage(getLocationApiErrorMessage(error));
  };

  const onChange = (props: any) => {
    setOnChangeAddress(props);
    setlocationErrorMessage("");
    setSelectedAddress(props);
  };

  const keyPress = (value: any, e: any) => {
    if (e.keyCode === 13) {
      onChange(value);
      if (ref && ref.current) ref.current.blur();
    }
  };

  useEffect(() => {
    if (!window?.google?.maps) {
      const redisCommonData = {
        GOOGLE_MAP_KEY: "",
      };
      loadScriptWithCallback(
        `https://maps.googleapis.com/maps/api/js?key=${
          redisCommonData && redisCommonData.GOOGLE_MAP_KEY
            ? redisCommonData.GOOGLE_MAP_KEY
            : "AIzaSyARUqartok5374huBSDK8UWZC7i1uVnSd0"
        }&libraries=places`,
        () => {
          initPlacesService();
          //   if (autoDetectLocation) {
          //     getLocation();
          //   }
        }
      );
    } else {
      initPlacesService();
    }
  }, []);

  useEffect(() => {
    if (isGetCurrentLocation) {
      getLocation();
      setIsGetCurrentLocation(false);
    }
  }, [isGetCurrentLocation]);

  let placeholder = "Search store by area, PIN Code";

  return (
    <Relative>
      <Wrapper>
        <Icons.Search style={{ margin: "0px 5px 0px 4px", fontSize: "18px" }} />
        <Input
          ref={ref}
          placeholder={placeholder === undefined ? "" : placeholder}
          autoComplete="shipping address-line2"
          value={onChangeAddress ? onChangeAddress : ""}
          type="text"
          onBlur={(e) => onChange(e.target.value)}
          onKeyDown={(e) => keyPress(e.target.value, e)}
          onKeyUp={() => {
            setIsDropdownClick(false);
          }}
          onChange={(e) => setOnChangeAddress(e.target.value)}
        />
      </Wrapper>
      {locationErrorMessage && (
        <ErrorContainer>{locationErrorMessage}</ErrorContainer>
      )}
    </Relative>
  );
}
