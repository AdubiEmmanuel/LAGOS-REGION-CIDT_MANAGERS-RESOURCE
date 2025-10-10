export const formatDocNumbers = (input: string): string => {
    // Split the input by newlines and filter out empty lines
    const numbers = input
        .split(/[\n,\s]+/)
        .map(num => num.trim())
        .filter(num => num.length > 0);

    // Format each number with quotes and join with commas
    return numbers.map(num => `'${num}'`).join(',');
};