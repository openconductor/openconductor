import ToggleTheme from '../shared/toggleTheme';
import { Dialog, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BoltIcon,
  ChartBarSquareIcon,
  CodeBracketSquareIcon,
  Cog6ToothIcon,
  QueueListIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { api } from '~/utils/api';

const navigation = [
  { name: 'Runs', href: '/runs', icon: BoltIcon },
  { name: 'Chains', href: '/workflows', icon: QueueListIcon },
  { name: 'Agents', href: '/agents', icon: CodeBracketSquareIcon },
  { name: 'Usage', href: '/events', icon: ChartBarSquareIcon },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const { data: teams, status: teamsStatus } = api.team.all.useQuery();

  if (teamsStatus !== 'success') {
    return <></>;
  }

  return (
    <div>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-neutral-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 " aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                {/* Sidebar component, swap this element with another sidebar if you like */}
                <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
                  <div className="flex h-16 shrink-0 items-center">
                    <h3 className="text-lg font-bold leading-6 ">OpenConductor</h3>
                  </div>

                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {navigation.map((item) => (
                            <li key={item.name}>
                              <Link
                                href={item.href}
                                className={clsx(
                                  router.pathname.startsWith(item.href)
                                    ? 'bg-neutral-50 text-gigas-600'
                                    : 'text-neutral-700 hover:text-gigas-600 hover:bg-neutral-50',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                )}
                              >
                                <item.icon
                                  className={clsx(
                                    router.pathname.startsWith(item.href)
                                      ? 'text-gigas-600'
                                      : 'text-neutral-400 group-hover:text-gigas-600',
                                    'h-6 w-6 shrink-0',
                                  )}
                                  aria-hidden="true"
                                />
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li>
                        <div className="text-xs font-semibold leading-6 text-neutral-400">Your teams</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                          {teams.map((team) => (
                            <li key={team.name}>
                              <div
                                className={clsx(
                                  'bg-neutral-50 text-gigas-600',
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                                )}
                              >
                                <span
                                  className={clsx(
                                    'text-gigas-600 border-gigas-600',
                                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium ',
                                  )}
                                >
                                  {team.name
                                    .split(' ')
                                    .map((word) => word[0]?.toUpperCase() || '')
                                    .join('')}{' '}
                                </span>
                                <span className="truncate">{team.name}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </li>
                      <li className="mt-auto">
                        <Link
                          href="/settings"
                          className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-neutral-700 hover:bg-neutral-50 hover:text-gigas-600"
                        >
                          <Cog6ToothIcon
                            className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-gigas-600"
                            aria-hidden="true"
                          />
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        {/* Sidebar component, swap this element with another sidebar if you like */}
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-neutral-200 dark:border-neutral-700 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h3 className="text-lg font-bold leading-6 ">OpenConductor</h3>
          </div>

          <ToggleTheme />

          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          router.pathname.startsWith(item.href)
                            ? 'bg-neutral-50 text-gigas-600'
                            : 'text-neutral-700 hover:text-gigas-600 hover:bg-neutral-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        )}
                      >
                        <item.icon
                          className={clsx(
                            router.pathname.startsWith(item.href)
                              ? 'text-gigas-600'
                              : 'text-neutral-400 group-hover:text-gigas-600',
                            'h-6 w-6 shrink-0',
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <div className="text-xs font-semibold leading-6 text-neutral-400">Your teams</div>
                <ul role="list" className="-mx-2 mt-2 space-y-1">
                  {teams.map((team) => (
                    <li key={team.id}>
                      <div
                        className={clsx(
                          'bg-neutral-50 text-gigas-600',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        )}
                      >
                        <span
                          className={clsx(
                            'text-gigas-600 border-gigas-600',
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium',
                          )}
                        >
                          {team.name
                            .split(' ')
                            .map((word) => word[0]?.toUpperCase() || '')
                            .join('')}
                        </span>
                        <span className="truncate">{team.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  href="/settings"
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-neutral-700 hover:bg-neutral-50 hover:text-gigas-600"
                >
                  <Cog6ToothIcon
                    className="h-6 w-6 shrink-0 text-neutral-400 group-hover:text-gigas-600"
                    aria-hidden="true"
                  />
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-neutral-200 lg:hidden" aria-hidden="true" />
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
