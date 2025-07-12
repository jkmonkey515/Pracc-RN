import moment from "moment-timezone";

export const convertSearchResults = (
  { Offers: offers = [], Requests: requests = [], Matches: matches = [] },
  filter: any
) => {
  const groupedByTime = {};
  function getDailyEntry(timeStr: moment.MomentInput) {
    const timeUtc = moment(timeStr).tz("UTC");
    const utcStr = timeUtc.format();

    if (!groupedByTime.hasOwnProperty(utcStr)) {
      groupedByTime[utcStr] = {
        Time: timeUtc,
        Offers: [],
        Requests: [],
        Match: null,
      };
    }
    return groupedByTime[utcStr];
  }

  for (const match of matches) {
    getDailyEntry(match.Time).Match = match;
  }

  const seenRequestIds = {};
  for (const offer of offers) {
    const entry = getDailyEntry(offer.Request.Time);
    entry.Offers.push(offer);
    seenRequestIds[offer.Request.ID] = true;
  }
  for (const request of requests) {
    if (seenRequestIds.hasOwnProperty(request.ID)) {
      continue;
    }

    const entry = getDailyEntry(request.Time);
    entry.Requests.push(request);
  }

  let groupedData = Object.values(groupedByTime);
  groupedData.sort((a: any, b: any) => (a.Time.isBefore(b.Time) ? -1 : 1));
  const results = [];
  if (!filter.Matches.Enabled) {
    groupedData = results.filter((result) => result.Match === null);
  }
  return groupedData;
};
