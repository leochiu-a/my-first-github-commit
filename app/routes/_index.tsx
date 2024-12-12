import type { MetaFunction } from "@remix-run/node";
import { GitCommit, GitBranch, Clock, File, Plus, Minus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface Commit {
  branchName: string;
  oid: string;
  additions: number;
  author: { name: string; avatarUrl: string };
  changedFilesIfAvailable: number;
  commitUrl: string;
  committedDate: string;
  deletions: number;
  message: string;
}

export default function Index() {
  const commitHistories = useFetcher<{ commit: Commit }>();

  const commit = commitHistories.data?.commit;

  return (
    <div className="min-h-screen bg-slate-50 gr">
      <div className="container mx-auto grid grid-cols-[1fr_1fr] gap-8 p-8">
        <commitHistories.Form method="GET" action="/commit-search">
          <Card>
            <CardHeader>
              <CardTitle>My First Github Commit</CardTitle>
            </CardHeader>
            <CardContent>
              <Input placeholder="Your GitHub name" name="username" />
            </CardContent>
            <CardFooter>
              <Button type="submit">
                {commitHistories.state === "loading" ? "Searching" : "Search"}
              </Button>
            </CardFooter>
          </Card>
        </commitHistories.Form>

        {commitHistories.state === "loading" && (
          <div>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </Card>
          </div>
        )}

        {commit && (
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={commit.author.avatarUrl}
                  alt={commit.author.name}
                />
                <AvatarFallback>
                  {commit.author.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <CardTitle className="text-xl">
                  My First GitHub Commit
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  @{commit.author.name}
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-lg font-medium line-clamp-3">
                  {commit.message}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <GitCommit className="h-4 w-4" />
                <a
                  href={commit.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline inline-block"
                >
                  <span>{commit.oid.substring(0, 7)}</span>
                </a>
                <GitBranch className="h-4 w-4 ml-4" />
                <span>{commit.branchName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Committed on {commit.committedDate}</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Changes:</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-2">
                    <File className="h-4 w-4 text-blue-500" />
                    <span>{commit.changedFilesIfAvailable} files changed</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Plus className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">{commit.additions}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Minus className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{commit.deletions}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
