import type { MetaFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {
  File,
  Plus,
  Minus,
  ArrowRight,
  SquareArrowOutUpRight,
  Download,
  Share2,
} from "lucide-react";
import dayjs from "dayjs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShinyButton from "@/components/magicui/shiny-button";

export const meta: MetaFunction = () => {
  return [
    { title: "Your first GitHub commit" },
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
            <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent text-center">
              Discover your first GitHub commit
            </h1>
            <input
              placeholder="Enter GitHub username"
              name="username"
              className="mt-8 h-18 p-6 text-center w-full text-white bg-transparent border-0 focus:outline-none focus-visible:outline-none placeholder-[#878787] text-xl"
            />
            <div className="bg-gradient-to-r h-[1px] w-full from-[#DCDCDC] to-[#707070]" />
            <ShinyButton
              type="submit"
              className="w-full mt-10 h-[60px] bg-white"
            >
              <div className="flex items-center gap-1 h-full justify-center">
                Get started
                <ArrowRight />
              </div>
            </ShinyButton>
          </commitHistories.Form>
        </div>
      )}

      {commit && (
        <div className="mx-auto max-w-[420px] relative z-10 grid justify-items-center my-20 sm:my-[104px]">
          <h1 className="text-3xl font-semibold bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent w-[300px] md:w-auto text-center">
            <span>Your first</span>
            <span className="text-nowrap"> GitHub commit...</span>
          </h1>

          <div className="rounded-2xl mt-9 sm:mt-[60px] bg-gradient-to-r from-[#DCDCDC] to-[#707070] p-0.5 shadow-custom-white w-[300px] sm:w-[375px]">
            <div className="bg-custom-gradient rounded-2xl pt-7 pb-8 sm:pt-12 sm:pb-10 text-white h-full">
              <div className="grid relative w-full">
                <div className="absolute grid justify-items-center gap-3 top-10 sm:top-14 justify-self-center">
                  <Avatar className="w-12 h-12 sm:w-[52px] sm:h-[52px]">
                    <AvatarImage
                      src={commit.author.avatarUrl}
                      alt={commit.author.name}
                    />
                    <AvatarFallback>
                      {commit.author.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xl">{commit.author.name}</p>
                </div>

                <img
                  src="/github-gradient.svg"
                  alt="github-gradient"
                  className="mx-auto w-[197px] h-[214px] sm:w-[221px] sm:h-[240px]"
                />
              </div>

              <div className="mx-4 sm:mx-6 text-center">
                <p className="text-lg font-medium line-clamp-3">
                  &quot; {commit.message} &quot;
                </p>

                <p className="text-sm text-[#B8B8B8] mt-5">
                  {dayjs(commit.committedDate).format("MMMM D, YYYY hh:mm A")}
                </p>

                <div className="flex justify-between gap-4 text-xs sm:text-sm bg-[#45454566] p-4 rounded-md mt-8 sm:mt-12">
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
                    <span>{commit.changedFilesIfAvailable} files</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between gap-8 px-6 mt-9 sm:mt-[60px] w-full">
            <a
              className="flex flex-col items-center cursor-pointer"
              href={commit.commitUrl}
              target="_blank"
              rel="noreferrer"
            >
              <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group hover:bg-white hover:border-white transition duration-300">
                <SquareArrowOutUpRight className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
              </div>
              <p className="mt-2 text-white text-sm">View Commit</p>
            </a>

            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group hover:bg-white hover:border-white transition duration-300">
                <Download className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
              </div>
              <p className="mt-2 text-white text-sm">Download</p>
            </div>

            <div className="flex flex-col items-center cursor-pointer">
              <div className="w-10 h-10 flex justify-center items-center border-2 border-[#B5B5B5] rounded-full group hover:bg-white hover:border-white transition duration-300">
                <Share2 className="w-5 h-5 text-white group-hover:text-black transition duration-300" />
              </div>
              <p className="mt-2 text-white text-sm">Shared</p>
            </div>
          </div>
        </div>
      )}

      <footer className="text-[#D0D0D0] h-fit mt-auto text-center absolute mb-6 sm:mb-10 bottom-0 left-0 right-0">
        Built by @leochiu & Angela Hong
      </footer>
    </>
  );
}
