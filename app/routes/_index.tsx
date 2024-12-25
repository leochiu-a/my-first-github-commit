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
    { name: "description", content: "Welcome to Remix!" },
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
        <div className="mx-auto md:max-w-[600px] relative z-10 grid self-center">
          <commitHistories.Form
            method="GET"
            action="/commit-search"
            className="grid justify-items-center mx-7 sm:mx-0"
          >
            <div className="mb-8">
              <img src="/github-icon.svg" alt="github-icon" />
            </div>
            <h1 className="text-2xl leading-8 flex flex-col sm:flex-row sm:text-4xl sm:leading-10 font-semibold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent text-center">
              <span>Discover your </span>
              <span>first GitHub commit</span>
            </h1>
            <input
              placeholder="Enter GitHub username"
              name="username"
              className="mt-8 h-18 p-6 text-center w-full text-white bg-transparent border-0 focus:outline-none focus-visible:outline-none placeholder-[#878787] text-base sm:text-xl leading-7"
              onChange={handleChangeUsername}
              value={username}
            />
            <div className="bg-gradient-to-r h-[1px] w-full from-[#DCDCDC] to-[#707070]" />
            <ShinyButton
              type="button"
              className="w-full mt-10 h-[60px] bg-white text-black text-lg leading-7"
              disabled={username.length === 0}
              onClick={handleSubmit}
            >
              <div className="flex items-center gap-1 h-full justify-center">
                Get started
                {commitHistories.state === "loading" ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  <ArrowRight />
                )}
              </div>
            </ShinyButton>
          </commitHistories.Form>
        </div>
      )}

      {commit && (
        <>
          <button
            className="absolute left-10 top-10 cursor-pointer"
            onClick={handleBack}
          >
            <ChevronLeft className="text-[#D9D9D9] w-8 h-8" />
          </button>
          <div className="mx-auto max-w-[420px] relative z-10 grid justify-items-center my-20 sm:my-[104px]">
            <h1 className="text-3xl font-semibold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent w-[300px] md:w-auto text-center">
              <span>Your first</span>
              <span className="text-nowrap"> GitHub commit...</span>
            </h1>

            <div
              className="rounded-2xl mt-9 sm:mt-[60px] bg-gradient-to-r from-[#DCDCDC] to-[#707070] p-0.5 shadow-custom-white w-[328px] sm:w-[390px]"
              ref={ref}
            >
              <div className="bg-custom-gradient py-7 sm:pt-10 sm:pb-10 bg-white rounded-2xl text-white h-full">
                <div className="grid relative w-full justify-center">
                  <div className="absolute grid justify-items-center gap-3 top-12 sm:top-14 justify-self-center translate-x-[6px]">
                    <Avatar className="w-12 h-12 sm:w-[52px] sm:h-[52px]">
                      <AvatarImage src={commit.avatar} alt={username} />
                      <AvatarFallback>
                        {username.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xl">{username}</p>
                  </div>

                  <div className="w-[232px] h-[225px]">
                    <img src="/github-gradient.svg" alt="github-gradient" />
                  </div>
                </div>

                <div className="mx-4 sm:mx-6 text-center relative z-10">
                  <p className="text-lg font-normal line-clamp-3">
                    {commit.message}
                  </p>

                  <p className="text-sm text-[#B8B8B8] mt-5">
                    {dayjs(commit.date).format("MMMM D, YYYY, hh:mm A")}
                  </p>

                  <div className="flex justify-between gap-1 text-xs sm:text-sm bg-[#45454566] p-4 rounded-md mt-8 sm:mt-12 text-nowrap">
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

            <div className="grid grid-flow-col auto-cols-fr gap-6 sm:gap-8 px-6 mt-9 sm:mt-[60px] w-full">
              <a
                className="flex flex-col items-center cursor-pointer group"
                href={commit.link}
                target="_blank"
                rel="noreferrer"
              >
                <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group-hover:bg-white group-hover:border-white transition duration-300">
                  <SquareArrowOutUpRight className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
                </div>
                <p className="mt-2 text-white text-sm">View Commit</p>
              </a>

              <button
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleDownload}
              >
                <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group-hover:bg-white group-hover:border-white transition duration-300">
                  <Download className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
                </div>
                <p className="mt-2 text-white text-sm">Download</p>
              </button>

              <button
                className="flex flex-col items-center cursor-pointer group"
                onClick={handleShare}
              >
                <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group-hover:bg-white group-hover:border-white transition duration-300">
                  <Share2 className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
                </div>
                <p className="mt-2 text-white text-sm">Shared</p>
              </button>
            </div>
          </div>
        </>
      )}

      <footer className="text-gray-400 text-xs sm:text-sm h-fit mt-auto text-center absolute mb-6 sm:mb-10 bottom-0 left-0 right-0">
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
