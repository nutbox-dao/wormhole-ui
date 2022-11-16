/**
 * Parse twitter data
 */

const SpaceRex = /https:\/\/twitter\.com\/i\/spaces\/([0-9a-z-A-Z]+)/

export const getSpaceIdFromUrls = (urls) => {
    if (!urls || urls.length === 0) return null;
    for (let url of urls) {
        if (url.expanded_url === url.unwound_url) {
            const group = url.expanded_url.match(SpaceRex);
            if (group) {
                const spaceId = group[1]
                return spaceId;
            }
        }
    }
}