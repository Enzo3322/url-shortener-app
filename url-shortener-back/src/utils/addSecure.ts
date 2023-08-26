export default function AddSecure(url: string) {
    if (!url.includes('https') || !url.includes('http')) {
        return `https://${url}`
    }
    return url
}