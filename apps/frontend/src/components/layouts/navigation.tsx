import Logo from '../shared/logo';
import SelectTeam from '../shared/selectTeam';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Fragment } from 'react';

const navigation = [
  { name: 'Triage', href: '/triage', root: true },
  { name: 'Review', href: '/review' },
  { name: 'Conductors', href: '/conductors' },
  { name: 'Agents', href: '/agents' },
  { name: 'Documents', href: '/documents' },
];

const sideNavigation = [
  { name: 'Playground', href: '/playground' },
  { name: 'Usage', href: '/runs' },
];

const settingsNavigation = [
  { name: 'Plugins', href: '/plugins' },
  { name: 'Account', href: '/settings' },
];

export default function Navigation() {
  const router = useRouter();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  function isActive(item: { name: string; href: string; root?: boolean }) {
    return router.pathname.startsWith(item.href) || (router.pathname === '/' && item.root);
  }

  return (
    <Disclosure as="nav" className="bg-white dark:bg-neutral-900 shadow">
      {({ open }) => (
        <>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <a href="/">
                  <div className="flex flex-shrink-0 items-center mt-5">
                    <Logo className="h-6 w-6 mr-2" />
                    <h3 className="text-lg font-bold leading-6 ">OpenConductor</h3>
                  </div>
                </a>
                <div className="hidden md:ml-6 md:flex">
                  {/* <div className="mt-3">
                    <SelectTeam />
                  </div> */}
                  {navigation.map((item) => (
                    <a key={item.href} href={item.href} className="inline-flex items-center px-1 text-sm font-medium">
                      <span
                        className={clsx(
                          isActive(item) ? 'bg-neutral-200 dark:bg-neutral-800 ' : '',
                          'px-3 py-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800',
                        )}
                      >
                        {item.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="hidden md:ml-4 md:flex md:flex-shrink-0 md:items-center">
                  {sideNavigation.map((item) => (
                    <a key={item.href} href={item.href} className="inline-flex items-center px-1 text-sm font-medium">
                      <span
                        className={clsx(
                          isActive(item)
                            ? 'bg-neutral-200 dark:bg-neutral-800 '
                            : item.name === 'Playground' && '!bg-indigo-600 hover:!bg-indigo-500 text-white',
                          'px-3 py-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800',
                        )}
                      >
                        {item.name}
                      </span>
                    </a>
                  ))}
                  <Menu as="div" className="relative ml-1">
                    <div>
                      <Menu.Button className="flex text-sm font-medium focus:outline-none ">
                        <span
                          className={clsx(
                            isActive({ name: 'Settings', href: '/settings' })
                              ? 'bg-neutral-200 dark:bg-neutral-800 '
                              : '',
                            'px-3 py-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800',
                          )}
                        >
                          Settings
                        </span>
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {settingsNavigation.map((item) => (
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                href={item.href}
                                className={clsx(
                                  active ? 'bg-neutral-100 dark:bg-neutral-700' : '',
                                  'block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200',
                                )}
                              >
                                {item.name}
                              </a>
                            )}
                          </Menu.Item>
                        ))}

                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href=""
                              className={clsx(
                                active ? 'bg-neutral-100 dark:bg-neutral-700' : '',
                                'block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200',
                              )}
                              onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
                            >
                              {currentTheme == 'dark' ? 'Light' : 'Dark'} mode
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={clsx(
                                active ? 'bg-neutral-100 dark:bg-neutral-700' : '',
                                'block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200',
                              )}
                              onClick={() => {
                                void signOut({ redirect: true, callbackUrl: '/' });
                              }}
                            >
                              Sign out
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700" */}
              <SelectTeam />
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700 sm:pl-5 sm:pr-6 "
              >
                Team
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700 sm:pl-5 sm:pr-6"
              >
                Projects
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="#"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-700 sm:pl-5 sm:pr-6"
              >
                Calendar
              </Disclosure.Button>
            </div>
            <div className="border-t border-neutral-200 pb-3 pt-4">
              <div className="flex items-center px-4 sm:px-6">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">Tom Cook</div>
                  <div className="text-sm font-medium text-neutral-500">tom@example.com</div>
                </div>
                <button
                  type="button"
                  className="ml-auto flex-shrink-0 rounded-full bg-white p-1 text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 sm:px-6"
                >
                  Your Profile
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 sm:px-6"
                >
                  Settings
                </Disclosure.Button>
                <Disclosure.Button
                  as="a"
                  href="#"
                  className="block px-4 py-2 text-base font-medium text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 sm:px-6"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
