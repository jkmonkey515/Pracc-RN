export function resolveAvatar(uri: string) {
    if (uri) {
        return uri
    }

    return 'https://s3-eu-west-1.amazonaws.com/pracc-static/images/unknown_team_full.jpg'
}
