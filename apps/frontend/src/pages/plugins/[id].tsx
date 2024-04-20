import PluginSettings from './settings';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';
import Slideover from '~/components/layouts/slideover';
import Tabs, { TabsType } from '~/components/shared/tabs';
import EventTable from '~/pages/runs/events/eventTable';
import { api } from '~/utils/api';

export default function Plugin({ pluginId }: { pluginId: string }) {
  const router = useRouter();
  const { nav } = router.query;
  const { data: plugin, isLoading } = api.plugin.byId.useQuery({ id: pluginId as string });

  if (!pluginId || !plugin || isLoading) return <></>;

  const tabsNavigation: TabsType[] = [
    { name: 'Usage', nav: 'usage' },
    { name: 'Settings', nav: 'settings' },
  ];

  return (
    <Slideover>
      <div className="h-full border-2 border-gray-200 rounded-tl-lg  bg-white dark:bg-neutral-800 shadow-xl p-6 space-y-2">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">{plugin.name}</Dialog.Title>
            </div>
            <div className="flex h-7 items-center">
              <button
                type="button"
                className="text-neutral-500 hover:text-neutral-500"
                onClick={() => router.push(`/plugins`)}
              >
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <Tabs tabs={tabsNavigation} />
        </div>
        <div className="flex-1">
          {nav === 'settings' ? <PluginSettings pluginId={pluginId} /> : <EventTable pluginId={pluginId} />}
        </div>
      </div>
    </Slideover>
  );
}
