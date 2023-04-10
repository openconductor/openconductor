import clsx from 'clsx';
import { useRouter } from 'next/router';

export type TabsType = {
  name: string;
  nav: string;
};

export default function Tabs({ tabs }: { tabs: TabsType[] }) {
  const router = useRouter();
  const { nav } = router.query;

  const currentNav = nav || tabs[0]?.nav;

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab: TabsType) => currentNav === tab.nav)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                onClick={() => {
                  router.query.nav = tab.nav;
                  router.push(router, undefined, { shallow: true });
                }}
                className={clsx(
                  currentNav === tab.nav
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium cursor-pointer',
                )}
                aria-current={currentNav === tab.nav ? 'page' : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
