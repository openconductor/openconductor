import { useRouter } from 'next/router';
import { useState } from 'react';
import AppLayout from '~/components/layouts/appLayout';
import Button, { ButtonVariant } from '~/components/shared/button';
import { api } from '~/utils/api';

const DocumentForm: React.FC = () => {
  const router = useRouter();
  const { data: teamData, status: teamStatus } = api.team.activeTeam.useQuery();
  const { mutateAsync: createDocument } = api.document.create.useMutation();
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [branch, setBranch] = useState<string>('');
  const [recursive, setRecursive] = useState<boolean>(false);

  const handleCreateDocument = async () => {
    const document = await createDocument({
      repoUrl,
      branch,
      recursive,
      teamId: teamData?.id || '',
    });

    await router.push('/documents');
  };
  return (
    <AppLayout>
      <main>
        <section className="w-full max-w-2xl mx-auto py-20">
          <div className="bg-neutral-800 shadow sm:rounded-lg">
            <div className="p-5 py-5 space-y-5">
              <h3 className="text-base font-semibold leading-6 ">Add Github url</h3>
              <div className="mt-2 max-w-xl text-sm ">
                <p>Create document embedding from github url.</p>
              </div>
              <form className="space-y-5">
                <div>
                  <label htmlFor="repoUrl" className="sr-only">
                    Github url
                  </label>
                  <input
                    type="text"
                    name="repoUrl"
                    id="repoUrl"
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Repository url"
                  />
                </div>
                <div>
                  <label htmlFor="branch" className="sr-only">
                    Branch
                  </label>
                  <input
                    type="text"
                    name="branch"
                    id="branch"
                    onChange={(e) => setBranch(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Branch"
                  />
                </div>
                <div>
                  <label htmlFor="recursive" className="sr-only">
                    Recursive
                  </label>
                  <input
                    type="text"
                    name="recursive"
                    id="recursive"
                    onChange={(e) => setRecursive(e.target.value === 'true')}
                    className="block w-full rounded-md border-0 py-1.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Recursive true/false"
                  />
                </div>
                <Button
                  variant={ButtonVariant.Primary}
                  onClick={(event) => {
                    event.preventDefault();
                    void handleCreateDocument();
                  }}
                >
                  Embed Github
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default DocumentForm;
