export function normalizeSize(name: String): string {
    return name
        .toLowerCase()
        .replace(/[^0-9a-z]+/g, "x")
        .replace(/^x+|x+$/g, "")
        .replace(/x{2,}/g, "x")
        .trim();
}