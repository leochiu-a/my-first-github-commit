import { LoaderFunctionArgs } from "@remix-run/node";

/**
 * https://stackoverflow.com/questions/25112141/finding-the-oldest-commit-in-a-github-repository-via-the-api
 */
const searchCommit = async (username: string) => {
  const token = process.env.GITHUB_TOKEN;
  const userReposData = await fetch(
    `https://api.github.com/users/${username}/repos?sort=created&direction=asc&per_page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const repos = await userReposData.json();
  let repositoryName: string;
  if (repos.length > 0) {
    repositoryName = repos[0].name;
  } else {
    return { code: "NOT_FOUND", message: "User not found" };
  }

  const getHistory = async (cursor: string) => {
    const gql = `
      query {
        repository(owner: "${username}", name: "${repositoryName}") {
          owner {
            avatarUrl
          }
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: 1, after: ${cursor}) {
                  nodes {
                    oid
                    message
                    committedDate
                    commitUrl
                    additions
                    deletions
                    changedFilesIfAvailable
                  }
                  totalCount
                  pageInfo {
                    endCursor
                  }
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: gql,
      }),
    });
    const { data } = await res.json();
    return {
      ...data.repository.defaultBranchRef.target.history,
      branchName: data.repository.defaultBranchRef.name,
      avatarUrl: data.repository.owner.avatarUrl,
    };
  };

  const history = await getHistory("null");
  const totalCount = history.totalCount;

  if (totalCount > 1) {
    const cursor = history.pageInfo.endCursor.split(" ");
    cursor[1] = totalCount - 2;
    const firstCommitRes = await getHistory(`"${cursor.join(" ")}"`);
    return {
      branchName: firstCommitRes.branchName,
      avatarUrl: firstCommitRes.avatarUrl,
      ...firstCommitRes.nodes[0],
    };
  } else {
    return {
      branchName: history.branchName,
      avatarUrl: history.avatarUrl,
      ...history.nodes[0],
    };
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const result = await searchCommit(url.searchParams.get("username") || "");

  if (result.code === "NOT_FOUND") {
    return {
      commit: null,
      message: result.message,
    };
  }

  return {
    commit: result,
  };
};
