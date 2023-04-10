import Breadcrumbs from '../../components/shared/breadcrumbs';
import { Workflow } from '@openconductor/db';
import { toast } from 'react-hot-toast';
import { api } from '~/utils/api';

export default function WorkflowLayout({
  children,
  workflow,
  showAllLogs,
}: {
  children: React.ReactNode;
  workflow: Workflow;
  showAllLogs: () => void;
}) {
  const utils = api.useContext();

  const { mutate: createRun } = api.run.create.useMutation({
    async onSuccess() {
      toast.success('Triggered test successfully!');
      await utils.workflow.byId.invalidate();
    },
  });

  return (
    <>
      <div className="flex min-h-full flex-col">
        <header className="shrink-0 border-b border-neutral-200 dark:border-neutral-700">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Breadcrumbs
              pages={[
                {
                  name: 'Workflows',
                  href: '/',
                  current: false,
                },
              ]}
            />
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-7xl items-start gap-x-8 px-4 py-10 sm:px-6 lg:px-8">
          <main className="flex-1">{children}</main>

          <aside className="sticky top-8 hidden w-96 shrink-0 xl:block">
            <div className="px-4 py-5 shadow sm:rounded-lg sm:px-6">
              <div className="justify-stretch mt-6 flex flex-col">
                <div className="flex flex-row gap-x-2 w-full">
                  <button
                    type="button"
                    className="w-1/2 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50"
                    onClick={(e) => {
                      e.preventDefault();
                      toast('Running workflow...');
                      createRun({ workflowId: workflow.id });
                    }}
                  >
                    Run
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
