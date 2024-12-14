import { LoaderFunctionArgs } from "@remix-run/node";
import axios from "axios";

/**
 * https://github.com/danielroe/firstcommit.is/
 */
const searchCommit = async (username: string) => {
  const $gh = axios.create({
    baseURL: "https://api.github.com",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      Accept: "application/vnd.github+json",
    },
  });

  const [user, results] = await Promise.allSettled([
    $gh(`/users/${username}`),
    $gh("/search/commits", {
      params: {
        q: `author:${username}`,
        order: "asc",
        sort: "committer-date",
        per_page: 1,
      },
    }),
  ]);

  if (user.status === "rejected") {
    throw new Error("user not found");
  }
  if (results.status === "rejected") {
    throw new Error("github api error");
  }

  const [commit] = results.value.data.items;
  if (!commit) {
    throw new Error("no commits to show");
  }

  const stats = await $gh(commit.url);
  const parsedUser = user.value.data;

  return {
    date: commit.commit.author.date,
    avatar: parsedUser?.avatar_url || commit.author.avatar_url,
    link: commit.html_url,
    message: commit.commit.message,
    username: parsedUser?.login || commit.author.login,
    author: parsedUser?.name || commit.commit.author.name,
    authorUrl: commit.author.html_url,
    additions: stats.data.stats.additions,
    deletions: stats.data.stats.deletions,
    changeFiles: stats.data.files.length,
    org: {
      avatar: commit.repository.owner.avatar_url,
      name: commit.repository.owner.login,
      repository: commit.repository.full_name,
    },
  };
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const url = new URL(request.url);
    const result = await searchCommit(url.searchParams.get("username") || "");

    return { commit: result };
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "unknown error",
    };
  }
};
