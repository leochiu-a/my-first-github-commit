import type { MetaFunction } from "@remix-run/node";
import { useSearchParams } from "@remix-run/react";
import {
  File,
  Plus,
  Minus,
  ArrowRight,
  SquareArrowOutUpRight,
  Download,
  Share2,
  LoaderIcon,
  ChevronLeft,
} from "lucide-react";
import dayjs from "dayjs";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { domToPng } from "modern-screenshot";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShinyButton from "@/components/magicui/shiny-button";
import { useToast } from "@/hooks/use-toast";
import isMobile from "@/lib/isMobile";
import { useFetcherWithReset } from "@/hooks/use-fetcher-with-reset";

export const meta: MetaFunction = () => {
  return [
    { title: "Your first GitHub commit" },
    {
      name: "description",
      content:
        "Discover your GitHub origin story. Instantly find and relive the moment you made your first-ever commit. Perfect for developers seeking a nostalgic trip through their coding journey.",
    },
    {
      property: "og:title",
      content: "Your first GitHub commit",
    },
    {
      property: "og:description",
      content:
        "Discover your GitHub origin story! Instantly find and relive the moment you made your first-ever commit. Perfect for developers seeking a nostalgic trip through their coding journey.",
    },
    {
      property: "og:image",
      content: "/og-image.jpg",
    },
  ];
};

interface Commit {
  date: string;
  avatar: string;
  link: string;
  message: string;
  username: string;
  author: string;
  authorUrl: string;
  org: {
    avatar: string;
    name: string;
    repository: string;
  };
  additions: number;
  deletions: number;
  changeFiles: number;
}

interface FetcherResult {
  commit?: Commit;
  message?: string;
}

export default function Index() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUsername] = useState(() => {
    return searchParams.get("username") || "";
  });

  const commitHistories = useFetcherWithReset<FetcherResult>();
  const { toast } = useToast();

  const ref = useRef<HTMLDivElement>(null);

  const commit = commitHistories.data?.commit;

  const handleChangeUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSubmit = () => {
    setSearchParams({ username });
    commitHistories.load("/commit-search?username=" + username);
  };

  const handleDownload = () => {
    if (ref.current) {
      domToPng(ref.current, { scale: 2 }).then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-first-github-commit.png";
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?username=${username}`;
    if (isMobile()) {
      navigator.share({
        title: `${username}'s first GitHub commit`,
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard",
      });
    }
  };

  const handleBack = () => {
    const back = () => {
      setSearchParams({});
      setUsername("");
      commitHistories.reset();
    };

    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        back();
      });
    } else {
      back();
    }
  };

  useEffect(() => {
    if (commitHistories.data?.message) {
      toast({
        title: commitHistories.data?.message,
      });
    }
  }, [commitHistories.data?.message, toast]);

  useEffect(() => {
    if (username) {
      commitHistories.load("/commit-search?username=" + username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!commit && (
        <div className="relative z-10 mx-auto grid self-center md:max-w-[600px]">
          <commitHistories.Form
            method="GET"
            action="/commit-search"
            className="mx-7 grid justify-items-center sm:mx-0"
          >
            <div className="mb-8">
              <img src="/github-icon.svg" alt="github-icon" />
            </div>
            <h1 className="flex flex-wrap justify-center gap-x-3 bg-gradient-to-b from-white to-white/50 bg-clip-text text-center text-2xl font-semibold text-transparent sm:text-4xl">
              <span>Discover your </span>
              <span> first GitHub commit</span>
            </h1>
            <input
              placeholder="Enter GitHub username"
              name="username"
              className="h-18 mt-8 w-full border-0 bg-transparent p-6 text-center text-base leading-7 text-white placeholder-[#878787] focus:outline-none focus-visible:outline-none sm:text-xl"
              onChange={handleChangeUsername}
              value={username}
            />
            <div className="h-[1px] w-full bg-gradient-to-r from-[#DCDCDC] to-[#707070]" />
            <ShinyButton
              type="button"
              className="mt-10 h-[60px] w-full bg-white text-lg leading-7 text-black"
              disabled={username.length === 0}
              onClick={handleSubmit}
            >
              <div className="flex h-full items-center justify-center gap-1">
                Get started
                {commitHistories.state === "loading" ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7" />
                )}
              </div>
            </ShinyButton>
          </commitHistories.Form>
        </div>
      )}

      {commit && (
        <>
          <button
            className="absolute left-6 top-8 cursor-pointer sm:left-10 sm:top-10"
            onClick={handleBack}
          >
            <ChevronLeft className="h-8 w-8 text-gray-100" />
          </button>
          <div className="relative z-10 mx-auto my-20 grid max-w-[420px] justify-items-center sm:my-[104px]">
            <h1 className="flex w-[300px] flex-wrap justify-center gap-x-2 bg-gradient-to-b from-white to-white/50 bg-clip-text text-center text-2xl font-semibold text-transparent md:w-auto">
              <span>Your first</span>
              <span className="text-nowrap"> GitHub commit...</span>
            </h1>

            <div
              className="mt-9 w-[328px] rounded-2xl bg-gradient-to-r from-[#DCDCDC] to-[#707070] p-0.5 shadow-custom-white sm:mt-[60px] sm:w-[390px]"
              ref={ref}
            >
              <div className="h-full rounded-2xl bg-white bg-custom-gradient py-7 text-white sm:pb-10 sm:pt-10">
                <div className="relative grid w-full justify-center">
                  <div className="absolute top-12 grid translate-x-[6px] justify-items-center gap-3 justify-self-center sm:top-14">
                    <Avatar className="h-12 w-12 sm:h-[52px] sm:w-[52px]">
                      <AvatarImage src={commit.avatar} alt={username} />
                      <AvatarFallback>
                        {username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-base sm:text-xl">{username}</p>
                  </div>

                  <div className="h-[225px] w-[232px]">
                    <img src="/github-gradient.svg" alt="github-gradient" />
                  </div>
                </div>

                <div className="relative z-10 mx-4 -mt-0.5 text-center sm:mx-6">
                  <p className="line-clamp-3 text-base font-normal sm:text-lg">
                    {commit.message}
                  </p>

                  <p className="mt-5 text-xs text-gray-400 sm:text-sm">
                    {dayjs(commit.date).format("MMMM D, YYYY, hh:mm A")}
                  </p>

                  <div className="mt-8 flex justify-between gap-1 text-nowrap rounded-md bg-[#45454566] p-4 text-xs sm:mt-12 sm:text-sm">
                    <span className="flex items-center gap-1">
                      <Plus className="h-4 w-4 text-green-500" />
                      <span>{commit.additions} additions</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Minus className="h-4 w-4 text-red-500" />
                      <span>{commit.deletions} deletions</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <File className="h-4 w-4" />
                      <span>{commit.changeFiles} files</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-9 grid w-full auto-cols-fr grid-flow-col gap-6 px-6 sm:mt-[60px] sm:gap-8">
              <a
                className="group flex cursor-pointer flex-col items-center"
                href={commit.link}
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 transition duration-300 group-hover:border-white group-hover:bg-white">
                  <SquareArrowOutUpRight className="h-5 w-5 text-white transition duration-300 group-hover:text-black" />
                </div>
                <p className="mt-2 text-xs text-white sm:text-sm">
                  View Commit
                </p>
              </a>

              <button
                className="group flex cursor-pointer flex-col items-center"
                onClick={handleDownload}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 transition duration-300 group-hover:border-white group-hover:bg-white">
                  <Download className="h-5 w-5 text-white transition duration-300 group-hover:text-black" />
                </div>
                <p className="mt-2 text-xs text-white sm:text-sm">Download</p>
              </button>

              <button
                className="group flex cursor-pointer flex-col items-center"
                onClick={handleShare}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-400 transition duration-300 group-hover:border-white group-hover:bg-white">
                  <Share2 className="h-5 w-5 text-white transition duration-300 group-hover:text-black" />
                </div>
                <p className="mt-2 text-xs text-white sm:text-sm">Shared</p>
              </button>
            </div>
          </div>
        </>
      )}

      <footer className="absolute bottom-0 left-0 right-0 mb-6 mt-auto h-fit text-center text-xs text-gray-400 sm:mb-10 sm:text-sm">
        <a
          href="https://github.com/leochiu-a/my-first-github-commit"
          className="hover:underline"
        >
          source
        </a>
        <span> · </span>
        <span>made with ❤️ by </span>
        <a
          href="https://www.threads.net/@leo.web.dev"
          className="hover:underline"
        >
          @leochiu
        </a>
        <span> & </span>
        <span>@Angela Hong</span>
      </footer>
    </>
  );
}
