/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import moment from "moment";
import { useEffect, useState } from "react";
import { GithubAPI } from "../../services/api";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
  };
  html_url: string;
  description: string | null;
  fork: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  default_branch: string;
  homepage: string;
}

export default function Repositories() {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await GithubAPI.getRepos();

      res.sort((a: { pushed_at: string }, b: { pushed_at: string }) => {
        return moment(b.pushed_at).valueOf() - moment(a.pushed_at).valueOf();
      });

      setRepositories(res);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center w-full h-full overflow-x-none p-4 overflow-y-auto">
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            {repositories.map((repository: Repository) => {
              return (
                <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <a href={repository.html_url} target="_blank">
                          <h3 className="truncate text-sm font-medium text-gray-900 cursor-pointer">
                            {repository.name}
                          </h3>
                        </a>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {moment(repository.pushed_at).format("DD-MM-YYYY")}
                      </p>
                    </div>
                    <a href={repository.owner.html_url} target="_blank">
                      <img
                        className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 cursor-pointer"
                        src={repository.owner.avatar_url}
                        alt=""
                      />
                    </a>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1">
                        <a
                          href={repository.html_url}
                          target="_blank"
                          className="relative -mr-px inline-flex w-0 flex-1 items-center text-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Open repository
                        </a>
                      </div>
                      <div className="flex w-0 flex-1 justify-center">
                        <div className="flex w-0 flex-1 justify-center">
                          {repository.homepage ? (
                            <a
                              href={repository.homepage}
                              target="_blank"
                              className="relative text-center inline-flex w-0 flex-1 items-center justify-center gap-2 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                              >
                                <path d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z" />
                              </svg>
                              Homepage
                            </a>
                          ) : (
                            <div className="relative text-center inline-flex w-0 flex-1 items-center justify-center gap-2 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-400 cursor-not-allowed">
                              <svg
                                clip-rule="evenodd"
                                fill-rule="evenodd"
                                stroke-linejoin="round"
                                stroke-miterlimit="2"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                xmlns="http://www.w3.org/2000/svg"
                                className="fill-gray-400"
                              >
                                <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
                              </svg>
                              Not available
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}
