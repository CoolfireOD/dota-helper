export const OPENDOTA_API_DOMAIN = 'https://api.opendota.com/api/';

export const RAPID_API_DOMAIN = 'https://community-dota-2.p.rapidapi.com/';

export const OPENDOTA_REQUEST_OPTIONS = {
    method: 'GET'
};

export const RAPID_API_REQUEST_OPTIONS = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': '2728be20a0msha60b2464b6645b6p19f919jsn8a0a0a238521',
        'X-RapidAPI-Host': 'community-dota-2.p.rapidapi.com'
    }
};

export const RAPID_API_MATCHES_URL_PARAMS = {
    key: '50CC25544B5C54DC774F73750192FFE9',
    account_id: '76561198950833611',
    matches_requested: 8,
    format: 'JSON',
    player_name: undefined, //Search matches with a player name, exact match only
    hero_id: undefined, // Search for matches with a specific hero being played, hero id's are in dota/scripts/npc/npc_heroes.txt in your Dota install directory
    skill: undefined, //skill 0 for any, 1 for normal, 2 for high, 3 for very high skill
    date_min: undefined, // date in UTC seconds since Jan 1, 1970 (unix time format)
    date_max: undefined, // date in UTC seconds since Jan 1, 1970 (unix time format)
    league_id: undefined, // matches for a particular league
    start_at_match_id: undefined, // Start the search at the indicated match id, descending
};

export const RAPID_API_GET_MATCH_DETAIL_URL = `${RAPID_API_DOMAIN}IDOTA2Match_570/GetMatchDetails/V001/?key=${RAPID_API_MATCHES_URL_PARAMS["key"]}&account_id=${RAPID_API_MATCHES_URL_PARAMS["account_id"]}`;

export async function getMatchesDetails(matches) {
    const promises = matches.map(async (match) => {
        const id = match['match_id'];

        if (!id) {
            return;
        }

        const url = `${RAPID_API_GET_MATCH_DETAIL_URL}&match_id=${id}`;

        const response = await fetch(url, RAPID_API_REQUEST_OPTIONS);
        const data = await response.json();
        if ('result' in data) {
            return data.result;
        } else {
            return null;
        }
    });

    const matchesDetails = await Promise.all(promises);
    return matchesDetails;
}

export async function getMatches(GET_MATCHES_URL) {
    let matches = null;
    try {
        const response = await fetch(GET_MATCHES_URL, RAPID_API_REQUEST_OPTIONS);
        const data = await response.json();
        if ('matches' in data?.result) {
            matches = data.result.matches;
        }
    } catch (error) {
        console.error(error);
    }

    return matches;
}
