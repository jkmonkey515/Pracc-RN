import 'ts-node/register';

import {ConfigContext} from 'expo/config';

/**
 * @param config receives the parsed JSON object from app.json under "expo" key
 */
export default ({config}: ConfigContext) => ({
    ...config,
    android: {
        ...config.android,
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    }
})