import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { Fragment, useEffect, useState } from 'react';
import { api } from '~/utils/api';

export default function SelectTeam() {
  const [selected, setSelected] = useState({ id: '', name: '' });

  const { data: teams } = api.team.all.useQuery();

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className="relative">
            <div className="inline-flex">
              <div className="inline-flex items-center gap-x-1.5 px-3 py-2">
                <p className="text-sm font-semibold">{selected?.name}</p>
              </div>
              <Listbox.Button className="inline-flex items-center p-2 focus:outline-none">
                <span className="sr-only">Change team</span>
                <ChevronDownIcon className="h-5 w-5 text-neutral-500" aria-hidden="true" />
              </Listbox.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute right-0 z-10 mt-2 w-72 origin-top-right divide-y divide-gray-200 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {teams?.map((team) => (
                  <Listbox.Option
                    key={team.id}
                    className={({ active }) =>
                      clsx(
                        active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                        'cursor-default select-none p-4 text-sm',
                      )
                    }
                    value={team}
                  >
                    {({ selected, active }) => (
                      <div className="flex flex-col">
                        <div className="flex justify-between">
                          <p className={selected ? 'font-semibold' : 'font-normal'}>{team.name}</p>
                          {selected ? (
                            <span className={active ? 'text-white' : 'text-indigo-600'}>
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </div>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
                <Listbox.Option key="new" className="text-gray-900  cursor-default select-none p-4 text-sm" value="new">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <p className="font-normal">+ New team</p>
                    </div>
                  </div>
                </Listbox.Option>
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
