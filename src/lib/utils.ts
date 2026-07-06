import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/*
 * Split a string into its words and return the first letter of each string
 */
export function userAbbr(name: string): string {
	const matches = name.match(/\b(\w)/g);

	if (matches === null) {
		return '?';
	}

	return matches.join('');
}

/*
 * Gets the message from an `Error` or lets the user know it is unknown
 */
export function getErrorMessage(e: unknown): string {
	if (e instanceof Error) return e.message;
	if (typeof e === 'string') return e;
	return 'An unknown error occurred';
}
