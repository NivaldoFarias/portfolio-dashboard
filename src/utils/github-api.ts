import type { Endpoints } from "@octokit/types";
import { env } from "../env";

export const api = {
	listUserRepos: (queryParams?: Record<string, any>) => {
		const params = new URLSearchParams(queryParams).toString();

		return githubApi<Endpoints["GET /repos/{owner}/{repo}"]["response"]>(
			`${env.GITHUB_API_URL}users/${env.GITHUB_API_OWNER}/repos?${params}`,
		);
	},
	repoReadme: (repo: string) => {
		return githubApi<Endpoints["GET /repos/{owner}/{repo}/readme"]["response"]>(
			`${env.GITHUB_API_URL}repos/${env.GITHUB_API_OWNER}/${repo}/readme`,
		);
	},
};

export default async function githubApi<T>(
	url: string,
	options: RequestInit = {},
): Promise<T | undefined> {
	const response = await fetch(url, {
		...options,
		method: options.method ?? "GET",
		headers: {
			"Authorization": `Bearer ${env.GITHUB_API_TOKEN}`,
			"Accept": "application/vnd.github+json",
			"X-GitHub-Api-Version": env.GITHUB_API_VERSION,
		},
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
