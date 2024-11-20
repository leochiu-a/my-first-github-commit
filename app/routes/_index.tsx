import type { MetaFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>My First Github Commit</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Your GitHub name" v-model="username" />
        </CardContent>
        <CardFooter>
          <Button onClick="emit('search', username)">Search</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
