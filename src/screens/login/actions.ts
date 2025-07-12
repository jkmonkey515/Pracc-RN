import { SET_SPINNER_VISIBILITY } from "./reducers";
import { post } from "../../utils/backend";
import * as WebBrowser from "expo-web-browser";
import * as Device from "expo-device";
import * as Linking from "expo-linking";
import { setAccessToken } from "../../actions";
import { displayErrorMessage } from "../../components/snackbar-container";
import queryString from "../../utils/query-string";
import { Platform } from "react-native";
import { getDeviceId } from "../../utils/application";

async function getPhoneData() {
  let platform = "unknown";

  // Get the device ID
  const deviceId = await getDeviceId();

  if (Platform.OS === "ios") {
    platform = `${Device.brand} ${Device.modelName} (iOS: ${Device.osVersion})`;
  } else if (Platform.OS === "android") {
    platform = `Android ${Device.osVersion} (SDK ${Device.platformApiLevel})`;
  }

  return {
    deviceName: Device.deviceName,
    deviceId: deviceId,
    platform: platform,
  };
}

export const loginWithPassword = (email: string, password: string) => {
  return async (dispatch: any) => {
    dispatch({
      type: SET_SPINNER_VISIBILITY,
      visible: true,
    });
    try {
      const phoneData = await getPhoneData();
      const res = await post("mobile-app/password-auth", {
        json: {
          auth: {
            email,
            password,
          },
          phone: phoneData,
        },
      });
      

      const { accessToken } = res.data;
      await setAccessToken(accessToken)(dispatch);
    } catch (e) {
      await displayErrorMessage(e)(dispatch);
    } finally {
      dispatch({
        type: SET_SPINNER_VISIBILITY,
        visible: false,
      });
    }
  };
};

export const loginViaBarCode = (barCode: string) => {
  return async (dispatch: any) => {
    dispatch({
      type: SET_SPINNER_VISIBILITY,
      visible: true,
    });
    try {
      const phoneData = await getPhoneData();
      const res = await post("mobile-app/qr-auth", {
        body: JSON.stringify({
          auth: JSON.parse(barCode.slice("pracc-mobile-auth:".length)),
          phone: phoneData,
        }),
      });
      const { accessToken } = res.data;
      await setAccessToken(accessToken)(dispatch);
    } catch (e) {
      await displayErrorMessage(e)(dispatch);
    } finally {
      dispatch({
        type: SET_SPINNER_VISIBILITY,
        visible: false,
      });
    }
  };
};

export const loginViaSteam = () => {
  let redirectResult: string | undefined = undefined;
  let subscription: any;
  const handleRedirect = (event: any) => {
    //Maybe needs a check to only get the redirectUrl from the Webbrowser
    //Not sure, if the check is neccessary in production build
    redirectResult = event.url as string;
  };
  return async (dispatch: any) => {
    const redirectUrl =
      "https://pracc.com/api/mobile-device/steam-login-callback?linkingUrl=" +
      encodeURIComponent(Linking.createURL(""));

    let authUrl = "https://steamcommunity.com/openid/login";
    const params: { [key: string]: string } = {
      "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
      "openid.mode": "checkid_setup",
      "openid.ns": "http://specs.openid.net/auth/2.0",
      "openid.realm": "https://pracc.com",
      "openid.return_to": redirectUrl,
    };

    let isFirst = true;
    for (const key in params) {
      if (!params.hasOwnProperty(key)) {
        continue;
      }

      authUrl += isFirst ? "?" : "&";
      isFirst = false;

      authUrl += key + "=" + encodeURIComponent(params[key]);
    }

    if (
      Platform.OS === "android" ||
      (Platform.OS === "ios" && parseInt(String(Platform.Version), 10) < 11)
    ) {
      // Add eventListener to get the steamAuthRedirectUrl
      subscription = Linking.addEventListener("url", handleRedirect);
    }

    const result = await WebBrowser.openAuthSessionAsync(authUrl);

    /*result.type is success for ios version > 11
          result_redirect is != undefined when the authentication was successful for android and ios version < 11
        */
    if (result.type === "success" || redirectResult !== undefined) {
      dispatch({
        type: SET_SPINNER_VISIBILITY,
        visible: true,
      });

      let postParams;
      if (
        Platform.OS === "android" ||
        (Platform.OS === "ios" && parseInt(String(Platform.Version), 10) < 11)
      ) {
        postParams = queryString.parse(redirectResult ? redirectResult.split("?", 2)[1] : "");
      } else {
        postParams = queryString.parse(result.url.split("?", 2)[1]);
      }

      try {
        const phoneData = await getPhoneData();
        let requestBody = {
          body: JSON.stringify({
            auth: postParams,
            phone: phoneData,
          }),
        };
        if (Platform.OS === "android") {
          requestBody = {
            json: {
              auth: postParams,
              phone: phoneData,
            },
          };
        }
        const res = await post("mobile-app/steam-auth", requestBody);

        const { accessToken } = res.data;
        await setAccessToken(accessToken)(dispatch);
      } catch (e) {
        await displayErrorMessage(e)(dispatch);
      } finally {
        if (
          Platform.OS === "android" ||
          (Platform.OS === "ios" && parseInt(String(Platform.Version), 10) < 11)
        ) {
          //reset temp vars and removeEventListener
          redirectResult = undefined;
          subscription.remove();
        }

        dispatch({
          type: SET_SPINNER_VISIBILITY,
          visible: false,
        });
      }
    }
  };
};
