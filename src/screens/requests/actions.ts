import {UPDATE_REQUESTS, UPDATE_REQUESTS_FOR_DATE} from "./reducers";

export function updateRequests(requestsByDate: any) {
    return (dispatch: any) => {
        dispatch({
            type: UPDATE_REQUESTS,
            requestsByDate
        })
    }
}

export function updateRequestsForDate(dateStr: any, requests: any) {
    return (dispatch: any) => {
        dispatch({
            type: UPDATE_REQUESTS_FOR_DATE,
            dateStr,
            requests,
        })
    }
}
