import type { MetaFunction } from "@remix-run/node";
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
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarImage
                  src={commit.author.avatarUrl}
                  alt={commit.author.name}
                />
                <AvatarFallback>{commit.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{commit.author.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {commit.committedDate}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">{commit.message}</p>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{commit.changedFilesIfAvailable} files changed</span>
                <span className="flex gap-2">
                  <span className="text-green-500">+{commit.additions}</span>
                  <span className="text-red-500">-{commit.deletions}</span>
                </span>
              </div>
              <a
                href={commit.commitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline mt-2 inline-block"
              >
                View commit
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
