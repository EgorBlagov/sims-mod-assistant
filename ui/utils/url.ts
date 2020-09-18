export const preprocessUrl = (url: string): string => {
    if (url.includes("@")) {
        return `mailto: ${url}`;
    } else if (!url.startsWith("http")) {
        return `https://${url}`;
    }

    return url;
};
