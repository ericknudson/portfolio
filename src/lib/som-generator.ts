// Browser port of the Flask app in ericknudson/som-course-generator (commit 773462d).
// Data in src/data/som-courses.json was converted from that commit's static/*.csv files.
import data from '../data/som-courses.json';

const bigrams: Record<string, [string[], number[]]> = data.bigrams as any;
const existing = new Set(data.existing);

function pick(words: string[], weights: number[]) {
	let r = Math.random() * weights.reduce((sum, w) => sum + w, 0);
	for (let i = 0; i < words.length; i++) {
		r -= weights[i];
		if (r < 0) return words[i];
	}
	return words[words.length - 1];
}

function generateOnce() {
	const output: string[] = [];
	let token = '*';
	while (true) {
		const [words, weights] = bigrams[token];
		// The first word is picked uniformly; later words follow the bigram distribution.
		token = output.length === 0 ? words[Math.floor(Math.random() * words.length)] : pick(words, weights);
		if (token === 'STOP') return output.join(' ');
		output.push(token);
	}
}

// Reject single words and exact matches with real courses, as the original did.
export function generateCourseName() {
	for (let attempt = 0; attempt < 100; attempt++) {
		const name = generateOnce();
		if (name.includes(' ') && !existing.has(name)) return name;
	}
	return generateOnce();
}
