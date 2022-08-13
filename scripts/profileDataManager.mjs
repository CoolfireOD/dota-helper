import { OPENDOTA_API_DOMAIN } from "./api.mjs"
import { OPENDOTA_REQUEST_OPTIONS } from "./api.mjs"
import { RAPID_API_DOMAIN } from "./api.mjs"
import { RAPID_API_REQUEST_OPTIONS } from "./api.mjs"
import { RAPID_API_MATCHES_URL_PARAMS } from "./api.mjs"
import { RAPID_API_GET_MATCH_DETAIL_URL } from "./api.mjs"
import { getMatches } from "./api.mjs"
import { getMatchesDetails } from "./api.mjs"

function buildRapidAPI_URL(domain, params) {
    let url = domain;
    for (let key in params) {
        if (params[key] != undefined) {
            url += `${key}=${params[key]}&`;
        }
    }
    url = url.slice(0, -1);
    return url;
}

const profileDataManager = {
    opendota_url: OPENDOTA_API_DOMAIN,
    opendota_params: {
        profileInfo: `players/990567883`,
    },

    rapidapi_url: RAPID_API_DOMAIN,
    rapidapi_params: {
        getMatches: `IDOTA2Match_570/GetMatchHistory/V001/?`
    },
    loadEventListeners: [],
    errorEventListeners: [],

    async init() {
        for (const param in this.opendota_params) {
            try {
                const response = await fetch(this.opendota_url + this.opendota_params[param], OPENDOTA_REQUEST_OPTIONS);

                const data = await response.json();

                for (const listener of this.loadEventListeners) {
                    listener(data);
                }
            } catch (error) {
                for (const listener of this.errorEventListeners) {
                    listener(error);
                }
            }
        }

        for (const param in this.rapidapi_params) {
            const RAPID_API_URL = buildRapidAPI_URL(this.rapidapi_url + this.rapidapi_params[param], RAPID_API_MATCHES_URL_PARAMS);
            try {
                const response = await getMatches(RAPID_API_URL);
                const data = await getMatchesDetails(response);
                for (const listener of this.loadEventListeners) {
                    listener(data);
                }
            } catch (error) {
                for (const listener of this.errorEventListeners) {
                    listener(error);
                }
            }
        }
    },

    addEventListener(event, callback) {
        if (event === 'load') {
            this.loadEventListeners.push(callback);
        } else if (event === 'error') {
            this.errorEventListeners.push(callback);
        }
    }
}

const logData = (data) => {
    console.log(data);
}

const getProfileInfo = (data) => {
    if (data.profile) {
        console.log(data.profile.personaname);
        console.log(data.profile.avatarfull);
    }
}

const getProfileWL = (data) => {
    const WL = {
        wins: 0,
        loses: 0
    };
    for (const match of data) {
        let team = 0;
        for (const player of match.players) {
            if (player.account_id === +`990567883`) {
                team = player.team_number;
            }
        }
        if (team == 0 && match.radiant_win == false || team == 1 && match.radiant_win == true) {
            WL.loses++;
        } else {
            WL.wins++;
        }
    }
    console.log(WL.wins, " ", WL.loses);
}

//profileDataManager.addEventListener('load', logData);
profileDataManager.addEventListener('load', getProfileInfo);
profileDataManager.addEventListener('load', getProfileWL);
profileDataManager.init();