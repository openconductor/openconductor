import { updateBlockSchema } from '@openconductor/api/src/schema/block';
import { useRouter } from 'next/router';
import FieldError from '~/components/shared/formError';
import { api } from '~/utils/api';
import { useZodForm } from '~/utils/form';

export default function BlockSettings({ blockId }: { blockId: string }) {
  const router = useRouter();
  const utils = api.useContext();
  const { data: block, isLoading } = api.block.byId.useQuery(blockId as string);
  const { data: agents } = api.agent.all.useQuery();

  const updateBlock = api.block.update.useMutation({
    onSuccess: async () => {
      await utils.block.invalidate();
    },
  });

  const { mutate: deleteBlock } = api.block.delete.useMutation({
    async onSuccess() {
      await utils.block.invalidate();
      router.push(`/workflows/${block?.workflowId}`);
    },
  });

  const methods = useZodForm({
    //@ts-ignore
    schema: updateBlockSchema,
    values: {
      blockId: block?.id,
      name: block?.name,
      input: block?.input,
      agentId: block?.agentId,
    },
  });

  console.log('agents', agents);

  if (!blockId || !block || isLoading || !agents) return <></>;

  return (
    <>
      <form
        onSubmit={methods.handleSubmit(async (values) => {
          console.log('onSubmit', values);
          await updateBlock.mutateAsync(values);
          methods.reset();
        })}
        className="space-y-2"
      >
        {/* Block name */}
        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5 ">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Name
            </label>
          </div>
          <div className="sm:col-span-2">
            <input
              id="name"
              {...methods.register('name')}
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {methods.formState.errors.name?.message && <FieldError error={methods.formState.errors.name} />}
          </div>
        </div>

        {/* Block input */}
        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Input
            </label>
          </div>
          <div className="sm:col-span-2">
            <textarea
              id="input"
              {...methods.register('input')}
              className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {methods.formState.errors.input?.message && <FieldError error={methods.formState.errors.input} />}
          </div>
        </div>

        {/* Block agent */}
        <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium leading-6 text-gray-900 sm:mt-1.5">
              Agent
            </label>
          </div>
          <div className="sm:col-span-2">
            <select
              className="agent w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              {...methods.register('agentId')}
              onChange={(e) => methods.setValue('select', e.target.value, { shouldValidate: true })} // Using setValue
            >
              <option value="">Choose an agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} - {agent.type}
                </option>
              ))}
            </select>
            {methods.formState.errors.agentId?.message && <FieldError error={methods.formState.errors.agentId} />}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => {
                deleteBlock(block.id);
              }}
            >
              Delete
            </button>
            <button
              type="submit"
              disabled={updateBlock.isLoading}
              className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
