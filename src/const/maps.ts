import { Profile } from "../types";
import {GAME_ID_CSGO, GAME_ID_RB6, GAME_ID_VALORANT} from "./games";

const csgoMaps = [
    {number: 0, label: 'de_inferno'},
    {number: 1, label: 'de_nuke'},
    {number: 2, label: 'de_cache'},
    {number: 3, label: 'de_mirage'},
    {number: 4, label: 'de_train'},
    {number: 5, label: 'de_overpass'},
    {number: 6, label: 'de_dust2'},
    // Map number 7 was de_any - do not use it!
    {number: 8, label: 'de_vertigo'},
    {number: 9, label: 'de_ancient'},
    {number: 10, label: 'de_anubis'},
]

const rb6Maps = [
    {number: 0, label: 'Bank'},
    {number: 1, label: 'Villa'},
    {number: 2, label: 'Clubhouse'},
    {number: 3, label: 'Oregon'},
    {number: 4, label: 'Consulate'},
    {number: 5, label: 'Coastline'},
    {number: 6, label: 'Border'},
]

const valorantMaps = [
    {number: 0, label: 'Haven', image: undefined},
    {number: 1, label: 'Bind', image: undefined},
    {number: 2, label: 'Split', image: undefined},
    {number: 3, label: 'Ascent', image: undefined},
    {number: 4, label: 'Icebox', image: undefined},
    {number: 5, label: 'Breeze', image: undefined},
    {number: 6, label: 'Fracture', image: undefined},
    {number: 7, label: 'Pearl', image: undefined},
    {number: 8, label: 'Lotus', image: undefined},
]

const indexedMaps = {}
function getIndexedMaps(gameId: number) {
    if (indexedMaps.hasOwnProperty(gameId)) {
        return indexedMaps[gameId]
    }

    indexedMaps[gameId] = {}
    for (const map of getMapsForGameId(gameId)) {
        indexedMaps[gameId][map.number] = map
    }

    return indexedMaps[gameId]
}

export function getMapFromNumber(gameId: number, number: any) {
    const maps = getIndexedMaps(gameId)
    if (maps.hasOwnProperty(number)) {
        return maps[number]
    }

    return {
        label: 'Unknown Map',
        number
    }
}

export function getMapsForProfile(profile: Profile) {
    if (!profile || !profile.Team) {
        return []
    }

    return getMapsForGameId(profile.Team.GameID)
}

export function getMapsForGameId(gameId: number) {
    switch (gameId) {
        case GAME_ID_CSGO:
            return csgoMaps

        case GAME_ID_RB6:
            return rb6Maps

        case GAME_ID_VALORANT:
            return valorantMaps

        default:
            return []
    }
}

export default csgoMaps
